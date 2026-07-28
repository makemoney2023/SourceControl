"use client";

import { HERO_LIGHTS, HERO_FOG, HERO_SCENE_BG } from "@/lib/hero-scene";

export function HomeScrollLights() {
  const { ambient, hemisphere, key, fill, rim } = HERO_LIGHTS;
  return (
    <>
      {/* Transparent clear — photography plane shows through (cinema) */}
      <fog attach="fog" args={[HERO_SCENE_BG, HERO_FOG.near, HERO_FOG.far + 2]} />
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
