export interface MissionState {
  idea: string;
  currentPhase: string;
  currentPhaseName: string;
  currentStatus: string;
  progressPct: number;
  done: number;
  active: number;
  pending: number;
  skipped: number;
  nextAction: string;
  ownerSlug: string;
  queueDepth: number;
  blockerCount: number;
  openQuestions: string[];
  latestDecision: string;
  hardGate: boolean;
  parallelTracks: string[];
  spendUsd?: number;
}

export interface OrgTask {
  id: string;
  title: string;
  status: string;
  phase?: string;
  slug?: string;
  tags: string[];
  source: string;
  dispatchFilename?: string;
  runId?: string;
  canPlay?: boolean;
  canCancel?: boolean;
  canRewake?: boolean;
}

export interface RunRecord {
  runId: string;
  status: string;
  position: string;
  phase: string;
  claimed: string;
  dispatch_filename: string;
  wake_reason: string;
  started_at: string;
  finished_at?: string;
  llm_model: string;
  result?: unknown;
  error?: string;
  agentId?: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  cost_usd?: number;
  duration_ms?: number;
}

export interface CSuiteCard {
  slug: string;
  title: string;
  dept: string;
  pulse: string;
  ownedActivePhases: string[];
  briefingSnippet: string;
  llmTier: string;
  hasBriefing: boolean;
}

export interface SituationSnapshot {
  activeProject: string;
  businessIdeaRel: string;
  mission: MissionState;
  tasks: OrgTask[];
  csuite: CSuiteCard[];
  tracker: {
    idea: string;
    currentPhase: string;
    phases: { phase: string; name: string; status: string; artifact: string }[];
  };
  org: {
    roster: {
      slug: string;
      title: string;
      reportsTo: string;
      level: string;
      dept: string;
    }[];
    phaseOwners: {
      phase: string;
      managerOwner: string;
      maySpawn: string[];
      csuiteReviewer: string;
      secondary: string;
      scorecard: string;
    }[];
  };
  models: Record<string, { llmTier: string; llmModel: string; generationProfile: string }>;
  handoffs: {
    filename: string;
    kind: string;
    phase: string;
    position: string;
    status: string;
    verdictForManager: string;
    verdict: string;
    llmTier: string;
    artifacts: { path: string; notes: string }[];
    asks?: string[];
    blockers?: string[];
    recommendation?: string;
    escalationTags?: string[];
  }[];
  queue: string[];
  claimed: string[];
  runs?: RunRecord[];
  agentStates?: Record<string, { paused: boolean; updated_at?: string; budget_usd?: number | null }>;
  activity?: { at: string; type: string; runId?: string; position?: string; detail?: string }[];
  spend?: {
    bySeat: Record<string, { tokens: number; cost_usd: number; updated_at: string }>;
    byDay: Record<string, { tokens: number; cost_usd: number }>;
  };
  routines?: {
    id: string;
    enabled: boolean;
    cron: string;
    action: string;
    last_run_at: string | null;
    nextRunAt: string | null;
  }[];
  sessions?: { agentId: string; dispatch_filename: string; position: string }[];
  alerts?: {
    id: string;
    filename: string;
    slug: string;
    phase: string;
    kind: string;
    createdAt: string;
    acked: boolean;
  }[];
  bump: number;
}

export async function fetchSnapshot(): Promise<SituationSnapshot> {
  const res = await fetch("/api/snapshot");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export type ProjectListItem = {
  slug: string;
  name: string;
  businessIdea: string;
  memory: string;
};

export async function fetchProject(): Promise<{
  active: string;
  businessIdeaRel: string;
  memoryRel: string | null;
  projects: ProjectListItem[];
}> {
  const res = await fetch("/api/project");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function setActiveProject(active: string): Promise<{
  ok: true;
  active: string;
  businessIdeaRel: string;
  memoryRel: string;
}> {
  const res = await fetch("/api/project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ active }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "project switch failed");
  return data;
}

export async function createProject(input: {
  name: string;
  slug?: string;
  activate?: boolean;
}): Promise<{
  ok: true;
  slug: string;
  name: string;
  active: string;
  businessIdeaRel: string;
  memoryRel: string;
}> {
  const res = await fetch("/api/project/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "create venture failed");
  return data;
}

/** @deprecated use SituationSnapshot — kept for legacy jarvis screens */
export type Snapshot = SituationSnapshot;

export async function assignWork(input: Record<string, unknown> | object) {
  const res = await fetch("/api/assign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data.errors ?? [data.error]).join("; "));
  return data as { ok: true; path: string; orchestratorPrompt: string; packet: unknown };
}

export async function postBriefing(input: Record<string, unknown>) {
  const res = await fetch("/api/briefing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "briefing failed");
  return data as { ok: true; path: string };
}

export async function fetchSeatReport(slug: string) {
  const res = await fetch(`/api/seat-report/${encodeURIComponent(slug)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "seat-report failed");
  return data.report as import("../jarvis/seat-report").SeatReport;
}

export async function fetchCompanyDigest() {
  const res = await fetch("/api/company-digest");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "digest failed");
  return data.digest as import("../jarvis/company-digest").CompanyDigest;
}

export async function ackAlert(id: string) {
  const res = await fetch(`/api/alerts/${encodeURIComponent(id)}/ack`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "ack failed");
  return data;
}

export async function postCsuiteDraft(phase: string, force = false) {
  const res = await fetch("/api/csuite-draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phase, force }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "csuite draft failed");
  return data as { ok: true; path: string };
}

export async function fetchFile(path: string) {
  const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{
    type: "file" | "dir";
    path: string;
    content?: string;
    entries?: { name: string; path: string; type: string }[];
  }>;
}

export async function voiceHealth() {
  const res = await fetch("/api/voice/health");
  return res.json() as Promise<{ ok: boolean; detail: string }>;
}

export async function speakText(text: string): Promise<boolean> {
  const res = await fetch("/api/voice/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(u);
      return false;
    }
    throw new Error(await res.text());
  }
  const buf = await res.arrayBuffer();
  const blob = new Blob([buf], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  await audio.play();
  return true;
}

export async function fetchLivekitHealth() {
  const res = await fetch("/api/livekit/health");
  return res.json() as Promise<{ ok: boolean; detail: string; backend?: string }>;
}

export async function fetchLivekitToken(opts?: { roomName?: string; identity?: string }) {
  const res = await fetch("/api/livekit/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts ?? {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "livekit token failed");
  return data as {
    ok: true;
    serverUrl: string;
    participantToken: string;
    roomName: string;
    agentName: string;
  };
}

export async function fetchBriefScript(
  mode: "mission" | "seat" | "digest" = "mission",
  slug?: string,
) {
  const res = await fetch("/api/voice/brief", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, slug }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "brief failed");
  return data.text as string;
}

export async function voiceChat(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
) {
  const res = await fetch("/api/voice/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{
    text: string;
    toolResults: { name: string; result: unknown }[];
    uiEvents: Record<string, unknown>[];
  }>;
}

export async function spawnManager(opts?: {
  filename?: string;
  wakeReason?:
    | "assignment"
    | "on_demand"
    | "auto_queue"
    | "chat"
    | "run_next"
    | "rewake"
    | "timer";
}) {
  const res = await fetch("/api/spawn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts ?? {}),
  });
  return res.json() as Promise<{ ok: boolean; error?: string; runId?: string }>;
}

export async function rewakeSession(opts: {
  dispatchFilename?: string;
  agentId?: string;
}) {
  const res = await fetch("/api/runs/rewake", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });
  return res.json() as Promise<{ ok: boolean; error?: string; runId?: string }>;
}

export async function setRoutineEnabled(id: string, enabled: boolean) {
  const res = await fetch(`/api/routines/${encodeURIComponent(id)}/enable`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled }),
  });
  return res.json() as Promise<{ ok: boolean; error?: string }>;
}

export async function cancelRun(runId: string) {
  const res = await fetch(`/api/runs/${encodeURIComponent(runId)}/cancel`, {
    method: "POST",
  });
  return res.json() as Promise<{ ok: boolean; error?: string; runId?: string }>;
}

export async function pauseSeat(slug: string) {
  const res = await fetch(`/api/agents/${encodeURIComponent(slug)}/pause`, {
    method: "POST",
  });
  return res.json() as Promise<{ ok: boolean; error?: string }>;
}

export async function resumeSeat(slug: string) {
  const res = await fetch(`/api/agents/${encodeURIComponent(slug)}/resume`, {
    method: "POST",
  });
  return res.json() as Promise<{ ok: boolean; error?: string }>;
}

export async function fetchRuns() {
  const res = await fetch("/api/runs");
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ runs: RunRecord[] }>;
}

export async function fetchRun(runId: string) {
  const res = await fetch(`/api/runs/${encodeURIComponent(runId)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ run: RunRecord }>;
}

export function subscribeEvents(onChange: () => void) {
  const es = new EventSource("/api/events");
  es.addEventListener("change", () => onChange());
  es.onerror = () => {
    /* browser will retry; polling fallback in shell */
  };
  return () => es.close();
}
