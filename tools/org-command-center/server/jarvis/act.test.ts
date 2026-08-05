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

  it("work.request Phase 0 confirm summary names C-suite roundtable", async () => {
    const r = await handleJarvisAct(repo, "room-phase0", {
      intent: "work.request",
      args: {
        position: "ceo-strategist",
        goal: "Phase 0 Intake for new lemonade stand",
        phase: "0",
      },
      mode: "ops",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.summary).toMatch(/Phase 0 C-suite roundtable/i);
    expect(r.summary).toMatch(/CEO → peers → CEO merge/i);
  });

  it("work.request Phase 0 with wrong seat still confirms CEO roundtable", async () => {
    const r = await handleJarvisAct(repo, "room-phase0-wrong", {
      intent: "work.request",
      args: {
        position: "head-of-research",
        goal: "Restart 5 Phase 0",
        phase: "0",
      },
      mode: "ops",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.summary).toMatch(/Phase 0 C-suite roundtable/i);
    expect(r.summary).not.toMatch(/head-of-research/i);
  });

  it("repeat work.request with different args does not auto-confirm pending", async () => {
    vi.useFakeTimers();
    const execute = vi.fn(async () => ({ runId: "should-not-run" }));
    setExecuteIntentForTests(execute);

    const first = await handleJarvisAct(repo, "room-mismatch", {
      intent: "work.request",
      args: {
        position: "ceo-strategist",
        goal: "Phase 0 Intake",
        phase: "0",
      },
      mode: "ops",
    });
    expect(first.status).toBe("needs_confirm");

    vi.advanceTimersByTime(2500);
    const second = await handleJarvisAct(repo, "room-mismatch", {
      intent: "work.request",
      args: {
        position: "manager",
        goal: "head-of-research",
        phase: "0",
      },
      mode: "ops",
    });
    expect(second.status).toBe("needs_confirm");
    expect(second.summary).toMatch(/Phase 0 C-suite roundtable/i);
    expect(execute).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("returns the same needs_confirm when work.request is re-called within 2s", async () => {
    const first = await handleJarvisAct(repo, "room-1", {
      intent: "work.request",
      args: { position: "head-of-research", goal: "Resolve the blocker" },
      mode: "ops",
    });
    expect(first.status).toBe("needs_confirm");

    const second = await handleJarvisAct(repo, "room-1", {
      intent: "work.request",
      args: { position: "head-of-research", goal: "Resolve the blocker" },
      mode: "ops",
    });
    expect(second.status).toBe("needs_confirm");
    expect(second.token).toBe(first.token);
  });

  it("treats a later repeat work.request as confirm (voice yes loop)", async () => {
    vi.useFakeTimers();
    const execute = vi.fn(async () => ({
      runId: "1784309999999-head-of-research",
      position: "head-of-research",
    }));
    setExecuteIntentForTests(execute);

    const first = await handleJarvisAct(repo, "room-yes", {
      intent: "work.request",
      args: { position: "head-of-research", goal: "Kick off phase 2 market" },
      mode: "ops",
    });
    expect(first.status).toBe("needs_confirm");

    vi.advanceTimersByTime(2500);
    const second = await handleJarvisAct(repo, "room-yes", {
      intent: "work.request",
      args: { position: "head-of-research", goal: "Kick off phase 2 market" },
      mode: "ops",
    });
    expect(second.status).toBe("ok");
    expect(execute).toHaveBeenCalled();
    expect(second.summary).not.toMatch(/\d{10,}/);
    vi.useRealTimers();
  });

  it("recovers from invented confirmToken by consuming latest pending", async () => {
    const execute = vi.fn(async () => ({ runId: "run-recovered" }));
    setExecuteIntentForTests(execute);

    const first = await handleJarvisAct(repo, "room-1", {
      intent: "work.request",
      args: { position: "ceo-strategist", goal: "review project status" },
      mode: "ops",
    });
    expect(first.status).toBe("needs_confirm");

    const recovered = await handleJarvisAct(repo, "room-1", {
      intent: "work.request",
      args: {},
      mode: "ops",
      confirmToken: "token_123",
    });
    expect(recovered.status).toBe("ok");
    expect(execute).toHaveBeenCalled();
  });

  it("re-issues needs_confirm when fake token and no pending", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "work.request",
      args: { position: "cmo", goal: "draft launch plan" },
      mode: "ops",
      confirmToken: "token_123",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.token).toBeTruthy();
  });

  it("handleJarvisConfirm accepts without token via latest pending", async () => {
    const execute = vi.fn(async () => ({ runId: "run-yes" }));
    setExecuteIntentForTests(execute);

    const first = await handleJarvisAct(repo, "room-1", {
      intent: "work.request",
      args: { position: "ceo-strategist", goal: "status review" },
      mode: "ops",
    });
    expect(first.status).toBe("needs_confirm");

    const confirmed = await handleJarvisConfirm(repo, "room-1", "", true);
    expect(confirmed.status).toBe("ok");
    expect(execute).toHaveBeenCalled();
  });

  it("handleJarvisConfirm recovers from invented token", async () => {
    const execute = vi.fn(async () => ({ runId: "run-fake-tok" }));
    setExecuteIntentForTests(execute);

    await handleJarvisAct(repo, "room-1", {
      intent: "work.request",
      args: { position: "ceo-strategist", goal: "status review" },
      mode: "ops",
    });

    const confirmed = await handleJarvisConfirm(repo, "room-1", "token_123", true);
    expect(confirmed.status).toBe("ok");
    expect(execute).toHaveBeenCalled();
  });

  it("handleJarvisConfirm accept with no pending is a soft ok (already confirmed)", async () => {
    const execute = vi.fn(async () => ({ runId: "run-once" }));
    setExecuteIntentForTests(execute);

    const first = await handleJarvisAct(repo, "room-1", {
      intent: "work.request",
      args: { position: "ceo-strategist", goal: "status review" },
      mode: "ops",
    });
    expect(first.status).toBe("needs_confirm");
    await handleJarvisConfirm(repo, "room-1", "", true);
    expect(execute).toHaveBeenCalledTimes(1);

    const again = await handleJarvisConfirm(repo, "room-1", "queue head-of-research", true);
    expect(again.status).toBe("ok");
    expect(again.summary).toMatch(/already|nothing pending/i);
    expect(execute).toHaveBeenCalledTimes(1);
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

  it("keeps ops after set_mode even when client still sends briefing", async () => {
    setExecuteIntentForTests(async (root, intent, args) => {
      if (intent === "mode.set") {
        const { setRoomMode } = await import("./session");
        setRoomMode(String(args.roomId), "ops");
        return { ok: true, mode: "ops", previous: "briefing" };
      }
      return { runId: "run-stale-mode" };
    });

    await handleJarvisAct(repo, "room-1", {
      intent: "mode.set",
      args: { mode: "ops" },
      mode: "briefing",
    });

    const r = await handleJarvisAct(repo, "room-1", {
      intent: "work.request",
      args: { position: "cmo", goal: "ship campaign" },
      mode: "briefing",
    });
    expect(r.status).toBe("needs_confirm");
  });

  it("re-issues needs_confirm for expired confirm token", async () => {
    vi.useFakeTimers();
    const first = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
      mode: "ops",
    });
    vi.advanceTimersByTime(10 * 60_000 + 1);
    const second = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
      mode: "ops",
      confirmToken: first.token,
    });
    expect(second.status).toBe("needs_confirm");
    expect(second.token).toBeTruthy();
    expect(second.token).not.toBe(first.token);
    vi.useRealTimers();
  });

  it("re-issues needs_confirm for reused confirm token", async () => {
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
    expect(third.status).toBe("needs_confirm");
    expect(third.token).toBeTruthy();
    expect(third.token).not.toBe(first.token);
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

  it("uses brain.route spoken for voice ok response", async () => {
    setExecuteIntentForTests(async () => ({
      ok: true,
      model: "grok-4.5",
      intent: "clarify",
      clarifyQuestion: "Start Phase 1 framing now?",
      confidence: 0.9,
      spoken: "Start Phase 1 framing now?",
      status: "finished",
      latencyMs: 12,
    }));
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "brain.route",
      args: { utterance: "what are the next steps?" },
    });
    expect(r.status).toBe("ok");
    expect(r.summary).toBe("Start Phase 1 framing now?");
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

  it("work.request ok summary speaks seat started without numeric runId", async () => {
    setExecuteIntentForTests(async () => ({
      runId: "1784308096815-head-of-research",
      position: "head-of-research",
    }));

    const pending = await handleJarvisAct(repo, "room-1", {
      intent: "work.request",
      args: { position: "head-of-research", goal: "Resolve the blocker" },
      mode: "ops",
    });
    const confirmed = await handleJarvisConfirm(repo, "room-1", pending.token!, true);
    expect(confirmed.status).toBe("ok");
    expect(confirmed.summary).toMatch(/head of research started/i);
    expect(confirmed.summary).not.toMatch(/\d{10,}/);
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

  it("returns needs_confirm for seat.answer in ops", async () => {
    setExecuteIntentForTests(async () => ({ ok: true, spoken: "continued" }));
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "seat.answer",
      args: {
        seat: "head-of-research",
        answers: { "Which geography?": "Outer Banks" },
      },
      mode: "ops",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.summary).toMatch(/answer/i);
    expect(r.summary).toMatch(/head-of-research|Confirm\?/i);
  });

  it("seat.answer_draft executes without confirm in ops", async () => {
    setExecuteIntentForTests(async () => ({
      ok: true,
      spoken: "Saved. Next question: Budget?",
    }));
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "seat.answer_draft",
      args: { seat: "head-of-research", answer: "Outer Banks" },
      mode: "ops",
    });
    expect(r.status).toBe("ok");
    expect(r.summary).toMatch(/Saved|Next question/i);
  });

  it("returns needs_confirm for memory.note in ops", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "memory.note",
      args: { text: "MOF-303 is lead sorbent" },
      mode: "ops",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.summary).toMatch(/I'll remember:/i);
    expect(r.summary).toMatch(/MOF-303/);
  });

  it("denies memory.note in briefing", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "memory.note",
      args: { text: "Remember this" },
      mode: "briefing",
    });
    expect(r.status).toBe("denied");
    expect(r.reason).toMatch(/Ops/i);
  });

  it("uses memory.brief spoken for voice ok response", async () => {
    setExecuteIntentForTests(async () => ({
      spoken: "Next is finish evidence. Venture memory is still thin.",
      memoryThin: true,
      done: [],
      next: ["finish evidence"],
      blockers: [],
      suggestion: "Focus on finish evidence.",
      sources: ["mission"],
    }));
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "memory.brief",
      args: {},
      mode: "briefing",
    });
    expect(r.status).toBe("ok");
    expect(r.summary).toBe("Next is finish evidence. Venture memory is still thin.");
  });

  it("uses memory.recall summary for voice ok response", async () => {
    setExecuteIntentForTests(async () => ({
      hits: [{ text: "MOF-303 is lead sorbent", path: "docs/projects/a/MEMORY/notes.md", kind: "note" }],
      via: "grep",
      summary: "Found 1 match: MOF-303 is lead sorbent",
    }));
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "memory.recall",
      args: { query: "MOF sorbent" },
      mode: "briefing",
    });
    expect(r.status).toBe("ok");
    expect(r.summary).toBe("Found 1 match: MOF-303 is lead sorbent");
  });

  it("uses memory.note path for confirmed ok summary", async () => {
    setExecuteIntentForTests(async () => ({
      path: "docs/projects/passive-grid/MEMORY/notes.md",
      kind: "note",
      indexed: false,
    }));
    const pending = await handleJarvisAct(repo, "room-1", {
      intent: "memory.note",
      args: { text: "MOF-303 is lead sorbent" },
      mode: "ops",
    });
    expect(pending.status).toBe("needs_confirm");
    const confirmed = await handleJarvisAct(repo, "room-1", {
      intent: "memory.note",
      args: { text: "MOF-303 is lead sorbent" },
      mode: "ops",
      confirmToken: pending.token,
    });
    expect(confirmed.status).toBe("ok");
    expect(confirmed.summary).toBe("Saved to docs/projects/passive-grid/MEMORY/notes.md.");
  });

  it("returns needs_confirm for memory.digest in ops", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "memory.digest",
      args: { summary: "Wrapped evidence review." },
      mode: "ops",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.summary).toMatch(/Write a session digest for Passive Grid/i);
  });

  it("denies memory.digest in briefing", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "memory.digest",
      args: {},
      mode: "briefing",
    });
    expect(r.status).toBe("denied");
    expect(r.reason).toMatch(/Ops/i);
  });

  it("uses memory.digest spoken for confirmed ok summary", async () => {
    setExecuteIntentForTests(async () => ({
      path: "docs/projects/passive-grid/MEMORY/sessions/2026-07-17-1830.md",
      indexed: false,
      spoken: "Session digest saved to 2026-07-17-1830.md.",
    }));
    const pending = await handleJarvisAct(repo, "room-1", {
      intent: "memory.digest",
      args: { summary: "Done for today" },
      mode: "ops",
    });
    expect(pending.status).toBe("needs_confirm");
    const confirmed = await handleJarvisAct(repo, "room-1", {
      intent: "memory.digest",
      args: { summary: "Done for today" },
      mode: "ops",
      confirmToken: pending.token,
    });
    expect(confirmed.status).toBe("ok");
    expect(confirmed.summary).toBe("Session digest saved to 2026-07-17-1830.md.");
  });

  it("returns needs_confirm for memory.reindex in ops", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "memory.reindex",
      args: {},
      mode: "ops",
    });
    expect(r.status).toBe("needs_confirm");
    expect(r.summary).toMatch(/Rebuild memory index for Passive Grid/i);
  });

  it("denies memory.reindex in briefing", async () => {
    const r = await handleJarvisAct(repo, "room-1", {
      intent: "memory.reindex",
      args: {},
      mode: "briefing",
    });
    expect(r.status).toBe("denied");
    expect(r.reason).toMatch(/Ops/i);
  });

  it("uses memory.reindex count for confirmed ok summary", async () => {
    setExecuteIntentForTests(async () => ({ count: 12 }));
    const pending = await handleJarvisAct(repo, "room-1", {
      intent: "memory.reindex",
      args: {},
      mode: "ops",
    });
    expect(pending.status).toBe("needs_confirm");
    const confirmed = await handleJarvisAct(repo, "room-1", {
      intent: "memory.reindex",
      args: {},
      mode: "ops",
      confirmToken: pending.token,
    });
    expect(confirmed.status).toBe("ok");
    expect(confirmed.summary).toBe("Reindexed 12 memory chunks.");
  });
});
