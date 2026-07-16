import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { estimateCostUsd, loadCostRates } from "../src/lib/cost-rates";
import { claimDispatch, listQueuedDispatches } from "../src/lib/dispatch-queue";
import {
  assertBudgetAllowsSpawn,
  type RunRecord,
  type WakeReason,
} from "../src/lib/runs";
import type { ManagerPacket } from "../src/lib/types";
import { appendActivity } from "./activity";
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

export function buildSpawnPrompt(packet: ManagerPacket, repoRoot: string): string {
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

  return [
    `You are the digital worker for position \`${packet.position}\`.`,
    `Read skills/org/positions/${packet.position}/SKILL.md and skills/org/MODEL-REGISTRY.md first.`,
    `If ${heartbeatPath} exists, follow that on-wake checklist after SKILL.md.`,
    `Execute this manager context packet. Do not spawn peer managers. Spawn only allowed ICs with write leases.`,
    `Write handoffs under ${businessIdeaFile(repoRoot, "HANDOFFS/")}. Do not mark the phase complete.`,
    "",
    ancestry,
    "",
    "```yaml",
    YAML.stringify(packet).trim(),
    "```",
  ].join("\n");
}

export function buildRewakePrompt(packet: ManagerPacket, repoRoot: string): string {
  return [
    "Continue the manager packet. Read HEARTBEAT if present. Do not restart from scratch.",
    "Pick up unfinished work, update handoffs, respect write leases.",
    "",
    buildSpawnPrompt(packet, repoRoot),
  ].join("\n");
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

async function runAdapterAndPersist(args: {
  repoRoot: string;
  root: string;
  packet: ManagerPacket;
  dispatchFilename: string;
  wakeReason: WakeReason;
  prompt: string;
  agentId?: string;
  adapter: RuntimeAdapter;
  apiKey: string;
}): Promise<{
  ok: boolean;
  error?: string;
  runId?: string;
  packet?: ManagerPacket;
}> {
  const { root, packet, dispatchFilename, wakeReason, prompt, agentId, adapter, apiKey, repoRoot } =
    args;
  const runsDir = join(root, "runs");
  mkdirSync(runsDir, { recursive: true });

  const runId = `${Date.now()}-${packet.position}`;
  const controller = new AbortController();
  registerRun(runId, controller);

  let meta: RunRecord = {
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
    // budget check against packet budget
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
    appendActivity(root, {
      type: "spawn_finished",
      runId,
      position: packet.position,
    });
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
    appendActivity(root, {
      type: aborted ? "spawn_cancelled" : "spawn_error",
      runId,
      position: packet.position,
      detail: err,
    });
    unregisterRun(runId);
    return {
      ok: false,
      error: aborted ? "cancelled" : err,
      runId,
      packet,
    };
  }
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
}> {
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

  // persist packet budget onto seat state for later burn checks
  if (typeof peekPacket.budget_usd === "number" && peekPacket.budget_usd > 0) {
    setSeatBudget(root, peekPacket.position, peekPacket.budget_usd);
  }

  const claimed = claimDispatch(root, { filename: opts?.filename });
  if (!claimed.ok) return { ok: false, error: claimed.error };

  const packet = YAML.parse(claimed.content) as ManagerPacket;
  const result = await runAdapterAndPersist({
    repoRoot,
    root,
    packet,
    dispatchFilename: claimed.filename,
    wakeReason,
    prompt: buildSpawnPrompt(packet, repoRoot),
    adapter,
    apiKey,
  });

  return {
    ...result,
    claimedPath: claimed.claimedPath,
  };
}

export async function rewakeSession(
  repoRoot: string,
  opts: {
    dispatchFilename?: string;
    agentId?: string;
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

  return runAdapterAndPersist({
    repoRoot,
    root,
    packet,
    dispatchFilename: session.dispatch_filename,
    wakeReason,
    prompt: buildRewakePrompt(packet, repoRoot),
    agentId: session.agentId,
    adapter,
    apiKey,
  });
}
