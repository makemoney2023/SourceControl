// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { SeatReport } from "../seat-report";
import { SeatConsole } from "./SeatConsole";

afterEach(cleanup);

function report(partial?: Partial<SeatReport>): SeatReport {
  return {
    slug: "business-analyst",
    title: "Business Analyst",
    role: "ic",
    dept: "product",
    reportsTo: "head-of-product",
    pulse: "needs_input",
    summary: "Framing is ready; a few operator calls remain.",
    lastActivityAt: null,
    relevantPhases: ["2"],
    hardGate: false,
    scorecard: "",
    heartbeatPath: null,
    spend: null,
    operatorSummary: {
      plainEnglish: ["Framing doc is ready for review."],
      findings: ["Launch still needs operator content."],
      nextSteps: ["Confirm GO on the creative redo."],
    },
    businessBrief: {
      whatHappened: ["Framing doc is ready for review."],
      whyItMatters: ["Launch still needs operator content."],
      nextSteps: ["Confirm GO on the creative redo."],
      needsFromYou: ["Confirm GO on creative redo before Phase 14 content lock"],
      whatsStuck: [
        "12-month success criteria stay assumptions until you answer the maturity questions.",
      ],
    },
    decisions: [],
    openQuestions: ["Confirm GO on creative redo before Phase 14 content lock"],
    reportRollups: [],
    ownHandoffs: [],
    downward: [],
    escalations: [],
    upwardAsks: [],
    upwardBlockers: [],
    liveRuns: [],
    liveTasks: [],
    artifacts: [],
    modelQuality: [],
    nextActions: [],
    pinnedBriefing: null,
    ...partial,
  };
}

describe("SeatConsole", () => {
  it("reads as a business conversation, not raw asks/blockers dump", () => {
    render(
      <SeatConsole
        report={report()}
        onClose={vi.fn()}
        onAnswerQuestions={vi.fn()}
      />,
    );

    expect(screen.getByText("What happened")).toBeTruthy();
    expect(screen.getByText("Why it matters")).toBeTruthy();
    expect(screen.getByText("Next steps")).toBeTruthy();
    expect(screen.getByText("What we need from you")).toBeTruthy();
    expect(screen.getByText(/What'?s stuck/)).toBeTruthy();
    expect(screen.getByText(/Framing doc is ready/i)).toBeTruthy();
    expect(screen.getByText(/Confirm GO on creative redo/i)).toBeTruthy();
    expect(screen.queryByText(/Peer help needed/i)).toBeNull();
    expect(screen.queryByText(/business-analyst · ic/i)).toBeNull();
    expect(screen.getByRole("button", { name: /^Answer$/i })).toBeTruthy();
  });
});
