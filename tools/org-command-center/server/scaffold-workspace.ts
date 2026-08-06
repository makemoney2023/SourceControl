import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { seedContextMd } from "./sources/context-md";

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

function seedSourcesIndex(repoRoot: string, bi: string) {
  const sources = join(bi, "SOURCES");
  mkdirSync(sources, { recursive: true });
  const dest = join(sources, "INDEX.md");
  if (existsSync(dest)) return;
  copyFirstExisting(
    [join(repoRoot, "templates/business-idea/SOURCES/INDEX.md")],
    dest,
  );
  if (!existsSync(dest)) {
    writeFileSync(dest, "# Sources index\n\n```json\n[]\n```\n", "utf8");
  }
}

export function scaffoldInitiativeWorkspace(
  repoRoot: string,
  opts: {
    displayName: string;
    businessIdeaRel: string;
    memoryRel: string;
    contextNote?: string;
    decisionsNote?: string;
  },
): void {
  const bi = join(repoRoot, opts.businessIdeaRel);
  const mem = join(repoRoot, opts.memoryRel);

  if (existsSync(bi)) {
    throw new Error(`Initiative directory already exists: ${opts.businessIdeaRel}`);
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

  seedTracker(repoRoot, bi, opts.displayName);
  seedSourcesIndex(repoRoot, bi);
  writeFileSync(join(mem, "context.md"), seedContextMd(opts.contextNote), "utf8");

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
    `# ${opts.displayName} — Memory

Filesystem memory for this initiative.

| Path | Purpose |
|------|---------|
| \`decisions.md\` | Durable decisions and rationale |
| \`context.md\` | Operator context note and sources digest |
| \`sessions/\` | Session summaries |
| \`entities/\` | Named entity notes |

No vector DB in v1.
`,
    "utf8",
  );
  writeFileSync(
    join(mem, "decisions.md"),
    `# Decisions — ${opts.displayName}

| Date | Decision | Rationale |
|------|----------|-----------|
| ${today()} | ${opts.decisionsNote ?? "Initiative scaffolded"} | Created via OCC |
`,
    "utf8",
  );
}

export const SLUG_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

export function slugifyName(name: string): string {
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
