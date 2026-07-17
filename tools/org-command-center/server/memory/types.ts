export type MemoryNoteKind =
  | "note"
  | "decision"
  | "preference"
  | "entity"
  | "lifecycle"
  | "session";

export type MemoryBrief = {
  done: string[];
  next: string[];
  blockers: string[];
  suggestion: string;
  sources: string[];
  memoryThin: boolean;
};

export type MemoryRecallHit = {
  text: string;
  path: string;
  kind: MemoryNoteKind | "unknown";
  score?: number;
};

export type SituationInput = {
  recentSessionLines: string[];
  decisionLines: string[];
  preferenceLines: string[];
  /** Freeform notes.md + operator MEMORY/context.md lines */
  noteLines?: string[];
  mission: {
    idea: string;
    currentPhase: string;
    currentPhaseName?: string;
    nextAction: string;
    blockerCount: number;
    openPhaseNames?: string[];
  };
  recentRunLines: string[];
};
