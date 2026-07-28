/**
 * Whisper often returns empty FINAL_TRANSCRIPT for short "yes".
 * When Confirm? is pending and VAD heard speech but STT committed nothing,
 * treat a short utterance as yes.
 */
export function shouldRecoverEmptySttConfirm(opts: {
  confirmPending: boolean;
  speechDurationMs: number;
  committedHeard: boolean;
}): boolean {
  if (!opts.confirmPending) return false;
  if (opts.committedHeard) return false;
  return opts.speechDurationMs >= 200 && opts.speechDurationMs <= 3500;
}
