import type { JarvisIntent } from "./intents";

const CONFIRM_TTL_MS = 60_000;

type Pending = { intent: JarvisIntent; args: unknown; expires: number };

const pending = new Map<string, Pending>();

function key(roomId: string, token: string) {
  return `${roomId}:${token}`;
}

export function createConfirmToken(roomId: string, intent: JarvisIntent, args: unknown): string {
  const token = crypto.randomUUID();
  pending.set(key(roomId, token), { intent, args, expires: Date.now() + CONFIRM_TTL_MS });
  return token;
}

export function consumeConfirm(
  roomId: string,
  token: string,
): { intent: JarvisIntent; args: unknown } | null {
  const entry = pending.get(key(roomId, token));
  if (!entry) return null;
  pending.delete(key(roomId, token));
  if (Date.now() > entry.expires) return null;
  return { intent: entry.intent, args: entry.args };
}

export function peekConfirm(
  roomId: string,
  token: string,
): { intent: JarvisIntent; args: unknown } | null {
  const entry = pending.get(key(roomId, token));
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    pending.delete(key(roomId, token));
    return null;
  }
  return { intent: entry.intent, args: entry.args };
}

export function cancelConfirm(
  roomId: string,
  token: string,
): { intent: JarvisIntent; args: unknown } | null {
  const entry = pending.get(key(roomId, token));
  if (!entry) return null;
  pending.delete(key(roomId, token));
  if (Date.now() > entry.expires) return null;
  return { intent: entry.intent, args: entry.args };
}

export function resetSessionForTests() {
  pending.clear();
}
