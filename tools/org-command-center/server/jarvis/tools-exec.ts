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
import type { JarvisIntent } from "./intents";
import { getRoomMode, setRoomMode } from "./session";

export class JarvisExecError extends Error {
  readonly code: string;

  constructor(message: string, code = "exec_error") {
    super(message);
    this.name = "JarvisExecError";
    this.code = code;
  }
}

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
        digest: buildCompanyDigest({
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
        }),
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
