import { z } from "zod";

export const JARVIS_INTENTS = [
  "mission.get",
  "digest.get",
  "seat.report",
  "tasks.list",
  "runs.list",
  "activity.list",
  "alerts.list",
  "spend.get",
  "file.read",
  "dispatch.queue",
  "alerts.ack",
  "routine.enable",
  "spawn.run_next",
  "run.cancel",
  "run.rewake",
  "agent.pause",
  "agent.resume",
  "csuite.draft",
  "mode.set",
  "venture.list",
  "venture.get",
  "venture.slugify",
  "venture.create",
  "venture.switch",
] as const;

export type JarvisIntent = (typeof JARVIS_INTENTS)[number];
export type JarvisMode = "briefing" | "ops" | "review" | "architect";

const jarvisActSchema = z.object({
  intent: z.enum(JARVIS_INTENTS, { error: "Unknown intent" }),
  args: z.record(z.string(), z.unknown()).default({}),
});

export type JarvisAct = z.infer<typeof jarvisActSchema>;

export function parseJarvisAct(body: unknown): JarvisAct {
  const parsed = jarvisActSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join("; ");
    throw new Error(message.includes("intent") ? message : `Invalid intent: ${message}`);
  }
  return parsed.data;
}
