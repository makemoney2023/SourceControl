"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PROOF_BAND } from "@/lib/constants";
import type { ProofBandCellId } from "@/lib/analytics/types";
import { track } from "@/lib/analytics/track";

const PROOF_BAND_CELL_IDS: ProofBandCellId[] = [
  "standards",
  "health",
  "dogs",
  "placement",
];

export function ProofBandTracker() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || hasTrackedView.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasTrackedView.current) {
          return;
        }

        hasTrackedView.current = true;
        track("proof_band_view", {
          path: "/",
          visible_cells: PROOF_BAND.length,
        });
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="proof-band-heading">
      <h2 id="proof-band-heading" className="sr-only">
        Program proof summary
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROOF_BAND.map((cell, index) => {
          const cellId = PROOF_BAND_CELL_IDS[index] ?? "standards";

          return (
            <div
              key={cell.title}
              className="space-y-2 border border-white/10 bg-black/40 p-5"
            >
              <p className="section-overline text-blacksage-tan">{cell.title}</p>
              <p className="text-sm text-blacksage-text-secondary">{cell.body}</p>
              <Link
                href={cell.href}
                className="text-link text-sm font-medium"
                onClick={() => {
                  track("proof_band_click", {
                    cell_id: cellId,
                    cell_title: cell.title,
                    destination: cell.href,
                    path: "/",
                    link_label: cell.linkLabel,
                  });
                }}
              >
                {cell.linkLabel}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
