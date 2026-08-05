import { describe, expect, it } from "vitest";
import {
  ChatSubmissionGuard,
  failedChatDraft,
  nextChatDraft,
  retryChatMessage,
} from "./chat-submission";

describe("chat submission state", () => {
  it("preserves failed drafts and clears successful drafts", () => {
    expect(nextChatDraft("retry me", false)).toBe("retry me");
    expect(nextChatDraft("sent", true)).toBe("");
  });

  it("rejects overlapping sends until the first settles", async () => {
    const guard = new ChatSubmissionGuard();
    let release!: () => void;
    const first = guard.run(() => new Promise<void>((resolve) => { release = resolve; }));
    expect(await guard.run(async () => undefined)).toBe(false);
    release();
    expect(await first).toBe(true);
    expect(await guard.run(async () => undefined)).toBe(true);
  });

  it("restores failed speech as an exact retryable draft", () => {
    expect(failedChatDraft("", "schedule the research review", "speech")).toBe(
      "schedule the research review",
    );
    expect(retryChatMessage("", "schedule the research review")).toBe(
      "schedule the research review",
    );
  });

  it("preserves an existing typed draft over a failed speech message", () => {
    expect(failedChatDraft("typed draft", "speech transcript", "speech")).toBe("typed draft");
  });

  it("retries the failed message before any newer typed draft", () => {
    expect(retryChatMessage("new typed draft", "exact failed speech")).toBe(
      "exact failed speech",
    );
  });
});
