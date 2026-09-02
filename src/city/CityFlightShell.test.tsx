import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CityFlightShell } from "./CityFlightShell";
import { CITY_LEGS, CITY_DISCLOSURE, slideById } from "../data/cityFlight";
import { SLIDES } from "../data/slides";

afterEach(() => vi.unstubAllEnvs());

describe("CityFlightShell", () => {
  it("renders the worldflight root, all legs, and the spacer", () => {
    const { container } = render(<CityFlightShell />);
    const root = container.querySelector("[data-city-flight]");
    expect(root?.getAttribute("data-sc-mode")).toBe("worldflight");
    expect(container.querySelectorAll("[data-sc-segment]")).toHaveLength(CITY_LEGS.length);
    expect(container.querySelector("[data-sc-spacer]")).toBeTruthy();
  });

  it("opens on the Era headline verbatim from SLIDES", () => {
    const { getByRole } = render(<CityFlightShell />);
    expect(
      getByRole("heading", { level: 1, name: slideById("00-era").headline }),
    ).toBeTruthy();
  });

  it("keeps a band scrim outside copy blocks (not a full-frame wash)", () => {
    const { container } = render(<CityFlightShell />);
    const scrim = container.querySelector("[data-city-band-scrim]");
    expect(scrim).toBeTruthy();
    expect(scrim?.classList.contains("sc-scrim--band")).toBe(true);
    expect(scrim?.closest("[data-sc-copy]")).toBeNull();
    expect(container.querySelector("[data-city-contrast-scrim]")).toBeNull();
  });

  it("renders a copy block for every slide id", () => {
    const { container } = render(<CityFlightShell />);
    for (const s of SLIDES) {
      expect(container.querySelector(`[data-city-copy="${s.id}"]`)?.textContent).toContain(
        slideById(s.id).headline,
      );
    }
  });

  it("does not render glass figures", () => {
    const { container } = render(<CityFlightShell />);
    expect(container.querySelectorAll("[data-glass]")).toHaveLength(0);
    expect(container.querySelectorAll(".city-glass")).toHaveLength(0);
  });

  it("includes VTT science headline on the flight", () => {
    const { container } = render(<CityFlightShell />);
    expect(container.querySelector('[data-city-copy="05b-science"]')?.textContent).toContain(
      slideById("05b-science").headline,
    );
  });

  it("shows onScreenBody for ten-layers (not speaker-only body)", () => {
    const { container } = render(<CityFlightShell />);
    const block = container.querySelector(`[data-city-copy="08-ten-layers"]`);
    const body = slideById("08-ten-layers").onScreenBody!;
    expect(block?.textContent).toContain(body);
  });

  it("has no scene counter and no scroll cue", () => {
    const { container } = render(<CityFlightShell />);
    expect(container.textContent).not.toMatch(/\d{2}\s*\/\s*\d{2}/);
    expect(container.textContent).not.toMatch(/scroll to explore/i);
    expect(container.textContent).not.toMatch(/swipe to explore/i);
  });

  it("pins the income disclosure", () => {
    const { container } = render(<CityFlightShell />);
    const pinned = container.querySelector("[data-city-disclosure]");
    expect(pinned?.textContent).toBe(CITY_DISCLOSURE);
  });

  it("hides Join CTAs without production URLs", () => {
    vi.stubEnv("VITE_AFFILIATE_URL", "");
    vi.stubEnv("VITE_INCOME_DISCLOSURE_URL", "");
    const { container } = render(<CityFlightShell />);
    expect(container.querySelector("[data-city-cta]")).toBeNull();
  });

  it("shows Join CTAs with verbatim labels when both HTTPS URLs are set", () => {
    vi.stubEnv("VITE_AFFILIATE_URL", "https://superpatch.example/join");
    vi.stubEnv("VITE_INCOME_DISCLOSURE_URL", "https://superpatch.example/disclosure");
    const { container } = render(<CityFlightShell />);
    const closing = slideById("15-closing");
    expect(container.querySelector("[data-city-copy='15-closing']")?.classList).toContain(
      "city-close",
    );
    const ctas = container.querySelectorAll("[data-city-cta] a");
    expect(ctas).toHaveLength(2);
    expect(ctas[0].textContent).toBe(closing.ctaPrimary);
    expect(ctas[1].textContent).toBe(closing.ctaSecondary);
  });

  it("links out to the full experience for stream detail", () => {
    const { container } = render(<CityFlightShell />);
    const link = container.querySelector<HTMLAnchorElement>("[data-city-experience-link]");
    expect(link?.getAttribute("href")).toBe("/?view=experience");
  });
});
