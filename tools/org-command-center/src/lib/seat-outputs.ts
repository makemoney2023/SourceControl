import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveArtifactPath } from "./project-paths";

function resolveVentureContext(
  repoRoot: string,
  opts?: { ventureSlug?: string; businessIdeaRel?: string },
): { ventureSlug: string; businessIdeaRel: string } {
  if (opts?.ventureSlug && opts?.businessIdeaRel) {
    return {
      ventureSlug: opts.ventureSlug,
      businessIdeaRel: opts.businessIdeaRel.replace(/\/+$/, ""),
    };
  }
  const reg = JSON.parse(
    readFileSync(join(repoRoot, "projects/registry.json"), "utf8"),
  ) as {
    active: string;
    projects: Record<string, { businessIdea: string }>;
  };
  const ventureSlug = opts?.ventureSlug ?? reg.active;
  const entry = reg.projects[ventureSlug];
  if (!entry) throw new Error(`Unknown project slug: ${ventureSlug}`);
  return {
    ventureSlug,
    businessIdeaRel:
      opts?.businessIdeaRel?.replace(/\/+$/, "") ??
      entry.businessIdea.replace(/\/+$/, ""),
  };
}

/** Phases that require Craft → Production → Wire (or honest skip). */
export const SHIPPABLE_PRODUCTION_PHASES = new Set([
  "9",
  "9B",
  "11",
  "12",
  "14",
  "15",
  "17",
  "18",
  "19",
]);

/** Phases that require design_brief_path when production_status is complete. */
export const DESIGN_LED_PRODUCTION_PHASES = new Set([
  "9",
  "11",
  "12",
  "14",
  "15",
  "17",
  "18",
  "19",
]);

function stripTrailingSlash(p: string): string {
  return p.replace(/\/+$/, "");
}

/** Parse `## Outputs` bullets from a position SKILL.md body. */
export function parseSeatOutputsSection(skillMd: string): string[] {
  const m = skillMd.match(/^## Outputs\s*\n/m);
  if (!m || m.index === undefined) return [];
  const from = skillMd.slice(m.index + m[0].length);
  const next = from.search(/\n## /);
  const block = next === -1 ? from : from.slice(0, next);
  return block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) =>
      line
        .replace(/^[-*]\s+/, "")
        .replace(/`/g, "")
        .replace(/\s*\(.*$/, "")
        .trim(),
    )
    .filter((p) => p.length > 0 && !/^none$/i.test(p) && p !== "…" && p !== "...");
}

export function expandOutputPath(
  raw: string,
  opts: { ventureSlug: string; businessIdeaRel: string },
): string {
  let p = raw
    .replace(/`/g, "")
    .replace(/\s*\(.*$/, "")
    .trim();
  p = p
    .replaceAll("<active>", opts.ventureSlug)
    .replaceAll("<venture>", opts.ventureSlug);
  if (
    p.startsWith("docs/") ||
    p.startsWith("design-system/") ||
    p.startsWith("apps/") ||
    p.startsWith("skills/")
  ) {
    return stripTrailingSlash(p);
  }
  return stripTrailingSlash(resolveArtifactPath(p, opts.businessIdeaRel));
}

export function mergeUniquePaths(
  ...lists: (string[] | undefined)[]
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const list of lists) {
    for (const raw of list ?? []) {
      const p = stripTrailingSlash(raw.trim());
      if (!p || seen.has(p)) continue;
      seen.add(p);
      out.push(p);
    }
  }
  return out;
}

export function loadSeatOutputPaths(
  repoRoot: string,
  position: string,
  opts?: { ventureSlug?: string; businessIdeaRel?: string },
): string[] {
  const skillPath = join(repoRoot, "skills/org/positions", position, "SKILL.md");
  if (!existsSync(skillPath)) return [];
  const { ventureSlug, businessIdeaRel: biz } = resolveVentureContext(
    repoRoot,
    opts,
  );
  return parseSeatOutputsSection(readFileSync(skillPath, "utf8")).map((p) =>
    expandOutputPath(p, { ventureSlug, businessIdeaRel: biz }),
  );
}
