import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import {
  copyWindowMidpointVh,
  RANGE_STREAMS_WINDOW,
  slideById,
  trackTotalVh,
} from "../src/data/cityFlight";

async function flightSeg(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      Number(
        getComputedStyle(document.documentElement).getPropertyValue("--sc-seg"),
      ) || 0,
  );
}

async function scrollToVh(page: Page, vh: number) {
  await page.evaluate((v) => window.scrollTo(0, window.innerHeight * v), vh);
  await page.waitForTimeout(400);
}

function rangeStreamsMidpointVh(): number {
  const [from, to] = RANGE_STREAMS_WINDOW.split(" ").map(Number);
  return ((from! + to!) / 2) * trackTotalVh();
}

test.describe("Neon city worldflight", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?view=city");
    await expect(page.locator("[data-city-flight]")).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollHeight / window.innerHeight,
        ),
      )
      .toBeGreaterThan(15);
  });

  test("opens on the Era headline with no counter and no scroll cue", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Join the SuperPatch Era\./,
      }),
    ).toBeVisible();
    await expect(page.getByText(/\d{2}\s*\/\s*\d{2}/)).toHaveCount(0);
    await expect(page.getByText(/scroll to explore/i)).toHaveCount(0);
  });

  test("has no glass plates in the DOM", async ({ page }) => {
    await expect(page.locator("[data-glass]")).toHaveCount(0);
    await expect(page.locator(".city-glass")).toHaveCount(0);
  });

  test("science / VTT headline appears during product act", async ({ page }) => {
    const scienceVh = copyWindowMidpointVh("05b-science");
    await scrollToVh(page, scienceVh);
    const science = page.locator('[data-city-copy="05b-science"]');
    await expect(science).toBeVisible();
    await expect(science).toContainText(slideById("05b-science").headline);
  });

  test("the page has a real scroll track and the flight advances", async ({
    page,
  }) => {
    const track = await page.evaluate(
      () => document.documentElement.scrollHeight / window.innerHeight,
    );
    expect(track).toBeGreaterThan(15);
    const before = await flightSeg(page);
    await scrollToVh(page, 6);
    await expect.poll(() => flightSeg(page)).toBeGreaterThan(before);
  });

  test("map stops are keyboard-reachable and jump the flight", async ({
    page,
  }) => {
    const rail = page.locator("[data-city-rail]");
    await expect(rail.getByRole("button")).toHaveCount(5);
    const skyline = rail.getByRole("button", { name: "Skyline" });
    await skyline.focus();
    await expect(skyline).toBeFocused();
    await page.keyboard.press("Enter");
    await expect.poll(() => flightSeg(page)).toBeGreaterThanOrEqual(5);
  });

  test("disclosure is pinned through the streams window", async ({ page }) => {
    await scrollToVh(page, rangeStreamsMidpointVh());
    await expect(page.locator("[data-city-disclosure]")).toBeVisible();
    await expect(page.locator("[data-city-streams-index] li")).toHaveCount(10);
  });

  test("mobile: ten-layers and streams do not stack on the detail link", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "desktop-chrome", "mobile band only");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/?view=city");
    await expect(page.locator("[data-city-flight]")).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollHeight / window.innerHeight,
        ),
      )
      .toBeGreaterThan(15);

    const total = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight,
    );
    // Sample across the full track; both may briefly crossfade but must
    // not share a long dual-hold where the detail link sits under 08 body.
    let dualHold = 0;
    let linkUnderTen = 0;
    for (let i = 5; i <= 95; i += 5) {
      await page.evaluate((y) => window.scrollTo(0, y), (i / 100) * total);
      await page.waitForTimeout(40);
      const hit = await page.evaluate(() => {
        const ten = document.querySelector('[data-city-copy="08-ten-layers"]');
        const streams = document.querySelector("[data-city-streams]");
        const link = document.querySelector("[data-city-experience-link]");
        if (!ten || !streams || !link) return { dual: false, under: false };
        const top = parseFloat(getComputedStyle(ten).opacity || "0");
        const sop = parseFloat(getComputedStyle(streams).opacity || "0");
        const tr = ten.getBoundingClientRect();
        const lr = link.getBoundingClientRect();
        const dual = top > 0.35 && sop > 0.35;
        const under =
          dual &&
          lr.top < tr.bottom - 8 &&
          lr.bottom > tr.top + 8 &&
          lr.left < tr.right &&
          lr.right > tr.left;
        return { dual, under };
      });
      if (hit.dual) dualHold += 1;
      if (hit.under) linkUnderTen += 1;
    }
    expect(linkUnderTen, "See every stream under ten-layers body").toBe(0);
    expect(dualHold, "long dual-hold on shared mobile band").toBeLessThan(6);
  });

  test("axe passes at open, peak, and close", async ({ page }) => {
    const closeVh = trackTotalVh() * 0.92;
    for (const vh of [0, 7, closeVh]) {
      await scrollToVh(page, vh);
      const results = await new AxeBuilder({ page })
        .disableRules(["color-contrast"])
        .analyze();
      expect(results.violations, `at ${vh}vh`).toEqual([]);
    }
  });
});
