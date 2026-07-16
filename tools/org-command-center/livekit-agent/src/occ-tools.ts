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
  type JarvisMode,
  type OccClient,
} from "./occ-client.js";

export type OccToolsContext = {
  modeState: ModeState;
  roomId: string;
};

export function buildOccTools(occ: OccClient, ctx: OccToolsContext): FunctionContext {
  return {
    jarvis_act: {
      description:
        "Execute a Situation Room intent. Prefer read intents. Hard writes return needs_confirm.",
      parameters: z.object({
        intent: z.string(),
        args: z.record(z.string(), z.unknown()).optional(),
        confirmToken: z.string().optional(),
      }),
      execute: async ({ intent, args, confirmToken }) =>
        summarizeForSpeech(
          await occ.jarvisAct({
            intent,
            args: args ?? {},
            confirmToken,
            mode: ctx.modeState.getMode(),
            roomId: ctx.roomId,
          }),
        ),
    },
    set_mode: {
      description:
        "Switch Situation Room mode: briefing (read-only), ops (control), or review.",
      parameters: z.object({
        mode: z.enum(["briefing", "ops", "review"]),
      }),
      execute: async ({ mode }) => {
        const response = await occ.jarvisAct({
          intent: "mode.set",
          args: { mode },
          mode: ctx.modeState.getMode(),
          roomId: ctx.roomId,
        });
        applyModeFromActResult(ctx.modeState, response);
        return summarizeSetMode(response, mode as JarvisMode);
      },
    },
    jarvis_confirm: {
      description:
        "Accept or decline a pending action after jarvis_act returns needs_confirm.",
      parameters: z.object({
        token: z.string(),
        accept: z.boolean(),
      }),
      execute: async ({ token, accept }) =>
        summarizeForSpeech(
          await occ.jarvisConfirm({ roomId: ctx.roomId, token, accept }),
        ),
    },
    jarvis_context: {
      description: "Fetch current mission and spoken brief for context.",
      parameters: z.object({}),
      execute: async () => summarizeForSpeech(await occ.jarvisContext()),
    },
  };
}

export function defaultOccClient() {
  return createOccClient(process.env.OCC_API_BASE || "http://127.0.0.1:5177");
}
