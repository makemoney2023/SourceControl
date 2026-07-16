import { parseMarkdownTable, tableAsObjects } from "./parse-md-table";
import type { ModelRegistry, OrgRegistry, PhaseOwner, RosterEntry } from "./types";

function stripParallel(cell: string): string[] {
  if (!cell || cell === "—" || cell === "-") return [];
  return cell
    .replace(/`\(parallel:[^)]+\)`/g, "")
    .replace(/\(parallel:[^)]+\)/g, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseOrgRegistry(md: string): OrgRegistry {
  const rosterRows = tableAsObjects(parseMarkdownTable(md, "## Roster"));
  const roster: RosterEntry[] = rosterRows
    .filter((r) => r.Slug)
    .map((r) => ({
      slug: r.Slug,
      title: r.Title ?? "",
      reportsTo: r["Reports to"] === "—" ? "" : (r["Reports to"] ?? ""),
      level: (r.Level ?? "") as RosterEntry["level"],
      dept: r.Dept ?? "",
    }));

  const phaseRows = tableAsObjects(parseMarkdownTable(md, "## Phase → owner map"));
  const phaseOwners: PhaseOwner[] = phaseRows
    .filter((r) => r.Phase)
    .map((r) => ({
      phase: r.Phase,
      managerOwner: r["Manager owner"] ?? "",
      maySpawn: stripParallel(r["Manager may spawn"] ?? ""),
      csuiteReviewer: r["C-suite reviewer"] ?? "",
      secondary: r["Secondary if tagged"] ?? "",
      scorecard: r["Scorecard (must pass)"] ?? "",
    }));

  return { roster, phaseOwners };
}

export function resolvePhaseOwner(reg: OrgRegistry, phase: string) {
  return reg.phaseOwners.find((p) => p.phase === phase);
}

export function parseModelRegistry(md: string): ModelRegistry {
  const rows = tableAsObjects(parseMarkdownTable(md, "## Position → model map"));
  const out: ModelRegistry = {};
  for (const r of rows) {
    if (!r.Slug) continue;
    out[r.Slug] = {
      llmTier: r.llm_tier ?? "",
      llmModel: (r["Preferred `model`"] ?? r["Preferred model"] ?? "").replace(/`/g, ""),
      generationProfile: r.generation_profile ?? "none",
    };
  }
  return out;
}
