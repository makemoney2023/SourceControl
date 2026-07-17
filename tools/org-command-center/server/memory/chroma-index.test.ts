import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ProjectRegistry } from "../paths";
import { chromaUrl, parseChromaUrl } from "./chroma-process";
import {
  __setChromaClientFactoryForTests,
  buildNoteDoc,
  chromaHeartbeat,
  formatMemoryDocId,
  queryMemoryDocs,
  reindexProjectFromFs,
  upsertMemoryDocs,
} from "./chroma-index";

describe("formatMemoryDocId", () => {
  it("formats id as slug:relPath#chunkIndex", () => {
    expect(formatMemoryDocId("passive-grid", "docs/projects/passive-grid/MEMORY/notes.md", 0)).toBe(
      "passive-grid:docs/projects/passive-grid/MEMORY/notes.md#0",
    );
    expect(formatMemoryDocId("a", "docs/projects/a/MEMORY/notes.md", 2)).toBe(
      "a:docs/projects/a/MEMORY/notes.md#2",
    );
  });
});

describe("buildNoteDoc", () => {
  it("builds metadata with project path kind and ts", () => {
    const doc = buildNoteDoc(
      "passive-grid",
      "docs/projects/passive-grid/MEMORY/notes.md",
      "MOF-303 is lead sorbent",
      "note",
      "2026-07-17T12:00:00.000Z",
    );
    expect(doc.id).toBe("passive-grid:docs/projects/passive-grid/MEMORY/notes.md#0");
    expect(doc.document).toBe("MOF-303 is lead sorbent");
    expect(doc.metadata).toEqual({
      project: "passive-grid",
      path: "docs/projects/passive-grid/MEMORY/notes.md",
      kind: "note",
      ts: "2026-07-17T12:00:00.000Z",
    });
  });
});

describe("parseChromaUrl", () => {
  it("defaults to localhost:8000", () => {
    const prev = process.env.CHROMA_URL;
    delete process.env.CHROMA_URL;
    expect(parseChromaUrl()).toEqual({ host: "127.0.0.1", port: 8000, ssl: false });
    if (prev) process.env.CHROMA_URL = prev;
  });

  it("parses custom CHROMA_URL", () => {
    expect(parseChromaUrl("http://localhost:9000")).toEqual({
      host: "localhost",
      port: 9000,
      ssl: false,
    });
  });
});

describe("chromaHeartbeat", () => {
  afterEach(() => {
    __setChromaClientFactoryForTests(null);
  });

  it("returns false when client heartbeat throws", async () => {
    __setChromaClientFactoryForTests(async () => ({
      heartbeat: vi.fn().mockRejectedValue(new Error("connection refused")),
    }) as never);
    await expect(chromaHeartbeat()).resolves.toBe(false);
  });

  it("returns true when client heartbeat succeeds", async () => {
    __setChromaClientFactoryForTests(async () => ({
      heartbeat: vi.fn().mockResolvedValue(Date.now()),
    }) as never);
    await expect(chromaHeartbeat()).resolves.toBe(true);
  });
});

describe("upsertMemoryDocs with mock client", () => {
  afterEach(() => {
    __setChromaClientFactoryForTests(null);
  });

  it("upserts through collection handle", async () => {
    const upsert = vi.fn().mockResolvedValue(undefined);
    __setChromaClientFactoryForTests(async () => ({
      getOrCreateCollection: vi.fn().mockResolvedValue({ upsert, query: vi.fn(), delete: vi.fn() }),
    }) as never);

    const doc = buildNoteDoc("a", "docs/projects/a/MEMORY/notes.md", "test note", "note");
    await upsertMemoryDocs([doc]);

    expect(upsert).toHaveBeenCalledWith({
      ids: [doc.id],
      documents: [doc.document],
      metadatas: [doc.metadata],
    });
  });
});

describe("reindexProjectFromFs with mock client", () => {
  let root = "";
  afterEach(() => {
    __setChromaClientFactoryForTests(null);
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("chunks markdown files and upserts docs for active project", async () => {
    root = mkdtempSync(join(tmpdir(), "occ-chroma-reindex-"));
    mkdirSync(join(root, "projects"), { recursive: true });
    mkdirSync(join(root, "docs/projects/a/MEMORY/sessions"), { recursive: true });
    writeFileSync(join(root, "docs/projects/a/MEMORY/notes.md"), "- MOF-303 is lead sorbent\n");
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

    const upsert = vi.fn().mockResolvedValue(undefined);
    const del = vi.fn().mockResolvedValue(undefined);
    __setChromaClientFactoryForTests(async () => ({
      getOrCreateCollection: vi.fn().mockResolvedValue({
        upsert,
        delete: del,
        query: vi.fn(),
      }),
    }) as never);

    const result = await reindexProjectFromFs(root, "a");
    expect(result.count).toBe(1);
    expect(del).toHaveBeenCalledWith({ where: { project: "a" } });
    expect(upsert).toHaveBeenCalled();
  });
});

describe("chroma integration", () => {
  const runLive = process.env.JARVIS_CHROMA_TEST === "1";

  it.skipIf(!runLive)("upserts and queries against live local Chroma", async () => {
    __setChromaClientFactoryForTests(null);
    const project = `itest-${Date.now()}`;
    const doc = buildNoteDoc(
      project,
      `docs/projects/${project}/MEMORY/notes.md`,
      "MOF-303 is the lead sorbent for passive grid harvester",
      "note",
    );
    await upsertMemoryDocs([doc]);
    const hits = await queryMemoryDocs({ project, query: "lead sorbent MOF", limit: 3 });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].text).toMatch(/MOF-303/i);
    expect(hits[0].path).toContain("notes.md");
  });
});

describe("chromaUrl", () => {
  it("reads CHROMA_URL when set", () => {
    const prev = process.env.CHROMA_URL;
    process.env.CHROMA_URL = "http://127.0.0.1:9001";
    expect(chromaUrl()).toBe("http://127.0.0.1:9001");
    if (prev) process.env.CHROMA_URL = prev;
    else delete process.env.CHROMA_URL;
  });
});
