import { join } from "node:path";
import type { RunRecord } from "../../src/lib/runs";
import { advancePhase0Roundtable } from "../jarvis/phase0-roundtable";
import { dispatchRoot } from "../paths";
import { listRuns } from "../runs-fs";
import { appendLifecycleLine } from "./fs-store";

export function formatRunLifecycleLine(run: RunRecord): string {
  const parts = [`run ${run.runId}`, run.status, `seat=${run.position}`];
  if (run.acceptance) {
    if (run.acceptance.ok) {
      parts.push("acceptance ok");
    } else if (run.acceptance.missing.length > 0) {
      parts.push(`acceptance gap: ${run.acceptance.missing.join(", ")}`);
    } else {
      parts.push("acceptance gap");
    }
  }
  return parts.join(" ");
}

export function recordRunLifecycle(repoRoot: string, run: RunRecord): void {
  try {
    const line = formatRunLifecycleLine(run);
    appendLifecycleLine(repoRoot, line);
  } catch (err) {
    console.warn(
      "[memory] lifecycle write failed:",
      err instanceof Error ? err.message : err,
    );
  }
  try {
    advancePhase0Roundtable(repoRoot);
  } catch (err) {
    console.warn(
      "[phase0-roundtable] advance failed:",
      err instanceof Error ? err.message : err,
    );
  }
}

function runsDir(repoRoot: string): string {
  return join(dispatchRoot(repoRoot), "runs");
}

export function loadRecentRunLines(repoRoot: string, limit = 5): string[] {
  try {
    const runs = listRuns(runsDir(repoRoot), 40).filter((r) => r.finished_at);
    return runs.slice(0, limit).map(formatRunLifecycleLine);
  } catch {
    return [];
  }
}
