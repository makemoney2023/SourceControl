import { describe, expect, it, beforeEach } from "vitest";
import {
  configureExtractAdapters,
  extractSourceText,
  isAllowedExtension,
  resetExtractAdapters,
} from "./extract";

describe("extractSourceText", () => {
  beforeEach(() => {
    resetExtractAdapters();
  });

  it("decodes utf-8 text files", async () => {
    const r = await extractSourceText("notes.md", Buffer.from("# Hello\nworld", "utf8"));
    expect(r.status).toBe("ok");
    expect(r.method).toBe("utf8");
    expect(r.text).toContain("Hello");
  });

  it("returns image_stub for png without OCR", async () => {
    const r = await extractSourceText("shot.png", Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    expect(r.status).toBe("image_stub");
    expect(r.text.toLowerCase()).toMatch(/image|caption|context note/);
  });

  it("returns extract_failed when pdf parser throws", async () => {
    configureExtractAdapters({
      pdf: async () => {
        throw new Error("boom");
      },
    });
    const r = await extractSourceText("x.pdf", Buffer.from("%PDF-1.4"));
    expect(r.status).toBe("extract_failed");
    expect(r.warning).toMatch(/boom|fail/i);
  });

  it("returns extract_failed when extracted text is empty", async () => {
    configureExtractAdapters({
      pdf: async () => "",
    });
    const r = await extractSourceText("empty.pdf", Buffer.from("%PDF-1.4"));
    expect(r.status).toBe("extract_failed");
    expect(r.warning).toMatch(/empty|no text/i);
  });
});

describe("isAllowedExtension", () => {
  it("allows pdf and rejects exe", () => {
    expect(isAllowedExtension("a.PDF")).toBe(true);
    expect(isAllowedExtension("a.exe")).toBe(false);
  });
});
