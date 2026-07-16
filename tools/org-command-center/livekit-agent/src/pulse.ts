export type PulseSnapshot = {
  blockerCount: number;
  currentPhase: string;
};

export type JarvisContextForPulse = {
  spokenBrief?: string;
  mission?: {
    blockerCount?: number;
    currentPhase?: string;
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
