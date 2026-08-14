// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
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
});
