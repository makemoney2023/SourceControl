import { useMemo } from "react";
import * as THREE from "three";
import type { RosterEntry } from "../../lib/types";
import type { Vec3 } from "../layout/forceOrgLayout";

const CURVE_SAMPLES = 16;
const MID_LIFT = 0.25;

export function ReportEdges({
  roster,
  layout,
}: {
  roster: RosterEntry[];
  layout: Map<string, Vec3>;
}) {
  const geom = useMemo(() => {
    const positions: number[] = [];
    for (const seat of roster) {
      if (!seat.reportsTo) continue;
      const a = layout.get(seat.slug);
      const b = layout.get(seat.reportsTo);
      if (!a || !b) continue;
      const start = new THREE.Vector3(a.x, a.y, a.z);
      const end = new THREE.Vector3(b.x, b.y, b.z);
      const mid = new THREE.Vector3(
        (a.x + b.x) / 2,
        (a.y + b.y) / 2 + MID_LIFT,
        (a.z + b.z) / 2,
      );
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const pts = curve.getPoints(CURVE_SAMPLES);
      for (let i = 0; i < pts.length - 1; i += 1) {
        const p0 = pts[i]!;
        const p1 = pts[i + 1]!;
        positions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [roster, layout]);

  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color="#1f4a44" transparent opacity={0.35} />
    </lineSegments>
  );
}
