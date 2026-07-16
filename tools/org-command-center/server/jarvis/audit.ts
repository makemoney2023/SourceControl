import type { JarvisIntent } from "./intents";

export type JarvisAuditEventType =
  | "jarvis_intent"
  | "jarvis_confirm_pending"
  | "jarvis_confirm"
  | "jarvis_denied"
  | "jarvis_executed"
  | "jarvis_error";

export type JarvisAuditEvent = {
  at: string;
  roomId: string;
  type: JarvisAuditEventType;
  intent?: JarvisIntent;
  detail?: string;
};

const events: JarvisAuditEvent[] = [];

export function auditJarvis(event: Omit<JarvisAuditEvent, "at"> & { at?: string }) {
  events.push({
    at: event.at ?? new Date().toISOString(),
    roomId: event.roomId,
    type: event.type,
    intent: event.intent,
    detail: event.detail,
  });
}

export function getAuditEvents(): readonly JarvisAuditEvent[] {
  return events;
}

export function resetAuditForTests() {
  events.length = 0;
}
