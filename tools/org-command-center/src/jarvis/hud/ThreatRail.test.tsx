// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThreatRail } from "./ThreatRail";

afterEach(cleanup);

describe("ThreatRail", () => {
  it("sorts deterministic priority and pulses the highest-priority threat", () => {
    const blocked = ["cmo", "cfo", "cto"].map((slug, index) => ({
      slug,
      phase: index === 2 ? 1 : 2,
      reason: "Blocked",
      reasons: ["Blocked"],
      managerSlug: "ceo-strategist",
      status: index === 0 ? "needs_input" : "blocked",
      handoffFilename: `${slug}.md`,
    }));
    const { container } = render(
      <ThreatRail
        blocked={blocked as never}
        selectedSlug={null}
        resolvingSlug={null}
        onSelect={vi.fn()}
        onResolve={vi.fn()}
      />,
    );

    const pulse = container.querySelector(".j-threat-pulse");
    expect(pulse?.textContent).toContain("cto");
    expect([...container.querySelectorAll(".j-threat-item")].map((node) => node.textContent)).toEqual([
      expect.stringContaining("cto"),
      expect.stringContaining("cfo"),
      expect.stringContaining("cmo"),
    ]);
  });

  it("routes needs_input seats through ANSWER instead of RESOLVE", () => {
    const onAnswer = vi.fn();
    const onResolve = vi.fn();
    const { container, getByText } = render(
      <ThreatRail
        blocked={
          [
            {
              slug: "cmo",
              phase: 2,
              reason: "Need brand voice?",
              reasons: ["Need brand voice?"],
              managerSlug: "ceo-strategist",
              status: "needs_input",
              handoffFilename: "cmo.md",
            },
          ] as never
        }
        selectedSlug={null}
        resolvingSlug={null}
        onSelect={vi.fn()}
        onResolve={onResolve}
        onAnswer={onAnswer}
      />,
    );
    expect(getByText("ANSWER")).toBeTruthy();
    const answerBtn = [...container.querySelectorAll("button.j-btn")].find((b) =>
      b.textContent?.includes("ANSWER"),
    );
    answerBtn?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onAnswer).toHaveBeenCalledWith("cmo");
    expect(onResolve).not.toHaveBeenCalled();
  });
});
