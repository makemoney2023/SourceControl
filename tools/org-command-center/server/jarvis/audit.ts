import { appendActivity } from "../activity";
import { dispatchRoot } from "../paths";
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

export type JarvisActivityType = "jarvis_act" | "jarvis_confirm" | "jarvis_denied";

export function mapAuditToActivityType(type: JarvisAuditEventType): JarvisActivityType | undefined {
  switch (type) {
    case "jarvis_intent":
    case "jarvis_executed":
    case "jarvis_error":
      return "jarvis_act";
    case "jarvis_confirm":
    case "jarvis_confirm_pending":
      return "jarvis_confirm";
    case "jarvis_denied":
      return "jarvis_denied";
    default:
      return undefined;
  }
}

function formatActivityDetail(event: Omit<JarvisAuditEvent, "at">): string {
  const parts: string[] = [];
  if (event.intent) parts.push(event.intent);
  if (event.detail) parts.push(event.detail);
  return parts.join(" — ") || event.type;
}

export function auditJarvis(
  event: Omit<JarvisAuditEvent, "at"> & { at?: string },
  repoRoot?: string,
) {
  events.push({
    at: event.at ?? new Date().toISOString(),
    roomId: event.roomId,
    type: event.type,
    intent: event.intent,
    detail: event.detail,
  });

  if (!repoRoot) return;

  const activityType = mapAuditToActivityType(event.type);
  if (!activityType) return;

  appendActivity(dispatchRoot(repoRoot), {
    type: activityType,
    detail: formatActivityDetail(event),
  });
}

export function getAuditEvents(): readonly JarvisAuditEvent[] {
  return events;
}

export function resetAuditForTests() {
  events.length = 0;
}
