import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import type { ManagerPacketInput } from "../../src/lib/types";
import type { WakeReason } from "../../src/lib/runs";
import {
  buildCompanyDigest,
} from "../../src/jarvis/company-digest";
import { renderStandupBriefing } from "../../src/jarvis/briefings";
import { CSUITE_SLUGS } from "../../src/jarvis/csuite";
import { buildSeatReport, seatReportBriefScript } from "../../src/jarvis/seat-report";
import { enrichSeatReportWithGrokBrief } from "./seat-brief-rewrite";
import { enrichBlockedSeatsWithGrok } from "./threat-brief-rewrite";
import { resolveSeatSlug } from "./resolve-seat";
import { appendActivity } from "../activity";
import { ackHandoffAlert } from "../alerts-fs";
import { setSeatPaused } from "../agent-state";
import { createCustomer } from "../create-customer";
import { createInitiative } from "../create-initiative";
import { createVenture, slugifyVentureName } from "../create-venture";
import {
  DEFAULT_INITIATIVE_SLUG,
  activeProjectSlug,
  assertJarvisReadable,
  assertWritable,
  briefingsDir,
  businessIdeaFile,
  dispatchRoot,
  getCustomerMain,
  getInitiative,
  listProjects,
  loadRegistry,
  saveRegistry,
} from "../paths";
import { queueValidatedDispatch } from "../queue-validated-dispatch";
import { cancelRun as abortRegisteredRun } from "../run-registry";
import type { RuntimeAdapter } from "../runtime-adapter";
import { readRun } from "../runs-fs";
import { listRoutineDefs, routineSummaries, writeRoutine } from "../routines";
import { loadSnapshot } from "../snapshot";
import {
  rewakeSessionDetached,
  spawnClaimedManager,
  spawnClaimedManagerDetached,
  spawnRunReady,
} from "../spawn";
import { writeCsuiteDraft } from "../write-csuite-draft";
import { buildQueueForPacket, parseBatchQueueItems, previewQueueFor, queueDispatchBatch } from "./dispatch-for";
import { JarvisExecError } from "./errors";
import type { JarvisIntent } from "./intents";
import {
  isPhase0RoundtableRequest,
  startPhase0Roundtable,
} from "./phase0-roundtable";
import {
  extractOperatorSummary,
  formatOperatorSummarySpoken,
} from "./operator-summary";
import { findLatestInboxDeliverableForSeat } from "./review-inbox";
import {
  findInboxDeliverableByRunId,
  listReviewInbox,
  writeReviewInboxReceipt,
} from "./review-inbox";
import {
  openAsksForSeat,
  planSeatAnswer,
  resolveAnswersForSeat,
  resolveSeatForAnswer,
} from "./seat-answer";
import {
  cancelConfirm,
  clearSeatAnswerDraft,
  clearWorkIntake,
  getLastSummary,
  getRoomMode,
  getSeatAnswerDraft,
  getWorkIntake,
  mergeWorkGoal,
  patchSeatAnswerDraft,
  patchWorkIntakeAnswers,
  peekLatestConfirm,
  seedSeatAnswerDraft,
  setLastReportedSeat,
  setRoomMode,
  setWorkIntake,
} from "./session";
import { planBlockerResolve } from "./blocker-resolve";
import { listRunEvents, summarizeRunEvents } from "./run-events";
import { resolveWorkTarget } from "./work-request";
import { askBrain } from "./brain-ask";
import { routeBrain } from "./brain-route";
import {
  memoryBrief,
  memoryDigest,
  memoryNote,
  memoryRecall,
  memoryReindex,
} from "../memory";
import {
  graphifyExplain,
  graphifyPath,
  graphifyQuery,
  graphifyStatus,
} from "./graphify-query";
import {
  ensureVentureVaultSourceOfTruth,
  getServerInfo,
  inspectVentureVaultSourceOfTruth,
  mocMetaFromRegistry,
  obsidianConfigured,
  syncVaultGraph,
} from "../obsidian";
import { buildOrgWorkGraph } from "../../src/jarvis/org-work-graph";
import { loadInitiativeWork } from "../initiative-work";

export { JarvisExecError } from "./errors";

function assertExecOk<T extends { ok: boolean }>(
  result: T,
  formatError: (result: T) => string,
): asserts result is T & { ok: true } {
  if (!result.ok) {
    throw new JarvisExecError(formatError(result), "validation_error");
  }
}

function emitJarvisFocus(
  droot: string,
  focus: {
    phase?: string;
    slug?: string;
    openReport?: boolean;
    focusQuestions?: boolean;
  },
) {
  appendActivity(droot, {
    type: "jarvis.focus",
    phase: focus.phase,
    slug: focus.slug,
    openReport: focus.openReport,
    focusQuestions: focus.focusQuestions,
  });
}

/** Plain text only — voice TTS reads markdown asterisks aloud. */
const SESSION_HELP = [
  "Modes: Briefing for mission, digest, seat report, tasks, runs, activity, alerts, spend.",
  "Ops adds assign, run next, cancel, rewake, pause, resume, cancel pending, and memory writes.",
  "Review adds file read and csuite draft. Architect adds venture create or switch.",
  "Top intents: mission.get for status; memory.brief for where we are; digest.get or digest.focus; blocker.list; blocker.resolve; seat.answer; seat.answer_draft; dispatch.queue_batch; spawn.run_ready; seat.report; phase.list_open;",
  "activity.tail; session.help; session.repeat; jarvis.ping; brain.ask for Cursor Grok deep think; brain.route for voice intent; mode.set;",
  "work.resolve or work.request for intake and Cursor spawn; review.inbox_list for artifacts.",
  "Answer open seat questions with seat.answer after seat.report; draft multi-turn answers with seat.answer_draft; resolve hard blockers with blocker.resolve after blocker.list.",
  "Memory: memory.brief and memory.recall are read-only; memory.note, memory.digest, and memory.reindex need Ops and confirm.",
].join(" ");

async function buildDigestPayload(
  snap: ReturnType<typeof loadSnapshot>,
  repoRoot: string,
) {
  const digest = buildCompanyDigest({
    org: snap.org,
    tracker: snap.tracker,
    handoffs: snap.handoffs,
    queueFiles: snap.queue,
    claimedFiles: snap.claimed,
    runs: snap.runs,
    sessions: snap.sessions,
    briefings: snap.briefings,
    alerts: snap.alerts,
    spendBySeat: snap.spend.bySeat,
    repoRoot,
    models: snap.models,
  });
  const threats = await enrichBlockedSeatsWithGrok(digest.blockedSeats, {
    cwd: repoRoot,
    mode: "cached-or-background",
  });
  return { ...digest, blockedSeats: threats.blockedSeats };
}

function digestSectionKey(section: string): keyof ReturnType<typeof buildCompanyDigest> | null {
  if (section === "blocked") return "blockedSeats";
  if (section === "escalate") return "escalateSeats";
  if (section === "awaiting") return "awaitingCsuite";
  return null;
}

function seatLabel(slug: string): string {
  if (slug === "ceo-strategist") return "CEO";
  return slug.replace(/-/g, " ");
}

export function summarizeBlockers(
  blocked: Array<{
    slug: string;
    reason: string;
    status?: string;
    title?: string;
    headline?: string;
  }>,
  escalate: Array<{ slug: string; tags: string[]; secondaries: string[] }>,
): string {
  if (!blocked.length) {
    if (!escalate.length) return "No blockers.";
    const esc = escalate.map((e) => seatLabel(e.slug)).join(", ");
    return `No blockers. ${escalate.length === 1 ? "1 escalation" : `${escalate.length} escalations`}: ${esc}.`;
  }
  const label = (b: { slug: string; title?: string }) =>
    b.title?.trim() || seatLabel(b.slug);
  const lineFor = (b: {
    slug: string;
    reason: string;
    title?: string;
    headline?: string;
  }) => `${label(b)} — ${b.headline || b.reason}`;
  const needsAnswers = blocked.filter((b) => b.status === "needs_input");
  const hard = blocked.filter((b) => b.status !== "needs_input");
  const parts: string[] = [];
  if (needsAnswers.length) {
    const lines = needsAnswers.map(lineFor);
    parts.push(
      needsAnswers.length === 1
        ? `1 needs answers: ${lines[0]}`
        : `${needsAnswers.length} need answers: ${lines.join("; ")}`,
    );
  }
  if (hard.length) {
    const lines = hard.map(lineFor);
    parts.push(
      hard.length === 1
        ? `1 blocker: ${lines[0]}`
        : `${hard.length} blockers: ${lines.join("; ")}`,
    );
  }
  let head = `${parts.join(". ")}.`;
  if (needsAnswers.length) {
    head +=
      " Answer with seat.answer; use blocker.resolve only for hard blockers.";
  }
  if (!escalate.length) return head;
  const esc = escalate.map((e) => seatLabel(e.slug)).join(", ");
  const escPhrase =
    escalate.length === 1 ? `Also 1 escalation: ${esc}.` : `Also ${escalate.length} escalations: ${esc}.`;
  return `${head} ${escPhrase}`;
}

export async function executeIntent(
  repoRoot: string,
  intent: JarvisIntent,
  args: Record<string, unknown>,
): Promise<unknown> {
  if (intent === "mode.set") {
    const roomId = String(args.roomId ?? "");
    if (!roomId) throw new JarvisExecError("roomId required", "missing_arg");
    const next = args.mode;
    if (next !== "briefing" && next !== "ops" && next !== "review" && next !== "architect") {
      throw new JarvisExecError("mode must be briefing, ops, review, or architect", "invalid_arg");
    }
    const previous = getRoomMode(roomId);
    setRoomMode(roomId, next);
    return { ok: true, mode: next, previous };
  }

  const snap = loadSnapshot(repoRoot);
  const droot = dispatchRoot(repoRoot);

  switch (intent) {
    case "mission.get": {
      const phase = String(snap.mission.currentPhase ?? "");
      emitJarvisFocus(droot, { phase: phase || undefined });
      return { mission: snap.mission };
    }

    case "digest.get": {
      emitJarvisFocus(droot, {});
      return {
        digest: await buildDigestPayload(snap, repoRoot),
      };
    }

    case "seat.report": {
      const raw = String(args.slug ?? args.seat ?? args.position ?? "ceo-strategist");
      const slug = resolveSeatSlug(raw, snap.org.roster) ?? raw;
      const deliverable = findLatestInboxDeliverableForSeat(repoRoot, slug);
      const report = buildSeatReport({
        slug,
        org: snap.org,
        tracker: snap.tracker,
        handoffs: snap.handoffs,
        queueFiles: snap.queue,
        claimedFiles: snap.claimed,
        runs: snap.runs,
        briefings: snap.briefings,
        sessions: snap.sessions,
        repoRoot,
        spendBySeat: snap.spend.bySeat,
        models: snap.models,
        exists: existsSync,
        deliverableMarkdown: deliverable?.markdown,
      });
      if (!report) {
        throw new JarvisExecError(
          `unknown seat: ${raw}. Use a roster title or slug (ceo strategist, head of research, copy chief, …).`,
          "unknown_seat",
        );
      }
      const latest = snap.handoffs.filter((h) => h.position === report.slug).at(-1);
      const enriched = await enrichSeatReportWithGrokBrief(report, {
        cwd: repoRoot,
        handoffBody: latest?.body,
        deliverableMarkdown: deliverable?.markdown,
        asks: latest?.asks,
        blockers: latest?.blockers,
        apiKey: typeof args.apiKey === "string" ? args.apiKey : undefined,
        // Voice can wait briefly; fall back so TTS is not stuck for a full Grok turn.
        mode: "await",
        timeoutMs: 4000,
      });
      const roomId = args.roomId != null ? String(args.roomId) : "";
      if (roomId) {
        setLastReportedSeat(roomId, enriched.slug);
        seedSeatAnswerDraft(roomId, enriched.slug, enriched.openQuestions);
      }
      emitJarvisFocus(droot, {
        slug: enriched.slug,
        openReport: true,
        focusQuestions: enriched.openQuestions.length > 0,
      });
      return {
        report: enriched,
        spoken: seatReportBriefScript(enriched),
        spokenQuestions: enriched.openQuestions,
        briefSource: enriched.briefSource,
      };
    }

    case "tasks.list":
      return { tasks: snap.tasks };

    case "runs.list":
      return { runs: snap.runs };

    case "runs.get": {
      const runId = String(args.runId ?? "");
      if (!runId) throw new JarvisExecError("runId required", "missing_arg");
      const run = readRun(join(droot, "runs"), runId);
      if (!run) throw new JarvisExecError(`run not found: ${runId}`, "not_found");
      const inbox = findInboxDeliverableByRunId(repoRoot, runId);
      const operatorSpoken = inbox
        ? formatOperatorSummarySpoken(extractOperatorSummary(inbox.markdown))
        : null;
      return {
        run,
        operatorSpoken: operatorSpoken ?? undefined,
        inboxPath: inbox?.rel,
      };
    }

    case "runs.watch": {
      const limitRaw = args.limit;
      const limit =
        typeof limitRaw === "number" && Number.isFinite(limitRaw) && limitRaw > 0
          ? Math.floor(limitRaw)
          : 50;
      const events = listRunEvents(droot, limit);
      return { events, summary: summarizeRunEvents(events) };
    }

    case "activity.list":
      return { activity: snap.activity };

    case "alerts.list":
      return { alerts: snap.alerts };

    case "spend.get":
      return { spend: snap.spend };

    case "dispatch.queue": {
      const result = queueValidatedDispatch(
        repoRoot,
        args as unknown as ManagerPacketInput,
      );
      assertExecOk(result, (r) => ("errors" in r ? r.errors : []).join("; "));
      return result;
    }

    case "alerts.ack": {
      const id = String(args.id ?? "");
      if (!id) throw new JarvisExecError("id required", "missing_arg");
      const alerts = ackHandoffAlert(droot, id);
      return { ok: true, alerts };
    }

    case "routine.enable": {
      const id = String(args.id ?? "");
      if (!id) throw new JarvisExecError("id required", "missing_arg");
      const existing = listRoutineDefs(droot).find((r) => r.id === id);
      if (!existing) throw new JarvisExecError(`routine not found: ${id}`, "not_found");
      existing.enabled = args.enabled !== false;
      const path = writeRoutine(droot, existing);
      return { ok: true, routine: existing, path };
    }

    case "routine.list":
      return { routines: routineSummaries(droot) };

    case "routine.disable": {
      const id = String(args.id ?? "");
      if (!id) throw new JarvisExecError("id required", "missing_arg");
      const existing = listRoutineDefs(droot).find((r) => r.id === id);
      if (!existing) throw new JarvisExecError(`routine not found: ${id}`, "not_found");
      existing.enabled = false;
      const path = writeRoutine(droot, existing);
      return { ok: true, routine: existing, path };
    }

    case "spawn.run_next":
      return spawnClaimedManager(repoRoot, {
        filename: typeof args.filename === "string" ? args.filename : undefined,
        wakeReason: (args.wakeReason as WakeReason | undefined) ?? "run_next",
        apiKey: typeof args.apiKey === "string" ? args.apiKey : args.apiKey === null ? null : undefined,
        adapter: args.adapter as RuntimeAdapter | undefined,
      });

    case "spawn.run": {
      let filename = typeof args.filename === "string" ? args.filename : undefined;
      if (!filename && args.runId != null) {
        const run = readRun(join(droot, "runs"), String(args.runId));
        if (!run) throw new JarvisExecError(`run not found: ${args.runId}`, "not_found");
        filename = run.dispatch_filename;
      }
      if (!filename) throw new JarvisExecError("filename or runId required", "missing_arg");
      return spawnClaimedManager(repoRoot, {
        filename,
        wakeReason: (args.wakeReason as WakeReason | undefined) ?? "on_demand",
        apiKey: typeof args.apiKey === "string" ? args.apiKey : args.apiKey === null ? null : undefined,
        adapter: args.adapter as RuntimeAdapter | undefined,
      });
    }

    case "spawn.run_ready": {
      const filenamesRaw = args.filenames;
      const filenames =
        Array.isArray(filenamesRaw) && filenamesRaw.length
          ? filenamesRaw.map((f) => String(f))
          : undefined;
      const limitRaw = args.limit;
      const limit =
        typeof limitRaw === "number" && Number.isFinite(limitRaw) && limitRaw > 0
          ? Math.floor(limitRaw)
          : undefined;
      const result = spawnRunReady(repoRoot, {
        filenames,
        limit,
        wakeReason: (args.wakeReason as WakeReason | undefined) ?? "on_demand",
        apiKey:
          typeof args.apiKey === "string"
            ? args.apiKey
            : args.apiKey === null
              ? null
              : undefined,
        adapter: args.adapter as RuntimeAdapter | undefined,
      });
      if (!result.ok && !result.started.length) {
        throw new JarvisExecError(result.error ?? "spawn failed", "spawn_failed");
      }
      if (result.started.length) {
        const last = result.started[result.started.length - 1];
        emitJarvisFocus(droot, { slug: last.position });
      }
      return result;
    }

    case "run.cancel": {
      const runId = String(args.runId ?? "");
      if (!runId) throw new JarvisExecError("runId required", "missing_arg");
      const aborted = abortRegisteredRun(runId);
      if (aborted) {
        appendActivity(droot, { type: "spawn_cancelled", runId, detail: "jarvis cancel" });
      }
      return { ok: aborted, runId, error: aborted ? undefined : "run not active" };
    }

    case "run.rewake":
      return rewakeSessionDetached(repoRoot, {
        dispatchFilename:
          typeof args.dispatchFilename === "string" ? args.dispatchFilename : undefined,
        agentId: typeof args.agentId === "string" ? args.agentId : undefined,
        instruction: typeof args.instruction === "string" ? args.instruction : undefined,
        wakeReason: (args.wakeReason as WakeReason | undefined) ?? "rewake",
        apiKey: typeof args.apiKey === "string" ? args.apiKey : args.apiKey === null ? null : undefined,
        adapter: args.adapter as RuntimeAdapter | undefined,
      });

    case "run.instruct": {
      const instruction =
        typeof args.instruction === "string" ? args.instruction.trim() : "";
      if (!instruction) throw new JarvisExecError("instruction required", "missing_arg");
      return rewakeSessionDetached(repoRoot, {
        dispatchFilename:
          typeof args.dispatchFilename === "string" ? args.dispatchFilename : undefined,
        agentId: typeof args.agentId === "string" ? args.agentId : undefined,
        instruction,
        wakeReason: "rewake",
        apiKey: typeof args.apiKey === "string" ? args.apiKey : args.apiKey === null ? null : undefined,
        adapter: args.adapter as RuntimeAdapter | undefined,
      });
    }

    case "agent.pause": {
      const raw = String(args.slug ?? args.seat ?? "");
      if (!raw) throw new JarvisExecError("slug required", "missing_arg");
      const slug = resolveSeatSlug(raw, snap.org.roster);
      if (!slug) throw new JarvisExecError(`unknown seat: ${raw}`, "unknown_seat");
      const state = setSeatPaused(droot, slug, true);
      appendActivity(droot, { type: "seat_paused", position: slug });
      return { ok: true, slug, ...state };
    }

    case "agent.resume": {
      const raw = String(args.slug ?? args.seat ?? "");
      if (!raw) throw new JarvisExecError("slug required", "missing_arg");
      const slug = resolveSeatSlug(raw, snap.org.roster);
      if (!slug) throw new JarvisExecError(`unknown seat: ${raw}`, "unknown_seat");
      const state = setSeatPaused(droot, slug, false);
      appendActivity(droot, { type: "seat_resumed", position: slug });
      return { ok: true, slug, ...state };
    }

    case "csuite.draft": {
      const phase = String(args.phase ?? "");
      if (!phase) throw new JarvisExecError("phase required", "missing_arg");
      const result = writeCsuiteDraft(repoRoot, { phase, force: Boolean(args.force) });
      assertExecOk(result, (r) => ("error" in r ? r.error : "csuite draft failed"));
      return result;
    }

    case "file.read": {
      const rel = String(args.path ?? "");
      if (!rel) throw new JarvisExecError("path required", "missing_arg");
      const abs = assertJarvisReadable(repoRoot, rel);
      if (!existsSync(abs)) throw new JarvisExecError(`not found: ${rel}`, "not_found");
      const st = statSync(abs);
      if (st.isDirectory()) {
        const entries = readdirSync(abs).map((name) => {
          const child = joinSafe(repoRoot, abs, name);
          const cst = statSync(child);
          return {
            name,
            path: relative(repoRoot, child).split("\\").join("/"),
            type: cst.isDirectory() ? "dir" : "file",
          };
        });
        return { type: "dir", path: rel, entries };
      }
      return { type: "file", path: rel, content: readFileSync(abs, "utf8") };
    }

    case "venture.list": {
      const reg = loadRegistry(repoRoot);
      return {
        active: reg.active,
        activeProject: reg.active.customer,
        projects: listProjects(repoRoot),
      };
    }

    case "venture.get": {
      const reg = loadRegistry(repoRoot);
      const { entry, customerName, ref } = getInitiative(reg);
      return {
        active: ref,
        activeProject: ref.customer,
        name: customerName,
        initiative: ref.initiative,
        businessIdea: entry.businessIdea,
        memory: entry.memory,
      };
    }

    case "venture.slugify": {
      const name = String(args.name ?? "");
      return { slug: slugifyVentureName(name) };
    }

    case "venture.create": {
      const name = String(args.name ?? "").trim();
      if (!name) throw new JarvisExecError("name required", "missing_arg");
      const slug = args.slug != null ? String(args.slug) : undefined;
      return createVenture(repoRoot, { name, slug, activate: true });
    }

    case "venture.switch": {
      const slug = String(args.slug ?? "").trim();
      if (!slug) throw new JarvisExecError("slug required", "missing_arg");
      const reg = loadRegistry(repoRoot);
      try {
        getCustomerMain(reg, slug);
      } catch {
        throw new JarvisExecError(`Unknown project: ${slug}`, "unknown_venture");
      }
      reg.active = {
        org: reg.active.org,
        customer: slug,
        initiative: DEFAULT_INITIATIVE_SLUG,
      };
      saveRegistry(repoRoot, reg);
      return { ok: true, active: activeProjectSlug(repoRoot), activeRef: reg.active };
    }

    case "customer.create": {
      const name = String(args.name ?? "").trim();
      if (!name) throw new JarvisExecError("name required", "missing_arg");
      const slug = args.slug != null ? String(args.slug) : undefined;
      return createCustomer(repoRoot, {
        name,
        slug,
        activate: true,
        contextNote: args.contextNote != null ? String(args.contextNote) : undefined,
      });
    }

    case "initiative.create": {
      const name = String(args.name ?? "").trim();
      if (!name) throw new JarvisExecError("name required", "missing_arg");
      const slug = args.slug != null ? String(args.slug) : undefined;
      const customer = args.customer != null ? String(args.customer) : undefined;
      return createInitiative(repoRoot, {
        name,
        slug,
        customer,
        activate: true,
        contextNote: args.contextNote != null ? String(args.contextNote) : undefined,
      });
    }

    case "portfolio.switch": {
      const customer = String(args.customer ?? args.slug ?? "").trim();
      const initiative = String(args.initiative ?? DEFAULT_INITIATIVE_SLUG).trim();
      if (!customer) throw new JarvisExecError("customer required", "missing_arg");
      const reg = loadRegistry(repoRoot);
      try {
        getInitiative(reg, {
          org: reg.active.org,
          customer,
          initiative,
        });
      } catch {
        throw new JarvisExecError(
          `Unknown portfolio target: ${customer}/${initiative}`,
          "unknown_venture",
        );
      }
      reg.active = {
        org: reg.active.org,
        customer,
        initiative,
      };
      saveRegistry(repoRoot, reg);
      return { ok: true, active: reg.active };
    }

    // Task 6: dispatch-for builder + awareness reads
    case "dispatch.queue_for": {
      const position = String(args.position ?? "");
      const goal = String(args.goal ?? "");
      const phase = args.phase != null ? String(args.phase) : undefined;
      const input = buildQueueForPacket(repoRoot, { position, goal, phase });
      const result = queueValidatedDispatch(repoRoot, input, { allowAnyManager: true });
      assertExecOk(result, (r) => ("errors" in r ? r.errors : []).join("; "));
      emitJarvisFocus(droot, { phase: input.phase, slug: input.position });
      return result;
    }

    case "dispatch.queue_batch": {
      const items = parseBatchQueueItems(args.items);
      const result = queueDispatchBatch(repoRoot, items);
      const last = result.items[result.items.length - 1];
      if (last) {
        emitJarvisFocus(droot, { phase: last.phase, slug: last.position });
      }
      return result;
    }

    case "dispatch.preview": {
      return previewQueueFor(repoRoot, {
        position: String(args.position ?? ""),
        goal: String(args.goal ?? ""),
        phase: args.phase != null ? String(args.phase) : undefined,
      });
    }

    case "seat.who_owns": {
      const phase = String(args.phase ?? snap.mission.currentPhase ?? "");
      const org = snap.org;
      const owner = org.phaseOwners.find((p) => p.phase === phase);
      if (!owner) throw new JarvisExecError(`No owner for phase ${phase}`, "unknown_phase");
      return {
        phase,
        managerOwner: owner.managerOwner,
        maySpawn: owner.maySpawn,
        csuiteReviewer: owner.csuiteReviewer,
      };
    }

    case "dispatch.list": {
      return { queue: snap.queue, claimed: snap.claimed };
    }

    case "delegate.plan": {
      const raw = String(args.position ?? "");
      const position = resolveSeatSlug(raw, snap.org.roster) ?? raw;
      const goal = String(args.goal ?? "");
      const owner =
        snap.org.phaseOwners.find((p) => p.managerOwner === position) ??
        snap.org.phaseOwners.find((p) => p.phase === String(snap.mission.currentPhase));
      const seat = snap.org.roster.find((r) => r.slug === position);
      return {
        position,
        level: seat?.level,
        goal,
        maySpawn: owner?.maySpawn ?? [],
        note:
          seat?.level === "manager"
            ? "Queue this manager; they may spawn listed ICs."
            : "This seat is IC — queue their manager instead.",
      };
    }

    case "agent.spawn_ic":
      throw new JarvisExecError("IC spawn forbidden", "forbidden");

    case "work.resolve": {
      const resolved = resolveWorkTarget(repoRoot, {
        position: args.position != null ? String(args.position) : undefined,
        goal: args.goal != null ? String(args.goal) : undefined,
        phase: args.phase != null ? String(args.phase) : undefined,
      });
      const roomId = String(args.roomId ?? "");
      if (roomId) {
        setWorkIntake(roomId, {
          intakeSeat: resolved.intakeSeat,
          targetIc: resolved.targetIc,
          goal: resolved.goal,
          answers: getWorkIntake(roomId)?.answers ?? {},
        });
      }
      return resolved;
    }

    case "work.intake_save": {
      const roomId = String(args.roomId ?? "");
      if (!roomId) throw new JarvisExecError("roomId required", "missing_arg");
      const answersRaw = args.answers;
      const answers: Record<string, string> = {};
      if (answersRaw && typeof answersRaw === "object" && !Array.isArray(answersRaw)) {
        for (const [k, v] of Object.entries(answersRaw as Record<string, unknown>)) {
          const text = String(v ?? "").trim();
          // Drop empty / ultra-short STT garbage so it cannot pollute Cursor goals.
          if (text.length < 8) continue;
          if (!/[a-zA-Z]{3,}/.test(text)) continue;
          answers[k] = text;
        }
      }
      if (Object.keys(answers).length === 0) {
        throw new JarvisExecError("No usable intake answers", "invalid_intake");
      }
      let state = patchWorkIntakeAnswers(roomId, answers);
      if (!state) {
        const resolved = resolveWorkTarget(repoRoot, {
          position: args.position != null ? String(args.position) : undefined,
          goal: args.goal != null ? String(args.goal) : undefined,
        });
        state = setWorkIntake(roomId, {
          intakeSeat: resolved.intakeSeat,
          targetIc: resolved.targetIc,
          goal: resolved.goal,
          answers,
        });
      }
      return { ok: true, intake: state };
    }

    case "work.request": {
      const roomId = String(args.roomId ?? "");
      const intake = roomId ? getWorkIntake(roomId) : undefined;
      const rawPhase = args.phase != null ? String(args.phase) : undefined;
      const rawGoal =
        args.goal != null ? String(args.goal) : intake?.goal;
      const resolved = resolveWorkTarget(repoRoot, {
        position:
          args.position != null
            ? String(args.position)
            : intake?.intakeSeat,
        goal: rawGoal,
        phase: rawPhase,
      });
      const position = resolved.intakeSeat;
      const baseGoal = String(rawGoal ?? resolved.goal ?? "").trim();
      const targetIc =
        args.targetIc != null
          ? String(args.targetIc)
          : intake?.targetIc ?? resolved.targetIc;
      if (!position) throw new JarvisExecError("position required", "missing_arg");
      if (!baseGoal) throw new JarvisExecError("goal required", "missing_arg");
      const answers = intake?.answers ?? {};
      let goal = mergeWorkGoal(
        resolved.intakeSeat === "ceo-strategist" &&
          isPhase0RoundtableRequest({
            phase: rawPhase,
            goal: baseGoal,
          })
          ? resolved.goal
          : baseGoal,
        answers,
      );
      if (targetIc) {
        goal = `${goal}\n\nPreferred IC to spawn after intake: ${targetIc}`;
      }
      const phase = isPhase0RoundtableRequest({
        phase: rawPhase,
        position,
        goal: baseGoal,
      })
        ? "0"
        : rawPhase;
      const input = buildQueueForPacket(repoRoot, {
        position,
        goal,
        phase,
        targetIc,
        require_inbox: true,
      });
      const queued = queueValidatedDispatch(repoRoot, input, { allowAnyManager: true });
      assertExecOk(queued, (r) => ("errors" in r ? r.errors : []).join("; "));
      const filename = queued.path.split("/").pop()!;
      const spawned = spawnClaimedManagerDetached(repoRoot, {
        filename,
        wakeReason: "on_demand",
        apiKey:
          typeof args.apiKey === "string"
            ? args.apiKey
            : args.apiKey === null
              ? null
              : undefined,
        adapter: args.adapter as RuntimeAdapter | undefined,
      });
      if (!spawned.ok) {
        throw new JarvisExecError(spawned.error || "spawn failed", "spawn_failed");
      }
      const receipt = writeReviewInboxReceipt(repoRoot, {
        position: queued.packet.position,
        phase: queued.packet.phase,
        goal,
        runId: spawned.runId,
      });
      let phase0Roundtable = false;
      if (
        spawned.runId &&
        isPhase0RoundtableRequest({
          phase: queued.packet.phase,
          position: queued.packet.position,
          goal,
        })
      ) {
        startPhase0Roundtable(repoRoot, { ceoIntakeRunId: spawned.runId });
        phase0Roundtable = true;
      }
      if (roomId) clearWorkIntake(roomId);
      emitJarvisFocus(droot, { phase: queued.packet.phase, slug: queued.packet.position });
      return {
        ok: true,
        runId: spawned.runId,
        position: queued.packet.position,
        filename,
        queuePath: queued.path,
        reviewInboxPath: receipt.path,
        reviewInboxHint: receipt.path,
        targetIc,
        phase0Roundtable,
      };
    }

    case "review.inbox_list":
      return { items: listReviewInbox(repoRoot) };

    // Task 7: session meta + awareness reads
    case "session.help":
      return { help: SESSION_HELP };

    case "session.repeat": {
      const roomId = String(args.roomId ?? "");
      if (!roomId) throw new JarvisExecError("roomId required", "missing_arg");
      const summary = getLastSummary(roomId);
      if (!summary) throw new JarvisExecError("nothing to repeat", "no_summary");
      return { summary };
    }

    case "session.cancel_pending": {
      const roomId = String(args.roomId ?? "");
      if (!roomId) throw new JarvisExecError("roomId required", "missing_arg");
      const token =
        args.token != null ? String(args.token) : peekLatestConfirm(roomId)?.token;
      if (!token) {
        throw new JarvisExecError("No pending confirmation to cancel", "no_pending");
      }
      const cancelled = cancelConfirm(roomId, token);
      if (!cancelled) {
        throw new JarvisExecError("Invalid or expired confirm token", "invalid_token");
      }
      return { ok: true, cancelled: { intent: cancelled.intent } };
    }

    case "jarvis.ping":
      return { ok: true, time: new Date().toISOString() };

    case "brain.ask": {
      const prompt = String(args.prompt ?? args.question ?? "");
      return askBrain({
        prompt,
        cwd: repoRoot,
        model: args.model != null ? String(args.model) : undefined,
        apiKey:
          typeof args.apiKey === "string"
            ? args.apiKey
            : args.apiKey === null
              ? null
              : undefined,
        runtime: args.runtime as Parameters<typeof askBrain>[0]["runtime"],
      });
    }

    case "brain.route": {
      const utterance = String(args.utterance ?? args.prompt ?? args.question ?? "");
      return routeBrain({
        utterance,
        spokenBrief:
          args.spokenBrief != null
            ? String(args.spokenBrief)
            : args.brief != null
              ? String(args.brief)
              : undefined,
        cwd: repoRoot,
        model: args.model != null ? String(args.model) : undefined,
        timeoutMs:
          args.timeoutMs != null && Number.isFinite(Number(args.timeoutMs))
            ? Number(args.timeoutMs)
            : undefined,
        apiKey:
          typeof args.apiKey === "string"
            ? args.apiKey
            : args.apiKey === null
              ? null
              : undefined,
        runtime: args.runtime as Parameters<typeof routeBrain>[0]["runtime"],
      });
    }

    case "phase.list_open": {
      const phases = snap.tracker.phases.filter(
        (p) => p.status === "⬜" || p.status === "🔄",
      );
      return { phases };
    }

    case "handoff.list": {
      const phase = args.phase != null ? String(args.phase) : undefined;
      const handoffs = phase
        ? snap.handoffs.filter((h) => h.phase === phase)
        : snap.handoffs;
      return { handoffs };
    }

    case "briefing.pin": {
      const mode = String(args.mode ?? "seat");
      if (mode !== "seat") {
        throw new JarvisExecError("mode must be seat", "invalid_arg");
      }
      const raw = String(args.slug ?? "ceo-strategist");
      const slug = resolveSeatSlug(raw, snap.org.roster) ?? raw;
      if (!CSUITE_SLUGS.includes(slug as (typeof CSUITE_SLUGS)[number])) {
        throw new JarvisExecError(`invalid seat for briefing: ${raw}`, "invalid_arg");
      }
      const deliverable = findLatestInboxDeliverableForSeat(repoRoot, slug);
      const report = buildSeatReport({
        slug,
        org: snap.org,
        tracker: snap.tracker,
        handoffs: snap.handoffs,
        queueFiles: snap.queue,
        claimedFiles: snap.claimed,
        runs: snap.runs,
        briefings: snap.briefings,
        sessions: snap.sessions,
        repoRoot,
        spendBySeat: snap.spend.bySeat,
        models: snap.models,
        exists: existsSync,
        deliverableMarkdown: deliverable?.markdown,
      });
      if (!report) throw new JarvisExecError(`unknown seat: ${slug}`, "unknown_seat");
      const status =
        report.upwardBlockers.length > 0
          ? "blocked"
          : report.escalations.length > 0
            ? "at_risk"
            : "on_track";
      const escalationTags = report.escalations.flatMap((e) => e.tags);
      const md = renderStandupBriefing({
        position: slug,
        phase_focus: String(snap.mission.currentPhase ?? ""),
        status,
        escalation_tags: escalationTags,
        progress: report.summary,
        asks: report.upwardAsks.join("\n") || "- none",
        blockers: report.upwardBlockers.join("\n") || "- none",
      });
      const rel = businessIdeaFile(repoRoot, `BRIEFINGS/${slug}-standup.md`);
      mkdirSync(briefingsDir(repoRoot), { recursive: true });
      writeFileSync(assertWritable(repoRoot, rel), md);
      return { ok: true, path: rel, position: slug };
    }

    case "digest.focus": {
      const digest = await buildDigestPayload(snap, repoRoot);
      const section = args.section != null ? String(args.section) : undefined;
      if (!section) return { digest };
      const key = digestSectionKey(section);
      if (!key) {
        throw new JarvisExecError(
          "section must be blocked, escalate, or awaiting",
          "invalid_arg",
        );
      }
      return { section, data: digest[key] };
    }

    case "blocker.list": {
      const digest = await buildDigestPayload(snap, repoRoot);
      const blocked = digest.blockedSeats;
      const escalate = digest.escalateSeats;
      return {
        blocked,
        escalate,
        summary: summarizeBlockers(blocked, escalate),
      };
    }

    case "seat.answer_draft": {
      const roomId = args.roomId != null ? String(args.roomId) : "";
      if (!roomId) {
        throw new JarvisExecError("roomId required", "missing_arg");
      }
      const seat = resolveSeatForAnswer(repoRoot, {
        seat: args.seat != null ? String(args.seat) : undefined,
        roomId,
      });
      const openAsks = openAsksForSeat(repoRoot, seat);
      const answersRaw = args.answers;
      const answersMap: Record<string, string> = {};
      if (answersRaw && typeof answersRaw === "object" && !Array.isArray(answersRaw)) {
        for (const [k, v] of Object.entries(answersRaw as Record<string, unknown>)) {
          if (typeof v === "string" || typeof v === "number") {
            answersMap[k] = String(v);
          }
        }
      }
      const answered = resolveAnswersForSeat(repoRoot, {
        seat,
        answers: answersMap,
        answer: args.answer != null ? String(args.answer) : undefined,
        question: args.question != null ? String(args.question) : undefined,
        roomId,
        useDraft: false,
      });
      const draft = patchSeatAnswerDraft(roomId, {
        seat,
        answers: answered,
        openQuestions: openAsks,
      });
      setLastReportedSeat(roomId, seat);
      const remaining = openAsks.filter((q) => !draft.answers[q]?.trim());
      const spoken = remaining[0]
        ? `Saved. Next question: ${remaining[0]}`
        : `All questions drafted for ${seat.replace(/-/g, " ")}. Say confirm to continue that seat.`;
      emitJarvisFocus(droot, {
        slug: seat,
        openReport: true,
        focusQuestions: true,
      });
      return {
        ok: true,
        seat,
        answers: draft.answers,
        remaining,
        spoken,
      };
    }

    case "blocker.resolve":
    case "seat.answer": {
      const roomId = args.roomId != null ? String(args.roomId) : undefined;
      const plan =
        intent === "seat.answer"
          ? (() => {
              const answersRaw = args.answers;
              const answers: Record<string, string> = {};
              if (answersRaw && typeof answersRaw === "object" && !Array.isArray(answersRaw)) {
                for (const [k, v] of Object.entries(answersRaw as Record<string, unknown>)) {
                  if (typeof v === "string" || typeof v === "number") {
                    answers[k] = String(v);
                  }
                }
              }
              return planSeatAnswer(repoRoot, {
                seat: args.seat != null ? String(args.seat) : undefined,
                answers,
                answer: args.answer != null ? String(args.answer) : undefined,
                question: args.question != null ? String(args.question) : undefined,
                roomId,
              });
            })()
          : planBlockerResolve(repoRoot, {
              seat: args.seat != null ? String(args.seat) : undefined,
              phase: args.phase != null ? String(args.phase) : undefined,
              goal: args.goal != null ? String(args.goal) : undefined,
            });

      if (plan.action === "rewake") {
        const result = rewakeSessionDetached(repoRoot, {
          dispatchFilename: plan.dispatchFilename,
          instruction: plan.goal,
          wakeReason: "rewake",
          apiKey:
            typeof args.apiKey === "string"
              ? args.apiKey
              : args.apiKey === null
                ? null
                : undefined,
          adapter: args.adapter as RuntimeAdapter | undefined,
        });
        if (!result.ok) {
          throw new JarvisExecError(result.error || "rewake failed", "spawn_failed");
        }
        if (intent === "seat.answer" && roomId) clearSeatAnswerDraft(roomId);
        emitJarvisFocus(droot, {
          phase: plan.phase,
          slug: plan.position,
          openReport: intent === "seat.answer",
          focusQuestions: intent === "seat.answer",
        });
        return {
          ok: true,
          action: "rewake",
          runId: result.runId,
          position: plan.position,
          blockedSeat: plan.blockedSeat,
          dispatchFilename: plan.dispatchFilename,
          spoken: plan.spoken,
          handoffRel: "handoffRel" in plan ? plan.handoffRel : undefined,
        };
      }

      const input = buildQueueForPacket(repoRoot, {
        position: plan.position,
        goal: plan.goal,
        phase: plan.phase,
        targetIc: plan.targetIc,
        require_inbox: Boolean(plan.targetIc),
      });
      const queued = queueValidatedDispatch(repoRoot, input, { allowAnyManager: true });
      assertExecOk(queued, (r) => ("errors" in r ? r.errors : []).join("; "));
      const filename = queued.path.split("/").pop()!;
      const spawned = spawnClaimedManagerDetached(repoRoot, {
        filename,
        wakeReason: "on_demand",
        apiKey:
          typeof args.apiKey === "string"
            ? args.apiKey
            : args.apiKey === null
              ? null
              : undefined,
        adapter: args.adapter as RuntimeAdapter | undefined,
      });
      if (!spawned.ok) {
        throw new JarvisExecError(spawned.error || "spawn failed", "spawn_failed");
      }
      if (intent === "seat.answer" && roomId) clearSeatAnswerDraft(roomId);
      emitJarvisFocus(droot, {
        phase: queued.packet.phase,
        slug: queued.packet.position,
        openReport: intent === "seat.answer",
        focusQuestions: intent === "seat.answer",
      });
      return {
        ok: true,
        action: "queue",
        runId: spawned.runId,
        position: queued.packet.position,
        blockedSeat: plan.blockedSeat,
        filename,
        queuePath: queued.path,
        spoken: plan.spoken,
        handoffRel: "handoffRel" in plan ? plan.handoffRel : undefined,
      };
    }

    case "activity.tail": {
      const nRaw = args.n;
      const n =
        typeof nRaw === "number" && Number.isFinite(nRaw) && nRaw > 0
          ? Math.floor(nRaw)
          : 10;
      // snapshot activity is newest-first (see readActivityTail)
      return { activity: snap.activity.slice(0, n) };
    }

    case "memory.note": {
      const text = String(args.text ?? "").trim();
      if (!text) throw new JarvisExecError("text required", "missing_arg");
      const kindRaw = args.kind;
      const kind =
        kindRaw === "note" ||
        kindRaw === "decision" ||
        kindRaw === "preference" ||
        kindRaw === "entity" ||
        kindRaw === "lifecycle"
          ? kindRaw
          : undefined;
      return memoryNote(repoRoot, {
        text,
        kind,
        entityId: args.entityId != null ? String(args.entityId) : undefined,
      });
    }

    case "memory.recall": {
      const query = String(args.query ?? "").trim();
      if (!query) throw new JarvisExecError("query required", "missing_arg");
      const limitRaw = args.limit;
      const limit =
        typeof limitRaw === "number" && Number.isFinite(limitRaw) && limitRaw > 0
          ? Math.floor(limitRaw)
          : undefined;
      return memoryRecall(repoRoot, { query, limit });
    }

    case "memory.brief":
      return memoryBrief(repoRoot);

    case "memory.digest": {
      const summary = args.summary != null ? String(args.summary).trim() : undefined;
      return memoryDigest(repoRoot, summary ? { summary } : undefined);
    }

    case "memory.reindex":
      return memoryReindex(repoRoot);

    case "graph.status":
      return graphifyStatus(repoRoot);

    case "graph.query": {
      const question = String(args.question ?? args.query ?? args.prompt ?? "").trim();
      const budgetRaw = args.budget;
      const budget =
        typeof budgetRaw === "number" && Number.isFinite(budgetRaw) && budgetRaw > 0
          ? Math.floor(budgetRaw)
          : undefined;
      return graphifyQuery(repoRoot, { question, budget });
    }

    case "graph.path": {
      const source = String(args.source ?? args.from ?? args.a ?? "").trim();
      const target = String(args.target ?? args.to ?? args.b ?? "").trim();
      return graphifyPath(repoRoot, { source, target });
    }

    case "graph.explain": {
      const label = String(args.label ?? args.node ?? args.concept ?? "").trim();
      return graphifyExplain(repoRoot, { label });
    }

    case "obsidian.status": {
      const sot = inspectVentureVaultSourceOfTruth(repoRoot);
      const mcp = obsidianConfigured()
        ? await getServerInfo()
        : { ok: false, text: "", error: "OBSIDIAN_MCP_TOKEN not set" };
      return {
        vaultSourceOfTruth: true,
        vaultRoot: sot.vaultRoot,
        linked: sot.linked,
        pending: sot.pending,
        configured: true,
        ready: sot.ready,
        mcpConfigured: obsidianConfigured(),
        mcpReady: mcp.ok,
        message: sot.ready
          ? `Vault SoT ready at ${sot.vaultRoot}`
          : `Vault SoT pending: ${sot.pending.join(", ")} — run obsidian.sync`,
      };
    }

    case "obsidian.sync": {
      const venture =
        args.venture != null
          ? String(args.venture)
          : args.slug != null
            ? String(args.slug)
            : undefined;
      const result = ensureVentureVaultSourceOfTruth(repoRoot, venture);
      if (!result.ok) {
        throw new JarvisExecError(
          result.errors.join("; ") || "vault source-of-truth layout failed",
          "validation_error",
        );
      }
      try {
        const reg = loadRegistry(repoRoot);
        const orgSlug = reg.active.org;
        const orgEntry = reg.orgs[orgSlug];
        const customers = orgEntry?.customers ?? {};
        const initiativeWork = [];
        for (const [customerSlug, customer] of Object.entries(customers)) {
          for (const [initSlug, init] of Object.entries(customer.initiatives)) {
            const loaded = loadInitiativeWork(repoRoot, init.businessIdea);
            const work = buildOrgWorkGraph({
              org: snap.org,
              handoffs: loaded.handoffs,
              runs: loaded.runs,
              inbox: loaded.inbox,
            });
            initiativeWork.push({
              customer: customerSlug,
              initiative: initSlug,
              work,
            });
          }
        }
        const meta = mocMetaFromRegistry(reg, initiativeWork, snap.org.roster);
        syncVaultGraph(repoRoot, meta);
      } catch (err) {
        console.warn("[vault-graph-sync]", err);
      }
      return result;
    }

    default:
      throw new JarvisExecError(`executeIntent not wired for ${intent}`);
  }
}

function joinSafe(repoRoot: string, parent: string, name: string) {
  const child = join(parent, name);
  const rel = relative(repoRoot, child);
  if (rel.startsWith("..")) throw new JarvisExecError("path escapes repo root");
  return child;
}
