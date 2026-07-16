import type { RunRecord } from "../lib/runs";
import type { HandoffRecord, ModelRegistry, OrgRegistry, PhaseOwner } from "../lib/types";
import {
  buildAgentRuntimeMap,
  type AgentStateFile,
  type AgentRuntimeStatus,
} from "./agent-runtime";
import type { SeatVisualStatus } from "./status";

export const CSUITE_SLUGS = [
  "ceo-strategist",
  "head-of-research",
  "cfo",
  "head-of-product",
  "cmo",
  "creative-director",
  "head-of-sales-cs",
  "coo",
  "head-of-people",
  "cto",
  "head-of-data",
] as const;

export interface CSuiteCard {
  slug: string;
  title: string;
  dept: string;
  pulse: SeatVisualStatus | AgentRuntimeStatus;
  ownedActivePhases: string[];
  briefingSnippet: string;
  llmTier: string;
  hasBriefing: boolean;
}

export interface StandupBriefing {
  slug: string;
  status: string;
  phaseFocus: string;
  progress: string;
  updatedAt: string;
  raw: string;
}

export function buildCSuiteBoard(
  org: OrgRegistry,
  models: ModelRegistry,
  handoffs: HandoffRecord[],
  briefings: StandupBriefing[],
  phaseOwners: PhaseOwner[],
  activePhases: { phase: string; status: string }[],
  opts?: {
    runs?: RunRecord[];
    agentStates?: Record<string, AgentStateFile>;
  },
): CSuiteCard[] {
  const briefingBySlug = new Map(briefings.map((b) => [b.slug, b]));
  const runtime = buildAgentRuntimeMap({
    slugs: [...CSUITE_SLUGS],
    agentStates: opts?.agentStates ?? {},
    runs: opts?.runs ?? [],
    handoffs,
  });
  return CSUITE_SLUGS.map((slug) => {
    const seat = org.roster.find((r) => r.slug === slug);
    const status = runtime[slug] ?? "active";
    const ownedActivePhases = phaseOwners
      .filter(
        (p) =>
          p.managerOwner === slug &&
          activePhases.some((a) => a.phase === p.phase && (a.status === "⬜" || a.status === "🔄")),
      )
      .map((p) => p.phase);
    const briefing = briefingBySlug.get(slug);
    const mgrHandoff = handoffs
      .filter((h) => h.kind === "manager" && h.position === slug)
      .at(-1);
    const snippet =
      briefing?.progress?.slice(0, 160) ||
      (mgrHandoff
        ? `${mgrHandoff.status} · ${mgrHandoff.verdictForManager || "brief on disk"}`
        : "");
    return {
      slug,
      title: seat?.title ?? slug,
      dept: seat?.dept ?? "",
      pulse: status,
      ownedActivePhases,
      briefingSnippet: snippet,
      llmTier: models[slug]?.llmTier ?? "",
      hasBriefing: Boolean(briefing),
    };
  });
}
