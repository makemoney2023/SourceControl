import { isProductionAssetPath } from "../lib/file-preview";
import type { HandoffRecord, PhaseRow } from "../lib/types";
import {
  DEFAULT_BUSINESS_IDEA_REL,
  resolveArtifactPath,
} from "../lib/project-paths";

export interface ArtifactItem {
  path: string;
  phase: string;
  status: string;
  seat?: string;
  handoffFilename?: string;
  notes?: string;
  exists?: boolean;
  reviewStatus?: string;
  expected?: boolean;
  matchedExpectation?: boolean;
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
  handoffs: (Pick<
    HandoffRecord,
    "phase" | "status" | "artifacts" | "position" | "filename"
  > &
    Partial<Pick<HandoffRecord, "productionPaths">>)[],
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
      const existing = map.get(a.path);
      if (!existing) {
        map.set(a.path, {
          path: a.path,
          phase: h.phase,
          status: h.status,
          seat: h.position,
          handoffFilename: h.filename,
          notes: a.notes || undefined,
        });
      } else {
        map.set(a.path, {
          ...existing,
          seat: existing.seat ?? h.position,
          handoffFilename: existing.handoffFilename ?? h.filename,
          notes: existing.notes || a.notes || undefined,
        });
      }
    }
    for (const raw of h.productionPaths ?? []) {
      const path = resolveArtifactPath(raw, businessIdeaRel);
      const existing = map.get(path);
      if (!existing) {
        map.set(path, {
          path,
          phase: h.phase,
          status: h.status,
          seat: h.position,
          handoffFilename: h.filename,
          notes: "production",
        });
      }
    }
  }
  return [...map.values()].sort((a, b) => a.path.localeCompare(b.path));
}

/** Production / Layer B assets only — excludes craft handoffs and MEMORY. */
export function indexProductionArtifacts(
  phases: Pick<PhaseRow, "phase" | "artifact" | "status">[],
  handoffs: (Pick<
    HandoffRecord,
    "phase" | "status" | "artifacts" | "position" | "filename"
  > &
    Partial<Pick<HandoffRecord, "productionPaths">>)[],
  businessIdeaRel = DEFAULT_BUSINESS_IDEA_REL,
): ArtifactItem[] {
  return indexArtifacts(phases, handoffs, businessIdeaRel).filter((item) =>
    isProductionAssetPath(item.path),
  );
}
