import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { loadRegistry, saveRegistry, type ProjectRegistry } from "./paths";

const SLUG_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

export function slugifyVentureName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  if (!slug || !SLUG_RE.test(slug)) {
    throw new Error(`Cannot derive a valid slug from name: "${name}"`);
  }
  return slug;
}

export type CreateVentureInput = {
  name: string;
  slug?: string;
  /** Default true — switch Situation Room to the new venture. */
  activate?: boolean;
};

export type CreateVentureResult = {
  slug: string;
  name: string;
  businessIdea: string;
  memory: string;
  active: string;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function copyFirstExisting(candidates: string[], to: string) {
  if (existsSync(to)) return;
  for (const from of candidates) {
    if (existsSync(from)) {
      mkdirSync(join(to, ".."), { recursive: true });
      copyFileSync(from, to);
      return;
    }
  }
}

function seedTracker(repoRoot: string, bi: string, name: string) {
  const template = join(repoRoot, "templates/business-idea/RUNBOOK-TRACKER.md");
  const dest = join(bi, "RUNBOOK-TRACKER.md");
  const date = today();
  if (existsSync(template)) {
    let md = readFileSync(template, "utf8");
    md = md.replace(/\*\*Idea:\*\*.*/, `**Idea:** ${name}`);
    md = md.replace(/\*\*Started:\*\*.*/, `**Started:** ${date}`);
    md = md.replace(/\*\*Last updated:\*\*.*/, `**Last updated:** ${date}`);
    writeFileSync(dest, md, "utf8");
    return;
  }
  writeFileSync(
    dest,
    `# Business Idea Runbook Tracker

**Idea:** ${name}
**Classification:**
**Mode:** explore
**Depth:** standard
**Started:** ${date}
**Last updated:** ${date}
**Current phase:** 0

## Phase status

| Phase | Name | Status | Artifact | Notes |
|-------|------|--------|----------|-------|
| 0 | Intake | ⬜ | 00-intake.md | |
`,
    "utf8",
  );
}

export function createVenture(repoRoot: string, input: CreateVentureInput): CreateVentureResult {
  const name = input.name?.trim();
  if (!name) throw new Error("name is required");

  const slug = (input.slug?.trim() || slugifyVentureName(name)).toLowerCase();
  if (!SLUG_RE.test(slug)) {
    throw new Error(`Slug must be lowercase alphanumeric with optional hyphens: got '${slug}'`);
  }

  const reg = loadRegistry(repoRoot);
  if (reg.projects[slug]) {
    throw new Error(`Venture already registered: ${slug}`);
  }

  const businessIdea = `docs/projects/${slug}/business-idea`;
  const memory = `docs/projects/${slug}/MEMORY`;
  const bi = join(repoRoot, businessIdea);
  const mem = join(repoRoot, memory);

  if (existsSync(bi)) {
    throw new Error(`Venture directory already exists: ${businessIdea}`);
  }

  for (const sub of [
    "DISPATCH/queue",
    "DISPATCH/claimed",
    "DISPATCH/runs",
    "DISPATCH/routines",
    "HANDOFFS",
    "BRIEFINGS",
  ]) {
    mkdirSync(join(bi, sub), { recursive: true });
  }
  mkdirSync(join(mem, "sessions"), { recursive: true });
  mkdirSync(join(mem, "entities"), { recursive: true });

  seedTracker(repoRoot, bi, name);

  copyFirstExisting(
    [
      join(repoRoot, "templates/business-idea/HANDOFFS/README.md"),
      join(repoRoot, "docs/projects/passive-grid/business-idea/HANDOFFS/README.md"),
    ],
    join(bi, "HANDOFFS/README.md"),
  );
  copyFirstExisting(
    [join(repoRoot, "docs/projects/passive-grid/business-idea/DISPATCH/README.md")],
    join(bi, "DISPATCH/README.md"),
  );
  copyFirstExisting(
    [join(repoRoot, "docs/projects/passive-grid/business-idea/BRIEFINGS/README.md")],
    join(bi, "BRIEFINGS/README.md"),
  );

  writeFileSync(
    join(mem, "README.md"),
    `# ${name} — Memory

Filesystem memory for this venture. Active when \`projects/registry.json\` has \`"active": "${slug}"\`.

| Path | Purpose |
|------|---------|
| \`decisions.md\` | Durable decisions and rationale |
| \`sessions/\` | Session summaries |
| \`entities/\` | Named entity notes |

No vector DB in v1.
`,
    "utf8",
  );
  writeFileSync(
    join(mem, "decisions.md"),
    `# Decisions — ${name}

| Date | Decision | Rationale |
|------|----------|-----------|
| ${today()} | Venture scaffolded | Created via OCC / createVenture |
`,
    "utf8",
  );

  const next: ProjectRegistry = {
    ...reg,
    projects: {
      ...reg.projects,
      [slug]: { name, businessIdea, memory },
    },
  };
  if (input.activate !== false) {
    next.active = slug;
  }
  saveRegistry(repoRoot, next);

  return {
    slug,
    name,
    businessIdea,
    memory,
    active: next.active,
  };
}
