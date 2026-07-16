import { Html } from "@react-three/drei";
import { useState } from "react";
import { stripBusinessIdeaPrefix } from "../../../lib/project-paths";

export function ArtifactPlaque({
  path,
  businessIdeaRel,
  index,
  total,
  selected,
  onSelect,
}: {
  path: string;
  businessIdeaRel: string;
  index: number;
  total: number;
  selected?: boolean;
  onSelect: (path: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const t = index / Math.max(total, 1);
  const angle = t * Math.PI * 2;
  const radius = 4.5;
  const y = -1.2 + t * 3.6;
  const label = stripBusinessIdeaPrefix(path, businessIdeaRel);

  return (
    <group position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}>
      <mesh
        rotation={[0, -angle + Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(path);
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
        <boxGeometry args={[1.4, 0.55, 0.06]} />
        <meshStandardMaterial
          color={selected ? "#3fd4be" : "#1a2a30"}
          emissive={selected || hovered ? "#3fd4be" : "#0a1518"}
          emissiveIntensity={selected ? 0.8 : hovered ? 0.4 : 0.15}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Html distanceFactor={14} position={[0, 0, 0.05]} center>
        <div
          style={{
            width: 120,
            fontSize: 9,
            fontFamily: "IBM Plex Mono, monospace",
            color: selected ? "#041210" : "#c8e8e2",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          {label.length > 28 ? label.slice(0, 26) + "…" : label}
        </div>
      </Html>
    </group>
  );
}
