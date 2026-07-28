"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import type { Group, Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { checkHeroModelAvailable, HERO_GLB_PATH } from "@/lib/hero-webgl";
import { StandInRottweiler } from "@/components/three/StandInRottweiler";
import { isHeroGlbReady } from "@/lib/site-config";
import { HERO_MATERIALS } from "@/lib/hero-scene";

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <circleGeometry args={[3.2, 48]} />
      <meshStandardMaterial
        color={HERO_MATERIALS.ground.color}
        roughness={HERO_MATERIALS.ground.roughness}
        metalness={HERO_MATERIALS.ground.metalness}
      />
    </mesh>
  );
}

function LicensedModel() {
  const [scene, setScene] = useState<Object3D | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const loader = new GLTFLoader();
    let cancelled = false;
    loader.load(
      HERO_GLB_PATH,
      (gltf) => {
        if (cancelled) return;
        gltf.scene.traverse((child) => {
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
        setScene(gltf.scene);
      },
      undefined,
      () => {
        if (!cancelled) setFailed(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const model = useMemo(() => scene, [scene]);
  if (failed || !model) return <StandInRottweiler />;
  return <primitive object={model} scale={1.15} position={[0, -0.15, 0]} />;
}

function SubjectPicker() {
  const [useLicensed, setUseLicensed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function resolve() {
      if (isHeroGlbReady()) {
        if (!cancelled) {
          setUseLicensed(true);
          setReady(true);
        }
        return;
      }
      const available = await checkHeroModelAvailable();
      if (!cancelled) {
        setUseLicensed(available);
        setReady(true);
      }
    }
    void resolve();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return <StandInRottweiler />;
  return useLicensed ? <LicensedModel /> : <StandInRottweiler />;
}

export function HomeScrollSubject() {
  const scroll = useScroll();
  const group = useRef<Group>(null);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = scroll.offset * Math.PI * 0.35 - 0.15;
  });

  return (
    <group ref={group}>
      <Ground />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0.05]}>
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>
      <Suspense fallback={<StandInRottweiler />}>
        <SubjectPicker />
      </Suspense>
    </group>
  );
}
