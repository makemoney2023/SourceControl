export type PulseSnapshot = {
  blockerCount: number;
  currentPhase: string;
};

export type JarvisContextForPulse = {
  spokenBrief?: string;
  needsAnswersSeats?: string[];
  mission?: {
    blockerCount?: number;
    currentPhase?: string;
    needsInputCount?: number;
  };
};

export function parsePulseSnapshot(context: JarvisContextForPulse): PulseSnapshot | null {
  const mission = context.mission;
  if (!mission) return null;
  if (mission.blockerCount === undefined || mission.currentPhase === undefined) return null;
  return {
    blockerCount: mission.blockerCount,
    currentPhase: String(mission.currentPhase),
  };
}

/** Speak on pulse only when blocker count or phase changed since last spoken snapshot. */
export function shouldPulseSpeak(prev: PulseSnapshot | null, next: PulseSnapshot): boolean {
  if (!prev) return false;
  return prev.blockerCount !== next.blockerCount || prev.currentPhase !== next.currentPhase;
}

export function readJarvisPulseMs(): number {
  const raw = process.env.JARVIS_PULSE_MS ?? "0";
  const ms = Number.parseInt(raw, 10);
  if (!Number.isFinite(ms) || ms < 0) return 0;
  return ms;
}

/**
 * Soft-copilot wake/pulse opener: keep next + suggestion (up to 2 sentences),
 * not only the first sentence of a multi-sentence memory brief.
 */
export function pickWakeGreeting(brief: string, maxLen = 160): string {
  const trimmed = brief.trim();
  if (!trimmed) return trimmed;
  const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean);
  let out = sentences.slice(0, 2).join(" ");
  if (out.length > maxLen) {
    out = `${out.slice(0, Math.max(0, maxLen - 1)).trimEnd()}…`;
  }
  return out;
}
