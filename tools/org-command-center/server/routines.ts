import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { isCronDue, nextCronFire } from "../src/lib/cron";
import { enqueueDispatch } from "../src/lib/dispatch-queue";
import { parseModelRegistry, parseOrgRegistry, resolvePhaseOwner } from "../src/lib/parse-registry";
import { parseRoutine, type RoutineDef } from "../src/lib/routines";
import { validateManagerPacket } from "../src/lib/validate-packet";
import { appendActivity } from "./activity";
import {
  assertReadable,
  dispatchRoot,
  resolveRepoRoot,
} from "./paths";
import { rewakeSession } from "./spawn";

export function routinesDir(dispatchRoot: string) {
  return join(dispatchRoot, "routines");
}

export function listRoutineDefs(dispatchRoot: string): RoutineDef[] {
  const dir = routinesDir(dispatchRoot);
  if (!existsSync(dir)) return [];
  const out: RoutineDef[] = [];
  for (const name of readdirSync(dir).filter(
    (n) => n.endsWith(".yaml") || n.endsWith(".yml"),
  )) {
    try {
      const def = parseRoutine(YAML.parse(readFileSync(join(dir, name), "utf8")));
      if (def) out.push(def);
    } catch {
      /* skip */
    }
  }
  return out;
}

export function writeRoutine(dispatchRoot: string, def: RoutineDef): string {
  mkdirSync(routinesDir(dispatchRoot), { recursive: true });
  const path = join(routinesDir(dispatchRoot), `${def.id}.yaml`);
  writeFileSync(path, YAML.stringify(def), "utf8");
  return path;
}

export function routineSummaries(dispatchRoot: string, now = new Date()) {
  return listRoutineDefs(dispatchRoot).map((r) => ({
    id: r.id,
    enabled: r.enabled,
    cron: r.cron,
    action: r.action,
    last_run_at: r.last_run_at ?? null,
    nextRunAt: nextCronFire(r.cron, now)?.toISOString() ?? null,
  }));
}

export async function tickRoutines(
  repoRoot: string,
  now = new Date(),
  deps?: {
    rewake?: typeof rewakeSession;
  },
): Promise<{ fired: string[]; errors: string[] }> {
  const root = dispatchRoot(repoRoot);
  const fired: string[] = [];
  const errors: string[] = [];
  const org = parseOrgRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/ORG-REGISTRY.md"), "utf8"),
  );
  const models = parseModelRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/MODEL-REGISTRY.md"), "utf8"),
  );

  for (const routine of listRoutineDefs(root)) {
    if (!routine.enabled) continue;
    if (!isCronDue(routine.cron, now, routine.last_run_at)) continue;

    try {
      if (routine.action === "rewake") {
        if (!routine.rewake_dispatch) {
          errors.push(`${routine.id}: missing rewake_dispatch`);
          continue;
        }
        const rewake = deps?.rewake ?? rewakeSession;
        const result = await rewake(repoRoot, {
          dispatchFilename: routine.rewake_dispatch,
          wakeReason: "timer",
        });
        if (!result.ok) {
          errors.push(`${routine.id}: ${result.error}`);
          continue;
        }
      } else {
        const phase = routine.phase ?? "";
        const owner = resolvePhaseOwner(org, phase);
        const position = routine.position || owner?.managerOwner || "";
        const result = validateManagerPacket(
          {
            phase,
            position,
            goal: routine.goal || `Routine ${routine.id}`,
            llm_tier: position ? models[position]?.llmTier : undefined,
            budget_usd: routine.budget_usd ?? null,
          },
          org,
          models,
        );
        if (!result.ok) {
          errors.push(`${routine.id}: ${result.errors.join("; ")}`);
          continue;
        }
        enqueueDispatch(root, result.packet);
      }

      routine.last_run_at = now.toISOString();
      writeRoutine(root, routine);
      appendActivity(root, {
        type: "routine_fired",
        position: routine.position,
        detail: routine.id,
      });
      fired.push(routine.id);
    } catch (e) {
      errors.push(`${routine.id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return { fired, errors };
}

export function startRoutinePoller(repoRoot = resolveRepoRoot(), intervalMs = 30_000) {
  const handle = setInterval(() => {
    void tickRoutines(repoRoot).catch(() => {
      /* ignore tick errors */
    });
  }, intervalMs);
  if (typeof handle.unref === "function") handle.unref();
  return () => clearInterval(handle);
}
