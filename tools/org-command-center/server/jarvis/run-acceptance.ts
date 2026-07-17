import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { indexHandoffs } from "../../src/lib/parse-handoff";
import type { ManagerPacket } from "../../src/lib/types";
import { handoffsDir, reviewInboxDir } from "../paths";
import { listReviewInbox } from "./review-inbox";

export type RunAcceptance = {
  ok: boolean;
  missing: string[];
  checkedAt: string;
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

function inboxItemsWithRunId(repoRoot: string) {
  const dir = reviewInboxDir(repoRoot);
  if (!existsSync(dir)) return [];
  const listed = listReviewInbox(repoRoot);
  return listed.map((item) => {
    const raw = readFileSync(join(dir, item.filename), "utf8");
    const fm = parseFrontmatter(raw);
    return { ...item, runId: fm.runId };
  });
}

function hasMatchingInbox(
  repoRoot: string,
  runId: string,
  packet: ManagerPacket,
): boolean {
  const items = inboxItemsWithRunId(repoRoot);
  const byRunId = items.some((item) => item.runId === runId);
  if (byRunId) return true;
  return items.some(
    (item) =>
      item.position === packet.position &&
      (item.goal === packet.goal ||
        item.goal?.replace(/^["']|["']$/g, "") === packet.goal),
  );
}

function hasIcHandoff(repoRoot: string, preferredIc: string): boolean {
  const hd = handoffsDir(repoRoot);
  if (!existsSync(hd)) return false;
  const handoffs = indexHandoffs(
    readdirSync(hd)
      .filter((n) => n.endsWith(".md") && n !== "README.md")
      .map((name) => ({
        name,
        content: readFileSync(join(hd, name), "utf8"),
      })),
  );
  return handoffs.some(
    (h) =>
      h.position === preferredIc &&
      h.kind === "ic" &&
      h.status.trim().length > 0,
  );
}

function resolveRequireInbox(
  packet: ManagerPacket,
  requireInbox?: boolean,
): boolean {
  if (requireInbox !== undefined) return requireInbox;
  return packet.require_inbox === true;
}

function resolveRequireIcHandoff(
  packet: ManagerPacket,
  requireIcHandoff?: boolean,
): boolean {
  if (requireIcHandoff !== undefined) return requireIcHandoff;
  if (packet.require_ic_handoff !== undefined) return packet.require_ic_handoff;
  return !!packet.preferred_ic;
}

export function evaluateRunAcceptance(
  repoRoot: string,
  args: {
    runId: string;
    packet: ManagerPacket;
    requireInbox?: boolean;
    requireIcHandoff?: boolean;
  },
): RunAcceptance {
  const missing: string[] = [];
  const requireInbox = resolveRequireInbox(args.packet, args.requireInbox);
  const requireIcHandoff = resolveRequireIcHandoff(
    args.packet,
    args.requireIcHandoff,
  );

  if (requireInbox && !hasMatchingInbox(repoRoot, args.runId, args.packet)) {
    missing.push("inbox");
  }

  if (requireIcHandoff) {
    const ic = args.packet.preferred_ic;
    if (!ic || !hasIcHandoff(repoRoot, ic)) {
      missing.push("ic_handoff");
    }
  }

  return {
    ok: missing.length === 0,
    missing,
    checkedAt: new Date().toISOString(),
  };
}
