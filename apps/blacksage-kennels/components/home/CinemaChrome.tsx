"use client";

import { HOME_SCROLL_CHAPTERS } from "@/lib/home-scroll-story";

/** Letterbox + grain + chapter ticks — Working-Dog Cinema. */
export function CinemaChrome({ activeIndex = 0 }: { activeIndex?: number }) {
  return (
    <>
      <div className="cinema-letterbox cinema-letterbox-top" aria-hidden />
      <div className="cinema-letterbox cinema-letterbox-bottom" aria-hidden />
      <div className="cinema-grain" aria-hidden />
      <div className="cinema-progress" aria-hidden>
        {HOME_SCROLL_CHAPTERS.map((chapter, index) => (
          <span
            key={chapter.id}
            className="block h-1 w-5 rounded-full"
            style={{
              background:
                index === activeIndex
                  ? "var(--color-tan)"
                  : "rgba(243, 239, 230, 0.25)",
            }}
          />
        ))}
      </div>
    </>
  );
}
