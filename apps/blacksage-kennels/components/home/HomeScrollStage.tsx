"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useHeroWebGL } from "@/hooks/useHeroWebGL";
import { checkHeroModelAvailable } from "@/lib/hero-webgl";
import { isHeroGlbReady } from "@/lib/site-config";
import { CinemaDocumentaryHome } from "@/components/home/CinemaDocumentaryHome";

const HomeScrollCanvas = dynamic(
  () =>
    import("@/components/three/HomeScrollCanvas").then((m) => m.HomeScrollCanvas),
  { ssr: false, loading: () => <CinemaDocumentaryHome /> },
);

/**
 * Working-Dog Cinema default = photography documentary (clearly new design).
 * WebGL scroll stage only when licensed GLB is present + WebGL gate passes.
 */
export function HomeScrollStage() {
  const { enabled } = useHeroWebGL();
  const [glbAvailable, setGlbAvailable] = useState(false);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function resolve() {
      if (isHeroGlbReady()) {
        if (!cancelled) {
          setGlbAvailable(true);
          setResolved(true);
        }
        return;
      }
      const available = await checkHeroModelAvailable();
      if (!cancelled) {
        setGlbAvailable(available);
        setResolved(true);
      }
    }
    void resolve();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!resolved) {
    return <CinemaDocumentaryHome />;
  }

  if (enabled && glbAvailable) {
    return <HomeScrollCanvas />;
  }

  return <CinemaDocumentaryHome />;
}
