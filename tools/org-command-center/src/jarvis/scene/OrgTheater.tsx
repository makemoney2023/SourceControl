import { CameraControls, ContactShadows, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef } from "react";
import type { SituationSnapshot } from "../../api/client";

type TheaterSnap = Pick<
  SituationSnapshot,
  "org" | "handoffs" | "tracker" | "queue" | "businessIdeaRel"
> & {
  models?: SituationSnapshot["models"];
};
import { forceOrgLayout } from "../layout/forceOrgLayout";
import { indexArtifacts } from "../artifacts";
import { seatStatus } from "../status";
import { useJarvisStore } from "../state/useJarvisStore";
import { PacketBeam } from "./effects/PacketBeam";
import { ArtifactPlaque } from "./nodes/ArtifactPlaque";
import { PhaseBead } from "./nodes/PhaseBead";
import { SeatNode } from "./nodes/SeatNode";
import { ReportEdges } from "./ReportEdges";

function TheaterScene({ snapshot }: { snapshot: TheaterSnap }) {
  const {
    mode,
    selectedSlug,
    selectedPhase,
    selectedArtifact,
    beamActive,
    reducedMotion,
    bloomEnabled,
    selectSlug,
    selectPhase,
    selectArtifact,
    setBeam,
  } = useJarvisStore();

  const layout = useMemo(
    () => forceOrgLayout(snapshot.org.roster),
    [snapshot.org.roster],
  );
  const controls = useRef<CameraControls | null>(null);

  const phase = selectedPhase ?? snapshot.tracker.currentPhase;
  const owner = snapshot.org.phaseOwners.find((p) => p.phase === phase);
  const maySpawn = new Set(owner?.maySpawn ?? []);
  const beamTarget = owner ? layout.get(owner.managerOwner) : undefined;

  const artifacts = useMemo(
    () =>
      indexArtifacts(
        snapshot.tracker.phases,
        snapshot.handoffs,
        snapshot.businessIdeaRel,
      ),
    [snapshot.tracker.phases, snapshot.handoffs, snapshot.businessIdeaRel],
  );

  const phaseBeads = snapshot.tracker.phases.filter((p) =>
    ["⬜", "🔄", "✅", "⏭️"].includes(p.status),
  );

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const run = async () => {
      if (mode === "floor") {
        await c.setLookAt(0, 6, 12, 0, 0, 0, !reducedMotion);
      } else if (mode === "assign") {
        await c.setLookAt(4, 5, 10, 0, 0.5, 0, !reducedMotion);
      } else {
        await c.setLookAt(-2, 4, 11, 0, 0.5, 0, !reducedMotion);
      }
    };
    void run();
  }, [mode, reducedMotion]);

  return (
    <>
      <color attach="background" args={["#070b10"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 10, 4]} intensity={1.1} color="#b8fff0" />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#3fd4be" />
      <Stars radius={40} depth={30} count={reducedMotion ? 80 : 220} factor={2} fade speed={0.2} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial
          color="#0c1418"
          emissive="#0a2a26"
          emissiveIntensity={0.25}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 0.12, 32]} />
        <meshStandardMaterial color="#1a3a36" emissive="#3fd4be" emissiveIntensity={0.35} />
      </mesh>

      <ReportEdges roster={snapshot.org.roster} layout={layout} />

      {snapshot.org.roster.map((seat) => {
        const pos = layout.get(seat.slug);
        if (!pos) return null;
        const { status } = seatStatus(seat.slug, snapshot.handoffs);
        const isOwner = mode === "assign" && owner?.managerOwner === seat.slug;
        const isGhost =
          mode === "assign" && maySpawn.has(seat.slug) && seat.level === "ic";
        const dimmed =
          mode === "assign" &&
          !isOwner &&
          !isGhost &&
          seat.slug !== "ceo-strategist";
        return (
          <SeatNode
            key={seat.slug}
            seat={seat}
            position={pos}
            status={status}
            highlighted={
              selectedSlug === seat.slug || isOwner || (mode === "outputs" && false)
            }
            dimmed={dimmed}
            ghost={isGhost}
            onSelect={selectSlug}
          />
        );
      })}

      {phaseBeads.map((p, i) => (
        <PhaseBead
          key={p.phase}
          phase={p}
          index={i}
          total={phaseBeads.length}
          selected={phase === p.phase}
          selectable={mode === "assign" || mode === "floor"}
          onSelect={(ph) => {
            selectPhase(ph);
            if (mode !== "assign") {
              // still allow phase focus on floor
            }
          }}
        />
      ))}

      {mode === "outputs" &&
        artifacts.map((a, i) => (
          <ArtifactPlaque
            key={a.path}
            path={a.path}
            businessIdeaRel={snapshot.businessIdeaRel}
            index={i}
            total={artifacts.length}
            selected={selectedArtifact === a.path}
            onSelect={selectArtifact}
          />
        ))}

      {beamActive && beamTarget && (
        <PacketBeam
          from={{ x: 0, y: 0.2, z: 0 }}
          to={beamTarget}
          active={beamActive}
          onDone={() => setBeam(false)}
        />
      )}

      <ContactShadows opacity={0.35} scale={16} blur={2.5} far={8} />
      <CameraControls ref={controls} makeDefault minDistance={4} maxDistance={22} />
      {bloomEnabled && !reducedMotion && (
        <EffectComposer>
          <Bloom intensity={0.45} luminanceThreshold={0.35} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.55} />
        </EffectComposer>
      )}
    </>
  );
}

export function OrgTheater({ snapshot }: { snapshot: TheaterSnap }) {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      camera={{ position: [0, 6, 12], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false }}
    >
      <Suspense fallback={null}>
        <TheaterScene snapshot={snapshot} />
      </Suspense>
    </Canvas>
  );
}
