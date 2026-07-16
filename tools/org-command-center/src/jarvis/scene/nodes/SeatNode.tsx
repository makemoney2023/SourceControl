import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import type { RosterEntry } from "../../../lib/types";
import type { Vec3 } from "../../layout/forceOrgLayout";
import { STATUS_COLOR, type SeatVisualStatus } from "../../status";

export function SeatNode({
  seat,
  position,
  status,
  highlighted,
  dimmed,
  ghost,
  onSelect,
}: {
  seat: RosterEntry;
  position: Vec3;
  status: SeatVisualStatus;
  highlighted?: boolean;
  dimmed?: boolean;
  ghost?: boolean;
  onSelect: (slug: string) => void;
}) {
  const mesh = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const color = STATUS_COLOR[status];
  const isMgr = seat.level === "manager";
  const radius = seat.slug === "ceo-strategist" ? 0.38 : isMgr ? 0.28 : 0.18;

  useFrame((state) => {
    if (!mesh.current) return;
    if (status === "running" && !dimmed) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      mesh.current.scale.setScalar(s);
    } else {
      mesh.current.scale.setScalar(highlighted ? 1.15 : 1);
    }
  });

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={mesh}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(seat.slug);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={highlighted ? 1.2 : status === "idle" ? 0.15 : 0.55}
          transparent
          opacity={dimmed ? 0.18 : ghost ? 0.45 : 0.95}
          roughness={0.35}
          metalness={0.4}
        />
      </mesh>
      {(hovered || highlighted) && (
        <Html distanceFactor={12} position={[0, radius + 0.35, 0]} center>
          <div
            className="j-glass"
            style={{ padding: "6px 10px", minWidth: 140, pointerEvents: "none" }}
          >
            <div style={{ fontSize: 12, fontWeight: 600 }}>{seat.title}</div>
            <div className="j-muted" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
              {seat.slug}
            </div>
            <div className="j-chip" data-tone={status === "done" ? "ok" : status === "blocked" ? "danger" : "warn"} style={{ marginTop: 4 }}>
              {status}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
