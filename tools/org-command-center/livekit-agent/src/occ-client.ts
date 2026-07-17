export type JarvisMode = "briefing" | "ops" | "review" | "architect";

export type JarvisActBody = {
  intent: string;
  args?: Record<string, unknown>;
  confirmToken?: string;
  mode: JarvisMode;
  roomId: string;
};

export type JarvisConfirmBody = {
  roomId: string;
  token: string;
  accept: boolean;
};

export function createOccClient(baseUrl: string) {
  const root = baseUrl.replace(/\/$/, "");

  async function getJson(path: string, init?: RequestInit) {
    const res = await fetch(`${root}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        (data as { error?: string }).error || `OCC ${path} HTTP ${res.status}`,
      );
    }
    return data;
  }

  return {
    getMission: () => getJson("/api/snapshot").then((s) => (s as { mission: unknown }).mission),
    getTasks: async (status?: string) => {
      const s = (await getJson("/api/snapshot")) as { tasks: Array<{ status: string }> };
      const tasks = s.tasks ?? [];
      return status ? tasks.filter((t) => t.status === status) : tasks.slice(0, 20);
    },
    getSeatReport: (slug: string) =>
      getJson(`/api/seat-report/${encodeURIComponent(slug)}`).then(
        (d) => (d as { report: unknown }).report,
      ),
    getCompanyDigest: () =>
      getJson("/api/company-digest").then((d) => (d as { digest: unknown }).digest),
    queueDispatch: (phase: string, goal: string) =>
      getJson("/api/assign", {
        method: "POST",
        body: JSON.stringify({ phase, goal }),
      }),
    runNext: () =>
      getJson("/api/spawn", {
        method: "POST",
        body: JSON.stringify({ wakeReason: "chat" }),
      }),
    jarvisAct: (body: JarvisActBody) =>
      getJson("/api/jarvis/act", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    jarvisContext: () => getJson("/api/jarvis/context"),
    memoryDigest: (summary?: string) =>
      getJson("/api/jarvis/memory/digest", {
        method: "POST",
        body: JSON.stringify(summary ? { summary } : {}),
      }),
    jarvisConfirm: (body: JarvisConfirmBody) =>
      getJson("/api/jarvis/confirm", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  };
}

export type OccClient = ReturnType<typeof createOccClient>;

export type JarvisActSpeechResult = {
  status?: string;
  reason?: string;
  summary?: string;
  result?: unknown;
};

/** Strip markdown / punctuation TTS would read aloud as "asterisk asterisk". */
export function sanitizeForSpeech(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_\s][^_]*)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\*/g, "")
    .replace(/\r?\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function speechFieldFromObject(value: Record<string, unknown>): string | null {
  for (const key of ["spokenBrief", "spoken", "help", "summary", "reason"] as const) {
    const v = value[key];
    if (typeof v === "string" && v.trim()) return v;
  }
  return null;
}

export function summarizeJarvisSpeech(value: unknown, max = 600): string {
  if (value && typeof value === "object" && "status" in value) {
    const r = value as JarvisActSpeechResult;
    if (r.status === "denied" && r.reason) return summarizeForSpeech(r.reason, max);
    if (r.status === "error" && r.reason) return summarizeForSpeech(r.reason, max);
    if (r.status === "needs_confirm" && r.summary) return summarizeForSpeech(r.summary, max);
    // Prefer server `summary` — raw `result` is often JSON/markdown that TTS mangles into loops.
    if (r.status === "ok") {
      if (typeof r.summary === "string" && r.summary.trim()) {
        return summarizeForSpeech(r.summary, max);
      }
      return summarizeForSpeech(r.result ?? value, max);
    }
  }
  return summarizeForSpeech(value, max);
}

export function summarizeForSpeech(value: unknown, max = 600): string {
  let s: string;
  if (typeof value === "string") {
    s = value;
  } else if (value && typeof value === "object" && !Array.isArray(value)) {
    s = speechFieldFromObject(value as Record<string, unknown>) ?? JSON.stringify(value);
  } else {
    s = JSON.stringify(value);
  }
  s = sanitizeForSpeech(s);
  if (s.length <= max) return s;
  return `${s.slice(0, max)}…`;
}
