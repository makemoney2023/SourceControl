import { beforeEach, describe, expect, it, vi } from "vitest";

const { mocks, CursorAgentError } = vi.hoisted(() => {
  class CursorAgentError extends Error {
    isRetryable: boolean;
    constructor(message: string, isRetryable = false) {
      super(message);
      this.name = "CursorAgentError";
      this.isRetryable = isRetryable;
    }
  }
  return {
    CursorAgentError,
    mocks: {
      close: vi.fn(),
      wait: vi.fn(),
      send: vi.fn(),
      create: vi.fn(),
      resume: vi.fn(),
      prompt: vi.fn(),
    },
  };
});

vi.mock("@cursor/sdk", () => ({
  Agent: {
    create: mocks.create,
    resume: mocks.resume,
    prompt: mocks.prompt,
  },
  CursorAgentError,
}));

import { cursorRuntimeAdapter } from "./runtime-adapter";

function makeAgent(agentId = "agent-abc") {
  return {
    agentId,
    close: mocks.close,
    send: mocks.send,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.close.mockResolvedValue(undefined);
  mocks.send.mockResolvedValue({
    id: "run-1",
    agentId: "agent-abc",
    requestId: "req-uuid-1",
    wait: mocks.wait,
  });
  mocks.wait.mockResolvedValue({
    status: "finished",
    result: "done",
    id: "run-1",
    requestId: "req-uuid-1",
    usage: { totalTokens: 10 },
    durationMs: 42,
  });
  mocks.create.mockResolvedValue(makeAgent());
  mocks.resume.mockResolvedValue(makeAgent("agent-resume"));
});

describe("cursorRuntimeAdapter", () => {
  it("returns agentId, runId, and requestId and disposes the agent", async () => {
    const out = await cursorRuntimeAdapter.run({
      prompt: "do work",
      model: "composer-2.5",
      cwd: "/tmp/repo",
      apiKey: "key",
    });

    expect(mocks.create).toHaveBeenCalledOnce();
    expect(mocks.prompt).not.toHaveBeenCalled();
    expect(out).toMatchObject({
      status: "finished",
      result: "done",
      agentId: "agent-abc",
      runId: "run-1",
      requestId: "req-uuid-1",
      durationMs: 42,
    });
    expect(mocks.close).toHaveBeenCalledOnce();
  });

  it("resumes when agentId is provided", async () => {
    mocks.send.mockResolvedValue({
      id: "run-2",
      agentId: "agent-resume",
      requestId: "req-2",
      wait: mocks.wait,
    });
    mocks.wait.mockResolvedValue({
      status: "finished",
      result: "ok",
      id: "run-2",
      requestId: "req-2",
    });

    const out = await cursorRuntimeAdapter.run({
      prompt: "continue",
      model: "composer-2.5",
      cwd: "/tmp/repo",
      apiKey: "key",
      agentId: "agent-resume",
    });

    expect(mocks.resume).toHaveBeenCalledWith(
      "agent-resume",
      expect.objectContaining({ apiKey: "key" }),
    );
    expect(mocks.create).not.toHaveBeenCalled();
    expect(out.agentId).toBe("agent-resume");
    expect(out.requestId).toBe("req-2");
    expect(mocks.close).toHaveBeenCalledOnce();
  });

  it("returns run failure status without throwing", async () => {
    mocks.send.mockResolvedValue({
      id: "run-err",
      agentId: "agent-abc",
      requestId: "req-err",
      wait: mocks.wait,
    });
    mocks.wait.mockResolvedValue({
      status: "error",
      result: null,
      id: "run-err",
      requestId: "req-err",
    });

    const out = await cursorRuntimeAdapter.run({
      prompt: "fail mid-run",
      model: "composer-2.5",
      cwd: "/tmp/repo",
      apiKey: "key",
    });

    expect(out.status).toBe("error");
    expect(out.runId).toBe("run-err");
    expect(out.requestId).toBe("req-err");
    expect(mocks.close).toHaveBeenCalledOnce();
    expect(mocks.prompt).not.toHaveBeenCalled();
  });

  it("rethrows CursorAgentError and does not fall back to Agent.prompt", async () => {
    mocks.create.mockRejectedValue(new CursorAgentError("bad key", true));

    await expect(
      cursorRuntimeAdapter.run({
        prompt: "nope",
        model: "composer-2.5",
        cwd: "/tmp/repo",
        apiKey: "bad",
      }),
    ).rejects.toMatchObject({
      name: "CursorAgentError",
      message: "bad key",
      isRetryable: true,
    });

    expect(mocks.prompt).not.toHaveBeenCalled();
  });

  it("disposes the agent when send fails after create", async () => {
    mocks.send.mockRejectedValue(new Error("stream broke"));

    await expect(
      cursorRuntimeAdapter.run({
        prompt: "x",
        model: "composer-2.5",
        cwd: "/tmp/repo",
        apiKey: "key",
      }),
    ).rejects.toThrow("stream broke");

    expect(mocks.close).toHaveBeenCalledOnce();
    expect(mocks.prompt).not.toHaveBeenCalled();
  });
});
