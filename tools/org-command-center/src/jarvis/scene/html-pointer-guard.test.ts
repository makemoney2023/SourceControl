import { afterEach, describe, expect, it, vi } from "vitest";
import { htmlPointerRecently, markHtmlPointer } from "./html-pointer-guard";

afterEach(() => {
  vi.useRealTimers();
});

describe("html-pointer-guard", () => {
  it("is false until a label pointer is marked, then expires", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000);
    expect(htmlPointerRecently()).toBe(false);
    markHtmlPointer();
    expect(htmlPointerRecently()).toBe(true);
    vi.setSystemTime(1_400);
    expect(htmlPointerRecently()).toBe(false);
  });
});
