import { describe, expect, it } from "vitest";
import type { HandoffRecord } from "../lib/types";
import { ackAlert, diffHandoffAlerts } from "./alerts";

const base: HandoffRecord = {
  filename: "2-ic.md",
  kind: "ic",
  phase: "2",
  position: "market-research-analyst",
  reportsTo: "head-of-research",
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
  body: "",
};

describe("diffHandoffAlerts", () => {
  it("cold start acks existing files", () => {
    const out = diffHandoffAlerts([], [base], "2026-07-16T12:00:00.000Z");
    expect(out[0]?.acked).toBe(true);
    expect(out[0]?.kind).toBe("new_handoff");
  });

  it("emits blocked and escalate", () => {
    const seeded = diffHandoffAlerts([], [base], "2026-07-16T12:00:00.000Z");
    const next = diffHandoffAlerts(
      seeded,
      [
        {
          ...base,
          status: "blocked",
          blockers: ["x"],
          recommendation: "escalate",
          escalationTags: ["spend"],
        },
      ],
      "2026-07-16T13:00:00.000Z",
    );
    expect(next.some((a) => a.kind === "blocked" && !a.acked)).toBe(true);
    expect(next.some((a) => a.kind === "escalate" && !a.acked)).toBe(true);
  });

  it("acks by id", () => {
    const a = diffHandoffAlerts(
      [
        {
          id: "blocked:2-ic.md:blocked",
          filename: "2-ic.md",
          slug: "x",
          phase: "2",
          kind: "blocked",
          createdAt: "t",
          acked: false,
        },
      ],
      [],
      "t",
    );
    const acked = ackAlert(a, "blocked:2-ic.md:blocked");
    expect(acked[0]?.acked).toBe(true);
  });
});
