import { afterEach, describe, expect, it } from "vitest";
import {
  createJarvisLLM,
  createOllamaLLM,
  createOmniVoiceTTS,
  createWhisperSTT,
  createXaiLLM,
  defaultJarvisLlmModel,
  defaultKokoroModel,
  defaultKokoroVoice,
  defaultOllamaModel,
  defaultXaiBaseUrl,
  patchOllamaChatBody,
  prepareOllamaFetchInit,
  resolveJarvisLlmBackend,
} from "./local-models";

const LLM_ENV = [
  "JARVIS_LLM_BACKEND",
  "JARVIS_LLM_MODEL",
  "XAI_API_KEY",
  "XAI_BASE_URL",
  "OLLAMA_BASE_URL",
  "OLLAMA_MODEL",
] as const;

describe("Jarvis LLM backend selection", () => {
  const prev: Partial<Record<(typeof LLM_ENV)[number], string | undefined>> = {};

  afterEach(() => {
    for (const key of LLM_ENV) {
      if (key in prev) {
        if (prev[key] === undefined) delete process.env[key];
        else process.env[key] = prev[key];
        delete prev[key];
      }
    }
  });

  function stash(key: (typeof LLM_ENV)[number]) {
    if (!(key in prev)) prev[key] = process.env[key];
  }

  it("defaults to xai when XAI_API_KEY is set", () => {
    stash("JARVIS_LLM_BACKEND");
    stash("XAI_API_KEY");
    delete process.env.JARVIS_LLM_BACKEND;
    process.env.XAI_API_KEY = "xai-test-key";
    expect(resolveJarvisLlmBackend()).toBe("xai");
  });

  it("defaults to ollama when XAI_API_KEY is missing", () => {
    stash("JARVIS_LLM_BACKEND");
    stash("XAI_API_KEY");
    delete process.env.JARVIS_LLM_BACKEND;
    delete process.env.XAI_API_KEY;
    expect(resolveJarvisLlmBackend()).toBe("ollama");
  });

  it("honors explicit JARVIS_LLM_BACKEND=ollama", () => {
    stash("JARVIS_LLM_BACKEND");
    stash("XAI_API_KEY");
    process.env.JARVIS_LLM_BACKEND = "ollama";
    process.env.XAI_API_KEY = "xai-test-key";
    expect(resolveJarvisLlmBackend()).toBe("ollama");
  });

  it("defaults xAI voice model to grok-4.5", () => {
    stash("JARVIS_LLM_MODEL");
    delete process.env.JARVIS_LLM_MODEL;
    expect(defaultJarvisLlmModel("xai")).toBe("grok-4.5");
  });

  it("createXaiLLM requires XAI_API_KEY", () => {
    stash("XAI_API_KEY");
    delete process.env.XAI_API_KEY;
    expect(() => createXaiLLM()).toThrow(/XAI_API_KEY/);
  });

  it("createJarvisLLM uses xAI when backend is xai", () => {
    stash("JARVIS_LLM_BACKEND");
    stash("XAI_API_KEY");
    process.env.JARVIS_LLM_BACKEND = "xai";
    process.env.XAI_API_KEY = "xai-test-key";
    expect(() => createJarvisLLM()).not.toThrow();
    expect(defaultXaiBaseUrl()).toMatch(/api\.x\.ai/);
  });
});

describe("local model adapters", () => {
  it("rejects non-localhost Ollama URL", () => {
    process.env.OLLAMA_BASE_URL = "https://api.openai.com/v1";
    expect(() => createOllamaLLM()).toThrow(/localhost/);
  });

  it("accepts localhost URLs", () => {
    process.env.OLLAMA_BASE_URL = "http://127.0.0.1:11434/v1";
    process.env.WHISPER_URL = "http://127.0.0.1:8090/v1";
    process.env.OMNIVOICE_URL = "http://127.0.0.1:3900";
    expect(() => createOllamaLLM()).not.toThrow();
    expect(() => createWhisperSTT()).not.toThrow();
    expect(() => createOmniVoiceTTS()).not.toThrow();
  });

  it("defaults Ollama model to qwen3 for tool calling", () => {
    delete process.env.OLLAMA_MODEL;
    expect(defaultOllamaModel()).toBe("qwen3");
  });

  it("defaults Kokoro male voice for Situation Room", () => {
    delete process.env.OMNIVOICE_MODEL;
    delete process.env.OMNIVOICE_VOICE;
    expect(defaultKokoroModel()).toBe("mlx-community/Kokoro-82M-bf16");
    expect(defaultKokoroVoice()).toBe("am_adam");
  });

  it("disables qwen3 thinking so spoken content is not empty", () => {
    const patched = JSON.parse(
      patchOllamaChatBody(
        JSON.stringify({
          model: "qwen3",
          messages: [{ role: "user", content: "hi" }],
          stream: true,
        }),
      ),
    );
    expect(patched.think).toBe(false);
    expect(patched.reasoning_effort).toBe("none");
    expect(patched.messages[0].content).toBe("hi");
  });

  it("leaves non-chat JSON bodies untouched", () => {
    const raw = JSON.stringify({ prompt: "hi" });
    expect(patchOllamaChatBody(raw)).toBe(raw);
  });

  it("rewrites Content-Length after patching the chat body", () => {
    const original = JSON.stringify({
      model: "qwen3",
      messages: [{ role: "user", content: "hi" }],
    });
    const init = prepareOllamaFetchInit({
      method: "POST",
      headers: { "Content-Length": String(Buffer.byteLength(original)) },
      body: original,
    });
    const patched = String(init.body);
    expect(patched.length).toBeGreaterThan(original.length);
    const headers = new Headers(init.headers);
    expect(headers.get("content-length")).toBe(String(Buffer.byteLength(patched)));
  });
});
