// The neon-city worldflight. Authored markup driven by the vendored Scroll Craft
// engine; all strings and plate paths come from the cityFlight/slides SSOT.
// View switches are full navigations (query param), so the engine mounts once
// per page load and needs no unmount path.
import { useEffect, useRef, type CSSProperties } from "react";
import {
  CITY_DISCLOSURE,
  CITY_LEGS,
  COPY_WINDOWS,
  RANGE_STREAMS_WINDOW,
  slideById,
  streamsIndexLightStartSeg,
  streamsIndexLightStepSeg,
} from "../data/cityFlight";
import { SLIDES } from "../data/slides";
import { readProductionCtaLinksFromEnv } from "../components/experience/ctaLinks";
import { useDataSave } from "../components/experience/useDataSave";
import { CityStopsRail } from "./CityStopsRail";
import { StreamsIndex } from "./StreamsIndex";
import "./engine/scrollcraft.css";
import "./city.css";

declare global {
  interface Window {
    ScrollCraft?: { mount: (root: Document) => unknown };
  }
}

const ANCHORS = ["lead", "trail", "center"] as const;
type CopyAnchor = (typeof ANCHORS)[number];

/** Varied anchors without stacking the same anchor on adjacent slides. */
export function copyAnchorForIndex(index: number): CopyAnchor {
  const pick = ANCHORS[index % ANCHORS.length]!;
  if (index === 0) return pick;
  const prev = copyAnchorForIndex(index - 1);
  if (pick !== prev) return pick;
  return ANCHORS[(index + 1) % ANCHORS.length]!;
}

function Copy({
  slideId,
  window: win,
  anchor,
  level = 2,
}: {
  slideId: string;
  window: string;
  anchor: CopyAnchor;
  level?: 1 | 2;
}) {
  const slide = slideById(slideId);
  const H = level === 1 ? "h1" : "h2";
  const onScreen = slide.onScreenBody?.trim();
  return (
    <div
      className={`sc-copy sc-copy--${anchor}`}
      data-sc-copy
      data-sc-window={win}
      data-city-copy={slideId}
    >
      {slide.eyebrow ? <p className="sc-eyebrow">{slide.eyebrow}</p> : null}
      <H className="sc-display sc-display--lg">{slide.headline}</H>
      {onScreen ? <p className="city-body">{onScreen}</p> : null}
    </div>
  );
}

function StreamsBlock({ anchor }: { anchor: CopyAnchor }) {
  return (
    <div
      className={`sc-copy sc-copy--${anchor}`}
      data-sc-copy
      data-sc-window={RANGE_STREAMS_WINDOW}
      data-city-streams
    >
      <StreamsIndex />
      <p className="city-disclosure" data-city-disclosure>
        {CITY_DISCLOSURE}
      </p>
      <a className="city-experience-link" data-city-experience-link href="/?view=experience">
        See every stream in detail
      </a>
    </div>
  );
}

function ClosingBlock({
  window: win,
  anchor,
  ctaLinks,
}: {
  window: string;
  anchor: CopyAnchor;
  ctaLinks: ReturnType<typeof readProductionCtaLinksFromEnv>;
}) {
  const closing = slideById("15-closing");
  return (
    <div
      className={`sc-copy sc-copy--${anchor} city-close`}
      data-sc-copy
      data-sc-window={win}
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
  );
}

export function CityFlightShell() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dataSave = useDataSave();
  const ctaLinks = readProductionCtaLinksFromEnv();

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
    return () => {
      disposed = true;
    };
  }, []);

  return (
    <main
      ref={rootRef}
      className="city-flight"
      data-city-flight
      data-sc-mode="worldflight"
      data-sc-seam="0.12"
      style={
        {
          "--city-streams-light-start": String(streamsIndexLightStartSeg()),
          "--city-streams-light-step": String(streamsIndexLightStepSeg()),
        } as CSSProperties
      }
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

      <div data-sc-world-copy data-city-copy-layer>
        {/* Band scrim only where copy sits — never a full-frame wash. */}
        <div
          className="sc-world__scrim sc-scrim sc-scrim--band"
          data-city-band-scrim
          aria-hidden="true"
        />

        {SLIDES.flatMap((slide, index) => {
          const anchor = copyAnchorForIndex(index);
          const win = COPY_WINDOWS[slide.id]!;

          if (slide.id === "15-closing") {
            return [
              <ClosingBlock
                key={slide.id}
                window={win}
                anchor={anchor}
                ctaLinks={ctaLinks}
              />,
            ];
          }

          const nodes = [
            <Copy
              key={slide.id}
              slideId={slide.id}
              window={win}
              anchor={anchor}
              level={slide.id === "00-era" ? 1 : 2}
            />,
          ];

          if (slide.id === "08-ten-layers") {
            nodes.push(<StreamsBlock key="city-streams" anchor={copyAnchorForIndex(index + 1)} />);
          }

          return nodes;
        })}
      </div>

      <CityStopsRail />
      <div data-sc-spacer aria-hidden="true" />
    </main>
  );
}
