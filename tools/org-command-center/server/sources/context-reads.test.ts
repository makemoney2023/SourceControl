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
import { appendVentureContextReads } from "./context-reads";
import { uploadSource } from "./store";

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
});
