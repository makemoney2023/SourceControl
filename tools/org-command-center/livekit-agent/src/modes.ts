import type { JarvisMode } from "./occ-client.js";
import { summarizeForSpeech } from "./occ-client.js";

export type ModeState = {
  getMode: () => JarvisMode;
  setMode: (mode: JarvisMode) => void;
};

export function createModeState(initial: JarvisMode = "briefing"): ModeState {
  let mode = initial;
  return {
    getMode: () => mode,
    setMode: (next) => {
      mode = next;
    },
  };
}

export function applyModeFromActResult(state: ModeState, actResponse: unknown): boolean {
  if (typeof actResponse !== "object" || actResponse === null) return false;
  const envelope = actResponse as { status?: string; result?: unknown };
  if (envelope.status !== "ok") return false;
  if (typeof envelope.result !== "object" || envelope.result === null) return false;
  const mode = (envelope.result as { mode?: JarvisMode }).mode;
  if (mode !== "briefing" && mode !== "ops" && mode !== "review") return false;
  state.setMode(mode);
  return true;
}

export function modeAck(mode: JarvisMode): string {
  switch (mode) {
    case "briefing":
      return "Briefing mode. Read-only company overview.";
    case "ops":
      return "Ops mode. Control actions available with confirmation.";
    case "review":
      return "Review mode. Spawn actions disabled.";
  }
}

export function summarizeSetMode(actResponse: unknown, requested: JarvisMode): string {
  if (typeof actResponse === "object" && actResponse !== null) {
    const envelope = actResponse as { status?: string; reason?: string };
    if (envelope.status === "ok") {
      return modeAck(requested);
    }
    if (envelope.reason) {
      return summarizeForSpeech(actResponse);
    }
  }
  return summarizeForSpeech(actResponse);
}
