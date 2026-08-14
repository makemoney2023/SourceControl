import { describe, expect, it } from "vitest";
import { ceoBody, icBody, managerBody } from "./seat-materials";

describe("seat-materials", () => {
  it("exports three shared MeshStandardMaterial instances", async () => {
    const again = await import("./seat-materials");
    expect(ceoBody).toBe(again.ceoBody);
    expect(managerBody).toBe(again.managerBody);
    expect(icBody).toBe(again.icBody);
    expect(ceoBody.color.getHexString()).toBe("1a2228");
    expect(managerBody.color.getHexString()).toBe("1a2228");
    expect(icBody.color.getHexString()).toBe("1a2228");
    expect(ceoBody.roughness).toBe(0.4);
    expect(ceoBody.metalness).toBe(0.62);
    expect(managerBody.roughness).toBe(0.45);
    expect(managerBody.metalness).toBe(0.55);
    expect(icBody.roughness).toBe(0.5);
    expect(icBody.metalness).toBe(0.5);
    expect(ceoBody.envMapIntensity).toBe(0.35);
    expect(managerBody.envMapIntensity).toBe(0.35);
    expect(icBody.envMapIntensity).toBe(0.35);
  });
});
