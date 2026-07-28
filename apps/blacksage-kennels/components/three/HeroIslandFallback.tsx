import Image from "next/image";
import { HERO_ISLAND_HEIGHT_CLASS, HERO_POSTER_PATH } from "@/lib/hero-island";

export function HeroIslandFallback() {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-sm ${HERO_ISLAND_HEIGHT_CLASS}`}
      aria-hidden="true"
    >
      <Image
        src={HERO_POSTER_PATH}
        alt="Rottweiler hero poster — silhouette on dark gradient"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 1152px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blacksage-ground/80 via-transparent to-blacksage-hero-fog/40" />
    </div>
  );
}
