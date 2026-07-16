/**
 * VoicePipelineAgent only auto-links on future ParticipantConnected events.
 * The browser operator usually joins first, so we must wait + pass them into start().
 */
export type ParticipantWaiter = {
  waitForParticipant: (identity?: string) => Promise<{ identity: string }>;
};

export async function resolveTalkParticipant(
  ctx: ParticipantWaiter,
): Promise<{ identity: string }> {
  return ctx.waitForParticipant();
}
