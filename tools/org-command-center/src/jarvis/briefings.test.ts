import { describe, expect, it } from "vitest";
import { parseStandupBriefing, renderStandupBriefing } from "./briefings";

describe("briefings", () => {
  it("round-trips standup markdown", () => {
    const md = renderStandupBriefing({
      position: "cfo",
      phase_focus: "4",
      status: "at_risk",
      escalation_tags: ["spend"],
      progress: "- Unit economics draft in progress",
      asks: "- Need pricing decision",
      blockers: "- none",
    });
    const parsed = parseStandupBriefing("cfo", md);
    expect(parsed.slug).toBe("cfo");
    expect(parsed.status).toBe("at_risk");
    expect(parsed.phaseFocus).toBe("4");
    expect(parsed.progress).toMatch(/Unit economics/);
  });
});
