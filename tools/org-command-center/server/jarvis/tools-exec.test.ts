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
};

/** UI↔voice checklist + full JARVIS_INTENTS — minimal valid args per intent. */
const INTENT_COVERAGE: CoverageCase[] = [
  { intent: "mission.get", args: {} },
  { intent: "digest.get", args: {} },
  { intent: "seat.report", args: { slug: "ceo-strategist" } },
  { intent: "tasks.list", args: {} },
  { intent: "runs.list", args: {} },
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
  { intent: "spawn.run_next", args: { apiKey: null } },
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
  { intent: "agent.spawn_ic", args: {} },
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
