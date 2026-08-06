const VENTURE_MD =
  /^docs\/projects\/([^/]+)\/(?:business-idea\/(HANDOFFS|BRIEFINGS|REVIEW\/inbox)\/(.+\.md)|MEMORY\/(.+\.md)|business-idea\/([^/]+\.md))$/;

const SKIP_PHASE_NAMES = new Set([
  "readme.md",
  "runbook-tracker.md",
  "operator-launch-blockers.md",
  "org-registry.md",
]);

/** Map a repo-relative path to a vault-relative Obsidian path, or null if out of scope. */
export function repoRelToVaultPath(repoRel: string): string | null {
  const rel = repoRel.replace(/\\/g, "/").replace(/^\.\//, "");
  const m = rel.match(VENTURE_MD);
  if (!m) return null;
  const venture = m[1];
  if (m[2] && m[3]) {
    // HANDOFFS | BRIEFINGS | REVIEW/inbox
    return `org/${venture}/${m[2]}/${m[3]}`;
  }
  if (m[4]) {
    return `org/${venture}/MEMORY/${m[4]}`;
  }
  if (m[5]) {
    const base = m[5];
    if (SKIP_PHASE_NAMES.has(base.toLowerCase())) return null;
    // Only numbered / phase-like markdown at business-idea root
    if (!/^\d/.test(base) && !/^(00-intake|prd)/i.test(base)) return null;
    return `org/${venture}/phases/${base}`;
  }
  return null;
}

export function shouldSyncRepoRel(repoRel: string): boolean {
  return repoRelToVaultPath(repoRel) != null;
}

export function listSyncRelPaths(repoRels: string[]): string[] {
  return repoRels.filter(shouldSyncRepoRel);
}
