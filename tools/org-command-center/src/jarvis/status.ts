export type SeatVisualStatus =
  | "idle"
  | "active"
  | "running"
  | "done"
  | "blocked"
  | "csuite"
  | "escalate"
  | "error"
  | "paused";

export function seatStatus(
  slug: string,
  handoffs: {
    position: string;
    filename: string;
    kind: string;
    status: string;
    verdictForManager: string;
    verdict: string;
  }[],
): { status: SeatVisualStatus; handoff?: (typeof handoffs)[number] } {
  const h =
    handoffs.find((x) => x.position === slug) ??
    handoffs.find((x) => x.filename.includes(slug));
  if (!h) return { status: "idle" };
  if (h.kind === "csuite") return { status: "csuite", handoff: h };
  if (h.status === "blocked" || h.status === "needs_input") {
    return { status: "blocked", handoff: h };
  }
  if (h.verdictForManager === "escalate") return { status: "escalate", handoff: h };
  if (h.status === "done") return { status: "done", handoff: h };
  if (h.status) return { status: "running", handoff: h };
  return { status: "idle", handoff: h };
}

export const STATUS_COLOR: Record<SeatVisualStatus, string> = {
  idle: "#2a3a40",
  active: "#3a4a50",
  running: "#3fd4be",
  done: "#4ecf8a",
  blocked: "#e06060",
  csuite: "#7aa0ff",
  escalate: "#e0a04a",
  error: "#ff6b6b",
  paused: "#8a8090",
};
