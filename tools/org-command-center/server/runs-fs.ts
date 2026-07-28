import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseRunRecord, type RunRecord } from "../src/lib/runs";

/** Mark abandoned in-process runs so the UI does not show perpetual "running". */
export function reconcileStaleRuns(
  runsDir: string,
  opts?: { maxAgeMs?: number; now?: number },
): number {
  if (!existsSync(runsDir)) return 0;
  const maxAgeMs = opts?.maxAgeMs ?? 15 * 60 * 1000;
  const now = opts?.now ?? Date.now();
  let marked = 0;
  for (const f of readdirSync(runsDir)) {
    if (!f.endsWith(".json") || f.endsWith(".payload.json")) continue;
    const path = join(runsDir, f);
    try {
      const raw = JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
      const status = String(raw.status ?? "");
      if (status !== "running" && status !== "starting") continue;
      const started = Date.parse(String(raw.started_at ?? ""));
      if (!Number.isFinite(started) || now - started < maxAgeMs) continue;
      raw.status = "error";
      raw.finished_at = new Date(now).toISOString();
      raw.error =
        String(raw.error ?? "").trim() ||
        "Stale run — worker/process exited without writing a final status";
      writeFileSync(path, JSON.stringify(raw, null, 2) + "\n", "utf8");
      marked += 1;
    } catch {
      /* skip corrupt */
    }
  }
  return marked;
}

export function listRuns(runsDir: string, limit = 40): RunRecord[] {
  if (!existsSync(runsDir)) return [];
  // Only true run records — ignore worker sidecars (*.payload.json).
  const files = readdirSync(runsDir).filter(
    (f) => f.endsWith(".json") && !f.endsWith(".payload.json"),
  );
  const records: RunRecord[] = [];
  for (const f of files) {
    try {
      const raw = JSON.parse(readFileSync(join(runsDir, f), "utf8"));
      records.push(parseRunRecord(raw));
    } catch {
      /* skip corrupt */
    }
  }
  records.sort((a, b) => (b.started_at || "").localeCompare(a.started_at || ""));
  return records.slice(0, limit);
}

export function readRun(runsDir: string, runId: string): RunRecord | null {
  const path = join(runsDir, `${runId}.json`);
  if (!existsSync(path)) return null;
  try {
    return parseRunRecord(JSON.parse(readFileSync(path, "utf8")));
  } catch {
    return null;
  }
}
