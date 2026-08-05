// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { JarvisDrawer } from "./JarvisDrawer";

afterEach(cleanup);

function DrawerHarness() {
  const [open, setOpen] = useState(false);

  return (
    <div data-theme="jarvis">
      <button type="button" onClick={() => setOpen(true)}>
        Open outputs
      </button>
      {open ? (
        <JarvisDrawer open onOpenChange={setOpen} title="Outputs">
          <button type="button">Inspect artifact</button>
        </JarvisDrawer>
      ) : null}
    </div>
  );
}

describe("JarvisDrawer", () => {
  it("exposes an accessible dialog name", async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);

    await user.click(screen.getByRole("button", { name: "Open outputs" }));

    expect(screen.getByRole("dialog", { name: "Outputs" })).toBeTruthy();
  });

  it("closes with Escape and restores focus to the opener", async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);
    const opener = screen.getByRole("button", { name: "Open outputs" });

    await user.click(opener);
    expect(screen.getByRole("dialog", { name: "Outputs" })).toBeTruthy();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Outputs" })).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it("traps forward and backward tab navigation inside the dialog", async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);

    await user.click(screen.getByRole("button", { name: "Open outputs" }));
    const dialog = screen.getByRole("dialog", { name: "Outputs" });
    const close = screen.getByRole("button", { name: "Close" });
    const inspect = screen.getByRole("button", { name: "Inspect artifact" });

    inspect.focus();
    await user.tab();
    expect(document.activeElement).toBe(close);
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(inspect);
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("closes from the backdrop and restores focus to the opener", async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);
    const opener = screen.getByRole("button", { name: "Open outputs" });

    await user.click(opener);
    expect(screen.getByRole("dialog", { name: "Outputs" })).toBeTruthy();
    const backdrop = document.querySelector('[data-slot="dialog-overlay"]');
    expect(backdrop).toBeInstanceOf(HTMLElement);

    await user.click(backdrop as HTMLElement);

    expect(screen.queryByRole("dialog", { name: "Outputs" })).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});
