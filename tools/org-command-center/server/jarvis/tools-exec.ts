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
import { resolveSeatSlug } from "./resolve-seat";
import { appendActivity } from "../activity";
import { ackHandoffAlert } from "../alerts-fs";
import { setSeatPaused } from "../agent-state";
import { createVenture, slugifyVentureName } from "../create-venture";
import {
  activeProjectSlug,
  assertJarvisReadable,
  assertWritable,
  briefingsDir,
  businessIdeaFile,
  dispatchRoot,
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
import { listReviewInbox, writeReviewInboxReceipt } from "./review-inbox";
import {
  cancelConfirm,
  clearWorkIntake,
  getLastSummary,
  getRoomMode,
  getWorkIntake,
  mergeWorkGoal,
  patchWorkIntakeAnswers,
  peekLatestConfirm,
  setRoomMode,
  setWorkIntake,
} from "./session";
import { planBlockerResolve } from "./blocker-resolve";
import { listRunEvents, summarizeRunEvents } from "./run-events";
import { resolveWorkTarget } from "./work-request";
import { askBrain } from "./brain-ask";
import { memoryBrief, memoryDigest, memoryNote, memoryRecall } from "../memory";

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
  focus: { phase?: string; slug?: string },
) {
  appendActivity(droot, { type: "jarvis.focus", phase: focus.phase, slug: focus.slug });
}

/** Plain text only — voice TTS reads markdown asterisks aloud. */
const SESSION_HELP = [
  "Modes: Briefing for mission, digest, seat report, tasks, runs, activity, alerts, spend.",
  "Ops adds assign, run next, cancel, rewake, pause, resume, cancel pending.",
  "Review adds file read and csuite draft. Architect adds venture create or switch.",
  "Top intents: mission.get for status; digest.get or digest.focus; blocker.list; blocker.resolve; dispatch.queue_batch; spawn.run_ready; seat.report; phase.list_open;",
  "activity.tail; session.help; session.repeat; jarvis.ping; brain.ask for Cursor Grok deep think; mode.set;",
  "work.resolve or work.request for intake and Cursor spawn; review.inbox_list for artifacts.",
].join(" ");

function buildDigestPayload(snap: ReturnType<typeof loadSnapshot>, repoRoot: string) {
  return buildCompanyDigest({
    org: snap.org,
    tracker: snap.tracker,
    handoffs: snap.handoffs,
    queueFiles: snap.queue,
    claimedFiles: snap.claimed,
    runs: snap.runs,
    briefings: snap.briefings,
    alerts: snap.alerts,
    spendBySeat: snap.spend.bySeat,
    repoRoot,
    models: snap.models,
  });
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

function summarizeBlockers(
  blocked: Array<{ slug: string; reason: string }>,
  escalate: Array<{ slug: string; tags: string[]; secondaries: string[] }>,
): string {
  if (!blocked.length) {
    if (!escalate.length) return "No blockers.";
    const esc = escalate.map((e) => seatLabel(e.slug)).join(", ");
    return `No blockers. ${escalate.length === 1 ? "1 escalation" : `${escalate.length} escalations`}: ${esc}.`;
  }
  const parts = blocked.map((b) => `${seatLabel(b.slug)} — ${b.reason}`);
  const head =
    blocked.length === 1
      ? `1 blocker: ${parts[0]}.`
      : `${blocked.length} blockers: ${parts.join("; ")}.`;
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
        digest: buildDigestPayload(snap, repoRoot),
      };
    }

    case "seat.report": {
      const raw = String(args.slug ?? args.seat ?? args.position ?? "ceo-strategist");
      const slug = resolveSeatSlug(raw, snap.org.roster) ?? raw;
      const report = buildSeatReport({
        slug,
        org: snap.org,
        tracker: snap.tracker,
        handoffs: snap.handoffs,
        queueFiles: snap.queue,
        claimedFiles: snap.claimed,
        runs: snap.runs,
        briefings: snap.briefings,
        sessionFilenames: snap.sessions.map((s) => s.dispatch_filename),
        repoRoot,
        spendBySeat: snap.spend.bySeat,
        models: snap.models,
        exists: existsSync,
      });
      if (!report) {
        throw new JarvisExecError(
          `unknown seat: ${raw}. Use a roster title or slug (ceo strategist, head of research, copy chief, …).`,
          "unknown_seat",
        );
      }
      emitJarvisFocus(droot, { slug: report.slug });
      return { report, spoken: seatReportBriefScript(report) };
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
      return { run };
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
      return { active: reg.active, projects: listProjects(repoRoot) };
    }

    case "venture.get": {
      const reg = loadRegistry(repoRoot);
      const entry = reg.projects[reg.active];
      return {
        active: reg.active,
        name: entry?.name,
        businessIdea: entry?.businessIdea,
        memory: entry?.memory,
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
      if (!reg.projects[slug]) throw new JarvisExecError(`Unknown project: ${slug}`, "unknown_venture");
      reg.active = slug;
      saveRegistry(repoRoot, reg);
      return { ok: true, active: activeProjectSlug(repoRoot) };
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
          answers[k] = String(v ?? "");
        }
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
      const resolved = resolveWorkTarget(repoRoot, {
        position:
          args.position != null
            ? String(args.position)
            : intake?.intakeSeat,
        goal: args.goal != null ? String(args.goal) : intake?.goal,
      });
      const position = resolved.intakeSeat;
      const baseGoal = String(args.goal ?? intake?.goal ?? resolved.goal ?? "").trim();
      const targetIc =
        args.targetIc != null
          ? String(args.targetIc)
          : intake?.targetIc ?? resolved.targetIc;
      if (!position) throw new JarvisExecError("position required", "missing_arg");
      if (!baseGoal) throw new JarvisExecError("goal required", "missing_arg");
      const answers = intake?.answers ?? {};
      let goal = mergeWorkGoal(baseGoal, answers);
      if (targetIc) {
        goal = `${goal}\n\nPreferred IC to spawn after intake: ${targetIc}`;
      }
      const phase = args.phase != null ? String(args.phase) : undefined;
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
      const report = buildSeatReport({
        slug,
        org: snap.org,
        tracker: snap.tracker,
        handoffs: snap.handoffs,
        queueFiles: snap.queue,
        claimedFiles: snap.claimed,
        runs: snap.runs,
        briefings: snap.briefings,
        sessionFilenames: snap.sessions.map((s) => s.dispatch_filename),
        repoRoot,
        spendBySeat: snap.spend.bySeat,
        models: snap.models,
        exists: existsSync,
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
      const digest = buildDigestPayload(snap, repoRoot);
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
      const digest = buildDigestPayload(snap, repoRoot);
      const blocked = digest.blockedSeats;
      const escalate = digest.escalateSeats;
      return {
        blocked,
        escalate,
        summary: summarizeBlockers(blocked, escalate),
      };
    }

    case "blocker.resolve": {
      const plan = planBlockerResolve(repoRoot, {
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
        emitJarvisFocus(droot, { phase: plan.phase, slug: plan.position });
        return {
          ok: true,
          action: "rewake",
          runId: result.runId,
          position: plan.position,
          blockedSeat: plan.blockedSeat,
          dispatchFilename: plan.dispatchFilename,
          spoken: plan.spoken,
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
      emitJarvisFocus(droot, { phase: queued.packet.phase, slug: queued.packet.position });
      return {
        ok: true,
        action: "queue",
        runId: spawned.runId,
        position: queued.packet.position,
        blockedSeat: plan.blockedSeat,
        filename,
        queuePath: queued.path,
        spoken: plan.spoken,
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
