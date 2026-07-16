import { describe, expect, it, vi } from "vitest";
import { createOccClient, summarizeForSpeech } from "./occ-client";

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
