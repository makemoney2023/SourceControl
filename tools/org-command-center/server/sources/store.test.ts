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
import { MAX_SOURCE_BYTES } from "./extract";
import { appendVentureContextReads } from "./context-reads";
import {
  deleteSource,
  listSources,
  newestExtractRels,
  uploadSource,
} from "./store";

function seedActiveVenture(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-sources-"));
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

describe("store", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("uploads md as self-extract and refreshes INDEX + digest", async () => {
    root = seedActiveVenture();
    const { record, warning } = await uploadSource(root, {
      filename: "brief.md",
      bytes: Buffer.from("# Brief\nImportant fact", "utf8"),
    });
    expect(warning).toBeUndefined();
    expect(record.extractRel).toBe("self");
    expect(existsSync(join(root, record.originalRel))).toBe(true);
    const listed = listSources(root);
    expect(listed.sources).toHaveLength(1);
    expect(listed.contextNote).toBeDefined();
    const ctx = readFileSync(join(root, "docs/projects/a/MEMORY/context.md"), "utf8");
    expect(ctx).toContain(record.id);
  });

  it("rejects oversized and bad extension", async () => {
    root = seedActiveVenture();
    await expect(
      uploadSource(root, { filename: "x.exe", bytes: Buffer.from("x") }),
    ).rejects.toThrow(/unsupported_type|unsupported/i);
    const big = Buffer.alloc(MAX_SOURCE_BYTES + 1);
    await expect(
      uploadSource(root, { filename: "big.md", bytes: big }),
    ).rejects.toThrow(/too_large/i);
  });

  it("delete removes files and digest entry", async () => {
    root = seedActiveVenture();
    const { record } = await uploadSource(root, {
      filename: "a.md",
      bytes: Buffer.from("hi", "utf8"),
    });
    deleteSource(root, record.id);
    expect(listSources(root).sources).toHaveLength(0);
  });

  it("newestExtractRels skips citation-only INDEX rows without file paths", () => {
    root = seedActiveVenture();
    mkdirSync(join(root, "docs/projects/a/business-idea/SOURCES"), {
      recursive: true,
    });
    // Manual research citations (url/title only) share INDEX.md with file uploads.
    writeFileSync(
      join(root, "docs/projects/a/business-idea/SOURCES/INDEX.md"),
      [
        "# Sources index",
        "",
        "```json",
        JSON.stringify(
          [
            {
              id: "src-001",
              title: "Market report",
              url: "https://example.com/report",
              type: "market_report",
            },
          ],
          null,
          2,
        ),
        "```",
        "",
      ].join("\n"),
      "utf8",
    );
    expect(() => newestExtractRels(root, 3)).not.toThrow();
    expect(newestExtractRels(root, 3)).toEqual([]);
    expect(() =>
      appendVentureContextReads(root, ["skills/org/MODEL-REGISTRY.md"]),
    ).not.toThrow();
  });
});
