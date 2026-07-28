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
import type { ProjectRegistry } from "../paths";
import {
  appendLifecycleLine,
  appendMemoryNote,
  readMemorySnippets,
  resolveMemoryRoot,
  writeSessionDigestFile,
} from "./fs-store";

function seedActiveVenture(active = "a"): string {
  const root = mkdtempSync(join(tmpdir(), "occ-fs-memory-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "docs/projects/a/MEMORY"), { recursive: true });
  const reg: ProjectRegistry = {
    active,
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

describe("resolveMemoryRoot", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("returns active venture memory paths", () => {
    root = seedActiveVenture();
    const resolved = resolveMemoryRoot(root);
    expect(resolved.slug).toBe("a");
    expect(resolved.relDir).toBe("docs/projects/a/MEMORY");
    expect(resolved.absDir).toBe(join(root, "docs/projects/a/MEMORY"));
  });
});

describe("appendMemoryNote", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("appendMemoryNote writes notes.md under active venture", () => {
    root = seedActiveVenture();
    const ts = "2026-07-17T12:00:00.000Z";
    const result = appendMemoryNote(root, {
      kind: "note",
      text: "MOF-303 is lead sorbent",
      ts,
    });
    expect(result.kind).toBe("note");
    expect(result.path).toBe("docs/projects/a/MEMORY/notes.md");
    const content = readFileSync(join(root, result.path), "utf8");
    expect(content).toContain("## 2026-07-17");
    expect(content).toContain("MOF-303 is lead sorbent");
  });

  it("writes decision row to decisions.md", () => {
    root = seedActiveVenture();
    const result = appendMemoryNote(root, {
      kind: "decision",
      text: "Use nickel foam for condenser",
      ts: "2026-07-17T10:00:00.000Z",
    });
    expect(result.path).toBe("docs/projects/a/MEMORY/decisions.md");
    const content = readFileSync(join(root, result.path), "utf8");
    expect(content).toMatch(/\| date \| decision \| rationale \|/);
    expect(content).toContain("Use nickel foam for condenser");
    expect(content).toContain("| 2026-07-17 |");
  });

  it("writes preference bullet to preferences.md", () => {
    root = seedActiveVenture();
    const result = appendMemoryNote(root, {
      kind: "preference",
      text: "Prefer concise session digests",
    });
    expect(result.path).toBe("docs/projects/a/MEMORY/preferences.md");
    const content = readFileSync(join(root, result.path), "utf8");
    expect(content).toContain("- Prefer concise session digests");
  });

  it("entity kind requires entityId and writes entities/<id>.md", () => {
    root = seedActiveVenture();
    expect(() =>
      appendMemoryNote(root, { kind: "entity", text: "Competitor X" }),
    ).toThrow(/entityId required/i);

    const result = appendMemoryNote(root, {
      kind: "entity",
      entityId: "MOF 303",
      text: "Lead sorbent candidate",
    });
    expect(result.path).toBe("docs/projects/a/MEMORY/entities/mof-303.md");
    expect(existsSync(join(root, result.path))).toBe(true);
    const content = readFileSync(join(root, result.path), "utf8");
    expect(content).toContain("Lead sorbent candidate");
  });

  it("lifecycle kind delegates to appendLifecycleLine", () => {
    root = seedActiveVenture();
    const result = appendMemoryNote(root, {
      kind: "lifecycle",
      text: "run_abc failed acceptance: missing inbox",
      ts: "2026-07-17T15:00:00.000Z",
    });
    expect(result.path).toMatch(/sessions\/2026-07-17\.md$/);
    const content = readFileSync(join(root, result.path), "utf8");
    expect(content).toContain("run_abc failed acceptance: missing inbox");
  });

  it("never writes to context.md", () => {
    root = seedActiveVenture();
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/context.md"),
      "# Operator context\n\nDo not overwrite.\n",
      "utf8",
    );
    appendMemoryNote(root, { kind: "note", text: "New note" });
    const ctx = readFileSync(join(root, "docs/projects/a/MEMORY/context.md"), "utf8");
    expect(ctx).toBe("# Operator context\n\nDo not overwrite.\n");
  });
});

describe("appendLifecycleLine", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("appendLifecycleLine creates sessions/YYYY-MM-DD.md", () => {
    root = seedActiveVenture();
    const result = appendLifecycleLine(
      root,
      "run_1 done seat=head-of-research acceptance=ok",
      "2026-07-17",
    );
    expect(result.path).toBe("docs/projects/a/MEMORY/sessions/2026-07-17.md");
    const content = readFileSync(join(root, result.path), "utf8");
    expect(content).toContain("run_1 done seat=head-of-research acceptance=ok");
  });
});

describe("writeSessionDigestFile", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("writes sessions/YYYY-MM-DD-HHmm.md", () => {
    root = seedActiveVenture();
    const at = new Date("2026-07-17T14:35:00.000Z");
    const result = writeSessionDigestFile(root, "# Session digest\n\nDone things.", at);
    expect(result.path).toMatch(/sessions\/2026-07-17-\d{4}\.md$/);
    const content = readFileSync(join(root, result.path), "utf8");
    expect(content).toContain("Done things.");
  });
});

describe("readMemorySnippets", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("reads snippets from memory files including context.md", () => {
    root = seedActiveVenture();
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/context.md"),
      `# Venture context

## Operator note

Operator context note about TEBS.

## Sources digest

<!-- auto:sources-digest -->
- fake source
<!-- /auto:sources-digest -->
`,
      "utf8",
    );
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/notes.md"),
      "## 2026-07-16\n- Yesterday note\n",
      "utf8",
    );
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/decisions.md"),
      "| date | decision | rationale |\n|------|----------|-----------|\n| 2026-07-15 | MOF lead | - |\n",
      "utf8",
    );
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/preferences.md"),
      "- Keep digests short\n",
      "utf8",
    );
    mkdirSync(join(root, "docs/projects/a/MEMORY/sessions"), { recursive: true });
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/sessions/2026-07-17.md"),
      "- Intake completed\n",
      "utf8",
    );

    const snippets = readMemorySnippets(root);
    expect(snippets.noteLines.some((l) => /TEBS/.test(l))).toBe(true);
    expect(snippets.noteLines.some((l) => /Yesterday note/.test(l))).toBe(true);
    expect(snippets.noteLines.some((l) => /auto:sources-digest|<!--/.test(l))).toBe(false);
    expect(snippets.noteLines.some((l) => /fake source/.test(l))).toBe(false);
    expect(snippets.decisionLines.some((l) => /MOF lead/.test(l))).toBe(true);
    expect(snippets.preferenceLines.some((l) => /digests short/.test(l))).toBe(true);
    expect(snippets.recentSessionLines.some((l) => /Intake completed/.test(l))).toBe(true);
  });
});
