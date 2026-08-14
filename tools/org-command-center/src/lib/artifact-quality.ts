import { parseMarkdownTable, tableAsObjects } from "./parse-md-table";

export type QualityCheck = {
  id: string;
  phase: string;
  artifactRel: string;
  headingIncludes: string[];
};

function splitHeadings(cell: string): string[] {
  return cell
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
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

export function parseArtifactQuality(md: string): QualityCheck[] {
  const objects = tableAsObjects(parseMarkdownTable(md));
  return objects
    .filter((r) => (r.id ?? r.Id ?? "").trim())
    .map((r) => ({
      id: (r.id ?? r.Id ?? "").trim(),
      phase: (r.phase ?? r.Phase ?? "").trim(),
      artifactRel: (r.artifact ?? r.Artifact ?? "").trim(),
      headingIncludes: splitHeadings(
        r.must_contain_headings ?? r["must_contain_headings"] ?? "",
      ),
    }));
}

export function qualityFailures(
  checks: QualityCheck[],
  phase: string,
  readArtifact: (rel: string) => string | null,
): string[] {
  const phaseChecks = checks.filter((c) => String(c.phase) === String(phase));
  const missing: string[] = [];
  let scorecard = false;
  for (const check of phaseChecks) {
    const body = readArtifact(check.artifactRel);
    if (body === null) {
      scorecard = true;
      continue;
    }
    const ok = check.headingIncludes.every((name) => hasHeadingOrBold(body, name));
    if (!ok) missing.push(`quality_fail:${check.id}`);
  }
  if (scorecard) missing.unshift("quality_scorecard");
  return missing;
}
