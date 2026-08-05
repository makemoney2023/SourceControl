export type PreviewKind =
  | "text"
  | "image"
  | "video"
  | "pdf"
  | "docx"
  | "xlsx"
  | "download"
  | "dir";

const TEXT_EXT = new Set([
  "md",
  "txt",
  "csv",
  "json",
  "html",
  "htm",
  "css",
  "js",
  "ts",
  "tsx",
  "jsx",
  "yml",
  "yaml",
  "svg",
]);

const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "webp", "gif", "bmp", "ico"]);
const VIDEO_EXT = new Set(["mp4", "webm", "mov", "m4v", "ogg"]);

export function extensionOf(path: string): string {
  const base = path.split(/[/\\]/).pop() ?? "";
  const i = base.lastIndexOf(".");
  if (i < 0) return "";
  return base.slice(i + 1).toLowerCase();
}

export function previewKindForPath(path: string): PreviewKind {
  const ext = extensionOf(path);
  if (!ext) return "download";
  if (IMAGE_EXT.has(ext)) return "image";
  if (VIDEO_EXT.has(ext)) return "video";
  if (ext === "pdf") return "pdf";
  if (ext === "docx" || ext === "doc") return "docx";
  if (ext === "xlsx" || ext === "xls") return "xlsx";
  if (TEXT_EXT.has(ext)) return "text";
  return "download";
}

export function mimeForPath(path: string): string {
  const ext = extensionOf(path);
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    html: "text/html; charset=utf-8",
    htm: "text/html; charset=utf-8",
    md: "text/markdown; charset=utf-8",
    txt: "text/plain; charset=utf-8",
    csv: "text/csv; charset=utf-8",
    json: "application/json; charset=utf-8",
  };
  return map[ext] ?? "application/octet-stream";
}

/** True when path looks like a shippable Layer B / production asset (not craft markdown). */
export function isProductionAssetPath(path: string): boolean {
  const p = path.replace(/\\/g, "/");
  if (
    /\/HANDOFFS\//i.test(p) ||
    /\/MEMORY\//i.test(p) ||
    /\/DISPATCH\//i.test(p) ||
    /\/REVIEW\//i.test(p) ||
    /\/BRIEFINGS\//i.test(p) ||
    /RUNBOOK-TRACKER\.md$/i.test(p) ||
    /\/SOURCES\//i.test(p)
  ) {
    return false;
  }
  if (
    /(^|\/)(html|apps|images|video|office|production|design-system)(\/|$)/i.test(
      p,
    )
  ) {
    return true;
  }
  const ext = extensionOf(p);
  if (
    [
      "html",
      "htm",
      "pdf",
      "docx",
      "doc",
      "xlsx",
      "xls",
      "png",
      "jpg",
      "jpeg",
      "webp",
      "gif",
      "svg",
      "mp4",
      "webm",
      "mov",
    ].includes(ext)
  ) {
    return true;
  }
  return false;
}
