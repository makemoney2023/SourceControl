import { HeroIsland } from "@/components/three/HeroIsland";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { CTA_PLACEMENT } from "@/lib/analytics/placements";
import { PAGE_META } from "@/lib/content/page-meta";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blacksage-hero-fog to-blacksage-ground">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:py-14">
        <div className="space-y-5">
          <p className="font-display text-sm tracking-[0.18em] text-blacksage-tan uppercase">
            Blacksage{" "}
            <span className="font-normal text-blacksage-sage normal-case tracking-normal">
              Kennels
            </span>
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-blacksage-text-primary md:text-5xl">
            {PAGE_META.home.h1}
          </h1>
          <p className="max-w-xl text-lg text-blacksage-text-secondary">
            Evidence-led breeding — health transparency, standards-informed education, and
            deliberate placement.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
            <TrackedLink
              href="/dogs"
              label="View our dogs"
              placement={CTA_PLACEMENT.homeProofTeaser}
              sourcePage="/"
              className="text-link text-sm font-medium text-blacksage-tan-soft hover:text-blacksage-tan"
            />
            <TrackedLink
              href="/health"
              label="Health & education"
              placement={CTA_PLACEMENT.homeProofTeaser}
              sourcePage="/"
              className="text-link text-sm font-medium text-blacksage-tan-soft hover:text-blacksage-tan"
            />
          </div>
        </div>
        <HeroIsland />
      </div>
    </section>
  );
}
