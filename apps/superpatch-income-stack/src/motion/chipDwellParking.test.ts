import { describe, expect, it, vi } from "vitest";
import {
  parkDistantChipDwells,
  resumeNearbyChipDwells,
} from "./chipDwellParking";

function makeScene(id: string, lifecycle: string) {
  const scene = document.createElement("section");
  scene.id = id;
  scene.dataset.sceneLifecycle = lifecycle;
  const chip = document.createElement("div");
  chip.setAttribute("data-chip-item", "");
  scene.append(chip);
  const copy = document.createElement("div");
  copy.setAttribute("data-scene-copy", "");
  scene.append(copy);
  return scene;
}

function makeDwell(paused: boolean) {
  return {
    animation: {
      paused: vi.fn(() => paused),
      resume: vi.fn(),
      pause: vi.fn(),
    },
  };
}

describe("resumeNearbyChipDwells", () => {
  it("resumes jump-parked dwells once a scene is no longer distant", () => {
    const nearby = makeScene("scene-01-title", "active");
    nearby.dataset.chipDwellParked = "true";
    const distant = makeScene("scene-07-retail", "distant");
    distant.dataset.chipDwellParked = "true";
    const nearbyDwell = makeDwell(true);
    const distantDwell = makeDwell(true);
    const getDwell = (id: string) =>
      id === nearby.id ? nearbyDwell : distantDwell;

    const resumed = resumeNearbyChipDwells([nearby, distant], getDwell);

    expect(resumed).toBe(true);
    expect(nearby.dataset.chipDwellParked).toBeUndefined();
    expect(nearbyDwell.animation.resume).toHaveBeenCalledOnce();
    expect(distantDwell.animation.resume).not.toHaveBeenCalled();
    expect(nearbyDwell.animation.pause).not.toHaveBeenCalled();
    expect(distantDwell.animation.pause).not.toHaveBeenCalled();
  });

  it("does not resume scrub-paused dwells that were never jump-parked", () => {
    const nearby = makeScene("scene-01-title", "active");
    const nearbyDwell = makeDwell(true);

    expect(resumeNearbyChipDwells([nearby], () => nearbyDwell)).toBe(false);
    expect(nearbyDwell.animation.resume).not.toHaveBeenCalled();
  });
});

describe("parkDistantChipDwells", () => {
  it("pauses only distant dwells and marks them parked", () => {
    const nearby = makeScene("scene-01-title", "previous");
    const distant = makeScene("scene-07-retail", "distant");
    const nearbyDwell = makeDwell(true);
    const distantDwell = makeDwell(true);
    const getDwell = (id: string) =>
      id === nearby.id ? nearbyDwell : distantDwell;

    parkDistantChipDwells([nearby, distant], getDwell);

    expect(distantDwell.animation.pause).toHaveBeenCalledOnce();
    expect(distant.dataset.chipDwellParked).toBe("true");
    expect(nearbyDwell.animation.pause).not.toHaveBeenCalled();
    expect(nearbyDwell.animation.resume).not.toHaveBeenCalled();
  });
});
