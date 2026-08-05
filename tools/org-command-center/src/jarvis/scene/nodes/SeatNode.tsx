import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import type { RosterEntry } from "../../../lib/types";
import type { Vec3 } from "../../layout/forceOrgLayout";
import {
  deriveSeatVisualBehavior,
  STATUS_COLOR,
  type SeatVisualStatus,
} from "../../status";
import { useJarvisStore } from "../../state/useJarvisStore";
import { SCENE_HTML_Z_INDEX_RANGE } from "../sceneHtml";

export function SeatNode({
  seat,
  position,
  status,
  phase,
  goal,
  selected,
  highlighted,
  dimmed,
  ghost,
  reducedMotion,
  onSelect,
}: {
  seat: RosterEntry;
  position: Vec3;
  status: SeatVisualStatus;
  phase?: string;
  goal?: string;
  selected?: boolean;
  highlighted?: boolean;
  dimmed?: boolean;
  ghost?: boolean;
  reducedMotion: boolean;
  onSelect: (slug: string) => void;
}) {
  const mesh = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const drawerOpen = useJarvisStore().drawerOpen;
  const showHtmlLabels = !drawerOpen;
  const color = STATUS_COLOR[status];
  const isMgr = seat.level === "manager";
  const radius = seat.slug === "ceo-strategist" ? 0.38 : isMgr ? 0.28 : 0.18;
  const showPhase = Boolean(phase && status !== "idle");
  const visual = deriveSeatVisualBehavior(status, reducedMotion);

  useFrame((state) => {
    if (!mesh.current) return;
    if (visual.pulses && !dimmed) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      mesh.current.scale.setScalar(s);
    } else {
      mesh.current.scale.setScalar(highlighted ? 1.15 : 1);
    }
    if (ring.current && visual.orbitSpeed > 0 && !dimmed) {
      ring.current.rotation.z = state.clock.elapsedTime * visual.orbitSpeed;
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

      {selected && !dimmed && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius + 0.2, 0.025, 10, 64]} />
          <meshStandardMaterial
            color="#3fd4be"
            emissive="#3fd4be"
            emissiveIntensity={1.35}
            transparent
            opacity={0.95}
          />
        </mesh>
      )}

      {visual.orbitSpeed > 0 && !dimmed && (
        <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[radius + 0.12, 0.018, 8, 48, Math.PI * 1.4]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {showHtmlLabels && visual.cue && !dimmed && (
        <Html
          distanceFactor={14}
          position={[0, radius + 0.17, 0]}
          center
          zIndexRange={SCENE_HTML_Z_INDEX_RANGE}
        >
          <div
            className="j-mono"
            style={{
              color,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              pointerEvents: "none",
              textShadow: `0 0 8px ${color}`,
              whiteSpace: "nowrap",
            }}
          >
            {visual.cue}
          </div>
        </Html>
      )}

      {showHtmlLabels && showPhase && !dimmed && (
        <Html
          distanceFactor={14}
          position={[0, -radius - 0.18, 0]}
          center
          zIndexRange={SCENE_HTML_Z_INDEX_RANGE}
        >
          <div
            className="j-mono"
            style={{
              fontSize: 10,
              color: "var(--j-accent)",
              letterSpacing: "0.08em",
              textShadow: "0 0 8px rgba(63,212,190,0.6)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            P{phase}
          </div>
        </Html>
      )}

      {showHtmlLabels && (hovered || highlighted) && (
        <Html
          distanceFactor={12}
          position={[0, radius + 0.48, 0]}
          center
          zIndexRange={SCENE_HTML_Z_INDEX_RANGE}
        >
          <div
            className="j-hud-panel"
            style={{ padding: "6px 10px", minWidth: 150, pointerEvents: "none" }}
          >
            <div style={{ fontSize: 12, fontWeight: 600 }}>{seat.title}</div>
            <div className="j-muted" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
              {seat.slug}
            </div>
            {phase && (
              <div className="j-muted" style={{ marginTop: 2, fontSize: 11 }}>
                Phase {phase}
                {goal ? ` · ${goal}` : ""}
              </div>
            )}
            <div
              className="j-chip"
              data-tone={
                status === "done"
                  ? "ok"
                  : status === "blocked" || status === "error"
                    ? "danger"
                    : "warn"
              }
              style={{ marginTop: 4 }}
            >
              {status}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
