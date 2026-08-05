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
  postJarvisConfirm,
  resumeSeat,
  rewakeSession,
  setRoutineEnabled,
  createProject,
  answerSeatQuestions,
  resolveBlocker,
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
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../components/ui/dialog";
import { OutputsDashboard } from "./hud/OutputsDashboard";
import { QuickAssign } from "./hud/QuickAssign";
import { SeatConsole } from "./hud/SeatConsole";
import { ThreatRail } from "./hud/ThreatRail";
import { CommandDeck } from "./hud/CommandDeck";
import { MissionCommandControls } from "./hud/MissionCommandControls";
import "./hud/theme.css";
import { OrgTheater } from "./scene/OrgTheater";
import type { SeatNextAction, SeatReport } from "./seat-report";
import { seatWorkContext } from "./seat-work-context";
import { useJarvisStore } from "./state/useJarvisStore";
import { requestTalkConnect, VoiceFab } from "./VoiceFab";
import { JarvisFocusListener } from "./JarvisFocusListener";
import type { JarvisFocus } from "./jarvis-focus";
import { JarvisDrawer } from "./JarvisDrawer";
import { setOpsVisible, setTheaterVisible } from "./workspace-view-state";
import { ManualActivityCounter, RequestSequence } from "./request-coordinator";
import { failedChatDraft, nextChatDraft, retryChatMessage } from "./chat-submission";

function resolveRewakeDispatchFilename(
  snap: SituationSnapshot | null,
  a: SeatNextAction,
  selectedSlug: string | null,
): string | undefined {
  if (!snap) return undefined;
  if (a.runId) {
    const run = snap.runs?.find((r) => r.runId === a.runId);
    if (run?.dispatch_filename) return run.dispatch_filename;
  }
  const slug = a.relatedSlug ?? selectedSlug;
  if (slug) {
    const session = snap.sessions?.find((s) => s.position === slug);
    if (session?.dispatch_filename) return session.dispatch_filename;
  }
  return undefined;
}

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

type BlockerConfirmationRequest = {
  seat: string;
  token: string;
  summary?: string;
  reason?: string;
  /** Which confirmable intent produced this token. */
  intent?: "blocker.resolve" | "seat.answer";
  answers?: Record<string, string>;
};

export function BlockerConfirmationDialog({
  request,
  loading,
  cancelling = false,
  cancellationError,
  onCancel,
  onConfirm,
}: {
  request: BlockerConfirmationRequest | null;
  loading: boolean;
  cancelling?: boolean;
  cancellationError?: string | null;
  onCancel: (token: string) => void;
  onConfirm: (token: string) => void;
}) {
  const cancellationRequestedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!cancelling) cancellationRequestedFor.current = null;
  }, [cancelling, request?.token]);

  function requestCancellation() {
    if (
      !request ||
      loading ||
      cancelling ||
      cancellationRequestedFor.current === request.token
    ) {
      return;
    }
    cancellationRequestedFor.current = request.token;
    onCancel(request.token);
  }

  return (
    <Dialog
      open={request !== null}
      onOpenChange={(open) => {
        if (!open) requestCancellation();
      }}
    >
      {request ? (
        <DialogContent theme="jarvis" aria-busy={loading || cancelling}>
          <DialogTitle>Confirm blocker resolution</DialogTitle>
          <DialogDescription className="j-muted">
            Review the server response before approving this write.
          </DialogDescription>
          {request.summary ? <p>{request.summary}</p> : null}
          {request.reason ? <p className="j-muted">{request.reason}</p> : null}
          {cancellationError ? (
            <p className="j-error" role="alert">
              {cancellationError}
            </p>
          ) : null}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button
              type="button"
              variant="outline"
              disabled={loading || cancelling}
              onClick={requestCancellation}
            >
              {cancelling ? "Cancelling…" : "Cancel"}
            </Button>
            <Button
              type="button"
              disabled={loading || cancelling}
              onClick={() => {
                if (cancellationRequestedFor.current !== request.token) {
                  onConfirm(request.token);
                }
              }}
            >
              {loading ? "Confirming…" : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

export function SituationRoom() {
  const [snap, setSnap] = useState<SituationSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [showMap, setShowMap] = useState(true);
  const [resolvingSlug, setResolvingSlug] = useState<string | null>(null);
  const [blockerConfirmation, setBlockerConfirmation] =
    useState<BlockerConfirmationRequest | null>(null);
  const [cancellingConfirmationToken, setCancellingConfirmationToken] =
    useState<string | null>(null);
  const [confirmationCancellationError, setConfirmationCancellationError] =
    useState<string | null>(null);
  const [consoleLoading, setConsoleLoading] = useState(false);
  const [opsMode, setOpsMode] = useState(false);
  const jarvisStore = useJarvisStore();
  const selectedSlug = jarvisStore.selectedSlug;
  const selectStoreSlug = jarvisStore.selectSlug;
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
  const [reportAnswers, setReportAnswers] = useState<Record<string, string>>({});
  const [reportOpsOpen, setReportOpsOpen] = useState(false);
  const [reportFocusQuestions, setReportFocusQuestions] = useState(false);
  const [answeringSeat, setAnsweringSeat] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<string | null>(null);
  const questionsSectionRef = useRef<HTMLDivElement | null>(null);
  const [digest, setDigest] = useState<CompanyDigest | null>(null);
  const [artifact, setArtifact] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [switchingProject, setSwitchingProject] = useState(false);
  const [showNewVenture, setShowNewVenture] = useState(false);
  const [newVentureName, setNewVentureName] = useState("");
  const [newVentureSlug, setNewVentureSlug] = useState("");
  const [newVentureContext, setNewVentureContext] = useState("");
  const [creatingVenture, setCreatingVenture] = useState(false);
  const [jarvisFocus, setJarvisFocus] = useState<JarvisFocus | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [chatSending, setChatSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [failedChatMessage, setFailedChatMessage] = useState<string | null>(null);
  const reloadSequence = useRef(new RequestSequence());
  const digestSequence = useRef(new RequestSequence());
  const seatReportSequence = useRef(new RequestSequence());
  const manualReloads = useRef(new ManualActivityCounter());
  const chatSendingRef = useRef(false);
  const seatCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const cancellationRequests = useRef(new Set<string>());

  const openReport = useCallback(
    (slug: string, opts?: { focusQuestions?: boolean }) => {
      selectStoreSlug(slug);
      setReportFocusQuestions(Boolean(opts?.focusQuestions));
      setReportOpsOpen(false);
      setAnswerStatus(null);
      setDrawer("report");
    },
    [selectStoreSlug],
  );

  const onJarvisFocus = useCallback(
    (focus: JarvisFocus | null) => {
      setJarvisFocus(focus);
      if (focus?.slug) {
        selectStoreSlug(focus.slug);
        requestAnimationFrame(() => {
          seatCardRefs.current[focus.slug!]?.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        });
        if (focus.openReport) {
          openReport(focus.slug, { focusQuestions: Boolean(focus.focusQuestions) });
        }
      }
    },
    [openReport, selectStoreSlug],
  );

  const reload = useCallback(async (manual = false) => {
    const request = reloadSequence.current.beginIfMounted();
    if (request == null) return;
    if (manual) {
      manualReloads.current.begin();
      setRefreshing(true);
    }
    try {
      const [s, proj] = await Promise.all([
        fetchSnapshot(),
        fetch("/api/project").then(async (r) => {
          if (!r.ok) return null;
          return r.json() as Promise<{ projects: ProjectListItem[] }>;
        }),
      ]);
      if (reloadSequence.current.isCurrent(request)) {
        setSnap(s);
        if (proj?.projects) setProjects(proj.projects);
        setError(null);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (e) {
      if (reloadSequence.current.isCurrent(request)) {
        setError(e instanceof Error ? e.message : String(e));
      }
    } finally {
      if (manual) {
        if (manualReloads.current.endAndShouldPublish(reloadSequence.current)) {
          setRefreshing(false);
        }
      }
    }
  }, []);

  const reloadDigest = useCallback(async () => {
    const request = digestSequence.current.begin();
    try {
      const next = await fetchCompanyDigest();
      if (digestSequence.current.isCurrent(request)) setDigest(next);
      return next;
    } catch (e) {
      if (digestSequence.current.isCurrent(request)) setDigest(null);
      throw e;
    }
  }, []);

  async function onSwitchProject(slug: string) {
    if (!slug || slug === snap?.activeProject || switchingProject) return;
    setSwitchingProject(true);
    digestSequence.current.begin();
    setDigest(null);
    setActionError(null);
    try {
      await setActiveProject(slug);
      await reload(true);
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
    digestSequence.current.begin();
    setDigest(null);
    setActionError(null);
    try {
      const slug = newVentureSlug.trim() || undefined;
      await createProject({
        name,
        slug,
        activate: true,
        contextNote: newVentureContext.trim() || undefined,
      });
      setShowNewVenture(false);
      setNewVentureName("");
      setNewVentureSlug("");
      setNewVentureContext("");
      await reload(true);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : String(e));
    } finally {
      setCreatingVenture(false);
    }
  }

  useEffect(() => {
    const reloadRequests = reloadSequence.current;
    const digestRequests = digestSequence.current;
    const seatReportRequests = seatReportSequence.current;
    reloadRequests.mount();
    digestRequests.mount();
    seatReportRequests.mount();
    void reload();
    const unsub = subscribeEvents(() => void reload());
    const poll = setInterval(() => void reload(), 2000);
    void voiceHealth().then((h) => setVoiceOk(h.ok));
    return () => {
      reloadRequests.unmount();
      digestRequests.unmount();
      seatReportRequests.unmount();
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
      claimed: snap.claimed,
      runs: snap.runs,
      sessions: snap.sessions,
      agentStates: snap.agentStates,
      models: snap.models,
      businessIdeaRel: snap.businessIdeaRel,
    };
  }, [snap]);

  const selectedWork = useMemo(() => {
    if (!snap || !selectedSlug) return undefined;
    return seatWorkContext(selectedSlug, {
      handoffs: snap.handoffs,
      runs: snap.runs,
      sessions: snap.sessions,
      claimedFiles: snap.claimed,
      queueFiles: snap.queue,
      agentStates: snap.agentStates,
    });
  }, [snap, selectedSlug]);

  const setBeam = jarvisStore.setBeam;

  useEffect(() => {
    if (!selectedSlug) {
      seatReportSequence.current.begin();
      setSeatReport(null);
      setConsoleLoading(false);
      return;
    }
    const request = seatReportSequence.current.beginIfMounted();
    if (request == null) return;
    setConsoleLoading(true);
    setSeatReport(null);
    void fetchSeatReport(selectedSlug)
      .then((r) => {
        if (seatReportSequence.current.isCurrent(request)) setSeatReport(r);
      })
      .catch((e) => {
        if (seatReportSequence.current.isCurrent(request)) {
          setActionError(e instanceof Error ? e.message : String(e));
        }
      })
      .finally(() => {
        if (seatReportSequence.current.isCurrent(request)) setConsoleLoading(false);
      });
  }, [selectedSlug, snap?.bump]);

  useEffect(() => {
    if (!snap) return;
    void reloadDigest().catch(() => undefined);
  }, [reloadDigest, snap]);

  async function onResolveBlocker(slug: string) {
    setResolvingSlug(slug);
    setActionError(null);
    try {
      const result = await resolveBlocker(slug);
      if (result.status === "needs_confirm") {
        if (!result.token) throw new Error("Resolve confirmation token missing");
        setConfirmationCancellationError(null);
        setBlockerConfirmation({
          seat: slug,
          token: result.token,
          summary: result.summary,
          reason: result.reason,
        });
        return;
      }
      if (result.status === "denied" || result.status === "error") {
        throw new Error(result.reason || result.summary || "Resolve failed");
      }
      setBeam(true);
      await reload();
      await reloadDigest();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : String(e));
    } finally {
      setResolvingSlug(null);
    }
  }

  async function onCancelBlockerConfirmation(token: string) {
    const request = blockerConfirmation;
    if (
      !request ||
      request.token !== token ||
      cancellationRequests.current.has(token)
    ) {
      return;
    }
    cancellationRequests.current.add(token);
    setCancellingConfirmationToken(token);
    setConfirmationCancellationError(null);
    try {
      const result = await postJarvisConfirm({
        roomId: "default",
        token,
        accept: false,
      });
      if (result.status !== "denied") {
        throw new Error(
          result.reason || result.summary || "Server did not cancel confirmation",
        );
      }
      setBlockerConfirmation((current) =>
        current?.token === token ? null : current,
      );
    } catch (error) {
      setConfirmationCancellationError(
        `Unable to cancel confirmation: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    } finally {
      cancellationRequests.current.delete(token);
      setCancellingConfirmationToken((current) =>
        current === token ? null : current,
      );
    }
  }

  async function onConfirmBlocker(token: string) {
    const request = blockerConfirmation;
    if (
      !request ||
      request.token !== token ||
      cancellationRequests.current.has(token)
    ) {
      return;
    }
    setResolvingSlug(request.seat);
    setActionError(null);
    setConfirmationCancellationError(null);
    try {
      const result =
        request.intent === "seat.answer"
          ? await answerSeatQuestions(
              request.seat,
              request.answers ?? {},
              token,
            )
          : await resolveBlocker(request.seat, token);
      if (result.status === "needs_confirm") {
        if (!result.token) throw new Error("Resolve confirmation token missing");
        setConfirmationCancellationError(null);
        setBlockerConfirmation({
          seat: request.seat,
          token: result.token,
          summary: result.summary,
          reason: result.reason,
          intent: request.intent,
          answers: request.answers,
        });
        return;
      }
      if (result.status === "denied" || result.status === "error") {
        throw new Error(result.reason || result.summary || "Resolve failed");
      }
      setBlockerConfirmation(null);
      if (request.intent === "seat.answer") {
        setAnswerStatus(`Continuing ${request.seat}…`);
        setReportAnswers({});
      }
      setBeam(true);
      await reload();
      await reloadDigest();
      if (request.intent === "seat.answer") void openReport(request.seat);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : String(e));
    } finally {
      setResolvingSlug(null);
    }
  }

  async function onBriefMe(mode: "mission" | "seat" | "digest" = "mission") {
    const text = await fetchBriefScript(
      mode,
      mode === "seat" ? selectedSlug || "ceo-strategist" : undefined,
    );
    await speakText(text);
  }

  useEffect(() => {
    if (!seatReport) {
      setReportAnswers({});
      return;
    }
    const next: Record<string, string> = {};
    for (const q of seatReport.businessBrief.needsFromYou) next[q] = "";
    setReportAnswers(next);
  }, [seatReport?.slug, seatReport?.businessBrief.needsFromYou.join("\u0001")]);

  useEffect(() => {
    if (drawer !== "report" || !reportFocusQuestions) return;
    questionsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [drawer, reportFocusQuestions, seatReport?.slug]);

  async function submitSeatAnswers(confirmToken?: string) {
    if (!seatReport) return;
    const answers = Object.fromEntries(
      Object.entries(reportAnswers).filter(([, v]) => v.trim().length > 0),
    );
    if (Object.keys(answers).length === 0) {
      setActionError("Answer at least one open question before continuing.");
      return;
    }
    setAnsweringSeat(true);
    setActionError(null);
    setAnswerStatus(null);
    try {
      const result = await answerSeatQuestions(seatReport.slug, answers, confirmToken);
      if (result.status === "needs_confirm") {
        if (!result.token) throw new Error("Answer confirmation token missing");
        setConfirmationCancellationError(null);
        setBlockerConfirmation({
          seat: seatReport.slug,
          token: result.token,
          summary: result.summary,
          reason: result.reason,
          intent: "seat.answer",
          answers,
        });
        return;
      }
      if (result.status !== "ok") {
        throw new Error(result.reason || result.summary || "Could not continue seat");
      }
      setAnswerStatus(`Continuing ${seatReport.title}…`);
      setReportAnswers({});
      void reload();
      void openReport(seatReport.slug);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : String(e));
    } finally {
      setAnsweringSeat(false);
    }
  }

  async function openDigest() {
    setDrawer("digest");
    setDigest(null);
    try {
      await reloadDigest();
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
      case "rewake": {
        const dispatchFilename = resolveRewakeDispatchFilename(snap, a, selectedSlug);
        if (!dispatchFilename) {
          setActionError("No session to rewake for this action");
          break;
        }
        await onRewake(dispatchFilename);
        break;
      }
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

  function onSetTheater(nextVisible: boolean) {
    const next = setTheaterVisible({ theater: showMap, opsTables: opsMode }, nextVisible);
    setShowMap(next.theater);
    setOpsMode(next.opsTables);
  }

  function onSetOpsTables(nextVisible: boolean) {
    const next = setOpsVisible({ theater: showMap, opsTables: opsMode }, nextVisible);
    setShowMap(next.theater);
    setOpsMode(next.opsTables);
  }

  async function sendChat(message: string, origin: "typed" | "speech" = "typed"): Promise<boolean> {
    if (chatSendingRef.current) return false;
    chatSendingRef.current = true;
    const history = chatLog.slice(-8);
    setChatLog((l) => [...l, { role: "user", content: message }]);
    setChatSending(true);
    setChatError(null);
    try {
      const res = await voiceChat(message, history);
      setChatLog((l) => [...l, { role: "assistant", content: res.text || "(tool actions)" }]);
      for (const ev of res.uiEvents) {
        if (ev.slug) selectStoreSlug(String(ev.slug));
        if (ev.mode === "assign") setDrawer("assign");
        if (ev.mode === "outputs") setDrawer("outputs");
      }
      for (const tr of res.toolResults) {
        if (tr.name === "queue_dispatch" && autoSpawn) void onSpawn({ wakeReason: "auto_queue" });
      }
      if (res.text) await speakText(res.text);
      setFailedChatMessage(null);
      void reload();
      return true;
    } catch (e) {
      setChatError(e instanceof Error ? e.message : String(e));
      setFailedChatMessage(message);
      setChatInput((current) => failedChatDraft(current, message, origin));
      return false;
    } finally {
      chatSendingRef.current = false;
      setChatSending(false);
    }
  }

  async function submitChatDraft() {
    const message = chatInput.trim();
    if (!message || chatSendingRef.current) return;
    const succeeded = await sendChat(message);
    setChatInput((current) => current === message ? nextChatDraft(current, succeeded) : current);
  }

  async function retryFailedChat() {
    const message = retryChatMessage(chatInput, failedChatMessage);
    if (!message || chatSendingRef.current) return;
    const succeeded = await sendChat(message, "typed");
    if (succeeded) setChatInput((current) => current === message ? "" : current);
  }

  function startListen() {
    if (chatSendingRef.current) return;
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
      if (text && !chatSendingRef.current) void sendChat(text, "speech");
    };
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }

  if (!snap) {
    return (
      <div data-theme="jarvis" className="j-shell j-loading-shell" aria-busy={!error}>
        <div className="j-hud-panel j-loading-header">
          <span className="j-skeleton j-skeleton-title" />
          <span className="j-skeleton j-skeleton-line" />
          <span className="j-skeleton j-skeleton-line" />
        </div>
        <div className="j-theater-stage j-loading-stage">
          <span className="j-skeleton j-skeleton-orb" />
          <p className="j-muted">Initializing Situation Room</p>
        </div>
        {error && <p className="j-error">{error}</p>}
      </div>
    );
  }

  const m = snap.mission;

  return (
    <div
      data-theme="jarvis"
      className="j-shell j-situation-shell"
    >
      <JarvisFocusListener onFocus={onJarvisFocus} />
      {/* Mission strip */}
      <header
        className="j-hud-panel j-hud-grid j-mission-header"
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
                className="j-select"
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
                  className="j-input"
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
                  className="j-input"
                  placeholder="solar-lantern"
                  value={newVentureSlug}
                  onChange={(e) => setNewVentureSlug(e.target.value)}
                />
                <label className="j-muted" style={{ fontSize: 12 }} htmlFor="sr-new-context">
                  Business context (optional)
                </label>
                <Textarea
                  id="sr-new-context"
                  className="j-textarea"
                  placeholder="Operator notes for agents — market, constraints, priorities…"
                  rows={3}
                  value={newVentureContext}
                  onChange={(e) => setNewVentureContext(e.target.value)}
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
                      setNewVentureContext("");
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
              Threats {digest?.blockedSeats.length ?? m.blockerCount}
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
            <MissionCommandControls
              showTheater={showMap}
              opsMode={opsMode}
              alertCount={(snap.alerts ?? []).filter((a) => !a.acked).length}
              refreshing={refreshing}
              lastUpdated={lastUpdated}
              onTalk={requestTalkConnect}
              onBriefMission={() => void onBriefMe("mission")}
              onBriefSeat={() => void onBriefMe("seat")}
              onBriefDigest={() => void onBriefMe("digest")}
              onAssign={() => setDrawer("assign")}
              onOutputs={() => setDrawer("outputs")}
              onLegacyVoice={() => setDrawer("chat")}
              onRunNext={() => void onSpawn({ wakeReason: "run_next" })}
              onRuns={() => setDrawer("run")}
              onDigest={() => void openDigest()}
              onAlerts={() => setDrawer("alerts")}
              onRoutines={() => setDrawer("routines")}
              onToggleTheater={onSetTheater}
              onToggleOps={onSetOpsTables}
              onRefresh={() => void reload(true)}
            />
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
        </div>
      </header>

      {error && (
        <p className="j-glass j-error" style={{ padding: 10, margin: 0 }}>
          {error}
        </p>
      )}

      <div className={showMap ? "j-command-launch" : undefined}>
        <CommandDeck
          roster={snap.org.roster}
          tasks={snap.tasks}
          runs={snap.runs ?? []}
          showTrigger={showMap}
          onSelectSeat={(slug) => {
            selectStoreSlug(slug);
          }}
          onSelectRun={(runId) => {
            setSelectedRunId(runId);
            setDrawer("run");
          }}
          onSelectTaskContext={(task) => {
            if (task.phase) jarvisStore.selectPhase(task.phase);
          }}
        />
      </div>

      <div
        className="j-workspace-stack"
        style={{
          display: "grid",
          gridTemplateRows: opsMode
            ? showMap
              ? "minmax(0, 1fr) minmax(200px, 280px)"
              : "minmax(0, 1fr)"
            : "minmax(0, 1fr)",
          minHeight: 0,
          height: "100%",
          gap: 10,
        }}
      >
        {showMap && legacySnap ? (
          <div className="j-theater-stage">
            <div className="j-map" style={{ position: "absolute", inset: 0 }}>
              <OrgTheater snapshot={legacySnap as never} />
            </div>

            <div
              className="j-overlay-stack j-stage-overlay-left"
            >
              <ThreatRail
                blocked={digest?.blockedSeats ?? []}
                selectedSlug={selectedSlug}
                resolvingSlug={resolvingSlug}
                onSelect={(slug) => {
                  selectStoreSlug(slug);
                }}
                onResolve={(slug) => void onResolveBlocker(slug)}
                onAnswer={(slug) => void openReport(slug, { focusQuestions: true })}
              />
              <aside
                className="j-hud-panel j-hud-grid"
                style={{ padding: 10, maxHeight: 220, overflow: "auto" }}
              >
                <p className="j-title">C-Suite</p>
                <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
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
                        onOpen={() => selectStoreSlug(card.slug)}
                        onReport={() => void openReport(card.slug)}
                        onAnswer={() =>
                          void openReport(card.slug, { focusQuestions: true })
                        }
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
              </aside>
            </div>

            <div
              className="j-overlay-stack j-stage-overlay-right"
            >
              <SeatConsole
                report={seatReport}
                work={selectedWork}
                loading={consoleLoading}
                resolving={resolvingSlug === selectedSlug}
                onClose={() => {
                  selectStoreSlug(null);
                  setSeatReport(null);
                }}
                onResolveBlocker={(slug) => void onResolveBlocker(slug)}
                onAnswerQuestions={(slug) =>
                  void openReport(slug, { focusQuestions: true })
                }
                onOpenArtifact={(path) => {
                  setArtifact(path);
                  setDrawer("outputs");
                }}
              />
            </div>

            <div
              className="j-overlay-stack j-stage-overlay-bottom"
              style={{
                left: 12,
                right: 12,
                bottom: 12,
                maxHeight: 88,
                width: "auto",
              }}
            >
              <section
                className="j-hud-panel j-hud-grid"
                style={{ padding: "8px 12px", margin: 0 }}
              >
                <p className="j-title" style={{ marginBottom: 4 }}>
                  Activity
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    maxHeight: 52,
                    overflow: "auto",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {(snap.activity ?? []).slice(0, 10).map((ev, i) => (
                    <li key={`${ev.at}-${ev.type}-${i}`} style={{ fontSize: 11 }}>
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
            </div>
          </div>
        ) : null}

        {opsMode && (
          <div
            className="j-ops-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 1fr) minmax(240px, 1.1fr) minmax(220px, 0.9fr)",
              gap: 12,
              minHeight: showMap ? 220 : 0,
              maxHeight: showMap ? 280 : "100%",
              height: showMap ? undefined : "100%",
            }}
          >
            <section className="j-hud-panel j-panel-scroll" style={{ padding: 12 }}>
              <p className="j-title">C-Suite</p>
              <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                {snap.csuite.map((card) => (
                  <div key={`ops-${card.slug}`}>
                    <CSuiteCardView
                      card={card}
                      selected={selectedSlug === card.slug}
                      jarvisFocused={jarvisFocus?.slug === card.slug}
                      paused={Boolean(snap.agentStates?.[card.slug]?.paused)}
                      onOpen={() => selectStoreSlug(card.slug)}
                      onReport={() => void openReport(card.slug)}
                      onAnswer={() =>
                        void openReport(card.slug, { focusQuestions: true })
                      }
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
            <section className="j-hud-panel j-panel-scroll" style={{ padding: 14 }}>
              <p className="j-title">Drill-down</p>
              {!selected && (
                <p className="j-muted" style={{ marginTop: 12 }}>
                  Select a seat on the theater or C-suite list.
                </p>
              )}
              {selected?.seat && (
                <div style={{ marginTop: 10 }}>
                  <h2 className="j-heading" style={{ fontSize: 18 }}>
                    {selected.seat.title}
                  </h2>
                  <p className="j-mono j-muted">
                    {selected.seat.slug} · {selectedWork?.status || "idle"}
                    {selectedWork?.phase ? ` · P${selectedWork.phase}` : ""}
                  </p>
                  <button
                    type="button"
                    className="j-btn"
                    data-active="true"
                    style={{ marginTop: 8 }}
                    onClick={() => void openReport(selected.seat!.slug)}
                  >
                    Full report
                  </button>
                </div>
              )}
            </section>
            <section className="j-hud-panel j-panel-scroll" style={{ padding: 12 }}>
              <p className="j-title">Live tasks</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0" }}>
                {snap.tasks.filter((t) => t.status !== "done").length === 0 && (
                  <li className="j-muted">No live tasks — Assign work or Run next.</li>
                )}
                {snap.tasks
                  .filter((t) => t.status !== "done")
                  .slice(0, 24)
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
                            onClick={() => selectStoreSlug(t.slug!)}
                          >
                            Focus
                          </button>
                        )}
                        {t.canPlay && t.dispatchFilename && (
                          <button
                            type="button"
                            className="j-btn"
                            data-active="true"
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
                      </div>
                    </li>
                  ))}
              </ul>
            </section>
          </div>
        )}
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
            <div style={{ display: "grid", gap: 14, maxWidth: 560 }}>
              <p className="j-muted" style={{ fontSize: 11 }}>
                {seatReport.pulse}
                {" · "}
                Last activity: {seatReport.lastActivityAt || "—"}
                {seatReport.hardGate ? " · hard gate" : ""}
                {seatReport.briefSource === "grok"
                  ? " · rewritten for clarity (Grok)"
                  : ""}
              </p>
              {answerStatus ? <p className="j-chip" data-tone="ok">{answerStatus}</p> : null}

              <section>
                <p className="j-title">What happened</p>
                {seatReport.businessBrief.whatHappened.length === 0 ? (
                  <p className="j-muted">
                    No plain-language brief yet. Re-run this seat or wait for its next
                    deliverable.
                  </p>
                ) : (
                  <ul style={{ margin: "6px 0 0", paddingLeft: 18, lineHeight: 1.45 }}>
                    {seatReport.businessBrief.whatHappened.map((line) => (
                      <li key={line} style={{ marginBottom: 4 }}>
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <p className="j-title">Why it matters</p>
                {seatReport.businessBrief.whyItMatters.length === 0 ? (
                  <p className="j-muted">No separate findings yet.</p>
                ) : (
                  <ul style={{ margin: "6px 0 0", paddingLeft: 18, lineHeight: 1.45 }}>
                    {seatReport.businessBrief.whyItMatters.map((line) => (
                      <li key={line} style={{ marginBottom: 4 }}>
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <p className="j-title">Next steps</p>
                {seatReport.businessBrief.nextSteps.length === 0 ? (
                  <p className="j-muted">No next steps in the latest brief.</p>
                ) : (
                  <ol style={{ margin: "6px 0 0", paddingLeft: 18, lineHeight: 1.45 }}>
                    {seatReport.businessBrief.nextSteps.map((line) => (
                      <li key={line} style={{ marginBottom: 4 }}>
                        {line}
                      </li>
                    ))}
                  </ol>
                )}
              </section>

              <section ref={questionsSectionRef}>
                <p className="j-title">What we need from you</p>
                {seatReport.businessBrief.needsFromYou.length === 0 ? (
                  <p className="j-muted">Nothing blocking — work can continue without input.</p>
                ) : (
                  <form
                    style={{ display: "grid", gap: 10, marginTop: 8 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      void submitSeatAnswers();
                    }}
                  >
                    {seatReport.businessBrief.needsFromYou.map((q) => (
                      <label key={q} style={{ display: "grid", gap: 4 }}>
                        <span style={{ fontSize: 13 }}>{q}</span>
                        <Textarea
                          rows={2}
                          value={reportAnswers[q] ?? ""}
                          onChange={(ev) =>
                            setReportAnswers((prev) => ({ ...prev, [q]: ev.target.value }))
                          }
                          placeholder="Your answer…"
                        />
                      </label>
                    ))}
                    <Button type="submit" disabled={answeringSeat || resolvingSlug === seatReport.slug}>
                      {answeringSeat || resolvingSlug === seatReport.slug
                        ? "Continuing…"
                        : "Submit answers & continue"}
                    </Button>
                  </form>
                )}
              </section>

              {seatReport.businessBrief.whatsStuck.length > 0 && (
                <section>
                  <p className="j-title">What&apos;s stuck</p>
                  <ul style={{ margin: "6px 0 0", paddingLeft: 18, lineHeight: 1.45 }}>
                    {seatReport.businessBrief.whatsStuck.map((line) => (
                      <li key={line} style={{ marginBottom: 4 }}>
                        {line}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {seatReport.reportRollups.length > 0 && (
                <section>
                  <p className="j-title">Reports</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0" }}>
                    {seatReport.reportRollups.map((r) => (
                      <li key={r.slug} style={{ marginBottom: 8 }}>
                        <button
                          type="button"
                          className="j-btn"
                          style={{ width: "100%", textAlign: "left" }}
                          onClick={() =>
                            void openReport(r.slug, {
                              focusQuestions: r.openQuestionCount > 0,
                            })
                          }
                        >
                          <strong>{r.title}</strong> · {r.status}
                          {r.openQuestionCount > 0
                            ? ` · ${r.openQuestionCount} question${r.openQuestionCount === 1 ? "" : "s"}`
                            : ""}
                          <div className="j-muted" style={{ marginTop: 4, fontSize: 12 }}>
                            {r.plainEnglish || "No plain-English brief yet."}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <details
                open={reportOpsOpen}
                onToggle={(e) => setReportOpsOpen((e.target as HTMLDetailsElement).open)}
              >
                <summary className="j-title" style={{ cursor: "pointer" }}>
                  Ops
                </summary>
                <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
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
                          <li
                            key={a.id}
                            className="j-chip"
                            style={{ display: "block", marginTop: 4 }}
                          >
                            {a.label}
                          </li>
                        ))}
                    </ul>
                  </div>
                  {seatReport.escalations.length > 0 && (
                    <div>
                      <p className="j-title">Escalations</p>
                      {seatReport.escalations.map((e, i) => (
                        <div
                          key={`${e.phase}-${i}`}
                          className="j-chip"
                          style={{ display: "block", marginTop: 4 }}
                        >
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
                          style={{
                            display: "block",
                            marginTop: 4,
                            width: "100%",
                            textAlign: "left",
                          }}
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
                            ...seatReport.nextActions.map(
                              (a) => `- [${a.actor}] ${a.label}`,
                            ),
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
              </details>
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
                  <div key={b.slug} style={{ marginTop: 6 }}>
                    <button
                      type="button"
                      className="j-btn"
                      style={{ display: "block", width: "100%", textAlign: "left" }}
                      onClick={() => {
                        selectStoreSlug(b.slug);
                        setDrawer(null);
                      }}
                    >
                      {b.slug} · P{b.phase}: {b.reason}
                    </button>
                    <button
                      type="button"
                      className="j-btn"
                      data-active="true"
                      style={{ marginTop: 4 }}
                      disabled={resolvingSlug === b.slug}
                      onClick={() =>
                        b.status === "needs_input"
                          ? void openReport(b.slug, { focusQuestions: true })
                          : void onResolveBlocker(b.slug)
                      }
                    >
                      {resolvingSlug === b.slug
                        ? "Resolving…"
                        : b.status === "needs_input"
                          ? "ANSWER"
                          : "RESOLVE"}
                    </button>
                  </div>
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
                disabled={chatSending}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type or use mic…"
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submitChatDraft();
                }}
              />
              <button
                type="button"
                className="j-btn"
                data-active="true"
                disabled={chatSending}
                onClick={() => {
                  void submitChatDraft();
                }}
              >
                {chatSending ? "Sending…" : "Send"}
              </button>
              <button
                type="button"
                className="j-btn"
                data-active={listening}
                disabled={chatSending}
                onClick={() => startListen()}
              >
                Mic
              </button>
            </div>
            {chatError && (
              <div className="j-error" role="alert">
                {chatError}{" "}
                <button type="button" className="j-btn" disabled={chatSending || !retryChatMessage(chatInput, failedChatMessage)} onClick={() => void retryFailedChat()}>
                  Retry
                </button>
              </div>
            )}
          </div>
        </Drawer>
      )}

      <BlockerConfirmationDialog
        request={blockerConfirmation}
        loading={resolvingSlug === blockerConfirmation?.seat}
        cancelling={
          cancellingConfirmationToken === blockerConfirmation?.token
        }
        cancellationError={confirmationCancellationError}
        onCancel={(token) => void onCancelBlockerConfirmation(token)}
        onConfirm={(token) => void onConfirmBlocker(token)}
      />
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
    status === "running" ||
    status === "needs_input"
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
  onAnswer,
  onTogglePause,
}: {
  card: CSuiteCard;
  selected: boolean;
  jarvisFocused?: boolean;
  paused: boolean;
  onOpen: () => void;
  onReport: () => void;
  onAnswer?: () => void;
  onTogglePause: () => void;
}) {
  const needsAnswers = Boolean(card.needsAnswers) || card.pulse === "needs_input";
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span className="j-chip" data-tone={toneFor(card.pulse)}>
            {card.pulse}
          </span>
          {needsAnswers ? (
            <button
              type="button"
              className="j-chip"
              data-tone="warn"
              onClick={onAnswer ?? onReport}
              style={{ cursor: "pointer", border: "none" }}
            >
              Needs answers
            </button>
          ) : null}
        </div>
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
    <div className="j-run-grid" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 12 }}>
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
    <JarvisDrawer
      open
      title={title}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {children}
    </JarvisDrawer>
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
