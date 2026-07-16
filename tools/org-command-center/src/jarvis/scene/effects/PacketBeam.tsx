import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import * as THREE from "three";
import type { Vec3 } from "../../layout/forceOrgLayout";

export function PacketBeam({
  from,
  to,
  active,
  onDone,
}: {
  from: Vec3;
  to: Vec3;
  active: boolean;
  onDone?: () => void;
}) {
  const mesh = useRef<Mesh>(null);
  const progress = useRef(0);
  const start = useMemo(() => new THREE.Vector3(from.x, from.y + 0.2, from.z), [from]);
  const end = useMemo(() => new THREE.Vector3(to.x, to.y + 0.2, to.z), [to]);

  useFrame((_, dt) => {
    if (!active || !mesh.current) return;
    progress.current += dt * 1.8;
    const t = Math.min(progress.current, 1);
    mesh.current.position.lerpVectors(start, end, t);
    mesh.current.visible = t < 1;
    if (t >= 1) {
      progress.current = 0;
      onDone?.();
    }
  });

  if (!active) return null;

  return (
    <mesh ref={mesh} position={[start.x, start.y, start.z]}>
      <octahedronGeometry args={[0.12, 0]} />
      <meshStandardMaterial color="#3fd4be" emissive="#3fd4be" emissiveIntensity={2} />
    </mesh>
  );
}
