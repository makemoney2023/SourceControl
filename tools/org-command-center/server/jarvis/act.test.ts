import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleJarvisAct, setExecuteIntentForTests } from "./act";
import { getAuditEvents, resetAuditForTests } from "./audit";
import { resetSessionForTests } from "./session";

const repo = "/tmp/jarvis-test-repo";

describe("handleJarvisAct", () => {
  beforeEach(() => {
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
    expect(execute).toHaveBeenCalledWith(repo, "spawn.run_next", pendingArgs);
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
});
