import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export interface SessionRecord {
  agentId: string;
  position: string;
  phase: string;
  dispatch_filename: string;
  updated_at: string;
  status: string;
}

export function sessionsDir(dispatchRoot: string) {
  return join(dispatchRoot, "sessions");
}

export function sessionPath(dispatchRoot: string, dispatchFilename: string) {
  const safe = dispatchFilename.replace(/[^\w.-]+/g, "_");
  return join(sessionsDir(dispatchRoot), `${safe}.json`);
}

export function writeSession(dispatchRoot: string, session: SessionRecord) {
  mkdirSync(sessionsDir(dispatchRoot), { recursive: true });
  writeFileSync(
    sessionPath(dispatchRoot, session.dispatch_filename),
    JSON.stringify(session, null, 2),
    "utf8",
  );
}

export function readSession(
  dispatchRoot: string,
  dispatchFilename: string,
): SessionRecord | null {
  const path = sessionPath(dispatchRoot, dispatchFilename);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as SessionRecord;
  } catch {
    return null;
  }
}

export function findSessionByAgentId(
  dispatchRoot: string,
  agentId: string,
): SessionRecord | null {
  const dir = sessionsDir(dispatchRoot);
  if (!existsSync(dir)) return null;
  for (const name of readdirSync(dir).filter((n) => n.endsWith(".json"))) {
    try {
      const s = JSON.parse(readFileSync(join(dir, name), "utf8")) as SessionRecord;
      if (s.agentId === agentId) return s;
    } catch {
      /* skip */
    }
  }
  return null;
}

export function listSessions(dispatchRoot: string): SessionRecord[] {
  const dir = sessionsDir(dispatchRoot);
  if (!existsSync(dir)) return [];
  const out: SessionRecord[] = [];
  for (const name of readdirSync(dir).filter((n) => n.endsWith(".json"))) {
    try {
      out.push(JSON.parse(readFileSync(join(dir, name), "utf8")) as SessionRecord);
    } catch {
      /* skip */
    }
  }
  return out;
}
