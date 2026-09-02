import { describe, expect, it } from "vitest";
import { glassVerifyState, streamsProgress, wireGlassFocus } from "./glassFocus";

describe("glassVerifyState", () => {
  it("renders a compact painted-state signature", () => {
    expect(glassVerifyState(3, 0.418, "00c-ceo")).toBe("seg:3|p:0.42|focus:00c-ceo");
    expect(glassVerifyState(0, 0, null)).toBe("seg:0|p:0.00|focus:none");
  });
});

describe("streamsProgress", () => {
  it("is 0 before the streams legs and 1 after them", () => {
    expect(streamsProgress(6, 0.9, 7, 8)).toBe(0);
    expect(streamsProgress(9, 0.2, 7, 8)).toBe(1);
  });
  it("ramps linearly across the streams legs", () => {
    expect(streamsProgress(7, 0, 7, 8)).toBe(0);
    expect(streamsProgress(8, 0, 7, 8)).toBeCloseTo(0.5, 5);
    expect(streamsProgress(8, 1, 7, 8)).toBe(1);
  });
});

describe("wireGlassFocus", () => {
  it("marks a glass figure focused on focusin and clears on focusout", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div data-city-glass-layer>
        <figure class="city-glass" data-glass="00c-ceo" data-leg="3" tabindex="0"></figure>
        <figure class="city-glass" data-glass="02-world" data-leg="4" tabindex="0"></figure>
      </div>`;
    document.body.appendChild(root);
    const unwire = wireGlassFocus(root, { startLeg: 7, endLeg: 8 });
    const layer = root.querySelector<HTMLElement>("[data-city-glass-layer]")!;
    const fig = root.querySelector<HTMLElement>('figure[data-glass="00c-ceo"]')!;

    fig.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    expect(layer.getAttribute("data-city-focus")).toBe("00c-ceo");
    expect(fig.getAttribute("data-focused")).toBe("true");

    fig.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    expect(layer.getAttribute("data-city-focus")).toBeNull();
    expect(fig.getAttribute("data-focused")).toBe("false");

    unwire();
    root.remove();
  });
});
