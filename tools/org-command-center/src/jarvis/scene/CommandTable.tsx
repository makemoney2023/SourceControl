import { MeshReflectorMaterial } from "@react-three/drei";
import { BackSide } from "three";
import { IC_RING, MANAGER_RING } from "../layout/forceOrgLayout";
import { deptColor } from "./dept-color";

const TABLE_RADIUS = 9;
const TABLE_HEIGHT = 0.18;
const DAIS_RADIUS = 0.7;
const DAIS_HEIGHT = 0.1;
const TICK_COUNT = 12;
const IC_BAND_INNER = IC_RING - 0.45;
const IC_BAND_OUTER = IC_RING + 0.45;

export function CommandTable({
  depts,
  onClick,
}: {
  depts: string[];
  onClick?: () => void;
}) {
  const wedgeCount = Math.max(depts.length, 1);
  const wedgeSpan = (Math.PI * 2) / wedgeCount;

  return (
    <group
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
    >
      <mesh>
        <sphereGeometry args={[22, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#05070a" roughness={1} side={BackSide} />
      </mesh>

      <mesh position={[0, -TABLE_HEIGHT / 2, 0]} receiveShadow>
        <cylinderGeometry args={[TABLE_RADIUS, TABLE_RADIUS, TABLE_HEIGHT, 64]} />
        <meshStandardMaterial color="#0c1014" roughness={0.72} metalness={0.22} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <circleGeometry args={[TABLE_RADIUS - 0.04, 64]} />
        <MeshReflectorMaterial
          color="#0c1014"
          roughness={0.72}
          metalness={0.22}
          mirror={0.12}
          mixStrength={0.35}
          blur={[80, 20]}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[TABLE_RADIUS, 0.05, 12, 96]} />
        <meshStandardMaterial color="#1a2228" roughness={0.6} metalness={0.35} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <torusGeometry args={[MANAGER_RING, 0.012, 8, 96]} />
        <meshStandardMaterial color="#1a2a30" emissive="#000000" emissiveIntensity={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <torusGeometry args={[IC_RING, 0.012, 8, 96]} />
        <meshStandardMaterial color="#1a2a30" emissive="#000000" emissiveIntensity={0} />
      </mesh>

      {depts.map((dept, i) => (
        <mesh
          key={dept}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.006, 0]}
        >
          <ringGeometry
            args={[IC_BAND_INNER, IC_BAND_OUTER, 32, 1, i * wedgeSpan, wedgeSpan]}
          />
          <meshStandardMaterial
            color={deptColor(dept)}
            transparent
            opacity={0.1}
            depthWrite={false}
          />
        </mesh>
      ))}

      {Array.from({ length: TICK_COUNT }, (_, i) => {
        const angle = (i / TICK_COUNT) * Math.PI * 2;
        return (
          <mesh
            key={`tick-${i}`}
            position={[Math.cos(angle) * IC_RING, 0.014, Math.sin(angle) * IC_RING]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.16, 0.006, 0.018]} />
            <meshStandardMaterial color="#1a2a30" />
          </mesh>
        );
      })}

      <mesh position={[0, DAIS_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[DAIS_RADIUS, DAIS_RADIUS, DAIS_HEIGHT, 32]} />
        <meshStandardMaterial color="#161c22" roughness={0.45} metalness={0.55} />
      </mesh>
    </group>
  );
}
