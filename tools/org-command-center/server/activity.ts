import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

export type ActivityEventType =
  | "spawn_refused_budget"
  | "spawn_refused_paused"
  | "spawn_started"
  | "spawn_finished"
  | "spawn_acceptance_failed"
  | "spawn_error"
  | "spawn_cancelled"
  | "seat_paused"
  | "seat_resumed"
  | "budget_exhausted"
  | "rewake_started"
  | "routine_fired"
  | "cost_recorded"
  | "jarvis.focus"
  | "jarvis_act"
  | "jarvis_confirm"
  | "jarvis_denied";

export interface ActivityEvent {
  at: string;
  type: ActivityEventType;
  runId?: string;
  position?: string;
  detail?: string;
  phase?: string;
  slug?: string;
  openReport?: boolean;
  focusQuestions?: boolean;
}

export function activityPath(dispatchRoot: string) {
  return join(dispatchRoot, "activity.jsonl");
}

export function appendActivity(dispatchRoot: string, event: Omit<ActivityEvent, "at"> & { at?: string }) {
  const path = activityPath(dispatchRoot);
  mkdirSync(dirname(path), { recursive: true });
  const row: ActivityEvent = {
    at: event.at ?? new Date().toISOString(),
    type: event.type,
    runId: event.runId,
    position: event.position,
    detail: event.detail,
    phase: event.phase,
    slug: event.slug,
    openReport: event.openReport,
    focusQuestions: event.focusQuestions,
  };
  appendFileSync(path, `${JSON.stringify(row)}\n`, "utf8");
}

export function readActivityTail(dispatchRoot: string, limit = 40): ActivityEvent[] {
  const path = activityPath(dispatchRoot);
  if (!existsSync(path)) return [];
  const lines = readFileSync(path, "utf8").split("\n").filter(Boolean);
  const slice = lines.slice(-limit);
  const out: ActivityEvent[] = [];
  for (const line of slice) {
    try {
      out.push(JSON.parse(line) as ActivityEvent);
    } catch {
      /* skip */
    }
  }
  return out.reverse();
}
