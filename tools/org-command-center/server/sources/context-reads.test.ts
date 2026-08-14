import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { briefJaccard } from "../../src/lib/handoff-discipline";
import type { ProjectRegistry } from "../paths";
import { appendVentureContextReads } from "./context-reads";
import { uploadSource } from "./store";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../../..");

function operatorBrief(md: string): string {
  const m = md.match(
    /## Operator brief \(plain English\)\n([\s\S]*?)(?=\n## )/,
  );
  return m?.[1]?.trim() ?? "";
}

function seedActiveVenture(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-context-reads-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "docs/projects/a/business-idea/DISPATCH/queue"), { recursive: true });
  mkdirSync(join(root, "docs/projects/a/MEMORY"), { recursive: true });
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

async function seedWithThreeSources(): Promise<string> {
  const root = seedActiveVenture();
  for (const name of ["one.md", "two.md", "three.md"]) {
    await uploadSource(root, {
      filename: name,
      bytes: Buffer.from(`# ${name}`, "utf8"),
    });
  }
  return root;
}

function seedWithContextOnly(): string {
  const root = seedActiveVenture();
  writeFileSync(
    join(root, "docs/projects/a/MEMORY/context.md"),
    "# Context\n\nOperator note here.\n",
    "utf8",
  );
  return root;
}

describe("appendVentureContextReads", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("prepends context + index + up to 3 extracts before caller paths", async () => {
    root = await seedWithThreeSources();
    const out = appendVentureContextReads(root, ["skills/org/MODEL-REGISTRY.md"]);
    expect(out[0]).toMatch(/MEMORY\/context\.md$/);
    expect(out[1]).toMatch(/SOURCES\/INDEX\.md$/);
    expect(out.filter((p) => p.includes("SOURCES/") && p !== out[1]).length).toBeLessThanOrEqual(3);
    expect(out.at(-1)).toBe("skills/org/MODEL-REGISTRY.md");
  });

  it("dedupes if caller already included context.md", () => {
    root = seedWithContextOnly();
    const ctx = "docs/projects/a/MEMORY/context.md";
    const out = appendVentureContextReads(root, [ctx, "x.md"]);
    expect(out.filter((p) => p === ctx)).toHaveLength(1);
  });

  it("prepends MEMORY/decisions.md when present", () => {
    root = seedWithContextOnly();
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/decisions.md"),
      "# Decisions\n",
      "utf8",
    );
    const out = appendVentureContextReads(root, []);
    expect(out[0]).toMatch(/MEMORY\/context\.md$/);
    expect(out[1]).toMatch(/MEMORY\/decisions\.md$/);
  });

  it("prepends handoff-good then handoff-bad after decisions.md when present", () => {
    root = seedWithContextOnly();
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/decisions.md"),
      "# Decisions\n",
      "utf8",
    );
    mkdirSync(join(root, "skills/org/examples"), { recursive: true });
    writeFileSync(join(root, "skills/org/examples/handoff-good.md"), "# good\n", "utf8");
    writeFileSync(join(root, "skills/org/examples/handoff-bad.md"), "# bad\n", "utf8");
    const out = appendVentureContextReads(root, []);
    expect(out[0]).toMatch(/MEMORY\/context\.md$/);
    expect(out[1]).toMatch(/MEMORY\/decisions\.md$/);
    expect(out[2]).toBe("skills/org/examples/handoff-good.md");
    expect(out[3]).toBe("skills/org/examples/handoff-bad.md");
  });

  it("scores real handoff-good vs handoff-bad below the echo threshold", () => {
    const good = operatorBrief(
      readFileSync(join(REPO_ROOT, "skills/org/examples/handoff-good.md"), "utf8"),
    );
    const bad = operatorBrief(
      readFileSync(join(REPO_ROOT, "skills/org/examples/handoff-bad.md"), "utf8"),
    );
    expect(good.length).toBeGreaterThan(0);
    expect(bad.length).toBeGreaterThan(0);
    expect(briefJaccard(good, bad)).toBeLessThan(0.35);
  });
});
