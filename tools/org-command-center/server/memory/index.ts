import { loadSnapshot } from "../snapshot";
import { activeProjectSlug, loadRegistry } from "../paths";
import { appendMemoryNote, readMemorySnippets, writeSessionDigestFile } from "./fs-store";
import { grepRecallMemory } from "./grep-recall";
import {
  buildNoteDoc,
  chromaHeartbeat,
  queryMemoryDocs,
  reindexProjectFromFs,
  upsertMemoryDocs,
} from "./chroma-index";
import { loadRecentRunLines } from "./run-lifecycle";
import { buildSessionDigestMarkdown } from "./session-digest";
import { composeMemoryBrief, speakMemoryBrief } from "./situation";
import type { MemoryBrief, MemoryNoteKind, MemoryRecallHit } from "./types";

function summarizeRecall(query: string, hits: MemoryRecallHit[]): string {
  if (hits.length === 0) {
    return `No memory matches for "${query}".`;
  }
  const top = hits[0].text.split("\n").map((l) => l.trim()).filter(Boolean)[0] ?? hits[0].text.trim();
  const snippet = top.length > 100 ? `${top.slice(0, 97)}...` : top;
  if (hits.length === 1) {
    return `Found 1 match: ${snippet}`;
  }
  return `Found ${hits.length} matches; top: ${snippet}`;
}

export async function memoryNote(
  repoRoot: string,
  args: {
    text: string;
    kind?: MemoryNoteKind;
    entityId?: string;
  },
): Promise<{ path: string; kind: MemoryNoteKind; indexed: boolean }> {
  const kind = args.kind ?? "note";
  const { path, kind: writtenKind } = appendMemoryNote(repoRoot, {
    kind,
    text: args.text,
    entityId: args.entityId,
  });

  let indexed = false;
  try {
    const slug = activeProjectSlug(repoRoot);
    const doc = buildNoteDoc(slug, path, args.text, writtenKind);
    await upsertMemoryDocs([doc]);
    indexed = true;
  } catch (err) {
    console.warn("[memory] chroma upsert failed:", err instanceof Error ? err.message : err);
  }

  return { path, kind: writtenKind, indexed };
}

export async function memoryRecall(
  repoRoot: string,
  args: {
    query: string;
    limit?: number;
  },
): Promise<{ hits: MemoryRecallHit[]; via: "chroma" | "grep"; summary: string }> {
  const query = args.query.trim();
  const limit = args.limit ?? 5;

  try {
    const chromaUp = await chromaHeartbeat();
    if (chromaUp) {
      const slug = activeProjectSlug(repoRoot);
      const hits = await queryMemoryDocs({ project: slug, query, limit });
      return { hits, via: "chroma", summary: summarizeRecall(query, hits) };
    }
  } catch (err) {
    console.warn("[memory] chroma recall failed:", err instanceof Error ? err.message : err);
  }

  const hits = grepRecallMemory(repoRoot, query, limit);
  return { hits, via: "grep", summary: summarizeRecall(query, hits) };
}

export async function memoryBrief(repoRoot: string): Promise<MemoryBrief & { spoken: string }> {
  const snap = loadSnapshot(repoRoot);
  const snippets = readMemorySnippets(repoRoot);
  const brief = composeMemoryBrief({
    recentSessionLines: snippets.recentSessionLines,
    decisionLines: snippets.decisionLines,
    preferenceLines: snippets.preferenceLines,
    mission: {
      idea: snap.mission.idea,
      currentPhase: snap.mission.currentPhase,
      currentPhaseName: snap.mission.currentPhaseName,
      nextAction: snap.mission.nextAction,
      blockerCount: snap.mission.blockerCount,
    },
    recentRunLines: loadRecentRunLines(repoRoot),
  });
  return { ...brief, spoken: speakMemoryBrief(brief) };
}

function missionLineFromSnapshot(snap: ReturnType<typeof loadSnapshot>): string {
  const phase = snap.mission.currentPhaseName
    ? `Phase ${snap.mission.currentPhase} — ${snap.mission.currentPhaseName}`
    : `Phase ${snap.mission.currentPhase}`;
  const next = snap.mission.nextAction.trim();
  return next ? `${phase}: ${next}` : phase;
}

export async function memoryDigest(
  repoRoot: string,
  args?: {
    summary?: string;
  },
): Promise<{ path: string; indexed: boolean; spoken: string }> {
  const at = new Date();
  const snap = loadSnapshot(repoRoot);
  const reg = loadRegistry(repoRoot);
  const slug = reg.active;
  const ventureName = reg.projects[slug]?.name ?? slug;
  const snippets = readMemorySnippets(repoRoot);
  const runLines = loadRecentRunLines(repoRoot, 10);
  const noteLines = [
    ...snippets.noteLines.slice(-10),
    ...snippets.decisionLines.slice(-5),
  ];

  const markdown = buildSessionDigestMarkdown({
    ventureName,
    slug,
    at,
    operatorSummary: args?.summary,
    missionLine: missionLineFromSnapshot(snap),
    runLines,
    noteLines,
  });

  const { path } = writeSessionDigestFile(repoRoot, markdown, at);

  let indexed = false;
  try {
    const doc = buildNoteDoc(slug, path, markdown, "session", at.toISOString());
    await upsertMemoryDocs([doc]);
    indexed = true;
  } catch (err) {
    console.warn("[memory] chroma digest upsert failed:", err instanceof Error ? err.message : err);
  }

  const relName = path.split("/").pop() ?? path;
  return {
    path,
    indexed,
    spoken: `Session digest saved to ${relName}.`,
  };
}

export async function memoryReindex(repoRoot: string): Promise<{ count: number }> {
  const slug = activeProjectSlug(repoRoot);
  return reindexProjectFromFs(repoRoot, slug);
}
