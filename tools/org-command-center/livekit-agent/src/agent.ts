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
import { createModeState } from "./modes.js";
import { buildOccTools, defaultOccClient } from "./occ-tools.js";
import { JARVIS_SYSTEM_PROMPT } from "./jarvis-system-prompt.js";
import { sanitizeForSpeech } from "./occ-client.js";
import {
  parsePulseSnapshot,
  pickWakeGreeting,
  readJarvisPulseMs,
  shouldPulseSpeak,
  type JarvisContextForPulse,
  type PulseSnapshot,
} from "./pulse.js";

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
        }),
        allowInterruptions: true,
        interruptSpeechDuration: 30,
        interruptMinWords: 0,
        minEndpointingDelay: 250,
        // Default is 1 — kills conversational tool use after the first nested call.
        maxNestedFncCalls: 8,
        preemptiveSynthesis: false,
      },
    );

    agent.on(pipeline.VPAEvent.USER_STARTED_SPEAKING, () => {
      console.info("[jarvis] user started speaking (interruptible)");
    });
    agent.on(pipeline.VPAEvent.USER_SPEECH_COMMITTED, (msg) => {
      console.info("[jarvis] heard:", msg.content ?? (msg as { text?: string }).text);
    });
    agent.on(pipeline.VPAEvent.AGENT_SPEECH_INTERRUPTED, () => {
      console.info("[jarvis] agent interrupted — listening");
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
        greeting = pickWakeGreeting(brief, 160);
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

    ctx.addShutdownCallback(async () => {
      clearPulseTimer();
      fireDisconnectDigest();
    });
    ctx.room.on(RoomEvent.Disconnected, () => {
      clearPulseTimer();
      fireDisconnectDigest();
    });
  },
});
