import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import type { ManagerPacket } from "./types";

export function ensureDispatchDirs(dispatchRoot: string) {
  mkdirSync(join(dispatchRoot, "queue"), { recursive: true });
  mkdirSync(join(dispatchRoot, "claimed"), { recursive: true });
}

export function enqueueDispatch(
  dispatchRoot: string,
  packet: ManagerPacket,
  timestamp?: string,
): string {
  ensureDispatchDirs(dispatchRoot);
  const ts =
    timestamp ??
    new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  const filename = `${packet.phase}-${packet.position}-${ts}.yaml`;
  const path = join(dispatchRoot, "queue", filename);
  writeFileSync(path, YAML.stringify(packet), "utf8");
  return path;
}

export function listQueuedDispatches(dispatchRoot: string): string[] {
  const queue = join(dispatchRoot, "queue");
  if (!existsSync(queue)) return [];
  return readdirSync(queue)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .sort();
}

export type ClaimResult =
  | { ok: true; filename: string; content: string; claimedPath: string }
  | { ok: false; error: string };

export function claimDispatch(
  dispatchRoot: string,
  opts?: { filename?: string },
): ClaimResult {
  ensureDispatchDirs(dispatchRoot);
  const files = listQueuedDispatches(dispatchRoot);
  if (!files.length) return { ok: false, error: "DISPATCH queue empty" };

  let filename = opts?.filename;
  if (filename) {
    if (!files.includes(filename)) {
      return { ok: false, error: `dispatch file not in queue: ${filename}` };
    }
  } else {
    filename = files[0];
  }

  const from = join(dispatchRoot, "queue", filename);
  const to = join(dispatchRoot, "claimed", filename);
  renameSync(from, to);
  return {
    ok: true,
    filename,
    content: readFileSync(to, "utf8"),
    claimedPath: to,
  };
}

export function claimOldestDispatch(
  dispatchRoot: string,
): { filename: string; content: string; claimedPath: string } | null {
  const result = claimDispatch(dispatchRoot, {});
  if (!result.ok) return null;
  return {
    filename: result.filename,
    content: result.content,
    claimedPath: result.claimedPath,
  };
}
