import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as client from "./client";

const { answerSeatQuestions, postJarvisAct, resolveBlocker } = client;

function response(body: unknown, ok = true) {
  return {
    ok,
    json: async () => body,
  } as Response;
}

describe("Jarvis act client confirmation", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns needs_confirm without automatically resubmitting", async () => {
    vi.mocked(fetch).mockResolvedValue(
      response({
        status: "needs_confirm",
        token: "confirm-123",
        summary: "Resolve the blocker",
        reason: "This changes workflow state",
      }),
    );

    const result = await postJarvisAct({
      intent: "blocker.resolve",
      args: { seat: "cto" },
    });

    expect(result.status).toBe("needs_confirm");
    expect(result.token).toBe("confirm-123");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("sends an explicit operator-approved token on the second request", async () => {
    vi.mocked(fetch).mockResolvedValue(response({ status: "ok", summary: "Resolved" }));

    await resolveBlocker("cto", "confirm-123");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body))).toMatchObject({
      intent: "blocker.resolve",
      args: { seat: "cto" },
      confirmToken: "confirm-123",
    });
  });

  it("posts seat.answer with answers and optional confirm token", async () => {
    vi.mocked(fetch).mockResolvedValue(response({ status: "ok", summary: "Continued" }));

    await answerSeatQuestions(
      "market-research-analyst",
      { "Which geography?": "Outer Banks" },
      "confirm-answer",
    );

    expect(JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body))).toMatchObject({
      intent: "seat.answer",
      args: {
        seat: "market-research-analyst",
        answers: { "Which geography?": "Outer Banks" },
      },
      confirmToken: "confirm-answer",
    });
  });

  it("posts an explicit confirmation cancellation body", async () => {
    const postJarvisConfirm = (
      client as typeof client & {
        postJarvisConfirm?: (input: {
          roomId: string;
          token: string;
          accept: boolean;
        }) => Promise<unknown>;
      }
    ).postJarvisConfirm;
    expect(postJarvisConfirm).toBeTypeOf("function");
    if (!postJarvisConfirm) return;
    vi.mocked(fetch).mockResolvedValue(
      response({ status: "denied", reason: "Confirm declined" }),
    );

    await postJarvisConfirm({
      roomId: "ops-room",
      token: "confirm-123",
      accept: false,
    });

    expect(fetch).toHaveBeenCalledWith("/api/jarvis/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: "ops-room",
        token: "confirm-123",
        accept: false,
      }),
    });
  });
});
