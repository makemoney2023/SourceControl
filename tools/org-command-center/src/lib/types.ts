export type PhaseStatus = "⬜" | "🔄" | "✅" | "⏭️" | string;

export interface PhaseRow {
  phase: string;
  name: string;
  status: PhaseStatus;
  artifact: string;
  notes: string;
}

export interface PositionsRow {
  phase: string;
  manager: string;
  icsSpawned: string;
  handoffDir: string;
  csuiteVerdict: string;
  reviewer: string;
  managerLlmTier: string;
}

export interface Tracker {
  idea: string;
  classification: string;
  mode: string;
  depth: string;
  currentPhase: string;
  phases: PhaseRow[];
  positions: PositionsRow[];
  raw: string;
}

export type HandoffKind = "ic" | "manager" | "csuite" | "other";

export interface HandoffArtifact {
  path: string;
  notes: string;
}

export interface HandoffRecord {
  filename: string;
  kind: HandoffKind;
  phase: string;
  position: string;
  reportsTo: string;
  status: string;
  verdictForManager: string;
  verdict: string;
  llmTier: string;
  generationProfile: string;
  fallbackApplied: string;
  artifacts: HandoffArtifact[];
  asks: string[];
  blockers: string[];
  recommendation: string;
  escalationTags: string[];
}

export interface RosterEntry {
  slug: string;
  title: string;
  reportsTo: string;
  level: "manager" | "ic" | string;
  dept: string;
}

export interface PhaseOwner {
  phase: string;
  managerOwner: string;
  maySpawn: string[];
  csuiteReviewer: string;
  secondary: string;
  scorecard: string;
}

export interface OrgRegistry {
  roster: RosterEntry[];
  phaseOwners: PhaseOwner[];
}

export interface ModelEntry {
  llmTier: string;
  llmModel: string;
  generationProfile: string;
}

export type ModelRegistry = Record<string, ModelEntry>;

export interface ManagerPacketInput {
  phase: string;
  position: string;
  goal: string;
  llm_tier?: string;
  llm_model?: string;
  generation_profile?: string;
  inputs?: string[];
  must_read?: string[];
  outputs?: string[];
  write_lease?: string[];
  budget_usd?: number | null;
  collaborators?: string[];
  delegate_budget?: number;
  constraints?: string[];
  report_to?: string;
  company_goal?: string;
  parent_goal?: string;
  goal_path?: string[];
  /** Used only for default fill — not required on disk */
  idea?: string;
  phase_name?: string;
}

export interface ManagerPacket {
  schema_version: 1;
  queued_at: string;
  phase: string;
  position: string;
  goal: string;
  report_to: string;
  parent_position: "orchestrator";
  llm_tier: string;
  llm_model: string;
  generation_profile: string;
  inputs: string[];
  must_read: string[];
  outputs: string[];
  write_lease: string[];
  budget_usd: number | null;
  collaborators: string[];
  delegate_budget: number;
  constraints: string[];
  company_goal: string;
  parent_goal: string;
  goal_path: string[];
}

export type ValidateResult =
  | { ok: true; packet: ManagerPacket }
  | { ok: false; errors: string[] };
