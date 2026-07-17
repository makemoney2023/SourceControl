import type { TokenUsageLike } from "./cost-rates";
import type { ManagerPacket } from "./types";

export type WakeReason =
  | "assignment"
  | "on_demand"
  | "auto_queue"
  | "chat"
  | "run_next"
  | "rewake"
  | "timer";

export type RunStatus =
  | "starting"
  | "running"
  | "completed"
  | "completed_with_gaps"
  | "error"
  | "cancelled";

export type RunAcceptance = {
  ok: boolean;
  missing: string[];
  checkedAt: string;
};

export interface RunRecord {
  runId: string;
  status: RunStatus;
  position: string;
  phase: string;
  claimed: string;
  dispatch_filename: string;
  wake_reason: WakeReason;
  started_at: string;
  finished_at?: string;
  llm_model: string;
  result?: unknown;
  error?: string;
  agentId?: string;
  usage?: TokenUsageLike;
  cost_usd?: number;
  duration_ms?: number;
  acceptance?: RunAcceptance;
}

const WAKE: WakeReason[] = [
  "assignment",
  "on_demand",
  "auto_queue",
  "chat",
  "run_next",
  "rewake",
  "timer",
];

const STATUSES: RunStatus[] = [
  "starting",
  "running",
  "completed",
  "completed_with_gaps",
  "error",
  "cancelled",
];

export function assertBudgetAllowsSpawn(
  packet: Pick<ManagerPacket, "budget_usd">,
): { ok: true } | { ok: false; error: string } {
  const b = packet.budget_usd;
  if (b === null || b === undefined) return { ok: true };
  if (typeof b === "number" && b <= 0) {
    return { ok: false, error: `budget_usd hard-stop: ${b}` };
  }
  return { ok: true };
}

export function parseRunRecord(raw: unknown): RunRecord {
  const o = (raw ?? {}) as Record<string, unknown>;
  const wake = WAKE.includes(o.wake_reason as WakeReason)
    ? (o.wake_reason as WakeReason)
    : "on_demand";
  const status = STATUSES.includes(o.status as RunStatus)
    ? (o.status as RunStatus)
    : "error";
  const claimed = String(o.claimed ?? o.dispatch_filename ?? "");
  return {
    runId: String(o.runId ?? ""),
    status,
    position: String(o.position ?? ""),
    phase: String(o.phase ?? ""),
    claimed,
    dispatch_filename: String(o.dispatch_filename ?? claimed),
    wake_reason: wake,
    started_at: String(o.started_at ?? ""),
    finished_at: o.finished_at ? String(o.finished_at) : undefined,
    llm_model: String(o.llm_model ?? ""),
    result: o.result,
    error: o.error ? String(o.error) : undefined,
    agentId: o.agentId ? String(o.agentId) : undefined,
    usage: o.usage as TokenUsageLike | undefined,
    cost_usd: typeof o.cost_usd === "number" ? o.cost_usd : undefined,
    duration_ms: typeof o.duration_ms === "number" ? o.duration_ms : undefined,
    acceptance: o.acceptance as RunAcceptance | undefined,
  };
}
