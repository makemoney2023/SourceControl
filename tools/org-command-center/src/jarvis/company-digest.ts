import type { RunRecord } from "../lib/runs";
import type {
  HandoffRecord,
  ModelRegistry,
  OrgRegistry,
  Tracker,
} from "../lib/types";
import type { HandoffAlert } from "./alerts";
import type { StandupBriefing } from "./csuite";
import { buildMission } from "./mission";
import { buildSeatReport, type SeatNextAction } from "./seat-report";
import { resolveEscalationSecondaries } from "./escalation";

export interface CompanyDigest {
  blockedSeats: Array<{ slug: string; reason: string }>;
  escalateSeats: Array<{ slug: string; tags: string[]; secondaries: string[] }>;
  awaitingCsuite: string[];
  queueDepth: number;
  parallelTracks: string[];
  openAlerts: number;
  ceoNext: SeatNextAction[];
  topSpenders: Array<{ slug: string; cost_usd: number }>;
}

export function buildCompanyDigest(args: {
  org: OrgRegistry;
  tracker: Tracker;
  handoffs: HandoffRecord[];
  queueFiles: string[];
  claimedFiles: string[];
  runs: RunRecord[];
  briefings: StandupBriefing[];
  alerts?: HandoffAlert[];
  spendBySeat?: Record<string, { tokens: number; cost_usd: number }>;
  repoRoot?: string;
  models?: ModelRegistry;
}): CompanyDigest {
  const mission = buildMission(
    args.tracker,
    args.org.phaseOwners,
    args.handoffs,
    args.queueFiles.length,
  );

  const blockedSeats: CompanyDigest["blockedSeats"] = [];
  const escalateSeats: CompanyDigest["escalateSeats"] = [];
  for (const h of args.handoffs) {
    if (h.status === "blocked" || h.status === "needs_input") {
      blockedSeats.push({
        slug: h.position,
        reason: h.blockers[0] || h.asks[0] || h.status,
      });
    }
    if (h.recommendation === "escalate" || h.verdictForManager === "escalate") {
      escalateSeats.push({
        slug: h.position,
        tags: h.escalationTags,
        secondaries: resolveEscalationSecondaries(h.escalationTags),
      });
    }
  }

  const awaitingCsuite: string[] = [];
  const csuiteByPhase = new Map(
    args.handoffs.filter((h) => h.kind === "csuite").map((h) => [h.phase, h]),
  );
  for (const mb of args.handoffs.filter((h) => h.kind === "manager")) {
    const review = csuiteByPhase.get(mb.phase);
    if (
      (!review ||
        (review.verdict !== "approve" && review.verdict !== "skip-review")) &&
      (mb.status === "ready_for_csuite" ||
        mb.verdictForManager === "ready_to_merge")
    ) {
      if (!awaitingCsuite.includes(mb.phase)) awaitingCsuite.push(mb.phase);
    }
  }

  const ceo = buildSeatReport({
    slug: "ceo-strategist",
    org: args.org,
    tracker: args.tracker,
    handoffs: args.handoffs,
    queueFiles: args.queueFiles,
    claimedFiles: args.claimedFiles,
    runs: args.runs,
    briefings: args.briefings,
    spendBySeat: args.spendBySeat,
    repoRoot: args.repoRoot,
    models: args.models,
  });

  const topSpenders = Object.entries(args.spendBySeat ?? {})
    .map(([slug, v]) => ({ slug, cost_usd: v.cost_usd }))
    .sort((a, b) => b.cost_usd - a.cost_usd)
    .slice(0, 3);

  return {
    blockedSeats,
    escalateSeats,
    awaitingCsuite,
    queueDepth: args.queueFiles.length,
    parallelTracks: mission.parallelTracks,
    openAlerts: (args.alerts ?? []).filter((a) => !a.acked).length,
    ceoNext: (ceo?.nextActions ?? []).slice(0, 5),
    topSpenders,
  };
}

export function companyDigestBriefScript(d: CompanyDigest): string {
  return [
    `Company digest.`,
    `${d.blockedSeats.length} blocked, ${d.escalateSeats.length} escalations, ${d.awaitingCsuite.length} awaiting C-suite.`,
    `Queue depth ${d.queueDepth}.`,
    d.ceoNext[0] ? `CEO next: ${d.ceoNext[0].label}.` : "No CEO actions.",
  ].join(" ");
}
