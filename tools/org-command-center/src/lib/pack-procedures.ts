import { parseMarkdownTable, tableAsObjects } from "./parse-md-table";

export type PackProcedure = {
  packKey: string; // normalized path without /SKILL.md
  requiredHeadings: string[];
};

function splitHeadings(cell: string): string[] {
  return cell
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizePackKey(p: string): string {
  return p
    .replace(/`/g, "")
    .replace(/\/SKILL\.md$/i, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

function packSlug(packKey: string): string {
  return packKey.split("/").filter(Boolean).pop() ?? packKey;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasHeadingOrBold(body: string, name: string): boolean {
  const escaped = escapeRegExp(name);
  const heading = new RegExp(`^#{1,6}\\s+.*${escaped}`, "im");
  const bold = new RegExp(`\\*\\*\\s*${escaped}\\s*\\*\\*`, "i");
  return heading.test(body) || bold.test(body);
}

function usedMatchesProcedure(used: string, packKey: string): boolean {
  const a = normalizePackKey(used);
  const b = normalizePackKey(packKey);
  return a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);
}

export function parsePackProcedures(md: string): PackProcedure[] {
  const objects = tableAsObjects(parseMarkdownTable(md));
  return objects
    .filter((r) => (r.pack ?? r.Pack ?? "").trim())
    .map((r) => ({
      packKey: normalizePackKey(r.pack ?? r.Pack ?? ""),
      requiredHeadings: splitHeadings(
        r.required_headings ?? r["required_headings"] ?? "",
      ),
    }));
}

export function procedureFailures(
  usedPacks: string[],
  procedures: PackProcedure[],
  artifactBodies: string[],
): string[] {
  const haystack = artifactBodies.join("\n");
  const missing: string[] = [];
  const seen = new Set<string>();
  for (const used of usedPacks) {
    const match = procedures.find((p) => usedMatchesProcedure(used, p.packKey));
    if (!match) continue;
    const ok = match.requiredHeadings.every((name) =>
      hasHeadingOrBold(haystack, name),
    );
    if (ok) continue;
    const code = `pack_procedure:${packSlug(match.packKey)}`;
    if (seen.has(code)) continue;
    seen.add(code);
    missing.push(code);
  }
  return missing;
}
