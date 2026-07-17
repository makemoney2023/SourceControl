import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, join } from "node:path";
import { randomBytes } from "node:crypto";
import {
  assertWritable,
  businessIdeaFile,
  memoryDir,
  memoryRel,
  sourcesDir,
} from "../paths";
import {
  readOperatorNote,
  seedContextMd,
  writeOperatorNote,
  writeSourcesDigest,
} from "./context-md";
import {
  extractSourceText,
  isAllowedExtension,
  MAX_SOURCE_BYTES,
} from "./extract";
import type { ExtractStatus } from "./types";

export type SourceRecord = {
  id: string;
  title: string;
  ext: string;
  originalRel: string;
  extractRel: string | "self";
  status: ExtractStatus;
  uploadedAt: string;
};

export class SourceStoreError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "SourceStoreError";
    this.code = code;
  }
}

const TEXT_SELF_EXTENSIONS = new Set(["md", "txt", "csv"]);
const DIGEST_LIMIT = 20;
const SUMMARY_CHARS = 200;
const INDEX_JSON_FENCE = /```json\s*([\s\S]*?)```/;

function fileExtension(filename: string): string {
  const base = basename(filename);
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "";
  return base.slice(dot + 1).toLowerCase();
}

function displayTitle(filename: string): string {
  const base = basename(filename);
  const dot = base.lastIndexOf(".");
  return dot > 0 ? base.slice(0, dot) : base;
}

function safeBasename(filename: string): string {
  const title = displayTitle(filename);
  const sanitized = title.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return sanitized || "file";
}

function makeSourceId(): string {
  return new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function uniqueSourceId(existing: Set<string>): string {
  let id = makeSourceId();
  while (existing.has(id)) {
    id = `${makeSourceId()}-${randomBytes(2).toString("hex")}`;
  }
  return id;
}

function contextMdAbs(repoRoot: string): string {
  return join(memoryDir(repoRoot), "context.md");
}

function contextMdRel(repoRoot: string): string {
  return `${memoryRel(repoRoot)}/context.md`;
}

function indexMdAbs(repoRoot: string): string {
  return join(sourcesDir(repoRoot), "INDEX.md");
}

function indexMdRel(repoRoot: string): string {
  return businessIdeaFile(repoRoot, "SOURCES/INDEX.md");
}

function seedIndexMd(): string {
  return "# Sources index\n\n```json\n[]\n```\n";
}

function ensureSourceLayout(repoRoot: string): void {
  mkdirSync(memoryDir(repoRoot), { recursive: true });
  mkdirSync(sourcesDir(repoRoot), { recursive: true });
  const ctxPath = contextMdAbs(repoRoot);
  if (!existsSync(ctxPath)) {
    writeFileSync(ctxPath, seedContextMd(), "utf8");
  }
  const idxPath = indexMdAbs(repoRoot);
  if (!existsSync(idxPath)) {
    writeFileSync(idxPath, seedIndexMd(), "utf8");
  }
}

export function parseIndexRecords(md: string): SourceRecord[] {
  const match = md.match(INDEX_JSON_FENCE);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[1].trim()) as SourceRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeIndexRecords(records: SourceRecord[]): string {
  return `# Sources index\n\n\`\`\`json\n${JSON.stringify(records, null, 2)}\n\`\`\`\n`;
}

function readIndexRecords(repoRoot: string): SourceRecord[] {
  ensureSourceLayout(repoRoot);
  const md = readFileSync(indexMdAbs(repoRoot), "utf8");
  return parseIndexRecords(md);
}

function writeIndexRecordsToDisk(repoRoot: string, records: SourceRecord[]): void {
  const rel = indexMdRel(repoRoot);
  const abs = assertWritable(repoRoot, rel);
  writeFileSync(abs, writeIndexRecords(records), "utf8");
}

function buildExtractFileContent(
  originalName: string,
  id: string,
  method: string,
  status: ExtractStatus,
  body: string,
): string {
  return `# Extract: ${originalName}
**Source id:** ${id}
**Method:** ${method}
**Status:** ${status}

${body.trim()}
`;
}

function extractSummary(repoRoot: string, record: SourceRecord): string {
  const rel =
    record.extractRel === "self" ? record.originalRel : record.extractRel;
  const abs = join(repoRoot, rel);
  if (!existsSync(abs)) return record.title;
  const raw = readFileSync(abs, "utf8");
  const body = raw.replace(/^# Extract:[\s\S]*?\n\n/m, "").trim();
  const text = body || raw.trim();
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= SUMMARY_CHARS) return oneLine || record.title;
  return `${oneLine.slice(0, SUMMARY_CHARS).trim()}…`;
}

function digestLine(record: SourceRecord, summary: string): string {
  return `- \`${record.id}\` ${record.title} — ${summary}`;
}

function refreshSourcesDigest(repoRoot: string, records: SourceRecord[]): void {
  const sorted = [...records].sort(
    (a, b) => Date.parse(b.uploadedAt) - Date.parse(a.uploadedAt),
  );
  const lines = sorted.slice(0, DIGEST_LIMIT).map((record) =>
    digestLine(record, extractSummary(repoRoot, record)),
  );

  const ctxPath = contextMdAbs(repoRoot);
  const current = existsSync(ctxPath)
    ? readFileSync(ctxPath, "utf8")
    : seedContextMd();
  const updated = writeSourcesDigest(current, lines);
  const rel = contextMdRel(repoRoot);
  writeFileSync(assertWritable(repoRoot, rel), updated, "utf8");
}

export function listSources(repoRoot: string): {
  sources: SourceRecord[];
  contextNote: string;
} {
  ensureSourceLayout(repoRoot);
  const sources = readIndexRecords(repoRoot).sort(
    (a, b) => Date.parse(b.uploadedAt) - Date.parse(a.uploadedAt),
  );
  const ctxPath = contextMdAbs(repoRoot);
  const contextNote = existsSync(ctxPath)
    ? readOperatorNote(readFileSync(ctxPath, "utf8"))
    : "";
  return { sources, contextNote };
}

export function setContextNote(repoRoot: string, note: string): void {
  ensureSourceLayout(repoRoot);
  const rel = contextMdRel(repoRoot);
  const abs = assertWritable(repoRoot, rel);
  const current = readFileSync(abs, "utf8");
  writeFileSync(abs, writeOperatorNote(current, note), "utf8");
}

export async function uploadSource(
  repoRoot: string,
  file: { filename: string; bytes: Buffer },
): Promise<{ record: SourceRecord; warning?: string }> {
  if (!isAllowedExtension(file.filename)) {
    throw new SourceStoreError(
      "unsupported_type",
      `unsupported_type: extension not allowed for ${file.filename}`,
    );
  }
  if (file.bytes.length > MAX_SOURCE_BYTES) {
    throw new SourceStoreError(
      "too_large",
      `too_large: file exceeds ${MAX_SOURCE_BYTES} bytes`,
    );
  }

  ensureSourceLayout(repoRoot);
  const ext = fileExtension(file.filename);
  const existing = readIndexRecords(repoRoot);
  const id = uniqueSourceId(new Set(existing.map((r) => r.id)));
  const safeName = safeBasename(file.filename);
  const storedName = `${id}-${safeName}.${ext}`;
  const originalRel = businessIdeaFile(repoRoot, `SOURCES/${storedName}`);
  const originalAbs = assertWritable(repoRoot, originalRel);

  let extractRel: string | "self" = "self";
  let status: ExtractStatus = "ok";
  let warning: string | undefined;

  if (TEXT_SELF_EXTENSIONS.has(ext)) {
    writeFileSync(originalAbs, file.bytes);
  } else {
    writeFileSync(originalAbs, file.bytes);
    const extracted = await extractSourceText(file.filename, file.bytes);
    status = extracted.status;
    warning = extracted.warning;

    const extractName = `${id}-${safeName}.extract.md`;
    const extractRelPath = businessIdeaFile(repoRoot, `SOURCES/${extractName}`);
    const extractAbs = assertWritable(repoRoot, extractRelPath);
    writeFileSync(
      extractAbs,
      buildExtractFileContent(
        basename(file.filename),
        id,
        extracted.method,
        extracted.status,
        extracted.text,
      ),
      "utf8",
    );
    extractRel = extractRelPath;
  }

  const record: SourceRecord = {
    id,
    title: displayTitle(file.filename),
    ext,
    originalRel,
    extractRel,
    status,
    uploadedAt: new Date().toISOString(),
  };

  const nextRecords = [...existing, record];
  writeIndexRecordsToDisk(repoRoot, nextRecords);
  refreshSourcesDigest(repoRoot, nextRecords);

  return { record, warning };
}

export function deleteSource(repoRoot: string, id: string): void {
  ensureSourceLayout(repoRoot);
  const records = readIndexRecords(repoRoot);
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new SourceStoreError("not_found", `not_found: source ${id}`);
  }

  const [removed] = records.splice(index, 1);
  const paths = new Set<string>([removed.originalRel]);
  if (removed.extractRel !== "self") {
    paths.add(removed.extractRel);
  }

  for (const rel of paths) {
    const abs = join(repoRoot, rel);
    if (existsSync(abs)) unlinkSync(abs);
  }

  writeIndexRecordsToDisk(repoRoot, records);
  refreshSourcesDigest(repoRoot, records);
}

export function newestExtractRels(repoRoot: string, limit: number): string[] {
  const { sources } = listSources(repoRoot);
  const rels: string[] = [];
  for (const record of sources) {
    const rel =
      record.extractRel === "self" ? record.originalRel : record.extractRel;
    if (existsSync(join(repoRoot, rel))) {
      rels.push(rel);
    }
    if (rels.length >= limit) break;
  }
  return rels;
}

export { MAX_SOURCE_BYTES };
