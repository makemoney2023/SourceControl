"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProofBandTracker } from "@/components/analytics/ProofBandTracker";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { HeroSubjectStage } from "@/components/home/HeroSubjectStage";
import { CTA_PLACEMENT } from "@/lib/analytics/placements";
import { HOME_SCROLL_CHAPTERS } from "@/lib/home-scroll-story";
import { cn } from "@/lib/utils";

/**
 * Working-Dog Cinema home — stacked & readable on mobile; desktop keeps
 * fixed stage + chapter scroll.
 */
export function CinemaDocumentaryHome() {
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const nodes = sectionRefs.current.filter(Boolean) as HTMLElement[];
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target) return;
        const index = Number((visible.target as HTMLElement).dataset.chapterIndex);
        if (!Number.isNaN(index)) setActive(index);
      },
      { threshold: [0.3, 0.5], rootMargin: "-8% 0px -20% 0px" },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative bg-black" data-home-mode="cinema-documentary">
      {/* Desktop-only fixed Shadow stage (right rail) — stays clear of title */}
      <div className="pointer-events-none fixed inset-y-0 right-0 z-0 hidden w-[46%] overflow-hidden xl:w-[48%] lg:block">
        <div className="pointer-events-auto absolute inset-y-0 right-0 left-0 flex items-center px-3 xl:px-6">
          <HeroSubjectStage showCallouts showMobileList={false} className="w-full" />
        </div>
      </div>

      {/* Progress chrome — desktop */}
      <aside
        className="pointer-events-none fixed bottom-24 left-4 z-30 hidden flex-col gap-3 lg:flex"
        aria-hidden
      >
        {HOME_SCROLL_CHAPTERS.map((chapter, index) => (
          <span
            key={chapter.id}
            className={cn(
              "font-mono text-[10px] tracking-[0.28em] transition-colors duration-300",
              index === active ? "text-blacksage-tan" : "text-white/25",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        ))}
      </aside>
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 hidden h-1.5 lg:flex">
        {HOME_SCROLL_CHAPTERS.map((chapter, index) => (
          <div
            key={chapter.id}
            className={cn(
              "h-full flex-1 border-r border-black/40 transition-colors duration-300",
              index <= active ? "bg-blacksage-tan" : "bg-white/10",
            )}
          />
        ))}
      </div>

      <div className="relative z-10">
        {HOME_SCROLL_CHAPTERS.map((chapter, index) => {
          const setRef = (el: HTMLElement | null) => {
            sectionRefs.current[index] = el;
          };

          if (chapter.id === "presence") {
            return (
              <section
                key={chapter.id}
                ref={setRef}
                data-chapter-index={index}
                className="px-5 pt-24 pb-16 sm:px-8 md:px-12 lg:min-h-[100svh] lg:px-16 lg:pb-28 lg:pt-28"
              >
                <div className="mx-auto max-w-[1400px]">
                  {/* Brand first on every breakpoint */}
                  <div className="max-w-xl lg:max-w-[min(36rem,48vw)] xl:max-w-[min(42rem,46vw)]">
                    <p className="mb-4 font-mono text-[10px] tracking-[0.32em] text-blacksage-tan uppercase sm:text-[11px]">
                      {chapter.kicker}
                    </p>
                    <h1 className="font-display text-[clamp(4.5rem,20vw,11rem)] leading-[0.84] font-semibold tracking-[-0.05em] text-white">
                      Blacksage
                      <br />
                      Kennels
                    </h1>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg md:text-xl">
                      {chapter.body}
                    </p>
                  </div>

                  {/* Mobile / tablet: dog + standards under the brand */}
                  <div className="mt-10 lg:hidden">
                    <HeroSubjectStage
                      showCallouts={false}
                      showMobileList
                    />
                  </div>

                  <p className="mt-8 font-mono text-[10px] tracking-[0.28em] text-white/40 uppercase lg:mt-10">
                    Scroll for the program ↓
                  </p>
                </div>
              </section>
            );
          }

          if (chapter.id === "proof") {
            return (
              <section
                key={chapter.id}
                ref={setRef}
                data-chapter-index={index}
                className="px-5 py-16 sm:px-8 md:px-12 lg:flex lg:min-h-[100svh] lg:items-center lg:px-16 lg:py-24"
              >
                <div className="w-full max-w-5xl border-y border-blacksage-tan/40 bg-black/85 py-10 backdrop-blur-md lg:max-w-3xl lg:py-12 xl:max-w-4xl">
                  <div className="mb-6 px-1 sm:mb-8">
                    <p className="font-mono text-[10px] tracking-[0.3em] text-blacksage-tan uppercase">
                      {chapter.kicker}
                    </p>
                    <h2 className="font-display mt-2 text-3xl text-white sm:text-4xl md:text-5xl">
                      {chapter.title}
                    </h2>
                    {chapter.body ? (
                      <p className="mt-3 max-w-xl text-sm text-white/65 sm:text-base">
                        {chapter.body}
                      </p>
                    ) : null}
                  </div>
                  <ProofBandTracker />
                </div>
              </section>
            );
          }

          if (chapter.id === "inquire") {
            return (
              <section
                key={chapter.id}
                ref={setRef}
                data-chapter-index={index}
                className="px-5 py-20 sm:px-8 md:px-12 lg:flex lg:min-h-[100svh] lg:items-center lg:px-16 lg:py-28"
              >
                <div className="max-w-xl lg:max-w-2xl">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-blacksage-tan uppercase">
                    {chapter.kicker}
                  </p>
                  <h2 className="font-display mt-3 text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
                    {chapter.title}
                  </h2>
                  <p className="mt-5 max-w-lg text-base text-white/75 sm:text-lg">
                    {chapter.body}
                  </p>
                  <TrackedLink
                    href="/inquire"
                    label={chapter.ctaLabel ?? "Begin your inquiry"}
                    placement={CTA_PLACEMENT.homeInquireBand}
                    sourcePage="/"
                    className="mt-8 inline-flex min-h-12 w-full items-center justify-center border border-blacksage-tan bg-blacksage-tan px-8 text-sm font-semibold tracking-[0.12em] text-blacksage-cta-text uppercase transition-colors duration-200 hover:bg-transparent hover:text-blacksage-tan sm:w-auto"
                  >
                    {chapter.ctaLabel ?? "Begin your inquiry"}
                  </TrackedLink>
                </div>
              </section>
            );
          }

          return (
            <section
              key={chapter.id}
              ref={setRef}
              data-chapter-index={index}
              className="px-5 py-16 sm:px-8 md:px-12 lg:flex lg:min-h-[100svh] lg:items-center lg:px-16 lg:py-24"
            >
              <div className="max-w-xl border-l-2 border-blacksage-tan pl-5 sm:pl-8 md:pl-10 lg:max-w-[min(28rem,44vw)]">
                <p className="font-mono text-[10px] tracking-[0.3em] text-white/45 uppercase">
                  {String(index + 1).padStart(2, "0")} · {chapter.kicker}
                </p>
                <h2 className="font-display mt-3 text-3xl text-white sm:text-4xl md:text-5xl md:leading-[1.1]">
                  {chapter.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
                  {chapter.body}
                </p>
                {chapter.href && chapter.linkLabel ? (
                  <Link
                    href={chapter.href}
                    className="mt-7 inline-flex min-h-11 items-center font-mono text-xs tracking-[0.18em] text-blacksage-tan uppercase underline decoration-blacksage-tan/50 underline-offset-4"
                  >
                    {chapter.linkLabel} →
                  </Link>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
