import { describe, expect, it } from "vitest";
import {
  parseBrainRoutePayload,
  routeBrain,
  type BrainRouteIntent,
} from "./brain-route";
import { JarvisExecError } from "./errors";

describe("parseBrainRoutePayload", () => {
  it("parses clean JSON object", () => {
    const r = parseBrainRoutePayload(
      JSON.stringify({
        intent: "status",
        confidence: 0.9,
        spokenHint: "Here is where we are.",
      }),
    );
    expect(r.intent).toBe("status");
    expect(r.confidence).toBe(0.9);
    expect(r.spokenHint).toMatch(/where we are/i);
  });

  it("extracts JSON from fenced or noisy model output", () => {
    const r = parseBrainRoutePayload(`Sure.
\`\`\`json
{"intent":"clarify","clarifyQuestion":"Start Phase 1 framing now?","confidence":0.8}
\`\`\`
`);
    expect(r.intent).toBe("clarify");
    expect(r.clarifyQuestion).toMatch(/Phase 1/i);
  });

  it("rejects unknown intent", () => {
    expect(() =>
      parseBrainRoutePayload(JSON.stringify({ intent: "dance", confidence: 1 })),
    ).toThrow(/invalid intent/i);
  });

  it("rejects missing confidence", () => {
    expect(() =>
      parseBrainRoutePayload(JSON.stringify({ intent: "status" })),
    ).toThrow(/confidence/i);
  });

  it("requires clarifyQuestion when intent is clarify", () => {
    expect(() =>
      parseBrainRoutePayload(JSON.stringify({ intent: "clarify", confidence: 0.7 })),
    ).toThrow(/clarifyQuestion/i);
  });
});

describe("routeBrain", () => {
  it("throws missing_key without CURSOR_API_KEY", async () => {
    const prev = process.env.CURSOR_API_KEY;
    delete process.env.CURSOR_API_KEY;
    try {
      await expect(
        routeBrain({
          utterance: "what's next?",
          spokenBrief: "Phase 0 is done.",
          cwd: "/tmp",
          apiKey: null,
        }),
      ).rejects.toMatchObject({ code: "missing_key" });
    } finally {
      if (prev !== undefined) process.env.CURSOR_API_KEY = prev;
    }
  });

  it("returns clarify when runtime yields clarify JSON", async () => {
    const out = await routeBrain({
      utterance: "what are the next steps?",
      spokenBrief: "Phase 0 done. Next: name city then Phase 1.",
      cwd: "/tmp",
      apiKey: "test-key",
      runtime: {
        async prompt() {
          return {
            status: "finished",
            result: JSON.stringify({
              intent: "clarify" satisfies BrainRouteIntent,
              clarifyQuestion: "Do you want the list, or should I start Phase 1 framing?",
              confidence: 0.85,
            }),
          };
        },
      },
    });
    expect(out.ok).toBe(true);
    expect(out.intent).toBe("clarify");
    expect(out.clarifyQuestion).toMatch(/Phase 1|list/i);
    expect(out.spoken).toMatch(/Phase 1|list/i);
  });

  it("returns proceed when runtime yields proceed JSON", async () => {
    const out = await routeBrain({
      utterance: "Okay, we're doing the next steps.",
      spokenBrief: "Phase 0 approve.",
      cwd: "/tmp",
      apiKey: "test-key",
      runtime: {
        async prompt() {
          return {
            status: "finished",
            result: '{"intent":"proceed","confidence":0.92,"spokenHint":"Opening Phase 1."}',
          };
        },
      },
    });
    expect(out.intent).toBe("proceed");
    expect(out.confidence).toBeGreaterThan(0.9);
  });

  it("times out and throws when runtime hangs", async () => {
    await expect(
      routeBrain({
        utterance: "status",
        spokenBrief: "brief",
        cwd: "/tmp",
        apiKey: "test-key",
        timeoutMs: 30,
        runtime: {
          prompt: () => new Promise(() => {}),
        },
      }),
    ).rejects.toBeInstanceOf(JarvisExecError);
  });
});
