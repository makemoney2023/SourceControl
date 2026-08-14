import { CameraControls, ContactShadows, Environment } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ACESFilmicToneMapping, Vector3 } from "three";
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
import { deriveCameraLookAt, forceOrgLayout, type Vec3 } from "../layout/forceOrgLayout";
import { indexProductionArtifacts } from "../artifacts";
import { seatWorkContext } from "../seat-work-context";
import { useJarvisStore } from "../state/useJarvisStore";
import { isSeatDimmed } from "../status";
import { CommandTable } from "./CommandTable";
import { PacketBeam } from "./effects/PacketBeam";
import { collideSeatLabels } from "./label-collision";
import { ArtifactPlaque } from "./nodes/ArtifactPlaque";
import { isPhaseRailStatus, PhaseBead } from "./nodes/PhaseBead";
import { SeatNode } from "./nodes/SeatNode";
import { ReportEdges } from "./ReportEdges";

const projectScratch = new Vector3();
const LABEL_REFRESH_MS = 100;

function runningSeatSlugs(snapshot: TheaterSnap): string[] {
  const args = {
    handoffs: snapshot.handoffs,
    runs: snapshot.runs,
    sessions: snapshot.sessions,
    claimedFiles: snapshot.claimed,
    queueFiles: snapshot.queue,
    agentStates: snapshot.agentStates,
  };
  return snapshot.org.roster
    .filter((seat) => seatWorkContext(seat.slug, args).status === "running")
    .map((seat) => seat.slug);
}

function followCentroidOf(slugs: string[], layout: Map<string, Vec3>): Vec3 | null {
  const pts = slugs.flatMap((slug) => {
    const point = layout.get(slug);
    return point ? [point] : [];
  });
  if (!pts.length) return null;
  const n = pts.length;
  return {
    x: pts.reduce((sum, point) => sum + point.x, 0) / n,
    y: pts.reduce((sum, point) => sum + point.y, 0) / n,
    z: pts.reduce((sum, point) => sum + point.z, 0) / n,
  };
}

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
    followCam,
    orbiting,
    selectSlug,
    selectPhase,
    selectArtifact,
    setBeam,
    setOrbiting,
  } = useJarvisStore();

  const layout = useMemo(
    () => forceOrgLayout(snapshot.org.roster),
    [snapshot.org.roster],
  );
  const controls = useRef<CameraControls | null>(null);
  const lastLabelMs = useRef(0);
  const { camera, size } = useThree();
  const [visibleSeatLabels, setVisibleSeatLabels] = useState(
    () => new Map(snapshot.org.roster.map((seat) => [seat.slug, seat.title])),
  );

  const collisionSeats = useMemo(
    () =>
      snapshot.org.roster.map((seat) => ({
        slug: seat.slug,
        title: seat.title,
        level: seat.level,
        status: seatWorkContext(seat.slug, {
          handoffs: snapshot.handoffs,
          runs: snapshot.runs,
          sessions: snapshot.sessions,
          claimedFiles: snapshot.claimed,
          queueFiles: snapshot.queue,
          agentStates: snapshot.agentStates,
        }).status,
      })),
    [
      snapshot.agentStates,
      snapshot.claimed,
      snapshot.handoffs,
      snapshot.org.roster,
      snapshot.queue,
      snapshot.runs,
      snapshot.sessions,
    ],
  );

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

  const phaseBeads = snapshot.tracker.phases.filter((p) => isPhaseRailStatus(p.status));

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    if (orbiting && !selectedSlug) return;
    const run = async () => {
      const canFollow = followCam && !selectedSlug && !orbiting && !reducedMotion;
      const running = canFollow ? runningSeatSlugs(snapshot) : [];
      const followOpts =
        running.length === 1
          ? { followSlug: running[0] }
          : running.length > 1
            ? { followCentroid: followCentroidOf(running, layout) }
            : undefined;
      const lookAt = deriveCameraLookAt(layout, selectedSlug, mode, followOpts);
      await c.setLookAt(...lookAt, !reducedMotion);
    };
    void run();
  }, [followCam, layout, mode, orbiting, reducedMotion, selectedSlug, snapshot]);

  useFrame(({ clock }) => {
    if (selectedSlug) return;
    const now = clock.elapsedTime * 1000;
    if (lastLabelMs.current !== 0 && now - lastLabelMs.current < LABEL_REFRESH_MS) return;
    lastLabelMs.current = now;
    const next = collideSeatLabels({
      seats: collisionSeats,
      positions: layout,
      project: (world) => {
        projectScratch.set(world.x, world.y, world.z);
        projectScratch.project(camera);
        if (projectScratch.z > 1) return null;
        return {
          x: (projectScratch.x * 0.5 + 0.5) * size.width,
          y: (-projectScratch.y * 0.5 + 0.5) * size.height,
        };
      },
      cameraDistance: camera.position.length(),
      selectedSlug,
      previewWakeSlug,
    });
    setVisibleSeatLabels((prev) => {
      if (
        prev.size === next.length &&
        next.every((label) => prev.get(label.slug) === label.text)
      ) {
        return prev;
      }
      return new Map(next.map((label) => [label.slug, label.text]));
    });
  });

  return (
    <>
      <color attach="background" args={["#070b10"]} />
      <fog attach="fog" args={["#070b10", 14, 28]} />
      <hemisphereLight args={["#e8e6e0", "#1a2228", 0.42]} position={[0, 12, 0]} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={0.95}
        color="#f2f0e8"
        castShadow
      />
      <directionalLight position={[-4, 3, -6]} intensity={0.35} color="#9bb8c4" />
      <Environment preset="studio" />
      <CommandTable
        depts={[...new Set(snapshot.org.roster.map((r) => r.dept))].sort()}
        onClick={() => {
          selectSlug(null);
          setOrbiting(false);
        }}
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
            labelText={
              selectedSlug === seat.slug
                ? seat.title
                : selectedSlug
                  ? null
                  : (visibleSeatLabels.get(seat.slug) ?? null)
            }
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
      <CameraControls
        ref={controls}
        makeDefault
        minDistance={5}
        maxDistance={20}
        onStart={() => setOrbiting(true)}
      />
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
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <Suspense fallback={null}>
          <TheaterScene snapshot={snapshot} onOpenReport={onOpenReport} />
        </Suspense>
      </Canvas>
    </div>
  );
}
