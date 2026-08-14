import { MeshReflectorMaterial } from "@react-three/drei";
import {
  BackSide,
  EdgesGeometry,
  ExtrudeGeometry,
  Path,
  Shape,
  Vector2,
} from "three";
import { IC_RING, MANAGER_RING } from "../layout/forceOrgLayout";
import { deptColor } from "./dept-color";
import { htmlPointerRecently } from "./html-pointer-guard";

const TABLE_RADIUS = 9;
const TABLE_HEIGHT = 0.18;
const TICK_COUNT = 12;
const IC_BAND_INNER = IC_RING - 0.45;
const IC_BAND_OUTER = IC_RING + 0.45;

const lipShape = new Shape();
lipShape.absarc(0, 0, 9.08, 0, Math.PI * 2, false);
const lipHole = new Path();
lipHole.absarc(0, 0, 8.86, 0, Math.PI * 2, true);
lipShape.holes.push(lipHole);
const lipGeometry = new ExtrudeGeometry(lipShape, {
  depth: 0.06,
  bevelEnabled: true,
  bevelThickness: 0.035,
  bevelSize: 0.03,
  bevelSegments: 2,
});
const lipEdges = new EdgesGeometry(lipGeometry, 20);

const daisPoints = [
  new Vector2(0, 0),
  new Vector2(0.7, 0),
  new Vector2(0.7, 0.04),
  new Vector2(0.62, 0.08),
  new Vector2(0.58, 0.1),
  new Vector2(0, 0.1),
];

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
        if (htmlPointerRecently()) return;
        onClick?.();
      }}
    >
      <mesh raycast={() => null}>
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

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} raycast={() => null}>
        <primitive object={lipGeometry} attach="geometry" />
        <meshPhysicalMaterial
          color="#1a2228"
          roughness={0.38}
          metalness={0.55}
          clearcoat={0.55}
          clearcoatRoughness={0.25}
          envMapIntensity={0.35}
        />
      </mesh>
      <lineSegments rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <primitive object={lipEdges} attach="geometry" />
        <lineBasicMaterial color="#2a343c" transparent opacity={0.55} />
      </lineSegments>

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

      <mesh>
        <latheGeometry args={[daisPoints, 32]} />
        <meshStandardMaterial
          color="#161c22"
          roughness={0.4}
          metalness={0.62}
          envMapIntensity={0.35}
        />
      </mesh>
    </group>
  );
}
