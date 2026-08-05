import matter from "gray-matter";
import { parseMarkdownTable, tableAsObjects } from "./parse-md-table";
import type { HandoffKind, HandoffRecord } from "./types";

export function classifyHandoffFilename(filename: string): HandoffKind {
  const base = filename.replace(/\.md$/, "");
  if (base.endsWith("-csuite-review") || base.includes("-csuite-review")) return "csuite";
  if (/-manager-/.test(base)) return "manager";
  if (base === "_log") return "other";
  return "ic";
}

/** Derive seat slug when handoff frontmatter omits `position`. */
export function seatSlugFromHandoffFilename(filename: string): string {
  const base = (filename.split("/").pop() || "").replace(/\.md$/i, "");
  if (!base || base === "_log") return "";
  const manager = base.match(/^\d+[a-z]*-manager-(.+)$/i);
  if (manager?.[1]) return manager[1];
  if (/^\d+[a-z]*-csuite-review$/i.test(base)) return "";
  const ic = base.match(/^\d+[a-z]*-(.+)$/i);
  return ic?.[1] || "";
}

function sectionBullets(body: string, headingRe: RegExp): string[] {
  const m = body.match(headingRe);
  if (!m || m.index === undefined) return [];
  const from = body.slice(m.index + m[0].length);
  const next = from.search(/\n## /);
  const block = next === -1 ? from : from.slice(0, next);
  return block
    .split("\n")
    .map((l) => l.replace(/^[-*]\s*/, "").trim())
    .filter((l) => l && !/^none$/i.test(l) && l !== "…" && l !== "...");
}

function parseEscalationTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof raw === "string") {
    return raw
      .replace(/^\[/, "")
      .replace(/\]$/, "")
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return [];
}

function parsePathList(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map(String).map((s) => s.trim().replace(/`/g, "")).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(/[,\n]/)
      .map((s) => s.trim().replace(/^[-*]\s*/, "").replace(/`/g, ""))
      .filter(Boolean);
  }
  return [];
}

export function parseHandoff(filename: string, content: string): HandoffRecord {
  const { data, content: body } = matter(content);
  const artifactRows = tableAsObjects(
    parseMarkdownTable(body, "## Artifacts written"),
  );
  const artifacts = artifactRows
    .filter((r) => r.Path)
    .map((r) => ({
      path: (r.Path ?? "").replace(/`/g, ""),
      notes: r.Notes ?? "",
    }));

  return {
    filename,
    kind: classifyHandoffFilename(filename),
    phase: String(data.phase ?? ""),
    position: String(data.position ?? "").trim() || seatSlugFromHandoffFilename(filename),
    reportsTo: String(data.reports_to ?? ""),
    status: String(data.status ?? ""),
    verdictForManager: String(data.verdict_for_manager ?? ""),
    verdict: String(data.verdict ?? ""),
    llmTier: String(data.llm_tier ?? ""),
    generationProfile: String(data.generation_profile ?? ""),
    fallbackApplied: String(data.fallback_applied ?? ""),
    artifacts,
    asks: sectionBullets(body, /## Asks[^\n]*\n/i),
    blockers: sectionBullets(body, /## Risks\s*\/\s*blockers[^\n]*\n/i),
    recommendation: String(data.recommendation ?? data.verdict_for_manager ?? ""),
    escalationTags: parseEscalationTags(data.escalation_tags),
    productionStatus: String(data.production_status ?? "").trim(),
    productionPaths: parsePathList(data.production_paths),
    wireOwner: String(data.wire_owner ?? "").trim(),
    skipReason: String(data.skip_reason ?? "").trim(),
    designBriefPath: String(data.design_brief_path ?? "").trim(),
    photorealQa: String(data.photoreal_qa ?? "").trim(),
    wireChecklistPath: String(data.wire_checklist_path ?? "").trim(),
    licenseBasis: String(data.license_basis ?? "").trim(),
    generationUsed: String(data.generation_used ?? "").trim(),
    body,
  };
}

export function indexHandoffs(
  files: { name: string; content: string }[],
): HandoffRecord[] {
  return files
    .filter((f) => f.name.endsWith(".md") && f.name !== "README.md")
    .map((f) => parseHandoff(f.name, f.content));
}
