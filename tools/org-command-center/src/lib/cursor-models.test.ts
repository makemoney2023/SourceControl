import { describe, expect, it } from "vitest";
import { normalizeCursorModelId } from "./cursor-models";

describe("normalizeCursorModelId", () => {
  it("maps legacy grok-4-5 hyphen slug to Cursor SDK grok-4.5", () => {
    expect(normalizeCursorModelId("grok-4-5")).toBe("grok-4.5");
  });

  it("leaves valid ids unchanged", () => {
    expect(normalizeCursorModelId("grok-4.5")).toBe("grok-4.5");
    expect(normalizeCursorModelId("composer-2.5")).toBe("composer-2.5");
  });

  it("falls back to composer-2.5 for empty", () => {
    expect(normalizeCursorModelId("")).toBe("composer-2.5");
    expect(normalizeCursorModelId(undefined)).toBe("composer-2.5");
  });
});
