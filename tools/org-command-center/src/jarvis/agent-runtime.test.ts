import { describe, expect, it } from "vitest";
import type { RunRecord } from "../lib/runs";
import { deriveAgentRuntimeStatus } from "./agent-runtime";

const run = (partial: Partial<RunRecord>): RunRecord => ({
  runId: "r1",
  status: "running",
  position: "cto",
  phase: "1",
  claimed: "a.yaml",
  dispatch_filename: "a.yaml",
  wake_reason: "on_demand",
  started_at: "2026-07-16T12:00:00.000Z",
  llm_model: "x",
  ...partial,
});

describe("deriveAgentRuntimeStatus", () => {
  it("prefers paused over running", () => {
    expect(
      deriveAgentRuntimeStatus({
        slug: "cto",
        paused: true,
        latestRun: run({ status: "running" }),
        handoffs: [],
      }),
    ).toBe("paused");
  });

  it("prefers error over handoff idle", () => {
    expect(
      deriveAgentRuntimeStatus({
        slug: "cto",
        latestRun: run({ status: "error" }),
        handoffs: [],
      }),
    ).toBe("error");
  });

  it("returns running for in-flight run", () => {
    expect(
      deriveAgentRuntimeStatus({
        slug: "cto",
        latestRun: run({ status: "running" }),
        handoffs: [],
      }),
    ).toBe("running");
  });

  it("returns active when idle with no run", () => {
    expect(
      deriveAgentRuntimeStatus({
        slug: "cto",
        handoffs: [],
      }),
    ).toBe("active");
  });
});
