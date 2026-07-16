import { useMemo } from "react";
import * as THREE from "three";
import type { RosterEntry } from "../../lib/types";
import type { Vec3 } from "../layout/forceOrgLayout";

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
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [roster, layout]);

  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color="#1f4a44" transparent opacity={0.55} />
    </lineSegments>
  );
}
