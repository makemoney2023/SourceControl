import { parseMarkdownTable, tableAsObjects } from "./parse-md-table";

export type Redline = { path: string; comment: string };

export function parseRedlines(body: string): Redline[] {
  return tableAsObjects(parseMarkdownTable(body, "## Redlines"))
    .map((r) => ({
      path: (r.path ?? r.Path ?? "").replace(/`/g, "").trim(),
      comment: (r.comment ?? r.Comment ?? "").trim(),
    }))
    .filter((r) => r.path && r.path !== "…" && r.path !== "...");
}

export function formatRedlineInstruction(redlines: Redline[]): string {
  return [
    "## Redlines (do not restart)",
    "Revise only these leased paths. Leave everything else.",
    ...redlines.map((r) => `- \`${r.path}\`: ${r.comment}`),
  ].join("\n");
}
