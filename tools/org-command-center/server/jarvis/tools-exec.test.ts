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
import { executeIntent } from "./tools-exec";

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

  it("mode.set returns not-implemented stub", async () => {
    repo = tempRepo();
    const result = (await executeIntent(repo, "mode.set", { mode: "ops" })) as {
      stub: boolean;
      code: string;
    };
    expect(result.stub).toBe(true);
    expect(result.code).toBe("not_implemented");
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
