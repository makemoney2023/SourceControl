import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { SeatBusinessBrief } from "../../src/lib/operator-summary";
import {
  briefCacheKey,
  clearSeatBriefRewriteCacheForTests,
  parseGrokSeatBriefJson,
  rewriteSeatBusinessBrief,
  type SeatBriefRewriteRuntime,
} from "./seat-brief-rewrite";

afterEach(() => {
  clearSeatBriefRewriteCacheForTests();
});

describe("parseGrokSeatBriefJson", () => {
  it("parses JSON object into SeatBusinessBrief", () => {
    const brief = parseGrokSeatBriefJson(`{
      "whatHappened": ["Framing is ready for review."],
      "whyItMatters": ["Launch still needs your kennel facts."],
      "nextSteps": ["Confirm the creative redo."],
      "needsFromYou": ["Which geography and program maturity?"],
      "whatsStuck": ["No photography inventory yet."]
    }`);
    expect(brief?.whatHappened[0]).toMatch(/Framing is ready/i);
    expect(brief?.needsFromYou[0]).toMatch(/geography/i);
    expect(brief?.whatsStuck).toHaveLength(1);
  });

  it("parses fenced JSON", () => {
    const brief = parseGrokSeatBriefJson(
      `Here you go:\n\`\`\`json\n{"whatHappened":["Framing done."],"whyItMatters":[],"nextSteps":["Ask operator."],"needsFromYou":[],"whatsStuck":[]}\n\`\`\``,
    );
    expect(brief?.whatHappened).toEqual(["Framing done."]);
    expect(brief?.nextSteps).toEqual(["Ask operator."]);
  });

  it("returns null for junk", () => {
    expect(parseGrokSeatBriefJson("not json")).toBeNull();
  });
});

describe("rewriteSeatBusinessBrief", () => {
  const fallback: SeatBusinessBrief = {
    whatHappened: [],
    whyItMatters: [],
    nextSteps: [],
    needsFromYou: ["Peer help needed: none"],
    whatsStuck: ["| Risk | Severity |"],
  };

  it("calls Cursor SDK with grok and replaces the brief", async () => {
    const runtime: SeatBriefRewriteRuntime = {
      prompt: vi.fn(async () => ({
        status: "finished",
        result: JSON.stringify({
          whatHappened: ["The business analyst finished the product framing."],
          whyItMatters: ["The site cannot launch without your answers."],
          nextSteps: ["Approve the creative redo, then schedule an interview."],
          needsFromYou: ["Confirm GO on the creative redo."],
          whatsStuck: ["Success metrics are still assumptions."],
        }),
      })),
    };

    const out = await rewriteSeatBusinessBrief({
      seatTitle: "Business Analyst",
      seatSlug: "business-analyst",
      sourceMarkdown: "## Asks\n- Peer help needed: none\n",
      fallback,
      cwd: "/repo",
      apiKey: "test-key",
      runtime,
    });

    expect(runtime.prompt).toHaveBeenCalledOnce();
    const [promptText, opts] = (runtime.prompt as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(promptText)).toMatch(/Business Analyst/i);
    expect(String(promptText)).toMatch(/do not invent/i);
    expect(String(promptText)).toMatch(/detailed|specific names|enough detail/i);
    expect(String(promptText)).toMatch(/2–3 sentences|paragraph/i);
    expect(opts).toMatchObject({
      apiKey: "test-key",
      model: { id: "grok-4.5" },
      local: { cwd: "/repo" },
    });
    expect(out.source).toBe("grok");
    expect(out.brief.whatHappened[0]).toMatch(/business analyst finished/i);
    expect(out.brief.needsFromYou[0]).toMatch(/Confirm GO/i);
  });

  it("keeps long detailed lines instead of truncating to tweets", () => {
    const long =
      "The Business Analyst finished a full consistency check from strategy through operations for Black Sage Kennels and found five core strategy choices line up cleanly across the business model, product requirements, go-to-market, sales, and ops plans.";
    const brief = parseGrokSeatBriefJson(
      JSON.stringify({
        whatHappened: [long],
        whyItMatters: [],
        nextSteps: [],
        needsFromYou: [],
        whatsStuck: [],
      }),
    );
    expect(brief?.whatHappened[0]).toBe(long);
    expect(brief?.whatHappened[0]?.endsWith("…")).toBe(false);
  });

  it("returns cached brief on second call with same content", async () => {
    const runtime: SeatBriefRewriteRuntime = {
      prompt: vi.fn(async () => ({
        status: "finished",
        result: JSON.stringify({
          whatHappened: ["Cached story."],
          whyItMatters: [],
          nextSteps: [],
          needsFromYou: [],
          whatsStuck: [],
        }),
      })),
    };
    const args = {
      seatTitle: "BA",
      seatSlug: "business-analyst",
      sourceMarkdown: "body-v1",
      fallback,
      cwd: "/repo",
      apiKey: "k",
      runtime,
    };
    const first = await rewriteSeatBusinessBrief(args);
    const second = await rewriteSeatBusinessBrief(args);
    expect(runtime.prompt).toHaveBeenCalledOnce();
    expect(second.brief).toEqual(first.brief);
    expect(second.cached).toBe(true);
  });

  it("falls back when runtime fails", async () => {
    const out = await rewriteSeatBusinessBrief({
      seatTitle: "BA",
      seatSlug: "business-analyst",
      sourceMarkdown: "x",
      fallback,
      cwd: "/repo",
      apiKey: "k",
      runtime: {
        prompt: async () => {
          throw new Error("boom");
        },
      },
    });
    expect(out.source).toBe("deterministic");
    expect(out.brief).toEqual(fallback);
  });

  it("briefCacheKey is stable for content and includes prompt version", () => {
    const a = briefCacheKey("business-analyst", "abc");
    const b = briefCacheKey("business-analyst", "abc");
    const c = briefCacheKey("business-analyst", "xyz");
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toMatch(/^v\d+/);
    expect(a).toContain(createHash("sha256").update("abc").digest("hex").slice(0, 16));
  });
});
