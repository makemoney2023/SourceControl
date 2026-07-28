export type SttSanitizeResult = {
  text: string;
  rejected: boolean;
  reason?: string;
};

const MAX_WORDS = 40;
const MAX_CHARS = 280;
const MAX_CONSECUTIVE = 4;
const DOMINANT_WORD_MIN = 6;

/**
 * Whisper often emits token loops on silence/noise ("ships ships ships…").
 * Collapse consecutive repeats; reject utterances dominated by one token.
 */
export function sanitizeSttUtterance(raw: string): SttSanitizeResult {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return { text: "", rejected: true, reason: "empty" };

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 0) return { text: "", rejected: true, reason: "empty" };

  const tokenKey = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, "");

  // Cut at the start of a long consecutive repeat run (Whisper loop).
  let cutAt = words.length;
  let consecutive = 1;
  for (let i = 1; i < words.length; i++) {
    const prev = tokenKey(words[i - 1]!);
    const cur = tokenKey(words[i]!);
    if (prev && cur && prev === cur) {
      consecutive += 1;
      if (consecutive === MAX_CONSECUTIVE) {
        cutAt = i - (MAX_CONSECUTIVE - 1);
        break;
      }
    } else {
      consecutive = 1;
    }
  }

  let kept = words.slice(0, cutAt);
  // Drop a trailing partial copy of the looped token once.
  if (cutAt < words.length && kept.length > 0) {
    const loopTok = tokenKey(words[cutAt]!);
    while (kept.length && tokenKey(kept[kept.length - 1]!) === loopTok) {
      kept.pop();
    }
  }

  // Collapse any remaining short consecutive duplicates.
  const collapsed: string[] = [];
  for (const w of kept) {
    const key = tokenKey(w);
    const last = collapsed[collapsed.length - 1];
    if (last && tokenKey(last) === key && key) continue;
    collapsed.push(w);
  }

  const dominantCounts = new Map<string, number>();
  for (const w of words) {
    const key = tokenKey(w);
    if (!key || key.length < 2) continue;
    dominantCounts.set(key, (dominantCounts.get(key) ?? 0) + 1);
  }
  let dominantRatio = 0;
  for (const n of dominantCounts.values()) {
    dominantRatio = Math.max(dominantRatio, n / words.length);
  }

  if (collapsed.length === 0) {
    return { text: "", rejected: true, reason: "repeat_loop" };
  }

  const prefixWords = collapsed.length;
  // Pure hallucination: loop with no usable spoken prefix.
  if (cutAt < words.length && prefixWords === 0) {
    return { text: "", rejected: true, reason: "repeat_loop" };
  }
  if (
    cutAt < words.length &&
    prefixWords === 1 &&
    (collapsed[0]?.length ?? 0) < 8
  ) {
    return { text: "", rejected: true, reason: "repeat_loop" };
  }

  // No loop cut, but one token dominates the whole utterance.
  if (
    cutAt === words.length &&
    prefixWords <= 2 &&
    dominantRatio >= 0.7 &&
    words.length >= DOMINANT_WORD_MIN
  ) {
    return { text: "", rejected: true, reason: "dominant_repeat" };
  }

  let text = collapsed.join(" ").trim();
  if (collapsed.length > MAX_WORDS) {
    text = collapsed.slice(0, MAX_WORDS).join(" ").trim();
  }
  if (text.length > MAX_CHARS) {
    text = `${text.slice(0, MAX_CHARS - 1).trimEnd()}…`;
  }

  if (cutAt < words.length) {
    return { text, rejected: false, reason: "trimmed_loop" };
  }
  return { text, rejected: false };
}
