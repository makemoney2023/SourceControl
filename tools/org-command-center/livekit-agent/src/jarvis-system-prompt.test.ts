import { describe, expect, it } from "vitest";
import { JARVIS_SYSTEM_PROMPT } from "./jarvis-system-prompt";

describe("JARVIS_SYSTEM_PROMPT", () => {
  it("teaches work.request Cursor spawn playbook", () => {
    expect(JARVIS_SYSTEM_PROMPT).toContain("work.request");
    expect(JARVIS_SYSTEM_PROMPT).toContain("work_resolve");
    expect(JARVIS_SYSTEM_PROMPT).toContain("set_mode(ops)");
    expect(JARVIS_SYSTEM_PROMPT).toContain("jarvis_confirm");
    expect(JARVIS_SYSTEM_PROMPT).toContain("REVIEW/inbox");
  });

  it("skips invented clarifying questions when seat and goal are clear", () => {
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/skip intake|do not invent|no clarifying/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/work_resolve once|once only|do not re-call work_resolve/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/spin up|look at|review/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/ops.*not review|never.*review mode.*spawn/i);
  });

  it("teaches domain routing when the user does not name a seat", () => {
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/infer|route|domain/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/copy|blog|marketing/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/cmo|copy-chief/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/cfo|finance/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/cto|engineering|code/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/research|head-of-research/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/creative|brand|design/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/sales|legal|ops|product|data|people/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/ceo-strategist|escalate/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/pass .+position|position=.+|infer .+seat/i);
  });

  it("teaches started is not done after work.request confirm", () => {
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/started/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/never read runIds|long numbers|never.*runId/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/never.*(done|finished|complete)|not done|started is not done/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/work\.request|work_request/i);
  });

  it("teaches Phase 0 C-suite roundtable confirm wording", () => {
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/Phase 0 C-suite roundtable/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/CEO → peers → CEO merge/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/do not manually queue those peers|auto peer/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/never set_mode\(briefing\)|never.*briefing/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/Never re-speak|pulse line|Next is Phase/i);
  });

  it("teaches runs.watch for run completion status", () => {
    expect(JARVIS_SYSTEM_PROMPT).toContain("runs.watch");
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/runs\.get|runs_get/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/is it done|done\?|finished|run status/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/never work_request|status update/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/NEVER re-speak|Next is/i);
  });

  it("routes findings via brain.route / jarvis_context not invention", () => {
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/brain\.route|jarvis_context/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/Never invent CFO|never invent/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/Never call work_resolve.*findings|next-steps/i);
  });

  it("teaches proactive completion announce without inventing finishes", () => {
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/proactively announce|system may.*announce/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/never invent/i);
  });

  it("teaches plain-English outcomes and next steps over path dumps", () => {
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/plain-English|Next steps/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/not paths|runIds|table dumps/i);
  });

  it("teaches run.instruct and run.rewake for mid-flight operator delta", () => {
    expect(JARVIS_SYSTEM_PROMPT).toContain("run.instruct");
    expect(JARVIS_SYSTEM_PROMPT).toContain("run.rewake");
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/also do|tell them|instruction|mid-flight|operator/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/set_mode\(ops\)|ops.*confirm|Confirm\?/i);
  });

  it("teaches blocker.list for blocked seats", () => {
    expect(JARVIS_SYSTEM_PROMPT).toContain("blocker.list");
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/what'?s blocked|blockers?/i);
  });

  it("teaches batch queue and run_ready for multi-manager kickoff", () => {
    expect(JARVIS_SYSTEM_PROMPT).toContain("dispatch.queue_batch");
    expect(JARVIS_SYSTEM_PROMPT).toContain("spawn.run_ready");
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/research and finance|head of research and CFO/i);
  });

  it("teaches brain.ask for Cursor Grok deep think", () => {
    expect(JARVIS_SYSTEM_PROMPT).toContain("brain.ask");
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/think hard|ask Grok|tradeoffs|strategy/i);
  });

  it("teaches memory brief, note, digest, and recall playbooks", () => {
    expect(JARVIS_SYSTEM_PROMPT).toContain("memory.brief");
    expect(JARVIS_SYSTEM_PROMPT).toContain("memory.note");
    expect(JARVIS_SYSTEM_PROMPT).toContain("memory.digest");
    expect(JARVIS_SYSTEM_PROMPT).toContain("memory.recall");
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/where are we|what'?s next/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/never.*spawn|suggestion alone/i);
  });

  it("forbids inventing confirm tokens", () => {
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/never invent.*token|omit token|no token/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/jarvis_confirm.*accept|accept:\s*true|accept true/i);
  });

  it("requires speaking Confirm and waiting before more tools", () => {
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/Confirm\?.*out loud|speak the confirm|ask Confirm\?/i);
    expect(JARVIS_SYSTEM_PROMPT).toMatch(/stop all tools|Never call work_request again|wait for the user/i);
  });
});
