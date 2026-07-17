/** Prefer Bluetooth / headset mics over built-in MacBook / virtual sinks. */

const PREFER =
  /pixel\s*buds|airpods|bluetooth|headset|buds\s*pro|galaxy\s*buds|sony\s*wf|bose|jabra|beats/i;
const AVOID = /macbook|built-?in|teams\s*audio|zoom|virtual|aggregate|multi-output/i;

export type MicDevice = { deviceId: string; label: string };

/** Browser AEC/NS often silences Bluetooth headsets that already process audio. */
export function isHeadsetMic(label: string): boolean {
  return PREFER.test(label);
}

export type MicCaptureOptions = {
  deviceId?: string;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
};

export function audioCaptureOptionsForMic(
  deviceId: string | undefined,
  label: string,
): MicCaptureOptions {
  const headset = isHeadsetMic(label);
  return {
    ...(deviceId ? { deviceId } : {}),
    // Headset mics: leave processing off so WebRTC doesn't gate the signal to silence.
    echoCancellation: !headset,
    noiseSuppression: !headset,
    autoGainControl: true,
  };
}

export function pickPreferredMicDevice(devices: MicDevice[]): MicDevice | null {
  const inputs = devices.filter((d) => d.deviceId && d.deviceId !== "default");
  if (inputs.length === 0) {
    return devices.find((d) => d.deviceId) ?? null;
  }

  const preferred = inputs.find((d) => PREFER.test(d.label));
  if (preferred) return preferred;

  const nonAvoid = inputs.find((d) => !AVOID.test(d.label));
  if (nonAvoid) return nonAvoid;

  return inputs[0] ?? null;
}

export async function ensureMicPermission(): Promise<void> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Microphone API unavailable in this browser");
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  for (const t of stream.getTracks()) t.stop();
}

export async function listAudioInputs(): Promise<MicDevice[]> {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  const all = await navigator.mediaDevices.enumerateDevices();
  return all
    .filter((d) => d.kind === "audioinput")
    .map((d) => ({ deviceId: d.deviceId, label: d.label || d.deviceId }));
}
