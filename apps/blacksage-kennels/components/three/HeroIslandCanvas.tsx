"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { Group, Object3D } from "three";
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { checkHeroModelAvailable, HERO_GLB_PATH } from "@/lib/hero-webgl";
import { HERO_ISLAND_HEIGHT_CLASS } from "@/lib/hero-island";
import {
  HERO_CAMERA,
  HERO_FOG,
  HERO_GL,
  HERO_LIGHTS,
  HERO_MATERIALS,
  HERO_SCENE_BG,
} from "@/lib/hero-scene";
import { StandInRottweiler } from "@/components/three/StandInRottweiler";
import { IdleOrbit } from "@/components/three/IdleOrbit";
import { isHeroGlbReady } from "@/lib/site-config";

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <circleGeometry args={[2.4, 48]} />
      <meshStandardMaterial
        color={HERO_MATERIALS.ground.color}
        roughness={HERO_MATERIALS.ground.roughness}
        metalness={HERO_MATERIALS.ground.metalness}
      />
    </mesh>
  );
}

function SoftContactShadow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0.05]}>
      <circleGeometry args={[0.85, 32]} />
      <meshBasicMaterial color="#000000" transparent opacity={0.45} />
    </mesh>
  );
}

function HeroLights() {
  const { ambient, hemisphere, key, fill, rim } = HERO_LIGHTS;
  return (
    <>
      <ambientLight color={ambient.color} intensity={ambient.intensity} />
      <hemisphereLight
        args={[hemisphere.sky, hemisphere.ground, hemisphere.intensity]}
      />
      <directionalLight
        color={key.color}
        intensity={key.intensity}
        position={key.position}
        castShadow={key.castShadow}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0002}
      />
      <directionalLight
        color={fill.color}
        intensity={fill.intensity}
        position={fill.position}
      />
      <directionalLight
        color={rim.color}
        intensity={rim.intensity}
        position={rim.position}
      />
    </>
  );
}

function LicensedHeroModel() {
  const [scene, setScene] = useState<Object3D | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const loader = new GLTFLoader();
    let cancelled = false;

    loader.load(
      HERO_GLB_PATH,
      (gltf) => {
        if (cancelled) return;
        const root = gltf.scene;
        root.traverse((child) => {
          const mesh = child as Group & {
            isMesh?: boolean;
            castShadow?: boolean;
            receiveShadow?: boolean;
          };
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
        setScene(root);
      },
      undefined,
      () => {
        if (!cancelled) {
          setFailed(true);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const model = useMemo(() => scene, [scene]);

  if (failed || !model) {
    return <StandInRottweiler />;
  }

  return <primitive object={model} scale={1.15} position={[0, -0.15, 0]} />;
}

function HeroSubject({ onMode }: { onMode: (mode: "glb" | "stand-in") => void }) {
  const [useLicensed, setUseLicensed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      if (isHeroGlbReady()) {
        if (!cancelled) {
          setUseLicensed(true);
          setReady(true);
          onMode("glb");
        }
        return;
      }
      const available = await checkHeroModelAvailable();
      if (!cancelled) {
        setUseLicensed(available);
        setReady(true);
        onMode(available ? "glb" : "stand-in");
      }
    }

    void resolve();
    return () => {
      cancelled = true;
    };
  }, [onMode]);

  if (!ready) {
    return <StandInRottweiler />;
  }

  return useLicensed ? <LicensedHeroModel /> : <StandInRottweiler />;
}

function HeroScene({ onMode }: { onMode: (mode: "glb" | "stand-in") => void }) {
  return (
    <>
      <color attach="background" args={[HERO_SCENE_BG]} />
      <fog attach="fog" args={[HERO_FOG.color, HERO_FOG.near, HERO_FOG.far]} />
      <HeroLights />
      <Ground />
      <SoftContactShadow />
      <Suspense fallback={<StandInRottweiler />}>
        <HeroSubject onMode={onMode} />
      </Suspense>
      <IdleOrbit />
    </>
  );
}

export function HeroIslandCanvas() {
  const [mode, setMode] = useState<"glb" | "stand-in">("stand-in");

  return (
    <div
      className={`relative w-full overflow-hidden rounded-sm ${HERO_ISLAND_HEIGHT_CLASS}`}
      data-hero-mode="webgl"
      data-hero-asset={mode}
    >
      <Canvas
        camera={{
          position: [...HERO_CAMERA.position],
          fov: HERO_CAMERA.fov,
          near: HERO_CAMERA.near,
          far: HERO_CAMERA.far,
        }}
        dpr={[1, HERO_GL.dprMax]}
        shadows
        gl={{
          antialias: HERO_GL.antialias,
          alpha: HERO_GL.alpha,
          toneMapping: ACESFilmicToneMapping,
          outputColorSpace: SRGBColorSpace,
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = HERO_GL.toneMappingExposure;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;
        }}
        aria-hidden="true"
      >
        <HeroScene onMode={setMode} />
      </Canvas>
      {mode === "stand-in" ? (
        <p className="pointer-events-none absolute bottom-2 left-3 text-[10px] uppercase tracking-[0.14em] text-blacksage-tan/70">
          3D preview · drop licensed GLB at /models/hero-rottweiler.glb
        </p>
      ) : null}
    </div>
  );
}
