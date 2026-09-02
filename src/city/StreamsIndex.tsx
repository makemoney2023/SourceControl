// The ten income streams as a lighting index. Pure CSS lights each item off the
// engine's --sc-seg / --sc-segp track variables (see .city-streams-index in city.css);
// this component only supplies labels and indices.
import type { CSSProperties } from "react";
import { streamsIndexLabels } from "../data/cityFlight";

export function StreamsIndex() {
  return (
    <ul className="city-streams-index" data-city-streams-index>
      {streamsIndexLabels().map((label, i) => (
        <li key={label + i} style={{ "--i": String(i) } as CSSProperties}>
          {label}
        </li>
      ))}
    </ul>
  );
}
