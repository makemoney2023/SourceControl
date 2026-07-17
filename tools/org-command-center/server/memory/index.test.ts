import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectRegistry } from "../paths";
import * as chromaIndex from "./chroma-index";
import { memoryDigest, memoryNote, memoryRecall, memoryReindex } from "./index";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "../../src/lib/fixtures");
const BIZ_IDEA = "docs/projects/a/business-idea";

function seedRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-memory-index-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "skills/org"), { recursive: true });
  mkdirSync(join(root, "docs/projects/a/MEMORY"), { recursive: true });
  writeFileSync(
    join(root, "skills/org/ORG-REGISTRY.md"),
    readFileSync(join(FIXTURES, "sample-org-registry.md"), "utf8"),
  );
  writeFileSync(
    join(root, "skills/org/MODEL-REGISTRY.md"),
    readFileSync(join(FIXTURES, "sample-model-registry.md"), "utf8"),
  );
  const reg: ProjectRegistry = {
    active: "a",
    projects: {
      a: {
        name: "Alpha",
        businessIdea: BIZ_IDEA,
        memory: "docs/projects/a/MEMORY",
      },
    },
  };
  writeFileSync(join(root, "projects/registry.json"), JSON.stringify(reg, null, 2));
  const idea = join(root, BIZ_IDEA);
  mkdirSync(join(idea, "DISPATCH/queue"), { recursive: true });
  mkdirSync(join(idea, "DISPATCH/claimed"), { recursive: true });
  mkdirSync(join(idea, "DISPATCH/runs"), { recursive: true });
  mkdirSync(join(idea, "HANDOFFS"), { recursive: true });
  writeFileSync(join(idea, "RUNBOOK-TRACKER.md"), readFileSync(join(FIXTURES, "sample-tracker.md"), "utf8"));
  return root;
}

describe("memoryNote chroma integration", () => {
  let root = "";
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("still writes FS note when chroma upsert throws", async () => {
    root = seedRepo();
    vi.spyOn(chromaIndex, "upsertMemoryDocs").mockRejectedValue(new Error("chroma down"));

    const result = await memoryNote(root, { text: "MOF-303 is lead sorbent" });

    expect(result.kind).toBe("note");
    expect(result.indexed).toBe(false);
    expect(result.path).toBe("docs/projects/a/MEMORY/notes.md");
    expect(existsSync(join(root, result.path))).toBe(true);
    const content = readFileSync(join(root, result.path), "utf8");
    expect(content).toContain("MOF-303 is lead sorbent");
  });

  it("sets indexed true when chroma upsert succeeds", async () => {
    root = seedRepo();
    vi.spyOn(chromaIndex, "upsertMemoryDocs").mockResolvedValue(undefined);

    const result = await memoryNote(root, { text: "Indexed note" });
    expect(result.indexed).toBe(true);
    expect(chromaIndex.upsertMemoryDocs).toHaveBeenCalledOnce();
  });
});

describe("memoryRecall chroma integration", () => {
  let root = "";
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("falls back to grep when chroma query throws", async () => {
    root = seedRepo();
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/notes.md"),
      "## 2026-07-17\n- MOF-303 is lead sorbent\n",
    );
    vi.spyOn(chromaIndex, "chromaHeartbeat").mockResolvedValue(true);
    vi.spyOn(chromaIndex, "queryMemoryDocs").mockRejectedValue(new Error("chroma query failed"));

    const result = await memoryRecall(root, { query: "MOF sorbent" });

    expect(result.via).toBe("grep");
    expect(result.hits.length).toBeGreaterThan(0);
    expect(result.summary).toMatch(/match/i);
  });

  it("uses grep when chroma heartbeat is false", async () => {
    root = seedRepo();
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/notes.md"),
      "## 2026-07-17\n- MOF-303 is lead sorbent\n",
    );
    vi.spyOn(chromaIndex, "chromaHeartbeat").mockResolvedValue(false);
    const querySpy = vi.spyOn(chromaIndex, "queryMemoryDocs");

    const result = await memoryRecall(root, { query: "MOF sorbent" });

    expect(result.via).toBe("grep");
    expect(result.hits.length).toBeGreaterThan(0);
    expect(querySpy).not.toHaveBeenCalled();
  });

  it("returns chroma hits when heartbeat and query succeed", async () => {
    root = seedRepo();
    vi.spyOn(chromaIndex, "chromaHeartbeat").mockResolvedValue(true);
    vi.spyOn(chromaIndex, "queryMemoryDocs").mockResolvedValue([
      {
        text: "MOF-303 is lead sorbent",
        path: "docs/projects/a/MEMORY/notes.md",
        kind: "note",
        score: 0.9,
      },
    ]);

    const result = await memoryRecall(root, { query: "MOF sorbent" });

    expect(result.via).toBe("chroma");
    expect(result.hits).toHaveLength(1);
    expect(result.hits[0].text).toMatch(/MOF-303/i);
  });
});

describe("memoryDigest", () => {
  let root = "";
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("writes session digest file and returns spoken summary", async () => {
    root = seedRepo();
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/notes.md"),
      "## 2026-07-17\n- MOF-303 is lead sorbent\n",
    );
    vi.spyOn(chromaIndex, "upsertMemoryDocs").mockResolvedValue(undefined);

    const result = await memoryDigest(root, { summary: "Evidence review done." });

    expect(result.path).toMatch(/docs\/projects\/a\/MEMORY\/sessions\/\d{4}-\d{2}-\d{2}-\d{4}\.md$/);
    expect(existsSync(join(root, result.path))).toBe(true);
    const content = readFileSync(join(root, result.path), "utf8");
    expect(content).toMatch(/Evidence review done/);
    expect(content).toMatch(/MOF-303/);
    expect(result.spoken).toMatch(/digest saved/i);
    expect(result.indexed).toBe(true);
  });

  it("still writes digest when chroma upsert fails", async () => {
    root = seedRepo();
    vi.spyOn(chromaIndex, "upsertMemoryDocs").mockRejectedValue(new Error("chroma down"));

    const result = await memoryDigest(root);

    expect(result.indexed).toBe(false);
    expect(existsSync(join(root, result.path))).toBe(true);
  });
});

describe("memoryReindex", () => {
  let root = "";

  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it("delegates to reindexProjectFromFs for active slug", async () => {
    root = seedRepo();
    const spy = vi.spyOn(chromaIndex, "reindexProjectFromFs").mockResolvedValue({ count: 7 });
    const result = await memoryReindex(root);
    expect(result.count).toBe(7);
    expect(spy).toHaveBeenCalledWith(root, "a");
  });
});
