import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ackAlert,
  cancelRun,
  fetchBriefScript,
  fetchCompanyDigest,
  fetchSeatReport,
  fetchSnapshot,
  pauseSeat,
  postBriefing,
  postCsuiteDraft,
  resumeSeat,
  rewakeSession,
  setRoutineEnabled,
  createProject,
  setActiveProject,
  spawnManager,
  speakText,
  subscribeEvents,
  voiceChat,
  voiceHealth,
  type CSuiteCard,
  type ProjectListItem,
  type RunRecord,
  type SituationSnapshot,
} from "../api/client";
import { formatActivityLine } from "./activity-ui";
import { handoffFilePath } from "../lib/project-paths";
import type { CompanyDigest } from "./company-digest";
import { OutputsDashboard } from "./hud/OutputsDashboard";
import { QuickAssign } from "./hud/QuickAssign";
import "./hud/theme.css";
import { OrgTheater } from "./scene/OrgTheater";
import type { SeatNextAction, SeatReport } from "./seat-report";
import { requestTalkConnect, VoiceFab } from "./VoiceFab";
import { JarvisFocusListener } from "./JarvisFocusListener";
import type { JarvisFocus } from "./jarvis-focus";

type Drawer =
  | null
  | "assign"
  | "outputs"
  | "report"
  | "chat"
  | "run"
  | "routines"
  | "digest"
  | "alerts";

export function SituationRoom() {
  const [snap, setSnap] = useState<SituationSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [showMap, setShowMap] = useState(false);
  const [voiceOk, setVoiceOk] = useState<boolean | null>(null);
  const [autoSpawn, setAutoSpawn] = useState(
    () => localStorage.getItem("sr-auto-spawn") === "1",
  );
  const [chatLog, setChatLog] = useState<{ role: "user" | "assistant"; content: string }[]>(
    [],
  );
  const [chatInput, setChatInput] = useState("");
  const [listening, setListening] = useState(false);
  const [seatReport, setSeatReport] = useState<SeatReport | null>(null);
  const [digest, setDigest] = useState<CompanyDigest | null>(null);
  const [artifact, setArtifact] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [switchingProject, setSwitchingProject] = useState(false);
  const [showNewVenture, setShowNewVenture] = useState(false);
  const [newVentureName, setNewVentureName] = useState("");
  const [newVentureSlug, setNewVentureSlug] = useState("");
  const [creatingVenture, setCreatingVenture] = useState(false);
  const [jarvisFocus, setJarvisFocus] = useState<JarvisFocus | null>(null);
  const seatCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const onJarvisFocus = useCallback((focus: JarvisFocus | null) => {
    setJarvisFocus(focus);
    if (focus?.slug) {
      setSelectedSlug(focus.slug);
      requestAnimationFrame(() => {
        seatCardRefs.current[focus.slug!]?.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      });
    }
  }, []);

  const reload = useCallback(async () => {
    try {
      const [s, proj] = await Promise.all([
        fetchSnapshot(),
        fetch("/api/project").then(async (r) => {
          if (!r.ok) return null;
          return r.json() as Promise<{ projects: ProjectListItem[] }>;
        }),
      ]);
      setSnap(s);
      if (proj?.projects) setProjects(proj.projects);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  async function onSwitchProject(slug: string) {
    if (!slug || slug === snap?.activeProject || switchingProject) return;
    setSwitchingProject(true);
    setActionError(null);
    try {
      await setActiveProject(slug);
      await reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : String(e));
    } finally {
      setSwitchingProject(false);
    }
  }

  function slugPreviewFromName(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
  }

  async function onCreateVenture() {
    const name = newVentureName.trim();
    if (!name || creatingVenture) return;
    setCreatingVenture(true);
    setActionError(null);
    try {
      const slug = newVentureSlug.trim() || undefined;
      await createProject({ name, slug, activate: true });
      setShowNewVenture(false);
      setNewVentureName("");
      setNewVentureSlug("");
      await reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : String(e));
    } finally {
      setCreatingVenture(false);
    }
  }

  useEffect(() => {
    void reload();
    const unsub = subscribeEvents(() => void reload());
    const poll = setInterval(() => void reload(), 2000);
    void voiceHealth().then((h) => setVoiceOk(h.ok));
    return () => {
      unsub();
      clearInterval(poll);
    };
  }, [reload]);

  useEffect(() => {
    localStorage.setItem("sr-auto-spawn", autoSpawn ? "1" : "0");
  }, [autoSpawn]);

  const selected = useMemo(() => {
    if (!snap || !selectedSlug) return null;
    const card = snap.csuite.find((c) => c.slug === selectedSlug);
    const seat = snap.org.roster.find((r) => r.slug === selectedSlug);
    const reports = snap.org.roster.filter((r) => r.reportsTo === selectedSlug);
    const handoffs = snap.handoffs.filter((h) => h.position === selectedSlug);
    return { card, seat, reports, handoffs };
  }, [snap, selectedSlug]);

  const legacySnap = useMemo(() => {
    if (!snap) return null;
    return {
      tracker: {
        ...snap.tracker,
        phases: snap.tracker.phases.map((p) => ({ ...p, notes: "" })),
      },
      org: snap.org,
      handoffs: snap.handoffs,
      queue: snap.queue,
      models: snap.models,
      businessIdeaRel: snap.businessIdeaRel,
    };
  }, [snap]);

  async function onBriefMe(mode: "mission" | "seat" | "digest" = "mission") {
    const text = await fetchBriefScript(
      mode,
      mode === "seat" ? selectedSlug || "ceo-strategist" : undefined,
    );
    await speakText(text);
  }

  async function openReport(slug: string) {
    setSelectedSlug(slug);
    setDrawer("report");
    setSeatReport(null);
    try {
      setSeatReport(await fetchSeatReport(slug));
    } catch (e) {
      setActionError(e instanceof Error ? e.message : String(e));
    }
  }

  async function openDigest() {
    setDrawer("digest");
    setDigest(null);
    try {
      setDigest(await fetchCompanyDigest());
    } catch (e) {
      setActionError(e instanceof Error ? e.message : String(e));
    }
  }

  async function runCta(a: SeatNextAction) {
    switch (a.cta) {
      case "run_next":
        await onSpawn({ wakeReason: "run_next" });
        break;
      case "assign":
        setDrawer("assign");
        break;
      case "open_runs":
        if (a.runId) setSelectedRunId(a.runId);
        setDrawer("run");
        break;
      case "rewake":
        break;
      case "draft_csuite":
        if (a.phase) {
          try {
            await postCsuiteDraft(a.phase, false);
            void reload();
            setActionError(null);
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            if (/already exists/i.test(msg) && confirm("Overwrite existing draft?")) {
              await postCsuiteDraft(a.phase, true);
              void reload();
            } else setActionError(msg);
          }
        }
        break;
      case "open_handoff":
        if (a.handoffFilename && snap) {
          setArtifact(handoffFilePath(snap.businessIdeaRel, a.handoffFilename));
          setDrawer("outputs");
        }
        break;
      case "open_report":
        if (a.relatedSlug) void openReport(a.relatedSlug);
        break;
      default:
        break;
    }
  }

  async function onSpawn(opts?: {
    filename?: string;
    wakeReason?: "on_demand" | "auto_queue" | "run_next" | "chat";
  }) {
    const wakeReason = opts?.wakeReason ?? "run_next";
    if (
      !autoSpawn &&
      wakeReason !== "auto_queue" &&
      !confirm(
        opts?.filename
          ? `Play dispatch ${opts.filename} via Cursor SDK?`
          : "Run next: claim oldest DISPATCH packet and spawn manager via Cursor SDK?",
      )
    ) {
      return;
    }
    setActionError(null);
    const result = await spawnManager({
      filename: opts?.filename,
      wakeReason,
    });
    if (!result.ok) {
      setActionError(result.error || "Spawn failed");
    } else {
      setSelectedRunId(result.runId ?? null);
      setDrawer("run");
    }
    void reload();
  }

  async function onCancel(runId: string) {
    setActionError(null);
    const result = await cancelRun(runId);
    if (!result.ok) setActionError(result.error || "Cancel failed");
    void reload();
  }

  async function onRewake(dispatchFilename: string) {
    setActionError(null);
    const result = await rewakeSession({ dispatchFilename });
    if (!result.ok) setActionError(result.error || "Rewake failed");
    else {
      setSelectedRunId(result.runId ?? null);
      setDrawer("run");
    }
    void reload();
  }

  async function onTogglePause(slug: string, currentlyPaused: boolean) {
    setActionError(null);
    const result = currentlyPaused ? await resumeSeat(slug) : await pauseSeat(slug);
    if (!result.ok) setActionError(result.error || "Pause/resume failed");
    void reload();
  }

  async function sendChat(message: string) {
    const history = chatLog.slice(-8);
    setChatLog((l) => [...l, { role: "user", content: message }]);
    const res = await voiceChat(message, history);
    setChatLog((l) => [...l, { role: "assistant", content: res.text || "(tool actions)" }]);
    for (const ev of res.uiEvents) {
      if (ev.slug) setSelectedSlug(String(ev.slug));
      if (ev.mode === "assign") setDrawer("assign");
      if (ev.mode === "outputs") setDrawer("outputs");
    }
    for (const tr of res.toolResults) {
      if (tr.name === "queue_dispatch" && autoSpawn) {
        void onSpawn({ wakeReason: "auto_queue" });
      }
    }
    if (res.text) await speakText(res.text);
    void reload();
  }

  function startListen() {
    const SR = (
      window as unknown as {
        webkitSpeechRecognition?: new () => SpeechRecognition;
        SpeechRecognition?: new () => SpeechRecognition;
      }
    ).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition })
        .webkitSpeechRecognition;
    if (!SR) {
      alert("Web Speech API not available in this browser");
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.onresult = (ev: SpeechRecognitionEvent) => {
      const text = ev.results[0]?.[0]?.transcript ?? "";
      if (text) void sendChat(text);
    };
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }

  if (!snap) {
    return (
      <div data-theme="jarvis" className="j-shell">
        <p className="j-muted">Loading Situation Room…</p>
        {error && <p className="j-error">{error}</p>}
      </div>
    );
  }

  const m = snap.mission;

  return (
    <div data-theme="jarvis" className="j-shell" style={{ gridTemplateRows: "auto auto 1fr" }}>
      <JarvisFocusListener onFocus={onJarvisFocus} />
      {/* Mission strip */}
      <header
        className="j-glass"
        data-jarvis-focus={jarvisFocus && !jarvisFocus.slug ? "true" : undefined}
        style={{ padding: 16 }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyItems: "flex-start" }}>
          <div style={{ flex: "1 1 280px" }}>
            <p className="j-title">Situation Room</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <label className="j-muted" style={{ fontSize: 12 }} htmlFor="sr-project">
                Venture
              </label>
              <select
                id="sr-project"
                className="j-btn"
                disabled={switchingProject || creatingVenture || projects.length === 0}
                value={snap.activeProject}
                onChange={(e) => void onSwitchProject(e.target.value)}
                style={{ minWidth: 160 }}
              >
                {(projects.length
                  ? projects
                  : [{ slug: snap.activeProject, name: snap.activeProject }]
                ).map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name || p.slug}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="j-btn"
                data-active="true"
                disabled={creatingVenture}
                onClick={() => {
                  setShowNewVenture((v) => !v);
                  setActionError(null);
                }}
              >
                New idea
              </button>
            </div>
            {showNewVenture && (
              <div
                className="j-glass"
                style={{
                  marginBottom: 10,
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  maxWidth: 420,
                }}
              >
                <p className="j-muted" style={{ margin: 0, fontSize: 12 }}>
                  Creates a new venture folder, tracker, DISPATCH queue, and MEMORY — then switches to it.
                </p>
                <label className="j-muted" style={{ fontSize: 12 }} htmlFor="sr-new-name">
                  Idea name
                </label>
                <input
                  id="sr-new-name"
                  className="j-btn"
                  placeholder="e.g. Solar Lantern"
                  value={newVentureName}
                  onChange={(e) => {
                    setNewVentureName(e.target.value);
                    if (!newVentureSlug || newVentureSlug === slugPreviewFromName(newVentureName)) {
                      setNewVentureSlug(slugPreviewFromName(e.target.value));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void onCreateVenture();
                  }}
                />
                <label className="j-muted" style={{ fontSize: 12 }} htmlFor="sr-new-slug">
                  Slug (folder id)
                </label>
                <input
                  id="sr-new-slug"
                  className="j-btn"
                  placeholder="solar-lantern"
                  value={newVentureSlug}
                  onChange={(e) => setNewVentureSlug(e.target.value)}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="j-btn"
                    data-active="true"
                    disabled={!newVentureName.trim() || creatingVenture}
                    onClick={() => void onCreateVenture()}
                  >
                    {creatingVenture ? "Creating…" : "Create & switch"}
                  </button>
                  <button
                    type="button"
                    className="j-btn"
                    disabled={creatingVenture}
                    onClick={() => {
                      setShowNewVenture(false);
                      setNewVentureName("");
                      setNewVentureSlug("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <h1 className="j-heading">{m.idea || "Virtual Company"}</h1>
            <p style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em" }}>
              NOW · Phase {m.currentPhase} {m.currentPhaseName}{" "}
              <span className="j-chip" data-tone={m.currentStatus === "🔄" ? "warn" : "ok"}>
                {m.currentStatus}
              </span>
              {m.hardGate && (
                <span className="j-chip" data-tone="warn" style={{ marginLeft: 6 }}>
                  hard gate
                </span>
              )}
            </p>
            <p className="j-muted" style={{ marginTop: 6 }}>
              {m.nextAction}
            </p>
          </div>
          <div style={{ width: 88, textAlign: "center" }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                border: "4px solid var(--j-accent)",
                display: "grid",
                placeItems: "center",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {m.progressPct}%
            </div>
            <p className="j-muted" style={{ marginTop: 4 }}>
              {m.done} done · {m.active} active · {m.pending} pending
            </p>
            <p className="j-muted" style={{ marginTop: 2 }}>
              Spend ${((m.spendUsd ?? 0) as number).toFixed(4)}
            </p>
          </div>
          <div style={{ flex: "1 1 220px" }}>
            <p className="j-muted">
              Blockers {m.blockerCount}
              {m.openQuestions[0] ? ` · ${m.openQuestions[0]}` : ""}
            </p>
            {m.latestDecision && (
              <p className="j-muted" style={{ marginTop: 4 }}>
                Decision: {m.latestDecision}
              </p>
            )}
            {m.parallelTracks.length > 0 && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                {m.parallelTracks.map((t) => (
                  <span key={t} className="j-chip">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              <button
                type="button"
                className="j-btn"
                data-active="true"
                onClick={() => requestTalkConnect()}
              >
                Talk
              </button>
              <button type="button" className="j-btn" data-active="true" onClick={() => void onBriefMe("mission")}>
                Brief me
              </button>
              <button type="button" className="j-btn" onClick={() => void onBriefMe("seat")}>
                Brief CEO
              </button>
              <button type="button" className="j-btn" onClick={() => void onBriefMe("digest")}>
                Brief digest
              </button>
              <button type="button" className="j-btn" onClick={() => setDrawer("assign")}>
                Assign
              </button>
              <button type="button" className="j-btn" onClick={() => setDrawer("outputs")}>
                Outputs
              </button>
              <button type="button" className="j-btn" onClick={() => setDrawer("chat")}>
                Legacy voice
              </button>
              <button type="button" className="j-btn" data-active="true" onClick={() => void onSpawn({ wakeReason: "run_next" })}>
                Run next
              </button>
              <button type="button" className="j-btn" onClick={() => setDrawer("run")}>
                Runs
              </button>
              <button type="button" className="j-btn" onClick={() => void openDigest()}>
                Digest
              </button>
              <button type="button" className="j-btn" onClick={() => setDrawer("alerts")}>
                Alerts (
                {(snap.alerts ?? []).filter((a) => !a.acked).length})
              </button>
              <button type="button" className="j-btn" onClick={() => setDrawer("routines")}>
                Routines
              </button>
              <button type="button" className="j-btn" data-active={showMap} onClick={() => setShowMap((v) => !v)}>
                Map
              </button>
              <button type="button" className="j-btn" onClick={() => void reload()}>
                Refresh
              </button>
            </div>
            {actionError && (
              <p className="j-error" style={{ marginTop: 8 }}>
                {actionError}
              </p>
            )}
            <p className="j-muted" style={{ marginTop: 6 }}>
              OmniVoice {voiceOk == null ? "…" : voiceOk ? "online" : "offline (browser TTS fallback)"}
              {" · "}
              <label>
                <input
                  type="checkbox"
                  checked={autoSpawn}
                  onChange={(e) => setAutoSpawn(e.target.checked)}
                />{" "}
                Auto-spawn on queue
              </label>
            </p>
          </div>
          {showMap && legacySnap && (
            <div className="j-map j-glass" style={{ width: 280, height: 180 }}>
              <OrgTheater snapshot={legacySnap as never} />
            </div>
          )}
        </div>
      </header>

      {error && (
        <p className="j-glass j-error" style={{ padding: 10, margin: 0 }}>
          {error}
        </p>
      )}

      <section className="j-glass" style={{ padding: "8px 14px", margin: 0 }}>
        <p className="j-title" style={{ marginBottom: 6 }}>
          Activity
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: 96, overflow: "auto" }}>
          {(snap.activity ?? []).slice(0, 12).map((ev, i) => (
            <li key={`${ev.at}-${ev.type}-${i}`} style={{ fontSize: 11, marginBottom: 2 }}>
              {ev.runId ? (
                <button
                  type="button"
                  className="j-btn"
                  style={{ padding: "2px 6px", fontSize: 11 }}
                  onClick={() => {
                    setSelectedRunId(ev.runId!);
                    setDrawer("run");
                  }}
                >
                  {formatActivityLine(ev)}
                </button>
              ) : (
                <span className="j-muted">{formatActivityLine(ev)}</span>
              )}
            </li>
          ))}
          {(snap.activity ?? []).length === 0 && (
            <li className="j-muted" style={{ fontSize: 11 }}>
              No activity yet — Assign and Run next to start.
            </li>
          )}
        </ul>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 1fr) minmax(280px, 1.2fr) minmax(260px, 0.9fr)",
          gap: 12,
          minHeight: 0,
          height: "100%",
        }}
      >
        {/* C-suite */}
        <section className="j-glass j-panel-scroll" style={{ padding: 12 }}>
          <p className="j-title">C-Suite</p>
          <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
            {snap.csuite.map((card) => (
              <div
                key={card.slug}
                ref={(el) => {
                  seatCardRefs.current[card.slug] = el;
                }}
              >
                <CSuiteCardView
                  card={card}
                  selected={selectedSlug === card.slug}
                  jarvisFocused={jarvisFocus?.slug === card.slug}
                  paused={Boolean(snap.agentStates?.[card.slug]?.paused)}
                  onOpen={() => setSelectedSlug(card.slug)}
                  onReport={() => void openReport(card.slug)}
                  onTogglePause={() =>
                    void onTogglePause(
                      card.slug,
                      Boolean(snap.agentStates?.[card.slug]?.paused),
                    )
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {/* Drill-down */}
        <section className="j-glass j-panel-scroll" style={{ padding: 14 }}>
          <p className="j-title">Drill-down</p>
          {!selected && (
            <p className="j-muted" style={{ marginTop: 12 }}>
              Select a C-suite seat to inspect reports and IC progress.
            </p>
          )}
          {selected?.seat && (
            <div style={{ marginTop: 10 }}>
              <h2 className="j-heading" style={{ fontSize: 18 }}>
                {selected.seat.title}
              </h2>
              <p className="j-mono j-muted">
                {selected.seat.slug} · {selected.seat.level} · tier{" "}
                {snap.models[selected.seat.slug]?.llmTier || "—"}
              </p>
              <button
                type="button"
                className="j-btn"
                data-active="true"
                style={{ marginTop: 8 }}
                onClick={() => void openReport(selected.seat!.slug)}
              >
                Report
              </button>
              <p className="j-muted" style={{ marginTop: 8 }}>
                {selected.card?.briefingSnippet || "No briefing snippet yet."}
              </p>
              <h3 className="j-title" style={{ marginTop: 16 }}>
                Direct reports
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0" }}>
                {selected.reports.map((r) => {
                  const h = snap.handoffs.find((x) => x.position === r.slug);
                  return (
                    <li key={r.slug}>
                      <button
                        type="button"
                        className="j-btn"
                        style={{ width: "100%", textAlign: "left", marginBottom: 6 }}
                        onClick={() => setSelectedSlug(r.slug)}
                      >
                        {r.title}{" "}
                        <span className="j-chip">{h?.status || "idle"}</span>
                      </button>
                    </li>
                  );
                })}
                {selected.reports.length === 0 && (
                  <li className="j-muted">No direct reports (IC or leaf).</li>
                )}
              </ul>
              <h3 className="j-title" style={{ marginTop: 16 }}>
                Handoffs
              </h3>
              {selected.handoffs.length === 0 && (
                <p className="j-muted">No handoff files for this seat.</p>
              )}
              {selected.handoffs.map((h) => (
                <div key={h.filename} className="j-chip" style={{ display: "block", marginTop: 6 }}>
                  {h.filename} · {h.status || h.verdict || "—"}
                  {h.artifacts.map((a) => (
                    <button
                      key={a.path}
                      type="button"
                      className="j-btn"
                      style={{ marginLeft: 6 }}
                      onClick={() => {
                        setArtifact(a.path);
                        setDrawer("outputs");
                      }}
                    >
                      open
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Tasks */}
        <section className="j-glass j-panel-scroll" style={{ padding: 12 }}>
          <p className="j-title">Live tasks</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0" }}>
            {snap.tasks
              .filter((t) => t.status !== "done")
              .slice(0, 40)
              .map((t) => (
                <li
                  key={t.id}
                  className="j-glass"
                  style={{ padding: "8px 10px", marginBottom: 6 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 12 }}>{t.title}</span>
                    <span className="j-chip" data-tone={toneFor(t.status)}>
                      {t.status}
                    </span>
                  </div>
                  <div style={{ marginTop: 4 }}>
                    {t.slug && (
                      <button
                        type="button"
                        className="j-btn"
                        style={{ marginRight: 4 }}
                        onClick={() => void openReport(t.slug!)}
                      >
                        Report
                      </button>
                    )}
                    {t.id.startsWith("phase:") && (
                      <button
                        type="button"
                        className="j-btn"
                        onClick={() => setDrawer("assign")}
                      >
                        Assign
                      </button>
                    )}
                    {t.canPlay && t.dispatchFilename && (
                      <button
                        type="button"
                        className="j-btn"
                        data-active="true"
                        style={{ marginLeft: 4 }}
                        onClick={() =>
                          void onSpawn({
                            filename: t.dispatchFilename,
                            wakeReason: "on_demand",
                          })
                        }
                      >
                        Play
                      </button>
                    )}
                    {t.canCancel && t.runId && (
                      <button
                        type="button"
                        className="j-btn"
                        style={{ marginLeft: 4 }}
                        onClick={() => void onCancel(t.runId!)}
                      >
                        Cancel
                      </button>
                    )}
                    {t.canRewake && t.dispatchFilename && (
                      <button
                        type="button"
                        className="j-btn"
                        style={{ marginLeft: 4 }}
                        onClick={() => void onRewake(t.dispatchFilename!)}
                      >
                        Rewake
                      </button>
                    )}
                    {t.runId && (
                      <button
                        type="button"
                        className="j-btn"
                        style={{ marginLeft: 4 }}
                        onClick={() => {
                          setSelectedRunId(t.runId!);
                          setDrawer("run");
                        }}
                      >
                        Run
                      </button>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </section>
      </div>

      {/* Drawers */}
      {drawer === "assign" && (
        <Drawer onClose={() => setDrawer(null)} title="Assign">
          <QuickAssign
            snap={snap}
            onDone={async () => {
              await reload();
              if (autoSpawn) await onSpawn({ wakeReason: "auto_queue" });
            }}
          />
        </Drawer>
      )}

      {drawer === "run" && (
        <Drawer onClose={() => setDrawer(null)} title="Runs">
          <RunDrawer
            runs={snap.runs ?? []}
            selectedRunId={selectedRunId}
            onSelect={setSelectedRunId}
            onCancel={(id) => void onCancel(id)}
          />
        </Drawer>
      )}

      {drawer === "routines" && (
        <Drawer onClose={() => setDrawer(null)} title="Routines">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {(snap.routines ?? []).length === 0 && (
              <li className="j-muted">
                No routines yet. Add YAML under {snap.businessIdeaRel}/DISPATCH/routines/ (see README).
              </li>
            )}
            {(snap.routines ?? []).map((r) => (
              <li
                key={r.id}
                className="j-glass"
                style={{ padding: 10, marginBottom: 8 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <strong>{r.id}</strong>
                    <p className="j-mono j-muted" style={{ margin: "4px 0 0" }}>
                      {r.cron} · {r.action}
                    </p>
                    <p className="j-muted" style={{ fontSize: 11 }}>
                      next {r.nextRunAt ?? "—"} · last {r.last_run_at ?? "—"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="j-btn"
                    data-active={r.enabled}
                    onClick={() =>
                      void setRoutineEnabled(r.id, !r.enabled).then(() => reload())
                    }
                  >
                    {r.enabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Drawer>
      )}

      {drawer === "outputs" && (
        <Drawer onClose={() => setDrawer(null)} title="Outputs">
          <OutputsDashboard
            snapshot={{
              businessIdeaRel: snap.businessIdeaRel,
              tracker: {
                ...snap.tracker,
                phases: snap.tracker.phases.map((p) => ({ ...p, notes: "" })),
              } as SituationSnapshot["tracker"],
              handoffs: snap.handoffs.map((h) => ({
                ...h,
                reportsTo: "",
                generationProfile: "",
                fallbackApplied: "",
              })) as SituationSnapshot["handoffs"],
            }}
            selectedPath={artifact}
            onSelect={setArtifact}
          />
        </Drawer>
      )}

      {drawer === "report" && (
        <Drawer
          onClose={() => setDrawer(null)}
          title={`Report — ${seatReport?.title ?? selectedSlug ?? ""}`}
        >
          {!seatReport && <p className="j-muted">Loading…</p>}
          {seatReport && (
            <div style={{ display: "grid", gap: 12, maxWidth: 560 }}>
              <p className="j-muted">{seatReport.summary}</p>
              <p className="j-muted" style={{ fontSize: 11 }}>
                Last activity: {seatReport.lastActivityAt || "—"}
                {seatReport.hardGate ? " · hard gate" : ""}
                {seatReport.heartbeatPath ? ` · HEARTBEAT` : ""}
                {seatReport.spend
                  ? ` · spend $${seatReport.spend.cost_usd.toFixed(4)}`
                  : ""}
              </p>
              {seatReport.pinnedBriefing?.stale && (
                <p className="j-error">Pinned standup is stale vs latest activity.</p>
              )}
              <div>
                <p className="j-title">You (human)</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0" }}>
                  {seatReport.nextActions
                    .filter((a) => a.actor === "human")
                    .map((a) => (
                      <li key={a.id} style={{ marginBottom: 6 }}>
                        <button
                          type="button"
                          className="j-btn"
                          data-active="true"
                          onClick={() => void runCta(a)}
                        >
                          {a.label}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <p className="j-title">Agents</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0" }}>
                  {seatReport.nextActions
                    .filter((a) => a.actor === "agent")
                    .map((a) => (
                      <li key={a.id} className="j-chip" style={{ display: "block", marginTop: 4 }}>
                        {a.label}
                      </li>
                    ))}
                </ul>
              </div>
              {seatReport.escalations.length > 0 && (
                <div>
                  <p className="j-title">Escalations</p>
                  {seatReport.escalations.map((e, i) => (
                    <div key={`${e.phase}-${i}`} className="j-chip" style={{ display: "block", marginTop: 4 }}>
                      phase {e.phase} · {e.fromSlug} · {e.tags.join(", ") || "untagged"} →{" "}
                      {e.secondaries.join(", ") || "CEO"}
                    </div>
                  ))}
                </div>
              )}
              {seatReport.liveRuns.length > 0 && (
                <div>
                  <p className="j-title">Live runs</p>
                  {seatReport.liveRuns.map((r) => (
                    <button
                      key={r.runId}
                      type="button"
                      className="j-btn"
                      style={{ display: "block", marginTop: 4, width: "100%", textAlign: "left" }}
                      onClick={() => {
                        setSelectedRunId(r.runId);
                        setDrawer("run");
                      }}
                    >
                      {r.status} · {r.runId}
                      {r.error ? ` · ${r.error}` : ""}
                    </button>
                  ))}
                </div>
              )}
              {seatReport.downward.length > 0 && (
                <div>
                  <p className="j-title">Reports back</p>
                  <ul>
                    {seatReport.downward.map((d) => (
                      <li key={d.slug}>
                        <button type="button" className="j-btn" onClick={() => void openReport(d.slug)}>
                          {d.title}: {d.latestStatus}
                          {d.asks[0] ? ` · ask: ${d.asks[0]}` : ""}
                          {d.blockers[0] ? ` · blocker: ${d.blockers[0]}` : ""}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="j-title">Own handoffs</p>
                {seatReport.ownHandoffs.length === 0 ? (
                  <p className="j-muted">None on disk</p>
                ) : (
                  seatReport.ownHandoffs.map((h) => (
                    <div key={h.filename} className="j-chip" style={{ display: "block", marginTop: 6 }}>
                      {h.filename} · {h.status || "—"}
                    </div>
                  ))
                )}
              </div>
              {seatReport.artifacts.length > 0 && (
                <div>
                  <p className="j-title">Artifacts</p>
                  {seatReport.artifacts.map((a) => (
                    <div
                      key={`${a.fromHandoff}:${a.path}`}
                      className="j-chip"
                      data-tone={a.exists ? "ok" : "warn"}
                      style={{ display: "block", marginTop: 4 }}
                    >
                      {a.exists ? "ok" : "missing"} · {a.path}
                    </div>
                  ))}
                </div>
              )}
              {seatReport.modelQuality.some((q) => !q.ok) && (
                <div>
                  <p className="j-title">Model routing</p>
                  {seatReport.modelQuality
                    .filter((q) => !q.ok)
                    .map((q) => (
                      <div key={q.filename} className="j-error" style={{ fontSize: 12, marginTop: 4 }}>
                        {q.filename}: {q.detail}
                      </div>
                    ))}
                </div>
              )}
              {(seatReport.role === "ceo" || seatReport.role === "manager") && (
                <button
                  type="button"
                  className="j-btn"
                  onClick={async () => {
                    if (
                      seatReport.pinnedBriefing &&
                      !window.confirm("Overwrite pinned standup on disk?")
                    ) {
                      return;
                    }
                    await postBriefing({
                      position: seatReport.slug,
                      phase_focus: seatReport.relevantPhases[0] ?? "",
                      status: seatReport.upwardBlockers.length ? "blocked" : "on_track",
                      progress: [
                        seatReport.summary,
                        "",
                        "Next actions:",
                        ...seatReport.nextActions.map((a) => `- [${a.actor}] ${a.label}`),
                      ].join("\n"),
                      asks:
                        seatReport.upwardAsks.join("\n") ||
                        seatReport.downward.flatMap((d) => d.asks).join("\n"),
                      blockers:
                        seatReport.upwardBlockers.join("\n") ||
                        seatReport.downward.flatMap((d) => d.blockers).join("\n"),
                      escalation_tags: seatReport.escalations.flatMap((e) => e.tags),
                    });
                    void reload();
                    void openReport(seatReport.slug);
                  }}
                >
                  Pin snapshot
                </button>
              )}
            </div>
          )}
        </Drawer>
      )}

      {drawer === "digest" && (
        <Drawer onClose={() => setDrawer(null)} title="Company digest">
          {!digest && <p className="j-muted">Loading…</p>}
          {digest && (
            <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
              <p className="j-muted">
                Queue {digest.queueDepth} · Alerts {digest.openAlerts} · Awaiting C-suite{" "}
                {digest.awaitingCsuite.join(", ") || "none"}
              </p>
              {digest.parallelTracks.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {digest.parallelTracks.map((t) => (
                    <span key={t} className="j-chip">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div>
                <p className="j-title">CEO next</p>
                {digest.ceoNext.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className="j-btn"
                    data-active={a.actor === "human"}
                    style={{ display: "block", marginTop: 4, width: "100%", textAlign: "left" }}
                    onClick={() => void runCta(a)}
                  >
                    [{a.actor}] {a.label}
                  </button>
                ))}
              </div>
              <div>
                <p className="j-title">Blocked</p>
                {digest.blockedSeats.length === 0 && <p className="j-muted">None</p>}
                {digest.blockedSeats.map((b) => (
                  <button
                    key={b.slug}
                    type="button"
                    className="j-btn"
                    style={{ display: "block", marginTop: 4 }}
                    onClick={() => void openReport(b.slug)}
                  >
                    {b.slug}: {b.reason}
                  </button>
                ))}
              </div>
              <div>
                <p className="j-title">Escalations</p>
                {digest.escalateSeats.map((e) => (
                  <div key={e.slug} className="j-chip" style={{ display: "block", marginTop: 4 }}>
                    {e.slug} · {e.tags.join(", ")} → {e.secondaries.join(", ")}
                  </div>
                ))}
              </div>
              {digest.topSpenders.length > 0 && (
                <div>
                  <p className="j-title">Top spend</p>
                  {digest.topSpenders.map((s) => (
                    <div key={s.slug} className="j-muted">
                      {s.slug}: ${s.cost_usd.toFixed(4)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Drawer>
      )}

      {drawer === "alerts" && (
        <Drawer onClose={() => setDrawer(null)} title="Handoff alerts">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {(snap.alerts ?? []).length === 0 && (
              <li className="j-muted">No alerts yet.</li>
            )}
            {(snap.alerts ?? [])
              .filter((a) => !a.acked)
              .map((a) => (
                <li key={a.id} style={{ marginBottom: 8 }}>
                  <span className="j-chip">{a.kind}</span> {a.slug} · {a.filename}
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <button type="button" className="j-btn" onClick={() => void openReport(a.slug)}>
                      Report
                    </button>
                    <button
                      type="button"
                      className="j-btn"
                      onClick={async () => {
                        await ackAlert(a.id);
                        void reload();
                      }}
                    >
                      Ack
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </Drawer>
      )}

      {drawer === "chat" && (
        <Drawer onClose={() => setDrawer(null)} title="Legacy voice (HTTP)">
          <div style={{ display: "grid", gap: 10, maxWidth: 560 }}>
            <p className="j-muted" style={{ fontSize: 12 }}>
              Prefer the floating Talk button (LiveKit + Ollama). This path uses Web Speech + OmniVoice.
            </p>
            <div className="j-glass" style={{ padding: 10, maxHeight: 280, overflow: "auto" }}>
              {chatLog.length === 0 && (
                <p className="j-muted">Ask anything about the company. Tools can assign, spawn, and file briefs.</p>
              )}
              {chatLog.map((m, i) => (
                <p key={i} style={{ margin: "0 0 8px", fontSize: 13 }}>
                  <strong>{m.role === "user" ? "You" : "Room"}:</strong> {m.content}
                </p>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="j-input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type or use mic…"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && chatInput.trim()) {
                    void sendChat(chatInput.trim());
                    setChatInput("");
                  }
                }}
              />
              <button
                type="button"
                className="j-btn"
                data-active="true"
                onClick={() => {
                  if (!chatInput.trim()) return;
                  void sendChat(chatInput.trim());
                  setChatInput("");
                }}
              >
                Send
              </button>
              <button
                type="button"
                className="j-btn"
                data-active={listening}
                onClick={() => startListen()}
              >
                Mic
              </button>
            </div>
          </div>
        </Drawer>
      )}

      <VoiceFab />
    </div>
  );
}

function toneFor(status: string): "ok" | "warn" | "danger" | undefined {
  if (status === "blocked" || status === "escalate" || status === "error") return "danger";
  if (
    status === "awaiting_csuite" ||
    status === "in_progress" ||
    status === "queued" ||
    status === "in_flight" ||
    status === "paused" ||
    status === "running"
  )
    return "warn";
  if (status === "done" || status === "active" || status === "completed") return "ok";
  return undefined;
}

function CSuiteCardView({
  card,
  selected,
  jarvisFocused,
  paused,
  onOpen,
  onReport,
  onTogglePause,
}: {
  card: CSuiteCard;
  selected: boolean;
  jarvisFocused?: boolean;
  paused: boolean;
  onOpen: () => void;
  onReport: () => void;
  onTogglePause: () => void;
}) {
  return (
    <div
      className="j-glass"
      data-selected={selected}
      data-jarvis-focus={jarvisFocused ? "true" : undefined}
      style={{
        padding: 10,
        borderColor: selected || jarvisFocused ? "var(--j-accent)" : undefined,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{card.title}</div>
          <div className="j-mono j-muted">{card.slug}</div>
        </div>
        <span className="j-chip" data-tone={toneFor(card.pulse)}>
          {card.pulse}
        </span>
      </div>
      <p className="j-muted" style={{ marginTop: 6, fontSize: 11 }}>
        {card.hasBriefing ? card.briefingSnippet || "Briefing on file" : "No brief yet"}
        {card.ownedActivePhases.length
          ? ` · phases ${card.ownedActivePhases.join(", ")}`
          : ""}
      </p>
      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
        <button type="button" className="j-btn" onClick={onOpen}>
          Open
        </button>
        <button type="button" className="j-btn" data-active="true" onClick={onReport}>
          Report
        </button>
        <button type="button" className="j-btn" onClick={onTogglePause}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}

function RunDrawer({
  runs,
  selectedRunId,
  onSelect,
  onCancel,
}: {
  runs: RunRecord[];
  selectedRunId: string | null;
  onSelect: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const selected = runs.find((r) => r.runId === selectedRunId) ?? runs[0] ?? null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 12 }}>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {runs.length === 0 && <li className="j-muted">No runs yet.</li>}
        {runs.map((r) => (
          <li key={r.runId} style={{ marginBottom: 6 }}>
            <button
              type="button"
              className="j-btn"
              data-active={selected?.runId === r.runId}
              style={{ width: "100%", textAlign: "left" }}
              onClick={() => onSelect(r.runId)}
            >
              <span className="j-chip" data-tone={toneFor(r.status)}>
                {r.status}
              </span>{" "}
              {r.position}
            </button>
          </li>
        ))}
      </ul>
      <div>
        {!selected && <p className="j-muted">Select a run.</p>}
        {selected && (
          <>
            <p className="j-mono j-muted">{selected.runId}</p>
            <p style={{ marginTop: 8 }}>
              <span className="j-chip" data-tone={toneFor(selected.status)}>
                {selected.status}
              </span>{" "}
              wake: {selected.wake_reason} · phase {selected.phase}
            </p>
            <p className="j-muted" style={{ marginTop: 6 }}>
              {selected.dispatch_filename} · {selected.llm_model}
              {selected.agentId ? ` · agent ${selected.agentId}` : ""}
            </p>
            <p className="j-muted">
              started {selected.started_at}
              {selected.finished_at ? ` · finished ${selected.finished_at}` : ""}
              {typeof selected.cost_usd === "number"
                ? ` · $${selected.cost_usd.toFixed(4)}`
                : ""}
              {selected.usage?.totalTokens != null
                ? ` · ${selected.usage.totalTokens} tok`
                : ""}
            </p>
            {(selected.status === "running" || selected.status === "starting") && (
              <button
                type="button"
                className="j-btn"
                style={{ marginTop: 10 }}
                onClick={() => onCancel(selected.runId)}
              >
                Cancel
              </button>
            )}
            {selected.error && (
              <pre className="j-mono" style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
                {selected.error}
              </pre>
            )}
            {selected.result != null && (
              <pre className="j-mono" style={{ marginTop: 12, whiteSpace: "pre-wrap", fontSize: 11 }}>
                {typeof selected.result === "string"
                  ? selected.result
                  : JSON.stringify(selected.result, null, 2)}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Drawer({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 50,
        display: "grid",
        placeItems: "end stretch",
      }}
      onClick={onClose}
    >
      <div
        className="j-glass"
        style={{
          width: "min(720px, 100%)",
          maxHeight: "90vh",
          overflow: "auto",
          margin: 16,
          padding: 16,
          justifySelf: "end",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <p className="j-title">{title}</p>
          <button type="button" className="j-btn" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Minimal SpeechRecognition typings for TS
interface SpeechRecognition extends EventTarget {
  lang: string;
  start(): void;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
}
interface SpeechRecognitionEvent {
  results: { [i: number]: { [j: number]: { transcript: string } } };
}
