// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FirstRunTour } from "./FirstRunTour";

afterEach(() => {
  localStorage.removeItem("sr-tour-v1");
  cleanup();
});

describe("FirstRunTour", () => {
  it("shows step 1 when sr-tour-v1 is empty and Skip writes the key", async () => {
    localStorage.removeItem("sr-tour-v1");
    render(<FirstRunTour hasThreats={false} onDone={() => {}} />);
    expect(screen.getByText(/This table is the company/)).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Skip" }));
    expect(localStorage.getItem("sr-tour-v1")).toBe("1");
  });

  it("advances through four steps and last Next writes the key", async () => {
    const onDone = vi.fn();
    localStorage.removeItem("sr-tour-v1");
    render(<FirstRunTour hasThreats={false} onDone={onDone} />);

    expect(screen.getByText(/This table is the company/)).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(/Run next wakes the next seat/)).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(/Search any seat or task/)).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(/When someone is stuck, they show here/)).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(localStorage.getItem("sr-tour-v1")).toBe("1");
    expect(onDone).toHaveBeenCalledOnce();
    expect(screen.queryByText(/When someone is stuck/)).toBeNull();
  });

  it("does not show when sr-tour-v1 is already set", () => {
    localStorage.setItem("sr-tour-v1", "1");
    render(<FirstRunTour hasThreats={false} onDone={() => {}} />);
    expect(screen.queryByText(/This table is the company/)).toBeNull();
  });

  it("shows step 1 again after the tour key is cleared", () => {
    localStorage.setItem("sr-tour-v1", "1");
    const { rerender } = render(<FirstRunTour key="done" hasThreats={false} onDone={() => {}} />);
    expect(screen.queryByText(/This table is the company/)).toBeNull();

    localStorage.removeItem("sr-tour-v1");
    rerender(<FirstRunTour key="replay" hasThreats={false} onDone={() => {}} />);
    expect(screen.getByText(/This table is the company/)).toBeTruthy();
  });

  it("anchors step 4 to the threat rail when threats exist", async () => {
    localStorage.removeItem("sr-tour-v1");
    render(<FirstRunTour hasThreats onDone={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(
      screen.getByText(/When someone is stuck, they show here/).closest("[data-anchor]")?.getAttribute("data-anchor"),
    ).toBe("threats");
  });
});
