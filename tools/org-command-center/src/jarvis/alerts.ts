import type { HandoffRecord } from "../lib/types";

export interface HandoffAlert {
  id: string;
  filename: string;
  slug: string;
  phase: string;
  kind: "new_handoff" | "blocked" | "escalate";
  createdAt: string;
  acked: boolean;
}

export function diffHandoffAlerts(
  prev: HandoffAlert[],
  handoffs: HandoffRecord[],
  nowIso: string,
): HandoffAlert[] {
  const byId = new Map(prev.map((a) => [a.id, a]));
  const next: HandoffAlert[] = [...prev];

  const ensure = (id: string, base: Omit<HandoffAlert, "id" | "acked" | "createdAt">) => {
    const existing = byId.get(id);
    if (existing) return;
    const alert: HandoffAlert = {
      id,
      ...base,
      createdAt: nowIso,
      acked: false,
    };
    byId.set(id, alert);
    next.push(alert);
  };

  const knownFiles = new Set(prev.filter((a) => a.kind === "new_handoff").map((a) => a.filename));
  // On first run with empty prev, seed new_handoff as acked so we don't spam historical files
  const coldStart = prev.length === 0;

  for (const h of handoffs) {
    if (h.kind === "other") continue;
    const newId = `new:${h.filename}`;
    if (coldStart) {
      if (!byId.has(newId)) {
        const alert: HandoffAlert = {
          id: newId,
          filename: h.filename,
          slug: h.position,
          phase: h.phase,
          kind: "new_handoff",
          createdAt: nowIso,
          acked: true,
        };
        byId.set(newId, alert);
        next.push(alert);
      }
    } else if (!knownFiles.has(h.filename) && !byId.has(newId)) {
      ensure(newId, {
        filename: h.filename,
        slug: h.position,
        phase: h.phase,
        kind: "new_handoff",
      });
    }

    if (h.status === "blocked" || h.status === "needs_input") {
      ensure(`blocked:${h.filename}:${h.status}`, {
        filename: h.filename,
        slug: h.position,
        phase: h.phase,
        kind: "blocked",
      });
    }
    if (h.recommendation === "escalate" || h.verdictForManager === "escalate") {
      ensure(`escalate:${h.filename}`, {
        filename: h.filename,
        slug: h.position,
        phase: h.phase,
        kind: "escalate",
      });
    }
  }

  return next;
}

export function ackAlert(alerts: HandoffAlert[], id: string): HandoffAlert[] {
  return alerts.map((a) => (a.id === id ? { ...a, acked: true } : a));
}
