import { describe, expect, it } from "vitest";
import type { HandoffRecord } from "../lib/types";
import { assessHandoffModelQuality } from "./model-quality";

function h(partial: Partial<HandoffRecord>): HandoffRecord {
  return {
    filename: "x.md",
    kind: "ic",
    phase: "2",
    position: "market-research-analyst",
    reportsTo: "head-of-research",
    status: "done",
    verdictForManager: "",
    verdict: "",
    llmTier: "strong-general",
    generationProfile: "none",
    fallbackApplied: "false",
    artifacts: [],
    asks: [],
    blockers: [],
    recommendation: "",
    escalationTags: [],
    productionStatus: "",
    productionPaths: [],
    wireOwner: "",
    skipReason: "",
    designBriefPath: "",
    photorealQa: "",
    wireChecklistPath: "",
    licenseBasis: "",
    generationUsed: "",
    happyPathSpec: "",
    happyPathStatus: "",
    body: "",
    ...partial,
  };
}

describe("assessHandoffModelQuality", () => {
  it("fails on wrong tier", () => {
    const r = assessHandoffModelQuality(
      h({ llmTier: "fast" }),
      { llmTier: "strong-general", generationProfile: "none" },
      "2",
    );
    expect(r.ok).toBe(false);
  });

  it("passes matching tier", () => {
    const r = assessHandoffModelQuality(
      h({ llmTier: "strong-general" }),
      { llmTier: "strong-general", generationProfile: "none" },
      "2",
    );
    expect(r.ok).toBe(true);
  });

  it("fails gen phase missing profile", () => {
    const r = assessHandoffModelQuality(
      h({ phase: "11", generationProfile: "none" }),
      { llmTier: "strong-general", generationProfile: "hero-video" },
      "11",
    );
    expect(r.ok).toBe(false);
  });

  it("fails when handoff tier does not match registry", () => {
    expect(
      assessHandoffModelQuality(
        h({ llmTier: "fast-ops", generationProfile: "none", fallbackApplied: "false" }),
        { llmTier: "creative-language", generationProfile: "none" },
        "6",
      ).ok,
    ).toBe(false);
  });

  it("fails when creative-language seat set fallback_applied true", () => {
    expect(
      assessHandoffModelQuality(
        h({
          llmTier: "creative-language",
          generationProfile: "none",
          fallbackApplied: "true",
        }),
        { llmTier: "creative-language", generationProfile: "none" },
        "6",
      ).ok,
    ).toBe(false);
  });

  it("fails when frontier-reasoning seat set fallback_applied true", () => {
    expect(
      assessHandoffModelQuality(
        h({
          llmTier: "frontier-reasoning",
          generationProfile: "none",
          fallbackApplied: "true",
        }),
        { llmTier: "frontier-reasoning", generationProfile: "none" },
        "6",
      ).ok,
    ).toBe(false);
  });
});
