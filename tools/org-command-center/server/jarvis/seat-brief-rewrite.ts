import { createHash } from "node:crypto";
import { normalizeCursorModelId } from "../../src/lib/cursor-models";
import type { SeatBusinessBrief } from "../../src/lib/operator-summary";
import { stripOperatorProse } from "../../src/lib/operator-summary";
import { defaultBrainModel } from "./brain-ask";

export type SeatBriefRewriteRuntime = {
  prompt: (
    prompt: string,
    opts: {
      apiKey: string;
      model: { id: string };
      local: { cwd: string };
    },
  ) => Promise<{ status?: string; result?: unknown }>;
};

export type RewriteSeatBriefInput = {
  seatTitle: string;
  seatSlug: string;
  sourceMarkdown: string;
  fallback: SeatBusinessBrief;
  cwd: string;
  apiKey?: string | null;
  model?: string;
  runtime?: SeatBriefRewriteRuntime;
};

export type RewriteSeatBriefResult = {
  brief: SeatBusinessBrief;
  source: "grok" | "deterministic";
  model?: string;
  cached?: boolean;
};

const MAX_SOURCE_CHARS = 14000;
const MAX_LINE_CHARS = 480;
/** Bump when rewrite prompt/detail policy changes so stale thin caches are ignored. */
const BRIEF_PROMPT_VERSION = "v2-detailed";
const cache = new Map<string, SeatBusinessBrief>();

export function clearSeatBriefRewriteCacheForTests(): void {
  cache.clear();
}

export function briefCacheKey(seatSlug: string, sourceMarkdown: string): string {
  const hash = createHash("sha256").update(sourceMarkdown).digest("hex").slice(0, 16);
  return `${BRIEF_PROMPT_VERSION}:${seatSlug}:${hash}`;
}

function asStringList(v: unknown, max: number): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v) {
    if (typeof item !== "string") continue;
    const t = stripOperatorProse(item);
    if (t.length < 2) continue;
    out.push(t.length > MAX_LINE_CHARS ? `${t.slice(0, MAX_LINE_CHARS - 1).trimEnd()}…` : t);
    if (out.length >= max) break;
  }
  return out;
}

/** Parse Grok JSON (raw or fenced) into a SeatBusinessBrief. */
export function parseGrokSeatBriefJson(raw: string): SeatBusinessBrief | null {
  const text = String(raw ?? "").trim();
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const obj = JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
    const brief: SeatBusinessBrief = {
      whatHappened: asStringList(obj.whatHappened ?? obj.what_happened, 8),
      whyItMatters: asStringList(obj.whyItMatters ?? obj.why_it_matters, 8),
      nextSteps: asStringList(obj.nextSteps ?? obj.next_steps, 8),
      needsFromYou: asStringList(obj.needsFromYou ?? obj.needs_from_you, 10),
      whatsStuck: asStringList(obj.whatsStuck ?? obj.whats_stuck, 6),
    };
    const useful =
      brief.whatHappened.length +
        brief.whyItMatters.length +
        brief.nextSteps.length +
        brief.needsFromYou.length +
        brief.whatsStuck.length >
      0;
    return useful ? brief : null;
  } catch {
    return null;
  }
}

function buildRewritePrompt(input: {
  seatTitle: string;
  seatSlug: string;
  sourceMarkdown: string;
  fallback: SeatBusinessBrief;
}): string {
  const source = input.sourceMarkdown.slice(0, MAX_SOURCE_CHARS);
  return [
    "You rewrite Situation Room seat handoffs for a non-technical business operator.",
    `Seat: ${input.seatTitle} (${input.seatSlug}).`,
    "Return ONLY a JSON object with these string-array keys:",
    "whatHappened, whyItMatters, nextSteps, needsFromYou, whatsStuck.",
    "",
    "Goal: enough detail that someone outside the project can understand the story without reading the raw handoff.",
    "Write like a sharp COO briefing — specific names, decisions, tradeoffs, and consequences.",
    "",
    "Rules:",
    "- Plain business English. No markdown, tables, code fences, or internal ticket codes (Q1, D2, SD7, R3, M-04).",
    "- Do not invent facts, numbers, or decisions that are not in the source. If something is missing, say it is missing.",
    "- Prefer concrete detail over slogans. Include product/venture names, what was checked, what was rejected, and what is approved to proceed.",
    "- whatHappened: 4–8 items. Each item is 2–3 sentences (not a headline). Cover what the seat reviewed, what they concluded, and what they produced or recommended.",
    "- whyItMatters: 4–8 items. Each explains business impact — money, launch, brand risk, trust, timeline, or dependency on another seat.",
    "- nextSteps: 4–8 ordered actions. Name who should act (operator, CEO, creative, eng, …) and what “done” looks like.",
    "- needsFromYou: every real operator decision or fact still needed. Phrase as clear questions with enough context that the operator knows why you are asking. Drop process lines like peer help: none.",
    "- whatsStuck: up to 6 items. Explain the blocker and the consequence if it stays open.",
    "- Thin one-liners are a failure. Expand from the source until a stranger could act.",
    "",
    "Source material:",
    source || "(empty)",
    "",
    "Noisy extracted scraps (improve; do not copy jargon):",
    JSON.stringify(input.fallback),
  ].join("\n");
}

async function defaultRuntime(): Promise<SeatBriefRewriteRuntime> {
  const { Agent } = await import("@cursor/sdk");
  return {
    prompt: (prompt, opts) => Agent.prompt(prompt, opts),
  };
}

export function defaultSeatBriefModel(): string {
  return (
    (process.env.JARVIS_SEAT_BRIEF_MODEL || process.env.JARVIS_BRAIN_MODEL || defaultBrainModel())
      .trim() || "grok-4.5"
  );
}

/**
 * Always rewrite seat business briefs with Cursor Grok (included with Cursor via SDK).
 * Caches by seat + source hash so identical opens skip a round-trip.
 */
export async function rewriteSeatBusinessBrief(
  input: RewriteSeatBriefInput,
): Promise<RewriteSeatBriefResult> {
  const key = briefCacheKey(input.seatSlug, input.sourceMarkdown);
  const cached = cache.get(key);
  if (cached) {
    return { brief: cached, source: "grok", cached: true, model: defaultSeatBriefModel() };
  }

  const apiKey =
    input.apiKey !== undefined && input.apiKey !== null
      ? String(input.apiKey).trim()
      : (process.env.CURSOR_API_KEY || "").trim();
  if (!apiKey) {
    return { brief: input.fallback, source: "deterministic" };
  }

  try {
    const model = normalizeCursorModelId(input.model || defaultSeatBriefModel());
    const runtime = input.runtime ?? (await defaultRuntime());
    const result = await runtime.prompt(
      buildRewritePrompt({
        seatTitle: input.seatTitle,
        seatSlug: input.seatSlug,
        sourceMarkdown: input.sourceMarkdown,
        fallback: input.fallback,
      }),
      {
        apiKey,
        model: { id: model },
        local: { cwd: input.cwd },
      },
    );
    const parsed = parseGrokSeatBriefJson(String(result.result ?? ""));
    if (!parsed) {
      return { brief: input.fallback, source: "deterministic", model };
    }
    cache.set(key, parsed);
    return { brief: parsed, source: "grok", model, cached: false };
  } catch {
    return { brief: input.fallback, source: "deterministic" };
  }
}

export function mergeBriefIntoReport<
  T extends {
    businessBrief: SeatBusinessBrief;
    summary: string;
    openQuestions: string[];
    upwardAsks: string[];
    upwardBlockers: string[];
  },
>(report: T, rewrite: RewriteSeatBriefResult): T & { briefSource: "grok" | "deterministic" } {
  const applied = rewrite.source === "grok" ? rewrite.brief : report.businessBrief;
  const summary = applied.whatHappened.join(" ").slice(0, 480) || report.summary;
  return {
    ...report,
    businessBrief: applied,
    summary,
    openQuestions:
      applied.needsFromYou.length > 0 ? applied.needsFromYou : report.openQuestions,
    upwardAsks:
      applied.needsFromYou.length > 0 ? applied.needsFromYou : report.upwardAsks,
    upwardBlockers:
      applied.whatsStuck.length > 0 ? applied.whatsStuck : report.upwardBlockers,
    briefSource: rewrite.source,
  };
}

function narrativeSourceForRewrite(args: {
  handoffBody?: string;
  deliverableMarkdown?: string;
  asks: string[];
  blockers: string[];
}): string {
  return [
    args.deliverableMarkdown?.trim() ?? "",
    args.handoffBody?.trim() ?? "",
    args.asks.length ? `## Asks\n${args.asks.map((a) => `- ${a}`).join("\n")}` : "",
    args.blockers.length
      ? `## Risks / blockers\n${args.blockers.map((b) => `- ${b}`).join("\n")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export async function enrichSeatReportWithGrokBrief<
  T extends {
    slug: string;
    title: string;
    businessBrief: SeatBusinessBrief;
    summary: string;
    openQuestions: string[];
    upwardAsks: string[];
    upwardBlockers: string[];
    ownHandoffs: Array<{ filename: string }>;
  },
>(
  report: T,
  opts: {
    cwd: string;
    handoffBody?: string;
    deliverableMarkdown?: string;
    asks?: string[];
    blockers?: string[];
    apiKey?: string | null;
    runtime?: SeatBriefRewriteRuntime;
  },
): Promise<T & { briefSource: "grok" | "deterministic" }> {
  const sourceMarkdown = narrativeSourceForRewrite({
    handoffBody: opts.handoffBody,
    deliverableMarkdown: opts.deliverableMarkdown,
    asks: opts.asks ?? report.upwardAsks,
    blockers: opts.blockers ?? report.upwardBlockers,
  });
  const rewrite = await rewriteSeatBusinessBrief({
    seatTitle: report.title,
    seatSlug: report.slug,
    sourceMarkdown: sourceMarkdown || report.summary || report.slug,
    fallback: report.businessBrief,
    cwd: opts.cwd,
    apiKey: opts.apiKey,
    runtime: opts.runtime,
  });
  return mergeBriefIntoReport(report, rewrite);
}
