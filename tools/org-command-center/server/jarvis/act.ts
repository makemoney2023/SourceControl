import { auditJarvis } from "./audit";
import { parseJarvisAct, type JarvisIntent, type JarvisMode } from "./intents";
import { policyFor } from "./policy";
import { cancelConfirm, consumeConfirm, createConfirmToken, getRoomMode, peekConfirm } from "./session";
import { executeIntent as executeIntentProd } from "./tools-exec";

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

function confirmSummary(intent: JarvisIntent): string {
  return `Confirm ${intent.replace(/\./g, " ")}?`;
}

function resolveMode(raw: Record<string, unknown>, roomId: string): JarvisMode {
  const mode = raw.mode;
  if (mode === "briefing" || mode === "ops" || mode === "review") return mode;
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
      const token = createConfirmToken(roomId, act.intent, act.args, mode);
      const summary = confirmSummary(act.intent);
      auditJarvis(
        {
          roomId,
          type: "jarvis_confirm_pending",
          intent: act.intent,
          detail: summary,
        },
        repoRoot,
      );
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
    return { status: "ok", result };
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
