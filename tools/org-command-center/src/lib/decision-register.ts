import { parseMarkdownTable, tableAsObjects } from "./parse-md-table";

export type DecisionStatus = "locked" | "open" | "blocked";

export type DecisionItem = {
  id: string;
  text: string;
  askedAs: string[];
  status: DecisionStatus;
  owner: string;
  blocksSeats: string[];
};

export type DecisionRegister = {
  locked: DecisionItem[];
  open: DecisionItem[];
  blocked: DecisionItem[];
  all: DecisionItem[];
};

function splitAskedAs(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function fromModern(md: string, heading: string, status: DecisionStatus): DecisionItem[] {
  const rows = tableAsObjects(parseMarkdownTable(md, heading));
  return rows
    .filter((r) => r.id || r.Id)
    .map((r) => ({
      id: (r.id ?? r.Id ?? "").trim(),
      text: (r.decision ?? r.question ?? r.Decision ?? "").trim(),
      askedAs: splitAskedAs(r.asked_as ?? r["asked_as"] ?? ""),
      status,
      owner: (r.owner ?? r.blocked_by ?? "").trim(),
      blocksSeats: splitAskedAs(r.blocks_seats ?? r["blocks_seats"] ?? ""),
    }));
}

function fromLegacy(md: string): DecisionItem[] {
  if (md.includes("## Locked")) return [];
  const rows = tableAsObjects(parseMarkdownTable(md, "# Decisions"));
  return rows
    .filter((r) => r.Decision)
    .map((r, i) => ({
      id: `legacy-${i + 1}`,
      text: r.Decision,
      askedAs: [],
      status: "locked" as const,
      owner: "",
      blocksSeats: [],
    }));
}

export function parseDecisionRegister(md: string): DecisionRegister {
  const locked = [
    ...fromModern(md, "## Locked", "locked"),
    ...fromLegacy(md),
  ];
  const open = fromModern(md, "## Open", "open");
  const blocked = fromModern(md, "## Blocked", "blocked");
  return { locked, open, blocked, all: [...locked, ...open, ...blocked] };
}

export function findReferenceBlocks(
  register: DecisionRegister,
  position: string,
  status: string,
): string[] {
  const normalized = status.trim().toLowerCase();
  if (normalized !== "done" && normalized !== "ready_to_merge") return [];
  const seat = position.trim().toLowerCase();
  return register.open
    .filter((item) => item.blocksSeats.includes(seat))
    .map((item) => item.id);
}

export function findLockedReasks(
  register: DecisionRegister,
  haystack: string,
): string[] {
  const lower = haystack.toLowerCase();
  const hits: string[] = [];
  for (const item of register.locked) {
    if (item.askedAs.some((token) => token.length >= 4 && lower.includes(token))) {
      hits.push(item.id);
    }
  }
  return hits;
}
