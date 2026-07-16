import { describe, expect, it, vi } from "vitest";
import { resolveTalkParticipant } from "./link-participant.js";

describe("resolveTalkParticipant", () => {
  it("waits for the operator before the voice pipeline starts listening", async () => {
    const operator = { identity: "operator-1" };
    const waitForParticipant = vi.fn().mockResolvedValue(operator);

    const linked = await resolveTalkParticipant({ waitForParticipant });

    expect(waitForParticipant).toHaveBeenCalledOnce();
    expect(linked).toBe(operator);
  });
});
