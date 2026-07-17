import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { estimateCostUsd, loadCostRates } from "../src/lib/cost-rates";
import { claimDispatch, listQueuedDispatches } from "../src/lib/dispatch-queue";
import { MAX_BATCH } from "./jarvis/dispatch-for";
import {
  assertBudgetAllowsSpawn,
  type RunRecord,
  type WakeReason,
} from "../src/lib/runs";
import type { ManagerPacket } from "../src/lib/types";
import { appendActivity } from "./activity";
import { appendRunEvent } from "./jarvis/run-events";
import {
  isSeatPaused,
  readAgentState,
  setSeatBudget,
  setSeatPaused,
} from "./agent-state";
import { businessIdeaFile, dispatchRoot } from "./paths";
import { registerRun, unregisterRun } from "./run-registry";
import { cursorRuntimeAdapter, type RuntimeAdapter } from "./runtime-adapter";
import { writeSession, readSession, findSessionByAgentId } from "./sessions";
import { isOverBudget, loadSpend, recordSpend, seatSpendUsd } from "./spend";
import { evaluateRunAcceptance } from "./jarvis/run-acceptance";

export function buildSpawnPrompt(
  packet: ManagerPacket,
  repoRoot: string,
  runId?: string,
): string {
  const heartbeatPath = `skills/org/positions/${packet.position}/HEARTBEAT.md`;
  const ancestry = [
    "## Goal ancestry",
    `- company: ${packet.company_goal ?? "(unset)"}`,
    `- parent: ${packet.parent_goal ?? "(unset)"}`,
    `- task: ${packet.goal}`,
    packet.goal_path?.length
      ? `- path: ${packet.goal_path.join(" → ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const inboxDir = businessIdeaFile(repoRoot, "REVIEW/inbox/");
  const handoffsDir = businessIdeaFile(repoRoot, "HANDOFFS/");
  const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
  const inboxHint = `${inboxDir}${packet.phase}-${packet.position}-${ts}-deliverable.md`;

  const frontmatterFields = [
    "status: pending_review",
    "position",
    "phase",
    "goal",
    "created",
    ...(runId ? [`runId: ${runId}`] : []),
  ].join(", ");

  const acceptanceLines: string[] = [];
  const hasAcceptance =
    packet.preferred_ic ||
    packet.require_inbox === true ||
    packet.require_ic_handoff === true;

  if (hasAcceptance) {
    acceptanceLines.push(
      "## Hard acceptance criteria",
      "These deliverables are mandatory — not suggestions. The run fails acceptance if any are missing.",
    );
    if (packet.preferred_ic) {
      acceptanceLines.push(
        `- Spawn and delegate to preferred IC \`${packet.preferred_ic}\` (write lease required).`,
      );
    }
    if (packet.require_inbox === true) {
      acceptanceLines.push(
        `- require_inbox: write at least one deliverable under ${inboxDir} with YAML frontmatter including ${frontmatterFields}.`,
      );
    }
    if (packet.require_ic_handoff === true && packet.preferred_ic) {
      acceptanceLines.push(
        `- require_ic_handoff: write at least one handoff under ${handoffsDir} for \`${packet.preferred_ic}\` with a non-empty status.`,
      );
    } else if (packet.require_ic_handoff === true) {
      acceptanceLines.push(
        `- require_ic_handoff: write at least one handoff under ${handoffsDir} with a non-empty status.`,
      );
    }
  }

  return [
    `You are the digital worker for position \`${packet.position}\`.`,
    `Read skills/org/positions/${packet.position}/SKILL.md and skills/org/MODEL-REGISTRY.md first.`,
    `If ${heartbeatPath} exists, follow that on-wake checklist after SKILL.md.`,
    `Execute this manager context packet. Do not spawn peer managers. Spawn only allowed ICs with write leases.`,
    `Write handoffs under ${handoffsDir}. Do not mark the phase complete.`,
    `Primary operator review artifact: write the deliverable to ${inboxHint} (or another file under ${inboxDir}) with YAML frontmatter ${frontmatterFields}.`,
    ...(acceptanceLines.length ? ["", ...acceptanceLines] : []),
    "",
    ancestry,
    "",
    "```yaml",
    YAML.stringify(packet).trim(),
    "```",
  ].join("\n");
}

export function buildRewakePrompt(
  packet: ManagerPacket,
  repoRoot: string,
  instruction?: string,
  runId?: string,
): string {
  const lines = [
    "Continue the manager packet. Read HEARTBEAT if present. Do not restart from scratch.",
    "Pick up unfinished work, update handoffs, respect write leases.",
  ];
  if (instruction?.trim()) {
    lines.unshift(
      "## Operator instruction (new)",
      instruction.trim(),
      "Continue the existing packet. Do not discard prior work.",
      "",
    );
  }
  lines.push("", buildSpawnPrompt(packet, repoRoot, runId));
  return lines.join("\n");
}

function writeRun(runsDir: string, record: RunRecord) {
  mkdirSync(runsDir, { recursive: true });
  writeFileSync(join(runsDir, `${record.runId}.json`), JSON.stringify(record, null, 2));
}

function effectiveBudget(
  root: string,
  position: string,
  packetBudget: number | null | undefined,
): number | null {
  const seatBudget = readAgentState(root, position)?.budget_usd;
  if (typeof seatBudget === "number" && seatBudget > 0) return seatBudget;
  if (typeof packetBudget === "number" && packetBudget > 0) return packetBudget;
  return null;
}

function applyUsageToRun(
  root: string,
  record: RunRecord,
  result: { usage?: RunRecord["usage"]; durationMs?: number; agentId?: string },
  model: string,
): RunRecord {
  const cost = estimateCostUsd(
    result.usage,
    model,
    loadCostRates(process.env as Record<string, string | undefined>),
  );
  const next: RunRecord = {
    ...record,
    agentId: result.agentId ?? record.agentId,
    usage: result.usage,
    cost_usd: cost,
    duration_ms: result.durationMs,
  };
  if (result.usage || cost > 0) {
    recordSpend(root, record.position, cost, result.usage);
    appendActivity(root, {
      type: "cost_recorded",
      runId: record.runId,
      position: record.position,
      detail: `$${cost}`,
    });
    const budget = effectiveBudget(root, record.position, null);
    const spent = seatSpendUsd(loadSpend(root), record.position);
    // also check packet budget stored on agent-state or from spend vs budget
    const stateBudget = readAgentState(root, record.position)?.budget_usd;
    const limit =
      typeof stateBudget === "number" && stateBudget > 0
        ? stateBudget
        : budget;
    if (isOverBudget(spent, limit ?? undefined)) {
      setSeatPaused(root, record.position, true);
      appendActivity(root, {
        type: "budget_exhausted",
        position: record.position,
        detail: `spent $${spent} >= budget $${limit}`,
      });
    }
  }
  return next;
}

function beginRunRecord(args: {
  root: string;
  packet: ManagerPacket;
  dispatchFilename: string;
  wakeReason: WakeReason;
  agentId?: string;
}): { runId: string; controller: AbortController; meta: RunRecord; runsDir: string } {
  const { root, packet, dispatchFilename, wakeReason, agentId } = args;
  const runsDir = join(root, "runs");
  mkdirSync(runsDir, { recursive: true });
  const runId = `${Date.now()}-${packet.position}`;
  const controller = new AbortController();
  registerRun(runId, controller);
  const meta: RunRecord = {
    runId,
    status: "running",
    position: packet.position,
    phase: packet.phase,
    claimed: dispatchFilename,
    dispatch_filename: dispatchFilename,
    wake_reason: wakeReason,
    started_at: new Date().toISOString(),
    llm_model: packet.llm_model,
    agentId,
  };
  writeRun(runsDir, meta);
  appendActivity(root, {
    type: wakeReason === "rewake" ? "rewake_started" : "spawn_started",
    runId,
    position: packet.position,
    detail: wakeReason,
  });
  appendRunEvent(root, {
    at: new Date().toISOString(),
    type: "started",
    runId,
    position: packet.position,
    detail: wakeReason,
  });
  return { runId, controller, meta, runsDir };
}

async function finishAdapterRun(args: {
  repoRoot: string;
  root: string;
  packet: ManagerPacket;
  dispatchFilename: string;
  prompt: string;
  agentId?: string;
  adapter: RuntimeAdapter;
  apiKey: string;
  runId: string;
  controller: AbortController;
  meta: RunRecord;
  runsDir: string;
}): Promise<{
  ok: boolean;
  error?: string;
  runId?: string;
  packet?: ManagerPacket;
}> {
  const {
    root,
    packet,
    dispatchFilename,
    prompt,
    agentId,
    adapter,
    apiKey,
    repoRoot,
    runId,
    controller,
    meta,
    runsDir,
  } = args;

  try {
    const result = await adapter.run({
      prompt,
      model: packet.llm_model || "composer-2.5",
      cwd: repoRoot,
      apiKey,
      signal: controller.signal,
      agentId,
    });
    const statusRaw = String(result.status ?? "completed");
    const status: RunRecord["status"] =
      statusRaw === "error"
        ? "error"
        : statusRaw === "cancelled"
          ? "cancelled"
          : "completed";
    let done: RunRecord = {
      ...meta,
      status,
      finished_at: new Date().toISOString(),
      result:
        typeof result.result === "string" ? result.result.slice(0, 4000) : result.result,
      agentId: result.agentId ?? agentId,
    };

    done = applyUsageToRun(root, done, result, packet.llm_model);
    const spent = seatSpendUsd(loadSpend(root), packet.position);
    const limit = effectiveBudget(root, packet.position, packet.budget_usd);
    if (isOverBudget(spent, limit)) {
      setSeatPaused(root, packet.position, true);
      appendActivity(root, {
        type: "budget_exhausted",
        position: packet.position,
        detail: `spent $${spent} >= budget $${limit}`,
      });
    }

    if (done.status === "completed") {
      const acceptance = evaluateRunAcceptance(repoRoot, { runId, packet });
      done = { ...done, acceptance };
      if (!acceptance.ok) {
        done.status = "completed_with_gaps";
        appendActivity(root, {
          type: "spawn_acceptance_failed",
          runId,
          position: packet.position,
          detail: acceptance.missing.join(", "),
        });
        appendRunEvent(root, {
          at: new Date().toISOString(),
          type: "acceptance_failed",
          runId,
          position: packet.position,
          detail: acceptance.missing.join(", "),
        });
      }
    }

    writeRun(runsDir, done);
    if (done.agentId) {
      writeSession(root, {
        agentId: done.agentId,
        position: packet.position,
        phase: packet.phase,
        dispatch_filename: dispatchFilename,
        updated_at: new Date().toISOString(),
        status: done.status,
      });
    }
    if (done.status === "completed") {
      appendActivity(root, {
        type: "spawn_finished",
        runId,
        position: packet.position,
      });
      appendRunEvent(root, {
        at: new Date().toISOString(),
        type: "finished",
        runId,
        position: packet.position,
      });
    }
    unregisterRun(runId);
    return { ok: true, runId, packet };
  } catch (e) {
    const aborted =
      (e instanceof Error && (e.name === "AbortError" || e.message === "Aborted")) ||
      controller.signal.aborted;
    const err = e instanceof Error ? e.message : String(e);
    const done: RunRecord = {
      ...meta,
      status: aborted ? "cancelled" : "error",
      finished_at: new Date().toISOString(),
      error: err,
    };
    writeRun(runsDir, done);
    if (!aborted) {
      appendActivity(root, {
        type: "spawn_error",
        runId,
        position: packet.position,
        detail: err,
      });
      appendRunEvent(root, {
        at: new Date().toISOString(),
        type: "error",
        runId,
        position: packet.position,
        detail: err,
      });
    } else {
      appendActivity(root, {
        type: "spawn_cancelled",
        runId,
        position: packet.position,
        detail: err,
      });
    }
    unregisterRun(runId);
    return {
      ok: false,
      error: aborted ? "cancelled" : err,
      runId,
      packet,
    };
  }
}

async function runAdapterAndPersist(args: {
  repoRoot: string;
  root: string;
  packet: ManagerPacket;
  dispatchFilename: string;
  wakeReason: WakeReason;
  agentId?: string;
  adapter: RuntimeAdapter;
  apiKey: string;
  instruction?: string;
}): Promise<{
  ok: boolean;
  error?: string;
  runId?: string;
  packet?: ManagerPacket;
}> {
  const { runId, controller, meta, runsDir } = beginRunRecord(args);
  const prompt =
    args.wakeReason === "rewake"
      ? buildRewakePrompt(args.packet, args.repoRoot, args.instruction, runId)
      : buildSpawnPrompt(args.packet, args.repoRoot, runId);
  return finishAdapterRun({ ...args, prompt, runId, controller, meta, runsDir });
}

type ClaimReady = {
  ok: true;
  apiKey: string;
  root: string;
  wakeReason: WakeReason;
  adapter: RuntimeAdapter;
  packet: ManagerPacket;
  filename: string;
  claimedPath: string;
};

type ClaimFail = { ok: false; error: string };

function claimManagerForSpawn(
  repoRoot: string,
  opts?: {
    filename?: string;
    wakeReason?: WakeReason;
    adapter?: RuntimeAdapter;
    apiKey?: string | null;
  },
): ClaimReady | ClaimFail {
  const apiKey = opts?.apiKey !== undefined ? opts.apiKey : process.env.CURSOR_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: "CURSOR_API_KEY missing — packet not claimed. Set it in .env.local",
    };
  }

  const root = dispatchRoot(repoRoot);
  const wakeReason: WakeReason = opts?.wakeReason ?? "on_demand";
  const adapter = opts?.adapter ?? cursorRuntimeAdapter;
  mkdirSync(join(root, "queue"), { recursive: true });
  mkdirSync(join(root, "claimed"), { recursive: true });

  let peekFilename = opts?.filename;
  if (!peekFilename) {
    const files = listQueuedDispatches(root);
    if (!files.length) return { ok: false, error: "DISPATCH queue empty" };
    peekFilename = files[0];
  }

  const peekPath = join(root, "queue", peekFilename);
  if (!existsSync(peekPath)) {
    return { ok: false, error: `dispatch file not in queue: ${peekFilename}` };
  }

  let peekPacket: ManagerPacket;
  try {
    peekPacket = YAML.parse(readFileSync(peekPath, "utf8")) as ManagerPacket;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  const budget = assertBudgetAllowsSpawn(peekPacket);
  if (!budget.ok) {
    appendActivity(root, {
      type: "spawn_refused_budget",
      position: peekPacket.position,
      detail: budget.error,
    });
    return { ok: false, error: budget.error };
  }

  const limit = effectiveBudget(root, peekPacket.position, peekPacket.budget_usd);
  const spent = seatSpendUsd(loadSpend(root), peekPacket.position);
  if (isOverBudget(spent, limit)) {
    appendActivity(root, {
      type: "spawn_refused_budget",
      position: peekPacket.position,
      detail: `spent $${spent} >= budget $${limit}`,
    });
    return { ok: false, error: `budget exhausted: spent $${spent} >= $${limit}` };
  }

  if (isSeatPaused(root, peekPacket.position)) {
    appendActivity(root, {
      type: "spawn_refused_paused",
      position: peekPacket.position,
      detail: `seat paused: ${peekPacket.position}`,
    });
    return { ok: false, error: `seat paused: ${peekPacket.position}` };
  }

  if (typeof peekPacket.budget_usd === "number" && peekPacket.budget_usd > 0) {
    setSeatBudget(root, peekPacket.position, peekPacket.budget_usd);
  }

  const claimed = claimDispatch(root, { filename: opts?.filename });
  if (!claimed.ok) return { ok: false, error: claimed.error };

  const packet = YAML.parse(claimed.content) as ManagerPacket;
  return {
    ok: true,
    apiKey,
    root,
    wakeReason,
    adapter,
    packet,
    filename: claimed.filename,
    claimedPath: claimed.claimedPath,
  };
}

export async function spawnClaimedManager(
  repoRoot: string,
  opts?: {
    filename?: string;
    wakeReason?: WakeReason;
    adapter?: RuntimeAdapter;
    apiKey?: string | null;
  },
): Promise<{
  ok: boolean;
  error?: string;
  runId?: string;
  claimedPath?: string;
  packet?: ManagerPacket;
  filename?: string;
  position?: string;
}> {
  const claimed = claimManagerForSpawn(repoRoot, opts);
  if (!claimed.ok) return claimed;

  const result = await runAdapterAndPersist({
    repoRoot,
    root: claimed.root,
    packet: claimed.packet,
    dispatchFilename: claimed.filename,
    wakeReason: claimed.wakeReason,
    adapter: claimed.adapter,
    apiKey: claimed.apiKey,
  });

  return {
    ...result,
    claimedPath: claimed.claimedPath,
    filename: claimed.filename,
    position: claimed.packet.position,
  };
}

/**
 * Claim + start Cursor run without awaiting completion (voice confirm path).
 */
export function spawnClaimedManagerDetached(
  repoRoot: string,
  opts?: {
    filename?: string;
    wakeReason?: WakeReason;
    adapter?: RuntimeAdapter;
    apiKey?: string | null;
  },
): {
  ok: boolean;
  error?: string;
  runId?: string;
  claimedPath?: string;
  packet?: ManagerPacket;
  filename?: string;
  position?: string;
} {
  const claimed = claimManagerForSpawn(repoRoot, opts);
  if (!claimed.ok) return claimed;

  const { runId, controller, meta, runsDir } = beginRunRecord({
    root: claimed.root,
    packet: claimed.packet,
    dispatchFilename: claimed.filename,
    wakeReason: claimed.wakeReason,
  });
  const prompt = buildSpawnPrompt(claimed.packet, repoRoot, runId);

  void finishAdapterRun({
    repoRoot,
    root: claimed.root,
    packet: claimed.packet,
    dispatchFilename: claimed.filename,
    prompt,
    adapter: claimed.adapter,
    apiKey: claimed.apiKey,
    runId,
    controller,
    meta,
    runsDir,
  });

  return {
    ok: true,
    runId,
    claimedPath: claimed.claimedPath,
    packet: claimed.packet,
    filename: claimed.filename,
    position: claimed.packet.position,
  };
}

type RewakeReady = {
  ok: true;
  apiKey: string;
  root: string;
  wakeReason: WakeReason;
  adapter: RuntimeAdapter;
  packet: ManagerPacket;
  filename: string;
  agentId?: string;
  instruction?: string;
};

function prepareRewake(
  repoRoot: string,
  opts: {
    dispatchFilename?: string;
    agentId?: string;
    instruction?: string;
    wakeReason?: WakeReason;
    adapter?: RuntimeAdapter;
    apiKey?: string | null;
  },
): RewakeReady | ClaimFail {
  const apiKey = opts.apiKey !== undefined ? opts.apiKey : process.env.CURSOR_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "CURSOR_API_KEY missing" };
  }

  const root = dispatchRoot(repoRoot);
  const adapter = opts.adapter ?? cursorRuntimeAdapter;
  const wakeReason: WakeReason = opts.wakeReason ?? "rewake";

  let session = opts.dispatchFilename
    ? readSession(root, opts.dispatchFilename)
    : null;
  if (!session && opts.agentId) {
    session = findSessionByAgentId(root, opts.agentId);
  }
  if (!session) {
    return { ok: false, error: "session not found" };
  }

  if (isSeatPaused(root, session.position)) {
    return { ok: false, error: `seat paused: ${session.position}` };
  }

  const claimedPath = join(root, "claimed", session.dispatch_filename);
  if (!existsSync(claimedPath)) {
    return { ok: false, error: `claimed packet missing: ${session.dispatch_filename}` };
  }

  const packet = YAML.parse(readFileSync(claimedPath, "utf8")) as ManagerPacket;
  const limit = effectiveBudget(root, packet.position, packet.budget_usd);
  const spent = seatSpendUsd(loadSpend(root), packet.position);
  if (isOverBudget(spent, limit)) {
    return { ok: false, error: `budget exhausted: spent $${spent} >= $${limit}` };
  }

  return {
    ok: true,
    apiKey,
    root,
    wakeReason,
    adapter,
    packet,
    filename: session.dispatch_filename,
    agentId: session.agentId,
    instruction: opts.instruction,
  };
}

/** Start rewake without awaiting Cursor (voice confirm path). */
export function rewakeSessionDetached(
  repoRoot: string,
  opts: {
    dispatchFilename?: string;
    agentId?: string;
    instruction?: string;
    wakeReason?: WakeReason;
    adapter?: RuntimeAdapter;
    apiKey?: string | null;
  },
): {
  ok: boolean;
  error?: string;
  runId?: string;
  packet?: ManagerPacket;
  position?: string;
  filename?: string;
} {
  const prepared = prepareRewake(repoRoot, opts);
  if (!prepared.ok) return prepared;

  const { runId, controller, meta, runsDir } = beginRunRecord({
    root: prepared.root,
    packet: prepared.packet,
    dispatchFilename: prepared.filename,
    wakeReason: prepared.wakeReason,
    agentId: prepared.agentId,
  });
  const prompt = buildRewakePrompt(
    prepared.packet,
    repoRoot,
    prepared.instruction,
    runId,
  );

  void finishAdapterRun({
    repoRoot,
    root: prepared.root,
    packet: prepared.packet,
    dispatchFilename: prepared.filename,
    prompt,
    adapter: prepared.adapter,
    apiKey: prepared.apiKey,
    runId,
    controller,
    meta,
    runsDir,
    agentId: prepared.agentId,
  });

  return {
    ok: true,
    runId,
    packet: prepared.packet,
    position: prepared.packet.position,
    filename: prepared.filename,
  };
}

export async function rewakeSession(
  repoRoot: string,
  opts: {
    dispatchFilename?: string;
    agentId?: string;
    instruction?: string;
    wakeReason?: WakeReason;
    adapter?: RuntimeAdapter;
    apiKey?: string | null;
  },
): Promise<{
  ok: boolean;
  error?: string;
  runId?: string;
  packet?: ManagerPacket;
}> {
  const prepared = prepareRewake(repoRoot, opts);
  if (!prepared.ok) return prepared;

  return runAdapterAndPersist({
    repoRoot,
    root: prepared.root,
    packet: prepared.packet,
    dispatchFilename: prepared.filename,
    wakeReason: prepared.wakeReason,
    agentId: prepared.agentId,
    adapter: prepared.adapter,
    apiKey: prepared.apiKey,
    instruction: prepared.instruction,
  });
}

function spawnSeatLabel(slug: string): string {
  if (slug === "ceo-strategist") return "CEO";
  return slug.replace(/-/g, " ");
}

export function summarizeSpawnRunReadySpoken(
  started: Array<{ position: string }>,
  skipped: Array<{ position?: string; filename: string; reason: string }>,
): string {
  const startedLabels = started.map((s) => spawnSeatLabel(s.position));
  if (!started.length && skipped.length) {
    const skip = skipped[0];
    const who = skip.position ? spawnSeatLabel(skip.position) : skip.filename;
    return `Skipped ${who} (${skip.reason}).`;
  }
  if (!started.length) {
    return "No managers started.";
  }
  let head = "";
  if (startedLabels.length === 1) {
    head = `Started ${startedLabels[0]}.`;
  } else {
    const last = startedLabels[startedLabels.length - 1];
    const rest = startedLabels.slice(0, -1);
    head = `Started ${rest.join(", ")} and ${last}.`;
  }
  if (!skipped.length) return head;
  const skipParts = skipped.map((s) => {
    const who = s.position ? spawnSeatLabel(s.position) : s.filename;
    return `${who} (${s.reason})`;
  });
  return `${head.replace(/\.$/, "")}; skipped ${skipParts.join(", ")}.`;
}

export function spawnRunReady(
  repoRoot: string,
  opts?: {
    filenames?: string[];
    limit?: number;
    wakeReason?: WakeReason;
    apiKey?: string | null;
    adapter?: RuntimeAdapter;
  },
): {
  ok: boolean;
  error?: string;
  started: Array<{ position: string; runId: string; filename: string }>;
  skipped: Array<{ position?: string; filename: string; reason: string }>;
  spoken: string;
} {
  const limit =
    typeof opts?.limit === "number" && Number.isFinite(opts.limit) && opts.limit > 0
      ? Math.min(Math.floor(opts.limit), MAX_BATCH)
      : MAX_BATCH;

  let targets: string[] = [];
  if (opts?.filenames?.length) {
    targets = opts.filenames.slice(0, limit);
  } else {
    targets = listQueuedDispatches(dispatchRoot(repoRoot)).slice(0, limit);
  }

  if (!targets.length) {
    return {
      ok: false,
      error: "DISPATCH queue empty",
      started: [],
      skipped: [],
      spoken: "No queued managers to start.",
    };
  }

  const started: Array<{ position: string; runId: string; filename: string }> = [];
  const skipped: Array<{ position?: string; filename: string; reason: string }> = [];

  for (const filename of targets) {
    const result = spawnClaimedManagerDetached(repoRoot, {
      filename,
      wakeReason: opts?.wakeReason ?? "on_demand",
      apiKey: opts?.apiKey,
      adapter: opts?.adapter,
    });
    if (result.ok && result.runId && result.position) {
      started.push({
        position: result.position,
        runId: result.runId,
        filename: result.filename ?? filename,
      });
      continue;
    }
    skipped.push({
      position: result.position,
      filename,
      reason: result.error ?? "spawn failed",
    });
  }

  return {
    ok: started.length > 0,
    error: started.length ? undefined : skipped[0]?.reason ?? "spawn failed",
    started,
    skipped,
    spoken: summarizeSpawnRunReadySpoken(started, skipped),
  };
}
