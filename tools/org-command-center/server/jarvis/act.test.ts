import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleJarvisAct, handleJarvisConfirm, setExecuteIntentForTests } from "./act";
import { getAuditEvents, resetAuditForTests } from "./audit";
import { resetSessionForTests } from "./session";

const BIZ_IDEA = "docs/projects/passive-grid/business-idea";
const FIXTURES = join(import.meta.dirname, "../../src/lib/fixtures");

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), "jarvis-act-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "skills/org"), { recursive: true });
  writeFileSync(
    join(root, "skills/org/ORG-REGISTRY.md"),
    readFileSync(join(FIXTURES, "sample-org-registry.md"), "utf8"),
  );
  writeFileSync(
    join(root, "skills/org/MODEL-REGISTRY.md"),
    readFileSync(join(FIXTURES, "sample-model-registry.md"), "utf8"),
  );
  mkdirSync(join(root, BIZ_IDEA, "DISPATCH"), { recursive: true });
  writeFileSync(
    join(root, BIZ_IDEA, "RUNBOOK-TRACKER.md"),
    readFileSync(join(FIXTURES, "sample-tracker.md"), "utf8"),
  );
  writeFileSync(
    join(root, "projects/registry.json"),
    JSON.stringify({
      active: "passive-grid",
      projects: {
        "passive-grid": {
          name: "Passive Grid",
          businessIdea: BIZ_IDEA,
          memory: "docs/projects/passive-grid/MEMORY",
        },
      },
    }),
  );
  return root;
}

let repo: string;

describe("handleJarvisAct", () => {
  beforeEach(() => {
    repo = tempRepo();
    resetSessionForTests();
    resetAuditForTests();
    setExecuteIntentForTests(async () => ({ spawned: true }));
  });

  afterEach(() => {
    resetSessionForTests();
    resetAuditForTests();
    setExecuteIntentForTests(undefined);
  });

  it("returns needs_confirm for spawn.run_next in ops without token", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
      mode: "ops",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.token).toBeTruthy();
    expect(r.summary).toBeTruthy();
  });

  it("returns needs_confirm for work.request in ops", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "work.request",
      args: { goal: "write a short blog article" },
      mode: "ops",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.summary).toMatch(/cmo/i);
    expect(r.summary).toMatch(/Cursor/i);
  });

  it("binds targetIc and require_inbox on work.request confirm", async () => {
    const execute = vi.fn(async () => ({ runId: "run-1" }));
    setExecuteIntentForTests(execute);

    const first = await handleJarvisAct(repo, "room-1", {
      intent: "work.request",
      args: { position: "copy-chief", goal: "Write landing page copy" },
      mode: "ops",
    });
    expect(first.status).toBe("needs_confirm");

    await handleJarvisAct(repo, "room-1", {
      intent: "work.request",
      args: {},
      mode: "ops",
      confirmToken: first.token,
    });

    expect(execute).toHaveBeenCalledWith(repo, "work.request", {
      position: "cmo",
      goal: expect.stringMatching(/landing page copy/i),
      phase: "2",
      targetIc: "copy-chief",
      require_inbox: true,
      roomId: "room-1",
    });
  });

  it("returns needs_confirm for spawn.run in ops without token", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run",
      args: { filename: "2-a.yaml" },
      mode: "ops",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.token).toBeTruthy();
  });

  it("executes after valid confirm", async () => {
    const execute = vi.fn(async () => ({ runId: "run-1" }));
    setExecuteIntentForTests(execute);

    const first = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
      mode: "ops",
    });
    const second = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
      mode: "ops",
      confirmToken: first.token,
    });
    expect(second.status).toBe("ok");
    expect(second.result).toEqual({ runId: "run-1" });
    expect(execute).toHaveBeenCalledOnce();
  });

  it("executes with token-bound args when confirm request args differ", async () => {
    const execute = vi.fn(async () => ({ runId: "run-1" }));
    setExecuteIntentForTests(execute);

    const pendingArgs = { seat: "research" };
    const first = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: pendingArgs,
      mode: "ops",
    });
    const second = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: { seat: "legal" },
      mode: "ops",
      confirmToken: first.token,
    });
    expect(second.status).toBe("ok");
    expect(execute).toHaveBeenCalledWith(repo, "spawn.run_next", {
      seat: "research",
      roomId: "room-1",
    });
  });

  it("denies spawn.run_next in briefing mode", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
    });
    expect(r.status).toBe("denied");
    expect(r.reason).toMatch(/ops/i);
  });

  it("defaults mode to briefing when omitted", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
    });
    expect(r.status).toBe("denied");
  });

  it("executes mission.get without confirm", async () => {
    const execute = vi.fn(async () => ({ mission: "test" }));
    setExecuteIntentForTests(execute);

    const r = await handleJarvisAct(repo, "room-1", {
      intent: "mission.get",
      args: {},
      mode: "briefing",
    });
    expect(r.status).toBe("ok");
    expect(r.result).toEqual({ mission: "test" });
    expect(execute).toHaveBeenCalledOnce();
  });

  it("rejects expired confirm token", async () => {
    vi.useFakeTimers();
    const first = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
      mode: "ops",
    });
    vi.advanceTimersByTime(61_000);
    const second = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
      mode: "ops",
      confirmToken: first.token,
    });
    expect(second.status).toBe("error");
    expect(second.reason).toMatch(/expired|invalid/i);
    vi.useRealTimers();
  });

  it("rejects reused confirm token", async () => {
    const first = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
      mode: "ops",
    });
    const second = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
      mode: "ops",
      confirmToken: first.token,
    });
    expect(second.status).toBe("ok");

    const third = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
      mode: "ops",
      confirmToken: first.token,
    });
    expect(third.status).toBe("error");
    expect(third.reason).toMatch(/invalid/i);
  });

  it("returns error for invalid intent", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "not.real",
      args: {},
      mode: "ops",
    });
    expect(r.status).toBe("error");
  });

  it("records audit events", async () => {
    await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
      mode: "ops",
    });
    const events = getAuditEvents();
    expect(events.some((e) => e.type === "jarvis_confirm_pending")).toBe(true);
  });

  it("venture.create confirm summary echoes name and slug", async () => {
    setExecuteIntentForTests(async () => ({ ok: true }));
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "venture.create",
      args: { name: "Grid Down Water", slug: "grid-down-water" },
      mode: "architect",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.summary).toMatch(/Grid Down Water/i);
    expect(r.summary).toMatch(/grid-down-water/);
    expect(r.summary).toMatch(/active/i);
  });

  it("dispatch.queue_for confirm summary echoes position and phase", async () => {
    setExecuteIntentForTests(async () => ({ ok: true }));
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "dispatch.queue_for",
      args: { position: "cfo", goal: "Review model", phase: "2" },
      mode: "ops",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.summary).toMatch(/cfo/i);
    expect(r.summary).toMatch(/phase 2/i);
  });

  it("dispatch.queue_for confirm summary resolves omitted phase from mission", async () => {
    setExecuteIntentForTests(async () => ({ ok: true }));
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "dispatch.queue_for",
      args: { position: "cfo", goal: "Review model" },
      mode: "ops",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.summary).toMatch(/cfo/i);
    expect(r.summary).toMatch(/phase 2/i);
    expect(r.summary).not.toMatch(/phase \?/i);
  });

  it("mode.set updates session; spawn.run_next needs confirm after ops", async () => {
    setExecuteIntentForTests(undefined);

    const denied = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
    });
    expect(denied.status).toBe("denied");

    const modeSet = await handleJarvisAct(repo, "room-1", {
      intent: "mode.set",
      args: { mode: "ops" },
    });
    expect(modeSet.status).toBe("ok");
    expect((modeSet.result as { mode: string }).mode).toBe("ops");

    const spawn = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
    });
    expect(spawn.status).toBe("needs_confirm");
    expect(spawn.token).toBeTruthy();
  });

  it("stores lastSummary on needs_confirm for session.repeat", async () => {
    const pending = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
      mode: "ops",
    });
    expect(pending.status).toBe("needs_confirm");
    expect(pending.summary).toBeTruthy();

    setExecuteIntentForTests(undefined);
    const repeat = await handleJarvisAct(repo, "room-1", {
      intent: "session.repeat",
      args: {},
    });
    expect(repeat.status).toBe("ok");
    expect((repeat.result as { summary: string }).summary).toBe(pending.summary);
  });

  it("stores lastSummary on ok for session.repeat", async () => {
    setExecuteIntentForTests(undefined);
    const ok = await handleJarvisAct(repo, "room-1", {
      intent: "mission.get",
      args: {},
    });
    expect(ok.status).toBe("ok");

    const repeat = await handleJarvisAct(repo, "room-1", {
      intent: "session.repeat",
      args: {},
    });
    expect(repeat.status).toBe("ok");
    expect((repeat.result as { summary: string }).summary).toMatch(/phase/i);
  });

  it("session.cancel_pending denied in briefing", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "session.cancel_pending",
      args: {},
    });
    expect(r.status).toBe("denied");
  });

  it("session.cancel_pending errors when nothing to cancel in ops", async () => {
    setExecuteIntentForTests(undefined);
    await handleJarvisAct(repo, "room-1", {
      intent: "mode.set",
      args: { mode: "ops" },
    });

    const r = await handleJarvisAct(repo, "room-1", {
      intent: "session.cancel_pending",
      args: {},
      mode: "ops",
    });
    expect(r.status).toBe("error");
    expect(r.reason).toMatch(/no pending confirmation/i);
    expect(r.summary).toBeUndefined();
  });

  it("uses runs.watch summary for voice ok response", async () => {
    setExecuteIntentForTests(async () => ({
      events: [{ type: "acceptance_failed" }],
      summary: "CEO finished with gaps: inbox.",
    }));
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "runs.watch",
      args: {},
    });
    expect(r.status).toBe("ok");
    expect(r.summary).toBe("CEO finished with gaps: inbox.");
  });

  it("uses blocker.list summary for voice ok response", async () => {
    setExecuteIntentForTests(async () => ({
      blocked: [{ slug: "market-research-analyst", reason: "no data" }],
      escalate: [],
      summary: "1 blocker: market research analyst — no data.",
    }));
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "blocker.list",
      args: {},
    });
    expect(r.status).toBe("ok");
    expect(r.summary).toBe("1 blocker: market research analyst — no data.");
  });

  it("uses brain.ask spoken for voice ok response", async () => {
    setExecuteIntentForTests(async () => ({
      ok: true,
      model: "grok-4.5",
      answer: "Prioritize the yield experiment this week.",
      spoken: "Prioritize the yield experiment this week.",
      status: "finished",
    }));
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "brain.ask",
      args: { prompt: "What should we prioritize?" },
    });
    expect(r.status).toBe("ok");
    expect(r.summary).toBe("Prioritize the yield experiment this week.");
  });

  it("dispatch.queue_batch confirm summary mentions batch count", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "dispatch.queue_batch",
      args: {
        items: [
          { position: "head-of-research", goal: "Market" },
          { position: "cfo", goal: "Burn" },
        ],
      },
      mode: "ops",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.summary).toMatch(/2 managers/i);
  });

  it("spawn.run_ready ok summary uses spoken partial result", async () => {
    setExecuteIntentForTests(async () => ({
      ok: true,
      started: [{ position: "head-of-research", runId: "run-1", filename: "2-a.yaml" }],
      skipped: [{ filename: "2-cfo.yaml", reason: "seat paused: cfo" }],
      spoken: "Started head of research; skipped cfo (seat paused: cfo).",
    }));
    const pending = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_ready",
      args: { filenames: ["2-a.yaml", "2-cfo.yaml"] },
      mode: "ops",
    });
    expect(pending.status).toBe("needs_confirm");
    const confirmed = await handleJarvisConfirm(repo, "room-1", pending.token!, true);
    expect(confirmed.status).toBe("ok");
    expect(confirmed.summary).toMatch(/Started head of research/i);
    expect(confirmed.summary).toMatch(/skipped/i);
  });
});
