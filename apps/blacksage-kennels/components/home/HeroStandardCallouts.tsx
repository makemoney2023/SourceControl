import Link from "next/link";
import { HERO_STANDARD_CALLOUTS } from "@/lib/hero-standard-callouts";
import { cn } from "@/lib/utils";

type HeroStandardCalloutsProps = {
  className?: string;
};

/**
 * Pointer annotations for breed-standard features on the hero subject.
 */
export function HeroStandardCallouts({ className }: HeroStandardCalloutsProps) {
  return (
    <div className={cn("absolute inset-0 z-20", className)}>
      <ul className="absolute inset-0 list-none">
        {HERO_STANDARD_CALLOUTS.map((callout) => {
          const isLeft = callout.side === "left";
          return (
            <li
              key={callout.id}
              className="absolute"
              style={{ left: `${callout.x}%`, top: `${callout.y}%` }}
            >
              <Link
                href={callout.href}
                className={cn(
                  "group absolute top-0 flex items-center",
                  isLeft
                    ? "right-0 flex-row-reverse"
                    : "left-0 flex-row",
                )}
                style={{ transform: "translateY(-50%)" }}
              >
                <span className="relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                  <span
                    aria-hidden
                    className="absolute h-7 w-7 rounded-full bg-[radial-gradient(circle,rgba(196,163,90,0.4)_0%,rgba(196,163,90,0.12)_40%,transparent_70%)]"
                  />
                  <span className="relative h-2 w-2 rounded-full bg-blacksage-tan" />
                </span>
                <span
                  className="h-px w-7 shrink-0 bg-gradient-to-r from-blacksage-tan to-blacksage-tan/30 xl:w-10"
                  aria-hidden
                />
                <span className="max-w-[8.5rem] px-1.5 py-1 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] transition-opacity group-hover:opacity-100 xl:max-w-[10rem]">
                  <span className="block font-mono text-[9px] tracking-[0.14em] text-blacksage-tan uppercase">
                    {callout.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-snug text-white/80 xl:text-[11px]">
                    {callout.detail}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
