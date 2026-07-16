import type { JarvisIntent, JarvisMode } from "./intents";

const CONFIRM_TTL_MS = 60_000;

type Pending = { intent: JarvisIntent; args: unknown; mode: JarvisMode; expires: number };

const pending = new Map<string, Pending>();
const roomModes = new Map<string, JarvisMode>();
const lastSummaries = new Map<string, string>();

function key(roomId: string, token: string) {
  return `${roomId}:${token}`;
}

export function getRoomMode(roomId: string): JarvisMode {
  return roomModes.get(roomId) ?? "briefing";
}

export function setRoomMode(roomId: string, mode: JarvisMode): JarvisMode {
  roomModes.set(roomId, mode);
  return mode;
}

export function createConfirmToken(
  roomId: string,
  intent: JarvisIntent,
  args: unknown,
  mode: JarvisMode,
): string {
  const token = crypto.randomUUID();
  pending.set(key(roomId, token), { intent, args, mode, expires: Date.now() + CONFIRM_TTL_MS });
  return token;
}

export function consumeConfirm(
  roomId: string,
  token: string,
): { intent: JarvisIntent; args: unknown; mode: JarvisMode } | null {
  const entry = pending.get(key(roomId, token));
  if (!entry) return null;
  pending.delete(key(roomId, token));
  if (Date.now() > entry.expires) return null;
  return { intent: entry.intent, args: entry.args, mode: entry.mode };
}

export function peekConfirm(
  roomId: string,
  token: string,
): { intent: JarvisIntent; args: unknown; mode: JarvisMode } | null {
  const entry = pending.get(key(roomId, token));
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    pending.delete(key(roomId, token));
    return null;
  }
  return { intent: entry.intent, args: entry.args, mode: entry.mode };
}

export function cancelConfirm(
  roomId: string,
  token: string,
): { intent: JarvisIntent; args: unknown; mode: JarvisMode } | null {
  const entry = pending.get(key(roomId, token));
  if (!entry) return null;
  pending.delete(key(roomId, token));
  if (Date.now() > entry.expires) return null;
  return { intent: entry.intent, args: entry.args, mode: entry.mode };
}

export function peekLatestConfirm(
  roomId: string,
): { token: string; intent: JarvisIntent; args: unknown; mode: JarvisMode } | null {
  const prefix = `${roomId}:`;
  let latest: {
    token: string;
    intent: JarvisIntent;
    args: unknown;
    mode: JarvisMode;
    expires: number;
  } | null = null;

  for (const [mapKey, entry] of pending.entries()) {
    if (!mapKey.startsWith(prefix)) continue;
    if (Date.now() > entry.expires) {
      pending.delete(mapKey);
      continue;
    }
    const token = mapKey.slice(prefix.length);
    if (!latest || entry.expires >= latest.expires) {
      latest = { token, intent: entry.intent, args: entry.args, mode: entry.mode, expires: entry.expires };
    }
  }

  return latest
    ? { token: latest.token, intent: latest.intent, args: latest.args, mode: latest.mode }
    : null;
}

export function setLastSummary(roomId: string, summary: string): void {
  lastSummaries.set(roomId, summary);
}

export function getLastSummary(roomId: string): string | undefined {
  return lastSummaries.get(roomId);
}

export function resetSessionForTests() {
  pending.clear();
  roomModes.clear();
  lastSummaries.clear();
}
