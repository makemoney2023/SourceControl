export type SeatVisualStatus =
  | "idle"
  | "active"
  | "running"
  | "done"
  | "blocked"
  | "needs_input"
  | "csuite"
  | "escalate"
  | "error"
  | "paused";

const COMPLETED_TASK_STATUSES = new Set(["done", "completed", "cancelled"]);

const STATUS_CUE: Partial<Record<SeatVisualStatus, string>> = {
  active: "ACTIVE",
  running: "RUNNING",
  blocked: "BLOCKED",
  needs_input: "ANSWER",
  escalate: "ESCALATE",
};

export function isTaskStatusCompleted(status: string): boolean {
  return COMPLETED_TASK_STATUSES.has(status.trim().toLowerCase());
}

export function isSeatDimmed({
  mode,
  isOwner,
  isGhost,
  isCeo,
  isSelected,
}: {
  mode: "floor" | "assign" | "outputs";
  isOwner: boolean;
  isGhost: boolean;
  isCeo: boolean;
  isSelected: boolean;
}): boolean {
  return mode === "assign" && !isOwner && !isGhost && !isCeo && !isSelected;
}

export function deriveSeatVisualBehavior(
  status: SeatVisualStatus,
  reducedMotion: boolean,
): {
  orbitSpeed: number;
  pulses: boolean;
  cue: string | null;
} {
  let orbitSpeed = 0;
  if (!reducedMotion) {
    if (status === "running") orbitSpeed = 3;
    else if (status === "active") orbitSpeed = 1.4;
    else if (
      status === "blocked" ||
      status === "needs_input" ||
      status === "escalate"
    ) {
      orbitSpeed = 0.8;
    }
  }

  return {
    orbitSpeed,
    pulses: !reducedMotion && status === "running",
    cue: STATUS_CUE[status] ?? null,
  };
}

export function seatStatus(
  slug: string,
  handoffs: {
    position: string;
    filename: string;
    kind: string;
    status: string;
    verdictForManager: string;
    verdict: string;
    asks?: string[];
  }[],
): { status: SeatVisualStatus; handoff?: (typeof handoffs)[number] } {
  const matches = handoffs.filter((x) => x.position === slug);
  const h =
    matches.at(-1) ??
    handoffs.filter((x) => x.filename.includes(slug)).at(-1);
  if (!h) return { status: "idle" };
  if (h.kind === "csuite") return { status: "csuite", handoff: h };
  if (h.status === "blocked") {
    return { status: "blocked", handoff: h };
  }
  if (h.status === "needs_input" || (h.asks?.length ?? 0) > 0) {
    return { status: "needs_input", handoff: h };
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
  needs_input: "#f0c14a",
  csuite: "#7aa0ff",
  escalate: "#e0a04a",
  error: "#ff6b6b",
  paused: "#8a8090",
};
