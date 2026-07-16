export type JarvisMode = "briefing" | "ops" | "review";

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

export function summarizeJarvisSpeech(value: unknown, max = 600): string {
  if (value && typeof value === "object" && "status" in value) {
    const r = value as JarvisActSpeechResult;
    if (r.status === "denied" && r.reason) return r.reason;
    if (r.status === "error" && r.reason) return r.reason;
    if (r.status === "needs_confirm" && r.summary) return r.summary;
    if (r.status === "ok") return summarizeForSpeech(r.result ?? value, max);
  }
  return summarizeForSpeech(value, max);
}

export function summarizeForSpeech(value: unknown, max = 600): string {
  const s = typeof value === "string" ? value : JSON.stringify(value);
  if (s.length <= max) return s;
  return `${s.slice(0, max)}…`;
}
