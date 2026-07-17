import { mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// join used by budget pause assertion path
import { afterEach, describe, expect, it } from "vitest";
import YAML from "yaml";
import type { ManagerPacket } from "../src/lib/types";
import { clearRunRegistry } from "./run-registry";
import { setSeatPaused } from "./agent-state";
import type { RuntimeAdapter } from "./runtime-adapter";
import {
  buildRewakePrompt,
  buildSpawnPrompt,
  rewakeSessionDetached,
  spawnClaimedManager,
  spawnClaimedManagerDetached,
  spawnRunReady,
} from "./spawn";
import { resolveRepoRoot } from "./paths";
import { writeSession } from "./sessions";
import { claimDispatch } from "../src/lib/dispatch-queue";
import { dispatchRoot } from "./paths";

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
  company_goal: "Test company",
  parent_goal: "Phase 2 — Market",
  goal_path: ["Test company", "Phase 2 — Market", "Research"],
};

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), "spawn-repo-"));
  mkdirSync(join(root, "projects"), { recursive: true });
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
  const d = join(root, BIZ_IDEA, "DISPATCH");
  mkdirSync(join(d, "queue"), { recursive: true });
  mkdirSync(join(d, "claimed"), { recursive: true });
  mkdirSync(join(d, "runs"), { recursive: true });
  mkdirSync(join(root, "docs/projects/passive-grid/MEMORY/sessions"), { recursive: true });
  return root;
}

function dispatchDir(repoRoot: string) {
  return join(repoRoot, BIZ_IDEA, "DISPATCH");
}

function enqueue(repoRoot: string, p: ManagerPacket, name: string) {
  writeFileSync(
    join(dispatchDir(repoRoot), "queue", name),
    YAML.stringify(p),
  );
}

const okAdapter: RuntimeAdapter = {
  async run() {
    return { status: "completed", result: "done" };
  },
};

afterEach(() => {
  clearRunRegistry();
});

describe("buildSpawnPrompt", () => {
  it("mentions HEARTBEAT path and goal ancestry", () => {
    const repo = resolveRepoRoot();
    const prompt = buildSpawnPrompt(packet, repo);
    expect(prompt).toContain("skills/org/positions/head-of-research/HEARTBEAT.md");
    expect(prompt).toContain("Goal ancestry");
    expect(prompt).toContain("Test company");
    expect(prompt).toContain(`${BIZ_IDEA}/HANDOFFS/`);
    expect(prompt).toContain(`${BIZ_IDEA}/REVIEW/inbox/`);
    expect(prompt).toContain("pending_review");
  });

  it("states hard acceptance criteria from packet fields", () => {
    const repo = resolveRepoRoot();
    const withAcceptance: ManagerPacket = {
      ...packet,
      preferred_ic: "copy-chief",
      require_inbox: true,
      require_ic_handoff: true,
    };
    const prompt = buildSpawnPrompt(withAcceptance, repo);
    expect(prompt).toMatch(/hard acceptance criteria/i);
    expect(prompt).toContain("copy-chief");
    expect(prompt).toMatch(/require_inbox|REVIEW\/inbox/i);
    expect(prompt).toMatch(/require_ic_handoff|HANDOFFS/i);
  });

  it("instructs runId frontmatter when runId arg provided", () => {
    const repo = resolveRepoRoot();
    const withAcceptance: ManagerPacket = {
      ...packet,
      preferred_ic: "copy-chief",
      require_inbox: true,
      require_ic_handoff: true,
    };
    const prompt = buildSpawnPrompt(withAcceptance, repo, "run-123");
    expect(prompt).toContain("runId: run-123");
    expect(prompt).toMatch(/frontmatter/i);
  });

  it("omits optional acceptance lines when flags unset", () => {
    const repo = resolveRepoRoot();
    const prompt = buildSpawnPrompt(packet, repo);
    expect(prompt).not.toMatch(/hard acceptance criteria/i);
    expect(prompt).not.toContain("preferred_ic");
  });
});

describe("buildRewakePrompt", () => {
  it("includes hard acceptance criteria via buildSpawnPrompt", () => {
    const repo = resolveRepoRoot();
    const withAcceptance: ManagerPacket = {
      ...packet,
      preferred_ic: "copy-chief",
      require_inbox: true,
      require_ic_handoff: true,
    };
    const prompt = buildRewakePrompt(withAcceptance, repo, undefined, "run-456");
    expect(prompt).toMatch(/Continue the manager packet/i);
    expect(prompt).toMatch(/hard acceptance criteria/i);
    expect(prompt).toContain("copy-chief");
    expect(prompt).toContain("runId: run-456");
  });

  it("prepends operator instruction block when instruction provided", () => {
    const repo = resolveRepoRoot();
    const prompt = buildRewakePrompt(
      packet,
      repo,
      "Focus on the inbox review first.",
      "run-789",
    );
    expect(prompt).toMatch(/## Operator instruction \(new\)/);
    expect(prompt).toContain("Focus on the inbox review first.");
    expect(prompt).toMatch(/Continue the existing packet\. Do not discard prior work\./);
    expect(prompt).toMatch(/Continue the manager packet/i);
    expect(prompt).toContain("runId: run-789");
  });

  it("omits operator instruction block when instruction omitted", () => {
    const repo = resolveRepoRoot();
    const prompt = buildRewakePrompt(packet, repo, undefined, "run-789");
    expect(prompt).not.toMatch(/## Operator instruction \(new\)/);
  });
});

describe("rewakeSessionDetached", () => {
  it("returns while adapter is still running", async () => {
    const repo = tempRepo();
    enqueue(repo, packet, "2-a.yaml");
    const root = dispatchRoot(repo);
    const claimed = claimDispatch(root, { filename: "2-a.yaml" });
    expect(claimed.ok).toBe(true);
    writeSession(root, {
      agentId: "agent-rewake-1",
      position: "head-of-research",
      phase: "2",
      dispatch_filename: "2-a.yaml",
      updated_at: new Date().toISOString(),
      status: "active",
    });
    let release!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });
    const slowAdapter: RuntimeAdapter = {
      async run() {
        await gate;
        return { status: "completed", result: "done", agentId: "agent-rewake-1" };
      },
    };
    const result = rewakeSessionDetached(repo, {
      dispatchFilename: "2-a.yaml",
      instruction: "Also cover pricing.",
      apiKey: "test-key",
      adapter: slowAdapter,
    });
    expect(result.ok).toBe(true);
    expect(result.runId).toBeTruthy();
    const runs = readdirSync(join(dispatchDir(repo), "runs"));
    const rec = JSON.parse(
      readFileSync(join(dispatchDir(repo), "runs", runs[0]), "utf8"),
    );
    expect(rec.status).toBe("running");
    release();
    await new Promise((r) => setTimeout(r, 50));
    const done = JSON.parse(
      readFileSync(join(dispatchDir(repo), "runs", runs[0]), "utf8"),
    );
    expect(["completed", "completed_with_gaps"]).toContain(done.status);
  });
});

describe("spawnClaimedManagerDetached", () => {
  it("returns while adapter is still running, then completes", async () => {
    const repo = tempRepo();
    enqueue(repo, packet, "2-a.yaml");
    let release!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });
    const slowAdapter: RuntimeAdapter = {
      async run() {
        await gate;
        return { status: "completed", result: "done", agentId: "agent-detach" };
      },
    };
    const result = spawnClaimedManagerDetached(repo, {
      apiKey: "test-key",
      adapter: slowAdapter,
      filename: "2-a.yaml",
    });
    expect(result.ok).toBe(true);
    expect(result.runId).toBeTruthy();
    expect(result.position).toBe("head-of-research");
    const runs = readdirSync(join(dispatchDir(repo), "runs"));
    const rec = JSON.parse(
      readFileSync(join(dispatchDir(repo), "runs", runs[0]), "utf8"),
    );
    expect(rec.status).toBe("running");
    release();
    await new Promise((r) => setTimeout(r, 50));
    const done = JSON.parse(
      readFileSync(join(dispatchDir(repo), "runs", runs[0]), "utf8"),
    );
    expect(done.status).toBe("completed");
  });
});

describe("spawn usage + budget pause", () => {
  it("records cost and auto-pauses when over budget", async () => {
    const repo = tempRepo();
    enqueue(repo, { ...packet, budget_usd: 0.000001 }, "2-a.yaml");
    const usageAdapter: RuntimeAdapter = {
      async run() {
        return {
          status: "completed",
          result: "ok",
          agentId: "agent-1",
          usage: {
            inputTokens: 1_000_000,
            outputTokens: 1_000_000,
            cacheReadTokens: 0,
            totalTokens: 2_000_000,
          },
        };
      },
    };
    const result = await spawnClaimedManager(repo, {
      apiKey: "test-key",
      adapter: usageAdapter,
    });
    expect(result.ok).toBe(true);
    const { isSeatPaused } = await import("./agent-state");
    expect(isSeatPaused(dispatchDir(repo), "head-of-research")).toBe(
      true,
    );
  });
});

describe("spawnClaimedManager", () => {
  it("refuses without api key and does not claim", async () => {
    const repo = tempRepo();
    enqueue(repo, packet, "2-head-of-research-a.yaml");
    const result = await spawnClaimedManager(repo, {
      apiKey: null,
      adapter: okAdapter,
    });
    expect(result.ok).toBe(false);
    expect(readdirSync(join(dispatchDir(repo), "queue"))).toHaveLength(1);
  });

  it("refuses budget hard-stop before claim", async () => {
    const repo = tempRepo();
    enqueue(repo, { ...packet, budget_usd: 0 }, "2-head-of-research-a.yaml");
    const result = await spawnClaimedManager(repo, {
      apiKey: "test-key",
      adapter: okAdapter,
      wakeReason: "on_demand",
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("budget_usd");
    expect(readdirSync(join(dispatchDir(repo), "queue"))).toHaveLength(1);
  });

  it("refuses paused seat before claim", async () => {
    const repo = tempRepo();
    const droot = dispatchDir(repo);
    setSeatPaused(droot, "head-of-research", true);
    enqueue(repo, packet, "2-head-of-research-a.yaml");
    const result = await spawnClaimedManager(repo, {
      apiKey: "test-key",
      adapter: okAdapter,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("paused");
    expect(readdirSync(join(dispatchDir(repo), "queue"))).toHaveLength(1);
  });

  it("claims by filename and writes run with wake_reason", async () => {
    const repo = tempRepo();
    enqueue(repo, packet, "2-a.yaml");
    enqueue(repo, { ...packet, position: "cmo", phase: "3" }, "3-cmo.yaml");
    const result = await spawnClaimedManager(repo, {
      apiKey: "test-key",
      adapter: okAdapter,
      filename: "3-cmo.yaml",
      wakeReason: "run_next",
    });
    expect(result.ok).toBe(true);
    expect(result.packet?.position).toBe("cmo");
    const runs = readdirSync(join(dispatchDir(repo), "runs"));
    expect(runs.length).toBe(1);
    const rec = JSON.parse(
      readFileSync(join(dispatchDir(repo), "runs", runs[0]), "utf8"),
    );
    expect(rec.wake_reason).toBe("run_next");
    expect(rec.dispatch_filename).toBe("3-cmo.yaml");
    expect(rec.status).toBe("completed");
    const day = new Date().toISOString().slice(0, 10);
    const lifecyclePath = join(
      repo,
      "docs/projects/passive-grid/MEMORY/sessions",
      `${day}.md`,
    );
    expect(existsSync(lifecyclePath)).toBe(true);
    const lifecycle = readFileSync(lifecyclePath, "utf8");
    expect(lifecycle).toMatch(new RegExp(`run ${rec.runId} completed seat=cmo acceptance ok`));
  });

  it("marks completed_with_gaps when acceptance fails", async () => {
    const repo = tempRepo();
    const withAcceptance: ManagerPacket = {
      ...packet,
      preferred_ic: "copy-chief",
      require_inbox: true,
      require_ic_handoff: true,
    };
    enqueue(repo, withAcceptance, "2-a.yaml");
    const result = await spawnClaimedManager(repo, {
      apiKey: "test-key",
      adapter: okAdapter,
    });
    expect(result.ok).toBe(true);
    const runs = readdirSync(join(dispatchDir(repo), "runs"));
    const rec = JSON.parse(
      readFileSync(join(dispatchDir(repo), "runs", runs[0]), "utf8"),
    );
    expect(rec.status).toBe("completed_with_gaps");
    expect(rec.acceptance?.ok).toBe(false);
    expect(rec.acceptance?.missing).toContain("inbox");
    expect(rec.acceptance?.missing).toContain("ic_handoff");
  });

  it("marks cancelled when adapter aborts", async () => {
    const repo = tempRepo();
    enqueue(repo, packet, "2-a.yaml");
    const abortAdapter: RuntimeAdapter = {
      async run({ signal }) {
        const err = new Error("Aborted");
        err.name = "AbortError";
        signal?.aborted;
        throw err;
      },
    };
    const result = await spawnClaimedManager(repo, {
      apiKey: "test-key",
      adapter: abortAdapter,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toBe("cancelled");
    const runs = readdirSync(join(dispatchDir(repo), "runs"));
    const rec = JSON.parse(
      readFileSync(join(dispatchDir(repo), "runs", runs[0]), "utf8"),
    );
    expect(rec.status).toBe("cancelled");
  });
});

describe("spawnRunReady", () => {
  const okAdapter: RuntimeAdapter = {
    async run() {
      return { status: "completed", result: "done" };
    },
  };

  const cfoPacket: ManagerPacket = {
    ...packet,
    position: "cfo",
    goal: "Burn review",
    llm_tier: "frontier-reasoning",
    llm_model: "grok-4-5",
  };

  it("spawns multiple queued managers detached with mock adapter", () => {
    const repo = tempRepo();
    enqueue(repo, packet, "2-head-of-research-a.yaml");
    enqueue(repo, cfoPacket, "2-cfo-a.yaml");
    const result = spawnRunReady(repo, {
      apiKey: "test-key",
      adapter: okAdapter,
      limit: 2,
    });
    expect(result.ok).toBe(true);
    expect(result.started).toHaveLength(2);
    expect(result.started.map((s) => s.position).sort()).toEqual(["cfo", "head-of-research"]);
    expect(result.skipped).toHaveLength(0);
    expect(result.spoken).toMatch(/started/i);
    expect(readdirSync(join(dispatchDir(repo), "runs")).length).toBe(2);
  });

  it("spawns explicit filenames and skips paused seat with spoken partial summary", () => {
    const repo = tempRepo();
    enqueue(repo, packet, "2-head-of-research-a.yaml");
    enqueue(repo, cfoPacket, "2-cfo-a.yaml");
    setSeatPaused(dispatchDir(repo), "cfo", true);
    const result = spawnRunReady(repo, {
      filenames: ["2-head-of-research-a.yaml", "2-cfo-a.yaml"],
      apiKey: "test-key",
      adapter: okAdapter,
    });
    expect(result.ok).toBe(true);
    expect(result.started).toHaveLength(1);
    expect(result.started[0]?.position).toBe("head-of-research");
    expect(result.skipped).toHaveLength(1);
    expect(result.skipped[0]?.reason).toMatch(/paused/i);
    expect(result.spoken).toMatch(/skipped/i);
    expect(result.spoken).toMatch(/paused/i);
  });
});
