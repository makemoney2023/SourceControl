import { z } from "zod";

export const JARVIS_INTENTS = [
  "mission.get",
  "digest.get",
  "seat.report",
  "tasks.list",
  "runs.list",
  "runs.get",
  "runs.watch",
  "activity.list",
  "alerts.list",
  "spend.get",
  "file.read",
  "dispatch.queue",
  "alerts.ack",
  "routine.enable",
  "routine.list",
  "routine.disable",
  "spawn.run_next",
  "spawn.run",
  "spawn.run_ready",
  "run.cancel",
  "run.rewake",
  "run.instruct",
  "agent.pause",
  "agent.resume",
  "csuite.draft",
  "mode.set",
  "venture.list",
  "venture.get",
  "venture.slugify",
  "venture.create",
  "venture.switch",
  "agent.spawn_ic",
  "seat.who_owns",
  "dispatch.preview",
  "dispatch.queue_for",
  "dispatch.queue_batch",
  "dispatch.list",
  "delegate.plan",
  "session.help",
  "session.repeat",
  "session.cancel_pending",
  "jarvis.ping",
  "brain.ask",
  "handoff.list",
  "briefing.pin",
  "phase.list_open",
  "digest.focus",
  "blocker.list",
  "blocker.resolve",
  "activity.tail",
  "work.resolve",
  "work.intake_save",
  "work.request",
  "review.inbox_list",
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
