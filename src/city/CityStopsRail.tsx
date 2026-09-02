// Five map stops. The engine renders no rail; it publishes sc:waypoint and we
// build the navigation in the page (worldflight contract).
import { useEffect, useState } from "react";
import { CITY_STOPS, stopScrollY } from "../data/cityFlight";

/** Index into CITY_STOPS of the stop that owns a given leg. */
export function activeStopForLeg(legIndex: number): number {
  let active = 0;
  CITY_STOPS.forEach((stop, i) => {
    if (legIndex >= stop.legIndex) active = i;
  });
  return active;
}

export function CityStopsRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onWaypoint = (e: Event) => {
      const detail = (e as CustomEvent<{ index: number }>).detail;
      if (typeof detail?.index === "number") setActive(activeStopForLeg(detail.index));
    };
    window.addEventListener("sc:waypoint", onWaypoint);
    return () => window.removeEventListener("sc:waypoint", onWaypoint);
  }, []);

  return (
    <nav className="city-rail" aria-label="City map stops" data-city-rail>
      {CITY_STOPS.map((stop, i) => (
        <button
          key={stop.id}
          type="button"
          aria-current={i === active ? "true" : "false"}
          onClick={() =>
            window.scrollTo({
              top: stopScrollY(stop.legIndex, window.innerHeight),
              behavior: "smooth",
            })
          }
        >
          {stop.label}
        </button>
      ))}
    </nav>
  );
}
