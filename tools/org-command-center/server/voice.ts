import { config } from "dotenv";
import { resolve } from "node:path";
import { resolveRepoRoot } from "./paths";

config({ path: resolve(resolveRepoRoot(), ".env.local") });

export function omnivoiceBase(): string {
  return (process.env.OMNIVOICE_URL || "http://127.0.0.1:3900").replace(/\/$/, "");
}

export function assertOmnivoiceUrl(url: string) {
  const u = new URL(url);
  const host = u.hostname;
  if (host !== "127.0.0.1" && host !== "localhost") {
    throw new Error("OMNIVOICE_URL host must be localhost or 127.0.0.1");
  }
  if (u.port && u.port !== "3900" && u.port !== "") {
    // allow default empty when protocol implies — still require 3900 when set
    if (u.port !== "3900") throw new Error("OMNIVOICE_URL port must be 3900");
  }
}

export async function omnivoiceHealth(): Promise<{ ok: boolean; detail: string }> {
  const base = omnivoiceBase();
  try {
    assertOmnivoiceUrl(base);
    const res = await fetch(`${base}/v1/audio/voices`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { ok: false, detail: `HTTP ${res.status}` };
    return { ok: true, detail: base };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : String(e) };
  }
}

export async function omnivoiceSpeak(text: string): Promise<ArrayBuffer> {
  const base = omnivoiceBase();
  assertOmnivoiceUrl(base);
  const body = {
    model: process.env.OMNIVOICE_MODEL || "mlx-audio",
    voice: process.env.OMNIVOICE_VOICE || "af_sky",
    input: text,
    response_format: "wav",
    speed: Number(process.env.OMNIVOICE_SPEED || "0.9"),
  };
  const res = await fetch(`${base}/v1/audio/speech`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`OmniVoice speak failed: ${res.status}`);
  return res.arrayBuffer();
}
