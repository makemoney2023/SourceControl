/** Contained hero WebGL scene config — threejs-lighting / materials / interaction. */

export const HERO_SCENE_BG = "#050505";

export const HERO_CAMERA = {
  position: [0.35, 1.05, 3.6] as const,
  fov: 40,
  near: 0.1,
  far: 40,
};

export const HERO_FOG = {
  color: HERO_SCENE_BG,
  near: 5,
  far: 13,
};

export const HERO_GL = {
  antialias: true,
  alpha: false,
  dprMax: 1.5,
  toneMappingExposure: 1.05,
};

export const HERO_LIGHTS = {
  ambient: { color: "#F5F2EB", intensity: 0.18 },
  hemisphere: {
    sky: "#F5F2EB",
    ground: "#0E0E0E",
    intensity: 0.55,
  },
  key: {
    color: "#C4A35A",
    intensity: 1.35,
    position: [3.2, 5.5, 2.8] as const,
    castShadow: true,
  },
  fill: {
    color: "#F5F2EB",
    intensity: 0.35,
    position: [-3.5, 2.2, 1.5] as const,
  },
  rim: {
    color: "#A67C52",
    intensity: 0.55,
    position: [-1.5, 2.8, -3.2] as const,
  },
};

export const HERO_MATERIALS = {
  coat: { color: "#1A1A1A", roughness: 0.72, metalness: 0.08 },
  tan: { color: "#C4A35A", roughness: 0.68, metalness: 0.06 },
  ground: { color: "#121212", roughness: 0.95, metalness: 0 },
};

export type HeroIdleOrbitConfig = {
  enablePan: boolean;
  enableZoom: boolean;
  enableRotate: boolean;
  enableDamping: boolean;
  dampingFactor: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  minAzimuthAngle: number;
  maxAzimuthAngle: number;
};

/** Idle orbit only — no scroll-jack, no zoom fight with page. */
export const HERO_IDLE_ORBIT: HeroIdleOrbitConfig = {
  enablePan: false,
  enableZoom: false,
  enableRotate: true,
  enableDamping: true,
  dampingFactor: 0.06,
  autoRotate: true,
  autoRotateSpeed: 0.45,
  minPolarAngle: 0.85,
  maxPolarAngle: Math.PI / 2 - 0.08,
  minAzimuthAngle: -0.85,
  maxAzimuthAngle: 0.85,
};

export function assertHeroOrbitSafe(config: HeroIdleOrbitConfig): void {
  if (config.enableZoom) {
    throw new Error("Hero orbit must disable zoom (no scroll-jack / page fight)");
  }
  if (config.enablePan) {
    throw new Error("Hero orbit must disable pan");
  }
  if (!config.enableDamping) {
    throw new Error("Hero orbit should use damping for premium feel");
  }
}
