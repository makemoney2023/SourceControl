import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseOrgRegistry } from "../../lib/parse-registry";
import { deriveCameraLookAt, forceOrgLayout, type Vec3 } from "./forceOrgLayout";

const dir = dirname(fileURLToPath(import.meta.url));
const sampleOrg = readFileSync(
  join(dir, "../../lib/fixtures/sample-org-registry.md"),
  "utf8",
);

function dist(a: Vec3, b: Vec3) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.hypot(dx, dy, dz);
}

describe("forceOrgLayout", () => {
  it("places CEO at origin and managers on a ring without overlap", () => {
    const { roster } = parseOrgRegistry(sampleOrg);
    const layout = forceOrgLayout(roster);

    expect(layout.get("ceo-strategist")).toEqual({ x: 0, y: 0, z: 0 });

    const managers = roster.filter((r) => r.level === "manager" && r.slug !== "ceo-strategist");
    for (const m of managers) {
      const p = layout.get(m.slug);
      expect(p).toBeDefined();
      const r = Math.hypot(p!.x, p!.z);
      expect(r).toBeGreaterThan(2.5);
      expect(r).toBeLessThan(5);
      expect(Math.abs(p!.y)).toBeLessThan(0.01);
    }

    for (let i = 0; i < managers.length; i++) {
      for (let j = i + 1; j < managers.length; j++) {
        const a = layout.get(managers[i].slug)!;
        const b = layout.get(managers[j].slug)!;
        expect(dist(a, b)).toBeGreaterThan(1.2);
      }
    }
  });

  it("places ICs farther out near their manager and groups by dept", () => {
    const { roster } = parseOrgRegistry(sampleOrg);
    const layout = forceOrgLayout(roster);
    const ic = layout.get("market-research-analyst")!;
    const mgr = layout.get("head-of-research")!;
    expect(Math.hypot(ic.x, ic.z)).toBeGreaterThan(Math.hypot(mgr.x, mgr.z));
    expect(dist(ic, mgr)).toBeLessThan(4);

    const researchIcs = roster
      .filter((r) => r.dept === "research" && r.level === "ic")
      .map((r) => layout.get(r.slug)!);
    const midY =
      researchIcs.reduce((s, p) => s + p.y, 0) / Math.max(researchIcs.length, 1);
    for (const p of researchIcs) {
      expect(Math.abs(p.y - midY)).toBeLessThan(1.5);
    }
  });

  it("is stable across calls (deterministic sort)", () => {
    const { roster } = parseOrgRegistry(sampleOrg);
    const a = forceOrgLayout(roster);
    const b = forceOrgLayout(roster);
    for (const seat of roster) {
      expect(a.get(seat.slug)).toEqual(b.get(seat.slug));
    }
  });
});

describe("deriveCameraLookAt", () => {
  it("targets the selected floor node from the existing layout", () => {
    const layout = new Map<string, Vec3>([
      ["head-of-research", { x: 3, y: 0.5, z: -2 }],
    ]);

    expect(deriveCameraLookAt(layout, "head-of-research", "floor")).toEqual([
      5.8,
      3.5,
      3.5,
      3,
      0.5,
      -2,
    ]);
  });

  it("uses the home eye when nothing is selected", () => {
    expect(deriveCameraLookAt(new Map(), null, "floor")).toEqual([0, 6.5, 13, 0, 0, 0]);
  });

  it("dollies to a follow slug when nothing is selected", () => {
    const layout = new Map([["cfo", { x: 3, y: 0, z: 0 }]]);
    expect(deriveCameraLookAt(layout, null, "floor", { followSlug: "cfo" })).toEqual([
      6.4, 4.2, 7, 3, 0, 0,
    ]);
  });

  it("looks at a running centroid from the home eye", () => {
    const look = deriveCameraLookAt(new Map(), null, "floor", {
      followCentroid: { x: 1, y: 0, z: 2 },
    });
    expect(look).toEqual([0, 6.5, 13, 1, 0, 2]);
  });

  it("preserves mode camera positions outside the floor view", () => {
    const layout = new Map<string, Vec3>([
      ["head-of-research", { x: 3, y: 0.5, z: -2 }],
    ]);

    expect(deriveCameraLookAt(layout, "head-of-research", "assign")).toEqual([
      4,
      5,
      10,
      0,
      0.5,
      0,
    ]);
    expect(deriveCameraLookAt(layout, "head-of-research", "outputs")).toEqual([
      -2,
      4,
      11,
      0,
      0.5,
      0,
    ]);
  });
});
