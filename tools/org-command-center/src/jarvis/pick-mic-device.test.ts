import { describe, expect, it } from "vitest";
import {
  audioCaptureOptionsForMic,
  isHeadsetMic,
  pickPreferredMicDevice,
} from "./pick-mic-device";

describe("audioCaptureOptionsForMic", () => {
  it("disables echoCancellation and noiseSuppression for Pixel Buds", () => {
    expect(audioCaptureOptionsForMic("buds", "C's Pixel Buds Pro 2")).toEqual({
      deviceId: "buds",
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: true,
    });
  });

  it("keeps AEC/NS for MacBook mic", () => {
    expect(audioCaptureOptionsForMic("mbp", "MacBook Pro Microphone")).toMatchObject({
      echoCancellation: true,
      noiseSuppression: true,
    });
  });

  it("detects headset labels", () => {
    expect(isHeadsetMic("AirPods Pro")).toBe(true);
    expect(isHeadsetMic("MacBook Pro Microphone")).toBe(false);
  });
});

describe("pickPreferredMicDevice", () => {
  it("prefers Pixel Buds over MacBook Pro Microphone", () => {
    const picked = pickPreferredMicDevice([
      { deviceId: "mbp", label: "MacBook Pro Microphone" },
      { deviceId: "buds", label: "C's Pixel Buds Pro 2" },
    ]);
    expect(picked?.deviceId).toBe("buds");
  });

  it("prefers AirPods when present", () => {
    const picked = pickPreferredMicDevice([
      { deviceId: "mbp", label: "MacBook Pro Microphone" },
      { deviceId: "ap", label: "Chris’s AirPods Pro" },
    ]);
    expect(picked?.deviceId).toBe("ap");
  });

  it("skips Teams virtual device when a real mic exists", () => {
    const picked = pickPreferredMicDevice([
      { deviceId: "teams", label: "Microsoft Teams Audio" },
      { deviceId: "usb", label: "USB Condenser Mic" },
    ]);
    expect(picked?.deviceId).toBe("usb");
  });

  it("falls back to first concrete device when nothing preferred", () => {
    const picked = pickPreferredMicDevice([
      { deviceId: "default", label: "Default" },
      { deviceId: "a", label: "MacBook Pro Microphone" },
    ]);
    expect(picked?.deviceId).toBe("a");
  });

  it("returns null for empty list", () => {
    expect(pickPreferredMicDevice([])).toBeNull();
  });
});
