import { z } from "zod";

export const BANNED_PATTERNS = [
  /\brelaxed\b/i,
  /\bsafe to approach\b/i,
  /\bwon['']?t bite\b/i,
  /\btranslator\b/i,
  /\bsee what your dog is thinking\b/i,
  /\byour dog has\b/i,
  /\bunlimited\b/i,
  /\$9\.99\b/,
] as const;

export const visionResponseSchema = z.object({
  child_in_frame: z.boolean(),
  refuse: z.boolean(),
  refuse_reason: z
    .enum(["kids-in-frame", "bite-risk", "medical", "confidence-floor"])
    .nullable(),
  confidence: z.enum(["low", "medium", "high"]),
  confidence_note: z.string(),
  signals: z.array(z.string()).max(8),
  gate_inputs: z
    .object({
      freeze: z.boolean().optional(),
      whale_eye: z.boolean().optional(),
      hard_stare: z.boolean().optional(),
      growling: z.boolean().optional(),
      snapping: z.boolean().optional(),
    })
    .default({}),
  actions: z.array(z.string()).max(3),
  stop_rule: z.string(),
  escalate: z.string(),
  notes: z.string(),
});

export type VisionResponse = z.infer<typeof visionResponseSchema>;

export function containsBannedClaim(text: string): boolean {
  return BANNED_PATTERNS.some((pattern) => pattern.test(text));
}

export function sanitizeActions(actions: string[]): string[] {
  return actions
    .filter((a) => a.trim().length > 0)
    .filter((a) => !containsBannedClaim(a))
    .slice(0, 3);
}

export function applyRefuseRules(parsed: VisionResponse): VisionResponse {
  let refuse = parsed.refuse;
  let refuse_reason = parsed.refuse_reason;

  if (parsed.child_in_frame) {
    refuse = true;
    refuse_reason = "kids-in-frame";
  }

  if (parsed.confidence === "low" && !refuse) {
    refuse = true;
    refuse_reason = "confidence-floor";
  }

  if (refuse && !refuse_reason) {
    refuse_reason = "confidence-floor";
  }

  return {
    ...parsed,
    refuse,
    refuse_reason,
    actions: refuse ? [] : sanitizeActions(parsed.actions),
  };
}
