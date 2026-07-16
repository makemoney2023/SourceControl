import {
  type JobContext,
  type JobProcess,
  defineAgent,
  llm,
  pipeline,
} from "@livekit/agents";
import { VAD } from "@livekit/agents-plugin-silero";
import {
  createOllamaLLM,
  createOmniVoiceTTS,
  createWhisperSTT,
  defaultOllamaModel,
} from "./adapters/local-models.js";
import { resolveTalkParticipant } from "./link-participant.js";
import type { JarvisMode } from "./occ-client.js";
import { buildOccTools, defaultOccClient } from "./occ-tools.js";

const FALLBACK_GREETING =
  "Situation Room online. Ask for a company digest or mission brief whenever you are ready.";

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await VAD.load();
  },
  entry: async (ctx: JobContext) => {
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
        `Ollama required for voice agent (no cloud fallback): ${
          e instanceof Error ? e.message : String(e)
        }. Run: ollama serve && ollama pull ${process.env.OLLAMA_MODEL || defaultOllamaModel()}`,
      );
    }

    await ctx.connect();
    const participant = await resolveTalkParticipant(ctx);

    const occ = defaultOccClient();
    const roomId = ctx.room.name || "default";
    const session = { mode: "briefing" as JarvisMode };

    const chatCtx = new llm.ChatContext().append({
      role: "system",
      text: [
        "You are the Situation Room voice operator (Jarvis) for a virtual company of digital workers.",
        "Speak briefly and clearly. Use jarvis_act for all company actions — never invent phases, handoffs, or data.",
        "Prefer read intents: mission.get, digest.get, seat.report, tasks.list.",
        "Briefing mode (default): read-only. Ops-only actions are denied until the operator switches to Ops.",
        "Hard writes (spawn.run_next, run.cancel, agent.pause, etc.) return needs_confirm.",
        "When needs_confirm: speak the summary, ask Confirm?, then call jarvis_confirm with accept true or false.",
        "Use jarvis_context to refresh mission facts. Manager-only dispatch; do not invent packs.",
      ].join(" "),
    });

    const agent = new pipeline.VoicePipelineAgent(
      ctx.proc.userData.vad as VAD,
      createWhisperSTT(),
      createOllamaLLM(),
      createOmniVoiceTTS(),
      {
        chatCtx,
        fncCtx: buildOccTools(occ, {
          getMode: () => session.mode,
          roomId,
        }),
      },
    );

    agent.start(ctx.room, participant);

    let greeting = FALLBACK_GREETING;
    try {
      const context = (await occ.jarvisContext()) as { spokenBrief?: string };
      if (context.spokenBrief) greeting = context.spokenBrief;
    } catch {
      // OCC unreachable — use fallback greeting
    }
    await agent.say(greeting);
  },
});
