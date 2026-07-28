import {
  type JobContext,
  type JobProcess,
  defineAgent,
  llm,
  pipeline,
} from "@livekit/agents";
import { VAD } from "@livekit/agents-plugin-silero";
import {
  createJarvisLLM,
  createOmniVoiceTTS,
  createWhisperSTT,
  defaultJarvisLlmModel,
  defaultOllamaModel,
  resolveJarvisLlmBackend,
} from "./adapters/local-models.js";
import { RoomEvent } from "@livekit/rtc-node";
import { resolveTalkParticipant } from "./link-participant.js";
import {
  selectAnnounceEvents,
  shouldPollEvents,
  type AnnounceEvent,
} from "./completion-announce.js";
import { createConfirmGate } from "./confirm-gate.js";
import { shouldRecoverEmptySttConfirm } from "./confirm-recovery.js";
import { createModeState } from "./modes.js";
import { buildOccTools, defaultOccClient } from "./occ-tools.js";
import { JARVIS_SYSTEM_PROMPT } from "./jarvis-system-prompt.js";
import { sanitizeForSpeech, summarizeJarvisSpeech } from "./occ-client.js";
import { maybeHandlePhase0VoiceRoute } from "./phase0-voice-route.js";
import { patchSpeechHandleCancel } from "./patch-speech-handle.js";
import {
  parsePulseSnapshot,
  pickWakeGreeting,
  readJarvisPulseMs,
  shouldPulseSpeak,
  type JarvisContextForPulse,
  type PulseSnapshot,
} from "./pulse.js";

const COMPLETION_POLL_MS = 2000;

patchSpeechHandleCancel();

const FALLBACK_GREETING = "Situation Room. Listening.";

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await VAD.load();
  },
  entry: async (ctx: JobContext) => {
    const llmBackend = resolveJarvisLlmBackend();
    if (llmBackend === "ollama") {
      const ollamaBase = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/v1").replace(
        /\/v1\/?$/,
        "",
      );
      try {
        const ping = await fetch(`${ollamaBase}/api/tags`, {
          signal: AbortSignal.timeout(3000),
        });
        if (!ping.ok) throw new Error(`HTTP ${ping.status}`);
      } catch (e) {
        throw new Error(
          `Ollama required when JARVIS_LLM_BACKEND=ollama (or no XAI_API_KEY): ${
            e instanceof Error ? e.message : String(e)
          }. Run: ollama serve && ollama pull ${process.env.OLLAMA_MODEL || defaultOllamaModel()}`,
        );
      }
    } else {
      console.info(
        `[jarvis] LLM backend=xai model=${defaultJarvisLlmModel("xai")} (STT/TTS still local)`,
      );
    }

    await ctx.connect();
    const participant = await resolveTalkParticipant(ctx);

    const occ = defaultOccClient();
    const roomId = ctx.room.name || "default";
    const modeState = createModeState("briefing");
    const confirmGate = createConfirmGate();
    const announcedKeys = new Set<string>();
    let eventsCursor: string | undefined;
    const watchState = { lastActive: false, lastTerminalAtMs: null as number | null };
    let completionTimer: ReturnType<typeof setInterval> | undefined;
    /** Defer "seat finished" TTS while user is mid conversation. */
    let holdAnnouncesUntilMs = 0;

    const chatCtx = new llm.ChatContext().append({
      role: "system",
      text: JARVIS_SYSTEM_PROMPT,
    });

    const agent = new pipeline.VoicePipelineAgent(
      ctx.proc.userData.vad as VAD,
      createWhisperSTT(),
      createJarvisLLM(),
      createOmniVoiceTTS(),
      {
        chatCtx,
        fncCtx: buildOccTools(occ, {
          modeState,
          roomId,
          confirmGate,
          watchState,
        }),
        allowInterruptions: true,
        // Was 30ms / 0 words — residual mic noise cancelled hard-route replies
        // before TTS started (status asked, agent logged say, never spoke).
        interruptSpeechDuration: 400,
        // 1 so short "yes" / "confirm" can interrupt Confirm? prompts.
        interruptMinWords: 1,
        minEndpointingDelay: 300,
        // Default is 1 — kills conversational tool use after the first nested call.
        maxNestedFncCalls: 8,
        preemptiveSynthesis: false,
        beforeLLMCallback: async (vpa, copiedCtx) => {
          // Hold completion announces while the user is asking a question.
          holdAnnouncesUntilMs = Date.now() + 12_000;
          const handled = await maybeHandlePhase0VoiceRoute({
            agent: vpa,
            chatCtx: copiedCtx,
            occ,
            modeState,
            roomId,
            confirmPending: confirmGate.isWaiting(),
            onConfirmPending: (pending) => confirmGate.setWaiting(pending),
          });
          // false skips the LLM — also clears transcribedText inside the route.
          return handled ? false : undefined;
        },
      },
    );

    let confirmUtteranceStartedAt: number | null = null;
    let speechCommittedSinceConfirmStart = false;

    agent.on(pipeline.VPAEvent.USER_STARTED_SPEAKING, () => {
      console.info("[jarvis] user started speaking (interruptible)");
      holdAnnouncesUntilMs = Date.now() + 15_000;
      if (confirmGate.isWaiting()) {
        confirmUtteranceStartedAt = Date.now();
        speechCommittedSinceConfirmStart = false;
      }
    });
    agent.on(pipeline.VPAEvent.USER_SPEECH_COMMITTED, (msg) => {
      console.info("[jarvis] heard:", msg.content ?? (msg as { text?: string }).text);
      holdAnnouncesUntilMs = Date.now() + 12_000;
      speechCommittedSinceConfirmStart = true;
    });
    agent.on(pipeline.VPAEvent.USER_STOPPED_SPEAKING, () => {
      console.info("[jarvis] user stopped speaking");
      if (!confirmGate.isWaiting() || confirmUtteranceStartedAt == null) return;
      const durationMs = Date.now() - confirmUtteranceStartedAt;
      confirmUtteranceStartedAt = null;
      // Whisper often drops short "yes" — recover after a beat if nothing committed.
      setTimeout(() => {
        void (async () => {
          if (
            !shouldRecoverEmptySttConfirm({
              confirmPending: confirmGate.isWaiting(),
              speechDurationMs: durationMs,
              committedHeard: speechCommittedSinceConfirmStart,
            })
          ) {
            return;
          }
          console.info(
            "[jarvis] confirm empty-STT recovery — treating short utterance as yes",
            { durationMs },
          );
          try {
            const res = await occ.jarvisConfirm({
              roomId,
              token: "",
              accept: true,
            });
            confirmGate.setWaiting(false);
            const speech =
              summarizeJarvisSpeech(res) || "Started.";
            void agent.say(sanitizeForSpeech(speech), true, false);
          } catch (err) {
            console.error(
              "[jarvis] confirm recovery failed:",
              err instanceof Error ? err.message : err,
            );
          }
        })();
      }, 900);
    });
    agent.on(pipeline.VPAEvent.AGENT_SPEECH_INTERRUPTED, () => {
      console.info("[jarvis] agent interrupted — listening");
    });
    agent.on(pipeline.VPAEvent.AGENT_SPEECH_COMMITTED, (msg) => {
      const text = String(msg.content ?? (msg as { text?: string }).text ?? "").slice(0, 200);
      console.info("[jarvis] spoke:", text);
    });
    agent.on(pipeline.VPAEvent.AGENT_STARTED_SPEAKING, () => {
      console.info("[jarvis] agent speaking");
    });
    agent.on(pipeline.VPAEvent.AGENT_STOPPED_SPEAKING, () => {
      console.info("[jarvis] agent stopped — listening");
    });

    agent.start(ctx.room, participant);

    let greeting = FALLBACK_GREETING;
    let lastSpokenSnapshot: PulseSnapshot | null = null;
    let disconnectDigestSent = false;
    const fireDisconnectDigest = () => {
      if (disconnectDigestSent) return;
      disconnectDigestSent = true;
      void occ.memoryDigest("Voice session ended.").catch(() => {
        // best-effort session digest on disconnect
      });
    };
    try {
      const context = (await occ.jarvisContext()) as JarvisContextForPulse;
      // Prefer a short spoken open; truncate long mission briefs so we stay conversational.
      const brief = (context.spokenBrief || "").trim();
      if (brief) {
        // Allow a short plain-English wrap (verdict + next step), not a jargon dump.
        greeting = pickWakeGreeting(brief, 280);
      }
      lastSpokenSnapshot = parsePulseSnapshot(context);
    } catch {
      // OCC unreachable — use fallback greeting
    }
    // Interruptible greeting — user can barge in immediately.
    void agent.say(sanitizeForSpeech(greeting), true);

    const pulseMs = readJarvisPulseMs();
    let pulseTimer: ReturnType<typeof setInterval> | undefined;
    const clearPulseTimer = () => {
      if (pulseTimer !== undefined) {
        clearInterval(pulseTimer);
        pulseTimer = undefined;
      }
    };

    if (pulseMs > 0) {
      pulseTimer = setInterval(async () => {
        if (!ctx.room.isConnected) return;
        try {
          const context = (await occ.jarvisContext()) as JarvisContextForPulse;
          const snapshot = parsePulseSnapshot(context);
          if (!snapshot) return;
          if (lastSpokenSnapshot && shouldPulseSpeak(lastSpokenSnapshot, snapshot)) {
            const brief = context.spokenBrief || FALLBACK_GREETING;
            void agent.say(sanitizeForSpeech(brief), true);
          }
          lastSpokenSnapshot = snapshot;
        } catch {
          // OCC unreachable — skip this pulse tick
        }
      }, pulseMs);
    }

    const clearCompletionTimer = () => {
      if (completionTimer !== undefined) {
        clearInterval(completionTimer);
        completionTimer = undefined;
      }
    };

    const tickCompletion = async () => {
      if (!ctx.room.isConnected) return;
      if (
        !shouldPollEvents(watchState.lastActive, watchState.lastTerminalAtMs, Date.now())
      ) {
        return;
      }
      try {
        const payload = await occ.eventsSince(eventsCursor);
        watchState.lastActive = payload.active;
        const announceEvents: AnnounceEvent[] = payload.events.map((e) => {
          const cursor = `${e.at}|${e.runId}|${e.type}`;
          let spoken: string | null = null;
          const who =
            e.position === "ceo-strategist" ? "CEO" : e.position.replace(/-/g, " ");
          if (e.type === "finished") spoken = `${who} finished.`;
          else if (e.type === "error")
            spoken = e.detail ? `${who} failed: ${e.detail}.` : `${who} failed.`;
          else if (e.type === "acceptance_failed")
            spoken = e.detail
              ? `${who} finished with gaps: ${e.detail}.`
              : `${who} finished with gaps.`;
          return { ...e, cursor, spoken };
        });
        const deferSpeak =
          confirmGate.isWaiting() || Date.now() < holdAnnouncesUntilMs;
        const { speak, mark } = selectAnnounceEvents(
          announceEvents,
          announcedKeys,
          deferSpeak,
        );
        for (const key of mark) announcedKeys.add(key);
        if (payload.nextCursor) eventsCursor = payload.nextCursor;
        if (announceEvents.some((e) => e.spoken)) {
          watchState.lastTerminalAtMs = Date.now();
        }
        for (const line of speak) {
          void agent.say(sanitizeForSpeech(line), true);
        }
      } catch {
        // OCC unreachable — skip tick
      }
    };

    // Seed cursor so historical events are not re-announced; mark active if already running.
    void occ
      .eventsSince()
      .then((p) => {
        watchState.lastActive = p.active;
        if (p.nextCursor) eventsCursor = p.nextCursor;
        for (const e of p.events) {
          announcedKeys.add(`${e.at}|${e.runId}|${e.type}`);
        }
      })
      .catch(() => {
        /* OCC may be down at boot */
      });

    completionTimer = setInterval(() => {
      void tickCompletion();
    }, COMPLETION_POLL_MS);

    ctx.addShutdownCallback(async () => {
      clearPulseTimer();
      clearCompletionTimer();
      fireDisconnectDigest();
    });
    ctx.room.on(RoomEvent.Disconnected, () => {
      clearPulseTimer();
      clearCompletionTimer();
      fireDisconnectDigest();
    });
  },
});
