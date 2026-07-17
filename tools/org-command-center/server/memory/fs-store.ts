import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative } from "node:path";
import { activeProjectSlug, memoryDir, memoryRel } from "../paths";
import type { MemoryNoteKind } from "./types";

export type AppendNoteArgs = {
  kind: MemoryNoteKind;
  text: string;
  entityId?: string;
  ts?: string;
};

export function resolveMemoryRoot(
  repoRoot: string,
  slug?: string,
): { slug: string; absDir: string; relDir: string } {
  const resolvedSlug = slug ?? activeProjectSlug(repoRoot);
  return {
    slug: resolvedSlug,
    absDir: memoryDir(repoRoot, resolvedSlug),
    relDir: memoryRel(repoRoot, resolvedSlug),
  };
}

function slugifyEntityId(entityId: string): string {
  return entityId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isoDate(ts: string): string {
  return ts.slice(0, 10);
}

function ensureDir(absPath: string): void {
  if (!existsSync(absPath)) {
    mkdirSync(absPath, { recursive: true });
  }
}

function relPath(repoRoot: string, absPath: string): string {
  return relative(repoRoot, absPath).split(/[/\\]/).join("/");
}

function appendNoteLine(repoRoot: string, text: string, ts: string): { path: string; kind: MemoryNoteKind } {
  const { absDir, relDir } = resolveMemoryRoot(repoRoot);
  ensureDir(absDir);
  const absPath = join(absDir, "notes.md");
  const day = isoDate(ts);
  const sectionHeader = `## ${day}`;
  let content = existsSync(absPath) ? readFileSync(absPath, "utf8") : "";

  if (!content.includes(sectionHeader)) {
    if (content.length > 0 && !content.endsWith("\n")) content += "\n";
    content += `${sectionHeader}\n`;
  }

  content += `- ${text.trim()}\n`;
  writeFileSync(absPath, content, "utf8");
  return { path: `${relDir}/notes.md`, kind: "note" };
}

function appendDecisionRow(repoRoot: string, text: string, ts: string): { path: string; kind: MemoryNoteKind } {
  const { absDir, relDir } = resolveMemoryRoot(repoRoot);
  ensureDir(absDir);
  const absPath = join(absDir, "decisions.md");
  const day = isoDate(ts);
  const header = "| date | decision | rationale |\n|------|----------|-----------|\n";
  let content = existsSync(absPath) ? readFileSync(absPath, "utf8") : header;

  if (!content.includes("| date | decision | rationale |")) {
    content = header;
  }

  const escaped = text.trim().replace(/\|/g, "\\|");
  content += `| ${day} | ${escaped} | - |\n`;
  writeFileSync(absPath, content, "utf8");
  return { path: `${relDir}/decisions.md`, kind: "decision" };
}

function appendPreferenceBullet(
  repoRoot: string,
  text: string,
): { path: string; kind: MemoryNoteKind } {
  const { absDir, relDir } = resolveMemoryRoot(repoRoot);
  ensureDir(absDir);
  const absPath = join(absDir, "preferences.md");
  appendFileSync(absPath, `- ${text.trim()}\n`, "utf8");
  return { path: `${relDir}/preferences.md`, kind: "preference" };
}

function appendEntityNote(
  repoRoot: string,
  entityId: string,
  text: string,
  ts: string,
): { path: string; kind: MemoryNoteKind } {
  const { absDir, relDir } = resolveMemoryRoot(repoRoot);
  const slug = slugifyEntityId(entityId);
  if (!slug) throw new Error("entityId required");
  const entitiesDir = join(absDir, "entities");
  ensureDir(entitiesDir);
  const absPath = join(entitiesDir, `${slug}.md`);
  const day = isoDate(ts);
  const line = `- ${day}: ${text.trim()}\n`;
  appendFileSync(absPath, line, "utf8");
  return { path: `${relDir}/entities/${slug}.md`, kind: "entity" };
}

export function appendLifecycleLine(
  repoRoot: string,
  line: string,
  dayIso?: string,
): { path: string } {
  const { absDir, relDir } = resolveMemoryRoot(repoRoot);
  const day = dayIso ?? new Date().toISOString().slice(0, 10);
  const sessionsDir = join(absDir, "sessions");
  ensureDir(sessionsDir);
  const absPath = join(sessionsDir, `${day}.md`);
  const formatted = line.trim().startsWith("-") ? `${line.trim()}\n` : `- ${line.trim()}\n`;
  appendFileSync(absPath, formatted, "utf8");
  return { path: `${relDir}/sessions/${day}.md` };
}

export function writeSessionDigestFile(
  repoRoot: string,
  markdown: string,
  at: Date = new Date(),
): { path: string } {
  const { absDir, relDir } = resolveMemoryRoot(repoRoot);
  const sessionsDir = join(absDir, "sessions");
  ensureDir(sessionsDir);
  const day = at.toISOString().slice(0, 10);
  const hm = at.toISOString().slice(11, 16).replace(":", "");
  const filename = `${day}-${hm}.md`;
  const absPath = join(sessionsDir, filename);
  writeFileSync(absPath, markdown, "utf8");
  return { path: `${relDir}/sessions/${filename}` };
}

export function appendMemoryNote(
  repoRoot: string,
  args: AppendNoteArgs,
): { path: string; kind: MemoryNoteKind } {
  const ts = args.ts ?? new Date().toISOString();
  const text = args.text.trim();
  if (!text) throw new Error("text required");

  switch (args.kind) {
    case "note":
      return appendNoteLine(repoRoot, text, ts);
    case "decision":
      return appendDecisionRow(repoRoot, text, ts);
    case "preference":
      return appendPreferenceBullet(repoRoot, text);
    case "entity": {
      if (!args.entityId?.trim()) throw new Error("entityId required");
      return appendEntityNote(repoRoot, args.entityId, text, ts);
    }
    case "lifecycle":
      return { ...appendLifecycleLine(repoRoot, text, isoDate(ts)), kind: "lifecycle" };
    case "session":
      throw new Error("session kind must use writeSessionDigestFile");
    default:
      throw new Error(`unsupported kind: ${args.kind satisfies never}`);
  }
}

function parseDecisionLines(content: string): string[] {
  const lines: string[] = [];
  for (const line of content.split("\n")) {
    if (!line.startsWith("|")) continue;
    if (line.includes("---") || line.includes("| date |")) continue;
    const cols = line.split("|").map((c) => c.trim()).filter(Boolean);
    if (cols.length >= 2) lines.push(cols[1]);
  }
  return lines;
}

function parseBulletLines(content: string): string[] {
  return content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim());
}

function parseNoteSectionLines(content: string): string[] {
  const lines: string[] = [];
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ")) {
      lines.push(trimmed.slice(2).trim());
    }
  }
  return lines;
}

function collectSessionFiles(absDir: string): { name: string; mtime: number }[] {
  const sessionsDir = join(absDir, "sessions");
  if (!existsSync(sessionsDir)) return [];
  const entries: { name: string; mtime: number }[] = [];
  for (const name of readdirSync(sessionsDir)) {
    if (!name.endsWith(".md")) continue;
    const stat = statSync(join(sessionsDir, name));
    if (stat.isFile()) entries.push({ name, mtime: stat.mtimeMs });
  }
  return entries.sort((a, b) => a.mtime - b.mtime);
}

export function readMemorySnippets(repoRoot: string): {
  recentSessionLines: string[];
  decisionLines: string[];
  preferenceLines: string[];
  noteLines: string[];
} {
  const { absDir } = resolveMemoryRoot(repoRoot);

  const noteLines: string[] = [];
  const notesPath = join(absDir, "notes.md");
  if (existsSync(notesPath)) {
    noteLines.push(...parseNoteSectionLines(readFileSync(notesPath, "utf8")));
  }

  const contextPath = join(absDir, "context.md");
  if (existsSync(contextPath)) {
    const ctx = readFileSync(contextPath, "utf8");
    for (const line of ctx.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        noteLines.push(trimmed);
      }
    }
  }

  const decisionLines: string[] = [];
  const decisionsPath = join(absDir, "decisions.md");
  if (existsSync(decisionsPath)) {
    decisionLines.push(...parseDecisionLines(readFileSync(decisionsPath, "utf8")));
  }

  const preferenceLines: string[] = [];
  const preferencesPath = join(absDir, "preferences.md");
  if (existsSync(preferencesPath)) {
    preferenceLines.push(...parseBulletLines(readFileSync(preferencesPath, "utf8")));
  }

  const recentSessionLines: string[] = [];
  for (const { name } of collectSessionFiles(absDir)) {
    const content = readFileSync(join(absDir, "sessions", name), "utf8");
    recentSessionLines.push(...parseBulletLines(content));
  }

  return {
    recentSessionLines,
    decisionLines,
    preferenceLines,
    noteLines,
  };
}
