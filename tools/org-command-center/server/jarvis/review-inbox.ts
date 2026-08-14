import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { assertWritable, businessIdeaFile, reviewInboxDir } from "../paths";

export type ReviewInboxItem = {
  filename: string;
  path: string;
  status: string;
  position?: string;
  phase?: string;
  goal?: string;
  created?: string;
  artifact_path?: string;
  mtimeMs: number;
};

function parseFrontmatter(raw: string): Record<string, string> {
  if (!raw.startsWith("---")) return {};
  const end = raw.indexOf("\n---", 3);
  if (end < 0) return {};
  const block = raw.slice(3, end).trim();
  const out: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
}

/** Newest REVIEW/inbox markdown for a seat position (by mtime). */
export function findLatestInboxDeliverableForSeat(
  repoRoot: string,
  seatSlug: string,
): { abs: string; rel: string; markdown: string } | null {
  const want = seatSlug.trim();
  if (!want) return null;
  const dir = reviewInboxDir(repoRoot);
  if (!existsSync(dir)) return null;
  let best: { abs: string; rel: string; markdown: string; mtimeMs: number } | null =
    null;
  for (const filename of readdirSync(dir)) {
    if (!filename.endsWith(".md") || filename.includes("-queued.")) continue;
    const abs = join(dir, filename);
    const st = statSync(abs);
    if (!st.isFile()) continue;
    const markdown = readFileSync(abs, "utf8");
    const fm = parseFrontmatter(markdown);
    if ((fm.position || "").trim() !== want) continue;
    if (!best || st.mtimeMs > best.mtimeMs) {
      best = {
        abs,
        rel: businessIdeaFile(repoRoot, `REVIEW/inbox/${filename}`),
        markdown,
        mtimeMs: st.mtimeMs,
      };
    }
  }
  return best
    ? { abs: best.abs, rel: best.rel, markdown: best.markdown }
    : null;
}

/** Absolute path of the newest inbox deliverable that mentions this runId. */
export function findInboxDeliverableByRunId(
  repoRoot: string,
  runId: string,
): { abs: string; rel: string; markdown: string } | null {
  const want = runId.trim();
  if (!want) return null;
  const dir = reviewInboxDir(repoRoot);
  if (!existsSync(dir)) return null;
  let best: { abs: string; rel: string; markdown: string; mtimeMs: number } | null =
    null;
  for (const filename of readdirSync(dir)) {
    if (!filename.endsWith(".md") || filename.includes("-queued.")) continue;
    const abs = join(dir, filename);
    const st = statSync(abs);
    if (!st.isFile()) continue;
    const markdown = readFileSync(abs, "utf8");
    const fm = parseFrontmatter(markdown);
    const mentions =
      fm.runId === want ||
      markdown.includes(`runId: ${want}`) ||
      markdown.includes(`\`${want}\``);
    if (!mentions) continue;
    if (!best || st.mtimeMs > best.mtimeMs) {
      best = {
        abs,
        rel: businessIdeaFile(repoRoot, `REVIEW/inbox/${filename}`),
        markdown,
        mtimeMs: st.mtimeMs,
      };
    }
  }
  return best
    ? { abs: best.abs, rel: best.rel, markdown: best.markdown }
    : null;
}

export function listReviewInbox(repoRoot: string): ReviewInboxItem[] {
  const dir = reviewInboxDir(repoRoot);
  if (!existsSync(dir)) return [];
  const items: ReviewInboxItem[] = [];
  for (const filename of readdirSync(dir)) {
    if (!filename.endsWith(".md")) continue;
    const abs = join(dir, filename);
    const st = statSync(abs);
    if (!st.isFile()) continue;
    const fm = parseFrontmatter(readFileSync(abs, "utf8"));
    const rel = businessIdeaFile(repoRoot, `REVIEW/inbox/${filename}`);
    items.push({
      filename,
      path: rel,
      status: fm.status || "pending_review",
      position: fm.position,
      phase: fm.phase,
      goal: fm.goal,
      created: fm.created,
      artifact_path: fm.artifact_path || undefined,
      mtimeMs: st.mtimeMs,
    });
  }
  return items.sort((a, b) => b.mtimeMs - a.mtimeMs);
}

/** Update frontmatter `status` on inbox files matching optional phase filter. */
export function setReviewInboxStatus(
  repoRoot: string,
  args: { status: string; phase?: string },
): { updated: string[] } {
  const dir = reviewInboxDir(repoRoot);
  if (!existsSync(dir)) return { updated: [] };
  const wantPhase = args.phase != null ? String(args.phase).trim() : undefined;
  const updated: string[] = [];
  for (const filename of readdirSync(dir)) {
    if (!filename.endsWith(".md")) continue;
    const abs = join(dir, filename);
    const st = statSync(abs);
    if (!st.isFile()) continue;
    const raw = readFileSync(abs, "utf8");
    if (!raw.startsWith("---")) continue;
    const end = raw.indexOf("\n---", 3);
    if (end < 0) continue;
    const fm = parseFrontmatter(raw);
    if (wantPhase != null) {
      const itemPhase = String(fm.phase ?? "").replace(/^["']|["']$/g, "").trim();
      if (itemPhase !== wantPhase) continue;
    }
    if ((fm.status || "pending_review") === args.status) continue;
    const block = raw.slice(3, end);
    const nextBlock = /^status:\s*.+$/m.test(block)
      ? block.replace(/^status:\s*.+$/m, `status: ${args.status}`)
      : `status: ${args.status}\n${block.trimStart()}`;
    writeFileSync(abs, `---${nextBlock}\n---${raw.slice(end + 4)}`, "utf8");
    updated.push(filename);
  }
  return { updated };
}

export function writeReviewInboxReceipt(
  repoRoot: string,
  args: {
    position: string;
    phase: string;
    goal: string;
    runId?: string;
    filename?: string;
  },
): { path: string; filename: string } {
  const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
  const filename =
    args.filename ??
    `${args.phase}-${args.position}-${ts}-queued.md`;
  const rel = businessIdeaFile(repoRoot, `REVIEW/inbox/${filename}`);
  const abs = assertWritable(repoRoot, rel);
  mkdirSync(join(abs, ".."), { recursive: true });
  const created = new Date().toISOString();
  const body = [
    "---",
    "status: pending_review",
    `position: ${args.position}`,
    `phase: ${args.phase}`,
    args.runId ? `runId: ${args.runId}` : null,
    `goal: ${JSON.stringify(args.goal)}`,
    `created: ${created}`,
    "---",
    "",
    `# Queued for ${args.position}`,
    "",
    args.goal,
    "",
    "_Receipt — Cursor worker should replace/overwrite with the real deliverable._",
    "",
  ]
    .filter((l) => l !== null)
    .join("\n");
  writeFileSync(abs, body, "utf8");
  return { path: rel, filename };
}
