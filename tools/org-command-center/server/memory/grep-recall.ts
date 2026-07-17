import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { resolveMemoryRoot } from "./fs-store";
import type { MemoryNoteKind, MemoryRecallHit } from "./types";

const DEFAULT_LIMIT = 5;
const SKIP_DIRS = new Set([".chroma"]);

function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2);
}

function inferKind(relPath: string): MemoryNoteKind | "unknown" {
  const normalized = relPath.replace(/\\/g, "/");
  if (normalized.endsWith("/notes.md") || normalized.endsWith("notes.md")) return "note";
  if (normalized.endsWith("/decisions.md") || normalized.endsWith("decisions.md")) return "decision";
  if (normalized.endsWith("/preferences.md") || normalized.endsWith("preferences.md")) {
    return "preference";
  }
  if (normalized.includes("/entities/")) return "entity";
  if (normalized.includes("/sessions/")) {
    const base = normalized.split("/").pop() ?? "";
    if (/^\d{4}-\d{2}-\d{2}\.md$/.test(base)) return "lifecycle";
    return "session";
  }
  if (normalized.endsWith("/context.md") || normalized.endsWith("context.md")) return "unknown";
  return "unknown";
}

function walkMemoryFiles(absDir: string, relDir: string): { abs: string; rel: string }[] {
  const files: { abs: string; rel: string }[] = [];

  function walk(currentAbs: string, currentRel: string): void {
    let entries: string[];
    try {
      entries = readdirSync(currentAbs);
    } catch {
      return;
    }

    for (const name of entries) {
      if (SKIP_DIRS.has(name)) continue;
      const abs = join(currentAbs, name);
      const rel = currentRel ? `${currentRel}/${name}` : name;
      let stat;
      try {
        stat = statSync(abs);
      } catch {
        continue;
      }
      if (stat.isDirectory()) {
        walk(abs, rel);
      } else if (stat.isFile() && name.endsWith(".md")) {
        files.push({ abs, rel: `${relDir}/${rel}`.replace(/\/+/g, "/") });
      }
    }
  }

  walk(absDir, "");
  return files;
}

function scoreLine(line: string, tokens: string[]): number {
  const lower = line.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (lower.includes(token)) score += 1;
  }
  return score;
}

function buildSnippet(lines: string[], index: number): string {
  const parts: string[] = [];
  if (index > 0) parts.push(lines[index - 1].trim());
  parts.push(lines[index].trim());
  if (index < lines.length - 1) parts.push(lines[index + 1].trim());
  return parts.filter(Boolean).join("\n");
}

export function grepRecallMemory(
  repoRoot: string,
  query: string,
  limit = DEFAULT_LIMIT,
): MemoryRecallHit[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return [];

  const { absDir, relDir } = resolveMemoryRoot(repoRoot);
  const candidates: MemoryRecallHit[] = [];

  for (const { abs, rel } of walkMemoryFiles(absDir, relDir)) {
    let content: string;
    try {
      content = readFileSync(abs, "utf8");
    } catch {
      continue;
    }

    const lines = content.split("\n");
    const kind = inferKind(rel);
    const fileScore = scoreLine(content, tokens);
    if (fileScore === 0) continue;

    for (let i = 0; i < lines.length; i++) {
      const lineScore = scoreLine(lines[i], tokens);
      if (lineScore === 0) continue;
      candidates.push({
        text: buildSnippet(lines, i),
        path: rel,
        kind,
        score: lineScore + fileScore * 0.1,
      });
    }
  }

  candidates.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const seen = new Set<string>();
  const hits: MemoryRecallHit[] = [];
  for (const hit of candidates) {
    const key = `${hit.path}:${hit.text}`;
    if (seen.has(key)) continue;
    seen.add(key);
    hits.push(hit);
    if (hits.length >= limit) break;
  }

  return hits;
}
