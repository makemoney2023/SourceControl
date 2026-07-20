import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  callOccControlTool,
  handleOccControlRpc,
  listOccControlTools,
} from "./occ-control";

const BIZ_IDEA = "docs/projects/passive-grid/business-idea";
const FIXTURES = join(import.meta.dirname, "../../src/lib/fixtures");

function seedRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-control-mcp-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "skills/org"), { recursive: true });
  mkdirSync(join(root, BIZ_IDEA, "DISPATCH/runs"), { recursive: true });
  mkdirSync(join(root, "docs/projects/passive-grid/MEMORY"), { recursive: true });
  writeFileSync(
    join(root, "skills/org/ORG-REGISTRY.md"),
    readFileSync(join(FIXTURES, "sample-org-registry.md"), "utf8"),
  );
  writeFileSync(
    join(root, "skills/org/MODEL-REGISTRY.md"),
    readFileSync(join(FIXTURES, "sample-model-registry.md"), "utf8"),
  );
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

describe("occ-control", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("lists the locked v1 tool surface", () => {
    const names = listOccControlTools().map((t) => t.name);
    expect(names).toContain("occ_runs_watch");
    expect(names).toContain("occ_work_request");
    expect(names).toContain("occ_confirm");
    expect(names).not.toContain("kickoff_ic_sprint");
  });

  it("tools/list rpc returns tools", async () => {
    root = seedRepo();
    const res = (await handleOccControlRpc(root, { method: "tools/list" })) as {
      tools: unknown[];
    };
    expect(res.tools.length).toBeGreaterThan(5);
  });

  it("occ_runs_watch is readable without confirm", async () => {
    root = seedRepo();
    const result = (await callOccControlTool(root, "occ_runs_watch", { limit: 5 })) as {
      status: string;
    };
    expect(result.status).toBe("ok");
  });

  it("occ_work_request returns needs_confirm and does not queue until confirm", async () => {
    root = seedRepo();
    const first = (await callOccControlTool(root, "occ_work_request", {
      goal: "Test MCP write",
      position: "ceo-strategist",
      phase: "0",
      mode: "ops",
    })) as { status: string; token?: string };
    expect(first.status).toBe("needs_confirm");
    expect(typeof first.token).toBe("string");

    const denied = (await callOccControlTool(root, "occ_confirm", {
      accept: false,
      confirmToken: first.token,
    })) as { status: string };
    expect(["ok", "denied", "error"]).toContain(denied.status);
  });

  it("rejects unknown tools", async () => {
    root = seedRepo();
    const result = (await callOccControlTool(root, "kickoff_ic_sprint", {})) as {
      status: string;
    };
    expect(result.status).toBe("error");
  });
});
