import { describe, expect, it } from "vitest";
import {
  isProductionAssetPath,
  mimeForPath,
  previewKindForPath,
} from "./file-preview";

describe("isProductionAssetPath", () => {
  it("keeps Layer B media and office assets", () => {
    expect(isProductionAssetPath("docs/projects/x/business-idea/html/landing.html")).toBe(
      true,
    );
    expect(isProductionAssetPath("docs/projects/x/business-idea/images/hero.png")).toBe(
      true,
    );
    expect(isProductionAssetPath("apps/foo/index.html")).toBe(true);
    expect(isProductionAssetPath("docs/projects/x/business-idea/pitch.pdf")).toBe(true);
  });

  it("excludes craft / ops markdown roots", () => {
    expect(
      isProductionAssetPath("docs/projects/x/business-idea/01-problem-framing.md"),
    ).toBe(false);
    expect(
      isProductionAssetPath("docs/projects/x/business-idea/HANDOFFS/2-mra.md"),
    ).toBe(false);
    expect(isProductionAssetPath("docs/projects/x/MEMORY/notes.md")).toBe(false);
  });
});

describe("previewKindForPath", () => {
  it("classifies common types", () => {
    expect(previewKindForPath("a/b.png")).toBe("image");
    expect(previewKindForPath("a/b.mp4")).toBe("video");
    expect(previewKindForPath("a/b.pdf")).toBe("pdf");
    expect(previewKindForPath("a/b.docx")).toBe("docx");
    expect(previewKindForPath("a/b.md")).toBe("text");
    expect(previewKindForPath("a/b.bin")).toBe("download");
  });
});

describe("mimeForPath", () => {
  it("returns useful content types", () => {
    expect(mimeForPath("x.png")).toBe("image/png");
    expect(mimeForPath("x.pdf")).toBe("application/pdf");
  });
});
