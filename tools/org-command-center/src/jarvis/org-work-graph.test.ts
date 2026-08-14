import { describe, expect, it } from "vitest";
import type { HandoffRecord, OrgRegistry } from "../lib/types";
import type { RunRecord } from "../lib/runs";
import { buildOrgWorkGraph, buildPortfolioWorkGraph } from "./org-work-graph";

const org: OrgRegistry = {
  roster: [
    {
      slug: "ceo-strategist",
      title: "CEO / Strategist",
      reportsTo: "",
      level: "manager",
      dept: "Executive",
    },
    {
      slug: "head-of-product",
      title: "Head of Product",
      reportsTo: "ceo-strategist",
      level: "manager",
      dept: "Product",
    },
    {
      slug: "business-analyst",
      title: "Business Analyst",
      reportsTo: "head-of-product",
      level: "ic",
      dept: "Product",
    },
    {
      slug: "cmo",
      title: "CMO",
      reportsTo: "ceo-strategist",
      level: "manager",
      dept: "Marketing",
    },
  ],
  phaseOwners: [
    {
      phase: "1",
      managerOwner: "head-of-product",
      maySpawn: ["business-analyst"],
      csuiteReviewer: "ceo-strategist",
      secondary: "",
      scorecard: "",
    },
  ],
};

function handoff(partial: Partial<HandoffRecord> & Pick<HandoffRecord, "filename">): HandoffRecord {
  return {
    kind: "ic",
    phase: "1",
    position: "business-analyst",
    reportsTo: "head-of-product",
    status: "done",
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

describe("buildOrgWorkGraph", () => {
  it("includes every roster seat even when idle", () => {
    const g = buildOrgWorkGraph({
      org,
      handoffs: [],
      runs: [],
      inbox: [],
    });
    const seats = g.nodes.filter((n) => n.kind === "seat");
    expect(seats.map((s) => s.id).sort()).toEqual([
      "seat:business-analyst",
      "seat:ceo-strategist",
      "seat:cmo",
      "seat:head-of-product",
    ]);
    expect(seats.find((s) => s.id === "seat:cmo")?.label).toBe("CMO");
  });

  it("wires reports-to, authored handoff, run, deliverable, artifact, and phase edges", () => {
    const runs: RunRecord[] = [
      {
        runId: "1-head-of-product",
        status: "completed",
        position: "head-of-product",
        phase: "1",
        claimed: "x.yaml",
        dispatch_filename: "x.yaml",
        wake_reason: "on_demand",
        started_at: "t",
        llm_model: "x",
      },
    ];
    const g = buildOrgWorkGraph({
      org,
      handoffs: [
        handoff({
          filename: "1-business-analyst.md",
          position: "business-analyst",
          artifacts: [{ path: "docs/projects/x/business-idea/05-prd.md", notes: "PRD" }],
        }),
      ],
      runs,
      inbox: [
        {
          filename: "1-head-of-product-deliverable.md",
          path: "REVIEW/inbox/1-head-of-product-deliverable.md",
          status: "ready",
          position: "head-of-product",
          phase: "1",
          mtimeMs: 1,
        },
      ],
    });

    expect(g.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "reports_to",
          from: "seat:head-of-product",
          to: "seat:ceo-strategist",
        }),
        expect.objectContaining({
          kind: "authored",
          from: "seat:business-analyst",
          to: "handoff:1-business-analyst.md",
        }),
        expect.objectContaining({
          kind: "executed",
          from: "seat:head-of-product",
          to: "run:1-head-of-product",
        }),
        expect.objectContaining({
          kind: "delivered",
          from: "seat:head-of-product",
          to: "deliverable:1-head-of-product-deliverable.md",
        }),
        expect.objectContaining({
          kind: "produced",
          from: "handoff:1-business-analyst.md",
          to: expect.stringMatching(/^artifact:/),
        }),
        expect.objectContaining({
          kind: "owns_phase",
          from: "seat:head-of-product",
          to: "phase:1",
        }),
      ]),
    );

    expect(g.legend.map((l) => l.kind)).toEqual(
      expect.arrayContaining(["seat", "handoff", "run", "deliverable", "artifact", "phase"]),
    );
    expect(g.stats.seatCount).toBe(4);
  });
});

describe("buildPortfolioWorkGraph", () => {
  it("lays out agency → customers → initiatives with active work expanded", () => {
    const work = buildOrgWorkGraph({ org, handoffs: [], runs: [], inbox: [] });
    const g = buildPortfolioWorkGraph({
      orgSlug: "velocity-agency",
      orgName: "Velocity Agency",
      initiatives: [
        {
          org: "velocity-agency",
          customer: "blacksage-kennels",
          customerName: "Blacksage Kennels",
          initiative: "main",
          initiativeName: "Main",
          isActive: true,
          workCount: 4,
          workGraph: work,
        },
        {
          org: "velocity-agency",
          customer: "blacksage-kennels",
          customerName: "Blacksage Kennels",
          initiative: "web-design",
          initiativeName: "Web Design",
          isActive: false,
          workCount: 2,
        },
        {
          org: "velocity-agency",
          customer: "passive-grid",
          customerName: "Passive Grid",
          initiative: "main",
          initiativeName: "Main",
          isActive: false,
          workCount: 0,
        },
      ],
    });

    expect(g.nodes.some((n) => n.kind === "agency" && n.label === "Velocity Agency")).toBe(true);
    expect(g.nodes.filter((n) => n.kind === "customer")).toHaveLength(2);
    expect(g.nodes.filter((n) => n.kind === "initiative")).toHaveLength(3);
    expect(g.nodes.some((n) => n.kind === "work_summary" && n.label.includes("2"))).toBe(true);
    expect(g.nodes.some((n) => n.kind === "seat")).toBe(true);
    expect(g.edges.some((e) => e.kind === "serves")).toBe(true);
    expect(g.edges.some((e) => e.kind === "owns")).toBe(true);
  });
});
