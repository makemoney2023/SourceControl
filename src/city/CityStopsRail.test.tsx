import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CityStopsRail } from "./CityStopsRail";
import { CITY_STOPS, stopScrollY } from "../data/cityFlight";

describe("CityStopsRail", () => {
  it("renders the five stops in flight order with no counter text", () => {
    const { getAllByRole } = render(<CityStopsRail />);
    const buttons = getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual([
      "Era", "Opportunity", "Skyline", "Streams", "Join",
    ]);
  });

  it("tracks aria-current from sc:waypoint events", () => {
    const { getAllByRole } = render(<CityStopsRail />);
    act(() => {
      window.dispatchEvent(
        new CustomEvent("sc:waypoint", {
          detail: { index: CITY_STOPS[2].legIndex, count: 10, label: "Skyline" },
        }),
      );
    });
    const buttons = getAllByRole("button");
    expect(buttons[2].getAttribute("aria-current")).toBe("true");
    expect(buttons[0].getAttribute("aria-current")).toBe("false");
  });

  it("marks the nearest earlier stop for a leg between stops", () => {
    const { getAllByRole } = render(<CityStopsRail />);
    act(() => {
      window.dispatchEvent(
        new CustomEvent("sc:waypoint", { detail: { index: 4, count: 10, label: "" } }),
      );
    });
    // leg 4 sits between Opportunity (leg 1) and Skyline (leg 5).
    expect(getAllByRole("button")[1].getAttribute("aria-current")).toBe("true");
  });

  it("scrolls to the stop's track position on click", () => {
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    const { getAllByRole } = render(<CityStopsRail />);
    fireEvent.click(getAllByRole("button")[2]);
    expect(scrollTo).toHaveBeenCalledWith({
      top: stopScrollY(CITY_STOPS[2].legIndex, window.innerHeight),
      behavior: "smooth",
    });
    vi.unstubAllGlobals();
  });
});
