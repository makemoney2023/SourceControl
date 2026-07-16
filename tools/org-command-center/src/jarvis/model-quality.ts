import type { HandoffRecord } from "../lib/types";

const GEN_PHASES = new Set(["11", "12", "15", "19"]);

export function assessHandoffModelQuality(
  handoff: HandoffRecord,
  expected: { llmTier: string; generationProfile: string } | undefined,
  phase: string,
): { ok: boolean; detail: string } {
  if (expected?.llmTier && handoff.llmTier && handoff.llmTier !== expected.llmTier) {
    return {
      ok: false,
      detail: `tier ${handoff.llmTier} ≠ expected ${expected.llmTier}`,
    };
  }
  if (GEN_PHASES.has(phase)) {
    const gp = (handoff.generationProfile || "").trim().toLowerCase();
    if (!gp || gp === "none") {
      return {
        ok: false,
        detail: `phase ${phase} requires generation_profile`,
      };
    }
  }
  if (
    String(handoff.fallbackApplied).toLowerCase() === "true" ||
    String(handoff.fallbackApplied).toLowerCase() === "yes"
  ) {
    return { ok: true, detail: "fallback_applied — review why" };
  }
  return { ok: true, detail: "ok" };
}
