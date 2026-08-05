// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  fetchFile: vi.fn(),
  fetchProductionScorecard: vi.fn(),
  fetchReviewInbox: vi.fn(),
}));
vi.mock("../../api/client", () => api);
vi.mock("../artifacts", () => ({ indexArtifacts: () => [] }));

import { OutputsDashboard } from "./OutputsDashboard";

const snapshot = {
  businessIdeaRel: "docs/project",
  tracker: { phases: [] },
  handoffs: [],
} as never;

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
});

function setup(
  path: string | null = "docs/project/a.md",
  options: {
    scorecardError?: Error;
    fileError?: Error;
    inboxError?: Error;
    inboxItems?: unknown[];
    inboxPromise?: Promise<{ items: unknown[] }>;
  } = {},
) {
  if (options.scorecardError) api.fetchProductionScorecard.mockRejectedValueOnce(options.scorecardError);
  else api.fetchProductionScorecard.mockResolvedValue({ venture: "Demo", phases: [] });
  if (options.inboxPromise) api.fetchReviewInbox.mockReturnValueOnce(options.inboxPromise);
  else if (options.inboxError) api.fetchReviewInbox.mockRejectedValueOnce(options.inboxError);
  else {
    api.fetchReviewInbox.mockResolvedValue({
      items: options.inboxItems ?? [
        { path: "same.md", status: "pending_review", position: "cto" },
        { path: "same.md", status: "pending_review", position: "cto" },
      ],
    });
  }
  if (options.fileError) api.fetchFile.mockRejectedValueOnce(options.fileError);
  else api.fetchFile.mockResolvedValue({ type: "file", content: "preview" });
  return render(<OutputsDashboard snapshot={snapshot} selectedPath={path} onSelect={vi.fn()} />);
}

describe("OutputsDashboard async states", () => {
  it("renders loading then preview and deduplicates review entries", async () => {
    setup();
    expect(screen.getByText(/Loading production scorecard/)).toBeTruthy();
    expect(screen.getByText(/Loading preview/)).toBeTruthy();
    await screen.findByText("preview");
    expect(screen.getAllByText(/same\.md/)).toHaveLength(1);
  });

  it("expires copy feedback and resets it when path changes", async () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    const view = setup("a.md");
    await act(async () => { await Promise.resolve(); });
    fireEvent.click(screen.getByRole("button", { name: "Copy path" }));
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByRole("status").textContent).toContain("Path copied");
    view.rerender(<OutputsDashboard snapshot={snapshot} selectedPath="b.md" onSelect={vi.fn()} />);
    expect(screen.queryByText("Path copied")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Copy path" }));
    await act(async () => { await Promise.resolve(); });
    act(() => vi.advanceTimersByTime(2200));
    expect(screen.queryByText("Path copied")).toBeNull();
  });

  it("ignores obsolete clipboard completion after the path changes", async () => {
    let resolveCopy!: () => void;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn(() => new Promise<void>((resolve) => { resolveCopy = resolve; })) },
    });
    const view = setup("a.md");
    fireEvent.click(screen.getByRole("button", { name: "Copy path" }));
    view.rerender(<OutputsDashboard snapshot={snapshot} selectedPath="b.md" onSelect={vi.fn()} />);
    resolveCopy();
    await Promise.resolve();
    expect(screen.queryByText("Path copied")).toBeNull();
  });

  it("shows preview rejection as an alert and recovers on a later selection", async () => {
    const view = setup("bad.md", { fileError: new Error("Preview exploded") });
    expect((await screen.findByRole("alert")).textContent).toContain("Preview exploded");
    api.fetchFile.mockResolvedValueOnce({ type: "file", content: "recovered preview" });
    view.rerender(<OutputsDashboard snapshot={snapshot} selectedPath="good.md" onSelect={vi.fn()} />);
    expect(await screen.findByText("recovered preview")).toBeTruthy();
    expect(screen.queryByText("Preview exploded")).toBeNull();
  });

  it("shows scorecard rejection as an alert and recovers on retry", async () => {
    setup(null, { scorecardError: new Error("Scorecard offline") });
    expect((await screen.findByRole("alert")).textContent).toContain("Production scorecard unavailable");
    api.fetchProductionScorecard.mockResolvedValueOnce({ venture: "Recovered", phases: [] });
    fireEvent.click(screen.getByRole("button", { name: "Retry scorecard" }));
    expect(await screen.findByText(/Production completeness — Recovered/)).toBeTruthy();
  });

  it("shows review inbox loading without claiming the inbox is clear", () => {
    setup(null, { inboxPromise: new Promise(() => undefined) });

    expect(screen.getByRole("status").textContent).toContain("Loading review inbox");
    expect(screen.queryByText(/Inbox clear/)).toBeNull();
  });

  it("shows review inbox rejection as an alert and recovers on retry", async () => {
    setup(null, { inboxError: new Error("Review service offline") });

    const alert = await screen.findByRole("alert", { name: "Review inbox error" });
    expect(alert.textContent).toContain("Review service offline");
    expect(screen.queryByText(/Inbox clear/)).toBeNull();

    api.fetchReviewInbox.mockResolvedValueOnce({ items: [] });
    fireEvent.click(screen.getByRole("button", { name: "Retry review inbox" }));

    expect(await screen.findByText("Inbox clear — nothing pending review.")).toBeTruthy();
  });

  it("shows inbox clear only after a successful empty response", async () => {
    setup(null, { inboxItems: [] });

    expect(screen.queryByText(/Inbox clear/)).toBeNull();
    expect(await screen.findByText("Inbox clear — nothing pending review.")).toBeTruthy();
  });

  it("shows clipboard rejection as an alert and recovers on retry", async () => {
    const writeText = vi.fn()
      .mockRejectedValueOnce(new Error("denied"))
      .mockResolvedValueOnce(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    setup("copy.md");
    fireEvent.click(screen.getByRole("button", { name: "Copy path" }));
    expect((await screen.findByRole("alert")).textContent).toContain("Copy failed");
    fireEvent.click(screen.getByRole("button", { name: "Copy path" }));
    expect((await screen.findByRole("status")).textContent).toContain("Path copied");
  });
});
