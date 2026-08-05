import { describe, expect, it } from "vitest";
import { seatWorkContext } from "./seat-work-context";

const handoff = (overrides: Record<string, string | string[]> = {}) => ({
  filename: "14-market-research-analyst.md",
  kind: "ic",
  phase: "14",
  position: "market-research-analyst",
  status: "",
  verdictForManager: "",
  verdict: "",
  ...overrides,
});

describe("seatWorkContext", () => {
  it("marks idle when no handoff, run, or session", () => {
    const ctx = seatWorkContext("market-research-analyst", {
      handoffs: [],
      runs: [],
      sessions: [],
      claimedFiles: [],
      queueFiles: [],
      agentStates: {},
    });
    expect(ctx.status).toBe("idle");
  });

  it("prefers live running over idle handoff absence", () => {
    const ctx = seatWorkContext("market-research-analyst", {
      handoffs: [],
      runs: [
        {
          runId: "r1",
          position: "market-research-analyst",
          status: "running",
          phase: "14",
          started_at: "2026-08-04T12:00:00Z",
          dispatch_filename: "14-mra.yaml",
        },
      ],
      sessions: [],
      claimedFiles: [],
      queueFiles: [],
      agentStates: {},
    });
    expect(ctx.status).toBe("running");
    expect(ctx.phase).toBe("14");
    expect(ctx.runId).toBe("r1");
  });

  it("blocked handoff beats live running", () => {
    const ctx = seatWorkContext("market-research-analyst", {
      handoffs: [
        handoff({
          status: "blocked",
          blockers: ["waiting on design brief"],
        }),
      ],
      runs: [
        {
          runId: "r1",
          position: "market-research-analyst",
          status: "running",
          phase: "14",
          started_at: "2026-08-04T12:00:00Z",
          dispatch_filename: "14-mra.yaml",
        },
      ],
      sessions: [],
      claimedFiles: [],
      queueFiles: [],
      agentStates: {},
    });
    expect(ctx.status).toBe("blocked");
    expect(ctx.blockReason).toBe("waiting on design brief");
  });

  it("paused agent state wins over running", () => {
    const ctx = seatWorkContext("market-research-analyst", {
      handoffs: [handoff({ status: "in_progress" })],
      runs: [
        {
          runId: "r1",
          position: "market-research-analyst",
          status: "running",
          phase: "14",
          started_at: "2026-08-04T12:00:00Z",
          dispatch_filename: "14-mra.yaml",
        },
      ],
      sessions: [],
      claimedFiles: [],
      queueFiles: [],
      agentStates: { "market-research-analyst": { paused: true } },
    });
    expect(ctx.status).toBe("paused");
  });

  it("does not treat an orphan claimed dispatch as running", () => {
    const ctx = seatWorkContext("head-of-research", {
      handoffs: [],
      runs: [],
      sessions: [],
      claimedFiles: ["14-head-of-research.yaml"],
      queueFiles: [],
      agentStates: {},
    });
    expect(ctx.status).toBe("idle");
  });

  it("ignores a completed historical session", () => {
    const ctx = seatWorkContext("head-of-research", {
      handoffs: [],
      runs: [],
      sessions: [
        {
          position: "head-of-research",
          status: "completed",
          phase: "14",
          updated_at: "2026-08-04T12:00:00Z",
          dispatch_filename: "14-head-of-research.yaml",
        },
      ],
      claimedFiles: [],
      queueFiles: [],
      agentStates: {},
    });

    expect(ctx.status).toBe("idle");
  });

  it("treats an active connected session as running", () => {
    const ctx = seatWorkContext("head-of-research", {
      handoffs: [],
      runs: [],
      sessions: [
        {
          position: "head-of-research",
          status: "connected",
          phase: "14",
          updated_at: "2026-08-04T12:00:00Z",
          dispatch_filename: "14-head-of-research.yaml",
        },
      ],
      claimedFiles: ["14-head-of-research.yaml"],
      queueFiles: [],
      agentStates: {},
    });

    expect(ctx.status).toBe("running");
    expect(ctx.phase).toBe("14");
  });

  it("treats the server active session status as running", () => {
    const ctx = seatWorkContext("head-of-research", {
      handoffs: [],
      runs: [],
      sessions: [
        {
          position: "head-of-research",
          status: "active",
          phase: "14",
          updated_at: "2026-08-04T12:00:00Z",
          dispatch_filename: "14-head-of-research.yaml",
        },
      ],
      claimedFiles: ["14-head-of-research.yaml"],
      queueFiles: [],
      agentStates: {},
    });

    expect(ctx.status).toBe("running");
  });

  it("defers a completed session to a done handoff", () => {
    const ctx = seatWorkContext("market-research-analyst", {
      handoffs: [handoff({ status: "done" })],
      runs: [],
      sessions: [
        {
          position: "market-research-analyst",
          status: "completed",
          phase: "14",
          updated_at: "2026-08-04T12:00:00Z",
          dispatch_filename: "14-market-research-analyst.yaml",
        },
      ],
      claimedFiles: ["14-market-research-analyst.yaml"],
      queueFiles: [],
      agentStates: {},
    });

    expect(ctx.status).toBe("done");
  });

  it("surfaces queue position when queued but not claimed", () => {
    const ctx = seatWorkContext("head-of-research", {
      handoffs: [],
      runs: [],
      sessions: [],
      claimedFiles: [],
      queueFiles: ["11-cto.yaml", "14-head-of-research.yaml"],
      agentStates: {},
    });
    expect(ctx.status).toBe("active");
    expect(ctx.queuePosition).toBe(2);
    expect(ctx.phase).toBe("14");
  });
});
