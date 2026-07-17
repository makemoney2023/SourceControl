/**
 * Wire Jarvis LLM (xAI Grok or local Ollama) + local STT/TTS
 * (Whisper / OmniVoice). STT/TTS stay localhost-only.
 */
import * as openai from "@livekit/agents-plugin-openai";
import OpenAI from "openai";

export type JarvisLlmBackend = "xai" | "ollama";

function requireLocalUrl(label: string, url: string) {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    throw new Error(`${label} invalid URL: ${url}`);
  }
  if (u.hostname !== "127.0.0.1" && u.hostname !== "localhost") {
    throw new Error(`${label} must be localhost (got ${u.hostname}) — $0 local stack only`);
  }
  return url.replace(/\/$/, "");
}

export function defaultOllamaModel() {
  return process.env.OLLAMA_MODEL || "qwen3";
}

export function defaultXaiBaseUrl() {
  return (process.env.XAI_BASE_URL || "https://api.x.ai/v1").replace(/\/$/, "");
}

/** Prefer xAI when a key is present; override with JARVIS_LLM_BACKEND. */
export function resolveJarvisLlmBackend(): JarvisLlmBackend {
  const forced = (process.env.JARVIS_LLM_BACKEND || "").trim().toLowerCase();
  if (forced === "xai" || forced === "ollama") return forced;
  return process.env.XAI_API_KEY?.trim() ? "xai" : "ollama";
}

export function defaultJarvisLlmModel(backend: JarvisLlmBackend = resolveJarvisLlmBackend()) {
  const override = process.env.JARVIS_LLM_MODEL?.trim();
  if (override) return override;
  return backend === "xai" ? "grok-4.5" : defaultOllamaModel();
}

export function createXaiLLM() {
  const apiKey = process.env.XAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("XAI_API_KEY missing — set it in repo .env.local for Grok voice");
  }
  const baseURL = defaultXaiBaseUrl();
  const model = defaultJarvisLlmModel("xai");
  const client = new OpenAI({ baseURL, apiKey });
  return new openai.LLM({
    model,
    baseURL,
    apiKey,
    client,
  });
}

/** Voice brain: xAI Grok when configured, else local Ollama. */
export function createJarvisLLM() {
  return resolveJarvisLlmBackend() === "xai" ? createXaiLLM() : createOllamaLLM();
}

/**
 * Qwen3 defaults to thinking mode: OpenAI-compat returns empty `content` and
 * fills `reasoning`. LiveKit's OpenAI plugin only speaks `content`, so voice
 * goes silent. Force thinking off for chat-completion bodies.
 */
export function patchOllamaChatBody(body: string): string {
  try {
    const parsed = JSON.parse(body) as Record<string, unknown>;
    if (!Array.isArray(parsed.messages)) return body;
    if (parsed.think === undefined) parsed.think = false;
    if (parsed.reasoning_effort === undefined) parsed.reasoning_effort = "none";
    return JSON.stringify(parsed);
  } catch {
    return body;
  }
}

/** Patch chat JSON and keep Content-Length in sync (undici rejects mismatches). */
export function prepareOllamaFetchInit(init: RequestInit): RequestInit {
  if (!init.body || typeof init.body !== "string") return init;
  const body = patchOllamaChatBody(init.body);
  if (body === init.body) return init;
  const headers = new Headers(init.headers);
  headers.set("Content-Length", String(Buffer.byteLength(body)));
  return { ...init, body, headers };
}

function ollamaFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (!init) return fetch(input);
  return fetch(input, prepareOllamaFetchInit(init));
}

export function createOllamaLLM() {
  const baseURL = requireLocalUrl(
    "OLLAMA_BASE_URL",
    process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/v1",
  );
  const model = defaultJarvisLlmModel("ollama");
  const apiKey = process.env.OLLAMA_API_KEY || "ollama";
  const client = new OpenAI({
    baseURL,
    apiKey,
    fetch: ollamaFetch as typeof fetch,
  });
  return new openai.LLM({
    model,
    baseURL,
    apiKey,
    client,
  });
}

export function createWhisperSTT() {
  const baseURL = requireLocalUrl(
    "WHISPER_URL",
    process.env.WHISPER_URL || "http://127.0.0.1:8090/v1",
  );
  return new openai.STT({
    model: process.env.WHISPER_MODEL || "whisper-1",
    baseURL,
    apiKey: process.env.WHISPER_API_KEY || "local",
  });
}

/** Kokoro via mlx-audio OpenAI-compatible server (primary TTS). */
export function defaultKokoroModel() {
  return process.env.OMNIVOICE_MODEL || "mlx-community/Kokoro-82M-bf16";
}

export function defaultKokoroVoice() {
  return process.env.OMNIVOICE_VOICE || "am_adam";
}

export function createOmniVoiceTTS() {
  const baseURL = requireLocalUrl(
    "OMNIVOICE_URL",
    process.env.OMNIVOICE_URL || "http://127.0.0.1:3900",
  );
  // mlx-audio (Kokoro) or say-tts fallback — same OpenAI-compatible path
  return new openai.TTS({
    model: defaultKokoroModel(),
    voice: defaultKokoroVoice(),
    baseURL: `${baseURL}/v1`,
    apiKey: process.env.OMNIVOICE_API_KEY || "local",
  });
}
