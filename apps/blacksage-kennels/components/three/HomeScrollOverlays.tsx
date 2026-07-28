"use client";

import Link from "next/link";
import { ProofBandTracker } from "@/components/analytics/ProofBandTracker";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { CTA_PLACEMENT } from "@/lib/analytics/placements";
import {
  chapterTopVh,
  HOME_SCROLL_CHAPTERS,
  HOME_SCROLL_PAGES,
} from "@/lib/home-scroll-story";
import { PAGE_META } from "@/lib/content/page-meta";

const totalVh = HOME_SCROLL_PAGES * 100;

export function HomeScrollOverlays() {
  return (
    <div style={{ width: "100%", height: `${totalVh}vh`, position: "relative" }}>
      {HOME_SCROLL_CHAPTERS.map((chapter, index) => {
        const top = `${chapterTopVh(index)}vh`;

        if (chapter.id === "proof") {
          return (
            <div
              key={chapter.id}
              className="absolute left-0 w-full px-6"
              style={{
                top,
                height: `${(100 / HOME_SCROLL_CHAPTERS.length) * HOME_SCROLL_PAGES}vh`,
              }}
            >
              <div className="mx-auto flex h-full max-w-6xl items-center">
                <div className="cinema-glass w-full rounded-sm p-6 md:p-8">
                  <p className="section-overline mb-4">Cutaway · Proof</p>
                  <ProofBandTracker />
                </div>
              </div>
            </div>
          );
        }

        if (chapter.id === "presence") {
          return (
            <div
              key={chapter.id}
              className="pointer-events-none absolute left-0 w-full px-6"
              style={{ top }}
            >
              <div className="mx-auto max-w-6xl pt-[14vh]">
                <div className="cinema-glass pointer-events-auto max-w-xl space-y-5 rounded-sm p-7 md:p-9">
                  <p className="section-overline">Blacksage Kennels · Reel 01</p>
                  <h1 className="font-display text-4xl font-semibold tracking-tight text-blacksage-text-primary md:text-6xl md:leading-[1.05]">
                    {PAGE_META.home.h1}
                  </h1>
                  <p className="text-lg text-blacksage-text-secondary md:text-xl">
                    {chapter.body}
                  </p>
                </div>
              </div>
            </div>
          );
        }

        if (chapter.id === "inquire") {
          return (
            <div
              key={chapter.id}
              className="absolute left-0 w-full px-6"
              style={{ top }}
            >
              <div className="mx-auto max-w-6xl pt-[12vh]">
                <div className="cinema-glass max-w-xl rounded-sm p-8 md:p-10">
                  <p className="section-overline mb-3">
                    {chapter.kicker ?? "Next step"}
                  </p>
                  <h2 className="font-display text-3xl font-semibold text-blacksage-text-primary md:text-4xl">
                    {chapter.title}
                  </h2>
                  <p className="prose-body mt-4">{chapter.body}</p>
                  <TrackedLink
                    href="/inquire"
                    label={chapter.ctaLabel ?? "Begin your inquiry"}
                    placement={CTA_PLACEMENT.homeInquireBand}
                    sourcePage="/"
                    className="mt-8 inline-flex min-h-11 items-center bg-blacksage-tan px-6 py-3 text-sm font-semibold tracking-wide text-blacksage-cta-text transition-opacity duration-200 hover:opacity-90"
                  >
                    {chapter.ctaLabel ?? "Begin your inquiry"}
                  </TrackedLink>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div
            key={chapter.id}
            className="absolute left-0 w-full px-6"
            style={{ top }}
          >
            <div className="mx-auto max-w-6xl pt-[14vh]">
              <div className="cinema-glass max-w-xl space-y-3 rounded-sm p-7 md:p-8">
                <p className="section-overline">
                  {chapter.kicker ??
                    `${String(index + 1).padStart(2, "0")}`}
                </p>
                <h2 className="font-display text-3xl font-semibold text-blacksage-text-primary md:text-4xl">
                  {chapter.title}
                </h2>
                <p className="prose-body">{chapter.body}</p>
                {chapter.href && chapter.linkLabel ? (
                  <Link
                    href={chapter.href}
                    className="text-link mt-2 inline-block min-h-11 py-2 text-sm font-medium"
                  >
                    {chapter.linkLabel} →
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
