import { parseMarkdownTable, tableAsObjects } from "./parse-md-table";

export type ClassificationSkips = {
  skipIcs: string[];
  skipPhases: string[];
};

function splitCsv(cell: string): string[] {
  return cell
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseClassificationSkips(md: string): {
  rows: { match: RegExp; skipIcs: string[]; skipPhases: string[] }[];
} {
  const objects = tableAsObjects(parseMarkdownTable(md));
  const rows = objects
    .filter((r) => r.Match)
    .map((r) => ({
      match: new RegExp(escapeRegExp(r.Match), "i"),
      skipIcs: splitCsv(r["Skip ICs"] ?? ""),
      skipPhases: splitCsv(r["Skip phases"] ?? ""),
    }));
  return { rows };
}

export function resolveClassificationSkips(
  classification: string,
  md: string,
): ClassificationSkips {
  const { rows } = parseClassificationSkips(md);
  const skipIcs: string[] = [];
  const skipPhases: string[] = [];
  for (const row of rows) {
    if (row.match.test(classification)) {
      skipIcs.push(...row.skipIcs);
      skipPhases.push(...row.skipPhases);
    }
  }
  return { skipIcs, skipPhases };
}
