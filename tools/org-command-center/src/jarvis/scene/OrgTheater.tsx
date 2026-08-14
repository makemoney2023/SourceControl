import { CameraControls, ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import type { SituationSnapshot } from "../../api/client";

type TheaterSnap = Pick<
  SituationSnapshot,
  | "org"
  | "handoffs"
  | "tracker"
  | "queue"
  | "claimed"
  | "businessIdeaRel"
  | "runs"
  | "sessions"
  | "agentStates"
> & {
  models?: SituationSnapshot["models"];
};
import { deriveCameraLookAt, forceOrgLayout } from "../layout/forceOrgLayout";
import { indexProductionArtifacts } from "../artifacts";
import { seatWorkContext } from "../seat-work-context";
import { useJarvisStore } from "../state/useJarvisStore";
import { isSeatDimmed } from "../status";
import { CommandTable } from "./CommandTable";
import { PacketBeam } from "./effects/PacketBeam";
import { ArtifactPlaque } from "./nodes/ArtifactPlaque";
import { PhaseBead } from "./nodes/PhaseBead";
import { SeatNode } from "./nodes/SeatNode";
import { ReportEdges } from "./ReportEdges";

function TheaterScene({
  snapshot,
  onOpenReport,
}: {
  snapshot: TheaterSnap;
  onOpenReport?: (slug: string) => void;
}) {
  const {
    mode,
    selectedSlug,
    selectedPhase,
    selectedArtifact,
    beamActive,
    reducedMotion,
    previewWakeSlug,
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
      indexProductionArtifacts(
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
      const lookAt = deriveCameraLookAt(layout, selectedSlug, mode);
      await c.setLookAt(...lookAt, !reducedMotion);
    };
    void run();
  }, [layout, mode, reducedMotion, selectedSlug]);

  return (
    <>
      <color attach="background" args={["#070b10"]} />
      <fog attach="fog" args={["#070b10", 14, 28]} />
      <ambientLight intensity={0.28} color="#e8e6e0" />
      <directionalLight
        position={[6, 10, 4]}
        intensity={0.95}
        color="#f2f0e8"
        castShadow
      />
      <directionalLight position={[-4, 3, -6]} intensity={0.35} color="#9bb8c4" />
      <CommandTable
        depts={[...new Set(snapshot.org.roster.map((r) => r.dept))].sort()}
        onClick={() => selectSlug(null)}
      />

      <ReportEdges roster={snapshot.org.roster} layout={layout} />

      {snapshot.org.roster.map((seat) => {
        const pos = layout.get(seat.slug);
        if (!pos) return null;
        const work = seatWorkContext(seat.slug, {
          handoffs: snapshot.handoffs,
          runs: snapshot.runs,
          sessions: snapshot.sessions,
          claimedFiles: snapshot.claimed,
          queueFiles: snapshot.queue,
          agentStates: snapshot.agentStates,
        });
        const isOwner = mode === "assign" && owner?.managerOwner === seat.slug;
        const isGhost =
          mode === "assign" && maySpawn.has(seat.slug) && seat.level === "ic";
        const selected = selectedSlug === seat.slug;
        const dimmed = isSeatDimmed({
          mode,
          isOwner,
          isGhost,
          isCeo: seat.slug === "ceo-strategist",
          isSelected: selected,
        });
        return (
          <SeatNode
            key={seat.slug}
            seat={seat}
            position={pos}
            status={work.status}
            phase={work.phase}
            goal={work.goal ?? work.blockReason}
            selected={selected}
            highlighted={selected || isOwner || (mode === "outputs" && false)}
            dimmed={dimmed}
            ghost={isGhost}
            reducedMotion={reducedMotion}
            previewWakeSlug={previewWakeSlug}
            onSelect={selectSlug}
            onOpenReport={onOpenReport}
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
    </>
  );
}

export function OrgTheater({
  snapshot,
  onOpenReport,
}: {
  snapshot: TheaterSnap;
  onOpenReport?: (slug: string) => void;
}) {
  return (
    <div
      role="region"
      aria-label="Interactive organization theater"
      aria-describedby="org-theater-guidance"
      style={{ position: "absolute", inset: 0 }}
    >
      <p id="org-theater-guidance" className="j-visually-hidden">
        A three-dimensional view of organization seats and their live status. Use the Command
        deck button or its displayed keyboard shortcut to search and focus any seat or active task.
      </p>
      <Canvas
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
        camera={{ position: [0, 6, 12], fov: 45 }}
        dpr={[1, 1.75]}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <TheaterScene snapshot={snapshot} onOpenReport={onOpenReport} />
        </Suspense>
      </Canvas>
    </div>
  );
}
