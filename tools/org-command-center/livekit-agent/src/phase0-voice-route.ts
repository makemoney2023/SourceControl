import { llm, type pipeline } from "@livekit/agents";
import {
  applyModeFromActResult,
  type ModeState,
} from "./modes.js";
import {
  sanitizeForSpeech,
  summarizeJarvisSpeech,
  type OccClient,
} from "./occ-client.js";
import { sanitizeSttUtterance } from "./stt-sanitize.js";

function normalizeUtterance(text: string): string {
  return String(text ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function looksLikeConfirmYes(text: string): boolean {
  const t = normalizeUtterance(text);
  if (!t) return false;
  // Long asks ("yes go ahead and do all of them") are not confirms.
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length > 5) return false;
  if (/\b(all of them|next steps?|findings?|result|summary|restart|phase)\b/.test(t)) {
    return false;
  }
  if (
    /^(yes|yeah|yep|yup|confirm|confirmed|ok|okay|sure|go|do it|proceed|affirmative|execute)( please)?$/.test(
      t,
    )
  ) {
    return true;
  }
  if (/^go ahead$/.test(t)) return true;
  if (/^(yes|yeah|yep|yup|ok|okay|sure)\b.*(confirm|go ahead|do it|proceed)\b/.test(t)) {
    return true;
  }
  return false;
}

export function looksLikeConfirmNo(text: string): boolean {
  const t = normalizeUtterance(text);
  if (!t) return false;
  return /^(no|nope|nah|cancel|stop|don't|do not|never mind|nevermind)$/.test(t);
}

export function lastUserUtterance(chatCtx: llm.ChatContext): string {
  for (let i = chatCtx.messages.length - 1; i >= 0; i--) {
    const msg = chatCtx.messages[i];
    if (msg.role !== llm.ChatRole.USER) continue;
    const content = msg.content;
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content.filter((c): c is string => typeof c === "string").join(" ");
    }
  }
  return "";
}

/** Rewrite last user message so Ollama never sees Whisper loops. */
export function rewriteLastUserUtterance(
  chatCtx: llm.ChatContext,
  text: string,
): void {
  for (let i = chatCtx.messages.length - 1; i >= 0; i--) {
    const msg = chatCtx.messages[i];
    if (msg.role !== llm.ChatRole.USER) continue;
    msg.content = text;
    return;
  }
}

/** Returning false from beforeLLM cancels the turn without clearing this — must reset. */
function releasePipelineTurn(agent: pipeline.VoicePipelineAgent) {
  agent.transcribedText = "";
}

function speakToolResult(
  agent: pipeline.VoicePipelineAgent,
  speech: string,
  fallback: string,
  allowInterruptions = false,
) {
  const text = sanitizeForSpeech(speech || fallback);
  console.info("[jarvis] hard-route say:", text);
  releasePipelineTurn(agent);
  // CRITICAL: never await say() inside beforeLLMCallback.
  setTimeout(() => {
    void agent
      .say(text, allowInterruptions, false)
      .then(() => console.info("[jarvis] hard-route say enqueued"))
      .catch((err: unknown) => console.error("[jarvis] hard-route say failed:", err));
  }, 0);
}

function needsConfirmEnvelope(workRes: unknown): boolean {
  if (!workRes || typeof workRes !== "object") return false;
  const r = workRes as { status?: string; summary?: string };
  if (r.status === "needs_confirm") return true;
  return /confirm\?/i.test(String(r.summary ?? ""));
}

function withConfirmCue(speech: string): string {
  const base = speech.trim().replace(/\s+/g, " ");
  if (/say (yes|confirm)/i.test(base)) return base;
  return `${base.replace(/\?*$/, "")}? Say confirm.`;
}

export type BrainRouteDispatch = {
  intent: string;
  clarifyQuestion?: string;
  spokenHint?: string;
  spoken?: string;
  confidence?: number;
};

function clipStatusSpeech(speech: string): string {
  let s = speech.split(/\.\s*Context note/i)[0]?.trim() || speech;
  const sentences = s.split(/(?<=[.!?])\s+/).filter(Boolean);
  s = sentences.slice(0, 3).join(" ");
  if (s.length > 320) s = `${s.slice(0, 317).trimEnd()}…`;
  return s;
}

async function speakMissionStatus(
  agent: pipeline.VoicePipelineAgent,
  occ: OccClient,
  modeState: ModeState,
  roomId: string,
  hint?: string,
) {
  const ctx = (await occ.jarvisContext()) as { spokenBrief?: string };
  let speech = (ctx.spokenBrief || "").trim();
  if (!speech || /no mission brief/i.test(speech)) {
    const watch = await occ.jarvisAct({
      intent: "runs.watch",
      args: { limit: 8 },
      mode: modeState.getMode(),
      roomId,
    });
    speech = summarizeJarvisSpeech(watch);
  }
  speech = clipStatusSpeech(speech);
  if (hint?.trim()) {
    speech = `${clipStatusSpeech(hint)} ${speech}`.trim();
  }
  speakToolResult(agent, speech, "No status available.");
}

/**
 * Execute a brain.route classification with OCC tools.
 * Returns false for spawn/other so the LiveKit LLM can continue.
 */
export async function executeBrainRouteIntent(opts: {
  agent: pipeline.VoicePipelineAgent;
  occ: OccClient;
  modeState: ModeState;
  roomId: string;
  route: BrainRouteDispatch;
  onConfirmPending?: (pending: boolean) => void;
}): Promise<boolean> {
  const intent = String(opts.route.intent || "other").trim();
  console.info("[jarvis] brain.route dispatch:", intent, {
    confidence: opts.route.confidence,
  });

  if (intent === "clarify") {
    const q =
      opts.route.clarifyQuestion?.trim() ||
      opts.route.spoken?.trim() ||
      "What should we do next?";
    speakToolResult(opts.agent, q, "What should we do next?");
    return true;
  }

  if (intent === "status") {
    await speakMissionStatus(
      opts.agent,
      opts.occ,
      opts.modeState,
      opts.roomId,
      opts.route.spokenHint,
    );
    return true;
  }

  if (intent === "blockers") {
    const res = await opts.occ.jarvisAct({
      intent: "blocker.list",
      args: {},
      mode: opts.modeState.getMode(),
      roomId: opts.roomId,
    });
    speakToolResult(opts.agent, summarizeJarvisSpeech(res), "No blockers listed.");
    return true;
  }

  if (intent === "proceed") {
    const modeRes = await opts.occ.jarvisAct({
      intent: "mode.set",
      args: { mode: "ops" },
      mode: opts.modeState.getMode(),
      roomId: opts.roomId,
    });
    applyModeFromActResult(opts.modeState, modeRes);

    const workRes = await opts.occ.jarvisAct({
      intent: "work.request",
      args: {
        position: "ceo-strategist",
        phase: "1",
        goal:
          "Phase 1 problem framing — second differentiator beyond fresh+cold; note operator still owes geography/events before any sale",
      },
      mode: opts.modeState.getMode(),
      roomId: opts.roomId,
    });
    let speech =
      summarizeJarvisSpeech(workRes) ||
      "Start Phase 1 framing with the CEO. Confirm?";
    if (needsConfirmEnvelope(workRes) || /confirm\?/i.test(speech)) {
      opts.onConfirmPending?.(true);
      speech = withConfirmCue(speech);
    }
    // Interruptible so short "yes"/"confirm" can barge in.
    speakToolResult(
      opts.agent,
      speech,
      "Start Phase 1 framing with the CEO. Confirm? Say confirm.",
      true,
    );
    return true;
  }

  if (intent === "phase0_restart") {
    const modeRes = await opts.occ.jarvisAct({
      intent: "mode.set",
      args: { mode: "ops" },
      mode: opts.modeState.getMode(),
      roomId: opts.roomId,
    });
    applyModeFromActResult(opts.modeState, modeRes);

    const workRes = await opts.occ.jarvisAct({
      intent: "work.request",
      args: {
        position: "ceo-strategist",
        phase: "0",
        goal: "Phase 0 Intake — C-suite roundtable",
      },
      mode: opts.modeState.getMode(),
      roomId: opts.roomId,
    });
    let speech =
      summarizeJarvisSpeech(workRes) ||
      "Start Phase 0 C-suite roundtable. Confirm?";
    if (needsConfirmEnvelope(workRes) || /confirm\?/i.test(speech)) {
      opts.onConfirmPending?.(true);
      speech = withConfirmCue(speech);
    }
    speakToolResult(
      opts.agent,
      speech,
      "Start Phase 0 C-suite roundtable. Confirm? Say confirm.",
      true,
    );
    return true;
  }

  // spawn / other → let Ollama tool loop handle
  return false;
}

function routeFromActResponse(res: unknown): BrainRouteDispatch | null {
  if (!res || typeof res !== "object") return null;
  const envelope = res as { status?: string; result?: unknown };
  if (envelope.status !== "ok") return null;
  const result = envelope.result;
  if (!result || typeof result !== "object") return null;
  const r = result as BrainRouteDispatch;
  if (!r.intent) return null;
  return r;
}

/**
 * Confirm? safety + Cursor Grok brain.route — bypasses Ollama for most turns.
 */
export async function maybeHandlePhase0VoiceRoute(opts: {
  agent: pipeline.VoicePipelineAgent;
  chatCtx: llm.ChatContext;
  occ: OccClient;
  modeState: ModeState;
  roomId: string;
  confirmPending?: boolean;
  onConfirmPending?: (pending: boolean) => void;
}): Promise<boolean> {
  const rawHeard = lastUserUtterance(opts.chatCtx);
  const stt = sanitizeSttUtterance(rawHeard);
  if (stt.rejected) {
    console.info("[jarvis] STT rejected:", stt.reason, rawHeard.slice(0, 80));
    releasePipelineTurn(opts.agent);
    speakToolResult(opts.agent, "I didn't catch that — say it again.", "I didn't catch that.");
    return true;
  }
  const heard = stt.text;
  if (stt.reason === "trimmed_loop" || heard !== rawHeard.trim()) {
    console.info("[jarvis] STT sanitized:", stt.reason, {
      from: rawHeard.slice(0, 80),
      to: heard.slice(0, 80),
    });
    rewriteLastUserUtterance(opts.chatCtx, heard);
  }
  console.info("[jarvis] beforeLLM heard:", heard || "(empty)");
  if (!heard.trim()) return false;

  if (looksLikeConfirmYes(heard)) {
    if (!opts.confirmPending) {
      console.info("[jarvis] skip confirm yes — nothing pending:", heard);
      return false;
    }
    console.info("[jarvis] hard-route confirm yes from:", heard);
    const res = await opts.occ.jarvisConfirm({
      roomId: opts.roomId,
      token: "",
      accept: true,
    });
    opts.onConfirmPending?.(false);
    const speech = summarizeJarvisSpeech(res) || "Started.";
    if (/nothing pending|already confirmed|expired/i.test(speech)) {
      speakToolResult(opts.agent, "Nothing pending to confirm.", "Nothing pending to confirm.");
      return true;
    }
    speakToolResult(opts.agent, speech, "Started.");
    return true;
  }

  if (looksLikeConfirmNo(heard)) {
    if (!opts.confirmPending) {
      console.info("[jarvis] skip confirm no — nothing pending:", heard);
      return false;
    }
    console.info("[jarvis] hard-route confirm no from:", heard);
    const res = await opts.occ.jarvisConfirm({
      roomId: opts.roomId,
      token: "",
      accept: false,
    });
    opts.onConfirmPending?.(false);
    speakToolResult(opts.agent, summarizeJarvisSpeech(res), "Cancelled.");
    return true;
  }

  // Cursor Grok intent route
  let brief = "";
  try {
    const ctx = (await opts.occ.jarvisContext()) as { spokenBrief?: string };
    brief = (ctx.spokenBrief || "").trim().slice(0, 400);
  } catch {
    // OCC brief optional for routing
  }

  const started = Date.now();
  let fillerTimer: ReturnType<typeof setTimeout> | undefined;
  fillerTimer = setTimeout(() => {
    void opts.agent
      .say(sanitizeForSpeech("One sec."), true, false)
      .catch(() => {
        /* best-effort filler */
      });
  }, 1500);

  try {
    const routeRes = await opts.occ.jarvisAct({
      intent: "brain.route",
      args: { utterance: heard, spokenBrief: brief },
      mode: opts.modeState.getMode(),
      roomId: opts.roomId,
    });
    clearTimeout(fillerTimer);
    const latencyMs = Date.now() - started;
    const route = routeFromActResponse(routeRes);
    if (!route) {
      console.info("[jarvis] brain.route failed envelope — status fallback", {
        latencyMs,
        speech: summarizeJarvisSpeech(routeRes).slice(0, 120),
      });
      await speakMissionStatus(opts.agent, opts.occ, opts.modeState, opts.roomId);
      return true;
    }
    console.info("[jarvis] brain.route ok", {
      intent: route.intent,
      confidence: route.confidence,
      latencyMs,
    });
    const handled = await executeBrainRouteIntent({
      agent: opts.agent,
      occ: opts.occ,
      modeState: opts.modeState,
      roomId: opts.roomId,
      route,
      onConfirmPending: opts.onConfirmPending,
    });
    if (handled) return true;
    // other/spawn — fall through to Ollama
    return false;
  } catch (err) {
    clearTimeout(fillerTimer);
    console.error(
      "[jarvis] brain.route error — status fallback:",
      err instanceof Error ? err.message : err,
    );
    await speakMissionStatus(opts.agent, opts.occ, opts.modeState, opts.roomId);
    return true;
  }
}
