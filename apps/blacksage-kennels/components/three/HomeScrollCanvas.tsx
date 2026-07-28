"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { Scroll, ScrollControls } from "@react-three/drei";
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import { HERO_CAMERA, HERO_GL } from "@/lib/hero-scene";
import { HOME_SCROLL_PAGES } from "@/lib/home-scroll-story";
import { HERO_POSTER_ALT, HERO_POSTER_PATH } from "@/lib/hero-subject";
import { HomeScrollLights } from "@/components/three/HomeScrollLights";
import { HomeScrollCameraRig } from "@/components/three/HomeScrollCameraRig";
import { HomeScrollSubject } from "@/components/three/HomeScrollSubject";
import { HomeScrollOverlays } from "@/components/three/HomeScrollOverlays";
import { CinemaChrome } from "@/components/home/CinemaChrome";

function PauseWhenHidden() {
  useEffect(() => {
    const onVisibility = () => {
      document.documentElement.dataset.homeScrollHidden = String(document.hidden);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  return null;
}

export function HomeScrollCanvas() {
  return (
    <div
      className="relative h-[100svh] w-full overflow-hidden bg-blacksage-hero-fog"
      data-home-mode="scroll-3d-cinema"
    >
      {/* Photography-first atmosphere under WebGL */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <Image
          src={HERO_POSTER_PATH}
          alt={HERO_POSTER_ALT}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blacksage-hero-fog via-transparent to-blacksage-hero-fog/80" />
      </div>

      <Canvas
        className="!absolute inset-0 z-10 h-full w-full"
        camera={{
          position: [...HERO_CAMERA.position],
          fov: 38,
          near: HERO_CAMERA.near,
          far: HERO_CAMERA.far,
        }}
        dpr={[1, HERO_GL.dprMax]}
        shadows
        gl={{
          antialias: HERO_GL.antialias,
          alpha: true,
          toneMapping: ACESFilmicToneMapping,
          outputColorSpace: SRGBColorSpace,
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = HERO_GL.toneMappingExposure;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;
          gl.setClearColor(0x000000, 0);
        }}
      >
        <PauseWhenHidden />
        <HomeScrollLights />
        <ScrollControls pages={HOME_SCROLL_PAGES} damping={0.2} distance={1}>
          <HomeScrollCameraRig />
          <Scroll>
            <HomeScrollSubject />
          </Scroll>
          <Scroll html style={{ width: "100%" }}>
            <HomeScrollOverlays />
          </Scroll>
        </ScrollControls>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-20">
        <CinemaChrome />
      </div>
    </div>
  );
}
