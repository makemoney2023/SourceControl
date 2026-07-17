import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

export type RunEvent = {
  at: string;
  type: "started" | "finished" | "error" | "acceptance_failed";
  runId: string;
  position: string;
  detail?: string;
};

export function runEventsPath(dispatchRoot: string) {
  return join(dispatchRoot, "run-events.jsonl");
}

export function appendRunEvent(dispatchRoot: string, event: RunEvent): void {
  const path = runEventsPath(dispatchRoot);
  mkdirSync(dirname(path), { recursive: true });
  appendFileSync(path, `${JSON.stringify(event)}\n`, "utf8");
}

export function listRunEvents(dispatchRoot: string, limit = 50): RunEvent[] {
  const path = runEventsPath(dispatchRoot);
  if (!existsSync(path)) return [];
  const lines = readFileSync(path, "utf8").split("\n").filter(Boolean);
  const slice = lines.slice(-limit);
  const out: RunEvent[] = [];
  for (const line of slice) {
    try {
      out.push(JSON.parse(line) as RunEvent);
    } catch {
      /* skip malformed rows */
    }
  }
  return out.reverse();
}

function seatLabel(position: string): string {
  if (position === "ceo-strategist") return "CEO";
  return position.replace(/-/g, " ");
}

export function summarizeRunEvents(events: RunEvent[]): string {
  if (!events.length) return "No recent run events.";
  const latest = events[0];
  const who = seatLabel(latest.position);
  switch (latest.type) {
    case "started":
      return `${who} started.`;
    case "finished":
      return `${who} finished.`;
    case "error":
      return latest.detail ? `${who} failed: ${latest.detail}.` : `${who} failed.`;
    case "acceptance_failed":
      return latest.detail
        ? `${who} finished with gaps: ${latest.detail}.`
        : `${who} finished with gaps.`;
    default:
      return `Latest run update for ${who}.`;
  }
}
