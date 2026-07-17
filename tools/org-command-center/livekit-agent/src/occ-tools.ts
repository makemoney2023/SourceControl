import type { FunctionContext } from "@livekit/agents";
import { z } from "zod";
import {
  applyModeFromActResult,
  summarizeSetMode,
  type ModeState,
} from "./modes.js";
import {
  createOccClient,
  summarizeForSpeech,
  summarizeJarvisSpeech,
  type JarvisMode,
  type OccClient,
} from "./occ-client.js";

export type OccToolsContext = {
  modeState: ModeState;
  roomId: string;
};

async function logTool<T>(name: string, args: unknown, run: () => Promise<T>): Promise<T> {
  console.info("[jarvis] tool", name, args);
  try {
    const out = await run();
    console.info("[jarvis] tool ok", name, typeof out === "string" ? out.slice(0, 160) : out);
    return out;
  } catch (e) {
    console.error("[jarvis] tool fail", name, e instanceof Error ? e.message : e);
    throw e;
  }
}

export function buildOccTools(occ: OccClient, ctx: OccToolsContext): FunctionContext {
  const act = async (
    intent: string,
    args: Record<string, unknown> = {},
    confirmToken?: string,
  ) =>
    summarizeJarvisSpeech(
      await occ.jarvisAct({
        intent,
        args,
        confirmToken,
        mode: ctx.modeState.getMode(),
        roomId: ctx.roomId,
      }),
    );

  return {
    jarvis_act: {
      description:
        "Execute a Situation Room intent. Prefer read intents. Hard writes return needs_confirm. Use work.resolve / work.request for create-and-spawn flows.",
      parameters: z.object({
        intent: z.string(),
        args: z.record(z.string(), z.unknown()).optional(),
        confirmToken: z.string().optional(),
      }),
      execute: async ({ intent, args, confirmToken }) =>
        logTool("jarvis_act", { intent, args, confirmToken }, () =>
          act(intent, args ?? {}, confirmToken),
        ),
    },
    work_resolve: {
      description:
        "Resolve who should intake a work ask (domain C-suite / manager). Call in ops after set_mode when user wants content or a worker.",
      parameters: z.object({
        goal: z.string(),
        position: z.string().optional(),
      }),
      execute: async ({ goal, position }) =>
        logTool("work_resolve", { goal, position }, () =>
          act("work.resolve", { goal, position }),
        ),
    },
    work_intake_save: {
      description: "Save C-suite intake answers gathered on the mic before work.request.",
      parameters: z.object({
        answers: z.record(z.string(), z.string()),
        goal: z.string().optional(),
        position: z.string().optional(),
      }),
      execute: async ({ answers, goal, position }) =>
        logTool("work_intake_save", { answers, goal, position }, () =>
          act("work.intake_save", { answers, goal, position }),
        ),
    },
    work_request: {
      description:
        "Queue the intake manager and start Cursor (needs confirm). After needs_confirm, call jarvis_confirm.",
      parameters: z.object({
        goal: z.string().optional(),
        position: z.string().optional(),
        phase: z.string().optional(),
        confirmToken: z.string().optional(),
      }),
      execute: async ({ goal, position, phase, confirmToken }) =>
        logTool("work_request", { goal, position, phase, confirmToken }, () =>
          act("work.request", { goal, position, phase }, confirmToken),
        ),
    },
    set_mode: {
      description:
        "Switch Situation Room mode: briefing (read-only), ops (control), review, or architect (ventures).",
      parameters: z.object({
        mode: z.enum(["briefing", "ops", "review", "architect"]),
      }),
      execute: async ({ mode }) =>
        logTool("set_mode", { mode }, async () => {
          const response = await occ.jarvisAct({
            intent: "mode.set",
            args: { mode },
            mode: ctx.modeState.getMode(),
            roomId: ctx.roomId,
          });
          applyModeFromActResult(ctx.modeState, response);
          return summarizeSetMode(response, mode as JarvisMode);
        }),
    },
    jarvis_confirm: {
      description:
        "Accept or decline a pending action after jarvis_act / work_request returns needs_confirm.",
      parameters: z.object({
        token: z.string(),
        accept: z.boolean(),
      }),
      execute: async ({ token, accept }) =>
        logTool("jarvis_confirm", { token, accept }, async () =>
          summarizeJarvisSpeech(
            await occ.jarvisConfirm({ roomId: ctx.roomId, token, accept }),
          ),
        ),
    },
    jarvis_context: {
      description: "Fetch current mission and spoken brief for context.",
      parameters: z.object({}),
      execute: async () =>
        logTool("jarvis_context", {}, async () => {
          const ctx = (await occ.jarvisContext()) as { spokenBrief?: string };
          return summarizeForSpeech(ctx.spokenBrief || "No mission brief available.");
        }),
    },
    runs_watch: {
      description:
        "Watch recent run events (started, finished, gaps). Use when the user asks if work is done or wants run status.",
      parameters: z.object({
        limit: z.number().optional(),
      }),
      execute: async ({ limit }) =>
        logTool("runs_watch", { limit }, () => act("runs.watch", { limit })),
    },
    brain_ask: {
      description:
        "Deep think via Cursor SDK Grok (grok-4.5). Use for hard reasoning, tradeoffs, prioritize — not for spawn or simple status.",
      parameters: z.object({
        prompt: z.string(),
      }),
      execute: async ({ prompt }) =>
        logTool("brain_ask", { prompt }, () => act("brain.ask", { prompt })),
    },
  };
}

export function defaultOccClient() {
  return createOccClient(process.env.OCC_API_BASE || "http://127.0.0.1:5177");
}
