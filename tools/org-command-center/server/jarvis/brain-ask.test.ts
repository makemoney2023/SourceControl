import { describe, expect, it, vi } from "vitest";
import { askBrain, defaultBrainModel, type BrainAskRuntime } from "./brain-ask";

describe("askBrain", () => {
  it("defaults brain model to grok-4.5", () => {
    expect(defaultBrainModel()).toBe("grok-4.5");
  });

  it("requires a non-empty prompt", async () => {
    await expect(
      askBrain({
        prompt: "   ",
        cwd: "/tmp",
        apiKey: "k",
        runtime: { prompt: vi.fn() },
      }),
    ).rejects.toThrow(/prompt/i);
  });

  it("requires CURSOR_API_KEY when not injected", async () => {
    const prev = process.env.CURSOR_API_KEY;
    delete process.env.CURSOR_API_KEY;
    try {
      await expect(
        askBrain({
          prompt: "What should we prioritize?",
          cwd: "/tmp",
          runtime: { prompt: vi.fn() },
        }),
      ).rejects.toThrow(/CURSOR_API_KEY/);
    } finally {
      if (prev !== undefined) process.env.CURSOR_API_KEY = prev;
    }
  });

  it("calls Cursor runtime with grok-4.5 and returns spoken answer", async () => {
    const runtime: BrainAskRuntime = {
      prompt: vi.fn(async () => ({
        status: "finished",
        result: "Prioritize the water yield experiment this week.",
      })),
    };

    const out = await askBrain({
      prompt: "What should we prioritize?",
      cwd: "/repo",
      apiKey: "test-key",
      runtime,
    });

    expect(runtime.prompt).toHaveBeenCalledOnce();
    const [promptText, opts] = (runtime.prompt as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(promptText)).toContain("What should we prioritize?");
    expect(String(promptText)).toMatch(/do not edit files/i);
    expect(opts).toMatchObject({
      apiKey: "test-key",
      model: { id: "grok-4.5" },
      local: { cwd: "/repo" },
    });
    expect(out.ok).toBe(true);
    expect(out.model).toBe("grok-4.5");
    expect(out.answer).toContain("Prioritize the water yield");
    expect(out.spoken).toContain("Prioritize the water yield");
  });

  it("allows model override", async () => {
    const runtime: BrainAskRuntime = {
      prompt: vi.fn(async () => ({ status: "finished", result: "ok" })),
    };
    await askBrain({
      prompt: "hi",
      cwd: "/repo",
      apiKey: "k",
      model: "composer-2.5",
      runtime,
    });
    expect((runtime.prompt as ReturnType<typeof vi.fn>).mock.calls[0][1].model).toEqual({
      id: "composer-2.5",
    });
  });

  it("fails when runtime returns empty answer", async () => {
    await expect(
      askBrain({
        prompt: "hi",
        cwd: "/repo",
        apiKey: "k",
        runtime: { prompt: async () => ({ status: "finished", result: "" }) },
      }),
    ).rejects.toThrow(/empty/i);
  });
});
