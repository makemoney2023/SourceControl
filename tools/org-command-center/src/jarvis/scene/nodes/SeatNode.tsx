import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Group, Mesh } from "three";
import type { RosterEntry } from "../../../lib/types";
import type { Vec3 } from "../../layout/forceOrgLayout";
import {
  deriveSeatVisualBehavior,
  STATUS_COLOR,
  type SeatVisualStatus,
} from "../../status";
import { useJarvisStore } from "../../state/useJarvisStore";
import { deptColor } from "../dept-color";
import { markHtmlPointer } from "../html-pointer-guard";
import { SCENE_HTML_Z_INDEX_RANGE } from "../sceneHtml";
import { ceoBody, icBody, managerBody } from "../seat-materials";
const GAZE_SCALE = 1.02;
const HOVER_CARD_MS = 150;
const PREVIEW_DASHES = 12;

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
  previewWakeSlug,
  labelText,
  onSelect,
  onOpenReport,
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
  previewWakeSlug?: string | null;
  labelText?: string | null;
  onSelect: (slug: string) => void;
  onOpenReport?: (slug: string) => void;
}) {
  const terminal = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hovered, setHovered] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const drawerOpen = useJarvisStore().drawerOpen;
  const selectedSlug = useJarvisStore().selectedSlug;
  const showRestTitle = !drawerOpen && typeof labelText === "string";
  const showCuesAndCards = !drawerOpen && selectedSlug == null;
  const color = STATUS_COLOR[status];
  const isCeo = seat.slug === "ceo-strategist";
  const isMgr = seat.level === "manager";
  const ringR = isCeo ? 0.38 : isMgr ? 0.28 : 0.18;
  const bodyH = isCeo ? 0.16 : isMgr ? 0.16 : 0.10;
  const pipY = bodyH / 2 + 0.045;
  const titleY = pipY + 0.16;
  const showPhase = Boolean(phase && status !== "idle");
  const visual = deriveSeatVisualBehavior(status, reducedMotion);
  const previewing = previewWakeSlug === seat.slug;

  useEffect(
    () => () => {
      if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
    },
    [],
  );

  useFrame((state) => {
    if (!terminal.current) return;
    if (visual.pulses && !dimmed) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      terminal.current.scale.setScalar(s);
    } else if (hovered && !reducedMotion) {
      terminal.current.scale.setScalar(GAZE_SCALE);
    } else {
      terminal.current.scale.setScalar(1);
    }
    if (ring.current && visual.orbitSpeed > 0 && !dimmed) {
      ring.current.rotation.z = state.clock.elapsedTime * visual.orbitSpeed;
    }
  });

  function clearHoverCard() {
    if (hoverTimer.current !== null) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setShowCard(false);
  }

  return (
    <group position={[position.x, position.y, position.z]}>
      <group
        ref={terminal}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(seat.slug);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          const slug = seat.slug;
          onOpenReport?.(slug);
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
          if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
          hoverTimer.current = setTimeout(() => setShowCard(true), HOVER_CARD_MS);
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
          clearHoverCard();
        }}
      >
        <mesh visible={false}>
          <cylinderGeometry args={[isCeo ? 0.48 : isMgr ? 0.38 : 0.28, isCeo ? 0.48 : isMgr ? 0.38 : 0.28, 0.28, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <mesh material={isCeo ? ceoBody : isMgr ? managerBody : icBody}>
          {isCeo ? (
            <cylinderGeometry args={[0.38, 0.38, 0.16, 24]} />
          ) : (
            <boxGeometry args={isMgr ? [0.36, 0.16, 0.28] : [0.22, 0.10, 0.18]} />
          )}
        </mesh>

        <mesh position={[0, pipY, 0]}>
          <sphereGeometry args={[0.045, 12, 12]} />
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

        {!isCeo && (
          <mesh position={[0, -bodyH / 2 + 0.006, isMgr ? 0.145 : 0.095]}>
            <boxGeometry args={[isMgr ? 0.36 : 0.22, 0.008, 0.012]} />
            <meshStandardMaterial color={deptColor(seat.dept)} />
          </mesh>
        )}

        {hovered && <pointLight intensity={0.45} color="#f2f0e8" distance={2.4} />}
      </group>

      {selected && !dimmed && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <torusGeometry args={[ringR + 0.2, 0.025, 10, 64]} />
          <meshStandardMaterial
            color="#3fd4be"
            emissive="#3fd4be"
            emissiveIntensity={1.35}
            transparent
            opacity={0.95}
          />
        </mesh>
      )}

      {previewing &&
        Array.from({ length: PREVIEW_DASHES }, (_, i) => (
          <mesh
            key={`preview-${i}`}
            rotation={[Math.PI / 2, (i / PREVIEW_DASHES) * Math.PI * 2, 0]}
            position={[0, 0.02, 0]}
          >
            <torusGeometry args={[ringR + 0.2, 0.018, 8, 12, Math.PI / 16]} />
            <meshStandardMaterial
              color="#3fd4be"
              emissive="#3fd4be"
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}

      {visual.orbitSpeed > 0 && !dimmed && (
        <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[ringR + 0.12, 0.018, 8, 48, Math.PI * 1.4]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {showRestTitle && (
        <Html
          distanceFactor={14}
          position={[0, titleY, 0]}
          center
          pointerEvents="auto"
          zIndexRange={SCENE_HTML_Z_INDEX_RANGE}
        >
          <button
            type="button"
            className="j-mono j-seat-label"
            onPointerDown={(e) => {
              e.stopPropagation();
              markHtmlPointer();
            }}
            onClick={(e) => {
              e.stopPropagation();
              markHtmlPointer();
              onSelect(seat.slug);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onOpenReport?.(seat.slug);
            }}
          >
            {labelText}
          </button>
        </Html>
      )}

      {showCuesAndCards && visual.cue && !dimmed && (
        <Html
          distanceFactor={14}
          position={[0, titleY + 0.14, 0]}
          center
          pointerEvents="none"
          zIndexRange={SCENE_HTML_Z_INDEX_RANGE}
        >
          <div
            className="j-mono"
            style={{
              color,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textShadow: `0 0 8px ${color}`,
              whiteSpace: "nowrap",
            }}
          >
            {visual.cue}
          </div>
        </Html>
      )}

      {showCuesAndCards && showPhase && !dimmed && (
        <Html
          distanceFactor={14}
          position={[0, -bodyH / 2 - 0.16, 0]}
          center
          pointerEvents="none"
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

      {showCuesAndCards && showCard && (
        <Html
          distanceFactor={12}
          position={[0, titleY + 0.36, 0]}
          center
          pointerEvents="none"
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
