import { describe, expect, it } from "vitest";
import {
  createOllamaLLM,
  createOmniVoiceTTS,
  createWhisperSTT,
  defaultKokoroModel,
  defaultKokoroVoice,
  defaultOllamaModel,
} from "./local-models";

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
});
