import { auditJarvis } from "./audit";
import { normalizeQueueForArgs } from "./dispatch-for";
import { JarvisExecError } from "./errors";
import { parseJarvisAct, type JarvisIntent, type JarvisMode } from "./intents";
import { policyFor } from "./policy";
import {
  cancelConfirm,
  consumeConfirm,
  createConfirmToken,
  getRoomMode,
  getWorkIntake,
  mergeWorkGoal,
  peekConfirm,
  setLastSummary,
  setWorkIntake,
} from "./session";
import { executeIntent as executeIntentProd } from "./tools-exec";
import { resolveWorkTarget } from "./work-request";

export type JarvisActResult = {
  status: "ok" | "needs_confirm" | "denied" | "error";
  token?: string;
  summary?: string;
  result?: unknown;
  reason?: string;
};

export type ExecuteIntentFn = (
  repoRoot: string,
  intent: JarvisIntent,
  args: Record<string, unknown>,
) => Promise<unknown>;

let executeIntentOverride: ExecuteIntentFn | undefined;

export function setExecuteIntentForTests(fn: ExecuteIntentFn | undefined) {
  executeIntentOverride = fn;
}

async function executeIntent(
  repoRoot: string,
  intent: JarvisIntent,
  args: Record<string, unknown>,
): Promise<unknown> {
  if (executeIntentOverride) {
    return executeIntentOverride(repoRoot, intent, args);
  }
  return executeIntentProd(repoRoot, intent, args);
}

function confirmSummary(intent: JarvisIntent, args: Record<string, unknown>): string {
  if (intent === "venture.create") {
    const name = String(args.name ?? "unnamed");
    const slug = String(args.slug ?? "(auto-slug)");
    return `Create venture "${name}" as ${slug} and make it active. Confirm?`;
  }
  if (intent === "venture.switch") {
    const slug = String(args.slug ?? "");
    return `Switch active venture to ${slug}. Confirm?`;
  }
  if (intent === "dispatch.queue_for") {
    const position = String(args.position ?? "manager");
    const phase = String(args.phase ?? "?");
    return `Queue ${position} for phase ${phase}. Confirm?`;
  }
  if (intent === "work.request") {
    const position = String(args.position ?? "manager");
    const ic = args.targetIc ? ` (IC ${args.targetIc})` : "";
    return `Queue ${position}${ic} and start Cursor now. Confirm?`;
  }
  return `Confirm ${intent.replace(/\./g, " ")}?`;
}

function okSummary(intent: JarvisIntent, result: unknown): string {
  if (intent === "mission.get" && typeof result === "object" && result !== null && "mission" in result) {
    const mission = (result as { mission: { idea?: string; currentPhase?: string } }).mission;
    return `Mission: ${mission.idea ?? "unknown"}, phase ${mission.currentPhase ?? "?"}.`;
  }
  if (intent === "session.help" && typeof result === "object" && result !== null && "help" in result) {
    return String((result as { help: string }).help);
  }
  if (intent === "session.repeat" && typeof result === "object" && result !== null && "summary" in result) {
    return String((result as { summary: string }).summary);
  }
  if (intent === "mode.set" && typeof result === "object" && result !== null && "mode" in result) {
    return `Switched to ${(result as { mode: string }).mode} mode.`;
  }
  if (intent === "work.resolve" && typeof result === "object" && result !== null && "spoken" in result) {
    return String((result as { spoken: string }).spoken);
  }
  if (intent === "seat.report" && typeof result === "object" && result !== null) {
    const r = result as { spoken?: string; report?: { title?: string; summary?: string } };
    if (typeof r.spoken === "string" && r.spoken.trim()) return r.spoken;
    if (r.report?.title) {
      return `${r.report.title}: ${r.report.summary ?? "no summary yet"}.`;
    }
  }
  if (
    intent === "work.request" &&
    typeof result === "object" &&
    result !== null &&
    "runId" in result
  ) {
    const r = result as { position?: string; runId?: string; reviewInboxHint?: string };
    return `${r.position} running as ${r.runId}. Artifact will land in review inbox.`;
  }
  if (intent === "runs.watch" && typeof result === "object" && result !== null && "summary" in result) {
    return String((result as { summary: string }).summary);
  }
  if (intent === "blocker.list" && typeof result === "object" && result !== null && "summary" in result) {
    return String((result as { summary: string }).summary);
  }
  if (
    intent === "session.cancel_pending" &&
    typeof result === "object" &&
    result !== null &&
    "cancelled" in result
  ) {
    const cancelled = (result as { cancelled?: { intent?: string } }).cancelled;
    return cancelled?.intent
      ? `Cancelled pending ${cancelled.intent.replace(/\./g, " ")}.`
      : "Cancelled pending confirm.";
  }
  return `Done: ${intent.replace(/\./g, " ")}.`;
}

function resolveMode(raw: Record<string, unknown>, roomId: string): JarvisMode {
  const mode = raw.mode;
  if (mode === "briefing" || mode === "ops" || mode === "review" || mode === "architect") return mode;
  return getRoomMode(roomId);
}

export async function handleJarvisAct(
  repoRoot: string,
  roomId: string,
  body: unknown,
): Promise<JarvisActResult> {
  let act;
  try {
    act = parseJarvisAct(body);
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Invalid request";
    auditJarvis({ roomId, type: "jarvis_error", detail: reason }, repoRoot);
    return { status: "error", reason };
  }

  const raw = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const mode = resolveMode(raw, roomId);
  const confirmToken = typeof raw.confirmToken === "string" ? raw.confirmToken : undefined;

  const policy = policyFor(act.intent, mode);
  auditJarvis({ roomId, type: "jarvis_intent", intent: act.intent, detail: mode }, repoRoot);

  if (!policy.allowed) {
    auditJarvis(
      {
        roomId,
        type: "jarvis_denied",
        intent: act.intent,
        detail: policy.reason,
      },
      repoRoot,
    );
    return { status: "denied", reason: policy.reason };
  }

  let execArgs: Record<string, unknown> = { ...act.args, roomId };

  if (policy.needsConfirm) {
    if (!confirmToken) {
      let confirmArgs: Record<string, unknown> = act.args;
      if (act.intent === "dispatch.queue_for") {
        try {
          confirmArgs = normalizeQueueForArgs(repoRoot, act.args);
        } catch (err) {
          const reason =
            err instanceof JarvisExecError || err instanceof Error ? err.message : "Invalid request";
          auditJarvis(
            { roomId, type: "jarvis_error", intent: act.intent, detail: reason },
            repoRoot,
          );
          return { status: "error", reason };
        }
      }
      if (act.intent === "work.request") {
        try {
          const intake = getWorkIntake(roomId);
          const resolved = resolveWorkTarget(repoRoot, {
            position:
              act.args.position != null
                ? String(act.args.position)
                : intake?.intakeSeat,
            goal: act.args.goal != null ? String(act.args.goal) : intake?.goal,
          });
          const goal = mergeWorkGoal(resolved.goal, intake?.answers);
          confirmArgs = normalizeQueueForArgs(repoRoot, {
            position: resolved.intakeSeat,
            goal,
            phase: act.args.phase,
            targetIc: resolved.targetIc ?? intake?.targetIc,
            require_inbox: true,
          });
          setWorkIntake(roomId, {
            intakeSeat: resolved.intakeSeat,
            targetIc: resolved.targetIc ?? intake?.targetIc,
            goal: resolved.goal,
            answers: intake?.answers ?? {},
          });
        } catch (err) {
          const reason =
            err instanceof JarvisExecError || err instanceof Error ? err.message : "Invalid request";
          auditJarvis(
            { roomId, type: "jarvis_error", intent: act.intent, detail: reason },
            repoRoot,
          );
          return { status: "error", reason };
        }
      }
      const token = createConfirmToken(roomId, act.intent, confirmArgs, mode);
      const summary = confirmSummary(act.intent, confirmArgs);
      auditJarvis(
        {
          roomId,
          type: "jarvis_confirm_pending",
          intent: act.intent,
          detail: summary,
        },
        repoRoot,
      );
      setLastSummary(roomId, summary);
      return { status: "needs_confirm", token, summary };
    }

    const pending = consumeConfirm(roomId, confirmToken);
    if (!pending || pending.intent !== act.intent) {
      auditJarvis(
        {
          roomId,
          type: "jarvis_error",
          intent: act.intent,
          detail: "Invalid or expired confirm token",
        },
        repoRoot,
      );
      return { status: "error", reason: "Invalid or expired confirm token" };
    }

    auditJarvis({ roomId, type: "jarvis_confirm", intent: act.intent }, repoRoot);
    execArgs =
      typeof pending.args === "object" && pending.args !== null && !Array.isArray(pending.args)
        ? { ...(pending.args as Record<string, unknown>), roomId }
        : { roomId };
  }

  try {
    const result = await executeIntent(repoRoot, act.intent, execArgs);
    auditJarvis({ roomId, type: "jarvis_executed", intent: act.intent }, repoRoot);
    const summary = okSummary(act.intent, result);
    setLastSummary(roomId, summary);
    return { status: "ok", result, summary };
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Execution failed";
    auditJarvis({ roomId, type: "jarvis_error", intent: act.intent, detail: reason }, repoRoot);
    return { status: "error", reason };
  }
}

export async function handleJarvisConfirm(
  repoRoot: string,
  roomId: string,
  token: string,
  accept?: boolean,
): Promise<JarvisActResult> {
  if (!token) {
    return { status: "error", reason: "token required" };
  }

  if (accept !== true) {
    const cancelled = cancelConfirm(roomId, token);
    if (!cancelled) {
      auditJarvis({ roomId, type: "jarvis_error", detail: "Invalid or expired confirm token" }, repoRoot);
      return { status: "error", reason: "Invalid or expired confirm token" };
    }
    auditJarvis(
      {
        roomId,
        type: "jarvis_denied",
        intent: cancelled.intent,
        detail: "confirm declined",
      },
      repoRoot,
    );
    return { status: "denied", reason: "Confirm declined" };
  }

  const pending = peekConfirm(roomId, token);
  if (!pending) {
    auditJarvis({ roomId, type: "jarvis_error", detail: "Invalid or expired confirm token" }, repoRoot);
    return { status: "error", reason: "Invalid or expired confirm token" };
  }

  return handleJarvisAct(repoRoot, roomId, {
    intent: pending.intent,
    args: pending.args,
    confirmToken: token,
    mode: pending.mode,
  });
}
