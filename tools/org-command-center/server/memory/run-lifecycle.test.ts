import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { RunRecord } from "../../src/lib/runs";
import type { ProjectRegistry } from "../paths";
import { formatRunLifecycleLine, loadRecentRunLines, recordRunLifecycle } from "./run-lifecycle";

function seedRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-run-lifecycle-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "docs/projects/a/MEMORY/sessions"), { recursive: true });
  const reg: ProjectRegistry = {
    active: "a",
    projects: {
      a: {
        name: "Alpha",
        businessIdea: "docs/projects/a/business-idea",
        memory: "docs/projects/a/MEMORY",
      },
    },
  };
  writeFileSync(join(root, "projects/registry.json"), JSON.stringify(reg, null, 2));
  return root;
}

describe("formatRunLifecycleLine", () => {
  it("formats completed run with acceptance ok", () => {
    const line = formatRunLifecycleLine({
      runId: "run_abc",
      status: "completed",
      position: "head-of-research",
      phase: "2",
      claimed: "x.yaml",
      dispatch_filename: "x.yaml",
      wake_reason: "on_demand",
      started_at: "2026-07-17T12:00:00.000Z",
      acceptance: { ok: true, missing: [], checkedAt: "2026-07-17T12:05:00.000Z" },
    });
    expect(line).toBe("run run_abc completed seat=head-of-research acceptance ok");
  });

  it("formats completed_with_gaps with acceptance gap details", () => {
    const line = formatRunLifecycleLine({
      runId: "run_1",
      status: "completed_with_gaps",
      position: "cmo",
      phase: "2",
      claimed: "y.yaml",
      dispatch_filename: "y.yaml",
      wake_reason: "on_demand",
      started_at: "2026-07-17T12:00:00.000Z",
      acceptance: {
        ok: false,
        missing: ["missing inbox"],
        checkedAt: "2026-07-17T12:05:00.000Z",
      },
    });
    expect(line).toBe(
      "run run_1 completed_with_gaps seat=cmo acceptance gap: missing inbox",
    );
  });

  it("formats error run without acceptance", () => {
    const line = formatRunLifecycleLine({
      runId: "run_err",
      status: "error",
      position: "ceo-strategist",
      phase: "1",
      claimed: "z.yaml",
      dispatch_filename: "z.yaml",
      wake_reason: "on_demand",
      started_at: "2026-07-17T12:00:00.000Z",
      error: "adapter failed",
    });
    expect(line).toBe("run run_err error seat=ceo-strategist");
  });
});

describe("recordRunLifecycle", () => {
  let root = "";

  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("appends lifecycle line to sessions day file", () => {
    root = seedRepo();
    const run: RunRecord = {
      runId: "run_abc",
      status: "completed_with_gaps",
      position: "head-of-research",
      phase: "2",
      claimed: "x.yaml",
      dispatch_filename: "x.yaml",
      wake_reason: "on_demand",
      started_at: "2026-07-17T12:00:00.000Z",
      finished_at: "2026-07-17T12:05:00.000Z",
      llm_model: "composer-2.5",
      acceptance: {
        ok: false,
        missing: ["missing inbox"],
        checkedAt: "2026-07-17T12:05:00.000Z",
      },
    };

    recordRunLifecycle(root, run);

    const dayPath = join(root, "docs/projects/a/MEMORY/sessions/2026-07-17.md");
    expect(existsSync(dayPath)).toBe(true);
    const content = readFileSync(dayPath, "utf8");
    expect(content).toMatch(/run run_abc completed_with_gaps/);
    expect(content).toMatch(/acceptance gap: missing inbox/);
  });

  it("does not throw when registry is invalid", () => {
    root = mkdtempSync(join(tmpdir(), "occ-run-lifecycle-bad-"));
    expect(() =>
      recordRunLifecycle(root, {
        runId: "run_x",
        status: "completed",
        position: "cmo",
        phase: "2",
        claimed: "x.yaml",
        dispatch_filename: "x.yaml",
        wake_reason: "on_demand",
        started_at: "2026-07-17T12:00:00.000Z",
        llm_model: "composer-2.5",
      }),
    ).not.toThrow();
  });
});

describe("loadRecentRunLines", () => {
  let root = "";

  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("returns formatted lines for finished runs newest first", () => {
    root = seedRepo();
    mkdirSync(join(root, "docs/projects/a/business-idea/DISPATCH/runs"), { recursive: true });
    const runsDir = join(root, "docs/projects/a/business-idea/DISPATCH/runs");
    writeFileSync(
      join(runsDir, "1-old.json"),
      JSON.stringify({
        runId: "run_old",
        status: "completed",
        position: "cmo",
        phase: "2",
        claimed: "a.yaml",
        dispatch_filename: "a.yaml",
        wake_reason: "on_demand",
        started_at: "2026-07-16T12:00:00.000Z",
        finished_at: "2026-07-16T12:05:00.000Z",
        llm_model: "composer-2.5",
        acceptance: { ok: true, missing: [], checkedAt: "2026-07-16T12:05:00.000Z" },
      }),
    );
    writeFileSync(
      join(runsDir, "2-new.json"),
      JSON.stringify({
        runId: "run_new",
        status: "completed_with_gaps",
        position: "head-of-research",
        phase: "2",
        claimed: "b.yaml",
        dispatch_filename: "b.yaml",
        wake_reason: "on_demand",
        started_at: "2026-07-17T12:00:00.000Z",
        finished_at: "2026-07-17T12:05:00.000Z",
        llm_model: "composer-2.5",
        acceptance: {
          ok: false,
          missing: ["missing inbox"],
          checkedAt: "2026-07-17T12:05:00.000Z",
        },
      }),
    );

    const lines = loadRecentRunLines(root, 5);
    expect(lines[0]).toMatch(/run_new/);
    expect(lines[0]).toMatch(/acceptance gap: missing inbox/);
    expect(lines.some((l) => /run_old/.test(l))).toBe(true);
  });
});
