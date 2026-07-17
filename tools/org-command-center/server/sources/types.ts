export type ExtractStatus = "ok" | "extract_failed" | "image_stub";

export type ExtractResult = {
  text: string;
  method: string;
  status: ExtractStatus;
  warning?: string;
};

export const MAX_SOURCE_BYTES = 20 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = new Set([
  "md",
  "txt",
  "csv",
  "pdf",
  "docx",
  "png",
  "jpg",
  "jpeg",
  "webp",
]);
