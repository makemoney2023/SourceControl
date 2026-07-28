import { normalizeCursorModelId } from "../../src/lib/cursor-models";
import { JarvisExecError } from "./errors";

export type BrainAskRuntime = {
  prompt: (
    prompt: string,
    opts: {
      apiKey: string;
      model: { id: string };
      local: { cwd: string };
    },
  ) => Promise<{ status?: string; result?: unknown }>;
};

export type BrainAskInput = {
  prompt: string;
  cwd: string;
  apiKey?: string | null;
  model?: string;
  runtime?: BrainAskRuntime;
};

export type BrainAskResult = {
  ok: true;
  model: string;
  answer: string;
  spoken: string;
  status: string;
};

const MAX_PROMPT_CHARS = 4000;
const MAX_SPOKEN_CHARS = 600;

export function defaultBrainModel(): string {
  return (process.env.JARVIS_BRAIN_MODEL || "grok-4.5").trim() || "grok-4.5";
}

function sanitizeSpoken(text: string): string {
  const plain = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[*_`#>-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= MAX_SPOKEN_CHARS) return plain;
  return `${plain.slice(0, MAX_SPOKEN_CHARS - 1).trimEnd()}…`;
}

function buildBrainPrompt(question: string): string {
  return [
    "You are Jarvis's deep-thinking advisor for a Situation Room operator.",
    "Answer the question below in 2–4 short spoken sentences of plain English.",
    "Do not edit files. Do not run tools. Do not use markdown, bullets, or code fences.",
    "If uncertain, say what is uncertain and the next best check.",
    "",
    "Question:",
    question.trim(),
  ].join("\n");
}

async function defaultRuntime(): Promise<BrainAskRuntime> {
  const { Agent } = await import("@cursor/sdk");
  return {
    prompt: (prompt, opts) => Agent.prompt(prompt, opts),
  };
}

export async function askBrain(input: BrainAskInput): Promise<BrainAskResult> {
  const question = String(input.prompt ?? "").trim();
  if (!question) {
    throw new JarvisExecError("prompt required", "missing_arg");
  }
  if (question.length > MAX_PROMPT_CHARS) {
    throw new JarvisExecError(
      `prompt too long (max ${MAX_PROMPT_CHARS} chars)`,
      "invalid_arg",
    );
  }

  const apiKey =
    input.apiKey !== undefined && input.apiKey !== null
      ? String(input.apiKey).trim()
      : (process.env.CURSOR_API_KEY || "").trim();
  if (!apiKey) {
    throw new JarvisExecError(
      "CURSOR_API_KEY missing — set it in repo .env.local for brain.ask",
      "missing_key",
    );
  }

  const model = normalizeCursorModelId(input.model || defaultBrainModel());
  const runtime = input.runtime ?? (await defaultRuntime());
  const result = await runtime.prompt(buildBrainPrompt(question), {
    apiKey,
    model: { id: model },
    local: { cwd: input.cwd },
  });

  const answer = String(result.result ?? "").trim();
  if (!answer) {
    throw new JarvisExecError("brain.ask returned an empty answer", "empty_answer");
  }

  const spoken = sanitizeSpoken(answer);
  return {
    ok: true,
    model,
    answer,
    spoken,
    status: String(result.status ?? "finished"),
  };
}
