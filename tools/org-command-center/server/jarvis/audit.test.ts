import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { readActivityTail } from "../activity";
import { dispatchRoot } from "../paths";
import { auditJarvis, resetAuditForTests } from "./audit";
import { handleJarvisAct, setExecuteIntentForTests } from "./act";
import { resetSessionForTests } from "./session";

const BIZ_IDEA = "docs/projects/passive-grid/business-idea";
const FIXTURES = join(import.meta.dirname, "../../src/lib/fixtures");

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), "jarvis-audit-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "skills/org"), { recursive: true });
  writeFileSync(
    join(root, "skills/org/ORG-REGISTRY.md"),
    readFileSync(join(FIXTURES, "sample-org-registry.md"), "utf8"),
  );
  writeFileSync(
    join(root, "projects/registry.json"),
    JSON.stringify({
      active: "passive-grid",
      projects: {
        "passive-grid": {
          name: "Passive Grid",
          businessIdea: BIZ_IDEA,
          memory: "docs/projects/passive-grid/MEMORY",
        },
      },
    }),
  );
  mkdirSync(join(root, BIZ_IDEA, "DISPATCH"), { recursive: true });
  return root;
}

describe("auditJarvis activity feed", () => {
  afterEach(() => {
    resetAuditForTests();
    resetSessionForTests();
    setExecuteIntentForTests(undefined);
  });

  it("writes jarvis_denied to activity when repoRoot is provided", () => {
    const repo = tempRepo();
    auditJarvis(
      {
        roomId: "room-1",
        type: "jarvis_denied",
        intent: "spawn.run_next",
        detail: "Ops mode required",
      },
      repo,
    );
    const activity = readActivityTail(dispatchRoot(repo), 5);
    expect(activity[0]).toMatchObject({
      type: "jarvis_denied",
      detail: expect.stringContaining("spawn.run_next"),
    });
    expect(activity[0].detail).toContain("Ops mode required");
  });

  it("maps jarvis_intent to jarvis_act in activity", () => {
    const repo = tempRepo();
    auditJarvis(
      { roomId: "room-1", type: "jarvis_intent", intent: "mission.get", detail: "briefing" },
      repo,
    );
    const activity = readActivityTail(dispatchRoot(repo), 5);
    expect(activity[0]).toMatchObject({ type: "jarvis_act" });
  });

  it("maps jarvis_confirm_pending to jarvis_confirm in activity", () => {
    const repo = tempRepo();
    auditJarvis(
      {
        roomId: "room-1",
        type: "jarvis_confirm_pending",
        intent: "spawn.run_next",
        detail: "Confirm spawn run next?",
      },
      repo,
    );
    const activity = readActivityTail(dispatchRoot(repo), 5);
    expect(activity[0]).toMatchObject({ type: "jarvis_confirm" });
  });

  it("handleJarvisAct deny appends jarvis_denied activity", async () => {
    const repo = tempRepo();
    const result = await handleJarvisAct(repo, "room-1", {
      intent: "spawn.run_next",
      args: {},
    });
    expect(result.status).toBe("denied");
    const activity = readActivityTail(dispatchRoot(repo), 10);
    expect(activity.some((e) => e.type === "jarvis_denied")).toBe(true);
  });
});
