import type { RunRecord } from "../lib/runs";
import type { HandoffRecord, Tracker } from "../lib/types";

export type TaskStatus =
  | "blocked"
  | "escalate"
  | "awaiting_csuite"
  | "in_flight"
  | "in_progress"
  | "queued"
  | "pending"
  | "done";

export interface OrgTask {
  id: string;
  title: string;
  status: TaskStatus;
  phase?: string;
  slug?: string;
  tags: string[];
  source: string;
  dispatchFilename?: string;
  runId?: string;
  canPlay?: boolean;
  canCancel?: boolean;
  canRewake?: boolean;
}

export type TaskSessionRecord = {
  agentId?: string;
  position: string;
  phase?: string;
  dispatch_filename: string;
  updated_at?: string;
  status: string;
};

const ORDER: TaskStatus[] = [
  "blocked",
  "escalate",
  "awaiting_csuite",
  "in_flight",
  "in_progress",
  "queued",
  "pending",
  "done",
];

function slugFromDispatchFilename(filename: string): string | undefined {
  // e.g. 2-head-of-research-20260716T140000Z.yaml
  const base = filename.replace(/\.(ya?ml)$/i, "");
  const parts = base.split("-");
  if (parts.length < 3) return undefined;
  // drop phase + timestamp tail (last token looks like 20260716T…)
  const maybeTs = parts[parts.length - 1];
  if (/^\d{8}T/.test(maybeTs)) {
    return parts.slice(1, -1).join("-") || undefined;
  }
  return parts.slice(1).join("-") || undefined;
}

export function buildTasks(args: {
  tracker: Tracker;
  handoffs: HandoffRecord[];
  queueFiles: string[];
  claimedFiles: string[];
  runs?: RunRecord[];
  sessions?: TaskSessionRecord[];
}): OrgTask[] {
  const tasks: OrgTask[] = [];
  const runs = args.runs ?? [];
  const sessions = args.sessions ?? [];

  for (const p of args.tracker.phases) {
    if (p.status === "⬜") {
      tasks.push({
        id: `phase:${p.phase}`,
        title: `Phase ${p.phase} — ${p.name}`,
        status: "pending",
        phase: p.phase,
        tags: [],
        source: "tracker",
        canPlay: false,
        canCancel: false,
      });
    } else if (p.status === "🔄") {
      tasks.push({
        id: `phase:${p.phase}`,
        title: `Phase ${p.phase} — ${p.name}`,
        status: "in_progress",
        phase: p.phase,
        tags: [],
        source: "tracker",
        canPlay: false,
        canCancel: false,
      });
    }
  }

  for (const f of args.queueFiles) {
    tasks.push({
      id: `dispatch:${f}`,
      title: `Queued dispatch ${f}`,
      status: "queued",
      phase: f.split("-")[0],
      slug: slugFromDispatchFilename(f),
      tags: [],
      source: "dispatch/queue",
      dispatchFilename: f,
      canPlay: true,
      canCancel: false,
    });
  }

  for (const f of args.claimedFiles) {
    const relatedRuns = runs.filter(
      (run) => (run.dispatch_filename || run.claimed) === f,
    );
    const relatedSessions = sessions.filter(
      (session) => session.dispatch_filename === f,
    );
    const latest = [
      ...relatedRuns.map((run) => ({
        status: run.status,
        at: run.finished_at || run.started_at,
        run,
      })),
      ...relatedSessions.map((session) => ({
        status: session.status,
        at: session.updated_at || "",
        run: undefined,
      })),
    ].sort((a, b) => b.at.localeCompare(a.at))[0];
    const active =
      latest &&
      (latest.status === "starting" ||
        latest.status === "running" ||
        latest.status === "active" ||
        latest.status === "connected");
    const successful = latest?.status === "completed";
    const activeRun = active
      ? relatedRuns.find(
          (run) => run.status === "starting" || run.status === "running",
        )
      : undefined;
    const retryable =
      latest != null &&
      (latest.status === "error" ||
        latest.status === "failed" ||
        latest.status === "cancelled" ||
        latest.status === "completed_with_gaps");
    const status: TaskStatus = active
      ? "in_flight"
      : successful
        ? "done"
        : "pending";
    tasks.push({
      id: `dispatch_claimed:${f}`,
      title: active
        ? `In-flight dispatch ${f}`
        : successful
          ? `Completed dispatch ${f}`
          : `Claimed dispatch ${f}`,
      status,
      phase: f.split("-")[0],
      slug: slugFromDispatchFilename(f),
      tags: [],
      source: "dispatch/claimed",
      dispatchFilename: f,
      runId: activeRun?.runId,
      canPlay: false,
      canCancel: Boolean(activeRun),
      canRewake: retryable && relatedSessions.length > 0,
    });
  }

  const managerBriefs = args.handoffs.filter((h) => h.kind === "manager");
  const csuiteByPhase = new Map(
    args.handoffs.filter((h) => h.kind === "csuite").map((h) => [h.phase, h]),
  );

  for (const h of args.handoffs) {
    if (h.kind === "other") continue;
    let status: TaskStatus = "pending";
    if (h.status === "blocked" || h.status === "needs_input") status = "blocked";
    else if (h.verdictForManager === "escalate") status = "escalate";
    else if (h.status === "done" || h.verdict === "approve") status = "done";
    else if (h.status) status = "in_progress";

    tasks.push({
      id: `handoff:${h.filename}`,
      title: `${h.kind} ${h.position || h.filename}`,
      status,
      phase: h.phase,
      slug: h.position,
      tags: [],
      source: "handoff",
      canPlay: false,
      canCancel: false,
    });
  }

  for (const mb of managerBriefs) {
    const review = csuiteByPhase.get(mb.phase);
    if (!review || (review.verdict !== "approve" && review.verdict !== "skip-review")) {
      if (mb.status === "ready_for_csuite" || mb.verdictForManager === "ready_to_merge" || mb.status) {
        const seat = mb.position || mb.filename.replace(/\.md$/i, "") || "manager";
        tasks.push({
          id: `review:${mb.phase}:${seat}`,
          title: `C-suite review phase ${mb.phase} (${seat})`,
          status: "awaiting_csuite",
          phase: mb.phase,
          slug: mb.position,
          tags: [],
          source: "csuite-gate",
          canPlay: false,
          canCancel: false,
        });
      }
    }
  }

  return tasks.sort(
    (a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status) || a.id.localeCompare(b.id),
  );
}
