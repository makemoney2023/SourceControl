import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

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
      .toBeGreaterThan(9);
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

  test("the page has a real scroll track and the flight advances", async ({
    page,
  }) => {
    const track = await page.evaluate(
      () => document.documentElement.scrollHeight / window.innerHeight,
    );
    expect(track).toBeGreaterThan(9);
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
    await scrollToVh(page, 8.4);
    await expect(page.locator("[data-city-disclosure]")).toBeVisible();
    await expect(page.locator("[data-city-streams-index] li")).toHaveCount(10);
  });

  test("axe passes at open, peak, and close", async ({ page }) => {
    for (const vh of [0, 7, 11.5]) {
      await scrollToVh(page, vh);
      const results = await new AxeBuilder({ page })
        .disableRules(["color-contrast"])
        .analyze();
      expect(results.violations, `at ${vh}vh`).toEqual([]);
    }
  });
});
