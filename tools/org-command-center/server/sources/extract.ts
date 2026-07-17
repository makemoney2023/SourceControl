import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import {
  ALLOWED_EXTENSIONS,
  MAX_SOURCE_BYTES,
  type ExtractResult,
} from "./types";

export { ALLOWED_EXTENSIONS, MAX_SOURCE_BYTES };
export type { ExtractResult, ExtractStatus } from "./types";

type ParserAdapter = (bytes: Buffer) => Promise<string>;

type ExtractAdapters = {
  pdf?: ParserAdapter;
  docx?: ParserAdapter;
};

const TEXT_EXTENSIONS = new Set(["md", "txt", "csv"]);
const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp"]);

let customAdapters: ExtractAdapters = {};
let defaultAdaptersPromise: Promise<ExtractAdapters> | null = null;

export function configureExtractAdapters(adapters: ExtractAdapters): void {
  customAdapters = { ...customAdapters, ...adapters };
}

export function resetExtractAdapters(): void {
  customAdapters = {};
  defaultAdaptersPromise = null;
}

function fileExtension(filename: string): string {
  const base = filename.split(/[/\\]/).pop() ?? filename;
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "";
  return base.slice(dot + 1).toLowerCase();
}

export function isAllowedExtension(filename: string): boolean {
  return ALLOWED_EXTENSIONS.has(fileExtension(filename));
}

function imageStubText(filename: string): string {
  return [
    `# Extract: ${filename}`,
    "",
    "This file is an image. OCR is not available in v1.",
    "Add a caption or summary in the venture **context note** so agents can use it.",
  ].join("\n");
}

function failedExtractText(filename: string, method: string, reason: string): string {
  return [
    `# Extract: ${filename}`,
    `**Method:** ${method}`,
    "**Status:** extract_failed",
    "",
    reason,
  ].join("\n");
}

async function getDefaultAdapters(): Promise<ExtractAdapters> {
  if (!defaultAdaptersPromise) {
    defaultAdaptersPromise = Promise.resolve({
      pdf: async (bytes: Buffer) => {
        const parser = new PDFParse({ data: bytes });
        try {
          const result = await parser.getText();
          return result.text ?? "";
        } finally {
          await parser.destroy();
        }
      },
      docx: async (bytes: Buffer) => {
        const result = await mammoth.extractRawText({ buffer: bytes });
        return result.value ?? "";
      },
    });
  }

  return defaultAdaptersPromise;
}

async function resolveAdapters(): Promise<Required<ExtractAdapters>> {
  const defaults = await getDefaultAdapters();
  return {
    pdf: customAdapters.pdf ?? defaults.pdf!,
    docx: customAdapters.docx ?? defaults.docx!,
  };
}

function finalizeResult(
  filename: string,
  method: string,
  text: string,
  warning?: string,
): ExtractResult {
  const trimmed = text.trim();
  if (!trimmed) {
    const emptyWarning = warning ?? "Extraction returned no text";
    return {
      text: failedExtractText(filename, method, emptyWarning),
      method,
      status: "extract_failed",
      warning: emptyWarning,
    };
  }

  return {
    text: trimmed,
    method,
    status: "ok",
    warning,
  };
}

function catchFailure(filename: string, method: string, err: unknown): ExtractResult {
  const message = err instanceof Error ? err.message : String(err);
  const warning = message || "Extraction failed";
  return {
    text: failedExtractText(filename, method, warning),
    method,
    status: "extract_failed",
    warning,
  };
}

export async function extractSourceText(filename: string, bytes: Buffer): Promise<ExtractResult> {
  const ext = fileExtension(filename);

  if (TEXT_EXTENSIONS.has(ext)) {
    return finalizeResult(filename, "utf8", bytes.toString("utf8"));
  }

  if (IMAGE_EXTENSIONS.has(ext)) {
    return {
      text: imageStubText(filename),
      method: "image_stub",
      status: "image_stub",
    };
  }

  const adapters = await resolveAdapters();

  if (ext === "pdf") {
    try {
      const text = await adapters.pdf(bytes);
      return finalizeResult(filename, "pdf-parse", text);
    } catch (err) {
      return catchFailure(filename, "pdf-parse", err);
    }
  }

  if (ext === "docx") {
    try {
      const text = await adapters.docx(bytes);
      return finalizeResult(filename, "mammoth", text);
    } catch (err) {
      return catchFailure(filename, "mammoth", err);
    }
  }

  const warning = `Unsupported extension: ${ext || "(none)"}`;
  return {
    text: failedExtractText(filename, "unsupported", warning),
    method: "unsupported",
    status: "extract_failed",
    warning,
  };
}
