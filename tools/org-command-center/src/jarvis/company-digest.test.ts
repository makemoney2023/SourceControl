import { describe, expect, it } from "vitest";
import type { HandoffRecord, OrgRegistry, Tracker } from "../lib/types";
import { buildCompanyDigest } from "./company-digest";

const org: OrgRegistry = {
  roster: [
    {
      slug: "ceo-strategist",
      title: "CEO",
      reportsTo: "",
      level: "manager",
      dept: "exec",
    },
    {
      slug: "head-of-research",
      title: "HoR",
      reportsTo: "ceo-strategist",
      level: "manager",
      dept: "research",
    },
    {
      slug: "market-research-analyst",
      title: "MRA",
      reportsTo: "head-of-research",
      level: "ic",
      dept: "research",
    },
  ],
  phaseOwners: [
    {
      phase: "2",
      managerOwner: "head-of-research",
      maySpawn: ["market-research-analyst"],
      csuiteReviewer: "ceo-strategist",
      secondary: "",
      scorecard: "",
    },
  ],
};

const tracker: Tracker = {
  idea: "X",
  classification: "",
  mode: "",
  depth: "",
  currentPhase: "2",
  phases: [{ phase: "2", name: "E", status: "🔄", artifact: "", notes: "" }],
  positions: [],
  raw: "",
};

describe("buildCompanyDigest", () => {
  it("counts blocked, escalate, queue", () => {
    const handoffs: HandoffRecord[] = [
      {
        filename: "2-market-research-analyst.md",
        kind: "ic",
        phase: "2",
        position: "market-research-analyst",
        reportsTo: "head-of-research",
        status: "blocked",
        verdictForManager: "",
        verdict: "",
        llmTier: "",
        generationProfile: "",
        fallbackApplied: "",
        artifacts: [],
        asks: [],
        blockers: ["no data"],
        recommendation: "",
        escalationTags: [],
      },
      {
        filename: "2-manager-head-of-research.md",
        kind: "manager",
        phase: "2",
        position: "head-of-research",
        reportsTo: "ceo-strategist",
        status: "ready_for_csuite",
        verdictForManager: "ready_to_merge",
        verdict: "",
        llmTier: "",
        generationProfile: "",
        fallbackApplied: "",
        artifacts: [],
        asks: [],
        blockers: [],
        recommendation: "escalate",
        escalationTags: ["evidence"],
      },
    ];
    const d = buildCompanyDigest({
      org,
      tracker,
      handoffs,
      queueFiles: ["2-x.yaml"],
      claimedFiles: [],
      runs: [],
      briefings: [],
    });
    expect(d.blockedSeats.length).toBe(1);
    expect(d.escalateSeats.length).toBe(1);
    expect(d.queueDepth).toBe(1);
    expect(d.awaitingCsuite).toContain("2");
    expect(d.ceoNext.length).toBeGreaterThan(0);
  });
});
