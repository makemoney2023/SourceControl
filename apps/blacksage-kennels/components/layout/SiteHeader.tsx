"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackCtaClick } from "@/components/analytics/TrackedLink";
import { CTA_PLACEMENT } from "@/lib/analytics/placements";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-colors duration-300",
        scrolled || open ? "bg-black/90 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10">
        <Link
          href="/"
          className="font-mono text-[11px] tracking-[0.35em] text-white uppercase"
        >
          Blacksage
          <span className="text-blacksage-tan"> · Kennels</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-mono text-[10px] tracking-[0.22em] uppercase transition-colors duration-200",
                item.href === "/inquire"
                  ? "text-blacksage-tan"
                  : "text-white/55 hover:text-white",
              )}
              onClick={() => {
                trackCtaClick({
                  label: item.label,
                  placement: CTA_PLACEMENT.headerNavDesktop,
                  sourcePage: typeof window !== "undefined" ? window.location.pathname : "/",
                  destination: item.href,
                });
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="font-mono text-[10px] tracking-[0.28em] text-white/70 uppercase lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-index"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Index"}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-index"
          aria-label="Mobile"
          className="border-t border-white/10 bg-black px-5 py-6 lg:hidden"
        >
          <ul className="space-y-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-xs tracking-[0.22em] text-white/80 uppercase"
                  onClick={() => {
                    setOpen(false);
                    trackCtaClick({
                      label: item.label,
                      placement: CTA_PLACEMENT.headerNavMobile,
                      sourcePage:
                        typeof window !== "undefined" ? window.location.pathname : "/",
                      destination: item.href,
                    });
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
