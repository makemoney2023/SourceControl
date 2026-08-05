import { createHash } from "node:crypto";
import type { BlockedSeatDigest } from "../../src/jarvis/company-digest";
import { normalizeCursorModelId } from "../../src/lib/cursor-models";
import { stripOperatorProse } from "../../src/lib/operator-summary";
import { defaultBrainModel } from "./brain-ask";

export type ThreatBriefRewriteRuntime = {
  prompt: (
    prompt: string,
    opts: {
      apiKey: string;
      model: { id: string };
      local: { cwd: string };
    },
  ) => Promise<{ status?: string; result?: unknown }>;
};

export type GrokThreatLine = {
  slug: string;
  headline: string;
  detail: string;
};

const MAX_LINE_CHARS = 220;
/** Bump when rewrite prompt policy changes. */
const THREAT_PROMPT_VERSION = "v1-threat-rail";
const cache = new Map<string, GrokThreatLine[]>();
const inflight = new Map<string, Promise<GrokThreatLine[] | null>>();

export type ThreatBriefEnrichMode = "await" | "cached-or-background";

export function clearThreatBriefRewriteCacheForTests(): void {
  cache.clear();
  inflight.clear();
}

export function threatCacheKey(blocked: BlockedSeatDigest[]): string {
  const payload = blocked
    .map((b) =>
      [b.slug, b.status, b.reason, ...b.reasons].join("|"),
    )
    .join("\n");
  const hash = createHash("sha256").update(payload).digest("hex").slice(0, 16);
  return `${THREAT_PROMPT_VERSION}:${hash}`;
}

function clipLine(text: string, max = MAX_LINE_CHARS): string {
  const t = stripOperatorProse(text);
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

/** Parse Grok JSON (raw or fenced) into threat rewrite lines. */
export function parseGrokThreatBriefJson(raw: string): GrokThreatLine[] | null {
  const text = String(raw ?? "").trim();
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const obj = JSON.parse(candidate.slice(start, end + 1)) as {
      threats?: unknown;
    };
    if (!Array.isArray(obj.threats)) return null;
    const out: GrokThreatLine[] = [];
    for (const item of obj.threats) {
      if (!item || typeof item !== "object") continue;
      const row = item as Record<string, unknown>;
      const slug = typeof row.slug === "string" ? row.slug.trim() : "";
      const headline =
        typeof row.headline === "string" ? clipLine(row.headline, 160) : "";
      const detail =
        typeof row.detail === "string" ? clipLine(row.detail, MAX_LINE_CHARS) : "";
      if (!slug || !headline) continue;
      out.push({ slug, headline, detail });
    }
    return out.length > 0 ? out : null;
  } catch {
    return null;
  }
}

function buildThreatRewritePrompt(blocked: BlockedSeatDigest[]): string {
  const source = blocked.map((b) => ({
    slug: b.slug,
    title: b.title,
    status: b.status,
    statusLabel: b.statusLabel,
    reasons: b.reasons,
  }));
  return [
    "You rewrite Situation Room threat-rail items for a non-technical business operator.",
    "Return ONLY a JSON object: { \"threats\": [ { \"slug\", \"headline\", \"detail\" } ] }.",
    "Include one object per input seat (same slug). Do not invent seats.",
    "",
    "Rules:",
    "- Plain business English. No markdown, tables, code, or internal ticket codes (Q1, D2, SD7).",
    "- headline: one crisp sentence — the decision needed or why work is stuck.",
    "- detail: one short supporting sentence with consequence or context. Empty string if nothing useful.",
    "- Do not invent facts. Improve clarity from the given reasons only.",
    "- Drop process noise like peer help: none.",
    "",
    "Input threats:",
    JSON.stringify(source),
  ].join("\n");
}

async function defaultRuntime(): Promise<ThreatBriefRewriteRuntime> {
  const { Agent } = await import("@cursor/sdk");
  return {
    prompt: (prompt, opts) => Agent.prompt(prompt, opts),
  };
}

export function defaultThreatBriefModel(): string {
  return (
    (
      process.env.JARVIS_THREAT_BRIEF_MODEL ||
      process.env.JARVIS_SEAT_BRIEF_MODEL ||
      process.env.JARVIS_BRAIN_MODEL ||
      defaultBrainModel()
    ).trim() || "grok-4.5"
  );
}

function applyThreatRewrites(
  blocked: BlockedSeatDigest[],
  rewrites: GrokThreatLine[],
): BlockedSeatDigest[] {
  const bySlug = new Map(rewrites.map((r) => [r.slug, r]));
  return blocked.map((b) => {
    const hit = bySlug.get(b.slug);
    if (!hit) return b;
    const reasons = [hit.headline, hit.detail]
      .map((x) => x.trim())
      .filter(Boolean);
    const unique = reasons.filter(
      (r, i, arr) =>
        arr.findIndex((x) => x.toLowerCase() === r.toLowerCase()) === i,
    );
    return {
      ...b,
      headline: hit.headline,
      reason: hit.headline,
      reasons: unique.length > 0 ? unique : b.reasons,
    };
  });
}

async function runThreatRewrite(
  blocked: BlockedSeatDigest[],
  opts: {
    cwd: string;
    apiKey: string;
    model?: string;
    runtime?: ThreatBriefRewriteRuntime;
  },
): Promise<GrokThreatLine[] | null> {
  const model = normalizeCursorModelId(opts.model || defaultThreatBriefModel());
  const runtime = opts.runtime ?? (await defaultRuntime());
  const result = await runtime.prompt(buildThreatRewritePrompt(blocked), {
    apiKey: opts.apiKey,
    model: { id: model },
    local: { cwd: opts.cwd },
  });
  const parsed = parseGrokThreatBriefJson(String(result.result ?? ""));
  return parsed;
}

/**
 * Batch-rewrite threat rail copy with Cursor Grok (same CURSOR_API_KEY as seat briefs).
 * Caches by digest content hash.
 * `cached-or-background` returns immediately so the Situation Room never waits on Grok.
 */
export async function enrichBlockedSeatsWithGrok(
  blocked: BlockedSeatDigest[],
  opts: {
    cwd: string;
    apiKey?: string | null;
    model?: string;
    runtime?: ThreatBriefRewriteRuntime;
    mode?: ThreatBriefEnrichMode;
  },
): Promise<{
  blockedSeats: BlockedSeatDigest[];
  source: "grok" | "deterministic";
  model?: string;
  cached?: boolean;
  enriching?: boolean;
}> {
  if (blocked.length === 0) {
    return { blockedSeats: blocked, source: "deterministic" };
  }

  const key = threatCacheKey(blocked);
  const cached = cache.get(key);
  if (cached) {
    return {
      blockedSeats: applyThreatRewrites(blocked, cached),
      source: "grok",
      cached: true,
      model: defaultThreatBriefModel(),
      enriching: false,
    };
  }

  const apiKey =
    opts.apiKey !== undefined && opts.apiKey !== null
      ? String(opts.apiKey).trim()
      : (process.env.CURSOR_API_KEY || "").trim();
  if (!apiKey) {
    return { blockedSeats: blocked, source: "deterministic" };
  }

  const mode = opts.mode ?? "await";
  let pending = inflight.get(key);
  if (!pending) {
    pending = runThreatRewrite(blocked, {
      cwd: opts.cwd,
      apiKey,
      model: opts.model,
      runtime: opts.runtime,
    })
      .then((parsed) => {
        if (parsed) cache.set(key, parsed);
        return parsed;
      })
      .catch(() => null)
      .finally(() => {
        inflight.delete(key);
      });
    inflight.set(key, pending);
  }

  if (mode === "cached-or-background") {
    void pending;
    return {
      blockedSeats: blocked,
      source: "deterministic",
      enriching: true,
      model: defaultThreatBriefModel(),
    };
  }

  try {
    const parsed = await pending;
    if (!parsed) {
      return { blockedSeats: blocked, source: "deterministic" };
    }
    return {
      blockedSeats: applyThreatRewrites(blocked, parsed),
      source: "grok",
      model: defaultThreatBriefModel(),
      cached: false,
      enriching: false,
    };
  } catch {
    return { blockedSeats: blocked, source: "deterministic" };
  }
}
