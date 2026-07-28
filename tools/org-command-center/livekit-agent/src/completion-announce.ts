export type AnnounceEvent = {
  at: string;
  type: string;
  runId: string;
  position: string;
  detail?: string;
  cursor: string;
  spoken: string | null;
};

const POLL_AFTER_TERMINAL_MS = 30_000;

export function shouldPollEvents(
  active: boolean,
  lastTerminalAtMs: number | null,
  nowMs: number,
): boolean {
  if (active) return true;
  if (lastTerminalAtMs == null) return false;
  return nowMs - lastTerminalAtMs <= POLL_AFTER_TERMINAL_MS;
}

/**
 * @param deferSpeak - true while Confirm? pending or user is mid Q&A.
 *   Still mark cursors so finish events do not pile up and dump later.
 */
export function selectAnnounceEvents(
  events: AnnounceEvent[],
  announcedKeys: Set<string>,
  deferSpeak: boolean,
): { speak: string[]; mark: string[] } {
  const speak: string[] = [];
  const mark: string[] = [];
  for (const event of events) {
    if (announcedKeys.has(event.cursor)) continue;
    mark.push(event.cursor);
    if (!deferSpeak && event.spoken) speak.push(event.spoken);
  }
  return { speak, mark };
}
