import { describe, expect, it } from "vitest";
import {
  readOperatorNote,
  seedContextMd,
  writeOperatorNote,
  writeSourcesDigest,
} from "./context-md";

describe("context-md", () => {
  it("preserves operator note when rewriting digest", () => {
    let md = seedContextMd("Keep me");
    md = writeSourcesDigest(md, ["- `id1` Doc — summary"]);
    expect(readOperatorNote(md)).toContain("Keep me");
    expect(md).toContain("auto:sources-digest");
    expect(md).toContain("id1");
  });

  it("writeOperatorNote does not wipe digest", () => {
    let md = seedContextMd("A");
    md = writeSourcesDigest(md, ["- line"]);
    md = writeOperatorNote(md, "B");
    expect(readOperatorNote(md)).toBe("B");
    expect(md).toContain("- line");
  });
});
