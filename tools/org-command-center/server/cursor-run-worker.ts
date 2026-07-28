/**
 * Detached Cursor run worker — keeps @cursor/sdk child_process.spawn
 * out of the Vite/OCC process (avoids EBADF crashing the API server).
 *
 * Usage: npx tsx server/cursor-run-worker.ts <payload.json>
 */
import { readFileSync } from "node:fs";
import { finishDetachedCursorPayload } from "./spawn";

async function main() {
  const path = process.argv[2];
  if (!path) {
    console.error("usage: cursor-run-worker <payload.json>");
    process.exit(2);
  }
  const payload = JSON.parse(readFileSync(path, "utf8")) as {
    repoRoot: string;
    root: string;
    packet: unknown;
    dispatchFilename: string;
    prompt: string;
    apiKey: string;
    runId: string;
    agentId?: string;
  };
  await finishDetachedCursorPayload(payload);
}

main().catch((err) => {
  console.error("[cursor-run-worker]", err instanceof Error ? err.message : err);
  process.exit(1);
});
