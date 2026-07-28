import Image from "next/image";
import Link from "next/link";
import { ProofBandTracker } from "@/components/analytics/ProofBandTracker";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { CTA_PLACEMENT } from "@/lib/analytics/placements";
import { HOME_SCROLL_CHAPTERS } from "@/lib/home-scroll-story";
import { PAGE_META } from "@/lib/content/page-meta";
import { HERO_POSTER_ALT, HERO_POSTER_PATH } from "@/lib/hero-subject";

/** Reduced-motion / no-WebGL: cinema chapters as stacked film. */
export function HomeScrollFallback() {
  return (
    <div className="relative bg-blacksage-hero-fog" data-home-mode="static-cinema">
      <div className="relative min-h-[70vh] w-full">
        <Image
          src={HERO_POSTER_PATH}
          alt={HERO_POSTER_ALT}
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-blacksage-ground" />
        <div className="cinema-grain absolute inset-0" aria-hidden />
      </div>

      {HOME_SCROLL_CHAPTERS.map((chapter, index) => {
        if (chapter.id === "proof") {
          return (
            <div
              key={chapter.id}
              className="border-t border-blacksage-tan/40 bg-blacksage-proof-band"
            >
              <div className="mx-auto max-w-6xl px-6 py-12">
                <p className="section-overline mb-4">Cutaway · Proof</p>
                <ProofBandTracker />
              </div>
            </div>
          );
        }

        if (chapter.id === "presence") {
          return (
            <section
              key={chapter.id}
              className="relative z-10 mx-auto -mt-40 max-w-6xl px-6 pb-16"
            >
              <div className="cinema-glass max-w-xl space-y-5 rounded-sm p-8">
                <p className="section-overline">Blacksage Kennels · Reel 01</p>
                <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
                  {PAGE_META.home.h1}
                </h1>
                <p className="text-lg text-blacksage-text-secondary">{chapter.body}</p>
              </div>
            </section>
          );
        }

        if (chapter.id === "inquire") {
          return (
            <section key={chapter.id} className="mx-auto max-w-6xl px-6 py-16">
              <div className="cinema-glass max-w-xl rounded-sm p-8">
                <p className="section-overline mb-3">
                  {chapter.kicker ?? "Next step"}
                </p>
                <h2 className="font-display text-3xl font-semibold">{chapter.title}</h2>
                <p className="prose-body mt-4">{chapter.body}</p>
                <TrackedLink
                  href="/inquire"
                  label={chapter.ctaLabel ?? "Begin your inquiry"}
                  placement={CTA_PLACEMENT.homeInquireBand}
                  sourcePage="/"
                  className="mt-8 inline-flex min-h-11 items-center bg-blacksage-tan px-6 py-3 text-sm font-semibold text-blacksage-cta-text"
                >
                  {chapter.ctaLabel ?? "Begin your inquiry"}
                </TrackedLink>
              </div>
            </section>
          );
        }

        return (
          <section key={chapter.id} className="mx-auto max-w-6xl px-6 py-14">
            <div className="cinema-glass max-w-xl space-y-3 rounded-sm p-7">
              <p className="section-overline">
                {chapter.kicker ?? `${String(index + 1).padStart(2, "0")}`}
              </p>
              <h2 className="font-display text-3xl font-semibold">{chapter.title}</h2>
              <p className="prose-body">{chapter.body}</p>
              {chapter.href && chapter.linkLabel ? (
                <Link
                  href={chapter.href}
                  className="text-link inline-block min-h-11 py-2 text-sm font-medium"
                >
                  {chapter.linkLabel} →
                </Link>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
