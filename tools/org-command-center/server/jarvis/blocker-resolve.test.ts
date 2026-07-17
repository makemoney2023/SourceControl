import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import type { ManagerPacket } from "../../src/lib/types";
import { dispatchRoot } from "../paths";
import { writeSession } from "../sessions";
import { JarvisExecError } from "./errors";
import { planBlockerResolve } from "./blocker-resolve";
import { executeIntent } from "./tools-exec";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "../../src/lib/fixtures");
const BIZ_IDEA = "docs/projects/passive-grid/business-idea";

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), "blocker-resolve-"));
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

function writeBlockedIcHandoff(repoRoot: string) {
  writeFileSync(
    join(repoRoot, BIZ_IDEA, "HANDOFFS", "2-market-research-analyst.md"),
    `---
kind: ic
phase: "2"
position: market-research-analyst
reports_to: head-of-research
status: blocked
verdict_for_manager: ""
verdict: ""
llm_tier: strong-general
generation_profile: none
fallback_applied: ""
---

# Handoff

## Risks / blockers

- no primary data source
`,
  );
}

describe("planBlockerResolve", () => {
  it("routes blocked IC seat to reporting manager for queue", () => {
    const repo = tempRepo();
    writeBlockedIcHandoff(repo);
    const plan = planBlockerResolve(repo, { seat: "market-research-analyst" });
    expect(plan.action).toBe("queue");
    expect(plan.position).toBe("head-of-research");
    expect(plan.goal).toMatch(/no primary data source/i);
    expect(plan.goal).toMatch(/market-research-analyst/i);
    expect(plan.spoken).toMatch(/head of research/i);
  });

  it("prefers rewake when manager has a live session", () => {
    const repo = tempRepo();
    writeBlockedIcHandoff(repo);
    const droot = dispatchRoot(repo);
    writeSession(droot, {
      agentId: "agent-hor-1",
      position: "head-of-research",
      phase: "2",
      dispatch_filename: "2-head-of-research-live.yaml",
      updated_at: new Date().toISOString(),
      status: "active",
    });
    const plan = planBlockerResolve(repo, { seat: "market research analyst" });
    expect(plan.action).toBe("rewake");
    expect(plan.position).toBe("head-of-research");
    expect(plan.dispatchFilename).toBe("2-head-of-research-live.yaml");
    expect(plan.spoken).toMatch(/rewake/i);
  });

  it("uses explicit goal when provided", () => {
    const repo = tempRepo();
    writeBlockedIcHandoff(repo);
    const plan = planBlockerResolve(repo, {
      seat: "market-research-analyst",
      goal: "Find alternate data sources",
    });
    expect(plan.goal).toBe("Find alternate data sources");
  });

  it("throws when no blockers match", () => {
    const repo = tempRepo();
    expect(() => planBlockerResolve(repo, {})).toThrow(JarvisExecError);
  });
});

describe("executeIntent blocker.resolve", () => {
  const okAdapter = {
    async run() {
      return { status: "completed", result: "done" };
    },
  };

  it("queues and spawns manager when no live session", async () => {
    const repo = tempRepo();
    writeBlockedIcHandoff(repo);
    const result = (await executeIntent(repo, "blocker.resolve", {
      seat: "market-research-analyst",
      apiKey: "test-key",
      adapter: okAdapter,
    })) as { ok: boolean; runId?: string; filename?: string; spoken?: string; action?: string };
    expect(result.ok).toBe(true);
    expect(result.action).toBe("queue");
    expect(result.runId).toBeTruthy();
    expect(result.filename).toBeTruthy();
    expect(result.spoken).toMatch(/head of research/i);
  });

  it("rewakes manager when live session exists", async () => {
    const repo = tempRepo();
    writeBlockedIcHandoff(repo);
    const droot = dispatchRoot(repo);
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
    writeFileSync(
      join(droot, "claimed", "2-head-of-research-live.yaml"),
      YAML.stringify(packet),
    );
    writeSession(droot, {
      agentId: "agent-hor-1",
      position: "head-of-research",
      phase: "2",
      dispatch_filename: "2-head-of-research-live.yaml",
      updated_at: new Date().toISOString(),
      status: "active",
    });
    const result = (await executeIntent(repo, "blocker.resolve", {
      seat: "market-research-analyst",
      apiKey: "test-key",
      adapter: okAdapter,
    })) as { ok: boolean; runId?: string; action?: string; spoken?: string };
    expect(result.action).toBe("rewake");
    expect(result.ok).toBe(true);
    expect(result.runId).toBeTruthy();
    expect(result.spoken).toMatch(/rewake/i);
  });
});
