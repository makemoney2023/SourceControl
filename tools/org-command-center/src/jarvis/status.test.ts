import { describe, expect, it } from "vitest";
import {
  deriveSeatVisualBehavior,
  isSeatDimmed,
  isTaskStatusCompleted,
} from "./status";

describe("isSeatDimmed", () => {
  it("keeps a selected seat visible in assign mode", () => {
    expect(
      isSeatDimmed({
        mode: "assign",
        isOwner: false,
        isGhost: false,
        isCeo: false,
        isSelected: true,
      }),
    ).toBe(false);
  });

  it("dims unrelated seats in assign mode", () => {
    expect(
      isSeatDimmed({
        mode: "assign",
        isOwner: false,
        isGhost: false,
        isCeo: false,
        isSelected: false,
      }),
    ).toBe(true);
  });
});

describe("deriveSeatVisualBehavior", () => {
  it("stops pulse and orbit motion when reduced motion is enabled", () => {
    expect(deriveSeatVisualBehavior("running", true)).toEqual({
      orbitSpeed: 0,
      pulses: false,
      cue: "RUNNING",
    });
  });

  it("provides persistent non-color cues for operational statuses", () => {
    expect(deriveSeatVisualBehavior("active", false).cue).toBe("ACTIVE");
    expect(deriveSeatVisualBehavior("running", false).cue).toBe("RUNNING");
    expect(deriveSeatVisualBehavior("blocked", false).cue).toBe("BLOCKED");
    expect(deriveSeatVisualBehavior("needs_input", false).cue).toBe("ANSWER");
    expect(deriveSeatVisualBehavior("escalate", false).cue).toBe("ESCALATE");
    expect(deriveSeatVisualBehavior("idle", false).cue).toBeNull();
  });
});

describe("seatStatus", () => {
  it("maps needs_input distinctly from blocked", async () => {
    const { seatStatus } = await import("./status");
    expect(
      seatStatus("market-research-analyst", [
        {
          position: "market-research-analyst",
          filename: "2-market-research-analyst.md",
          kind: "ic",
          status: "needs_input",
          verdictForManager: "",
          verdict: "",
        },
      ]).status,
    ).toBe("needs_input");
    expect(
      seatStatus("market-research-analyst", [
        {
          position: "market-research-analyst",
          filename: "2-market-research-analyst.md",
          kind: "ic",
          status: "blocked",
          verdictForManager: "",
          verdict: "",
        },
      ]).status,
    ).toBe("blocked");
  });

  it("treats open asks as needs_input even when status is done", async () => {
    const { seatStatus } = await import("./status");
    expect(
      seatStatus("market-research-analyst", [
        {
          position: "market-research-analyst",
          filename: "2-market-research-analyst.md",
          kind: "ic",
          status: "done",
          verdictForManager: "",
          verdict: "",
          asks: ["Confirm weekend vs weekday?"],
        },
      ]).status,
    ).toBe("needs_input");
  });

  it("keeps blocked when both blockers and asks are present", async () => {
    const { seatStatus } = await import("./status");
    expect(
      seatStatus("market-research-analyst", [
        {
          position: "market-research-analyst",
          filename: "2-market-research-analyst.md",
          kind: "ic",
          status: "blocked",
          verdictForManager: "",
          verdict: "",
          asks: ["budget?"],
        },
      ]).status,
    ).toBe("blocked");
  });
});

describe("isTaskStatusCompleted", () => {
  it.each(["done", "completed", "cancelled", " DONE "])(
    "treats %s as completed",
    (status) => {
      expect(isTaskStatusCompleted(status)).toBe(true);
    },
  );

  it("keeps active statuses searchable", () => {
    expect(isTaskStatusCompleted("in_flight")).toBe(false);
  });
});
