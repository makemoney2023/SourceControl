import type { RunRecord } from "../lib/runs";
import type {
  HandoffRecord,
  ModelRegistry,
  OrgRegistry,
  Tracker,
} from "../lib/types";
import {
  buildSeatBusinessBrief,
  collectOpenQuestions,
  extractDecisions,
  extractOperatorSummary,
  humanizeBlockers,
  type OperatorSummary,
  type SeatBusinessBrief,
} from "../lib/operator-summary";
import { checkArtifacts } from "./artifact-check";
import type { StandupBriefing } from "./csuite";
import { resolveEscalationSecondaries } from "./escalation";
import { HARD_GATES } from "./mission";
import { assessHandoffModelQuality } from "./model-quality";
import { buildTasks, type TaskSessionRecord } from "./tasks";

export type SeatRole = "ceo" | "manager" | "ic";
export type ActionActor = "human" | "agent";
export type ActionCta =
  | "run_next"
  | "assign"
  | "open_runs"
  | "rewake"
  | "open_handoff"
  | "draft_csuite"
  | "open_report"
  | "none";

export interface SeatNextAction {
  id: string;
  priority: number;
  label: string;
  actor: ActionActor;
  kind: string;
  cta: ActionCta;
  phase?: string;
  relatedSlug?: string;
  handoffFilename?: string;
  runId?: string;
}

export interface SeatEscalation {
  phase: string;
  fromSlug: string;
  tags: string[];
  secondaries: string[];
}

export interface SeatLiveRun {
  runId: string;
  status: string;
  phase: string;
  error?: string;
  started_at: string;
  finished_at?: string;
  cost_usd?: number;
}

export interface SeatArtifactCheck {
  path: string;
  exists: boolean;
  fromHandoff: string;
}

export interface SeatReportRollup {
  slug: string;
  title: string;
  status: string;
  plainEnglish: string;
  openQuestionCount: number;
}

export interface SeatReport {
  slug: string;
  title: string;
  role: SeatRole;
  dept: string;
  reportsTo: string;
  pulse: string;
  summary: string;
  lastActivityAt: string | null;
  relevantPhases: string[];
  hardGate: boolean;
  scorecard: string;
  heartbeatPath: string | null;
  spend: { tokens: number; cost_usd: number } | null;
  operatorSummary: OperatorSummary;
  /** Same narrative layout for every role — business conversation, not raw markdown. */
  businessBrief: SeatBusinessBrief;
  /** Set when server enriches via Cursor Grok rewrite. */
  briefSource?: "grok" | "deterministic";
  /** True when a Grok rewrite is still running in the background. */
  briefEnriching?: boolean;
  decisions: string[];
  openQuestions: string[];
  reportRollups: SeatReportRollup[];
  ownHandoffs: Array<{
    filename: string;
    phase: string;
    status: string;
    verdict: string;
  }>;
  downward: Array<{
    slug: string;
    title: string;
    latestStatus: string;
    asks: string[];
    blockers: string[];
  }>;
  escalations: SeatEscalation[];
  upwardAsks: string[];
  upwardBlockers: string[];
  liveRuns: SeatLiveRun[];
  liveTasks: Array<{ id: string; title: string; status: string }>;
  artifacts: SeatArtifactCheck[];
  modelQuality: Array<{ filename: string; ok: boolean; detail: string }>;
  nextActions: SeatNextAction[];
  pinnedBriefing: {
    status: string;
    progress: string;
    updatedAt: string;
    stale: boolean;
  } | null;
}

function resolveRole(slug: string, org: OrgRegistry): SeatRole {
  if (slug === "ceo-strategist") return "ceo";
  const seat = org.roster.find((r) => r.slug === slug);
  if (!seat) return "ic";
  if (seat.level === "ic") return "ic";
  return "manager";
}

function maxIso(times: Array<string | undefined | null>): string | null {
  const vals = times.filter((t): t is string => Boolean(t && t.length > 0));
  if (vals.length === 0) return null;
  return vals.sort().at(-1) ?? null;
}

function subtreeSlugs(root: string, org: OrgRegistry): Set<string> {
  const out = new Set<string>([root]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const r of org.roster) {
      if (r.reportsTo && out.has(r.reportsTo) && !out.has(r.slug)) {
        out.add(r.slug);
        grew = true;
      }
    }
  }
  return out;
}

function buildNextActions(args: {
  role: SeatRole;
  slug: string;
  org: OrgRegistry;
  tracker: Tracker;
  handoffs: HandoffRecord[];
  queueFiles: string[];
  downward: SeatReport["downward"];
  ownHandoffs: HandoffRecord[];
  escalations: SeatEscalation[];
  liveRuns: SeatLiveRun[];
  modelQuality: SeatReport["modelQuality"];
}): SeatNextAction[] {
  const actions: SeatNextAction[] = [];
  let n = 0;
  const push = (a: Omit<SeatNextAction, "id" | "priority"> & { priority?: number }) => {
    actions.push({
      id: `a${n++}`,
      priority: a.priority ?? n,
      label: a.label,
      actor: a.actor,
      kind: a.kind,
      cta: a.cta,
      phase: a.phase,
      relatedSlug: a.relatedSlug,
      handoffFilename: a.handoffFilename,
      runId: a.runId,
    });
  };

  const phase = args.tracker.currentPhase;
  const owner =
    args.org.phaseOwners.find((p) => p.phase === phase)?.managerOwner ?? "";

  if (args.role === "ceo") {
    if (args.queueFiles.length > 0) {
      push({
        actor: "human",
        kind: "run_next",
        cta: "run_next",
        label: `Run next queued dispatch (${args.queueFiles.length})`,
        priority: 1,
      });
    }
    const managerBriefs = args.handoffs.filter((h) => h.kind === "manager");
    const csuiteByPhase = new Map(
      args.handoffs.filter((h) => h.kind === "csuite").map((h) => [h.phase, h]),
    );
    for (const mb of managerBriefs) {
      const review = csuiteByPhase.get(mb.phase);
      if (
        !review ||
        (review.verdict !== "approve" && review.verdict !== "skip-review")
      ) {
        if (
          mb.status === "ready_for_csuite" ||
          mb.verdictForManager === "ready_to_merge" ||
          mb.recommendation === "escalate"
        ) {
          push({
            actor: "human",
            kind: "csuite_review",
            cta: "draft_csuite",
            label: `Complete C-suite review phase ${mb.phase}`,
            phase: mb.phase,
            priority: 2,
            handoffFilename: `${mb.phase}-csuite-review.md`,
          });
          push({
            actor: "agent",
            kind: "csuite_review",
            cta: "none",
            label: `Spawn ceo-strategist to draft review for phase ${mb.phase}`,
            phase: mb.phase,
            relatedSlug: "ceo-strategist",
            priority: 3,
          });
        }
      }
    }
    for (const esc of args.escalations) {
      push({
        actor: "human",
        kind: "unblock",
        cta: "open_report",
        label: `Route escalation (${esc.tags.join(", ") || "untagged"}) → ${esc.secondaries.join(", ") || "CEO"}`,
        phase: esc.phase,
        relatedSlug: esc.fromSlug,
        priority: 2,
      });
      for (const sec of esc.secondaries) {
        push({
          actor: "agent",
          kind: "unblock",
          cta: "none",
          label: `Spawn secondary reviewer ${sec} for phase ${esc.phase}`,
          phase: esc.phase,
          relatedSlug: sec,
          priority: 4,
        });
      }
    }
    const blocked = args.handoffs.filter(
      (h) => h.status === "blocked" || h.status === "needs_input",
    );
    for (const b of blocked.slice(0, 5)) {
      push({
        actor: "human",
        kind: "unblock",
        cta: "open_handoff",
        label: `Unblock ${b.position}: ${b.blockers[0] || b.status}`,
        phase: b.phase,
        relatedSlug: b.position,
        handoffFilename: b.filename,
        priority: 5,
      });
    }
    const phaseRow = args.tracker.phases.find((p) => p.phase === phase);
    if (phaseRow?.status === "⬜" && owner) {
      push({
        actor: "human",
        kind: "assign",
        cta: "assign",
        label: `Assign phase ${phase} to ${owner}`,
        phase,
        relatedSlug: owner,
        priority: 6,
      });
    }
    const bad = args.modelQuality.filter((m) => !m.ok);
    if (bad[0]) {
      push({
        actor: "human",
        kind: "unblock",
        cta: "open_handoff",
        label: `Revise model routing: ${bad[0].detail}`,
        handoffFilename: bad[0].filename,
        priority: 5,
      });
    }
  }

  if (args.role === "manager") {
    const owned = args.org.phaseOwners.filter((p) => p.managerOwner === args.slug);
    for (const po of owned) {
      for (const ic of po.maySpawn) {
        const icH = args.handoffs.filter((h) => h.position === ic && h.phase === po.phase);
        if (icH.length === 0) {
          push({
            actor: "agent",
            kind: "await_ic",
            cta: "none",
            label: `Await IC handoff: ${ic} (phase ${po.phase})`,
            phase: po.phase,
            relatedSlug: ic,
            priority: 1,
          });
        }
      }
      const ics = po.maySpawn;
      const allDone =
        ics.length > 0 &&
        ics.every((ic) =>
          args.handoffs.some(
            (h) =>
              h.position === ic &&
              h.phase === po.phase &&
              (h.status === "done" || h.verdictForManager === "ready_to_merge"),
          ),
        );
      const mgrBrief = args.ownHandoffs.find(
        (h) => h.kind === "manager" && h.phase === po.phase,
      );
      if (allDone && !mgrBrief) {
        push({
          actor: "agent",
          kind: "write_brief",
          cta: "none",
          label: `Merge ICs and write manager brief for phase ${po.phase}`,
          phase: po.phase,
          priority: 2,
        });
      }
      if (
        mgrBrief &&
        (mgrBrief.status === "ready_for_csuite" ||
          mgrBrief.verdictForManager === "ready_to_merge")
      ) {
        push({
          actor: "human",
          kind: "csuite_review",
          cta: "draft_csuite",
          label: `Ready for C-suite review phase ${po.phase}`,
          phase: po.phase,
          priority: 3,
        });
      }
    }
    for (const oh of args.ownHandoffs) {
      if (oh.status === "blocked" || oh.status === "needs_input") {
        push({
          actor: "human",
          kind: "unblock",
          cta: "open_handoff",
          label: `Resolve: ${oh.asks[0] || oh.blockers[0] || oh.status}`,
          handoffFilename: oh.filename,
          phase: oh.phase,
          priority: 2,
        });
      }
    }
  }

  if (args.role === "ic") {
    if (args.ownHandoffs.length === 0) {
      push({
        actor: "agent",
        kind: "complete_handoff",
        cta: "none",
        label: `Complete IC handoff for phase ${phase}`,
        phase,
        priority: 1,
      });
    } else {
      const latest = args.ownHandoffs.at(-1)!;
      if (latest.status === "blocked" || latest.status === "needs_input") {
        push({
          actor: "human",
          kind: "unblock",
          cta: "open_handoff",
          label: `Resolve blocker / ask_manager: ${latest.asks[0] || latest.blockers[0] || latest.status}`,
          handoffFilename: latest.filename,
          phase: latest.phase,
          priority: 1,
        });
        push({
          actor: "agent",
          kind: "complete_handoff",
          cta: "none",
          label: "Continue work inside write_lease after unblock",
          phase: latest.phase,
          priority: 2,
        });
      } else if (latest.status === "done" || latest.verdictForManager === "ready_to_merge") {
        push({
          actor: "agent",
          kind: "idle",
          cta: "none",
          label: "Waiting on manager merge",
          phase: latest.phase,
          priority: 3,
        });
      }
    }
  }

  for (const r of args.liveRuns.filter(
    (x) => x.status === "running" || x.status === "starting" || x.status === "error",
  )) {
    push({
      actor: r.status === "error" ? "human" : "agent",
      kind: "run_next",
      cta: "open_runs",
      label:
        r.status === "error"
          ? `Inspect failed run ${r.runId}: ${r.error || "error"}`
          : `Monitor in-flight run ${r.runId}`,
      runId: r.runId,
      phase: r.phase,
      priority: r.status === "error" ? 1 : 7,
    });
  }

  if (actions.length === 0) {
    push({
      actor: "human",
      kind: "idle",
      cta: "none",
      label: `No open actions — phase ${phase} owned by ${owner || "unassigned"}`,
      phase,
      priority: 99,
    });
  }

  return actions.sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
}

function narrativeSourceMarkdown(
  ownLatest: HandoffRecord | undefined,
  deliverableMarkdown?: string,
): string {
  const parts = [deliverableMarkdown?.trim() ?? "", ownLatest?.body?.trim() ?? ""].filter(
    Boolean,
  );
  return parts.join("\n\n");
}

export function buildSeatReport(args: {
  slug: string;
  org: OrgRegistry;
  tracker: Tracker;
  handoffs: HandoffRecord[];
  queueFiles: string[];
  claimedFiles: string[];
  runs: RunRecord[];
  briefings: StandupBriefing[];
  sessions?: TaskSessionRecord[];
  repoRoot?: string;
  spendBySeat?: Record<string, { tokens: number; cost_usd: number }>;
  models?: ModelRegistry;
  exists?: (abs: string) => boolean;
  /** Latest REVIEW/inbox deliverable markdown for this seat (optional). */
  deliverableMarkdown?: string;
}): SeatReport | null {
  const seat = args.org.roster.find((r) => r.slug === args.slug);
  if (!seat) return null;
  const role = resolveRole(args.slug, args.org);
  const reports = args.org.roster.filter((r) => r.reportsTo === args.slug);
  const ownHandoffs = args.handoffs.filter((h) => h.position === args.slug);
  const tree = subtreeSlugs(args.slug, args.org);

  const tasks = buildTasks({
    tracker: args.tracker,
    handoffs: args.handoffs,
    queueFiles: args.queueFiles,
    claimedFiles: args.claimedFiles,
    runs: args.runs,
    sessions: args.sessions,
  }).filter(
    (t) =>
      t.slug === args.slug ||
      (role === "ceo" &&
        (t.source === "csuite-gate" || t.status === "queued" || t.status === "blocked")),
  );

  const downward = reports.map((r) => {
    const latest = args.handoffs.filter((h) => h.position === r.slug).at(-1);
    return {
      slug: r.slug,
      title: r.title,
      latestStatus: latest?.status || latest?.verdict || "idle",
      asks: collectOpenQuestions(latest?.asks ?? [], []),
      blockers: humanizeBlockers(latest?.blockers ?? [], 2),
    };
  });

  const escSource =
    role === "ceo"
      ? args.handoffs.filter((h) => tree.has(h.position))
      : ownHandoffs;
  const escalations: SeatEscalation[] = [];
  for (const h of escSource) {
    if (h.recommendation !== "escalate" && h.verdictForManager !== "escalate") {
      continue;
    }
    const tags = h.escalationTags;
    escalations.push({
      phase: h.phase,
      fromSlug: h.position,
      tags,
      secondaries: resolveEscalationSecondaries(tags),
    });
  }

  const seatRuns = args.runs.filter((r) =>
    role === "ceo" ? tree.has(r.position) : r.position === args.slug,
  );
  const liveRuns: SeatLiveRun[] = seatRuns.slice(0, 12).map((r) => ({
    runId: r.runId,
    status: r.status,
    phase: r.phase,
    error: r.error,
    started_at: r.started_at,
    finished_at: r.finished_at,
    cost_usd: r.cost_usd,
  }));

  const artifactItems = ownHandoffs.flatMap((h) =>
    h.artifacts.map((a) => ({ path: a.path, fromHandoff: h.filename })),
  );
  if (role === "ceo" || role === "manager") {
    for (const h of args.handoffs.filter((x) => tree.has(x.position))) {
      for (const a of h.artifacts) {
        artifactItems.push({ path: a.path, fromHandoff: h.filename });
      }
    }
  }
  const artifacts =
    args.repoRoot && args.exists
      ? checkArtifacts(args.repoRoot, artifactItems, args.exists)
      : artifactItems.map((i) => ({ ...i, exists: true }));

  const qualityHandoffs =
    role === "ceo"
      ? args.handoffs.filter((h) => tree.has(h.position))
      : ownHandoffs;
  const modelQuality = qualityHandoffs.map((h) => {
    const expected = args.models?.[h.position];
    const r = assessHandoffModelQuality(
      h,
      expected
        ? {
            llmTier: expected.llmTier,
            generationProfile: expected.generationProfile,
          }
        : undefined,
      h.phase,
    );
    return { filename: h.filename, ok: r.ok, detail: r.detail };
  });

  const nextActions = buildNextActions({
    role,
    slug: args.slug,
    org: args.org,
    tracker: args.tracker,
    handoffs: args.handoffs,
    queueFiles: args.queueFiles,
    downward,
    ownHandoffs,
    escalations,
    liveRuns,
    modelQuality,
  });

  const pinned = args.briefings.find((b) => b.slug === args.slug) ?? null;
  const lastActivityAt = maxIso([
    ...seatRuns.map((r) => r.finished_at || r.started_at),
    pinned?.updatedAt,
  ]);

  const ownLatest = ownHandoffs.at(-1);
  const narrativeMd = narrativeSourceMarkdown(ownLatest, args.deliverableMarkdown);
  const operatorSummary = extractOperatorSummary(narrativeMd);
  const decisions = extractDecisions(narrativeMd);
  const openQuestions = collectOpenQuestions(
    ownHandoffs.flatMap((h) => h.asks),
    operatorSummary.nextSteps,
  );
  const rawBlockers = ownHandoffs.flatMap((h) => h.blockers);
  const businessBrief = buildSeatBusinessBrief({
    operatorSummary,
    decisions,
    openQuestions,
    blockers: rawBlockers,
    fallbackSummary:
      pinned?.progress ||
      ownLatest?.status ||
      "",
  });

  const reportRollups: SeatReportRollup[] =
    role === "ceo" || role === "manager"
      ? reports.map((r) => {
          const latest = args.handoffs.filter((h) => h.position === r.slug).at(-1);
          const summaryFor = extractOperatorSummary(latest?.body ?? "");
          return {
            slug: r.slug,
            title: r.title,
            status: latest?.status || latest?.verdict || "idle",
            plainEnglish: summaryFor.plainEnglish.join(" ") || "",
            openQuestionCount: collectOpenQuestions(
              latest?.asks ?? [],
              summaryFor.nextSteps,
            ).length,
          };
        })
      : [];

  const summary =
    businessBrief.whatHappened.join(" ").slice(0, 220) ||
    operatorSummary.plainEnglish.join(" ").slice(0, 200) ||
    pinned?.progress?.slice(0, 200) ||
    ownLatest?.status ||
    downward.map((d) => `${d.slug}:${d.latestStatus}`).join(", ") ||
    "No handoffs yet";

  const ownedPhases = args.org.phaseOwners
    .filter((p) => p.managerOwner === args.slug)
    .map((p) => p.phase);
  const scorecard =
    args.org.phaseOwners.find((p) => p.phase === args.tracker.currentPhase)
      ?.scorecard ?? "";

  const heartbeatRel = `skills/org/positions/${args.slug}/HEARTBEAT.md`;
  const heartbeatExists = Boolean(
    args.repoRoot &&
      args.exists?.(
        `${args.repoRoot.replace(/\/+$/, "")}/${heartbeatRel}`,
      ),
  );

  const spend = args.spendBySeat?.[args.slug] ?? null;

  return {
    slug: seat.slug,
    title: seat.title,
    role,
    dept: seat.dept,
    reportsTo: seat.reportsTo,
    pulse: ownLatest?.status || liveRuns[0]?.status || "idle",
    summary,
    lastActivityAt,
    relevantPhases: [
      ...new Set(
        [...ownedPhases, ...ownHandoffs.map((h) => h.phase), args.tracker.currentPhase].filter(
          Boolean,
        ),
      ),
    ],
    hardGate: HARD_GATES.has(args.tracker.currentPhase),
    scorecard,
    heartbeatPath: heartbeatExists ? heartbeatRel : null,
    spend: spend
      ? { tokens: spend.tokens, cost_usd: spend.cost_usd }
      : null,
    operatorSummary,
    businessBrief,
    decisions,
    openQuestions,
    reportRollups,
    ownHandoffs: ownHandoffs.map((h) => ({
      filename: h.filename,
      phase: h.phase,
      status: h.status || h.verdict,
      verdict: h.verdict || h.verdictForManager,
    })),
    downward,
    escalations,
    upwardAsks: openQuestions,
    upwardBlockers: humanizeBlockers(rawBlockers, 6),
    liveRuns,
    liveTasks: tasks.map((t) => ({ id: t.id, title: t.title, status: t.status })),
    artifacts,
    modelQuality,
    nextActions,
    pinnedBriefing: pinned
      ? {
          status: pinned.status,
          progress: pinned.progress,
          updatedAt: pinned.updatedAt,
          stale: Boolean(
            lastActivityAt &&
              pinned.updatedAt &&
              pinned.updatedAt < lastActivityAt,
          ),
        }
      : null,
  };
}

export function seatReportBriefScript(report: SeatReport): string {
  const brief = report.businessBrief;
  const parts = [`${report.title}.`];
  if (brief.whatHappened[0]) {
    parts.push(brief.whatHappened.slice(0, 2).join(" "));
  } else {
    parts.push(report.summary.slice(0, 160));
  }
  if (brief.nextSteps[0]) {
    parts.push(`Next: ${brief.nextSteps[0]}`);
  }
  const qs = brief.needsFromYou.filter(Boolean).slice(0, 2);
  if (qs.length) {
    const more =
      brief.needsFromYou.length > qs.length
        ? ` (${brief.needsFromYou.length} total)`
        : "";
    parts.push(`I need your input${more}: ${qs.join(" ")}`);
  }
  if (brief.whatsStuck[0]) {
    parts.push(`What's stuck: ${brief.whatsStuck[0]}`);
  } else if (report.escalations[0]) {
    parts.push("There is an escalation on this seat.");
  }
  let out = parts.join(" ");
  if (out.length > 400) out = `${out.slice(0, 397).trimEnd()}…`;
  return out;
}
