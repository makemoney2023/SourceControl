export function nextChatDraft(draft: string, succeeded: boolean): string {
  return succeeded ? "" : draft;
}

export type ChatOrigin = "typed" | "speech";

export function failedChatDraft(
  currentDraft: string,
  failedMessage: string,
  origin: ChatOrigin,
): string {
  if (currentDraft.trim()) return currentDraft;
  return origin === "speech" ? failedMessage : currentDraft;
}

export function retryChatMessage(draft: string, failedMessage: string | null): string {
  return failedMessage || draft.trim() || "";
}

export class ChatSubmissionGuard {
  private sending = false;

  get active(): boolean {
    return this.sending;
  }

  async run(operation: () => Promise<void>): Promise<boolean> {
    if (this.sending) return false;
    this.sending = true;
    try {
      await operation();
      return true;
    } finally {
      this.sending = false;
    }
  }
}
