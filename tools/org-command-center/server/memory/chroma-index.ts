import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { ChromaClient, type Collection } from "chromadb";
import { activeProjectSlug } from "../paths";
import { resolveMemoryRoot } from "./fs-store";
import { chromaUrl, parseChromaUrl } from "./chroma-process";
import type { MemoryNoteKind, MemoryRecallHit } from "./types";

export const COLLECTION_NAME = "jarvis_memory";

export type ChromaDoc = {
  id: string;
  document: string;
  metadata: { project: string; path: string; kind: string; ts: string };
};

type ChromaClientFactory = () => Promise<ChromaClient>;

let clientFactoryOverride: ChromaClientFactory | null = null;
let collectionPromise: Promise<Collection> | null = null;

export function formatMemoryDocId(project: string, relPath: string, chunkIndex: number): string {
  return `${project}:${relPath}#${chunkIndex}`;
}

export function buildNoteDoc(
  project: string,
  relPath: string,
  text: string,
  kind: MemoryNoteKind,
  ts?: string,
): ChromaDoc {
  return {
    id: formatMemoryDocId(project, relPath, 0),
    document: text.trim(),
    metadata: {
      project,
      path: relPath,
      kind,
      ts: ts ?? new Date().toISOString(),
    },
  };
}

export function __setChromaClientFactoryForTests(factory: ChromaClientFactory | null): void {
  clientFactoryOverride = factory;
  collectionPromise = null;
}

async function getChromaClient(): Promise<ChromaClient> {
  if (clientFactoryOverride) {
    return clientFactoryOverride();
  }
  const { host, port, ssl } = parseChromaUrl(chromaUrl());
  return new ChromaClient({ host, port, ssl });
}

async function getCollection(): Promise<Collection> {
  if (!collectionPromise) {
    collectionPromise = (async () => {
      const client = await getChromaClient();
      return client.getOrCreateCollection({ name: COLLECTION_NAME });
    })();
  }
  return collectionPromise;
}

export async function chromaHeartbeat(): Promise<boolean> {
  try {
    const client = await getChromaClient();
    await client.heartbeat();
    return true;
  } catch {
    return false;
  }
}

export async function upsertMemoryDocs(docs: ChromaDoc[]): Promise<void> {
  if (docs.length === 0) return;
  const collection = await getCollection();
  await collection.upsert({
    ids: docs.map((d) => d.id),
    documents: docs.map((d) => d.document),
    metadatas: docs.map((d) => d.metadata),
  });
}

function mapQueryResults(
  documents: (string | null)[][] | null | undefined,
  metadatas: Record<string, unknown>[][] | null | undefined,
  distances: number[][] | null | undefined,
): MemoryRecallHit[] {
  const hits: MemoryRecallHit[] = [];
  const docs = documents?.[0] ?? [];
  const metas = metadatas?.[0] ?? [];
  const dists = distances?.[0] ?? [];

  for (let i = 0; i < docs.length; i++) {
    const text = docs[i];
    if (!text) continue;
    const meta = metas[i] ?? {};
    const path = String(meta.path ?? "");
    const kindRaw = String(meta.kind ?? "unknown");
    const kind = (["note", "decision", "preference", "entity", "lifecycle", "session"].includes(kindRaw)
      ? kindRaw
      : "unknown") as MemoryRecallHit["kind"];
    const distance = dists[i];
    hits.push({
      text,
      path,
      kind,
      score: distance !== undefined ? 1 / (1 + distance) : undefined,
    });
  }
  return hits;
}

export async function queryMemoryDocs(args: {
  project: string;
  query: string;
  limit?: number;
}): Promise<MemoryRecallHit[]> {
  const collection = await getCollection();
  const result = await collection.query({
    queryTexts: [args.query],
    nResults: args.limit ?? 5,
    where: { project: args.project },
    include: ["documents", "metadatas", "distances"],
  });
  return mapQueryResults(result.documents, result.metadatas, result.distances);
}

export async function deleteProjectDocs(project: string): Promise<void> {
  const collection = await getCollection();
  await collection.delete({ where: { project } });
}

const SKIP_DIRS = new Set([".chroma"]);
const CHUNK_SIZE = 800;

function inferKindFromPath(relPath: string): string {
  const normalized = relPath.replace(/\\/g, "/");
  if (normalized.endsWith("notes.md")) return "note";
  if (normalized.endsWith("decisions.md")) return "decision";
  if (normalized.endsWith("preferences.md")) return "preference";
  if (normalized.includes("/entities/")) return "entity";
  if (normalized.includes("/sessions/")) {
    const base = normalized.split("/").pop() ?? "";
    if (/^\d{4}-\d{2}-\d{2}\.md$/.test(base)) return "lifecycle";
    return "session";
  }
  return "unknown";
}

function walkMarkdownFiles(absDir: string, relDir: string): { abs: string; rel: string }[] {
  const files: { abs: string; rel: string }[] = [];

  function walk(currentAbs: string, currentRel: string): void {
    let entries: string[];
    try {
      entries = readdirSync(currentAbs);
    } catch {
      return;
    }

    for (const name of entries) {
      if (SKIP_DIRS.has(name)) continue;
      const abs = join(currentAbs, name);
      const rel = currentRel ? `${currentRel}/${name}` : name;
      let stat;
      try {
        stat = statSync(abs);
      } catch {
        continue;
      }
      if (stat.isDirectory()) {
        walk(abs, rel);
      } else if (name.endsWith(".md")) {
        files.push({ abs, rel });
      }
    }
  }

  walk(absDir, "");
  return files;
}

function chunkText(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length <= CHUNK_SIZE) return [trimmed];

  const chunks: string[] = [];
  const paragraphs = trimmed.split(/\n{2,}/);
  let current = "";

  for (const para of paragraphs) {
    const next = current ? `${current}\n\n${para}` : para;
    if (next.length <= CHUNK_SIZE) {
      current = next;
      continue;
    }
    if (current) chunks.push(current);
    if (para.length <= CHUNK_SIZE) {
      current = para;
    } else {
      for (let i = 0; i < para.length; i += CHUNK_SIZE) {
        chunks.push(para.slice(i, i + CHUNK_SIZE));
      }
      current = "";
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function fileToDocs(project: string, memoryRelDir: string, relFile: string, absFile: string): ChromaDoc[] {
  const content = readFileSync(absFile, "utf8");
  const chunks = chunkText(content);
  const relPath = `${memoryRelDir}/${relFile}`.replace(/\/+/g, "/");
  const kind = inferKindFromPath(relPath);
  const ts = new Date().toISOString();
  return chunks.map((document, chunkIndex) => ({
    id: formatMemoryDocId(project, relPath, chunkIndex),
    document,
    metadata: { project, path: relPath, kind, ts },
  }));
}

export async function reindexProjectFromFs(
  repoRoot: string,
  project?: string,
): Promise<{ count: number }> {
  const slug = project ?? activeProjectSlug(repoRoot);
  const { absDir, relDir } = resolveMemoryRoot(repoRoot, slug);
  const files = walkMarkdownFiles(absDir, "");
  const docs: ChromaDoc[] = [];

  for (const { abs, rel } of files) {
    docs.push(...fileToDocs(slug, relDir, rel, abs));
  }

  await deleteProjectDocs(slug);
  if (docs.length > 0) {
    await upsertMemoryDocs(docs);
  }
  return { count: docs.length };
}
