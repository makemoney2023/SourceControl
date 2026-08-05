import { describe, expect, it } from "vitest";
import type { HandoffRecord, Tracker } from "../lib/types";
import { buildTasks } from "./tasks";

const tracker: Tracker = {
  idea: "Test",
  classification: "",
  mode: "",
  depth: "",
  currentPhase: "2",
  phases: [
    { phase: "1", name: "Frame", status: "✅", artifact: "", notes: "" },
    { phase: "2", name: "Market", status: "🔄", artifact: "", notes: "" },
    { phase: "3", name: "Strategy", status: "⬜", artifact: "", notes: "" },
  ],
  positions: [],
  raw: "",
};

describe("buildTasks", () => {
  it("orders blocked before pending and includes queue/claimed", () => {
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
        blockers: [],
        recommendation: "",
        escalationTags: [],
      },
    ];
    const tasks = buildTasks({
      tracker,
      handoffs,
      queueFiles: ["2-head-of-research-x.yaml"],
      claimedFiles: ["2-old.yaml"],
    });
    expect(tasks[0].status).toBe("blocked");
    const queued = tasks.find((t) => t.id.startsWith("dispatch:"));
    expect(queued?.canPlay).toBe(true);
    expect(queued?.dispatchFilename).toBe("2-head-of-research-x.yaml");
    expect(tasks.some((t) => t.id.startsWith("dispatch_claimed:"))).toBe(true);
    expect(tasks.some((t) => t.id === "phase:3" && t.status === "pending")).toBe(true);
  });

  it("gives unique review task ids when multiple manager briefs share a phase", () => {
    const handoffs: HandoffRecord[] = [
      {
        filename: "2-manager-ceo-strategist.md",
        kind: "manager",
        phase: "2",
        position: "ceo-strategist",
        reportsTo: "orchestrator",
        status: "blocked",
        verdictForManager: "",
        verdict: "",
        llmTier: "",
        generationProfile: "",
        fallbackApplied: "",
        artifacts: [],
        asks: [],
        blockers: ["misrouted"],
        recommendation: "escalate",
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
        recommendation: "",
        escalationTags: [],
      },
    ];
    const tasks = buildTasks({ tracker, handoffs, queueFiles: [], claimedFiles: [] });
    const reviewIds = tasks.filter((t) => t.id.startsWith("review:")).map((t) => t.id);
    expect(reviewIds.length).toBeGreaterThanOrEqual(2);
    expect(new Set(reviewIds).size).toBe(reviewIds.length);
  });

  it("marks claimed row canCancel when run is active", () => {
    const tasks = buildTasks({
      tracker,
      handoffs: [],
      queueFiles: [],
      claimedFiles: ["2-head-of-research-x.yaml"],
      runs: [
        {
          runId: "99-head-of-research",
          status: "running",
          position: "head-of-research",
          phase: "2",
          claimed: "2-head-of-research-x.yaml",
          dispatch_filename: "2-head-of-research-x.yaml",
          wake_reason: "on_demand",
          started_at: "2026-07-16T12:00:00.000Z",
          llm_model: "x",
        },
      ],
    });
    const row = tasks.find((t) => t.id === "dispatch_claimed:2-head-of-research-x.yaml");
    expect(row?.canCancel).toBe(true);
    expect(row?.runId).toBe("99-head-of-research");
  });

  it("marks a claimed dispatch in flight when its session is active", () => {
    const filename = "2-head-of-research-active.yaml";
    const tasks = buildTasks({
      tracker,
      handoffs: [],
      queueFiles: [],
      claimedFiles: [filename],
      sessions: [
        {
          agentId: "agent-active",
          position: "head-of-research",
          phase: "2",
          dispatch_filename: filename,
          updated_at: "2026-08-05T12:00:00.000Z",
          status: "active",
        },
      ],
    });

    expect(tasks.find((task) => task.dispatchFilename === filename)?.status).toBe("in_flight");
  });

  it("marks successful terminal claimed work done", () => {
    const sessionFilename = "2-head-of-research-session.yaml";
    const runFilename = "2-head-of-research-run.yaml";
    const tasks = buildTasks({
      tracker,
      handoffs: [],
      queueFiles: [],
      claimedFiles: [sessionFilename, runFilename],
      sessions: [
        {
          agentId: "agent-completed",
          position: "head-of-research",
          phase: "2",
          dispatch_filename: sessionFilename,
          updated_at: "2026-08-05T12:00:00.000Z",
          status: "completed",
        },
      ],
      runs: [
        {
          runId: "run-completed",
          status: "completed",
          position: "head-of-research",
          phase: "2",
          claimed: runFilename,
          dispatch_filename: runFilename,
          wake_reason: "on_demand",
          started_at: "2026-08-05T11:00:00.000Z",
          finished_at: "2026-08-05T12:00:00.000Z",
          llm_model: "x",
        },
      ],
    });

    expect(tasks.find((task) => task.dispatchFilename === sessionFilename)?.status).toBe("done");
    expect(tasks.find((task) => task.dispatchFilename === runFilename)?.status).toBe("done");
  });

  it.each(["error", "cancelled"] as const)(
    "keeps %s terminal claimed work pending and recoverable",
    (status) => {
      const filename = `2-head-of-research-${status}.yaml`;
      const tasks = buildTasks({
        tracker,
        handoffs: [],
        queueFiles: [],
        claimedFiles: [filename],
        sessions: [
          {
            agentId: `agent-${status}`,
            position: "head-of-research",
            phase: "2",
            dispatch_filename: filename,
            updated_at: "2026-08-05T12:00:00.000Z",
            status,
          },
        ],
      });

      const task = tasks.find((candidate) => candidate.dispatchFilename === filename);
      expect(task?.status).toBe("pending");
      expect(task?.canRewake).toBe(true);
    },
  );

  it("keeps an orphan claimed dispatch pending but not in flight", () => {
    const filename = "2-head-of-research-orphan.yaml";
    const tasks = buildTasks({
      tracker,
      handoffs: [],
      queueFiles: [],
      claimedFiles: [filename],
      sessions: [],
      runs: [],
    });

    const task = tasks.find((candidate) => candidate.dispatchFilename === filename);
    expect(task?.status).toBe("pending");
    expect(task?.canRewake).toBe(false);
    expect(task?.title).not.toMatch(/in-flight/i);
  });
});
