"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { Vector3 } from "three";
import { getCameraAtProgress } from "@/lib/home-scroll-story";

const position = new Vector3();
const target = new Vector3();
const look = new Vector3();

export function HomeScrollCameraRig() {
  const scroll = useScroll();
  const { camera } = useThree();
  const booted = useRef(false);

  useFrame(() => {
    if (typeof document !== "undefined" && document.hidden) {
      return;
    }
    const { position: pos, target: tgt } = getCameraAtProgress(scroll.offset);
    position.set(pos[0], pos[1], pos[2]);
    target.set(tgt[0], tgt[1], tgt[2]);

    if (!booted.current) {
      camera.position.copy(position);
      look.copy(target);
      camera.lookAt(look);
      booted.current = true;
      return;
    }

    camera.position.lerp(position, 0.1);
    look.lerp(target, 0.1);
    camera.lookAt(look);
  });

  return null;
}
