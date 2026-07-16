/**
 * Wire local OpenAI-compatible endpoints (Ollama / Whisper / OmniVoice).
 * Never points at LiveKit Inference, Deepgram, Cartesia, or Cursor.
 */
import * as openai from "@livekit/agents-plugin-openai";

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

export function createOllamaLLM() {
  const baseURL = requireLocalUrl(
    "OLLAMA_BASE_URL",
    process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/v1",
  );
  const model = defaultOllamaModel();
  return new openai.LLM({
    model,
    baseURL,
    apiKey: process.env.OLLAMA_API_KEY || "ollama",
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
