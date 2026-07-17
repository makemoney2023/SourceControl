import { describe, expect, it, vi } from "vitest";
import {
  createOccClient,
  sanitizeForSpeech,
  summarizeForSpeech,
  summarizeJarvisSpeech,
} from "./occ-client";

describe("sanitizeForSpeech", () => {
  it("strips markdown bold so TTS does not say asterisk", () => {
    expect(sanitizeForSpeech("**Modes** and **Top intents**")).toBe("Modes and Top intents");
  });

  it("strips bullets, headings, and backticks", () => {
    expect(sanitizeForSpeech("## Help\n- mission.get — status\n`ops` mode")).toBe(
      "Help mission.get — status ops mode",
    );
  });
});

describe("createOccClient", () => {
  it("getSeatReport hits /api/seat-report/:slug", async () => {
    const calls: string[] = [];
    vi.stubGlobal(
      "fetch",
      async (url: string) => {
        calls.push(String(url));
        return new Response(
          JSON.stringify({ ok: true, report: { slug: "ceo-strategist" } }),
        );
      },
    );
    const c = createOccClient("http://127.0.0.1:5177");
    await c.getSeatReport("ceo-strategist");
    expect(calls[0]).toContain("/api/seat-report/ceo-strategist");
  });

  it("summarizeForSpeech truncates", () => {
    expect(summarizeForSpeech("a".repeat(10), 5)).toBe("aaaaa…");
  });

  it("summarizeForSpeech strips markdown before truncate", () => {
    expect(summarizeForSpeech("**Bold** help", 20)).toBe("Bold help");
  });

  it("summarizeJarvisSpeech returns deny reason only", () => {
    expect(
      summarizeJarvisSpeech({ status: "denied", reason: "Ops mode required for spawn.run_next" }),
    ).toBe("Ops mode required for spawn.run_next");
  });

  it("summarizeJarvisSpeech returns error reason only", () => {
    expect(
      summarizeJarvisSpeech({ status: "error", reason: "Invalid or expired confirm token" }),
    ).toBe("Invalid or expired confirm token");
  });

  it("summarizeJarvisSpeech returns confirm summary", () => {
    expect(
      summarizeJarvisSpeech({
        status: "needs_confirm",
        summary: "Confirm spawn run next?",
        token: "tok-1",
      }),
    ).toBe("Confirm spawn run next?");
  });

  it("summarizeJarvisSpeech prefers ok summary over raw result JSON", () => {
    expect(
      summarizeJarvisSpeech({
        status: "ok",
        summary: "Mission: AWG, phase 2.",
        result: { mission: { idea: "AWG", currentPhase: "2", huge: "x".repeat(2000) } },
      }),
    ).toBe("Mission: AWG, phase 2.");
  });

  it("summarizeJarvisSpeech sanitizes markdown in ok help payloads", () => {
    expect(
      summarizeJarvisSpeech({
        status: "ok",
        result: { help: "**Modes**\n- Briefing — read only" },
      }),
    ).not.toMatch(/\*/);
  });

  it("jarvisAct POSTs to /api/jarvis/act with body", async () => {
    const calls: { url: string; init?: RequestInit }[] = [];
    vi.stubGlobal(
      "fetch",
      async (url: string, init?: RequestInit) => {
        calls.push({ url: String(url), init });
        return new Response(JSON.stringify({ status: "ok", result: {} }));
      },
    );
    const c = createOccClient("http://127.0.0.1:5177");
    await c.jarvisAct({
      intent: "mission.get",
      args: {},
      mode: "briefing",
      roomId: "room-1",
    });
    expect(calls[0].url).toContain("/api/jarvis/act");
    expect(calls[0].init?.method).toBe("POST");
    const body = JSON.parse(calls[0].init?.body as string);
    expect(body.intent).toBe("mission.get");
    expect(body.mode).toBe("briefing");
    expect(body.roomId).toBe("room-1");
  });

  it("jarvisContext GETs /api/jarvis/context", async () => {
    const calls: string[] = [];
    vi.stubGlobal(
      "fetch",
      async (url: string) => {
        calls.push(String(url));
        return new Response(
          JSON.stringify({
            mission: { idea: "AWG" },
            spokenBrief: "AWG on Phase 2, 14% complete.",
          }),
        );
      },
    );
    const c = createOccClient("http://127.0.0.1:5177");
    const ctx = (await c.jarvisContext()) as { spokenBrief: string };
    expect(calls[0]).toContain("/api/jarvis/context");
    expect(ctx.spokenBrief).toContain("AWG");
  });

  it("jarvisConfirm POSTs to /api/jarvis/confirm", async () => {
    const calls: { url: string; init?: RequestInit }[] = [];
    vi.stubGlobal(
      "fetch",
      async (url: string, init?: RequestInit) => {
        calls.push({ url: String(url), init });
        return new Response(JSON.stringify({ status: "ok", result: {} }));
      },
    );
    const c = createOccClient("http://127.0.0.1:5177");
    await c.jarvisConfirm({ roomId: "room-1", token: "tok-abc", accept: true });
    expect(calls[0].url).toContain("/api/jarvis/confirm");
    expect(calls[0].init?.method).toBe("POST");
    const body = JSON.parse(calls[0].init?.body as string);
    expect(body.roomId).toBe("room-1");
    expect(body.token).toBe("tok-abc");
    expect(body.accept).toBe(true);
  });
});
