// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MissionCommandControls } from "./MissionCommandControls";

afterEach(cleanup);

function renderControls() {
  const actions = {
    onTalk: vi.fn(),
    onBriefMission: vi.fn(),
    onBriefSeat: vi.fn(),
    onBriefDigest: vi.fn(),
    onAssign: vi.fn(),
    onOutputs: vi.fn(),
    onLegacyVoice: vi.fn(),
    onRunNext: vi.fn(),
    onRuns: vi.fn(),
    onDigest: vi.fn(),
    onGraph: vi.fn(),
    onAlerts: vi.fn(),
    onRoutines: vi.fn(),
    onToggleTheater: vi.fn(),
    onToggleOps: vi.fn(),
    onRefresh: vi.fn(),
  };
  render(
    <div data-theme="jarvis">
      <MissionCommandControls
        {...actions}
        showTheater
        opsMode={false}
        alertCount={3}
        refreshing={false}
        lastUpdated="11:30:00 AM"
      />
    </div>,
  );
  return actions;
}

describe("MissionCommandControls", () => {
  it("keeps Run next dominant and workflow plus voice controls visible", async () => {
    const user = userEvent.setup();
    const actions = renderControls();

    const runNext = screen.getByRole("button", { name: "Run next" });
    expect(runNext.className).toContain("j-btn-primary");
    expect(screen.getByRole("button", { name: "Talk" }).getAttribute("data-active")).toBeNull();
    expect(screen.getByRole("group", { name: "Voice and intelligence" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Assign" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Outputs" })).toBeTruthy();

    await user.click(runNext);
    expect(actions.onRunNext).toHaveBeenCalledOnce();
  });

  it("places low-frequency callbacks in keyboard-accessible labeled menus", async () => {
    const user = userEvent.setup();
    const actions = renderControls();

    await user.click(screen.getByRole("button", { name: "Intelligence controls" }));
    const intelligence = screen.getByRole("menu", { name: "Intelligence controls" });
    await user.click(within(intelligence).getByRole("menuitem", { name: "Brief CEO" }));
    expect(actions.onBriefSeat).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: "Intelligence controls" }));
    const intelligenceAgain = screen.getByRole("menu", { name: "Intelligence controls" });
    await user.click(within(intelligenceAgain).getByRole("menuitem", { name: "Knowledge graph" }));
    expect(actions.onGraph).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: "System controls" }));
    const system = screen.getByRole("menu", { name: "System controls" });
    expect(within(system).getByRole("menuitemcheckbox", { name: "Theater" }).getAttribute("aria-checked")).toBe("true");
    expect(within(system).getByTestId("dropdown-check-indicator")).toBeTruthy();
    await user.click(within(system).getByRole("menuitemcheckbox", { name: "Theater" }));
    expect(actions.onToggleTheater).toHaveBeenCalledWith(false);
    await user.click(screen.getByRole("button", { name: "System controls" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Ops tables" }));
    expect(actions.onToggleOps).toHaveBeenCalledWith(true);
    await user.click(screen.getByRole("button", { name: "System controls" }));
    const reopened = screen.getByRole("menu", { name: "System controls" });
    await user.click(within(reopened).getByRole("menuitem", { name: "Refresh" }));
    expect(actions.onRefresh).toHaveBeenCalledOnce();
  });

  it("announces refresh and last-updated status", () => {
    renderControls();
    expect(screen.getByRole("status").textContent).toContain("Updated 11:30:00 AM");
  });

  it("gives both workspace checkbox items explicit accessible names", async () => {
    const user = userEvent.setup();
    renderControls();
    await user.click(screen.getByRole("button", { name: "System controls" }));

    const theater = screen.getByRole("menuitemcheckbox", { name: "Theater" });
    const ops = screen.getByRole("menuitemcheckbox", { name: "Ops tables" });
    expect(theater.getAttribute("aria-label")).toBe("Theater");
    expect(ops.getAttribute("aria-label")).toBe("Ops tables");
  });
});
