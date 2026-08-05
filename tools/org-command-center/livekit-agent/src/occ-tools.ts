import type { FunctionContext } from "@livekit/agents";
import { z } from "zod";
import {
  applyModeFromActResult,
  modeAck,
  summarizeSetMode,
  type ModeState,
} from "./modes.js";
import type { ConfirmGate } from "./confirm-gate.js";
import {
  createOccClient,
  summarizeForSpeech,
  summarizeJarvisSpeech,
  type JarvisMode,
  type OccClient,
} from "./occ-client.js";

export type CompletionWatchState = {
  lastActive: boolean;
  lastTerminalAtMs: number | null;
};

export type OccToolsContext = {
  modeState: ModeState;
  roomId: string;
  confirmGate?: ConfirmGate;
  /** Nudge completion poller after a confirmed spawn. */
  watchState?: CompletionWatchState;
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
  ) => {
    const response = await occ.jarvisAct({
      intent,
      args,
      confirmToken,
      mode: ctx.modeState.getMode(),
      roomId: ctx.roomId,
    });
    if (intent === "mode.set") {
      applyModeFromActResult(ctx.modeState, response);
    }
    if (
      ctx.confirmGate &&
      typeof response === "object" &&
      response !== null &&
      "status" in response
    ) {
      const status = (response as { status?: string }).status;
      if (status === "needs_confirm") ctx.confirmGate.setWaiting(true);
    }
    return summarizeJarvisSpeech(response);
  };

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
      description:
        "Save C-suite intake answers gathered on the mic before work.request. Skip if answers are empty.",
      parameters: z.object({
        answers: z.record(z.string(), z.string()),
        goal: z.string().optional(),
        position: z.string().optional(),
      }),
      execute: async ({ answers, goal, position }) =>
        logTool("work_intake_save", { answers, goal, position }, async () => {
          const usable = Object.fromEntries(
            Object.entries(answers ?? {}).filter(
              ([, v]) => typeof v === "string" && v.trim().length > 0,
            ),
          );
          if (Object.keys(usable).length === 0) {
            return "No intake answers to save — continuing.";
          }
          return act("work.intake_save", { answers: usable, goal, position });
        }),
    },
    seat_answer_draft: {
      description:
        "Save one or more operator answers for a seat's open questions (multi-turn). Call after seat.report. Ops mode. Does not continue the seat until seat_answer + Confirm?.",
      parameters: z.object({
        seat: z.string().optional(),
        answer: z.string().optional(),
        question: z.string().optional(),
        answers: z.record(z.string(), z.string()).optional(),
      }),
      execute: async ({ seat, answer, question, answers }) =>
        logTool("seat_answer_draft", { seat, answer, question, answers }, async () => {
          const usable = Object.fromEntries(
            Object.entries(answers ?? {}).filter(
              ([, v]) => typeof v === "string" && v.trim().length > 0,
            ),
          );
          return act("seat.answer_draft", {
            seat,
            answer,
            question,
            answers: Object.keys(usable).length ? usable : undefined,
          });
        }),
    },
    seat_answer: {
      description:
        "Persist answers and continue a needs_input seat (HARD Confirm?). Prefer after seat_answer_draft, or pass answer/answers for a one-shot. Uses last reported seat when seat omitted.",
      parameters: z.object({
        seat: z.string().optional(),
        answer: z.string().optional(),
        question: z.string().optional(),
        answers: z.record(z.string(), z.string()).optional(),
      }),
      execute: async ({ seat, answer, question, answers }) =>
        logTool("seat_answer", { seat, answer, question, answers }, async () => {
          const usable = Object.fromEntries(
            Object.entries(answers ?? {}).filter(
              ([, v]) => typeof v === "string" && v.trim().length > 0,
            ),
          );
          return act("seat.answer", {
            seat,
            answer,
            question,
            answers: Object.keys(usable).length ? usable : undefined,
          });
        }),
    },
    work_request: {
      description:
        "Queue the intake manager and start Cursor. Call once; after Confirm?, STOP and ask the user. On yes call jarvis_confirm({ accept: true }) — never invent tokens. Prefer phase as a digit like \"2\". For Phase 0 / intake / new idea: always position ceo-strategist and phase \"0\".",
      parameters: z.object({
        goal: z.string().optional(),
        position: z.string().optional(),
        phase: z.string().optional(),
      }),
      execute: async ({ goal, position, phase }) =>
        logTool("work_request", { goal, position, phase }, async () => {
          // Never blind-confirm here — mismatched re-calls must re-issue Confirm?
          // Matching repeats after ~2s are treated as yes by the server.
          return act("work.request", { goal, position, phase });
        }),
    },
    set_mode: {
      description:
        "Switch Situation Room mode: briefing (read-only), ops (control), review, or architect (ventures). No-op if already in that mode — do not call repeatedly.",
      parameters: z.object({
        mode: z.enum(["briefing", "ops", "review", "architect"]),
      }),
      execute: async ({ mode }) =>
        logTool("set_mode", { mode }, async () => {
          if (ctx.modeState.getMode() === mode) {
            return modeAck(mode as JarvisMode);
          }
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
        "Accept or decline the latest pending needs_confirm. Omit token always — server resolves the pending action. Never invent or pass a spoken phrase as token.",
      parameters: z.object({
        accept: z.boolean(),
        token: z.string().optional(),
      }),
      execute: async ({ accept }) =>
        logTool("jarvis_confirm", { accept }, async () => {
          // Never forward model-invented tokens — server uses latest pending.
          const response = await occ.jarvisConfirm({
            roomId: ctx.roomId,
            token: "",
            accept,
          });
          ctx.confirmGate?.setWaiting(false);
          if (accept && ctx.watchState) {
            ctx.watchState.lastActive = true;
            ctx.watchState.lastTerminalAtMs = Date.now();
          }
          return summarizeJarvisSpeech(response);
        }),
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
