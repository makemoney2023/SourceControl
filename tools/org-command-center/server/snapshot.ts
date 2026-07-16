import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { indexHandoffs } from "../src/lib/parse-handoff";
import { parseModelRegistry, parseOrgRegistry } from "../src/lib/parse-registry";
import { parseTracker } from "../src/lib/parse-tracker";
import { parseStandupBriefing } from "../src/jarvis/briefings";
import { buildCSuiteBoard } from "../src/jarvis/csuite";
import { buildMission } from "../src/jarvis/mission";
import { buildTasks } from "../src/jarvis/tasks";
import { readActivityTail } from "./activity";
import { listAgentStates } from "./agent-state";
import { listDispatchFiles } from "./dispatch-files";
import {
  activeProjectSlug,
  assertReadable,
  briefingsDir,
  businessIdeaRel,
  dispatchRoot,
  handoffsDir,
  trackerPath,
} from "./paths";
import { routineSummaries } from "./routines";
import { listRuns } from "./runs-fs";
import { listSessions } from "./sessions";
import { loadSpend, totalSpendUsd } from "./spend";
import { syncHandoffAlerts } from "./alerts-fs";

export function loadSnapshot(repoRoot: string) {
  const org = parseOrgRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/ORG-REGISTRY.md"), "utf8"),
  );
  const models = parseModelRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/MODEL-REGISTRY.md"), "utf8"),
  );
  const tracker = parseTracker(readFileSync(trackerPath(repoRoot), "utf8"));

  const hd = handoffsDir(repoRoot);
  let handoffs: ReturnType<typeof indexHandoffs> = [];
  if (existsSync(hd)) {
    handoffs = indexHandoffs(
      readdirSync(hd)
        .filter((n) => n.endsWith(".md") && n !== "README.md")
        .map((name) => ({
          name,
          content: readFileSync(join(hd, name), "utf8"),
        })),
    );
  }

  const bd = briefingsDir(repoRoot);
  const briefings = existsSync(bd)
    ? readdirSync(bd)
        .filter((n) => n.endsWith("-standup.md"))
        .map((name) => {
          const slug = name.replace(/-standup.md$/, "");
          return parseStandupBriefing(slug, readFileSync(join(bd, name), "utf8"));
        })
    : [];

  const droot = dispatchRoot(repoRoot);
  const queue = listDispatchFiles(droot, "queue");
  const claimed = listDispatchFiles(droot, "claimed");
  const runs = listRuns(join(droot, "runs"), 40);
  const agentStates = listAgentStates(droot);
  const activity = readActivityTail(droot, 40);
  const sessions = listSessions(droot);
  const spend = loadSpend(droot);
  const routines = routineSummaries(droot);
  const alerts = syncHandoffAlerts(droot, handoffs);
  const mission = {
    ...buildMission(tracker, org.phaseOwners, handoffs, queue.length),
    spendUsd: totalSpendUsd(spend),
  };
  const tasks = buildTasks({
    tracker,
    handoffs,
    queueFiles: queue,
    claimedFiles: claimed,
    runs,
    sessionFilenames: sessions.map((s) => s.dispatch_filename),
  });
  const csuite = buildCSuiteBoard(
    org,
    models,
    handoffs,
    briefings,
    org.phaseOwners,
    tracker.phases.map((p) => ({ phase: p.phase, status: p.status })),
    { runs, agentStates },
  );

  return {
    activeProject: activeProjectSlug(repoRoot),
    businessIdeaRel: businessIdeaRel(repoRoot),
    tracker,
    org,
    models,
    handoffs,
    briefings,
    queue,
    claimed,
    runs,
    agentStates,
    activity,
    sessions,
    spend,
    routines,
    alerts,
    mission,
    tasks,
    csuite,
  };
}
