import type { JarvisIntent, JarvisMode } from "./intents";

const CONFIRM_TTL_MS = 60_000;

type Pending = { intent: JarvisIntent; args: unknown; mode: JarvisMode; expires: number };

const pending = new Map<string, Pending>();
const roomModes = new Map<string, JarvisMode>();

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

export function resetSessionForTests() {
  pending.clear();
  roomModes.clear();
}
