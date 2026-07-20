import { join } from "node:path";
import { listRuns } from "../runs-fs";
import { listSessions } from "../sessions";
import { dispatchRoot } from "../paths";
import { listRunEventsSince, type RunEvent } from "./run-events";

const ACTIVE_RUN = new Set(["starting", "running"]);
const ACTIVE_SESSION = new Set(["queued", "running", "starting", "claimed"]);

export function hasActiveRunsOrSessions(droot: string): boolean {
  const runsDir = join(droot, "runs");
  if (listRuns(runsDir, 200).some((r) => ACTIVE_RUN.has(r.status))) return true;
  return listSessions(droot).some((s) => ACTIVE_SESSION.has(String(s.status).toLowerCase()));
}

export function buildEventsSincePayload(
  repoRoot: string,
  cursor?: string,
): {
  events: RunEvent[];
  nextCursor: string | null;
  active: boolean;
} {
  const droot = dispatchRoot(repoRoot);
  const { events, nextCursor } = listRunEventsSince(droot, cursor);
  return {
    events,
    nextCursor,
    active: hasActiveRunsOrSessions(droot),
  };
}
