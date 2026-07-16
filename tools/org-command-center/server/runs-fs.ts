import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseRunRecord, type RunRecord } from "../src/lib/runs";

export function listRuns(runsDir: string, limit = 40): RunRecord[] {
  if (!existsSync(runsDir)) return [];
  const files = readdirSync(runsDir).filter((f) => f.endsWith(".json"));
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
