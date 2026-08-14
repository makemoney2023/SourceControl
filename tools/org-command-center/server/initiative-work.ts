import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { indexHandoffs } from "../src/lib/parse-handoff";
import type { HandoffRecord } from "../src/lib/types";
import { listRuns } from "./runs-fs";
import type { RunRecord } from "../src/lib/runs";
import type { OrgWorkInboxItem } from "../src/jarvis/org-work-graph";

export type InitiativeWork = {
  handoffs: HandoffRecord[];
  runs: RunRecord[];
  inbox: OrgWorkInboxItem[];
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

export function loadInitiativeWork(
  repoRoot: string,
  businessIdeaRel: string,
): InitiativeWork {
  const ideaAbs = join(repoRoot, businessIdeaRel);
  const hd = join(ideaAbs, "HANDOFFS");
  const handoffs = existsSync(hd)
    ? indexHandoffs(
        readdirSync(hd)
          .filter((n) => n.endsWith(".md") && n !== "README.md")
          .map((name) => ({
            name,
            content: readFileSync(join(hd, name), "utf8"),
          })),
      )
    : [];
  const runs = listRuns(join(ideaAbs, "DISPATCH", "runs"), 200);
  const inboxDir = join(ideaAbs, "REVIEW", "inbox");
  const inbox: OrgWorkInboxItem[] = [];
  if (existsSync(inboxDir)) {
    for (const filename of readdirSync(inboxDir)) {
      if (!filename.endsWith(".md")) continue;
      const abs = join(inboxDir, filename);
      if (!statSync(abs).isFile()) continue;
      const fm = parseFrontmatter(readFileSync(abs, "utf8"));
      inbox.push({
        filename,
        path: `${businessIdeaRel}/REVIEW/inbox/${filename}`,
        status: fm.status || "pending_review",
        position: fm.position,
        phase: fm.phase,
        goal: fm.goal,
      });
    }
  }
  return { handoffs, runs, inbox };
}
