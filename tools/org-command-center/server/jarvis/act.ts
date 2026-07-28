import { auditJarvis } from "./audit";
import { normalizeQueueForArgs } from "./dispatch-for";
import { JarvisExecError } from "./errors";
import { parseJarvisAct, type JarvisIntent, type JarvisMode } from "./intents";
import { policyFor } from "./policy";
import { loadRegistry } from "../paths";
import {
  cancelConfirm,
  consumeConfirm,
  createConfirmToken,
  getRoomMode,
  getWorkIntake,
  mergeWorkGoal,
  peekConfirm,
  peekLatestConfirm,
  setLastSummary,
  setWorkIntake,
} from "./session";
import { isPhase0RoundtableRequest, looksLikePhase0Request } from "./phase0-roundtable";
import { executeIntent as executeIntentProd } from "./tools-exec";
import { resolveWorkTarget } from "./work-request";

function workConfirmKey(args: Record<string, unknown>): string {
  const position = String(args.position ?? "").trim();
  const phase = String(args.phase ?? "").trim();
  const goal = String(args.goal ?? "").trim();
  const targetIc = String(args.targetIc ?? "").trim();
  return JSON.stringify({ position, phase, goal, targetIc });
}

function sameConfirmArgs(a: unknown, b: Record<string, unknown>): boolean {
  if (typeof a !== "object" || a === null || Array.isArray(a)) return false;
  return workConfirmKey(a as Record<string, unknown>) === workConfirmKey(b);
}

function normalizeWorkRequestConfirmArgs(
  repoRoot: string,
  roomId: string,
  args: Record<string, unknown>,
): Record<string, unknown> {
  const intake = getWorkIntake(roomId);
  const resolved = resolveWorkTarget(repoRoot, {
    position:
      args.position != null ? String(args.position) : intake?.intakeSeat,
    goal: args.goal != null ? String(args.goal) : intake?.goal,
    phase: args.phase != null ? String(args.phase) : undefined,
  });
  const goal = mergeWorkGoal(resolved.goal, intake?.answers);
  let phase = args.phase != null ? String(args.phase) : undefined;
  if (
    looksLikePhase0Request({
      phase,
      goal: args.goal != null ? String(args.goal) : resolved.goal,
    })
  ) {
    phase = "0";
  }
  const confirmArgs = normalizeQueueForArgs(repoRoot, {
    position: resolved.intakeSeat,
    goal,
    phase,
    targetIc: resolved.targetIc ?? intake?.targetIc,
    require_inbox: true,
  });
  setWorkIntake(roomId, {
    intakeSeat: resolved.intakeSeat,
    targetIc: resolved.targetIc ?? intake?.targetIc,
    goal: resolved.goal,
    answers: intake?.answers ?? {},
  });
  return confirmArgs;
}

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
    if (
      isPhase0RoundtableRequest({
        phase: args.phase != null ? String(args.phase) : undefined,
        position: args.position != null ? String(args.position) : undefined,
        goal: args.goal != null ? String(args.goal) : undefined,
      })
    ) {
      return "Start Phase 0 C-suite roundtable (CEO → peers → CEO merge). Confirm?";
    }
    const position = String(args.position ?? "manager");
    const ic = args.targetIc ? ` (IC ${args.targetIc})` : "";
    return `Queue ${position}${ic} and start Cursor now. Confirm?`;
  }
  if (intent === "blocker.resolve") {
    const seat = String(args.seat ?? "blocked seat");
    return `Resolve blocker for ${seat} (queue or rewake owner). Confirm?`;
  }
  if (intent === "dispatch.queue_batch") {
    const items = Array.isArray(args.items) ? args.items : [];
    const count = items.length || "?";
    return `Queue ${count} managers in one batch. Confirm?`;
  }
  if (intent === "spawn.run_ready") {
    const filenames = Array.isArray(args.filenames) ? args.filenames : [];
    if (filenames.length) {
      return `Start ${filenames.length} queued manager${filenames.length === 1 ? "" : "s"}. Confirm?`;
    }
    const limit = args.limit != null ? String(args.limit) : "ready";
    return `Start up to ${limit} queued managers. Confirm?`;
  }
  if (intent === "memory.note") {
    const text = String(args.text ?? "").trim();
    const truncated = text.length > 80 ? `${text.slice(0, 77)}...` : text;
    return `I'll remember: ${truncated}. Confirm?`;
  }
  if (intent === "memory.digest") {
    const venture = String(args.ventureName ?? "this venture");
    return `Write a session digest for ${venture}. Confirm?`;
  }
  if (intent === "memory.reindex") {
    const venture = String(args.ventureName ?? "this venture");
    return `Rebuild memory index for ${venture}. Confirm?`;
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
    const r = result as {
      position?: string;
      runId?: string;
      reviewInboxHint?: string;
      phase0Roundtable?: boolean;
    };
    if (r.phase0Roundtable) {
      return "Phase 0 C-suite roundtable started — CEO intake running.";
    }
    // Never speak raw runIds (e.g. 1784308096815-head-of-research) — TTS reads them as huge numbers.
    const who = (r.position ?? "manager").replace(/-/g, " ");
    return `${who} started. Artifact will land in the review inbox.`;
  }
  if (intent === "runs.watch" && typeof result === "object" && result !== null && "summary" in result) {
    return String((result as { summary: string }).summary);
  }
  if (intent === "runs.get" && typeof result === "object" && result !== null && "run" in result) {
    const envelope = result as {
      run?: { position?: string; status?: string; runId?: string; summary?: string; detail?: string };
      operatorSpoken?: string;
    };
    const run = envelope.run;
    if (!run) return "Run not found.";
    const who = (run.position ?? "seat").replace(/-/g, " ");
    const status = run.status ?? "unknown";
    if (typeof envelope.operatorSpoken === "string" && envelope.operatorSpoken.trim()) {
      return `${who} ${status}. ${envelope.operatorSpoken}`.replace(/\s+/g, " ").trim();
    }
    const detail = run.summary || run.detail;
    return detail
      ? `${who} is ${status}: ${detail}`.replace(/\s+/g, " ").trim()
      : `${who} is ${status}.`;
  }
  if (intent === "blocker.list" && typeof result === "object" && result !== null && "summary" in result) {
    return String((result as { summary: string }).summary);
  }
  if (intent === "brain.ask" && typeof result === "object" && result !== null) {
    const r = result as { spoken?: string; answer?: string };
    if (typeof r.spoken === "string" && r.spoken.trim()) return r.spoken;
    if (typeof r.answer === "string" && r.answer.trim()) return r.answer;
  }
  if (intent === "brain.route" && typeof result === "object" && result !== null) {
    const r = result as {
      spoken?: string;
      intent?: string;
      clarifyQuestion?: string;
      spokenHint?: string;
    };
    if (typeof r.spoken === "string" && r.spoken.trim()) return r.spoken;
    if (typeof r.clarifyQuestion === "string" && r.clarifyQuestion.trim()) {
      return r.clarifyQuestion;
    }
    if (typeof r.spokenHint === "string" && r.spokenHint.trim()) return r.spokenHint;
    if (typeof r.intent === "string" && r.intent.trim()) return `Routed as ${r.intent}.`;
  }
  if (
    intent === "blocker.resolve" &&
    typeof result === "object" &&
    result !== null &&
    "spoken" in result
  ) {
    const r = result as { spoken?: string; runId?: string; action?: string };
    return String(r.spoken ?? "Blocker resolve started.");
  }
  if (intent === "dispatch.queue_batch" && typeof result === "object" && result !== null) {
    const r = result as { spoken?: string; filenames?: string[] };
    if (typeof r.spoken === "string" && r.spoken.trim()) return r.spoken;
    const n = r.filenames?.length ?? 0;
    return n ? `Queued ${n} managers.` : "Batch queue complete.";
  }
  if (intent === "spawn.run_ready" && typeof result === "object" && result !== null) {
    const r = result as { spoken?: string };
    if (typeof r.spoken === "string" && r.spoken.trim()) return r.spoken;
    return "Managers started.";
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
  if (intent === "memory.note" && typeof result === "object" && result !== null && "path" in result) {
    return `Saved to ${(result as { path: string }).path}.`;
  }
  if (intent === "memory.brief" && typeof result === "object" && result !== null && "spoken" in result) {
    return String((result as { spoken: string }).spoken);
  }
  if (intent === "memory.recall" && typeof result === "object" && result !== null && "summary" in result) {
    return String((result as { summary: string }).summary);
  }
  if (intent === "memory.digest" && typeof result === "object" && result !== null && "spoken" in result) {
    return String((result as { spoken: string }).spoken);
  }
  if (intent === "memory.reindex" && typeof result === "object" && result !== null && "count" in result) {
    return `Reindexed ${(result as { count: number }).count} memory chunks.`;
  }
  return `Done: ${intent.replace(/\./g, " ")}.`;
}

function resolveMode(raw: Record<string, unknown>, roomId: string): JarvisMode {
  const server = getRoomMode(roomId);
  // Once the room has left briefing, prefer server — voice clients often keep
  // sending stale "briefing" after set_mode, which blocked spawn and looped set_mode.
  if (server !== "briefing") return server;
  const mode = raw.mode;
  if (mode === "briefing" || mode === "ops" || mode === "review" || mode === "architect") {
    return mode;
  }
  return server;
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
    let pending: { intent: JarvisIntent; args: unknown; mode: JarvisMode } | null = null;

    if (confirmToken) {
      pending = consumeConfirm(roomId, confirmToken);
      // Voice models invent fake tokens (e.g. token_123) because TTS omits the UUID.
      // Recover by consuming the latest pending confirm for the same intent.
      if (!pending || pending.intent !== act.intent) {
        const latest = peekLatestConfirm(roomId);
        if (latest && latest.intent === act.intent) {
          pending = consumeConfirm(roomId, latest.token);
        } else {
          pending = null;
        }
      }
      if (pending && pending.intent === act.intent) {
        auditJarvis({ roomId, type: "jarvis_confirm", intent: act.intent }, repoRoot);
        execArgs =
          typeof pending.args === "object" && pending.args !== null && !Array.isArray(pending.args)
            ? { ...(pending.args as Record<string, unknown>), roomId }
            : { roomId };
      }
    }

    if (!pending || pending.intent !== act.intent) {
      // Pre-normalize work.request so repeat-as-yes only fires on matching args.
      let incomingWorkArgs: Record<string, unknown> | null = null;
      if (act.intent === "work.request" && !confirmToken) {
        try {
          incomingWorkArgs = normalizeWorkRequestConfirmArgs(
            repoRoot,
            roomId,
            act.args,
          );
        } catch (err) {
          const reason =
            err instanceof JarvisExecError || err instanceof Error
              ? err.message
              : "Invalid request";
          auditJarvis(
            { roomId, type: "jarvis_error", intent: act.intent, detail: reason },
            repoRoot,
          );
          return { status: "error", reason };
        }
      }

      const existing = peekLatestConfirm(roomId);
      if (existing && existing.intent === act.intent && !confirmToken) {
        // Voice models often re-call work_request on "yes" instead of jarvis_confirm.
        // After Confirm? has been out for a moment, treat a *matching* repeat as accept.
        const ageMs = Date.now() - existing.createdAt;
        const argsMatch =
          act.intent !== "work.request" ||
          (incomingWorkArgs != null &&
            sameConfirmArgs(existing.args, incomingWorkArgs));
        if (ageMs >= 2000 && argsMatch) {
          pending = consumeConfirm(roomId, existing.token);
          if (pending && pending.intent === act.intent) {
            auditJarvis({ roomId, type: "jarvis_confirm", intent: act.intent }, repoRoot);
            execArgs =
              typeof pending.args === "object" &&
              pending.args !== null &&
              !Array.isArray(pending.args)
                ? { ...(pending.args as Record<string, unknown>), roomId }
                : { roomId };
          }
        } else if (argsMatch) {
          const summary = confirmSummary(
            act.intent,
            typeof existing.args === "object" &&
              existing.args !== null &&
              !Array.isArray(existing.args)
              ? (existing.args as Record<string, unknown>)
              : act.args,
          );
          setLastSummary(roomId, summary);
          return { status: "needs_confirm", token: existing.token, summary };
        }
        // Mismatched args: fall through and replace pending with a new Confirm?
      }

      // Confirmed via repeat work_request — skip creating another confirm.
      if (!(pending && pending.intent === act.intent)) {
        let confirmArgs: Record<string, unknown> = act.args;
        if (act.intent === "dispatch.queue_for") {
          try {
            confirmArgs = normalizeQueueForArgs(repoRoot, act.args);
          } catch (err) {
            const reason =
              err instanceof JarvisExecError || err instanceof Error
                ? err.message
                : "Invalid request";
            auditJarvis(
              { roomId, type: "jarvis_error", intent: act.intent, detail: reason },
              repoRoot,
            );
            return { status: "error", reason };
          }
        }
        if (act.intent === "work.request") {
          if (incomingWorkArgs) {
            confirmArgs = incomingWorkArgs;
          } else {
            try {
              confirmArgs = normalizeWorkRequestConfirmArgs(
                repoRoot,
                roomId,
                act.args,
              );
            } catch (err) {
              const reason =
                err instanceof JarvisExecError || err instanceof Error
                  ? err.message
                  : "Invalid request";
              auditJarvis(
                { roomId, type: "jarvis_error", intent: act.intent, detail: reason },
                repoRoot,
              );
              return { status: "error", reason };
            }
          }
        }
        const token = createConfirmToken(roomId, act.intent, confirmArgs, mode);
        let summaryArgs: Record<string, unknown> = confirmArgs;
        if (act.intent === "memory.digest" || act.intent === "memory.reindex") {
          try {
            const reg = loadRegistry(repoRoot);
            summaryArgs = {
              ...confirmArgs,
              ventureName: reg.projects[reg.active]?.name ?? reg.active,
            };
          } catch {
            /* use default venture label */
          }
        }
        const summary = confirmSummary(act.intent, summaryArgs);
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
    }
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

function looksLikeConfirmToken(token: string): boolean {
  // Real tokens are UUIDs from createConfirmToken. Spoken phrases / invents are not.
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    token.trim(),
  );
}

export async function handleJarvisConfirm(
  repoRoot: string,
  roomId: string,
  token: string,
  accept?: boolean,
): Promise<JarvisActResult> {
  // Token is optional for voice: resolve latest pending when omitted or invented.
  let resolvedToken = looksLikeConfirmToken(token) ? token.trim() : "";
  if (!resolvedToken) {
    const latest = peekLatestConfirm(roomId);
    if (!latest) {
      // Voice often confirms twice (work_request redirect + jarvis_confirm). Soft-ok.
      if (accept === true) {
        return {
          status: "ok",
          summary: "Nothing pending — already confirmed or expired.",
        };
      }
      return { status: "error", reason: "No pending confirmation" };
    }
    resolvedToken = latest.token;
  } else if (!peekConfirm(roomId, resolvedToken)) {
    const latest = peekLatestConfirm(roomId);
    if (!latest) {
      if (accept === true) {
        return {
          status: "ok",
          summary: "Nothing pending — already confirmed or expired.",
        };
      }
      auditJarvis(
        { roomId, type: "jarvis_error", detail: "Invalid or expired confirm token" },
        repoRoot,
      );
      return { status: "error", reason: "Invalid or expired confirm token" };
    }
    resolvedToken = latest.token;
  }

  if (accept !== true) {
    const cancelled = cancelConfirm(roomId, resolvedToken);
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

  const pending = peekConfirm(roomId, resolvedToken);
  if (!pending) {
    // Race: pending was consumed by parallel work_request auto-confirm.
    return {
      status: "ok",
      summary: "Nothing pending — already confirmed or expired.",
    };
  }

  return handleJarvisAct(repoRoot, roomId, {
    intent: pending.intent,
    args: pending.args,
    confirmToken: resolvedToken,
    mode: pending.mode,
  });
}
