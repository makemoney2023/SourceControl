import { describe, expect, it } from "vitest";
import type { HandoffRecord, OrgRegistry, Tracker } from "../lib/types";
import { buildSeatReport } from "./seat-report";

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
      title: "Head of Research",
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
      scorecard: "Evidence quality",
    },
  ],
};

const tracker: Tracker = {
  idea: "TestCo",
  classification: "",
  mode: "",
  depth: "",
  currentPhase: "2",
  phases: [{ phase: "2", name: "Evidence", status: "🔄", artifact: "", notes: "" }],
  positions: [],
  raw: "",
};

function handoff(
  partial: Partial<HandoffRecord> & Pick<HandoffRecord, "filename" | "kind" | "position">,
): HandoffRecord {
  return {
    phase: "2",
    reportsTo: "",
    status: "",
    verdictForManager: "",
    verdict: "",
    llmTier: "",
    generationProfile: "",
    fallbackApplied: "",
    artifacts: [],
    asks: [],
    blockers: [],
    recommendation: "",
    escalationTags: [],
    ...partial,
  };
}

describe("buildSeatReport", () => {
  it("CEO gets csuite + run_next actions", () => {
    const report = buildSeatReport({
      slug: "ceo-strategist",
      org,
      tracker,
      handoffs: [
        handoff({
          filename: "2-manager-head-of-research.md",
          kind: "manager",
          position: "head-of-research",
          status: "ready_for_csuite",
          verdictForManager: "ready_to_merge",
        }),
      ],
      queueFiles: ["2-head-of-research-20260716T140000Z.yaml"],
      claimedFiles: [],
      runs: [],
      briefings: [],
    });
    expect(report?.role).toBe("ceo");
    expect(report?.nextActions.some((a) => a.kind === "run_next")).toBe(true);
    expect(report?.nextActions.some((a) => a.cta === "draft_csuite")).toBe(true);
    expect(report?.nextActions.some((a) => a.actor === "human")).toBe(true);
  });

  it("CEO surfaces escalation secondaries", () => {
    const report = buildSeatReport({
      slug: "ceo-strategist",
      org,
      tracker,
      handoffs: [
        handoff({
          filename: "2-manager-head-of-research.md",
          kind: "manager",
          position: "head-of-research",
          recommendation: "escalate",
          escalationTags: ["evidence"],
        }),
      ],
      queueFiles: [],
      claimedFiles: [],
      runs: [],
      briefings: [],
    });
    expect(report?.escalations[0]?.secondaries).toContain("head-of-research");
    expect(
      report?.nextActions.some(
        (a) => a.actor === "human" && /escalat|secondary|Route/i.test(a.label),
      ),
    ).toBe(true);
  });

  it("manager awaits missing IC handoff", () => {
    const report = buildSeatReport({
      slug: "head-of-research",
      org,
      tracker,
      handoffs: [],
      queueFiles: [],
      claimedFiles: [],
      runs: [],
      briefings: [],
    });
    expect(report?.role).toBe("manager");
    expect(report?.nextActions.some((a) => a.kind === "await_ic")).toBe(true);
  });

  it("IC prompts complete_handoff when no handoff file", () => {
    const report = buildSeatReport({
      slug: "market-research-analyst",
      org,
      tracker,
      handoffs: [],
      queueFiles: [],
      claimedFiles: [],
      runs: [],
      briefings: [],
    });
    expect(report?.role).toBe("ic");
    expect(report?.nextActions[0]?.kind).toBe("complete_handoff");
  });

  it("includes live runs and missing artifacts", () => {
    const report = buildSeatReport({
      slug: "market-research-analyst",
      org,
      tracker,
      handoffs: [
        handoff({
          filename: "2-market-research-analyst.md",
          kind: "ic",
          position: "market-research-analyst",
          status: "done",
          artifacts: [{ path: "docs/missing.md", notes: "" }],
        }),
      ],
      queueFiles: [],
      claimedFiles: [],
      runs: [
        {
          runId: "r1",
          status: "running",
          position: "market-research-analyst",
          phase: "2",
          claimed: "x.yaml",
          dispatch_filename: "x.yaml",
          wake_reason: "run_next",
          started_at: "2026-07-16T12:00:00.000Z",
          llm_model: "x",
        },
      ],
      briefings: [],
      repoRoot: "/repo",
      exists: () => false,
    });
    expect(report?.liveRuns[0]?.status).toBe("running");
    expect(report?.artifacts[0]?.exists).toBe(false);
    expect(report?.nextActions.some((a) => a.cta === "open_runs")).toBe(true);
  });

  it("returns null for unknown slug", () => {
    expect(
      buildSeatReport({
        slug: "nope",
        org,
        tracker,
        handoffs: [],
        queueFiles: [],
        claimedFiles: [],
        runs: [],
        briefings: [],
      }),
    ).toBeNull();
  });
});
