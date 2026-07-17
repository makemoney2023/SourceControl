import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { ProjectRegistry } from "../paths";
import { appendMemoryNote } from "./fs-store";
import { grepRecallMemory } from "./grep-recall";

function seedActiveVenture(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-grep-recall-"));
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

describe("grepRecallMemory", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("returns hits for matching tokens across memory files", () => {
    root = seedActiveVenture();
    appendMemoryNote(root, {
      kind: "decision",
      text: "MOF-303 is the lead sorbent",
      ts: "2026-07-17T10:00:00.000Z",
    });
    appendMemoryNote(root, {
      kind: "preference",
      text: "Prefer nickel foam condenser",
    });
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/context.md"),
      "Operator note about TEBS evidence gaps.",
      "utf8",
    );

    const hits = grepRecallMemory(root, "MOF sorbent", 5);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => /MOF-303|sorbent/i.test(h.text))).toBe(true);
    expect(hits[0].path).toMatch(/MEMORY\//);
    expect(hits[0].score).toBeGreaterThan(0);
  });

  it("includes context.md in search", () => {
    root = seedActiveVenture();
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/context.md"),
      "Critical TEBS citation backlog for Phase 2.",
      "utf8",
    );

    const hits = grepRecallMemory(root, "TEBS Phase", 3);
    expect(hits.some((h) => /TEBS/.test(h.text))).toBe(true);
    expect(hits.some((h) => h.path.endsWith("context.md"))).toBe(true);
  });

  it("skips .chroma directory during walk", () => {
    root = seedActiveVenture();
    mkdirSync(join(root, "docs/projects/a/MEMORY/.chroma/index"), { recursive: true });
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/.chroma/index/secret.md"),
      "MOF-303 chroma index secret",
      "utf8",
    );
    appendMemoryNote(root, {
      kind: "note",
      text: "MOF-303 visible in notes",
      ts: "2026-07-17T12:00:00.000Z",
    });

    const hits = grepRecallMemory(root, "MOF-303", 5);
    expect(hits.every((h) => !h.path.includes(".chroma"))).toBe(true);
    expect(hits.some((h) => /visible in notes/.test(h.text))).toBe(true);
  });

  it("respects limit and ignores short query tokens", () => {
    root = seedActiveVenture();
    for (let i = 0; i < 8; i++) {
      appendMemoryNote(root, {
        kind: "note",
        text: `Evidence item number ${i} about condenser design`,
        ts: "2026-07-17T12:00:00.000Z",
      });
    }

    const hits = grepRecallMemory(root, "condenser design evidence", 3);
    expect(hits.length).toBeLessThanOrEqual(3);
    expect(hits.every((h) => h.score !== undefined)).toBe(true);
  });

  it("returns empty array when no tokens qualify", () => {
    root = seedActiveVenture();
    appendMemoryNote(root, { kind: "note", text: "hello world", ts: "2026-07-17T12:00:00.000Z" });
    expect(grepRecallMemory(root, "a")).toEqual([]);
  });
});
