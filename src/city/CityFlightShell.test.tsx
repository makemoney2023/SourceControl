import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CityFlightShell } from "./CityFlightShell";
import { CITY_GLASS, CITY_LEGS, CITY_DISCLOSURE, slideById } from "../data/cityFlight";

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

  it("keeps a city-specific localized scrim outside copy blocks", () => {
    const { container } = render(<CityFlightShell />);
    const scrim = container.querySelector("[data-city-contrast-scrim]");
    expect(scrim).toBeTruthy();
    expect(scrim?.closest("[data-sc-copy]")).toBeNull();
  });

  it("renders every mapped copy block verbatim", () => {
    const { container } = render(<CityFlightShell />);
    for (const id of [
      "01-title", "00b-mission", "00c-ceo", "02-world",
      "03-four-stacks", "08-ten-layers", "18-different", "15-closing",
    ]) {
      const block = container.querySelector(`[data-city-copy="${id}"]`);
      expect(block?.textContent).toContain(slideById(id).headline);
    }
  });

  it("puts every approved plate in glass with alt='' and the exact conceptSrc", () => {
    const { container } = render(<CityFlightShell />);
    for (const g of CITY_GLASS) {
      const img = container.querySelector<HTMLImageElement>(
        `figure[data-glass="${g.slideId}"] img`,
      );
      expect(img?.getAttribute("src")).toBe(slideById(g.slideId).conceptSrc);
      expect(img?.getAttribute("alt")).toBe("");
    }
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
    expect(container.querySelector("[data-city-copy='15-closing']")?.classList)
      .toContain("city-close");
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
