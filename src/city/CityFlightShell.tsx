// The neon-city worldflight. Authored markup driven by the vendored Scroll Craft
// engine; all strings and plate paths come from the cityFlight/slides SSOT.
// View switches are full navigations (query param), so the engine mounts once
// per page load and needs no unmount path.
import { useEffect, useRef } from "react";
import {
  CITY_DISCLOSURE,
  CITY_GLASS,
  CITY_LEGS,
  STREAMS_WINDOW,
  slideById,
  windowForLegs,
  windowForLegSlice,
} from "../data/cityFlight";
import { readProductionCtaLinksFromEnv } from "../components/experience/ctaLinks";
import { useDataSave } from "../components/experience/useDataSave";
import { CityStopsRail } from "./CityStopsRail";
import { StreamsIndex } from "./StreamsIndex";
import { wireGlassFocus } from "./glassFocus";
import "./engine/scrollcraft.css";
import "./city.css";

declare global {
  interface Window {
    ScrollCraft?: { mount: (root: Document) => unknown };
  }
}

function Copy({
  slideId,
  window: win,
  anchor,
  level = 2,
  withEyebrow = false,
}: {
  slideId: string;
  window: string;
  anchor: "lead" | "trail" | "center";
  level?: 1 | 2;
  withEyebrow?: boolean;
}) {
  const slide = slideById(slideId);
  const H = level === 1 ? "h1" : "h2";
  return (
    <div
      className={`sc-copy sc-copy--${anchor}`}
      data-sc-copy
      data-sc-window={win}
      data-city-copy={slideId}
    >
      {withEyebrow && slide.eyebrow ? (
        <p className="sc-eyebrow">{slide.eyebrow}</p>
      ) : null}
      <H className="sc-display sc-display--lg">{slide.headline}</H>
    </div>
  );
}

export function CityFlightShell() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dataSave = useDataSave();
  const ctaLinks = readProductionCtaLinksFromEnv();
  const closing = slideById("15-closing");

  useEffect(() => {
    if (import.meta.env.MODE === "test") return;
    let disposed = false;
    import("./engine/scrollcraft.js" as string).then(() => {
      if (disposed || !window.ScrollCraft) return;
      window.ScrollCraft.mount(document);
      // Worldflight sizes its spacer once at mount; a 0 innerHeight reading
      // leaves the page unscrollable with no error. Re-measure when the window
      // and the webfonts settle.
      const relayout = () => window.dispatchEvent(new Event("resize"));
      window.addEventListener("load", relayout);
      document.fonts?.ready.then(relayout);
    });
    const unwire = wireGlassFocus(rootRef.current, STREAMS_WINDOW);
    return () => {
      disposed = true;
      unwire();
    };
  }, []);

  return (
    <main
      ref={rootRef}
      className="city-flight"
      data-city-flight
      data-sc-mode="worldflight"
      data-sc-seam="0.12"
    >
      <div data-sc-world>
        {CITY_LEGS.map((leg) => (
          <div
            key={leg.id}
            data-sc-segment
            data-sc-w={leg.weight}
            {...(leg.waypoint ? { "data-sc-waypoint": leg.waypoint } : {})}
          >
            <img className="sc-world__poster" src={leg.poster} alt="" decoding="async" />
            {dataSave ? null : (
              <video
                data-sc-src={leg.src}
                data-sc-src-mobile={leg.srcMobile}
                playsInline
                muted
              />
            )}
          </div>
        ))}
      </div>

      <div data-sc-world-copy data-city-glass-layer>
        <div
          className="sc-world__scrim city-contrast-scrim"
          data-city-contrast-scrim
        />

        {/* Open: quiet awe. Hero window — on from the first pixel. */}
        <Copy slideId="00-era" window="hero" anchor="lead" level={1} />

        {/* Claim / Quiet / Human / Pressure / Approach. Varied anchors. */}
        <Copy slideId="01-title" window={windowForLegs(1, 1)} anchor="trail" withEyebrow />
        <Copy slideId="00b-mission" window={windowForLegs(2, 2)} anchor="center" />
        <Copy slideId="00c-ceo" window={windowForLegs(3, 3)} anchor="lead" />
        <Copy slideId="02-world" window={windowForLegs(4, 4)} anchor="trail" withEyebrow />
        <Copy slideId="03-four-stacks" window={windowForLegs(5, 5)} anchor="lead" withEyebrow />

        {/* Peak: the lock is visual. Copy arrives only in the last 30%, as the turn. */}
        <Copy
          slideId="08-ten-layers"
          window={windowForLegSlice(6, 0.7, 1)}
          anchor="center"
          withEyebrow
        />

        {/* Range: ten-stream index + pinned disclosure + detail link. */}
        <div
          className="sc-copy sc-copy--lead"
          data-sc-copy
          data-sc-window={windowForLegs(STREAMS_WINDOW.startLeg, STREAMS_WINDOW.endLeg)}
          data-city-streams
        >
          <StreamsIndex />
          <p className="city-disclosure" data-city-disclosure>
            {CITY_DISCLOSURE}
          </p>
          <a data-city-experience-link href="/?view=experience">
            See every stream in detail
          </a>
        </div>

        {/* Bridge: one short lift on the way to Join. */}
        <Copy slideId="18-different" window={windowForLegSlice(8, 0.55, 1)} anchor="trail" />

        {/* Resolve: the city holds; one ask. */}
        <div
          className="sc-copy sc-copy--center city-close"
          data-sc-copy
          data-sc-window="finale"
          data-city-copy="15-closing"
        >
          {closing.eyebrow ? <p className="sc-eyebrow">{closing.eyebrow}</p> : null}
          <h2 className="sc-display sc-display--lg">{closing.headline}</h2>
          {ctaLinks ? (
            <div className="city-cta" data-city-cta>
              <a href={ctaLinks.primary}>{closing.ctaPrimary}</a>
              <a href={ctaLinks.secondary}>{closing.ctaSecondary}</a>
            </div>
          ) : null}
          <p className="city-disclosure">{closing.disclosure}</p>
        </div>

        {/* Approved plates in the city's glass. */}
        {CITY_GLASS.map((g) => (
          <figure
            key={`${g.slideId}-${g.legIndex}`}
            className="city-glass"
            data-glass={g.slideId}
            data-leg={g.legIndex}
            data-sc-copy
            data-sc-window={windowForLegs(g.legIndex, g.legIndex)}
          >
            <img src={slideById(g.slideId).conceptSrc} alt="" decoding="async" />
          </figure>
        ))}
      </div>

      <CityStopsRail />
      <div data-sc-spacer aria-hidden="true" />
    </main>
  );
}
