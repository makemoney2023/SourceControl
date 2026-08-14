import { describe, expect, it } from "vitest";
import { collideSeatLabels } from "./label-collision";

const pos = new Map([
  ["ceo-strategist", { x: 0, y: 0, z: 0 }],
  ["cfo", { x: 1, y: 0, z: 0 }],
  ["analyst", { x: 2, y: 0, z: 0 }],
  ["blocked-ic", { x: 3, y: 0, z: 0 }],
]);

function projectAt(points: Record<string, { x: number; y: number } | null>) {
  return (world: { x: number; y: number; z: number }) => {
    const slug = [...pos.entries()].find(
      ([, p]) => p.x === world.x && p.y === world.y && p.z === world.z,
    )?.[0];
    if (!slug) return null;
    return points[slug] ?? null;
  };
}

const seats = [
  { slug: "ceo-strategist", title: "CEO / Strategist", level: "c-suite", status: "idle" },
  { slug: "cfo", title: "CFO", level: "manager", status: "idle" },
  { slug: "analyst", title: "Market Research Analyst", level: "ic", status: "idle" },
  { slug: "blocked-ic", title: "Video Producer", level: "ic", status: "blocked" },
];

describe("collideSeatLabels", () => {
  it("hides an idle IC that overlaps a manager", () => {
    const visible = collideSeatLabels({
      seats,
      positions: pos,
      project: projectAt({
        "ceo-strategist": { x: 0, y: 0 },
        cfo: { x: 100, y: 100 },
        analyst: { x: 110, y: 100 },
        "blocked-ic": { x: 400, y: 100 },
      }),
      cameraDistance: 12,
      selectedSlug: null,
      previewWakeSlug: null,
    });
    expect(visible.map((v) => v.slug)).toEqual(
      expect.arrayContaining(["ceo-strategist", "cfo", "blocked-ic"]),
    );
    expect(visible.map((v) => v.slug)).not.toContain("analyst");
  });

  it("keeps selected over preview when they overlap", () => {
    const visible = collideSeatLabels({
      seats,
      positions: pos,
      project: projectAt({
        "ceo-strategist": { x: 0, y: 0 },
        cfo: { x: 200, y: 200 },
        analyst: { x: 205, y: 200 },
        "blocked-ic": { x: 400, y: 100 },
      }),
      cameraDistance: 12,
      selectedSlug: "analyst",
      previewWakeSlug: "cfo",
    });
    expect(visible.map((v) => v.slug)).toContain("analyst");
    expect(visible.map((v) => v.slug)).not.toContain("cfo");
  });

  it("keeps a needs-you full title beyond distance 16", () => {
    const visible = collideSeatLabels({
      seats,
      positions: pos,
      project: projectAt({
        "ceo-strategist": { x: 0, y: 0 },
        cfo: { x: 80, y: 0 },
        analyst: { x: 160, y: 0 },
        "blocked-ic": { x: 240, y: 0 },
      }),
      cameraDistance: 17,
      selectedSlug: null,
      previewWakeSlug: null,
    });
    expect(visible.find((v) => v.slug === "blocked-ic")?.text).toBe("Video Producer");
    expect(visible.find((v) => v.slug === "cfo")?.text).toBe("CFO");
    expect(visible.find((v) => v.slug === "ceo-strategist")?.text).toBe("CEO");
  });

  it("never hides the CEO to a collision", () => {
    const visible = collideSeatLabels({
      seats,
      positions: pos,
      project: projectAt({
        "ceo-strategist": { x: 100, y: 100 },
        cfo: { x: 105, y: 100 },
        analyst: { x: 300, y: 0 },
        "blocked-ic": { x: 400, y: 0 },
      }),
      cameraDistance: 12,
      selectedSlug: null,
      previewWakeSlug: null,
    });
    expect(visible.map((v) => v.slug)).toContain("ceo-strategist");
    expect(visible.find((v) => v.slug === "ceo-strategist")?.text).toBe("CEO / Strategist");
  });

  it("drops seats whose projection is null", () => {
    const visible = collideSeatLabels({
      seats,
      positions: pos,
      project: projectAt({
        "ceo-strategist": { x: 0, y: 0 },
        cfo: null,
        analyst: { x: 80, y: 0 },
        "blocked-ic": { x: 160, y: 0 },
      }),
      cameraDistance: 12,
      selectedSlug: null,
      previewWakeSlug: null,
    });
    expect(visible.map((v) => v.slug)).not.toContain("cfo");
  });
});
