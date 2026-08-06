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
  const raw = JSON.parse(readFileSync(join(repoRoot, "projects/registry.json"), "utf8")) as {
    version?: number;
    active: string | { org: string; customer: string; initiative: string };
    projects?: Record<string, { businessIdea: string }>;
    orgs?: Record<
      string,
      {
        customers: Record<
          string,
          { initiatives: Record<string, { businessIdea: string }> }
        >;
      }
    >;
  };

  let ventureSlug: string;
  let businessIdea: string | undefined;

  if (raw.version === 2 && typeof raw.active === "object" && raw.orgs) {
    ventureSlug =
      opts?.ventureSlug ??
      (typeof raw.active === "object" ? raw.active.customer : String(raw.active));
    const org = typeof raw.active === "object" ? raw.active.org : Object.keys(raw.orgs)[0]!;
    const initiative =
      typeof raw.active === "object" && opts?.ventureSlug === undefined
        ? raw.active.initiative
        : "main";
    businessIdea =
      raw.orgs[org]?.customers[ventureSlug]?.initiatives[initiative]?.businessIdea ??
      raw.orgs[org]?.customers[ventureSlug]?.initiatives.main?.businessIdea;
  } else {
    ventureSlug =
      opts?.ventureSlug ??
      (typeof raw.active === "string" ? raw.active : raw.active.customer);
    businessIdea = raw.projects?.[ventureSlug]?.businessIdea;
  }

  if (!businessIdea) throw new Error(`Unknown project slug: ${ventureSlug}`);
  return {
    ventureSlug,
    businessIdeaRel:
      opts?.businessIdeaRel?.replace(/\/+$/, "") ?? businessIdea.replace(/\/+$/, ""),
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
