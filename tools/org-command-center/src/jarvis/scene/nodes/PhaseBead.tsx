import { Html } from "@react-three/drei";
import { useState } from "react";
function statusColor(status: string) {
  if (status === "✅") return "#4ecf8a";
  if (status === "🔄") return "#e0a04a";
  if (status === "⏭️") return "#44555a";
  return "#3a4a50";
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
  const t = total <= 1 ? 0 : index / (total - 1);
  const angle = -Math.PI * 0.75 + t * Math.PI * 1.5;
  const r = 2.2;
  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  const y = 1.8;
  const color = statusColor(phase.status);

  return (
    <group position={[x, y, z]}>
      <mesh
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
        <sphereGeometry args={[selected ? 0.14 : 0.1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 1.4 : 0.5}
        />
      </mesh>
      {(hovered || selected) && (
        <Html distanceFactor={10} position={[0, 0.28, 0]} center>
          <div className="j-glass" style={{ padding: "4px 8px", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 11 }}>
              {phase.phase} {phase.name} {phase.status}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}
