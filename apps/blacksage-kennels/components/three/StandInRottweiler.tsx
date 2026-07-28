"use client";

import { HERO_MATERIALS } from "@/lib/hero-scene";

const coat = HERO_MATERIALS.coat;
const tan = HERO_MATERIALS.tan;

/** Geometric stand-in until licensed GLB lands at public/models/hero-rottweiler.glb */
export function StandInRottweiler() {
  return (
    <group position={[0, -0.15, 0]} scale={1.08}>
      {/* Body — capsule reads more like a working dog silhouette */}
      <mesh position={[0, 0.52, 0.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.28, 0.62, 8, 16]} />
        <meshStandardMaterial
          color={coat.color}
          roughness={coat.roughness}
          metalness={coat.metalness}
        />
      </mesh>
      {/* Chest tan */}
      <mesh position={[0, 0.42, 0.38]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={tan.color}
          roughness={tan.roughness}
          metalness={tan.metalness}
        />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.78, 0.42]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.22, 12]} />
        <meshStandardMaterial
          color={coat.color}
          roughness={coat.roughness}
          metalness={coat.metalness}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.98, 0.68]} castShadow>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial
          color={coat.color}
          roughness={coat.roughness}
          metalness={coat.metalness}
        />
      </mesh>
      {/* Muzzle */}
      <mesh position={[0, 0.9, 0.9]} castShadow>
        <capsuleGeometry args={[0.08, 0.14, 4, 10]} />
        <meshStandardMaterial
          color={tan.color}
          roughness={tan.roughness}
          metalness={tan.metalness}
        />
      </mesh>
      {/* Ears — triangular wedges */}
      <mesh position={[-0.14, 1.18, 0.58]} rotation={[0.35, 0, -0.35]} castShadow>
        <coneGeometry args={[0.08, 0.18, 3]} />
        <meshStandardMaterial
          color={coat.color}
          roughness={coat.roughness}
          metalness={coat.metalness}
        />
      </mesh>
      <mesh position={[0.14, 1.18, 0.58]} rotation={[0.35, 0, 0.35]} castShadow>
        <coneGeometry args={[0.08, 0.18, 3]} />
        <meshStandardMaterial
          color={coat.color}
          roughness={coat.roughness}
          metalness={coat.metalness}
        />
      </mesh>
      {/* Legs */}
      {(
        [
          [-0.16, 0.2, 0.28],
          [0.16, 0.2, 0.28],
          [-0.16, 0.2, -0.28],
          [0.16, 0.2, -0.28],
        ] as const
      ).map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.055, 0.065, 0.4, 10]} />
          <meshStandardMaterial
            color={coat.color}
            roughness={coat.roughness}
            metalness={coat.metalness}
          />
        </mesh>
      ))}
      {/* Tan socks (front) */}
      <mesh position={[-0.16, 0.02, 0.28]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.08, 10]} />
        <meshStandardMaterial
          color={tan.color}
          roughness={tan.roughness}
          metalness={tan.metalness}
        />
      </mesh>
      <mesh position={[0.16, 0.02, 0.28]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.08, 10]} />
        <meshStandardMaterial
          color={tan.color}
          roughness={tan.roughness}
          metalness={tan.metalness}
        />
      </mesh>
      {/* Natural undocked tail */}
      <mesh position={[0, 0.68, -0.55]} rotation={[0.85, 0, 0.15]} castShadow>
        <capsuleGeometry args={[0.04, 0.42, 4, 8]} />
        <meshStandardMaterial
          color={coat.color}
          roughness={coat.roughness}
          metalness={coat.metalness}
        />
      </mesh>
    </group>
  );
}
