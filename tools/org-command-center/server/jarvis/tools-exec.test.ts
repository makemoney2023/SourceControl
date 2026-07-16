import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import YAML from "yaml";
import type { ManagerPacket } from "../src/lib/types";
import { clearRunRegistry } from "../run-registry";
import type { RuntimeAdapter } from "../runtime-adapter";
import { handleJarvisAct, handleJarvisConfirm } from "./act";
import { resetSessionForTests } from "./session";
import { buildJarvisContext } from "./briefing";
import { executeIntent, JarvisExecError } from "./tools-exec";
import { readActivityTail } from "../activity";
import { saveAlerts } from "../alerts-fs";
import { dispatchRoot } from "../paths";
import { writeRoutine } from "../routines";
import { JARVIS_INTENTS, type JarvisIntent } from "./intents";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "../../src/lib/fixtures");
const BIZ_IDEA = "docs/projects/passive-grid/business-idea";

const packet: ManagerPacket = {
  schema_version: 1,
  queued_at: "2026-07-16T14:00:00.000Z",
  phase: "2",
  position: "head-of-research",
  goal: "Research",
  report_to: "ceo-strategist",
  parent_position: "orchestrator",
  llm_tier: "strong-general",
  llm_model: "claude-sonnet-5",
  generation_profile: "none",
  inputs: [],
  must_read: [],
  outputs: [],
  write_lease: [],
  budget_usd: null,
  collaborators: [],
  delegate_budget: 3,
  constraints: [],
  company_goal: "Test company",
  parent_goal: "Phase 2 — Market",
  goal_path: ["Test company", "Phase 2 — Market", "Research"],
};

const okAdapter: RuntimeAdapter = {
  async run() {
    return { status: "completed", result: "done" };
  },
};

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), "jarvis-exec-"));
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
  const idea = join(root, BIZ_IDEA);
  mkdirSync(join(idea, "DISPATCH/queue"), { recursive: true });
  mkdirSync(join(idea, "DISPATCH/claimed"), { recursive: true });
  mkdirSync(join(idea, "DISPATCH/runs"), { recursive: true });
  mkdirSync(join(idea, "HANDOFFS"), { recursive: true });
  writeFileSync(join(idea, "RUNBOOK-TRACKER.md"), readFileSync(join(FIXTURES, "sample-tracker.md"), "utf8"));
  return root;
}

function dispatchDir(repoRoot: string) {
  return join(repoRoot, BIZ_IDEA, "DISPATCH");
}

function enqueue(repoRoot: string, p: ManagerPacket, name: string) {
  writeFileSync(join(dispatchDir(repoRoot), "queue", name), YAML.stringify(p));
}

type CoverageCase = {
  intent: JarvisIntent;
  args: Record<string, unknown>;
  seed?: (repoRoot: string) => void;
  expectThrow?: RegExp;
};

/** UI↔voice checklist + full JARVIS_INTENTS — minimal valid args per intent. */
const INTENT_COVERAGE: CoverageCase[] = [
  { intent: "mission.get", args: {} },
  { intent: "digest.get", args: {} },
  { intent: "seat.report", args: { slug: "ceo-strategist" } },
  { intent: "tasks.list", args: {} },
  { intent: "runs.list", args: {} },
  { intent: "runs.get", args: { runId: "missing-run" }, expectThrow: /not found/i },
  { intent: "activity.list", args: {} },
  { intent: "alerts.list", args: {} },
  { intent: "spend.get", args: {} },
  {
    intent: "dispatch.queue",
    args: {
      phase: "2",
      position: "head-of-research",
      goal: "Run market research",
      llm_tier: "strong-general",
    },
  },
  {
    intent: "alerts.ack",
    args: { id: "blocked:test-handoff.yaml:blocked" },
    seed(repoRoot) {
      saveAlerts(dispatchDir(repoRoot), [
        {
          id: "blocked:test-handoff.yaml:blocked",
          filename: "test-handoff.yaml",
          slug: "head-of-research",
          phase: "2",
          kind: "blocked",
          createdAt: "2026-07-16T12:00:00.000Z",
          acked: false,
        },
      ]);
    },
  },
  {
    intent: "routine.enable",
    args: { id: "daily-pulse", enabled: true },
    seed(repoRoot) {
      writeRoutine(dispatchDir(repoRoot), {
        id: "daily-pulse",
        enabled: false,
        cron: "0 9 * * *",
        action: "enqueue",
        phase: "2",
        position: "head-of-research",
        goal: "Daily pulse",
      });
    },
  },
  {
    intent: "routine.list",
    args: {},
    seed(repoRoot) {
      writeRoutine(dispatchDir(repoRoot), {
        id: "daily-pulse",
        enabled: true,
        cron: "0 9 * * *",
        action: "enqueue",
        phase: "2",
        position: "head-of-research",
        goal: "Daily pulse",
      });
    },
  },
  {
    intent: "routine.disable",
    args: { id: "daily-pulse" },
    seed(repoRoot) {
      writeRoutine(dispatchDir(repoRoot), {
        id: "daily-pulse",
        enabled: true,
        cron: "0 9 * * *",
        action: "enqueue",
        phase: "2",
        position: "head-of-research",
        goal: "Daily pulse",
      });
    },
  },
  { intent: "spawn.run_next", args: { apiKey: null } },
  { intent: "spawn.run", args: { filename: "2-a.yaml", apiKey: null } },
  { intent: "run.cancel", args: { runId: "missing-run" } },
  { intent: "run.rewake", args: { apiKey: null } },
  { intent: "agent.pause", args: { slug: "head-of-research" } },
  { intent: "agent.resume", args: { slug: "head-of-research" } },
  { intent: "csuite.draft", args: { phase: "2" } },
  { intent: "file.read", args: { path: `${BIZ_IDEA}/RUNBOOK-TRACKER.md` } },
  { intent: "mode.set", args: { mode: "ops", roomId: "coverage-room" } },
  { intent: "venture.list", args: {} },
  { intent: "venture.get", args: {} },
  { intent: "venture.slugify", args: { name: "Solar Lantern" } },
  {
    intent: "venture.create",
    args: { name: "Coverage Venture Alpha" },
  },
  { intent: "venture.switch", args: { slug: "passive-grid" } },
  { intent: "agent.spawn_ic", args: {}, expectThrow: /forbidden/i },
  { intent: "seat.who_owns", args: { phase: "2" } },
  {
    intent: "dispatch.preview",
    args: { position: "head-of-research", goal: "Preview market research" },
  },
  {
    intent: "dispatch.queue_for",
    args: { position: "cfo", goal: "Review financial model", phase: "2" },
  },
  { intent: "dispatch.list", args: {} },
  {
    intent: "delegate.plan",
    args: { position: "head-of-research", goal: "Plan IC delegation" },
  },
  { intent: "session.help", args: {} },
  { intent: "session.repeat", args: { roomId: "coverage-room" }, expectThrow: /nothing to repeat/i },
  {
    intent: "session.cancel_pending",
    args: { roomId: "coverage-room" },
    expectThrow: /no pending confirmation/i,
  },
  { intent: "jarvis.ping", args: {} },
  { intent: "handoff.list", args: { phase: "2" } },
  { intent: "briefing.pin", args: { mode: "seat", slug: "ceo-strategist" } },
  { intent: "phase.list_open", args: {} },
  { intent: "digest.focus", args: { section: "blocked" } },
  { intent: "activity.tail", args: { n: 5 } },
];

describe("intent coverage checklist", () => {
  let repo = "";

  afterEach(() => {
    if (repo) rmSync(repo, { recursive: true, force: true });
    clearRunRegistry();
    resetSessionForTests();
  });

  it("covers every JARVIS_INTENTS entry", () => {
    const covered = new Set(INTENT_COVERAGE.map((c) => c.intent));
    for (const intent of JARVIS_INTENTS) {
      expect(covered.has(intent)).toBe(true);
    }
  });

  it.each(INTENT_COVERAGE.map((c) => [c.intent, c] as const))(
    "%s executes without uncaught throw on fixture repo",
    async (intent, spec) => {
      repo = tempRepo();
      spec.seed?.(repo);
      if (spec.expectThrow) {
        await expect(executeIntent(repo, intent, spec.args)).rejects.toThrow(spec.expectThrow);
        return;
      }
      let result: unknown;
      try {
        result = await executeIntent(repo, intent, spec.args);
      } catch (e) {
        throw new Error(
          `${intent} threw unexpectedly: ${e instanceof JarvisExecError ? e.message : String(e)}`,
          { cause: e },
        );
      }
      expect(result).toBeDefined();
    },
  );
});

describe("executeIntent", () => {
  let repo = "";

  afterEach(() => {
    if (repo) rmSync(repo, { recursive: true, force: true });
    clearRunRegistry();
    resetSessionForTests();
  });

  it("mission.get returns snapshot mission", async () => {
    repo = tempRepo();
    const result = await executeIntent(repo, "mission.get", {});
    expect(result).toMatchObject({
      mission: expect.objectContaining({
        idea: "Test Widget",
        currentPhase: "2",
      }),
    });
  });

  it("digest.get returns company digest", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "digest.get", {})) as {
      digest: { queueDepth: number };
    };
    expect(result.digest.queueDepth).toBe(0);
  });

  it("seat.report returns report for known seat", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "seat.report", { slug: "ceo-strategist" })) as {
      report: { slug: string };
    };
    expect(result.report.slug).toBe("ceo-strategist");
  });

  it("read intents append jarvis.focus activity", async () => {
    repo = tempRepo();
    const droot = dispatchRoot(repo);

    await executeIntent(repo, "mission.get", {});
    let activity = readActivityTail(droot, 5);
    expect(activity[0]).toMatchObject({ type: "jarvis.focus", phase: "2" });

    await executeIntent(repo, "seat.report", { slug: "ceo-strategist" });
    activity = readActivityTail(droot, 5);
    expect(activity[0]).toMatchObject({
      type: "jarvis.focus",
      slug: "ceo-strategist",
    });

    await executeIntent(repo, "digest.get", {});
    activity = readActivityTail(droot, 5);
    expect(activity[0]).toMatchObject({ type: "jarvis.focus" });
    expect(activity[0].slug).toBeUndefined();
  });

  it("dispatch.queue validates manager-only rules", async () => {
    repo = tempRepo();
    await expect(
      executeIntent(repo, "dispatch.queue", {
        phase: "2",
        position: "cmo",
        goal: "Wrong owner",
        llm_tier: "frontier-reasoning",
      }),
    ).rejects.toThrow(/owner/i);
  });

  it("dispatch.queue enqueues valid manager packet", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "dispatch.queue", {
      phase: "2",
      position: "head-of-research",
      goal: "Run market research",
      llm_tier: "strong-general",
    })) as { ok: boolean; path: string };
    expect(result.ok).toBe(true);
    expect(result.path).toMatch(/DISPATCH\/queue\//);
    expect(readdirSync(join(dispatchDir(repo), "queue")).length).toBe(1);
  });

  it("spawn.run_next refuses without api key", async () => {
    repo = tempRepo();
    enqueue(repo, packet, "2-head-of-research-a.yaml");
    const result = (await executeIntent(repo, "spawn.run_next", {
      apiKey: null,
    })) as { ok: boolean; error?: string };
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/CURSOR_API_KEY/);
    expect(readdirSync(join(dispatchDir(repo), "queue")).length).toBe(1);
  });

  it("spawn.run_next claims with test adapter", async () => {
    repo = tempRepo();
    enqueue(repo, packet, "2-a.yaml");
    const result = (await executeIntent(repo, "spawn.run_next", {
      apiKey: "test-key",
      adapter: okAdapter,
    })) as { ok: boolean; runId?: string };
    expect(result.ok).toBe(true);
    expect(result.runId).toBeTruthy();
    expect(readdirSync(join(dispatchDir(repo), "runs")).length).toBe(1);
  });

  it("agent.pause and agent.resume toggle seat state", async () => {
    repo = tempRepo();
    const paused = (await executeIntent(repo, "agent.pause", { slug: "head-of-research" })) as {
      ok: boolean;
      paused: boolean;
    };
    expect(paused.ok).toBe(true);
    expect(paused.paused).toBe(true);

    const resumed = (await executeIntent(repo, "agent.resume", { slug: "head-of-research" })) as {
      ok: boolean;
      paused: boolean;
    };
    expect(resumed.ok).toBe(true);
    expect(resumed.paused).toBe(false);
  });

  it("run.cancel returns not active when no registered run", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "run.cancel", { runId: "missing" })) as {
      ok: boolean;
      error?: string;
    };
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/not active/i);
  });

  it("csuite.draft writes review file", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "csuite.draft", { phase: "2" })) as {
      ok: boolean;
      path: string;
    };
    expect(result.ok).toBe(true);
    expect(result.path).toMatch(/2-csuite-review\.md$/);
    expect(existsSync(join(repo, result.path))).toBe(true);
  });

  it("file.read returns structured stub error for missing path arg", async () => {
    repo = tempRepo();
    await expect(executeIntent(repo, "file.read", {})).rejects.toThrow(/path required/i);
  });

  it("file.read returns content for active venture business-idea file", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "file.read", {
      path: `${BIZ_IDEA}/RUNBOOK-TRACKER.md`,
    })) as { type: string; path: string; content: string };
    expect(result.type).toBe("file");
    expect(result.path).toBe(`${BIZ_IDEA}/RUNBOOK-TRACKER.md`);
    expect(result.content).toMatch(/phase/i);
  });

  it("file.read returns content for HANDOFFS under active venture", async () => {
    repo = tempRepo();
    writeFileSync(join(repo, BIZ_IDEA, "HANDOFFS", "test.md"), "# Handoff\n");
    const result = (await executeIntent(repo, "file.read", {
      path: `${BIZ_IDEA}/HANDOFFS/test.md`,
    })) as { type: string; content: string };
    expect(result.type).toBe("file");
    expect(result.content).toBe("# Handoff\n");
  });

  it("file.read rejects skills/org and other venture paths", async () => {
    repo = tempRepo();
    mkdirSync(join(repo, "docs/projects/other-venture/business-idea"), { recursive: true });
    writeFileSync(
      join(repo, "docs/projects/other-venture/business-idea/RUNBOOK-TRACKER.md"),
      "# Other\n",
    );
    await expect(
      executeIntent(repo, "file.read", { path: "skills/org/ORG-REGISTRY.md" }),
    ).rejects.toThrow(/allowlist/i);
    await expect(
      executeIntent(repo, "file.read", {
        path: "docs/projects/other-venture/business-idea/RUNBOOK-TRACKER.md",
      }),
    ).rejects.toThrow(/allowlist/i);
  });

  it("mode.set updates room mode in session", async () => {
    repo = tempRepo();
    const { getRoomMode } = await import("./session");
    expect(getRoomMode("room-1")).toBe("briefing");

    const result = (await executeIntent(repo, "mode.set", {
      mode: "ops",
      roomId: "room-1",
    })) as { ok: boolean; mode: string; previous: string };
    expect(result.ok).toBe(true);
    expect(result.mode).toBe("ops");
    expect(result.previous).toBe("briefing");
    expect(getRoomMode("room-1")).toBe("ops");
  });

  it("venture.list returns projects", async () => {
    repo = tempRepo();
    const r = (await executeIntent(repo, "venture.list", {})) as {
      active: string;
      projects: { slug: string }[];
    };
    expect(r.projects.length).toBeGreaterThan(0);
    expect(r.active).toBeTruthy();
  });

  it("venture.create scaffolds and activates", async () => {
    repo = tempRepo();
    const name = `Voice Venture ${Date.now()}`;
    const r = (await executeIntent(repo, "venture.create", { name })) as {
      slug: string;
      active: string;
    };
    expect(r.active).toBe(r.slug);
    const get = (await executeIntent(repo, "venture.get", {})) as { active: string };
    expect(get.active).toBe(r.slug);
  });

  it("venture.switch changes active", async () => {
    repo = tempRepo();
    const a = (await executeIntent(repo, "venture.create", {
      name: `Switch A ${Date.now()}`,
    })) as { slug: string; active: string };
    const b = (await executeIntent(repo, "venture.create", {
      name: `Switch B ${Date.now()}`,
    })) as { slug: string; active: string };
    expect(b.active).toBe(b.slug);
    expect(b.active).not.toBe(a.slug);

    const switched = (await executeIntent(repo, "venture.switch", { slug: a.slug })) as {
      ok: boolean;
      active: string;
    };
    expect(switched.ok).toBe(true);
    expect(switched.active).toBe(a.slug);

    const get = (await executeIntent(repo, "venture.get", {})) as { active: string };
    expect(get.active).toBe(a.slug);
  });

  it("mode.set accepts architect", async () => {
    repo = tempRepo();
    const r = await executeIntent(repo, "mode.set", { roomId: "r1", mode: "architect" });
    expect(r).toMatchObject({ ok: true, mode: "architect" });
  });

  it("dispatch.queue_for enqueues any manager on a phase", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "dispatch.queue_for", {
      position: "cfo",
      goal: "Review financial model",
      phase: "2",
    })) as { ok: boolean; path: string };
    expect(result.ok).toBe(true);
    expect(result.path).toMatch(/DISPATCH\/queue\//);
    expect(readdirSync(join(dispatchDir(repo), "queue")).length).toBe(1);
  });

  it("dispatch.preview returns packet summary for valid manager", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "dispatch.preview", {
      position: "cfo",
      goal: "Review financial model",
      phase: "2",
    })) as { ok: boolean; summary?: string };
    expect(result.ok).toBe(true);
    expect(result.summary).toMatch(/cfo/i);
  });

  it("agent.spawn_ic throws forbidden", async () => {
    repo = tempRepo();
    await expect(executeIntent(repo, "agent.spawn_ic", {})).rejects.toThrow(/forbidden/i);
  });

  it("seat.who_owns returns phase owner", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "seat.who_owns", { phase: "2" })) as {
      managerOwner: string;
    };
    expect(result.managerOwner).toBe("head-of-research");
  });

  it("delegate.plan describes manager delegation", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "delegate.plan", {
      position: "head-of-research",
      goal: "Plan IC delegation",
    })) as { level?: string; note: string };
    expect(result.level).toBe("manager");
    expect(result.note).toMatch(/spawn listed ICs/i);
  });

  it("session.help returns cheatsheet text", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "session.help", {})) as { help: string };
    expect(result.help).toMatch(/Briefing/i);
    expect(result.help).toMatch(/mission\.get/i);
  });

  it("session.repeat returns last summary for room", async () => {
    repo = tempRepo();
    const { setLastSummary } = await import("./session");
    setLastSummary("room-repeat", "Phase 2 in progress.");
    const result = (await executeIntent(repo, "session.repeat", { roomId: "room-repeat" })) as {
      summary: string;
    };
    expect(result.summary).toBe("Phase 2 in progress.");
  });

  it("session.repeat throws when no last summary", async () => {
    repo = tempRepo();
    await expect(
      executeIntent(repo, "session.repeat", { roomId: "empty-room" }),
    ).rejects.toThrow(/nothing to repeat/i);
  });

  it("session.cancel_pending cancels token when provided", async () => {
    repo = tempRepo();
    const { createConfirmToken, peekConfirm } = await import("./session");
    const token = createConfirmToken("cancel-room", "agent.pause", { slug: "cfo" }, "ops");
    const result = (await executeIntent(repo, "session.cancel_pending", {
      roomId: "cancel-room",
      token,
    })) as { ok: boolean; cancelled?: { intent: string } };
    expect(result.ok).toBe(true);
    expect(result.cancelled?.intent).toBe("agent.pause");
    expect(peekConfirm("cancel-room", token)).toBeNull();
  });

  it("session.cancel_pending cancels latest pending when token omitted", async () => {
    repo = tempRepo();
    const { createConfirmToken, peekLatestConfirm } = await import("./session");
    createConfirmToken("latest-room", "spawn.run_next", {}, "ops");
    const result = (await executeIntent(repo, "session.cancel_pending", {
      roomId: "latest-room",
    })) as { ok: boolean; cancelled?: { intent: string } };
    expect(result.ok).toBe(true);
    expect(result.cancelled?.intent).toBe("spawn.run_next");
    expect(peekLatestConfirm("latest-room")).toBeNull();
  });

  it("session.cancel_pending throws when no pending confirmation", async () => {
    repo = tempRepo();
    await expect(
      executeIntent(repo, "session.cancel_pending", { roomId: "empty-room" }),
    ).rejects.toMatchObject({
      message: "No pending confirmation to cancel",
      code: "no_pending",
    });
  });

  it("session.cancel_pending throws for invalid token", async () => {
    repo = tempRepo();
    await expect(
      executeIntent(repo, "session.cancel_pending", {
        roomId: "bad-token-room",
        token: "not-a-real-token",
      }),
    ).rejects.toMatchObject({
      message: "Invalid or expired confirm token",
      code: "invalid_token",
    });
  });

  it("jarvis.ping returns ok and ISO time", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "jarvis.ping", {})) as { ok: boolean; time: string };
    expect(result.ok).toBe(true);
    expect(() => new Date(result.time)).not.toThrow();
  });

  it("phase.list_open returns pending and in-progress phases", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "phase.list_open", {})) as {
      phases: Array<{ phase: string; status: string }>;
    };
    expect(result.phases.some((p) => p.phase === "2" && p.status === "🔄")).toBe(true);
    expect(result.phases.some((p) => p.phase === "3" && p.status === "⬜")).toBe(true);
    expect(result.phases.every((p) => p.status === "⬜" || p.status === "🔄")).toBe(true);
  });

  it("digest.focus returns section slice", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "digest.focus", { section: "blocked" })) as {
      section: string;
      data: unknown;
    };
    expect(result.section).toBe("blocked");
    expect(Array.isArray(result.data)).toBe(true);
  });

  it("digest.focus returns full digest when section omitted", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "digest.focus", {})) as {
      digest: { queueDepth: number };
    };
    expect(result.digest.queueDepth).toBe(0);
  });

  it("activity.tail returns last n events", async () => {
    repo = tempRepo();
    const droot = dispatchRoot(repo);
    const { appendActivity } = await import("../activity");
    for (let i = 0; i < 12; i++) {
      appendActivity(droot, { type: "jarvis_act", detail: `event-${i}` });
    }
    const result = (await executeIntent(repo, "activity.tail", { n: 5 })) as {
      activity: Array<{ detail?: string }>;
    };
    expect(result.activity).toHaveLength(5);
    expect(result.activity[0]?.detail).toBe("event-11");
    expect(result.activity[4]?.detail).toBe("event-7");
  });

  it("runs.get returns run record by runId", async () => {
    repo = tempRepo();
    const runId = "20260716-head-of-research";
    writeFileSync(
      join(dispatchDir(repo), "runs", `${runId}.json`),
      JSON.stringify({
        runId,
        status: "completed",
        position: "head-of-research",
        phase: "2",
        claimed: "2-a.yaml",
        dispatch_filename: "2-a.yaml",
        wake_reason: "run_next",
        started_at: "2026-07-16T14:00:00.000Z",
        llm_model: "claude-sonnet-5",
      }),
    );
    const result = (await executeIntent(repo, "runs.get", { runId })) as {
      run: { runId: string; position: string };
    };
    expect(result.run.runId).toBe(runId);
    expect(result.run.position).toBe("head-of-research");
  });

  it("runs.get throws when run missing", async () => {
    repo = tempRepo();
    await expect(executeIntent(repo, "runs.get", { runId: "missing" })).rejects.toThrow(
      /not found/i,
    );
  });

  it("spawn.run claims specific filename with test adapter", async () => {
    repo = tempRepo();
    enqueue(repo, packet, "2-a.yaml");
    const result = (await executeIntent(repo, "spawn.run", {
      filename: "2-a.yaml",
      wakeReason: "on_demand",
      apiKey: "test-key",
      adapter: okAdapter,
    })) as { ok: boolean; runId?: string };
    expect(result.ok).toBe(true);
    expect(result.runId).toBeTruthy();
    expect(readdirSync(join(dispatchDir(repo), "runs")).length).toBe(1);
  });

  it("routine.list returns routine summaries", async () => {
    repo = tempRepo();
    writeRoutine(dispatchDir(repo), {
      id: "daily-pulse",
      enabled: true,
      cron: "0 9 * * *",
      action: "enqueue",
      phase: "2",
      position: "head-of-research",
      goal: "Daily pulse",
    });
    const result = (await executeIntent(repo, "routine.list", {})) as {
      routines: Array<{ id: string; enabled: boolean }>;
    };
    expect(result.routines.some((r) => r.id === "daily-pulse" && r.enabled)).toBe(true);
  });

  it("routine.disable sets enabled false", async () => {
    repo = tempRepo();
    writeRoutine(dispatchDir(repo), {
      id: "daily-pulse",
      enabled: true,
      cron: "0 9 * * *",
      action: "enqueue",
      phase: "2",
      position: "head-of-research",
      goal: "Daily pulse",
    });
    const result = (await executeIntent(repo, "routine.disable", { id: "daily-pulse" })) as {
      ok: boolean;
      routine: { enabled: boolean };
    };
    expect(result.ok).toBe(true);
    expect(result.routine.enabled).toBe(false);
  });

  it("handoff.list filters by phase", async () => {
    repo = tempRepo();
    writeFileSync(
      join(repo, BIZ_IDEA, "HANDOFFS", "2-head-of-research.md"),
      `---
kind: manager
phase: "2"
position: head-of-research
reports_to: ceo-strategist
status: on_track
verdict_for_manager: proceed
verdict: proceed
llm_tier: strong-general
generation_profile: none
fallback_applied: ""
---

# Handoff
Recommendation: proceed
`,
    );
    const all = (await executeIntent(repo, "handoff.list", {})) as {
      handoffs: Array<{ phase: string }>;
    };
    expect(all.handoffs.length).toBeGreaterThan(0);

    const phase2 = (await executeIntent(repo, "handoff.list", { phase: "2" })) as {
      handoffs: Array<{ phase: string }>;
    };
    expect(phase2.handoffs.every((h) => h.phase === "2")).toBe(true);
  });

  it("briefing.pin writes standup from seat report", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "briefing.pin", {
      mode: "seat",
      slug: "ceo-strategist",
    })) as { ok: boolean; path: string };
    expect(result.ok).toBe(true);
    expect(result.path).toMatch(/BRIEFINGS\/ceo-strategist-standup\.md$/);
    expect(existsSync(join(repo, result.path))).toBe(true);
    const content = readFileSync(join(repo, result.path), "utf8");
    expect(content).toMatch(/Standup — ceo-strategist/);
  });
});

describe("buildJarvisContext", () => {
  let repo = "";
  afterEach(() => {
    if (repo) rmSync(repo, { recursive: true, force: true });
  });

  it("returns mission and spoken brief", () => {
    repo = tempRepo();
    const ctx = buildJarvisContext(repo);
    expect(ctx.mission).toMatchObject({ idea: "Test Widget", currentPhase: "2" });
    expect(ctx.spokenBrief).toMatch(/Phase 2/i);
  });
});

describe("handleJarvisConfirm", () => {
  let repo = "";

  afterEach(() => {
    if (repo) rmSync(repo, { recursive: true, force: true });
    clearRunRegistry();
    resetSessionForTests();
  });

  it("cancels pending token when accept is false", async () => {
    repo = tempRepo();
    const pending = await handleJarvisAct(repo, "room-1", {
      intent: "agent.pause",
      args: { slug: "head-of-research" },
      mode: "ops",
    });
    expect(pending.status).toBe("needs_confirm");
    const declined = await handleJarvisConfirm(repo, "room-1", pending.token!, false);
    expect(declined.status).toBe("denied");

    const retry = await handleJarvisAct(repo, "room-1", {
      intent: "agent.pause",
      args: { slug: "head-of-research" },
      mode: "ops",
      confirmToken: pending.token,
    });
    expect(retry.status).toBe("error");
  });

  it("executes when accept is true", async () => {
    repo = tempRepo();
    const pending = await handleJarvisAct(repo, "room-1", {
      intent: "agent.pause",
      args: { slug: "head-of-research" },
      mode: "ops",
    });
    const confirmed = await handleJarvisConfirm(repo, "room-1", pending.token!, true);
    expect(confirmed.status).toBe("ok");
    const { isSeatPaused } = await import("../agent-state");
    expect(isSeatPaused(dispatchDir(repo), "head-of-research")).toBe(true);
  });

  it("does not execute when accept is omitted", async () => {
    repo = tempRepo();
    const pending = await handleJarvisAct(repo, "room-1", {
      intent: "agent.pause",
      args: { slug: "head-of-research" },
      mode: "ops",
    });
    const declined = await handleJarvisConfirm(repo, "room-1", pending.token!);
    expect(declined.status).toBe("denied");
    const { isSeatPaused } = await import("../agent-state");
    expect(isSeatPaused(dispatchDir(repo), "head-of-research")).toBe(false);
  });
});

describe("handleJarvisAct dispatch.queue confirm", () => {
  let repo = "";

  afterEach(() => {
    if (repo) rmSync(repo, { recursive: true, force: true });
    clearRunRegistry();
    resetSessionForTests();
  });

  it("requires confirm in ops mode before queueing dispatch", async () => {
    repo = tempRepo();
    const pending = await handleJarvisAct(repo, "room-1", {
      intent: "dispatch.queue",
      args: {
        phase: "2",
        position: "head-of-research",
        goal: "Run market research",
        llm_tier: "strong-general",
      },
      mode: "ops",
    });
    expect(pending.status).toBe("needs_confirm");
    expect(pending.token).toBeTruthy();
    expect(readdirSync(join(dispatchDir(repo), "queue")).length).toBe(0);
  });

  it("executes dispatch.queue after confirm with accept true", async () => {
    repo = tempRepo();
    const pending = await handleJarvisAct(repo, "room-1", {
      intent: "dispatch.queue",
      args: {
        phase: "2",
        position: "head-of-research",
        goal: "Run market research",
        llm_tier: "strong-general",
      },
      mode: "ops",
    });
    const confirmed = await handleJarvisConfirm(repo, "room-1", pending.token!, true);
    expect(confirmed.status).toBe("ok");
    expect((confirmed.result as { path?: string }).path).toMatch(/DISPATCH\/queue\//);
    expect(readdirSync(join(dispatchDir(repo), "queue")).length).toBe(1);
  });

  it("does not execute dispatch.queue when confirm declined", async () => {
    repo = tempRepo();
    const pending = await handleJarvisAct(repo, "room-1", {
      intent: "dispatch.queue",
      args: {
        phase: "2",
        position: "head-of-research",
        goal: "Run market research",
        llm_tier: "strong-general",
      },
      mode: "ops",
    });
    const declined = await handleJarvisConfirm(repo, "room-1", pending.token!, false);
    expect(declined.status).toBe("denied");
    expect(readdirSync(join(dispatchDir(repo), "queue")).length).toBe(0);
  });

  it("returns error when confirmed dispatch fails validation", async () => {
    repo = tempRepo();
    const pending = await handleJarvisAct(repo, "room-1", {
      intent: "dispatch.queue",
      args: {
        phase: "2",
        position: "cmo",
        goal: "Wrong owner",
        llm_tier: "frontier-reasoning",
      },
      mode: "ops",
    });
    const confirmed = await handleJarvisConfirm(repo, "room-1", pending.token!, true);
    expect(confirmed.status).toBe("error");
    expect(confirmed.reason).toMatch(/owner/i);
    expect(readdirSync(join(dispatchDir(repo), "queue")).length).toBe(0);
  });
});
