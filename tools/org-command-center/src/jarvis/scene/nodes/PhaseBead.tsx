import { Html } from "@react-three/drei";
import { useJarvisStore } from "../../state/useJarvisStore";
import { SCENE_HTML_Z_INDEX_RANGE } from "../sceneHtml";
import { useState } from "react";

function statusColor(status: string) {
  if (status === "✅") return "#4ecf8a";
  if (status === "🔄") return "#e0a04a";
  if (status === "⏭️") return "#44555a";
  return "#3a4a50";
}

function statusLabel(status: string) {
  if (status === "✅") return "Done";
  if (status === "🔄") return "In progress";
  if (status === "⏭️") return "Skipped";
  return "Pending";
}

function PhaseMark({ status, selected }: { status: string; selected?: boolean }) {
  const color = statusColor(status);
  const intensity = selected ? 1.4 : 0.5;
  if (status === "🔄") {
    return (
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.12, 0.04, 0.12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} />
      </mesh>
    );
  }
  if (status === "✅") {
    return (
      <mesh>
        <boxGeometry args={[0.14, 0.03, 0.08]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} />
      </mesh>
    );
  }
  if (status === "⏭️") {
    return (
      <mesh>
        <boxGeometry args={[0.16, 0.02, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} />
      </mesh>
    );
  }
  return (
    <mesh>
      <boxGeometry args={[0.12, 0.02, 0.12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        wireframe
      />
    </mesh>
  );
}

export function PhaseBead({
  phase,
  index,
  total,
  selected,
  selectable,
  onSelect,
}: {
  phase: { phase: string; name: string; status: string };
  index: number;
  total: number;
  selected?: boolean;
  selectable?: boolean;
  onSelect?: (phase: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const drawerOpen = useJarvisStore().drawerOpen;
  const t = total <= 1 ? 0 : index / (total - 1);
  const angle = -Math.PI * 0.75 + t * Math.PI * 1.5;
  const r = 2.2;
  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  const y = 0.06;
  const lift = selected ? 0.04 : 0;
  const label = statusLabel(phase.status);

  return (
    <group position={[x, y + lift, z]}>
      <group
        onClick={(e) => {
          e.stopPropagation();
          if (selectable && onSelect) onSelect(phase.phase);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          if (selectable) document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <PhaseMark status={phase.status} selected={selected} />
      </group>
      {!drawerOpen && (hovered || selected) && (
        <Html
          distanceFactor={10}
          position={[0, 0.28, 0]}
          center
          zIndexRange={SCENE_HTML_Z_INDEX_RANGE}
        >
          <div className="j-glass" style={{ padding: "4px 8px", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 11 }}>
              {phase.phase} {phase.name} {label}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}
