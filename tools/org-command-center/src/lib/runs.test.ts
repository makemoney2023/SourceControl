import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { listRuns } from "../../server/runs-fs";
import { assertBudgetAllowsSpawn, parseRunRecord, type WakeReason } from "./runs";
import type { ManagerPacket } from "./types";

const basePacket: ManagerPacket = {
  schema_version: 1,
  queued_at: "2026-07-16T14:00:00.000Z",
  phase: "2",
  position: "head-of-research",
  goal: "Research",
  report_to: "ceo-strategist",
  parent_position: "orchestrator",
  llm_tier: "strong-general",
  llm_model: "composer-2.5",
  generation_profile: "none",
  inputs: [],
  must_read: [],
  outputs: [],
  write_lease: [],
  budget_usd: null,
  collaborators: [],
  delegate_budget: 3,
  constraints: [],
  company_goal: "Test",
  parent_goal: "Phase 2",
  goal_path: ["Test", "Phase 2", "Research"],
};

describe("assertBudgetAllowsSpawn", () => {
  it("allows null or undefined budget", () => {
    expect(assertBudgetAllowsSpawn({ ...basePacket, budget_usd: null }).ok).toBe(true);
    expect(assertBudgetAllowsSpawn({ ...basePacket, budget_usd: undefined as never }).ok).toBe(
      true,
    );
  });

  it("allows positive budget", () => {
    expect(assertBudgetAllowsSpawn({ ...basePacket, budget_usd: 10 }).ok).toBe(true);
  });

  it("refuses zero or negative budget", () => {
    expect(assertBudgetAllowsSpawn({ ...basePacket, budget_usd: 0 })).toEqual({
      ok: false,
      error: "budget_usd hard-stop: 0",
    });
    expect(assertBudgetAllowsSpawn({ ...basePacket, budget_usd: -1 }).ok).toBe(false);
  });
});

describe("parseRunRecord / listRuns", () => {
  it("parses a run JSON record", () => {
    const wake: WakeReason = "run_next";
    const raw = {
      runId: "1-head-of-research",
      status: "running",
      position: "head-of-research",
      phase: "2",
      claimed: "2-head-of-research-20260716T140000Z.yaml",
      dispatch_filename: "2-head-of-research-20260716T140000Z.yaml",
      wake_reason: wake,
      started_at: "2026-07-16T14:00:00.000Z",
      llm_model: "composer-2.5",
    };
    const rec = parseRunRecord(raw);
    expect(rec.runId).toBe("1-head-of-research");
    expect(rec.wake_reason).toBe("run_next");
    expect(rec.dispatch_filename).toBe(raw.dispatch_filename);
    expect(rec.status).toBe("running");
  });

  it("lists runs newest-first from directory", () => {
    const root = mkdtempSync(join(tmpdir(), "runs-"));
    const runsDir = join(root, "runs");
    mkdirSync(runsDir, { recursive: true });
    writeFileSync(
      join(runsDir, "older.json"),
      JSON.stringify({
        runId: "older",
        status: "completed",
        position: "cmo",
        phase: "1",
        claimed: "a.yaml",
        dispatch_filename: "a.yaml",
        wake_reason: "on_demand",
        started_at: "2026-07-16T10:00:00.000Z",
        llm_model: "x",
      }),
    );
    writeFileSync(
      join(runsDir, "newer.json"),
      JSON.stringify({
        runId: "newer",
        status: "error",
        position: "cto",
        phase: "2",
        claimed: "b.yaml",
        dispatch_filename: "b.yaml",
        wake_reason: "chat",
        started_at: "2026-07-16T12:00:00.000Z",
        llm_model: "y",
        error: "boom",
      }),
    );
    const listed = listRuns(runsDir, 10);
    expect(listed[0].runId).toBe("newer");
    expect(listed[1].runId).toBe("older");
  });
});
