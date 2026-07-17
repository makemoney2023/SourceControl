import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  clearWorkIntake,
  getWorkIntake,
  mergeWorkGoal,
  resetSessionForTests,
  setWorkIntake,
} from "./session";
import { inferTargetIcFromGoal, resolveWorkTarget } from "./work-request";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "../../src/lib/fixtures");
const BIZ_IDEA = "docs/projects/passive-grid/business-idea";

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), "work-req-"));
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
  mkdirSync(idea, { recursive: true });
  writeFileSync(join(idea, "RUNBOOK-TRACKER.md"), readFileSync(join(FIXTURES, "sample-tracker.md"), "utf8"));
  return root;
}

describe("inferTargetIcFromGoal", () => {
  it("maps blog/copy/article to copy-chief", () => {
    expect(inferTargetIcFromGoal("write a short blog article")).toBe("copy-chief");
    expect(inferTargetIcFromGoal("need copy for the landing page")).toBe("copy-chief");
  });

  it("returns undefined when no heuristic matches", () => {
    expect(inferTargetIcFromGoal("what is the current blocker")).toBeUndefined();
  });
});

describe("resolveWorkTarget", () => {
  it("routes IC slug to reporting manager", () => {
    const root = tempRepo();
    const r = resolveWorkTarget(root, { position: "copy-chief", goal: "Write blog" });
    expect(r.intakeSeat).toBe("cmo");
    expect(r.targetIc).toBe("copy-chief");
    expect(r.goal).toContain("Write blog");
    expect(r.spoken).toMatch(/cmo/i);
  });

  it("keeps manager slug as intake", () => {
    const root = tempRepo();
    const r = resolveWorkTarget(root, { position: "cmo", goal: "Ship campaign" });
    expect(r.intakeSeat).toBe("cmo");
    expect(r.targetIc).toBeUndefined();
  });

  it("maps spoken C-suite to ceo-strategist intake", () => {
    const root = tempRepo();
    const r = resolveWorkTarget(root, {
      position: "C-suite",
      goal: "review the project",
    });
    expect(r.intakeSeat).toBe("ceo-strategist");
    expect(r.spoken).toMatch(/ceo-strategist/i);
  });

  it("infers copy-chief from blog goal text", () => {
    const root = tempRepo();
    const r = resolveWorkTarget(root, { goal: "Maybe create a short blog article" });
    expect(r.targetIc).toBe("copy-chief");
    expect(r.intakeSeat).toBe("cmo");
  });
});

describe("work intake session", () => {
  beforeEach(() => resetSessionForTests());
  afterEach(() => resetSessionForTests());

  it("stores and clears intake answers", () => {
    setWorkIntake("room-a", {
      intakeSeat: "cmo",
      targetIc: "copy-chief",
      goal: "blog",
      answers: { audience: "founders", length: "short" },
    });
    expect(getWorkIntake("room-a")?.answers.length).toBe("short");
    clearWorkIntake("room-a");
    expect(getWorkIntake("room-a")).toBeUndefined();
  });

  it("merges intake into goal", () => {
    const goal = mergeWorkGoal("Write blog", { audience: "founders", tone: "direct" });
    expect(goal).toContain("Write blog");
    expect(goal).toContain("audience: founders");
    expect(goal).toContain("tone: direct");
  });
});
