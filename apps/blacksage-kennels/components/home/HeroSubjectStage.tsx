"use client";

import Image from "next/image";
import Link from "next/link";
import { HeroStandardCallouts } from "@/components/home/HeroStandardCallouts";
import {
  HERO_DOG_NAME,
  HERO_POSTER_ALT,
  HERO_POSTER_PATH,
} from "@/lib/hero-subject";
import { HERO_STANDARD_CALLOUTS } from "@/lib/hero-standard-callouts";
import { cn } from "@/lib/utils";

type HeroSubjectStageProps = {
  /** Desktop pointer callouts on the dog */
  showCallouts?: boolean;
  /** Mobile / tablet readable standards list under the dog */
  showMobileList?: boolean;
  className?: string;
};

/**
 * Shadow hero framed at the image aspect ratio so callout % coords
 * map to the dog (no tall-viewport letterboxing).
 */
export function HeroSubjectStage({
  showCallouts = true,
  showMobileList = false,
  className,
}: HeroSubjectStageProps) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col justify-center",
        className,
      )}
    >
      <div className="relative mx-auto aspect-[1024/837] w-full max-w-[720px] lg:mx-0 lg:max-w-none">
        {/* Transparent cutout with baked silhouette glow — no square plate */}
        <Image
          src={HERO_POSTER_PATH}
          alt={HERO_POSTER_ALT}
          fill
          priority
          className="relative z-10 object-contain object-center"
          sizes="(max-width: 1024px) 100vw, 48vw"
        />
        {showCallouts ? (
          <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block [&_a]:pointer-events-auto">
            <HeroStandardCallouts />
          </div>
        ) : null}
        <div className="absolute inset-x-0 bottom-2 z-30 flex justify-center sm:bottom-3 lg:justify-end lg:pr-3">
          <p className="border-l-2 border-blacksage-tan bg-black/80 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white uppercase backdrop-blur-sm sm:text-[11px]">
            {HERO_DOG_NAME}
          </p>
        </div>
      </div>

      {showMobileList ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
          {HERO_STANDARD_CALLOUTS.map((c) => (
            <li key={c.id}>
              <Link
                href={c.href}
                className="block rounded-sm border border-white/10 bg-black/40 px-3 py-3"
              >
                <span className="block font-mono text-[10px] tracking-[0.16em] text-blacksage-tan uppercase">
                  {c.label}
                </span>
                <span className="mt-1 block text-sm text-white/70">
                  {c.detail}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
