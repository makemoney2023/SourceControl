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
import { seedContextMd } from "../sources/context-md";
import { uploadSource } from "../sources/store";
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

  it("returns mission and spoken brief for agent opener", async () => {
    repo = tempRepo();
    const ctx = await buildJarvisContext(repo);
    expect(ctx.mission).toMatchObject({ idea: "Test Widget", currentPhase: "2" });
    expect(ctx.spokenBrief).toMatch(/Phase 2|next is/i);
    expect(typeof ctx.spokenBrief).toBe("string");
    expect(ctx.spokenBrief.length).toBeGreaterThan(0);
    expect(ctx.contextNote).toBe("");
    expect(ctx.sourcesCount).toBe(0);
  });

  it("prefers Phase 0 roundtable pulse over stale mission next-action", async () => {
    repo = tempRepo();
    writeFileSync(
      join(repo, BIZ_IDEA, "DISPATCH/phase0-roundtable.json"),
      JSON.stringify({
        venture: "passive-grid",
        status: "done",
        pulse: "Phase 0 C-suite roundtable done — verdict approve.",
        ceoIntakeRunId: "run-1",
        peerRunIds: {},
        peerBriefs: {},
        startedAt: "2026-07-17T00:00:00.000Z",
        updatedAt: "2026-07-17T00:01:00.000Z",
      }),
      "utf8",
    );
    const ctx = await buildJarvisContext(repo);
    expect(ctx.spokenBrief).toMatch(/Phase 0 is done|C-suite says approve|roundtable done/i);
    expect(ctx.spokenBrief).not.toMatch(/^Next is Phase 0 Intake/i);
  });

  it("when Phase 0 is done, spoken brief is plain English not peer jargon", async () => {
    repo = tempRepo();
    mkdirSync(join(repo, BIZ_IDEA, "HANDOFFS"), { recursive: true });
    writeFileSync(
      join(repo, BIZ_IDEA, "HANDOFFS/0-csuite-review.md"),
      [
        "---",
        "verdict: approve",
        "---",
        "",
        "## Peer briefs present",
        "| Seat | Brief | Peer recommendation | Load-bearing stance |",
        "|------|-------|---------------------|---------------------|",
        "| cfo | yes | approve | Unit economics mid-case five dollars |",
        "| cmo | yes | approve | Event booth positioning |",
        "",
        "## Comments for manager / company",
        "- Geography and permits remain open before any sale.",
        "",
      ].join("\n"),
      "utf8",
    );
    writeFileSync(
      join(repo, BIZ_IDEA, "DISPATCH/phase0-roundtable.json"),
      JSON.stringify({
        venture: "passive-grid",
        status: "done",
        pulse: "Phase 0 C-suite roundtable done — verdict approve.",
        ceoIntakeRunId: "run-1",
        peerRunIds: {},
        peerBriefs: {},
        startedAt: "2026-07-17T00:00:00.000Z",
        updatedAt: "2026-07-17T00:01:00.000Z",
      }),
      "utf8",
    );
    const ctx = await buildJarvisContext(repo);
    expect(ctx.spokenBrief).toMatch(/C-suite says approve/i);
    expect(ctx.spokenBrief).toMatch(/Geography and permits|Phase 1/i);
    expect(ctx.spokenBrief).not.toMatch(/Unit economics mid-case|Event booth positioning/i);
    expect(ctx.spokenBrief).not.toBe(
      "Phase 0 C-suite roundtable done — verdict approve.",
    );
  });

  it("uses memory brief when decisions exist in MEMORY", async () => {
    repo = tempRepo();
    const memoryDir = join(repo, "docs/projects/passive-grid/MEMORY");
    mkdirSync(memoryDir, { recursive: true });
    writeFileSync(
      join(memoryDir, "decisions.md"),
      "| date | decision | rationale |\n| --- | --- | --- |\n| 2026-07-17 | MOF-303 is lead sorbent | evidence |\n",
      "utf8",
    );

    const ctx = await buildJarvisContext(repo);
    expect(ctx.spokenBrief).toMatch(/next is/i);
    expect(ctx.spokenBrief).not.toMatch(/[*`#]/);
  });

  it("exposes contextNote, sourcesCount, and spoken clause when note set", async () => {
    repo = tempRepo();
    mkdirSync(join(repo, "docs/projects/passive-grid/MEMORY"), { recursive: true });
    writeFileSync(
      join(repo, "docs/projects/passive-grid/MEMORY/context.md"),
      seedContextMd("Operator guidance for passive grid."),
      "utf8",
    );
    await uploadSource(repo, {
      filename: "brief.md",
      bytes: Buffer.from("# Brief\n", "utf8"),
    });
    await uploadSource(repo, {
      filename: "notes.md",
      bytes: Buffer.from("# Notes\n", "utf8"),
    });

    const ctx = await buildJarvisContext(repo);
    expect(ctx.contextNote).toBe("Operator guidance for passive grid.");
    expect(ctx.sourcesCount).toBe(2);
    expect(ctx.spokenBrief).toMatch(/2 sources attached/);
    expect(ctx.spokenBrief).not.toMatch(/Context note on file/);
  });

  it("truncates contextNote to 500 characters", async () => {
    repo = tempRepo();
    mkdirSync(join(repo, "docs/projects/passive-grid/MEMORY"), { recursive: true });
    writeFileSync(
      join(repo, "docs/projects/passive-grid/MEMORY/context.md"),
      seedContextMd("x".repeat(600)),
      "utf8",
    );

    const ctx = await buildJarvisContext(repo);
    expect(ctx.contextNote).toHaveLength(500);
    // Long filler notes are not appended to spoken wake speech.
    expect(ctx.spokenBrief).not.toMatch(/Context note on file/);
  });

  it("mentions sources when uploads exist without an operator note", async () => {
    repo = tempRepo();
    await uploadSource(repo, {
      filename: "brief.md",
      bytes: Buffer.from("# Brief\n", "utf8"),
    });

    const ctx = await buildJarvisContext(repo);
    expect(ctx.contextNote).toBe("");
    expect(ctx.sourcesCount).toBe(1);
    expect(ctx.spokenBrief).toMatch(/1 source attached/);
    expect(ctx.spokenBrief).not.toMatch(/Context note on file/);
  });
});
