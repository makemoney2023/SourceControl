import { normalizeCursorModelId } from "../../src/lib/cursor-models";
import { defaultBrainModel, type BrainAskRuntime } from "./brain-ask";
import { JarvisExecError } from "./errors";

export const BRAIN_ROUTE_INTENTS = [
  "clarify",
  "status",
  "proceed",
  "phase0_restart",
  "blockers",
  "spawn",
  "other",
] as const;

export type BrainRouteIntent = (typeof BRAIN_ROUTE_INTENTS)[number];

export type BrainRoutePayload = {
  intent: BrainRouteIntent;
  clarifyQuestion?: string;
  spokenHint?: string;
  confidence: number;
};

export type BrainRouteInput = {
  utterance: string;
  spokenBrief?: string;
  cwd: string;
  apiKey?: string | null;
  model?: string;
  runtime?: BrainAskRuntime;
  timeoutMs?: number;
};

export type BrainRouteResult = {
  ok: true;
  model: string;
  intent: BrainRouteIntent;
  clarifyQuestion?: string;
  spokenHint?: string;
  confidence: number;
  /** Best line to speak for clarify / hint; empty for tool-only intents. */
  spoken: string;
  status: string;
  latencyMs: number;
};

const MAX_UTTERANCE = 1000;
const MAX_BRIEF = 400;
const DEFAULT_TIMEOUT_MS = 20_000;
const INTENT_SET = new Set<string>(BRAIN_ROUTE_INTENTS);

function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new JarvisExecError("brain.route returned empty payload", "empty_answer");
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    // ignore — try fence / substring
  }
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) {
    return JSON.parse(fence[1].trim());
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return JSON.parse(trimmed.slice(start, end + 1));
  }
  throw new JarvisExecError("brain.route response was not valid JSON", "invalid_route");
}

export function parseBrainRoutePayload(raw: string): BrainRoutePayload {
  const data = extractJsonObject(raw);
  if (!data || typeof data !== "object") {
    throw new JarvisExecError("brain.route JSON must be an object", "invalid_route");
  }
  const obj = data as Record<string, unknown>;
  const intentRaw = String(obj.intent ?? "").trim();
  if (!INTENT_SET.has(intentRaw)) {
    throw new JarvisExecError(
      `brain.route invalid intent: ${intentRaw || "(missing)"}`,
      "invalid_route",
    );
  }
  const intent = intentRaw as BrainRouteIntent;
  const confidence = Number(obj.confidence);
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    throw new JarvisExecError("brain.route confidence must be 0..1", "invalid_route");
  }
  const clarifyQuestion =
    typeof obj.clarifyQuestion === "string" ? obj.clarifyQuestion.trim() : undefined;
  const spokenHint =
    typeof obj.spokenHint === "string" ? obj.spokenHint.trim() : undefined;
  if (intent === "clarify" && !clarifyQuestion) {
    throw new JarvisExecError(
      "brain.route clarify requires clarifyQuestion",
      "invalid_route",
    );
  }
  return { intent, confidence, clarifyQuestion, spokenHint };
}

function buildRoutePrompt(utterance: string, spokenBrief: string): string {
  return [
    "You are Jarvis's voice intent router for a Situation Room operator.",
    "Classify the operator utterance given the mission brief.",
    "Return ONLY a single JSON object — no markdown, no prose outside JSON.",
    "Schema:",
    '{ "intent": "clarify"|"status"|"proceed"|"phase0_restart"|"blockers"|"spawn"|"other",',
    '  "clarifyQuestion"?: string, "spokenHint"?: string, "confidence": number }',
    "",
    "Intent meanings:",
    '- status: ask for findings, result, verdict, "where are we", "what are the next steps" (list only).',
    '- proceed: commit to advance work ("we\'re doing the next steps", start Phase 1, move forward).',
    "- clarify: ambiguous between tell-me vs do-it, or a required detail is missing (city/events).",
    "- phase0_restart: explicitly restart Phase 0 / C-suite roundtable / intake.",
    "- blockers: ask what is blocked.",
    "- spawn: want a new seat/worker (not Phase 0/1 framing).",
    "- other: anything else (small talk, unclear).",
    "",
    "Rules:",
    "- Prefer clarify when next-steps could mean list vs execute.",
    "- Never invent CFO/CMO findings; status will be answered by tools.",
    "- Never claim a run finished; never invent Confirm tokens.",
    "- clarifyQuestion: one short spoken question, plain English.",
    "- confidence is 0..1.",
    "",
    "Mission brief (may be truncated):",
    spokenBrief || "(none)",
    "",
    "Operator utterance:",
    utterance,
  ].join("\n");
}

function spokenFromRoute(route: BrainRoutePayload): string {
  if (route.intent === "clarify" && route.clarifyQuestion) {
    return route.clarifyQuestion;
  }
  return route.spokenHint?.trim() || "";
}

async function defaultRuntime(): Promise<BrainAskRuntime> {
  const { Agent } = await import("@cursor/sdk");
  return {
    prompt: (prompt, opts) => Agent.prompt(prompt, opts),
  };
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => {
      reject(new JarvisExecError(`${label} timed out after ${ms}ms`, "timeout"));
    }, ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

export async function routeBrain(input: BrainRouteInput): Promise<BrainRouteResult> {
  const utterance = String(input.utterance ?? "").trim();
  if (!utterance) {
    throw new JarvisExecError("utterance required", "missing_arg");
  }
  if (utterance.length > MAX_UTTERANCE) {
    throw new JarvisExecError(
      `utterance too long (max ${MAX_UTTERANCE} chars)`,
      "invalid_arg",
    );
  }

  const apiKey =
    input.apiKey !== undefined && input.apiKey !== null
      ? String(input.apiKey).trim()
      : (process.env.CURSOR_API_KEY || "").trim();
  if (!apiKey) {
    throw new JarvisExecError(
      "CURSOR_API_KEY missing — set it in repo .env.local for brain.route",
      "missing_key",
    );
  }

  const brief = String(input.spokenBrief ?? "")
    .trim()
    .slice(0, MAX_BRIEF);
  const model = normalizeCursorModelId(input.model || defaultBrainModel());
  const runtime = input.runtime ?? (await defaultRuntime());
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const started = Date.now();

  const result = await withTimeout(
    runtime.prompt(buildRoutePrompt(utterance, brief), {
      apiKey,
      model: { id: model },
      local: { cwd: input.cwd },
    }),
    timeoutMs,
    "brain.route",
  );

  const raw = String(result.result ?? "").trim();
  if (!raw) {
    throw new JarvisExecError("brain.route returned an empty answer", "empty_answer");
  }

  const route = parseBrainRoutePayload(raw);
  return {
    ok: true,
    model,
    intent: route.intent,
    clarifyQuestion: route.clarifyQuestion,
    spokenHint: route.spokenHint,
    confidence: route.confidence,
    spoken: spokenFromRoute(route),
    status: String(result.status ?? "finished"),
    latencyMs: Date.now() - started,
  };
}
