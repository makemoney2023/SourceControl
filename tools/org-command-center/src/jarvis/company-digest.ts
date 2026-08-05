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
import type { TaskSessionRecord } from "./tasks";

export interface BlockedSeatDigest {
  slug: string;
  /** Primary reason for compact displays */
  reason: string;
  phase: string;
  status: string;
  reasons: string[];
  handoffFilename: string;
  managerSlug: string;
}

export interface CompanyDigest {
  blockedSeats: BlockedSeatDigest[];
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
  sessions?: TaskSessionRecord[];
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
  const rosterBySlug = new Map(args.org.roster.map((r) => [r.slug, r]));
  for (const h of args.handoffs) {
    const isBlocked = h.status === "blocked";
    const needsInput =
      h.status === "needs_input" || (!isBlocked && h.asks.length > 0);
    if (isBlocked || needsInput) {
      const reasons = [...h.blockers, ...h.asks].filter(Boolean);
      const displayStatus = isBlocked ? "blocked" : "needs_input";
      const reason = reasons[0] || displayStatus;
      const seat = rosterBySlug.get(h.position);
      blockedSeats.push({
        slug: h.position,
        reason,
        phase: h.phase,
        status: displayStatus,
        reasons: reasons.length > 0 ? reasons : [displayStatus],
        handoffFilename: h.filename,
        managerSlug: h.reportsTo || seat?.reportsTo || "",
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
    sessions: args.sessions,
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
