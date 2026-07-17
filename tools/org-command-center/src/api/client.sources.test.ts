import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  deleteSource,
  fetchSources,
  saveContextNote,
  uploadSources,
} from "./client";

function mockResponse(body: unknown, ok = true) {
  return {
    ok,
    text: async () => JSON.stringify(body),
    json: async () => body,
  } as Response;
}

describe("sources client", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetchSources returns sources and contextNote", async () => {
    vi.mocked(fetch).mockResolvedValue(
      mockResponse({ sources: [{ id: "a" }], contextNote: "note" }),
    );
    const result = await fetchSources();
    expect(fetch).toHaveBeenCalledWith("/api/sources");
    expect(result.sources).toHaveLength(1);
    expect(result.contextNote).toBe("note");
  });

  it("uploadSources posts FormData without Content-Type", async () => {
    vi.mocked(fetch).mockResolvedValue(
      mockResponse({ ok: true, sources: [], warning: "stub" }),
    );
    const file = new File(["x"], "a.md", { type: "text/plain" });
    const result = await uploadSources([file]);
    expect(fetch).toHaveBeenCalledWith("/api/sources/upload", {
      method: "POST",
      body: expect.any(FormData),
    });
    const init = vi.mocked(fetch).mock.calls[0][1];
    expect(init?.headers).toBeUndefined();
    expect(result.warnings).toEqual(["stub"]);
  });

  it("saveContextNote sends note json", async () => {
    vi.mocked(fetch).mockResolvedValue(
      mockResponse({ ok: true, contextNote: "saved" }),
    );
    const result = await saveContextNote("saved");
    expect(fetch).toHaveBeenCalledWith("/api/sources/context", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: "saved" }),
    });
    expect(result.contextNote).toBe("saved");
  });

  it("deleteSource calls DELETE endpoint", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse({ ok: true }));
    const result = await deleteSource("src-1");
    expect(fetch).toHaveBeenCalledWith("/api/sources/src-1", { method: "DELETE" });
    expect(result.ok).toBe(true);
  });
});
