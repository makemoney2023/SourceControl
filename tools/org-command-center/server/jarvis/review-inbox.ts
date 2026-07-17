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
      mtimeMs: st.mtimeMs,
    });
  }
  return items.sort((a, b) => b.mtimeMs - a.mtimeMs);
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
