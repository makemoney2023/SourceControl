import type { HandoffRecord, PhaseRow } from "../lib/types";
import {
  DEFAULT_BUSINESS_IDEA_REL,
  resolveArtifactPath,
} from "../lib/project-paths";

export interface ArtifactItem {
  path: string;
  phase: string;
  status: string;
}

function normalizeArtifact(artifact: string, businessIdeaRel: string): string[] {
  if (!artifact || artifact === "—") return [];
  return artifact
    .split("+")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => resolveArtifactPath(p, businessIdeaRel));
}

export function indexArtifacts(
  phases: Pick<PhaseRow, "phase" | "artifact" | "status">[],
  handoffs: Pick<HandoffRecord, "phase" | "status" | "artifacts">[],
  businessIdeaRel = DEFAULT_BUSINESS_IDEA_REL,
): ArtifactItem[] {
  const map = new Map<string, ArtifactItem>();
  for (const p of phases) {
    for (const path of normalizeArtifact(p.artifact, businessIdeaRel)) {
      if (!map.has(path)) {
        map.set(path, { path, phase: p.phase, status: p.status });
      }
    }
  }
  for (const h of handoffs) {
    for (const a of h.artifacts) {
      if (!map.has(a.path)) {
        map.set(a.path, { path: a.path, phase: h.phase, status: h.status });
      }
    }
  }
  return [...map.values()].sort((a, b) => a.path.localeCompare(b.path));
}
