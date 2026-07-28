/** Legacy registry / agent frontmatter → Cursor SDK model ids. */
const MODEL_ALIASES: Record<string, string> = {
  "grok-4-5": "grok-4.5",
};

const DEFAULT_MODEL = "composer-2.5";

/** Normalize model ids before Agent.create / Agent.send. */
export function normalizeCursorModelId(model: string | undefined | null): string {
  const raw = String(model ?? "").trim();
  if (!raw) return DEFAULT_MODEL;
  return MODEL_ALIASES[raw] ?? raw;
}
