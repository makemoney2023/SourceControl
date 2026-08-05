import { describe, expect, it } from "vitest";
import { setOpsVisible, setTheaterVisible, toggleOpsTables, toggleTheater } from "./workspace-view-state";

describe("workspace view state", () => {
  it("keeps ops tables visible when theater is turned off", () => {
    expect(toggleTheater({ theater: true, opsTables: false })).toEqual({
      theater: false,
      opsTables: true,
    });
  });

  it("keeps theater visible when ops tables are turned off", () => {
    expect(toggleOpsTables({ theater: false, opsTables: true })).toEqual({
      theater: true,
      opsTables: false,
    });
  });

  it("preserves theater-first defaults when enabling ops tables", () => {
    expect(toggleOpsTables({ theater: true, opsTables: false })).toEqual({
      theater: true,
      opsTables: true,
    });
  });

  it("accepts explicit next values in both directions", () => {
    expect(setTheaterVisible({ theater: false, opsTables: true }, true)).toEqual({
      theater: true,
      opsTables: true,
    });
    expect(setOpsVisible({ theater: true, opsTables: false }, true)).toEqual({
      theater: true,
      opsTables: true,
    });
  });

  it("never permits both workspace views to be off", () => {
    expect(setTheaterVisible({ theater: true, opsTables: false }, false)).toEqual({
      theater: false,
      opsTables: true,
    });
    expect(setOpsVisible({ theater: false, opsTables: true }, false)).toEqual({
      theater: true,
      opsTables: false,
    });
  });
});
