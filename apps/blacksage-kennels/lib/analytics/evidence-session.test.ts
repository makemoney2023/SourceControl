import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  EVIDENCE_STORAGE_KEY,
  getEvidenceCount,
  getEvidencePages,
  recordEvidencePage,
} from "@/lib/analytics/evidence-session";

function createMockSessionStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  };
}

describe("evidence-session", () => {
  beforeEach(() => {
    vi.stubGlobal("sessionStorage", createMockSessionStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns empty evidence pages for a fresh session", () => {
    expect(getEvidencePages()).toEqual([]);
    expect(getEvidenceCount()).toBe(0);
  });

  it("records evidence routes and deduplicates paths", () => {
    recordEvidencePage("/health");
    recordEvidencePage("/about");
    recordEvidencePage("/health");

    expect(getEvidencePages()).toEqual(["/health", "/about"]);
    expect(getEvidenceCount()).toBe(2);
  });

  it("ignores non-evidence routes", () => {
    recordEvidencePage("/inquire");
    recordEvidencePage("/");

    expect(getEvidencePages()).toEqual([]);
    expect(getEvidenceCount()).toBe(0);
  });

  it("persists evidence pages in sessionStorage", () => {
    recordEvidencePage("/dogs");

    const raw = sessionStorage.getItem(EVIDENCE_STORAGE_KEY);
    expect(raw).toBe(JSON.stringify(["/dogs"]));
  });
});
