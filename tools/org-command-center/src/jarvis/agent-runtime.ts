import type { RunRecord } from "../lib/runs";
import type { SeatVisualStatus } from "./status";
import { seatStatus } from "./status";

export type AgentRuntimeStatus = "active" | "running" | "error" | "paused" | SeatVisualStatus;

export interface AgentStateFile {
  paused: boolean;
  updated_at?: string;
}

/**
 * Priority: paused > error > running > handoff-derived (idle/done/blocked/…).
 * "active" means enabled and idle (no open handoff pulse).
 */
export function deriveAgentRuntimeStatus(args: {
  slug: string;
  paused?: boolean;
  latestRun?: RunRecord | null;
  handoffs: {
    position: string;
    filename: string;
    kind: string;
    status: string;
    verdictForManager: string;
    verdict: string;
    asks?: string[];
  }[];
}): AgentRuntimeStatus {
  if (args.paused) return "paused";
  const run = args.latestRun;
  if (run && (run.status === "starting" || run.status === "running")) return "running";
  if (run && run.status === "error") return "error";
  const { status } = seatStatus(args.slug, args.handoffs);
  if (status === "idle") return "active";
  return status;
}

export function latestRunByPosition(runs: RunRecord[]): Map<string, RunRecord> {
  const map = new Map<string, RunRecord>();
  for (const r of runs) {
    if (!r.position) continue;
    if (!map.has(r.position)) map.set(r.position, r);
  }
  return map;
}

export function buildAgentRuntimeMap(args: {
  slugs: string[];
  agentStates: Record<string, AgentStateFile>;
  runs: RunRecord[];
  handoffs: {
    position: string;
    filename: string;
    kind: string;
    status: string;
    verdictForManager: string;
    verdict: string;
    asks?: string[];
  }[];
}): Record<string, AgentRuntimeStatus> {
  const byPos = latestRunByPosition(args.runs);
  const out: Record<string, AgentRuntimeStatus> = {};
  for (const slug of args.slugs) {
    out[slug] = deriveAgentRuntimeStatus({
      slug,
      paused: Boolean(args.agentStates[slug]?.paused),
      latestRun: byPos.get(slug),
      handoffs: args.handoffs,
    });
  }
  return out;
}
