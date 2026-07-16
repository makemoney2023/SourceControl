import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import type { ManagerPacketInput } from "../../src/lib/types";
import type { WakeReason } from "../../src/lib/runs";
import {
  buildCompanyDigest,
} from "../../src/jarvis/company-digest";
import { buildSeatReport } from "../../src/jarvis/seat-report";
import { appendActivity } from "../activity";
import { ackHandoffAlert } from "../alerts-fs";
import { setSeatPaused } from "../agent-state";
import { createVenture, slugifyVentureName } from "../create-venture";
import {
  activeProjectSlug,
  assertJarvisReadable,
  dispatchRoot,
  listProjects,
  loadRegistry,
  saveRegistry,
} from "../paths";
import { queueValidatedDispatch } from "../queue-validated-dispatch";
import { cancelRun as abortRegisteredRun } from "../run-registry";
import type { RuntimeAdapter } from "../runtime-adapter";
import { listRoutineDefs, writeRoutine } from "../routines";
import { loadSnapshot } from "../snapshot";
import { rewakeSession, spawnClaimedManager } from "../spawn";
import { writeCsuiteDraft } from "../write-csuite-draft";
import { buildQueueForPacket, previewQueueFor } from "./dispatch-for";
import { JarvisExecError } from "./errors";
import type { JarvisIntent } from "./intents";
import { cancelConfirm, getLastSummary, getRoomMode, peekLatestConfirm, setRoomMode } from "./session";

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

const SESSION_HELP = [
  "**Modes**",
  "- Briefing — mission, digest, seat report, tasks, runs, activity, alerts, spend",
  "- Ops — + assign, run next, cancel, rewake, pause, resume, cancel pending",
  "- Review — + file read, csuite draft",
  "- Architect — + venture create/switch",
  "",
  "**Top intents**",
  "- mission.get — where are we / mission status",
  "- digest.get / digest.focus — company rollup or blocked/escalate/awaiting slice",
  "- seat.report — report on a seat",
  "- phase.list_open — pending or in-progress phases",
  "- activity.tail — last N pulse events",
  "- session.help — this cheatsheet",
  "- session.repeat — repeat last spoken summary",
  "- jarvis.ping — stack heartbeat",
  "- mode.set — switch briefing / ops / review / architect",
].join("\n");

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
      const slug = String(args.slug ?? "ceo-strategist");
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
      emitJarvisFocus(droot, { slug });
      return { report };
    }

    case "tasks.list":
      return { tasks: snap.tasks };

    case "runs.list":
      return { runs: snap.runs };

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

    case "spawn.run_next":
      return spawnClaimedManager(repoRoot, {
        filename: typeof args.filename === "string" ? args.filename : undefined,
        wakeReason: (args.wakeReason as WakeReason | undefined) ?? "run_next",
        apiKey: typeof args.apiKey === "string" ? args.apiKey : args.apiKey === null ? null : undefined,
        adapter: args.adapter as RuntimeAdapter | undefined,
      });

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
      return rewakeSession(repoRoot, {
        dispatchFilename:
          typeof args.dispatchFilename === "string" ? args.dispatchFilename : undefined,
        agentId: typeof args.agentId === "string" ? args.agentId : undefined,
        wakeReason: (args.wakeReason as WakeReason | undefined) ?? "rewake",
        apiKey: typeof args.apiKey === "string" ? args.apiKey : args.apiKey === null ? null : undefined,
        adapter: args.adapter as RuntimeAdapter | undefined,
      });

    case "agent.pause": {
      const slug = String(args.slug ?? "");
      if (!slug) throw new JarvisExecError("slug required", "missing_arg");
      const state = setSeatPaused(droot, slug, true);
      appendActivity(droot, { type: "seat_paused", position: slug });
      return { ok: true, slug, ...state };
    }

    case "agent.resume": {
      const slug = String(args.slug ?? "");
      if (!slug) throw new JarvisExecError("slug required", "missing_arg");
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
      const position = String(args.position ?? "");
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
      if (!token) return { ok: false, error: "no pending confirm" };
      const cancelled = cancelConfirm(roomId, token);
      if (!cancelled) return { ok: false, error: "invalid or expired token" };
      return { ok: true, cancelled: { intent: cancelled.intent } };
    }

    case "jarvis.ping":
      return { ok: true, time: new Date().toISOString() };

    case "phase.list_open": {
      const phases = snap.tracker.phases.filter(
        (p) => p.status === "⬜" || p.status === "🔄",
      );
      return { phases };
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

    case "activity.tail": {
      const nRaw = args.n;
      const n =
        typeof nRaw === "number" && Number.isFinite(nRaw) && nRaw > 0
          ? Math.floor(nRaw)
          : 10;
      // snapshot activity is newest-first (see readActivityTail)
      return { activity: snap.activity.slice(0, n) };
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
