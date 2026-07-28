"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { assertHeroOrbitSafe, HERO_IDLE_ORBIT } from "@/lib/hero-scene";

/** Contained pointer orbit — no zoom/pan; auto-rotate idle. */
export function IdleOrbit() {
  const { camera, gl } = useThree();
  const controls = useRef<OrbitControls | null>(null);

  useEffect(() => {
    assertHeroOrbitSafe(HERO_IDLE_ORBIT);
    const orbit = new OrbitControls(camera, gl.domElement);
    orbit.enablePan = HERO_IDLE_ORBIT.enablePan;
    orbit.enableZoom = HERO_IDLE_ORBIT.enableZoom;
    orbit.enableRotate = HERO_IDLE_ORBIT.enableRotate;
    orbit.enableDamping = HERO_IDLE_ORBIT.enableDamping;
    orbit.dampingFactor = HERO_IDLE_ORBIT.dampingFactor;
    orbit.autoRotate = HERO_IDLE_ORBIT.autoRotate;
    orbit.autoRotateSpeed = HERO_IDLE_ORBIT.autoRotateSpeed;
    orbit.minPolarAngle = HERO_IDLE_ORBIT.minPolarAngle;
    orbit.maxPolarAngle = HERO_IDLE_ORBIT.maxPolarAngle;
    orbit.minAzimuthAngle = HERO_IDLE_ORBIT.minAzimuthAngle;
    orbit.maxAzimuthAngle = HERO_IDLE_ORBIT.maxAzimuthAngle;
    orbit.target.set(0, 0.55, 0);
    orbit.update();
    controls.current = orbit;
    return () => {
      orbit.dispose();
      controls.current = null;
    };
  }, [camera, gl]);

  useFrame(() => {
    controls.current?.update();
  });

  return null;
}
