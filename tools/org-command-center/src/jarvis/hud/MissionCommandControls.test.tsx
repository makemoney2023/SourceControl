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
    onPreviewWakeStart: vi.fn(),
    onPreviewWakeEnd: vi.fn(),
    onToggleFollowCam: vi.fn(),
    onReplayTour: vi.fn(),
    onWorkspace: vi.fn(),
  };
  render(
    <div data-theme="jarvis">
      <MissionCommandControls
        {...actions}
        showTheater
        opsMode={false}
        followCam
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
    expect(screen.queryByRole("button", { name: "Assign" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Outputs" })).toBeNull();

    await user.click(runNext);
    expect(actions.onRunNext).toHaveBeenCalledOnce();
  });

  it("previews the wake seat on Run next hover and focus", async () => {
    const user = userEvent.setup();
    const actions = renderControls();
    const runNext = screen.getByRole("button", { name: "Run next" });

    await user.hover(runNext);
    expect(actions.onPreviewWakeStart).toHaveBeenCalled();
    await user.unhover(runNext);
    expect(actions.onPreviewWakeEnd).toHaveBeenCalled();

    runNext.focus();
    expect(actions.onPreviewWakeStart).toHaveBeenCalled();
    runNext.blur();
    expect(actions.onPreviewWakeEnd).toHaveBeenCalled();
  });

  it("places low-frequency callbacks in keyboard-accessible labeled menus", async () => {
    const user = userEvent.setup();
    const actions = renderControls();

    await user.click(screen.getByRole("button", { name: "Intelligence controls" }));
    const intelligence = screen.getByRole("menu", { name: "Intelligence controls" });
    expect(within(intelligence).getByRole("menuitem", { name: "Assign" })).toBeTruthy();
    expect(within(intelligence).getByRole("menuitem", { name: "Outputs" })).toBeTruthy();
    await user.click(within(intelligence).getByRole("menuitem", { name: "Brief CEO" }));
    expect(actions.onBriefSeat).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: "Intelligence controls" }));
    const intelligenceAgain = screen.getByRole("menu", { name: "Intelligence controls" });
    await user.click(within(intelligenceAgain).getByRole("menuitem", { name: "Knowledge graph" }));
    expect(actions.onGraph).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: "System controls" }));
    const system = screen.getByRole("menu", { name: "System controls" });
    expect(within(system).getByRole("menuitem", { name: "Workspace…" })).toBeTruthy();
    expect(within(system).getByRole("menuitemcheckbox", { name: "Theater" }).getAttribute("aria-checked")).toBe("true");
    expect(within(system).getByRole("menuitemcheckbox", { name: "Follow running seats" }).getAttribute("aria-checked")).toBe("true");
    expect(within(system).getByRole("menuitem", { name: "Replay tour" })).toBeTruthy();
    expect(within(system).getAllByTestId("dropdown-check-indicator").length).toBeGreaterThan(0);
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
    const follow = screen.getByRole("menuitemcheckbox", { name: "Follow running seats" });
    expect(theater.getAttribute("aria-label")).toBe("Theater");
    expect(ops.getAttribute("aria-label")).toBe("Ops tables");
    expect(follow.getAttribute("aria-label")).toBe("Follow running seats");
  });
});
