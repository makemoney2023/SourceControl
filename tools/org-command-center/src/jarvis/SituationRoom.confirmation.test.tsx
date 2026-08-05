// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./scene/OrgTheater", () => ({ OrgTheater: () => null }));
vi.mock("./state/useJarvisStore", () => ({ useJarvisStore: vi.fn() }));

import { BlockerConfirmationDialog } from "./SituationRoom";

afterEach(cleanup);

describe("BlockerConfirmationDialog", () => {
  it("Cancel requests cancellation for the exact token once", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(
      <BlockerConfirmationDialog
        request={{
          seat: "cto",
          token: "confirm-123",
          summary: "Resolve CTO blocker",
          reason: "This advances workflow state",
        }}
        loading={false}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Confirm blocker resolution" })).toBeTruthy();
    expect(screen.getByText("Resolve CTO blocker")).toBeTruthy();
    expect(screen.getByText("This advances workflow state")).toBeTruthy();
    const cancel = screen.getByRole("button", { name: "Cancel" });
    await user.dblClick(cancel);

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledWith("confirm-123");
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("Escape requests cancellation for the exact token once", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <BlockerConfirmationDialog
        request={{
          seat: "cto",
          token: "confirm-escape",
          summary: "Resolve CTO blocker",
        }}
        loading={false}
        onCancel={onCancel}
        onConfirm={vi.fn()}
      />,
    );

    await user.keyboard("{Escape}{Escape}");

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledWith("confirm-escape");
  });

  it("sends the token only after explicit confirmation", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(
      <BlockerConfirmationDialog
        request={{
          seat: "cto",
          token: "confirm-123",
          summary: "Resolve CTO blocker",
          reason: "This advances workflow state",
        }}
        loading={false}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onConfirm).toHaveBeenCalledWith("confirm-123");
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("surfaces cancellation failure without enabling confirmation", () => {
    render(
      <BlockerConfirmationDialog
        request={{
          seat: "cto",
          token: "confirm-123",
          summary: "Resolve CTO blocker",
        }}
        loading={false}
        cancelling
        cancellationError="Unable to cancel confirmation: network offline"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert").textContent).toContain("network offline");
    expect(screen.getByRole("button", { name: "Confirm" }).hasAttribute("disabled")).toBe(true);
  });
});
