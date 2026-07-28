"use client";

import dynamic from "next/dynamic";
import { useHeroWebGL } from "@/hooks/useHeroWebGL";
import { HeroIslandFallback } from "@/components/three/HeroIslandFallback";

const HeroIslandCanvas = dynamic(
  () =>
    import("@/components/three/HeroIslandCanvas").then((mod) => mod.HeroIslandCanvas),
  { ssr: false, loading: () => <HeroIslandFallback /> },
);

export function HeroIsland() {
  const { enabled } = useHeroWebGL();

  if (!enabled) {
    return <HeroIslandFallback />;
  }

  return <HeroIslandCanvas />;
}
