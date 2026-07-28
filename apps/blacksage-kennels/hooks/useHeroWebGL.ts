"use client";

import { useEffect, useState } from "react";
import {
  checkHeroModelAvailable,
  detectWebGL,
  isReduce3dEnabled,
  shouldEnableWebGL,
} from "@/lib/hero-webgl";
import { isHeroGlbReady } from "@/lib/site-config";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function useHeroWebGL() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [webglAvailable, setWebglAvailable] = useState(false);
  const [heroModelAvailable, setHeroModelAvailable] = useState(false);
  const reduce3d = isReduce3dEnabled();

  useEffect(() => {
    setWebglAvailable(detectWebGL());

    if (isHeroGlbReady()) {
      setHeroModelAvailable(true);
      return;
    }

    let cancelled = false;
    void checkHeroModelAvailable().then((available) => {
      if (!cancelled) {
        setHeroModelAvailable(available);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // WebGL island runs with stand-in when licensed GLB is missing.
  const enabled = shouldEnableWebGL({
    prefersReducedMotion,
    reduce3d,
    webglAvailable,
  });

  return {
    enabled,
    prefersReducedMotion,
    reduce3d,
    webglAvailable,
    heroModelAvailable,
  };
}
