import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  ackAlert,
  diffHandoffAlerts,
  type HandoffAlert,
} from "../src/jarvis/alerts";
import type { HandoffRecord } from "../src/lib/types";

export function alertsPath(dispatchRoot: string) {
  return join(dispatchRoot, "alerts.json");
}

export function loadAlerts(dispatchRoot: string): HandoffAlert[] {
  const path = alertsPath(dispatchRoot);
  if (!existsSync(path)) return [];
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as { alerts?: HandoffAlert[] };
    return raw.alerts ?? [];
  } catch {
    return [];
  }
}

export function saveAlerts(dispatchRoot: string, alerts: HandoffAlert[]) {
  const path = alertsPath(dispatchRoot);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify({ alerts }, null, 2), "utf8");
}

export function syncHandoffAlerts(
  dispatchRoot: string,
  handoffs: HandoffRecord[],
  nowIso = new Date().toISOString(),
): HandoffAlert[] {
  const prev = loadAlerts(dispatchRoot);
  const next = diffHandoffAlerts(prev, handoffs, nowIso);
  if (JSON.stringify(prev) !== JSON.stringify(next)) {
    saveAlerts(dispatchRoot, next);
  }
  return next;
}

export function ackHandoffAlert(dispatchRoot: string, id: string): HandoffAlert[] {
  const next = ackAlert(loadAlerts(dispatchRoot), id);
  saveAlerts(dispatchRoot, next);
  return next;
}
