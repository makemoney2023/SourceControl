import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import { dispatchRoot, resolveRepoRoot } from "./paths";
import { listRoutineDefs, tickRoutines, writeRoutine } from "./routines";

const BIZ_IDEA = "docs/projects/passive-grid/business-idea";

function seedRegistry(root: string) {
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
}

describe("routines tick", () => {
  it("enqueues once per minute when due", async () => {
    const repo = resolveRepoRoot();
    const root = mkdtempSync(join(tmpdir(), "routine-repo-"));
    seedRegistry(root);
    mkdirSync(join(root, "skills/org"), { recursive: true });
    mkdirSync(join(root, BIZ_IDEA, "DISPATCH/queue"), { recursive: true });
    mkdirSync(join(root, BIZ_IDEA, "DISPATCH/claimed"), { recursive: true });
    mkdirSync(join(root, BIZ_IDEA, "DISPATCH/routines"), { recursive: true });

    writeFileSync(
      join(root, "skills/org/ORG-REGISTRY.md"),
      readFileSync(join(repo, "skills/org/ORG-REGISTRY.md"), "utf8"),
    );
    writeFileSync(
      join(root, "skills/org/MODEL-REGISTRY.md"),
      readFileSync(join(repo, "skills/org/MODEL-REGISTRY.md"), "utf8"),
    );

    const droot = dispatchRoot(root);
    writeRoutine(droot, {
      id: "pulse",
      enabled: true,
      cron: "* * * * *",
      action: "enqueue",
      phase: "2",
      position: "head-of-research",
      goal: "Daily pulse",
      last_run_at: null,
    });

    const now = new Date("2026-07-16T12:34:00Z");
    const first = await tickRoutines(root, now);
    expect(first.fired).toContain("pulse");
    expect(listRoutineDefs(droot)[0].last_run_at).toBe(now.toISOString());

    const second = await tickRoutines(root, now);
    expect(second.fired).toEqual([]);
  });
});

describe("writeRoutine", () => {
  it("round-trips yaml", () => {
    const d = mkdtempSync(join(tmpdir(), "rt-"));
    mkdirSync(join(d, "routines"), { recursive: true });
    writeRoutine(d, {
      id: "x",
      enabled: false,
      cron: "0 9 * * *",
      action: "enqueue",
      phase: "1",
      goal: "g",
    });
    const raw = YAML.parse(readFileSync(join(d, "routines/x.yaml"), "utf8"));
    expect(raw.id).toBe("x");
    expect(raw.enabled).toBe(false);
  });
});
