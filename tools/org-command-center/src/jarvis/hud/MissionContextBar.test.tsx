// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MissionContextBar } from "./MissionContextBar";

afterEach(cleanup);

describe("MissionContextBar", () => {
  it("shows Glance slots and hides portfolio CRUD", () => {
    render(
      <div data-theme="jarvis">
        <MissionContextBar
          customerName="Acme"
          initiativeName="Web"
          phaseLabel="Phase 4 Research"
          ideaName="Virtual Company"
          statusLine="CFO: needs spend cap"
          commandSlot={<button type="button">Command deck</button>}
          controls={<button type="button">Run next</button>}
        />
      </div>,
    );
    expect(screen.getByText("Situation Room")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Virtual Company" })).toBeTruthy();
    expect(screen.getByText("CFO: needs spend cap")).toBeTruthy();
    expect(screen.queryByText("Add customer")).toBeNull();
    expect(screen.queryByText("Add initiative")).toBeNull();
    expect(screen.queryByText("Auto-spawn on queue")).toBeNull();
  });

  it("switches customer and initiative from the Glance identity row", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    const onSwitchCustomer = vi.fn();
    const onSwitchInitiative = vi.fn();
    render(
      <div data-theme="jarvis">
        <MissionContextBar
          customerName="Acme"
          initiativeName="Web"
          phaseLabel="Phase 4 Research"
          ideaName="Virtual Company"
          statusLine="Run research"
          customerSlug="acme"
          initiativeSlug="web"
          customerOptions={[
            { slug: "acme", name: "Acme" },
            { slug: "blacksage-kennels", name: "Blacksage Kennels" },
          ]}
          initiativeOptions={[
            { slug: "web", name: "Web" },
            { slug: "main", name: "main" },
          ]}
          onSwitchCustomer={onSwitchCustomer}
          onSwitchInitiative={onSwitchInitiative}
        />
      </div>,
    );
    await user.selectOptions(screen.getByLabelText("Customer"), "blacksage-kennels");
    await user.selectOptions(screen.getByLabelText("Initiative"), "main");
    expect(onSwitchCustomer).toHaveBeenCalledWith("blacksage-kennels");
    expect(onSwitchInitiative).toHaveBeenCalledWith("main");
    expect(screen.queryByText("Add customer")).toBeNull();
  });
});
