import type { RosterEntry } from "../../lib/types";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type CameraLookAt = [
  positionX: number,
  positionY: number,
  positionZ: number,
  targetX: number,
  targetY: number,
  targetZ: number,
];

const MANAGER_RING = 3.6;
const IC_RING = 6.2;
const DEPT_Y_STEP = 0.35;

const MODE_CAMERA: Record<"floor" | "assign" | "outputs", CameraLookAt> = {
  floor: [0, 6.5, 13, 0, 0, 0],
  assign: [4, 5, 10, 0, 0.5, 0],
  outputs: [-2, 4, 11, 0, 0.5, 0],
};

export function deriveCameraLookAt(
  layout: Map<string, Vec3>,
  selectedSlug: string | null,
  mode: "floor" | "assign" | "outputs",
  opts?: { followSlug?: string | null; followCentroid?: Vec3 | null },
): CameraLookAt {
  if (mode === "floor" && selectedSlug) {
    const target = layout.get(selectedSlug);
    if (!target) return MODE_CAMERA.floor;
    return [
      target.x + 2.8,
      target.y + 3,
      target.z + 5.5,
      target.x,
      target.y,
      target.z,
    ];
  }
  const follow = opts?.followSlug ? layout.get(opts.followSlug) : undefined;
  if (follow) {
    return [follow.x + 3.4, follow.y + 4.2, follow.z + 7, follow.x, follow.y, follow.z];
  }
  if (opts?.followCentroid) {
    const { x, y, z } = opts.followCentroid;
    return [0, 6.5, 13, x, y, z];
  }
  return MODE_CAMERA[mode];
}

/**
 * Pure layout: CEO at origin, managers on inner ring, ICs on outer arcs by dept.
 * Deterministic via slug sort within each ring / dept group.
 */
export function forceOrgLayout(roster: RosterEntry[]): Map<string, Vec3> {
  const out = new Map<string, Vec3>();
  const ceo = roster.find((r) => r.slug === "ceo-strategist");
  if (ceo) out.set(ceo.slug, { x: 0, y: 0, z: 0 });

  const managers = roster
    .filter((r) => r.level === "manager" && r.slug !== "ceo-strategist")
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug));

  managers.forEach((m, i) => {
    const angle = (i / Math.max(managers.length, 1)) * Math.PI * 2 - Math.PI / 2;
    out.set(m.slug, {
      x: Math.cos(angle) * MANAGER_RING,
      y: 0,
      z: Math.sin(angle) * MANAGER_RING,
    });
  });

  const depts = [...new Set(roster.map((r) => r.dept))].sort();
  const deptY = new Map(depts.map((d, i) => [d, (i - depts.length / 2) * DEPT_Y_STEP]));

  const ics = roster
    .filter((r) => r.level === "ic")
    .slice()
    .sort((a, b) => a.dept.localeCompare(b.dept) || a.slug.localeCompare(b.slug));

  const byManager = new Map<string, RosterEntry[]>();
  for (const ic of ics) {
    const key = ic.reportsTo || "ceo-strategist";
    const list = byManager.get(key) ?? [];
    list.push(ic);
    byManager.set(key, list);
  }

  for (const [mgrSlug, reports] of byManager) {
    const mgrPos = out.get(mgrSlug) ?? { x: 0, y: 0, z: 0 };
    const baseAngle = Math.atan2(mgrPos.z, mgrPos.x);
    const n = reports.length;
    reports.forEach((ic, i) => {
      const spread = n === 1 ? 0 : ((i / (n - 1)) - 0.5) * 0.9;
      const angle = baseAngle + spread;
      out.set(ic.slug, {
        x: Math.cos(angle) * IC_RING,
        y: deptY.get(ic.dept) ?? 0,
        z: Math.sin(angle) * IC_RING,
      });
    });
  }

  // Any leftover seats (safety)
  for (const seat of roster) {
    if (!out.has(seat.slug)) {
      out.set(seat.slug, { x: 0, y: 1, z: 0 });
    }
  }

  return out;
}
