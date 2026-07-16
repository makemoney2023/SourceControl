import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleJarvisAct, setExecuteIntentForTests } from "./act";
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
});
