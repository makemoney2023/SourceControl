import { resolvePhaseOwner } from "./parse-registry";
import {
  loadSeatOutputPaths,
  mergeUniquePaths,
} from "./seat-outputs";
import type { OrgRegistry } from "./types";

export type PhaseIcLease = {
  position: string;
  write_lease: string[];
};

export type BuildPhaseIcLeasesResult =
  | { ok: true; leases: PhaseIcLease[] }
  | { ok: false; error: string; collisions: string[] };

/**
 * Build non-overlapping write_lease subsets for each maySpawn IC on a phase.
 * Used for Phase 17 dual-lease (lifecycle email/html vs content social).
 */
export function buildPhaseIcLeases(
  repoRoot: string,
  org: OrgRegistry,
  phase: string,
  opts?: { ventureSlug?: string; businessIdeaRel?: string },
): BuildPhaseIcLeasesResult {
  const owner = resolvePhaseOwner(org, phase);
  if (!owner) {
    return { ok: false, error: `unknown_phase:${phase}`, collisions: [] };
  }
  const ics = owner.maySpawn.filter(Boolean);
  if (!ics.length) {
    return { ok: true, leases: [] };
  }

  const leases: PhaseIcLease[] = ics.map((position) => ({
    position,
    write_lease: loadSeatOutputPaths(repoRoot, position, opts),
  }));

  const seen = new Map<string, string>();
  const collisions: string[] = [];
  for (const lease of leases) {
    for (const path of lease.write_lease) {
      const norm = path.replace(/\/+$/, "");
      const prior = seen.get(norm);
      if (prior && prior !== lease.position) {
        collisions.push(`${norm} (${prior} ∩ ${lease.position})`);
      } else {
        seen.set(norm, lease.position);
      }
    }
  }

  if (collisions.length) {
    return {
      ok: false,
      error: "write_lease_collision",
      collisions,
    };
  }

  return { ok: true, leases };
}

/** Merge manager lease with a preferred IC subset when dual-lease is ok. */
export function attachPreferredIcLeaseHint(
  managerLease: string[],
  icLeases: PhaseIcLease[],
  preferredIc?: string,
): string[] {
  if (!preferredIc) return managerLease;
  const ic = icLeases.find((l) => l.position === preferredIc);
  if (!ic) return managerLease;
  return mergeUniquePaths(managerLease, ic.write_lease);
}
