import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, normalize, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_INITIATIVE_SLUG,
  DEFAULT_ORG_SLUG,
  flatProjectsView,
  getCustomerMain,
  getInitiative,
  listCustomers,
  normalizeRegistry,
  type ActiveRef,
  type InitiativeEntry,
  type PortfolioRegistry,
  type ProjectEntry,
  type ProjectRegistry,
} from "./portfolio-registry";

export type {
  ActiveRef,
  InitiativeEntry,
  PortfolioRegistry,
  ProjectEntry,
  ProjectRegistry,
} from "./portfolio-registry";

export {
  DEFAULT_INITIATIVE_NAME,
  DEFAULT_INITIATIVE_SLUG,
  DEFAULT_ORG_NAME,
  DEFAULT_ORG_SLUG,
  flatProjectsView,
  getCustomerMain,
  getInitiative,
  listCustomers,
  listInitiatives,
  migrateFlatToPortfolio,
} from "./portfolio-registry";

const READ_PREFIXES = [
  "skills/org/",
  "docs/projects/",
  "docs/orgs/",
  "memorybank/org/",
  "templates/business-idea/",
  "projects/",
  "apps/",
  "design-system/",
];

export function resolveRepoRoot(from = fileURLToPath(import.meta.url)): string {
  let dir = dirname(from);
  for (let i = 0; i < 8; i++) {
    if (
      existsSync(join(dir, "skills/org/ORG-REGISTRY.md")) &&
      (existsSync(join(dir, "projects/registry.json")) ||
        existsSync(join(dir, "docs/projects")) ||
        existsSync(join(dir, "docs/business-idea")))
    ) {
      return dir;
    }
    dir = dirname(dir);
  }
  throw new Error("Could not locate ClaudeSkills repo root from " + from);
}

export function registryPath(repoRoot: string): string {
  return join(repoRoot, "projects/registry.json");
}

export function loadRegistry(repoRoot: string): PortfolioRegistry {
  const path = registryPath(repoRoot);
  if (!existsSync(path)) {
    throw new Error(`Missing projects/registry.json under ${repoRoot}`);
  }
  const raw = JSON.parse(readFileSync(path, "utf8")) as unknown;
  const { registry, migrated } = normalizeRegistry(raw);
  if (migrated) {
    saveRegistry(repoRoot, registry);
  }
  return registry;
}

export function saveRegistry(repoRoot: string, reg: PortfolioRegistry): void {
  const { registry } = normalizeRegistry(reg);
  writeFileSync(registryPath(repoRoot), JSON.stringify(registry, null, 2) + "\n", "utf8");
}

export function activeRef(repoRoot: string): ActiveRef {
  return loadRegistry(repoRoot).active;
}

/** Compat: returns active customer slug (was venture slug). */
export function activeProjectSlug(repoRoot: string): string {
  return activeRef(repoRoot).customer;
}

export function activeInitiativeSlug(repoRoot: string): string {
  return activeRef(repoRoot).initiative;
}

/**
 * Slug for apps/design-system/<venture> and skill `<active>` artifact trees.
 * Non-main initiatives use the initiative slug so packets do not target the
 * customer's main (e.g. kennel website) tree.
 */
export function activeArtifactSlug(repoRoot: string): string {
  const ref = activeRef(repoRoot);
  return ref.initiative && ref.initiative !== "main" ? ref.initiative : ref.customer;
}

export function listProjects(repoRoot: string): { slug: string; name: string }[] {
  return listCustomers(loadRegistry(repoRoot));
}

function resolveEntry(
  repoRoot: string,
  slug?: string,
): { entry: InitiativeEntry; ref: ActiveRef } {
  const reg = loadRegistry(repoRoot);
  if (!slug || slug === reg.active.customer) {
    const resolved = getInitiative(reg);
    return { entry: resolved.entry, ref: resolved.ref };
  }
  // Legacy: slug is customer → main initiative
  const resolved = getCustomerMain(reg, slug, DEFAULT_ORG_SLUG);
  return { entry: resolved.entry, ref: resolved.ref };
}

/** Relative business-idea dir for active initiative, or customer slug → main. */
export function businessIdeaRel(repoRoot: string, slug?: string): string {
  return resolveEntry(repoRoot, slug).entry.businessIdea.replace(/\/+$/, "");
}

/** Absolute business-idea root. */
export function businessIdeaRoot(repoRoot: string, slug?: string): string {
  return join(repoRoot, businessIdeaRel(repoRoot, slug));
}

/** Relative path under active (or given) business-idea, POSIX separators. */
export function businessIdeaFile(repoRoot: string, subpath: string, slug?: string): string {
  const base = businessIdeaRel(repoRoot, slug);
  const cleaned = subpath.replace(/^\/+/, "");
  return `${base}/${cleaned}`;
}

export function memoryRel(repoRoot: string, slug?: string): string {
  return resolveEntry(repoRoot, slug).entry.memory.replace(/\/+$/, "");
}

export function memoryDir(repoRoot: string, slug?: string): string {
  return join(repoRoot, memoryRel(repoRoot, slug));
}

/** Compat projection: customer → main initiative as ProjectEntry. */
export function projectsMap(repoRoot: string): Record<string, ProjectEntry> {
  return flatProjectsView(loadRegistry(repoRoot));
}

function toRel(repoRoot: string, relPath: string): string {
  const cleaned = relPath.replace(/^\/+/, "");
  if (cleaned.split(/[/\\]/).includes("..")) {
    throw new Error(`Path escapes repo root: ${relPath}`);
  }
  const abs = resolve(repoRoot, cleaned);
  const rel = relative(repoRoot, abs);
  if (rel.startsWith("..") || rel.includes(`..${sep}`) || normalize(rel).startsWith("..")) {
    throw new Error(`Path escapes repo root: ${relPath}`);
  }
  if (rel.includes("\0")) throw new Error("Invalid path");
  return rel.split(sep).join("/");
}

function isWritableRel(rel: string): boolean {
  if (rel === "projects/registry.json") return true;
  if (/^docs\/projects\/[^/]+\/business-idea\/RUNBOOK-TRACKER\.md$/.test(rel)) return true;
  if (/^docs\/projects\/[^/]+\/business-idea\/DISPATCH\//.test(rel)) return true;
  if (/^docs\/projects\/[^/]+\/business-idea\/BRIEFINGS\//.test(rel)) return true;
  if (/^docs\/projects\/[^/]+\/business-idea\/HANDOFFS\//.test(rel)) return true;
  if (/^docs\/projects\/[^/]+\/business-idea\/REVIEW\/inbox\//.test(rel)) return true;
  if (/^docs\/projects\/[^/]+\/business-idea\/SOURCES\//.test(rel)) return true;
  if (/^docs\/projects\/[^/]+\/MEMORY\//.test(rel)) return true;
  // Nested org/customer/initiative paths
  if (
    /^docs\/orgs\/[^/]+\/customers\/[^/]+\/initiatives\/[^/]+\/business-idea\/RUNBOOK-TRACKER\.md$/.test(
      rel,
    )
  ) {
    return true;
  }
  if (/^docs\/orgs\/[^/]+\/customers\/[^/]+\/initiatives\/[^/]+\/business-idea\/DISPATCH\//.test(rel)) {
    return true;
  }
  if (/^docs\/orgs\/[^/]+\/customers\/[^/]+\/initiatives\/[^/]+\/business-idea\/BRIEFINGS\//.test(rel)) {
    return true;
  }
  if (/^docs\/orgs\/[^/]+\/customers\/[^/]+\/initiatives\/[^/]+\/business-idea\/HANDOFFS\//.test(rel)) {
    return true;
  }
  if (
    /^docs\/orgs\/[^/]+\/customers\/[^/]+\/initiatives\/[^/]+\/business-idea\/REVIEW\/inbox\//.test(rel)
  ) {
    return true;
  }
  if (/^docs\/orgs\/[^/]+\/customers\/[^/]+\/initiatives\/[^/]+\/business-idea\/SOURCES\//.test(rel)) {
    return true;
  }
  if (/^docs\/orgs\/[^/]+\/customers\/[^/]+\/initiatives\/[^/]+\/MEMORY\//.test(rel)) {
    return true;
  }
  // Vault is SoT; OCC paths are usually symlinks into these prefixes.
  if (/^memorybank\/org\/[^/]+\/(HANDOFFS|BRIEFINGS|REVIEW|MEMORY|phases)\//.test(rel)) {
    return true;
  }
  if (
    /^memorybank\/org\/[^/]+\/[^/]+\/[^/]+\/(HANDOFFS|BRIEFINGS|REVIEW|MEMORY|phases)\//.test(rel)
  ) {
    return true;
  }
  return false;
}

export function assertReadable(repoRoot: string, relPath: string): string {
  const rel = toRel(repoRoot, relPath);
  const ok =
    READ_PREFIXES.some((p) => rel === p.slice(0, -1) || rel.startsWith(p)) ||
    rel === "projects/registry.json";
  if (!ok) throw new Error(`Path not on read allowlist: ${rel}`);
  return resolve(repoRoot, rel);
}

/** Jarvis file.read — active initiative business-idea only. */
export function assertJarvisReadable(repoRoot: string, relPath: string): string {
  if (isAbsolute(relPath)) {
    const abs = resolve(relPath);
    const relFromRoot = relative(repoRoot, abs);
    if (
      relFromRoot.startsWith("..") ||
      relFromRoot.includes(`..${sep}`) ||
      normalize(relFromRoot).startsWith("..")
    ) {
      throw new Error(`Path escapes repo root: ${relPath}`);
    }
  }
  const rel = toRel(repoRoot, relPath);
  const prefix = businessIdeaRel(repoRoot);
  const ok = rel === prefix || rel.startsWith(`${prefix}/`);
  if (!ok) throw new Error(`Path not on Jarvis read allowlist: ${rel}`);
  return resolve(repoRoot, rel);
}

export function assertWritable(repoRoot: string, relPath: string): string {
  const rel = toRel(repoRoot, relPath);
  if (!isWritableRel(rel)) throw new Error(`Path not on write allowlist: ${rel}`);
  return resolve(repoRoot, rel);
}

export function dispatchRoot(repoRoot: string, slug?: string) {
  return join(businessIdeaRoot(repoRoot, slug), "DISPATCH");
}

export function trackerPath(repoRoot: string, slug?: string) {
  return join(businessIdeaRoot(repoRoot, slug), "RUNBOOK-TRACKER.md");
}

export function handoffsDir(repoRoot: string, slug?: string) {
  return join(businessIdeaRoot(repoRoot, slug), "HANDOFFS");
}

export function briefingsDir(repoRoot: string, slug?: string) {
  return join(businessIdeaRoot(repoRoot, slug), "BRIEFINGS");
}

export function reviewInboxDir(repoRoot: string, slug?: string) {
  return join(businessIdeaRoot(repoRoot, slug), "REVIEW", "inbox");
}

export function reviewInboxRel(repoRoot: string, slug?: string) {
  return businessIdeaFile(repoRoot, "REVIEW/inbox/", slug).replace(/\/$/, "");
}

export function sourcesDir(repoRoot: string, slug?: string) {
  return join(businessIdeaRoot(repoRoot, slug), "SOURCES");
}

export function initiativePaths(
  org: string,
  customer: string,
  initiative: string,
): { businessIdea: string; memory: string } {
  const base = `docs/orgs/${org}/customers/${customer}/initiatives/${initiative}`;
  return {
    businessIdea: `${base}/business-idea`,
    memory: `${base}/MEMORY`,
  };
}
