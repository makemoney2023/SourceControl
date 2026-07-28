export type WebGLGateInput = {
  prefersReducedMotion: boolean;
  reduce3d: boolean;
  webglAvailable: boolean;
  /** Licensed GLB present — optional; stand-in mesh used when false. */
  heroModelAvailable?: boolean;
};

export function isReduce3dEnabled(): boolean {
  const value = process.env.NEXT_PUBLIC_REDUCE_3D?.toLowerCase();
  return value === "true" || value === "1";
}

export function detectWebGL(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function shouldEnableWebGL(input: WebGLGateInput): boolean {
  if (input.prefersReducedMotion) {
    return false;
  }
  if (input.reduce3d) {
    return false;
  }
  if (!input.webglAvailable) {
    return false;
  }
  // Canvas enables with geometric stand-in when licensed GLB is absent.
  return true;
}

export const HERO_GLB_PATH = "/models/hero-rottweiler.glb";

export async function checkHeroModelAvailable(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const response = await fetch(HERO_GLB_PATH, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}
