import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseOrgRegistry } from "../lib/parse-registry";
import { parseTracker } from "../lib/parse-tracker";
import { buildMission, missionBriefScript } from "./mission";

const dir = dirname(fileURLToPath(import.meta.url));
const tracker = parseTracker(
  readFileSync(join(dir, "../lib/fixtures/sample-tracker.md"), "utf8"),
);
const org = parseOrgRegistry(
  readFileSync(join(dir, "../lib/fixtures/sample-org-registry.md"), "utf8"),
);

describe("buildMission", () => {
  it("computes progress and next action", () => {
    const m = buildMission(tracker, org.phaseOwners, [], 1);
    expect(m.currentPhase).toBe("2");
    expect(m.progressPct).toBeGreaterThan(0);
    expect(m.ownerSlug).toBe("head-of-research");
    expect(m.nextAction).toMatch(/head-of-research/);
    expect(m.queueDepth).toBe(1);
  });

  it("builds a spoken brief script", () => {
    const m = buildMission(tracker, org.phaseOwners, [], 0);
    const script = missionBriefScript(m);
    expect(script).toMatch(/phase 2/i);
    expect(script).toMatch(/percent/i);
  });
});
