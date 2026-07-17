import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, normalize, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export type ProjectEntry = {
  name: string;
  businessIdea: string;
  memory: string;
};

export type ProjectRegistry = {
  active: string;
  projects: Record<string, ProjectEntry>;
};

const READ_PREFIXES = [
  "skills/org/",
  "docs/projects/",
  "templates/business-idea/",
  "projects/",
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

export function loadRegistry(repoRoot: string): ProjectRegistry {
  const path = registryPath(repoRoot);
  if (!existsSync(path)) {
    throw new Error(`Missing projects/registry.json under ${repoRoot}`);
  }
  const raw = JSON.parse(readFileSync(path, "utf8")) as ProjectRegistry;
  if (!raw.active || !raw.projects?.[raw.active]) {
    throw new Error(`Invalid registry: active "${raw.active}" not in projects`);
  }
  return raw;
}

export function saveRegistry(repoRoot: string, reg: ProjectRegistry): void {
  if (!reg.projects[reg.active]) {
    throw new Error(`Cannot set active to unknown project: ${reg.active}`);
  }
  writeFileSync(registryPath(repoRoot), JSON.stringify(reg, null, 2) + "\n", "utf8");
}

export function activeProjectSlug(repoRoot: string): string {
  return loadRegistry(repoRoot).active;
}

export function listProjects(repoRoot: string): { slug: string; name: string }[] {
  const reg = loadRegistry(repoRoot);
  return Object.entries(reg.projects).map(([slug, p]) => ({ slug, name: p.name }));
}

/** Relative business-idea dir for slug (default: active). */
export function businessIdeaRel(repoRoot: string, slug?: string): string {
  const reg = loadRegistry(repoRoot);
  const s = slug ?? reg.active;
  const entry = reg.projects[s];
  if (!entry) throw new Error(`Unknown project slug: ${s}`);
  return entry.businessIdea.replace(/\/+$/, "");
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
  const reg = loadRegistry(repoRoot);
  const s = slug ?? reg.active;
  const entry = reg.projects[s];
  if (!entry) throw new Error(`Unknown project slug: ${s}`);
  return entry.memory.replace(/\/+$/, "");
}

export function memoryDir(repoRoot: string, slug?: string): string {
  return join(repoRoot, memoryRel(repoRoot, slug));
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
  if (/^docs\/projects\/[^/]+\/MEMORY\//.test(rel)) return true;
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

/** Jarvis file.read — active venture business-idea only (includes HANDOFFS, BRIEFINGS, etc.). */
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
