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
  /** Handoffs with status needs_input or open asks. */
  needsInputCount: number;
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
  needsAnswers?: boolean;
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
  activity?: {
    at: string;
    type: string;
    runId?: string;
    position?: string;
    detail?: string;
    phase?: string;
    slug?: string;
  }[];
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
  sessions?: {
    agentId: string;
    dispatch_filename: string;
    position: string;
    phase: string;
    updated_at: string;
    status: string;
  }[];
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

export type InitiativeListItem = {
  slug: string;
  name: string;
  businessIdea: string;
  memory: string;
};

export type CustomerListItem = {
  slug: string;
  name: string;
  org?: string;
  orgName?: string;
  initiatives: InitiativeListItem[];
};

export type ActiveRef = {
  org: string;
  customer: string;
  initiative: string;
};

export async function fetchProject(): Promise<{
  version?: number;
  active: ActiveRef | string;
  activeProject?: string;
  activeInitiative?: string;
  org?: { slug: string; name: string };
  businessIdeaRel: string;
  memoryRel: string | null;
  projects: ProjectListItem[];
  customers?: CustomerListItem[];
}> {
  const res = await fetch("/api/project");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function setActiveProject(active: string): Promise<{
  ok: true;
  active: ActiveRef | string;
  activeProject?: string;
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

export async function setActivePortfolio(input: {
  org?: string;
  customer: string;
  initiative: string;
}): Promise<{
  ok: true;
  active: ActiveRef;
  activeProject?: string;
  businessIdeaRel: string;
  memoryRel: string;
}> {
  const res = await fetch("/api/project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "portfolio switch failed");
  return data;
}

export async function createProject(input: {
  name: string;
  slug?: string;
  activate?: boolean;
  contextNote?: string;
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

export async function createCustomer(input: {
  name: string;
  slug?: string;
  org?: string;
  activate?: boolean;
  contextNote?: string;
}): Promise<{
  ok: true;
  slug: string;
  name: string;
  initiative: string;
  active: ActiveRef;
  businessIdea: string;
  memory: string;
}> {
  const res = await fetch("/api/customer/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "create customer failed");
  return data;
}

export async function createInitiative(input: {
  name: string;
  slug?: string;
  org?: string;
  customer?: string;
  activate?: boolean;
  contextNote?: string;
}): Promise<{
  ok: true;
  slug: string;
  name: string;
  customer: string;
  active: ActiveRef;
  businessIdea: string;
  memory: string;
}> {
  const res = await fetch("/api/initiative/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "create initiative failed");
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

export type GraphifyStatusResponse = {
  ready: boolean;
  hasHtml: boolean;
  nodeCount: number;
  edgeCount: number;
  graphJson: string;
  graphHtml: string;
};

export async function fetchGraphifyStatus(): Promise<GraphifyStatusResponse> {
  const res = await fetch("/api/graphify/status");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "graphify status failed");
  return data as GraphifyStatusResponse;
}

export async function fetchOrgWorkGraph(
  focus: import("../jarvis/graph-scope").GraphFocus = { scope: "agency" },
): Promise<import("../jarvis/org-work-graph").OrgWorkGraph> {
  const q = new URLSearchParams({ scope: focus.scope });
  if (focus.customer) q.set("customer", focus.customer);
  if (focus.initiative) q.set("initiative", focus.initiative);
  if (focus.seat) q.set("seat", focus.seat);
  const res = await fetch(`/api/org-work-graph?${q}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "org work graph failed");
  return data.graph;
}

export type JarvisActResult = {
  status: "ok" | "needs_confirm" | "denied" | "error";
  token?: string;
  summary?: string;
  result?: unknown;
  reason?: string;
};

export type JarvisConfirmInput = {
  roomId: string;
  token: string;
  accept: boolean;
};

export async function postJarvisConfirm(
  input: JarvisConfirmInput,
): Promise<JarvisActResult> {
  const res = await fetch("/api/jarvis/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await res.json()) as JarvisActResult;
  if (!res.ok) {
    throw new Error(data.reason || data.summary || "jarvis confirmation failed");
  }
  return data;
}

/** Ops-mode Jarvis act. Confirmation tokens are sent only when explicitly supplied. */
export async function postJarvisAct(input: {
  intent: string;
  args?: Record<string, unknown>;
  mode?: string;
  roomId?: string;
  confirmToken?: string;
}): Promise<JarvisActResult> {
  const body = {
    intent: input.intent,
    args: input.args ?? {},
    mode: input.mode ?? "ops",
    roomId: input.roomId ?? "default",
    confirmToken: input.confirmToken,
  };
  const res = await fetch("/api/jarvis/act", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as JarvisActResult;
  if (!res.ok && data.status !== "needs_confirm") {
    throw new Error(data.reason || data.summary || "jarvis act failed");
  }
  return data;
}

export async function resolveBlocker(
  seat: string,
  confirmToken?: string,
): Promise<JarvisActResult> {
  return postJarvisAct({
    intent: "blocker.resolve",
    mode: "ops",
    args: { seat },
    confirmToken,
  });
}

/** Persist operator answers for a seat and auto-continue its work. */
export async function answerSeatQuestions(
  seat: string,
  answers: Record<string, string>,
  confirmToken?: string,
): Promise<JarvisActResult> {
  return postJarvisAct({
    intent: "seat.answer",
    mode: "ops",
    args: { seat, answers },
    confirmToken,
  });
}

export async function fetchProductionScorecard() {
  const res = await fetch("/api/production-scorecard");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "scorecard failed");
  return data.scorecard as import("../lib/venture-production-scorecard").VentureProductionScorecard;
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
    binary?: boolean;
    previewKind?: string;
    mime?: string;
    rawUrl?: string;
    entries?: { name: string; path: string; type: string }[];
  }>;
}

export function fileRawUrl(path: string): string {
  return `/api/file/raw?path=${encodeURIComponent(path)}`;
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

export type ReviewInboxItem = {
  filename: string;
  path: string;
  status: string;
  position?: string;
  phase?: string;
  goal?: string;
  created?: string;
  mtimeMs: number;
};

export async function fetchReviewInbox() {
  const res = await fetch("/api/jarvis/review-inbox");
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ items: ReviewInboxItem[] }>;
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
  instruction?: string;
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

export type SourceRecord = {
  id: string;
  title: string;
  ext: string;
  originalRel: string;
  extractRel: string | "self";
  status: "ok" | "extract_failed" | "image_stub";
  uploadedAt: string;
};

export async function fetchSources(): Promise<{
  sources: SourceRecord[];
  contextNote: string;
}> {
  const res = await fetch("/api/sources");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadSources(files: FileList | File[]): Promise<{
  ok: true;
  sources: SourceRecord[];
  warnings?: string[];
}> {
  const form = new FormData();
  const list = Array.isArray(files) ? files : Array.from(files);
  for (const file of list) form.append("files", file);

  const res = await fetch("/api/sources/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "upload failed");

  const warnings =
    data.warnings ?? (data.warning ? [data.warning as string] : undefined);

  return { ok: true, sources: data.sources, warnings };
}

export async function saveContextNote(note: string): Promise<{ ok: true; contextNote: string }> {
  const res = await fetch("/api/sources/context", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "save context failed");
  return data;
}

export async function deleteSource(id: string): Promise<{ ok: true }> {
  const res = await fetch(`/api/sources/${encodeURIComponent(id)}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "delete failed");
  return data;
}
