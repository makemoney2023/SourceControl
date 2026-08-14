import { parseMarkdownTable, tableAsObjects } from "./parse-md-table";

export function parsePositionPacks(skillMd: string): string[] {
  const rows = tableAsObjects(parseMarkdownTable(skillMd, "## Skill packs"));
  return rows
    .map((r) => (r["Pack path"] ?? r.Pack ?? "").replace(/`/g, "").trim())
    .filter(Boolean);
}
