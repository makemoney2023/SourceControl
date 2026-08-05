import type { SeatVisualStatus } from "./status";
import { seatStatus } from "./status";

export type SeatWorkRun = {
  runId: string;
  position: string;
  status: string;
  phase: string;
  started_at: string;
  dispatch_filename?: string;
};

export type SeatWorkSession = {
  position: string;
  status: string;
  phase?: string;
  updated_at?: string;
  dispatch_filename?: string;
  agentId?: string;
};

export type SeatWorkArgs = {
  handoffs: {
    position: string;
    filename: string;
    kind: string;
    status: string;
    verdictForManager: string;
    verdict: string;
    phase?: string;
    blockers?: string[];
    asks?: string[];
  }[];
  runs?: SeatWorkRun[];
  sessions?: SeatWorkSession[];
  claimedFiles?: string[];
  queueFiles?: string[];
  agentStates?: Record<string, { paused?: boolean }>;
};

export type SeatWorkContext = {
  status: SeatVisualStatus;
  phase?: string;
  goal?: string;
  runId?: string;
  startedAt?: string;
  queuePosition?: number;
  blockReason?: string;
  handoff?: SeatWorkArgs["handoffs"][number];
};

function dispatchMentionsSeat(filename: string, slug: string): boolean {
  const base = filename.replace(/\.(ya?ml|json)$/i, "");
  return base.includes(slug);
}

function phaseFromDispatch(filename: string): string | undefined {
  const m = filename.match(/^(\d+[A-Za-z]?)-/);
  return m?.[1];
}

function latestLiveRun(slug: string, runs: SeatWorkRun[]): SeatWorkRun | undefined {
  const live = runs.filter(
    (r) =>
      r.position === slug &&
      (r.status === "running" || r.status === "starting"),
  );
  return live.sort((a, b) => b.started_at.localeCompare(a.started_at))[0];
}

const ACTIVE_SESSION_STATUSES = new Set([
  "active",
  "starting",
  "running",
  "connected",
]);

function latestLiveSession(
  slug: string,
  sessions: SeatWorkSession[],
): SeatWorkSession | undefined {
  return sessions
    .filter(
      (session) =>
        session.position === slug &&
        ACTIVE_SESSION_STATUSES.has(session.status.toLowerCase()),
    )
    .sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""))[0];
}

export function seatWorkContext(slug: string, args: SeatWorkArgs): SeatWorkContext {
  const { status: handoffStatus } = seatStatus(slug, args.handoffs);
  const handoff =
    args.handoffs.find((x) => x.position === slug) ??
    args.handoffs.find((x) => x.filename.includes(slug));
  const paused = Boolean(args.agentStates?.[slug]?.paused);
  const liveRun = latestLiveRun(slug, args.runs ?? []);
  const session = latestLiveSession(slug, args.sessions ?? []);
  const claimed = (args.claimedFiles ?? []).find((f) => dispatchMentionsSeat(f, slug));
  const queueIdx = (args.queueFiles ?? []).findIndex((f) => dispatchMentionsSeat(f, slug));
  const queued = queueIdx >= 0 ? (args.queueFiles ?? [])[queueIdx] : undefined;

  const blockReason =
    handoff &&
    (handoff.status === "blocked" || handoff.status === "needs_input")
      ? (handoff.blockers?.[0] || handoff.asks?.[0] || handoff.status)
      : undefined;

  if (paused) {
    return {
      status: "paused",
      phase: liveRun?.phase ?? handoff?.phase ?? phaseFromDispatch(claimed ?? queued ?? ""),
      runId: liveRun?.runId,
      startedAt: liveRun?.started_at,
      blockReason,
      handoff,
      queuePosition: queued ? queueIdx + 1 : undefined,
    };
  }

  if (handoffStatus === "blocked" || handoffStatus === "escalate") {
    return {
      status: handoffStatus,
      phase: handoff?.phase ?? liveRun?.phase,
      blockReason,
      runId: liveRun?.runId,
      startedAt: liveRun?.started_at,
      handoff,
    };
  }

  if (liveRun || session) {
    const phase =
      liveRun?.phase ??
      session?.phase ??
      handoff?.phase ??
      phaseFromDispatch(claimed ?? session?.dispatch_filename ?? "");
    return {
      status: "running",
      phase,
      goal: phase ? `Phase ${phase}` : undefined,
      runId: liveRun?.runId,
      startedAt: liveRun?.started_at,
      handoff,
    };
  }

  if (queued) {
    return {
      status: "active",
      phase: phaseFromDispatch(queued) ?? handoff?.phase,
      goal: `Queued · Phase ${phaseFromDispatch(queued) ?? "?"}`,
      queuePosition: queueIdx + 1,
      handoff,
    };
  }

  if (handoffStatus === "done" || handoffStatus === "csuite" || handoffStatus === "running") {
    return {
      status: handoffStatus,
      phase: handoff?.phase,
      handoff,
    };
  }

  return { status: "idle", handoff };
}
