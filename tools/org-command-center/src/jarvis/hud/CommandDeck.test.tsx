// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { OrgTask } from "../../api/client";
import type { RosterEntry } from "../../lib/types";
import { CommandDeck } from "./CommandDeck";

const roster: RosterEntry[] = [
  {
    slug: "head-of-research",
    title: "Head of Research",
    reportsTo: "ceo-strategist",
    level: "manager",
    dept: "research",
  },
  {
    slug: "market-research-analyst",
    title: "Market Research Analyst",
    reportsTo: "head-of-research",
    level: "ic",
    dept: "research",
  },
];

const tasks: OrgTask[] = [
  {
    id: "run:research",
    title: "Review market evidence",
    status: "in_flight",
    slug: "head-of-research",
    runId: "run-42",
    tags: [],
    source: "dispatch/claimed",
  },
  {
    id: "phase:done",
    title: "Completed baseline",
    status: "done",
    tags: [],
    source: "tracker",
  },
  {
    id: "phase:completed",
    title: "Completed rollout",
    status: "completed",
    tags: [],
    source: "tracker",
  },
  {
    id: "phase:cancelled",
    title: "Cancelled rollout",
    status: "cancelled",
    tags: [],
    source: "tracker",
  },
  {
    id: "dispatch_claimed:completed.yaml",
    title: "Successful terminal dispatch",
    status: "done",
    slug: "head-of-research",
    tags: [],
    source: "dispatch/claimed",
  },
];

const originalResizeObserver = globalThis.ResizeObserver;
const originalScrollIntoView = Element.prototype.scrollIntoView;

beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView = vi.fn();
});

afterAll(() => {
  globalThis.ResizeObserver = originalResizeObserver;
  Element.prototype.scrollIntoView = originalScrollIntoView;
});

afterEach(cleanup);

function renderDeck(showTrigger = true) {
  const onSelectSeat = vi.fn();
  const onSelectRun = vi.fn();
  const onSelectTaskContext = vi.fn();

  render(
    <div data-theme="jarvis">
      <CommandDeck
        roster={roster}
        tasks={tasks}
        onSelectSeat={onSelectSeat}
        onSelectRun={onSelectRun}
        onSelectTaskContext={onSelectTaskContext}
        showTrigger={showTrigger}
      />
    </div>,
  );

  return { onSelectSeat, onSelectRun, onSelectTaskContext };
}

describe("CommandDeck", () => {
  it("opens from the platform keyboard shortcut", async () => {
    const user = userEvent.setup();
    renderDeck();

    await user.keyboard("{Meta>}k{/Meta}");

    expect(screen.getByRole("dialog", { name: "Command deck" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Search command deck" })).toBeTruthy();
    expect(
      screen.getByText(
        "Type to search seats and active tasks. Use arrow keys to navigate and Enter to select.",
      ),
    ).toBeTruthy();
  });

  it("opens from the keyboard shortcut when the floating trigger is hidden", async () => {
    const user = userEvent.setup();
    renderDeck(false);

    expect(screen.queryByRole("button", { name: /command deck/i })).toBeNull();
    await user.keyboard("{Meta>}k{/Meta}");

    expect(screen.getByRole("dialog", { name: "Command deck" })).toBeTruthy();
  });

  it("ignores repeated shortcut keydown events", () => {
    renderDeck();

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        repeat: true,
        bubbles: true,
      }),
    );

    expect(screen.queryByRole("dialog", { name: "Command deck" })).toBeNull();
  });

  it("opens only one deck when multiple instances are mounted", async () => {
    const user = userEvent.setup();
    const props = {
      roster,
      tasks,
      onSelectSeat: vi.fn(),
      onSelectRun: vi.fn(),
    };
    render(
      <div data-theme="jarvis">
        <CommandDeck {...props} />
        <CommandDeck {...props} />
      </div>,
    );

    await user.keyboard("{Meta>}k{/Meta}");

    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
  });

  it("searches grouped seat and active-task results", async () => {
    const user = userEvent.setup();
    renderDeck();
    await user.click(screen.getByRole("button", { name: /command deck/i }));

    expect(screen.getByText("Seats")).toBeTruthy();
    expect(screen.getByText("Active tasks")).toBeTruthy();
    expect(screen.queryByText("Completed baseline")).toBeNull();
    expect(screen.queryByText("Completed rollout")).toBeNull();
    expect(screen.queryByText("Cancelled rollout")).toBeNull();
    expect(screen.queryByText("Successful terminal dispatch")).toBeNull();

    await user.type(screen.getByRole("combobox", { name: "Search command deck" }), "analyst");

    expect(screen.getByRole("option", { name: /market research analyst/i })).toBeTruthy();
    expect(screen.queryByRole("option", { name: /head of research/i })).toBeNull();
    expect(screen.queryByRole("option", { name: /review market evidence/i })).toBeNull();
  });

  it("selects a seat and closes the deck", async () => {
    const user = userEvent.setup();
    const { onSelectSeat } = renderDeck();
    await user.click(screen.getByRole("button", { name: /command deck/i }));

    await user.click(screen.getByRole("option", { name: /head of research/i }));

    expect(onSelectSeat).toHaveBeenCalledWith("head-of-research");
    expect(screen.queryByRole("dialog", { name: "Command deck" })).toBeNull();
  });

  it("focuses the seat and opens the run for a run-backed task", async () => {
    const user = userEvent.setup();
    const { onSelectSeat, onSelectRun } = renderDeck();
    await user.click(screen.getByRole("button", { name: /command deck/i }));

    await user.click(screen.getByRole("option", { name: /review market evidence/i }));

    expect(onSelectSeat).toHaveBeenCalledWith("head-of-research");
    expect(onSelectRun).toHaveBeenCalledWith("run-42");
    expect(screen.queryByRole("dialog", { name: "Command deck" })).toBeNull();
  });

  it("resolves a run-only task to its run position before opening the run", async () => {
    const user = userEvent.setup();
    const onSelectSeat = vi.fn();
    const onSelectRun = vi.fn();
    render(
      <div data-theme="jarvis">
        <CommandDeck
          roster={roster}
          tasks={[
            {
              id: "run:only",
              title: "Inspect engineering run",
              status: "in_flight",
              runId: "run-only",
              tags: [],
              source: "dispatch/claimed",
            },
          ]}
          runs={[{ runId: "run-only", position: "cto" }]}
          onSelectSeat={onSelectSeat}
          onSelectRun={onSelectRun}
        />
      </div>,
    );
    await user.click(screen.getByRole("button", { name: /command deck/i }));

    await user.click(screen.getByRole("option", { name: /inspect engineering run/i }));

    expect(onSelectSeat).toHaveBeenCalledWith("cto");
    expect(onSelectRun).toHaveBeenCalledWith("run-only");
  });

  it("shows an empty state when no result matches", async () => {
    const user = userEvent.setup();
    renderDeck();
    await user.click(screen.getByRole("button", { name: /command deck/i }));

    await user.type(
      screen.getByRole("combobox", { name: "Search command deck" }),
      "no-such-command",
    );

    expect(screen.getByText("No seats or active tasks found.")).toBeTruthy();
  });
});
