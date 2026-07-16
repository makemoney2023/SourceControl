import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { buildJarvisContext, spokenMissionBrief } from "./briefing";

const FIXTURES = join(import.meta.dirname, "../../src/lib/fixtures");
const BIZ_IDEA = "docs/projects/passive-grid/business-idea";

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), "jarvis-brief-"));
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

describe("spokenMissionBrief", () => {
  it("speaks phase and blocker count", () => {
    const s = spokenMissionBrief({
      idea: "AWG",
      currentPhase: "2",
      currentPhaseName: "Market",
      progressPct: 14,
      blockerCount: 1,
      nextAction: "Phase 2 Market",
    });
    expect(s).toMatch(/Phase 2/);
    expect(s).toMatch(/blocker/i);
    expect(s.split(/[.!?]+/).filter(Boolean).length).toBeLessThanOrEqual(2);
  });
});

describe("buildJarvisContext", () => {
  let repo = "";

  afterEach(() => {
    if (repo) rmSync(repo, { recursive: true, force: true });
  });

  it("returns mission and spoken brief for agent opener", () => {
    repo = tempRepo();
    const ctx = buildJarvisContext(repo);
    expect(ctx.mission).toMatchObject({ idea: "Test Widget", currentPhase: "2" });
    expect(ctx.spokenBrief).toMatch(/Phase 2/i);
    expect(typeof ctx.spokenBrief).toBe("string");
    expect(ctx.spokenBrief.length).toBeGreaterThan(0);
  });
});
