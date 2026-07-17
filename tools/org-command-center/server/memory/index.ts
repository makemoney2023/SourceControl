import { loadSnapshot } from "../snapshot";
import { appendMemoryNote, readMemorySnippets } from "./fs-store";
import { grepRecallMemory } from "./grep-recall";
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
  return { path, kind: writtenKind, indexed: false };
}

export async function memoryRecall(
  repoRoot: string,
  args: {
    query: string;
    limit?: number;
  },
): Promise<{ hits: MemoryRecallHit[]; via: "chroma" | "grep"; summary: string }> {
  const query = args.query.trim();
  const hits = grepRecallMemory(repoRoot, query, args.limit ?? 5);
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
    recentRunLines: [],
  });
  return { ...brief, spoken: speakMemoryBrief(brief) };
}
