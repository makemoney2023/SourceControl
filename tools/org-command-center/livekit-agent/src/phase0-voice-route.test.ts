import { describe, expect, it, vi } from "vitest";
import {
  executeBrainRouteIntent,
  looksLikeConfirmNo,
  looksLikeConfirmYes,
} from "./phase0-voice-route";
import type { ModeState } from "./modes.js";
import type { OccClient } from "./occ-client.js";

describe("looksLikeConfirmYes / No", () => {
  it("matches short yes/no STT including execute/go", () => {
    expect(looksLikeConfirmYes("Yes.")).toBe(true);
    expect(looksLikeConfirmYes("yeah")).toBe(true);
    expect(looksLikeConfirmYes("confirm")).toBe(true);
    expect(looksLikeConfirmYes("ok go ahead")).toBe(true);
    expect(looksLikeConfirmYes("Execute.")).toBe(true);
    expect(looksLikeConfirmYes("go ahead")).toBe(true);
    expect(looksLikeConfirmNo("No.")).toBe(true);
    expect(looksLikeConfirmNo("cancel")).toBe(true);
  });

  it("rejects longer non-confirm speech", () => {
    expect(looksLikeConfirmYes("yes restart phase 0")).toBe(false);
    expect(looksLikeConfirmYes("yesterday we shipped")).toBe(false);
    expect(looksLikeConfirmYes("execute the queue")).toBe(false);
    expect(looksLikeConfirmYes("Yes, go ahead and do all of them.")).toBe(false);
    expect(looksLikeConfirmYes("yes do all the next steps")).toBe(false);
  });
});

describe("executeBrainRouteIntent", () => {
  function mockAgent() {
    return {
      transcribedText: "x",
      say: vi.fn(async () => undefined),
    };
  }

  function mockMode(): ModeState {
    return {
      getMode: () => "briefing" as const,
      setMode: vi.fn(),
    };
  }

  it("clarify speaks the question only (no work.request)", async () => {
    const agent = mockAgent();
    const jarvisAct = vi.fn();
    const occ = { jarvisAct, jarvisContext: vi.fn() } as unknown as OccClient;
    const handled = await executeBrainRouteIntent({
      agent: agent as never,
      occ,
      modeState: mockMode(),
      roomId: "r1",
      route: {
        intent: "clarify",
        clarifyQuestion: "List next steps, or start Phase 1 framing?",
        confidence: 0.9,
      },
    });
    expect(handled).toBe(true);
    expect(jarvisAct).not.toHaveBeenCalled();
    await new Promise((r) => setTimeout(r, 5));
    expect(agent.say).toHaveBeenCalled();
    const said = String(agent.say.mock.calls[0]?.[0] ?? "");
    expect(said).toMatch(/Phase 1|next steps/i);
  });

  it("status uses jarvis_context spokenBrief", async () => {
    const agent = mockAgent();
    const occ = {
      jarvisContext: vi.fn(async () => ({
        spokenBrief: "Phase 0 is done — C-suite says approve. Next: name a city.",
      })),
      jarvisAct: vi.fn(),
    } as unknown as OccClient;
    const handled = await executeBrainRouteIntent({
      agent: agent as never,
      occ,
      modeState: mockMode(),
      roomId: "r1",
      route: { intent: "status", confidence: 0.95 },
    });
    expect(handled).toBe(true);
    expect(occ.jarvisContext).toHaveBeenCalled();
    await new Promise((r) => setTimeout(r, 5));
    const said = String(agent.say.mock.calls[0]?.[0] ?? "");
    expect(said).toMatch(/Phase 0 is done|approve|city/i);
    expect(said).not.toMatch(/Unit economics|GTM/i);
  });

  it("proceed queues Phase 1 work.request after ops", async () => {
    const agent = mockAgent();
    const onConfirmPending = vi.fn();
    const jarvisAct = vi.fn(async ({ intent }: { intent: string }) => {
      if (intent === "mode.set") return { status: "ok", result: { mode: "ops" } };
      if (intent === "work.request") {
        return {
          status: "needs_confirm",
          summary: "Start Phase 1 framing with the CEO. Confirm?",
        };
      }
      return { status: "ok" };
    });
    const occ = { jarvisAct, jarvisContext: vi.fn() } as unknown as OccClient;
    const handled = await executeBrainRouteIntent({
      agent: agent as never,
      occ,
      modeState: mockMode(),
      roomId: "r1",
      route: { intent: "proceed", confidence: 0.9 },
      onConfirmPending,
    });
    expect(handled).toBe(true);
    expect(jarvisAct).toHaveBeenCalledWith(
      expect.objectContaining({ intent: "mode.set" }),
    );
    expect(jarvisAct).toHaveBeenCalledWith(
      expect.objectContaining({
        intent: "work.request",
        args: expect.objectContaining({ phase: "1" }),
      }),
    );
    expect(onConfirmPending).toHaveBeenCalledWith(true);
    await new Promise((r) => setTimeout(r, 5));
    const said = String(agent.say.mock.calls[0]?.[0] ?? "");
    expect(said).toMatch(/Say confirm/i);
  });

  it("other falls through to LLM", async () => {
    const handled = await executeBrainRouteIntent({
      agent: mockAgent() as never,
      occ: { jarvisAct: vi.fn() } as unknown as OccClient,
      modeState: mockMode(),
      roomId: "r1",
      route: { intent: "other", confidence: 0.4 },
    });
    expect(handled).toBe(false);
  });

  it("answer falls through to LLM seat.answer playbook", async () => {
    const jarvisAct = vi.fn();
    const handled = await executeBrainRouteIntent({
      agent: mockAgent() as never,
      occ: { jarvisAct, jarvisContext: vi.fn() } as unknown as OccClient,
      modeState: mockMode(),
      roomId: "r1",
      route: { intent: "answer", confidence: 0.9 },
    });
    expect(handled).toBe(false);
    expect(jarvisAct).not.toHaveBeenCalled();
  });
});
