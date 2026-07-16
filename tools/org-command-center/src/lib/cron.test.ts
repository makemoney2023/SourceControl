import { describe, expect, it } from "vitest";
import { cronMatches, isCronDue, nextCronFire } from "./cron";

describe("cronMatches", () => {
  it("matches every minute", () => {
    expect(cronMatches("* * * * *", new Date("2026-07-16T14:30:00Z"))).toBe(true);
  });

  it("matches specific hour/minute", () => {
    const d = new Date("2026-07-16T09:00:00Z");
    expect(cronMatches("0 9 * * *", d)).toBe(true);
    expect(cronMatches("0 10 * * *", d)).toBe(false);
  });
});

describe("isCronDue", () => {
  it("fires once per minute", () => {
    const now = new Date("2026-07-16T09:00:30Z");
    expect(isCronDue("0 9 * * *", now, null)).toBe(true);
    expect(isCronDue("0 9 * * *", now, "2026-07-16T09:00:00.000Z")).toBe(false);
    expect(isCronDue("0 9 * * *", now, "2026-07-16T08:00:00.000Z")).toBe(true);
  });
});

describe("nextCronFire", () => {
  it("finds next 9:00 UTC", () => {
    const next = nextCronFire("0 9 * * *", new Date("2026-07-16T08:00:00Z"));
    expect(next?.toISOString()).toBe("2026-07-16T09:00:00.000Z");
  });
});
