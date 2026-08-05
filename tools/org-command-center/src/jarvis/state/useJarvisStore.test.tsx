// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let reduced = false;
const mediaListeners = new Set<(event: MediaQueryListEvent) => void>();
Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: () => ({
    matches: reduced,
    addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => mediaListeners.add(listener),
    removeEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => mediaListeners.delete(listener),
  }),
});

const { setJarvisState, useJarvisSelection, useJarvisStore } = await import("./useJarvisStore");

beforeEach(() => {
  reduced = false;
  setJarvisState({ selectedSlug: null, reducedMotion: false, drawerOpen: false });
});

afterEach(cleanup);

function SelectionHarness() {
  const { selectedSlug, selectSlug } = useJarvisSelection();

  return (
    <>
      <output aria-label="Selected seat">{selectedSlug ?? "none"}</output>
      <button type="button" onClick={() => selectSlug("head-of-research")}>
        Select research
      </button>
      <button type="button" onClick={() => selectSlug("cto")}>
        Select CTO
      </button>
    </>
  );
}

function MotionHarness() {
  const store = useJarvisStore();
  return <output aria-label="Reduced motion">{String(store.reducedMotion)}</output>;
}

describe("useJarvisSelection", () => {
  it("keeps the latest non-null seat without bouncing to the previous slug", async () => {
    const user = userEvent.setup();
    render(<SelectionHarness />);

    await user.click(screen.getByRole("button", { name: "Select research" }));
    await user.click(screen.getByRole("button", { name: "Select CTO" }));

    expect(screen.getByRole("status", { name: "Selected seat" }).textContent).toBe("cto");
  });
});

describe("reduced motion subscription", () => {
  it("reacts to matchMedia preference changes", () => {
    render(<MotionHarness />);
    expect(screen.getByRole("status", { name: "Reduced motion" }).textContent).toBe("false");
    reduced = true;
    act(() => {
      for (const listener of mediaListeners) listener({ matches: true } as MediaQueryListEvent);
    });
    expect(screen.getByRole("status", { name: "Reduced motion" }).textContent).toBe("true");
  });
});
