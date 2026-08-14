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
        icsSpawned: [],
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
        icsSpawned: [],
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
    expect(d.blockedSeats[0]).toMatchObject({
      slug: "market-research-analyst",
      title: "MRA",
      phase: "2",
      status: "blocked",
      statusLabel: "Stuck",
      reasons: ["no data"],
      handoffFilename: "2-market-research-analyst.md",
      managerSlug: "head-of-research",
    });
    expect(d.escalateSeats.length).toBe(1);
    expect(d.queueDepth).toBe(1);
    expect(d.awaitingCsuite).toContain("2");
    expect(d.ceoNext.length).toBeGreaterThan(0);
  });

  it("surfaces open asks as needs_input even when status is done", () => {
    const handoffs: HandoffRecord[] = [
      {
        filename: "2-market-research-analyst.md",
        kind: "ic",
        phase: "2",
        position: "market-research-analyst",
        icsSpawned: [],
        reportsTo: "head-of-research",
        status: "done",
        verdictForManager: "",
        verdict: "",
        llmTier: "",
        generationProfile: "",
        fallbackApplied: "",
        artifacts: [],
        asks: ["Confirm weekend vs weekday events?"],
        blockers: [],
        recommendation: "",
        escalationTags: [],
      },
    ];
    const d = buildCompanyDigest({
      org,
      tracker,
      handoffs,
      queueFiles: [],
      claimedFiles: [],
      runs: [],
      briefings: [],
    });
    expect(d.blockedSeats).toHaveLength(1);
    expect(d.blockedSeats[0]).toMatchObject({
      slug: "market-research-analyst",
      title: "MRA",
      status: "needs_input",
      statusLabel: "Needs your input",
      reason: "Confirm weekend vs weekday events?",
      headline: "Confirm weekend vs weekday events?",
    });
  });

  it("drops process noise asks and humanizes threat copy", () => {
    const handoffs: HandoffRecord[] = [
      {
        filename: "2-market-research-analyst.md",
        kind: "ic",
        phase: "2",
        position: "market-research-analyst",
        icsSpawned: [],
        reportsTo: "head-of-research",
        status: "done",
        verdictForManager: "",
        verdict: "",
        llmTier: "",
        generationProfile: "",
        fallbackApplied: "",
        artifacts: [],
        asks: ["Peer help needed: none", "Clarification needed: none"],
        blockers: [],
        recommendation: "",
        escalationTags: [],
      },
      {
        filename: "2-ceo-strategist.md",
        kind: "csuite",
        phase: "2",
        position: "ceo-strategist",
        icsSpawned: [],
        reportsTo: "",
        status: "needs_input",
        verdictForManager: "",
        verdict: "",
        llmTier: "",
        generationProfile: "",
        fallbackApplied: "",
        artifacts: [],
        asks: ["Peer help needed: none", "Approve weekend markets?"],
        blockers: ["D2 missing brief | High | wait on ops"],
        recommendation: "",
        escalationTags: [],
      },
    ];
    const d = buildCompanyDigest({
      org,
      tracker,
      handoffs,
      queueFiles: [],
      claimedFiles: [],
      runs: [],
      briefings: [],
    });
    expect(d.blockedSeats.map((b) => b.slug)).toEqual(["ceo-strategist"]);
    expect(d.blockedSeats[0]).toMatchObject({
      title: "CEO",
      status: "needs_input",
      statusLabel: "Needs your input",
    });
    expect(d.blockedSeats[0]?.reasons.join(" ")).not.toMatch(/peer help/i);
    expect(d.blockedSeats[0]?.reasons.some((r) => /weekend markets/i.test(r))).toBe(
      true,
    );
    expect(d.blockedSeats[0]?.headline).toBeTruthy();
  });

  it("includes all blockers and asks in reasons", () => {
    const handoffs: HandoffRecord[] = [
      {
        filename: "2-market-research-analyst.md",
        kind: "ic",
        phase: "2",
        position: "market-research-analyst",
        icsSpawned: [],
        reportsTo: "head-of-research",
        status: "needs_input",
        verdictForManager: "",
        verdict: "",
        llmTier: "",
        generationProfile: "",
        fallbackApplied: "",
        artifacts: [],
        asks: ["Confirm budget ceiling?"],
        blockers: ["missing brief", "no reference shortlist"],
        recommendation: "",
        escalationTags: [],
      },
    ];
    const d = buildCompanyDigest({
      org,
      tracker,
      handoffs,
      queueFiles: [],
      claimedFiles: [],
      runs: [],
      briefings: [],
    });
    expect(d.blockedSeats[0]?.reasons).toEqual([
      "missing brief",
      "no reference shortlist",
      "Confirm budget ceiling?",
    ]);
    expect(d.blockedSeats[0]?.reason).toBe("missing brief");
    expect(d.blockedSeats[0]?.headline).toBe("missing brief");
  });
});
