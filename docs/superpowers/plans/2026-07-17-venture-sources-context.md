# Venture Sources & Business Context Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let operators upload venture documents (with text extraction) and a freeform context note, then auto-wire that context into Jarvis digest and manager-packet `must_read` lists.

**Architecture:** Filesystem pack under `docs/projects/<slug>/business-idea/SOURCES/` + `MEMORY/context.md`. OCC Hono routes handle multipart upload/list/delete/context. Pure helpers extract text, maintain INDEX/digest, and `appendVentureContextReads` merges paths in `queueValidatedDispatch`. UI lives in Outputs → Sources tab; New idea accepts optional `contextNote`.

**Tech Stack:** TypeScript, Vitest, Hono (`@hono/node-server`), `pdf-parse`, `mammoth`, React 19 OCC Situation Room, existing path allowlists.

**Spec:** `docs/superpowers/specs/2026-07-17-venture-sources-context-design.md`

## Global Constraints

- Active venture only; no cross-venture sources
- Max **20 MB** per file; extensions: `md,txt,csv,pdf,docx,png,jpg,jpeg,webp`
- Extract failure keeps original + stub extract (soft `warning`, not hard rollback)
- No OCR, Chroma, cloud blob, or voice upload intents in v1
- TDD: failing test before implementation on every task
- Work under `tools/org-command-center/`, `skills/org/orchestrator/SKILL.md`, `templates/`, and this docs path
- Reuse `j-btn` / `j-glass` + shadcn Input/Textarea/Button — no new visual system
- Commits only when the human asks (skip Step “Commit” unless instructed)

## File map

| Path | Responsibility |
|------|----------------|
| `server/paths.ts` | Write allowlist for `SOURCES/**`; optional `sourcesDir()` helper |
| `server/sources/types.ts` | Shared types (`SourceRecord`, extract status, API shapes) |
| `server/sources/extract.ts` | `extractSourceText(filename, bytes)` |
| `server/sources/context-md.ts` | Parse/update `MEMORY/context.md` operator note + digest markers |
| `server/sources/store.ts` | Upload/delete, INDEX.md, digest refresh |
| `server/sources/context-reads.ts` | `appendVentureContextReads` |
| `server/sources-routes.ts` | `GET/POST/PUT/DELETE /api/sources*` |
| `server/api.ts` | `registerSourcesRoutes(app, repoRoot)` |
| `server/create-venture.ts` | Seed `SOURCES/` + `context.md`; accept `contextNote` |
| `server/project-routes.ts` | Pass `contextNote` into `createVenture` |
| `server/queue-validated-dispatch.ts` | Merge context reads into packet |
| `server/jarvis/briefing.ts` | `contextNote`, `sourcesCount`, spoken clause |
| `src/api/client.ts` | Client helpers |
| `src/jarvis/hud/SourcesPanel.tsx` | Sources UI |
| `src/jarvis/hud/OutputsDashboard.tsx` | Artifacts \| Sources tabs |
| `src/jarvis/SituationRoom.tsx` | New idea context note |
| `skills/org/orchestrator/SKILL.md` | Skim context + SOURCES |
| `templates/business-idea/SOURCES/INDEX.md` | Seed catalog |
| `templates/venture-memory/context.md` | Seed context template (or inline in create-venture) |
| `tools/org-command-center/README.md` | Operator cheatsheet line |
| `package.json` | Add `pdf-parse`, `mammoth` (+ `@types` if needed) |

---

### Task 1: Write allowlist for SOURCES

**Files:**
- Modify: `tools/org-command-center/server/paths.ts`
- Modify: `tools/org-command-center/server/paths.test.ts`

**Interfaces:**
- Produces: `isWritableRel` accepts `docs/projects/<slug>/business-idea/SOURCES/**`
- Produces (optional): `sourcesDir(repoRoot, slug?) => string` absolute path to SOURCES

- [ ] **Step 1: Write the failing test**

Add to `paths.test.ts`:

```ts
it("allows writing business-idea/SOURCES files", () => {
  expect(() =>
    assertWritable(root, "docs/projects/passive-grid/business-idea/SOURCES/INDEX.md"),
  ).not.toThrow();
  expect(() =>
    assertWritable(
      root,
      "docs/projects/passive-grid/business-idea/SOURCES/20260101T000000-foo.pdf",
    ),
  ).not.toThrow();
});

it("rejects SOURCES path traversal", () => {
  expect(() =>
    assertWritable(root, "docs/projects/passive-grid/business-idea/SOURCES/../../MEMORY/x.md"),
  ).toThrow(/escape|allowlist/i);
});
```

(Use the same `root` fixture pattern already in `paths.test.ts`.)

- [ ] **Step 2: Run test to verify it fails**

```bash
cd tools/org-command-center && npx vitest run server/paths.test.ts
```

Expected: FAIL — SOURCES not on allowlist.

- [ ] **Step 3: Minimal implementation**

In `isWritableRel`:

```ts
if (/^docs\/projects\/[^/]+\/business-idea\/SOURCES\//.test(rel)) return true;
```

Add helper:

```ts
export function sourcesDir(repoRoot: string, slug?: string): string {
  return join(businessIdeaRoot(repoRoot, slug), "SOURCES");
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd tools/org-command-center && npx vitest run server/paths.test.ts
```

---

### Task 2: Text extraction helper

**Files:**
- Create: `tools/org-command-center/server/sources/types.ts`
- Create: `tools/org-command-center/server/sources/extract.ts`
- Create: `tools/org-command-center/server/sources/extract.test.ts`
- Modify: `tools/org-command-center/package.json` (deps)

**Interfaces:**
- Produces:

```ts
export type ExtractStatus = "ok" | "extract_failed" | "image_stub";

export type ExtractResult = {
  text: string;
  method: string;
  status: ExtractStatus;
  warning?: string;
};

export function extractSourceText(filename: string, bytes: Buffer): ExtractResult;
export function isAllowedExtension(filename: string): boolean;
export const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
export const ALLOWED_EXTENSIONS = new Set([
  "md", "txt", "csv", "pdf", "docx", "png", "jpg", "jpeg", "webp",
]);
```

- [ ] **Step 1: Install deps**

```bash
cd tools/org-command-center && npm install pdf-parse mammoth
```

- [ ] **Step 2: Write failing tests** in `extract.test.ts`

```ts
import { describe, expect, it, vi } from "vitest";
import { extractSourceText, isAllowedExtension } from "./extract";

describe("extractSourceText", () => {
  it("decodes utf-8 text files", () => {
    const r = extractSourceText("notes.md", Buffer.from("# Hello\nworld", "utf8"));
    expect(r.status).toBe("ok");
    expect(r.method).toBe("utf8");
    expect(r.text).toContain("Hello");
  });

  it("returns image_stub for png without OCR", () => {
    const r = extractSourceText("shot.png", Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    expect(r.status).toBe("image_stub");
    expect(r.text.toLowerCase()).toMatch(/image|caption|context note/);
  });

  it("returns extract_failed when pdf parser throws", async () => {
    vi.resetModules();
    vi.doMock("pdf-parse", () => ({
      default: async () => {
        throw new Error("boom");
      },
    }));
    const { extractSourceText: extract } = await import("./extract");
    const r = extract("x.pdf", Buffer.from("%PDF-1.4"));
    expect(r.status).toBe("extract_failed");
    expect(r.warning).toMatch(/boom|fail/i);
  });
});

describe("isAllowedExtension", () => {
  it("allows pdf and rejects exe", () => {
    expect(isAllowedExtension("a.PDF")).toBe(true);
    expect(isAllowedExtension("a.exe")).toBe(false);
  });
});
```

Note: If dynamic mock is awkward with ESM, implement pdf/docx behind injectable adapters in `extract.ts` and unit-test the adapter failure path instead — keep behavior identical.

- [ ] **Step 3: Run — expect FAIL**

```bash
cd tools/org-command-center && npx vitest run server/sources/extract.test.ts
```

- [ ] **Step 4: Implement `extract.ts`**

- Extension from filename (lowercase, last segment)
- Text: `bytes.toString("utf8")`
- Images: stub markdown body
- PDF: `import pdf from "pdf-parse"` then `pdf(bytes)` → `text`
- DOCX: `mammoth.extractRawText({ buffer: bytes })`
- Catch → `{ status: "extract_failed", text: "…", method, warning }`
- Empty text after success → treat as `extract_failed`

- [ ] **Step 5: Tests PASS**

```bash
cd tools/org-command-center && npx vitest run server/sources/extract.test.ts
```

---

### Task 3: context.md helpers + store (upload/delete/INDEX/digest)

**Files:**
- Create: `tools/org-command-center/server/sources/context-md.ts`
- Create: `tools/org-command-center/server/sources/context-md.test.ts`
- Create: `tools/org-command-center/server/sources/store.ts`
- Create: `tools/org-command-center/server/sources/store.test.ts`
- Create: `tools/org-command-center/templates` seeds used by store/create (see Task 6 for venture seed; store may create INDEX if missing)

**Interfaces:**

```ts
// context-md.ts
export function seedContextMd(operatorNote?: string): string;
export function readOperatorNote(md: string): string;
export function writeOperatorNote(md: string, note: string): string;
export function writeSourcesDigest(md: string, lines: string[]): string;

// store.ts
export type SourceRecord = {
  id: string;
  title: string;
  ext: string;
  originalRel: string;      // repo-relative
  extractRel: string | "self";
  status: ExtractStatus;
  uploadedAt: string;       // ISO
};

export function listSources(repoRoot: string): {
  sources: SourceRecord[];
  contextNote: string;
};
export function setContextNote(repoRoot: string, note: string): void;
export function uploadSource(
  repoRoot: string,
  file: { filename: string; bytes: Buffer },
): { record: SourceRecord; warning?: string };
export function deleteSource(repoRoot: string, id: string): void;
export function newestExtractRels(repoRoot: string, limit: number): string[];
```

**INDEX.md format** (machine-parseable JSON fence for reliability):

- Human title line: `# Sources index`
- Then a fenced `json` code block containing an array of `SourceRecord` objects (`id`, `title`, `ext`, `originalRel`, `extractRel`, `status`, `uploadedAt`)
- Example record path shape: `docs/projects/x/business-idea/SOURCES/<id>-pitch.pdf` with sibling `.extract.md` when not text-self

Parser: read file, extract first ` ```json ` … ` ``` ` fence, `JSON.parse`.

- [ ] **Step 1: Failing tests for context-md**

```ts
it("preserves operator note when rewriting digest", () => {
  let md = seedContextMd("Keep me");
  md = writeSourcesDigest(md, ["- `id1` Doc — summary"]);
  expect(readOperatorNote(md)).toContain("Keep me");
  expect(md).toContain("auto:sources-digest");
  expect(md).toContain("id1");
});

it("writeOperatorNote does not wipe digest", () => {
  let md = seedContextMd("A");
  md = writeSourcesDigest(md, ["- line"]);
  md = writeOperatorNote(md, "B");
  expect(readOperatorNote(md)).toBe("B");
  expect(md).toContain("- line");
});
```

- [ ] **Step 2: Implement context-md.ts** using markers:

```md
<!-- auto:sources-digest -->
...
<!-- /auto:sources-digest -->
```

Operator note = body between `## Operator note` and `## Sources digest`.

- [ ] **Step 3: Failing tests for store** (temp registry fixture like `project-api.test.ts`)

```ts
it("uploads md as self-extract and refreshes INDEX + digest", () => {
  const root = seedActiveVenture();
  const { record, warning } = uploadSource(root, {
    filename: "brief.md",
    bytes: Buffer.from("# Brief\nImportant fact", "utf8"),
  });
  expect(warning).toBeUndefined();
  expect(record.extractRel).toBe("self");
  expect(existsSync(join(root, record.originalRel))).toBe(true);
  const listed = listSources(root);
  expect(listed.sources).toHaveLength(1);
  expect(listed.contextNote).toBeDefined();
  const ctx = readFileSync(join(root, "docs/projects/a/MEMORY/context.md"), "utf8");
  expect(ctx).toContain(record.id);
});

it("rejects oversized and bad extension", () => {
  const root = seedActiveVenture();
  expect(() =>
    uploadSource(root, { filename: "x.exe", bytes: Buffer.from("x") }),
  ).toThrow(/unsupported_type|unsupported/i);
  const big = Buffer.alloc(MAX_SOURCE_BYTES + 1);
  expect(() =>
    uploadSource(root, { filename: "big.md", bytes: big }),
  ).toThrow(/too_large/i);
});

it("delete removes files and digest entry", () => {
  const root = seedActiveVenture();
  const { record } = uploadSource(root, {
    filename: "a.md",
    bytes: Buffer.from("hi", "utf8"),
  });
  deleteSource(root, record.id);
  expect(listSources(root).sources).toHaveLength(0);
});
```

Throw errors with `.code` property or message tokens `unsupported_type` / `too_large` / `not_found` for routes to map.

- [ ] **Step 4: Implement store.ts**

- Ensure `SOURCES/` + `MEMORY/context.md` exist
- `id = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")` plus random suffix if collision
- `safeName` sanitize basename
- Text ext → write single file; `extractRel: "self"`
- Else → write original via `assertWritable`, run extract, write `.extract.md` with header from spec
- Rebuild INDEX JSON + digest lines (newest 20, summary = first ~200 chars of extract body)
- `setContextNote` load/write via context-md helpers + `assertWritable`

- [ ] **Step 5: All store/context-md tests PASS**

```bash
cd tools/org-command-center && npx vitest run server/sources/context-md.test.ts server/sources/store.test.ts
```

---

### Task 4: appendVentureContextReads

**Files:**
- Create: `tools/org-command-center/server/sources/context-reads.ts`
- Create: `tools/org-command-center/server/sources/context-reads.test.ts`

**Interfaces:**

```ts
export function appendVentureContextReads(
  repoRoot: string,
  mustRead: string[] | undefined,
): string[];
```

Behavior:
1. Build prefix list: `memoryRel/context.md` if exists; `businessIdeaRel/SOURCES/INDEX.md` if exists; up to 3 from `newestExtractRels`
2. Dedupe with `Set`, prefix first, then caller `mustRead`
3. Paths POSIX, repo-relative

- [ ] **Step 1: Failing test**

```ts
it("prepends context + index + up to 3 extracts before caller paths", () => {
  const root = seedWithThreeSources();
  const out = appendVentureContextReads(root, ["skills/org/MODEL-REGISTRY.md"]);
  expect(out[0]).toMatch(/MEMORY\/context\.md$/);
  expect(out[1]).toMatch(/SOURCES\/INDEX\.md$/);
  expect(out.filter((p) => p.includes("SOURCES/") && p !== out[1]).length).toBeLessThanOrEqual(3);
  expect(out.at(-1)).toBe("skills/org/MODEL-REGISTRY.md");
});

it("dedupes if caller already included context.md", () => {
  const root = seedWithContextOnly();
  const ctx = "docs/projects/a/MEMORY/context.md";
  const out = appendVentureContextReads(root, [ctx, "x.md"]);
  expect(out.filter((p) => p === ctx)).toHaveLength(1);
});
```

- [ ] **Step 2: Implement + PASS**

```bash
cd tools/org-command-center && npx vitest run server/sources/context-reads.test.ts
```

---

### Task 5: HTTP routes

**Files:**
- Create: `tools/org-command-center/server/sources-routes.ts`
- Create: `tools/org-command-center/server/sources-api.test.ts`
- Modify: `tools/org-command-center/server/api.ts` — call `registerSourcesRoutes(app, repoRoot)` near `registerProjectRoutes`

**Interfaces:**
- `registerSourcesRoutes(app: Hono, repoRoot: string): void`
- Routes per spec: `GET /api/sources`, `POST /api/sources/upload`, `PUT /api/sources/context`, `DELETE /api/sources/:id`

- [ ] **Step 1: Failing route tests** using `registerSourcesRoutes` + temp repo

```ts
it("GET returns empty sources and note", async () => {
  root = seedActiveVenture();
  const app = new Hono();
  registerSourcesRoutes(app, root);
  const res = await app.request("/api/sources");
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body.sources).toEqual([]);
  expect(typeof body.contextNote).toBe("string");
});

it("POST upload accepts multipart md", async () => {
  root = seedActiveVenture();
  const app = new Hono();
  registerSourcesRoutes(app, root);
  const form = new FormData();
  form.append("file", new Blob(["# Hi"], { type: "text/markdown" }), "hi.md");
  const res = await app.request("/api/sources/upload", { method: "POST", body: form });
  expect(res.status).toBe(201);
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.sources.length).toBe(1);
});

it("PUT updates context note", async () => {
  root = seedActiveVenture();
  const app = new Hono();
  registerSourcesRoutes(app, root);
  const res = await app.request("/api/sources/context", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note: "We sell water harvesters" }),
  });
  expect(res.status).toBe(200);
  const get = await (await app.request("/api/sources")).json();
  expect(get.contextNote).toContain("water harvesters");
});
```

- [ ] **Step 2: Implement routes**

- `GET` → `listSources`
- `POST` → parse multipart (`c.req.parseBody()`), support `file` or multiple `files`; map thrown codes to 400 JSON `{ ok:false, error, code }`
- Soft extract warnings: `201` + `{ warning }`
- `PUT` → `{ note: string }` required
- `DELETE` → 404 `not_found` if missing

- [ ] **Step 3: Wire in `createApi`**

```ts
import { registerSourcesRoutes } from "./sources-routes";
// ...
registerProjectRoutes(app, repoRoot);
registerSourcesRoutes(app, repoRoot);
```

- [ ] **Step 4: Tests PASS**

```bash
cd tools/org-command-center && npx vitest run server/sources-api.test.ts
```

---

### Task 6: Create-venture seeds + contextNote

**Files:**
- Modify: `tools/org-command-center/server/create-venture.ts`
- Modify: `tools/org-command-center/server/project-routes.ts`
- Modify: `tools/org-command-center/server/project-api.test.ts` (or create-venture tests if present)
- Create: `tools/org-command-center/../templates/business-idea/SOURCES/INDEX.md` → actually repo root: `templates/business-idea/SOURCES/INDEX.md`
- Optional: `templates/venture-memory/context.md`

**Interfaces:**
- `CreateVentureInput.contextNote?: string`
- Creates `business-idea/SOURCES/` + `INDEX.md` + `MEMORY/context.md` via `seedContextMd(contextNote)`

- [ ] **Step 1: Failing test**

```ts
it("createVenture seeds SOURCES and context note", () => {
  const root = seedRegistryOnly(); // skills/org stub not required if createVenture doesn't read them
  // Minimal: projects/registry.json with empty projects or one dummy — match existing createVenture tests if any
  const result = createVenture(root, {
    name: "Solar Lantern",
    slug: "solar-lantern",
    contextNote: "Hardware first",
  });
  expect(existsSync(join(root, result.businessIdea, "SOURCES", "INDEX.md"))).toBe(true);
  const ctx = readFileSync(join(root, result.memory, "context.md"), "utf8");
  expect(ctx).toContain("Hardware first");
  expect(ctx).toContain("auto:sources-digest");
});
```

If no createVenture unit test file exists, add `server/create-venture.test.ts`.

- [ ] **Step 2: Implement seed dirs + INDEX + context.md; extend project route body type with `contextNote`**

- [ ] **Step 3: PASS**

```bash
cd tools/org-command-center && npx vitest run server/create-venture.test.ts server/project-api.test.ts
```

---

### Task 7: Packet + Jarvis wiring

**Files:**
- Modify: `tools/org-command-center/server/queue-validated-dispatch.ts`
- Modify: `tools/org-command-center/server/queue-validated-dispatch.test.ts` (create if missing; else extend an existing dispatch test)
- Modify: `tools/org-command-center/server/jarvis/briefing.ts`
- Modify: `tools/org-command-center/server/jarvis/briefing.test.ts`

**Interfaces:**
- After building `body` / before or after `validateManagerPacket`, set:

```ts
body.must_read = appendVentureContextReads(repoRoot, body.must_read);
```

Prefer **before** validate so packet persists merged paths. If validate defaults `must_read`, merge after validate onto `result.packet` before enqueue — choose one place and keep tests aligned. Recommended: merge on `body` before validate.

- `buildJarvisContext` returns:

```ts
{
  mission,
  spokenBrief: string, // mission + optional context clause
  contextNote: string, // truncated ≤500
  sourcesCount: number,
}
```

Spoken clause when note trimmed non-empty:  
` Context note on file; ${n} sources attached.`  
(single trailing sentence fragment; keep total brief short)

- [ ] **Step 1: Failing tests**

```ts
// queue: after queueValidatedDispatch, packet.must_read includes MEMORY/context.md
// briefing: contextNote + sourcesCount; spokenBrief includes "Context note on file" when note set
```

- [ ] **Step 2: Implement**

```ts
// briefing.ts
import { listSources } from "../sources/store";
import { readOperatorNote, /* or listSources.contextNote */ } from "../sources/context-md";

export function buildJarvisContext(repoRoot: string) {
  const snap = loadSnapshot(repoRoot);
  const { sources, contextNote } = listSources(repoRoot);
  const truncated = contextNote.trim().slice(0, 500);
  let spokenBrief = spokenMissionBrief(snap.mission);
  if (truncated) {
    spokenBrief += ` Context note on file; ${sources.length} sources attached.`;
  }
  return {
    mission: snap.mission,
    spokenBrief,
    contextNote: truncated,
    sourcesCount: sources.length,
  };
}
```

Ensure `listSources` is safe when MEMORY/SOURCES missing (return empty + `""`).

- [ ] **Step 3: PASS**

```bash
cd tools/org-command-center && npx vitest run server/jarvis/briefing.test.ts server/queue-validated-dispatch.test.ts
```

If `queue-validated-dispatch.test.ts` does not exist, create it with a minimal temp repo + org/model registry fixtures copied from `tools-exec.test.ts` / `dispatch-for.test.ts`.

---

### Task 8: API client + Sources UI

**Files:**
- Modify: `tools/org-command-center/src/api/client.ts`
- Create: `tools/org-command-center/src/jarvis/hud/SourcesPanel.tsx`
- Modify: `tools/org-command-center/src/jarvis/hud/OutputsDashboard.tsx`
- Modify: `tools/org-command-center/src/jarvis/JarvisShell.tsx` if it embeds Outputs without drawer props changes

**Interfaces (client):**

```ts
export type SourceRecord = {
  id: string;
  title: string;
  ext: string;
  originalRel: string;
  extractRel: string | "self";
  status: "ok" | "extract_failed" | "image_stub";
  uploadedAt: string;
};

export async function fetchSources(): Promise<{
  sources: SourceRecord[];
  contextNote: string;
}>;

export async function uploadSources(files: FileList | File[]): Promise<{
  ok: true;
  sources: SourceRecord[];
  warnings?: string[];
}>;

export async function saveContextNote(note: string): Promise<{ ok: true; contextNote: string }>;

export async function deleteSource(id: string): Promise<{ ok: true }>;
```

`uploadSources` uses `FormData` without setting `Content-Type` (browser sets boundary).

- [ ] **Step 1: Add client functions**

- [ ] **Step 2: Implement `SourcesPanel`**

Props:

```tsx
export function SourcesPanel({
  onSelectPath,
  selectedPath,
}: {
  onSelectPath: (path: string | null) => void;
  selectedPath: string | null;
});
```

UI:
- Load `fetchSources` on mount
- Textarea bound to note + Save button → `saveContextNote`
- `<input type="file" multiple />` + drag/drop zone calling `uploadSources`
- List buttons: title, status chip, Delete
- On row click: `onSelectPath(extractRel === "self" ? originalRel : extractRel)`

- [ ] **Step 3: OutputsDashboard tabs**

```tsx
const [tab, setTab] = useState<"artifacts" | "sources">("artifacts");
// segmented control at top
// tab === "artifacts" → existing two-column layout
// tab === "sources" → <SourcesPanel ... /> + keep Preview column OR embed preview inside SourcesPanel
```

Prefer: Sources tab still uses right Preview column — panel only left/center controls; selecting a source sets `selectedPath` like artifacts.

- [ ] **Step 4: Manual UI smoke** (no Playwright required)

```bash
cd tools/org-command-center && npm run typecheck
```

Expected: clean (or only pre-existing unrelated errors).

---

### Task 9: New idea context note field

**Files:**
- Modify: `tools/org-command-center/src/api/client.ts` — `createProject` accepts `contextNote?: string`
- Modify: `tools/org-command-center/src/jarvis/SituationRoom.tsx`

- [ ] **Step 1: Add state `newVentureContext` + textarea in New idea panel** (below slug)

- [ ] **Step 2: Pass into create**

```ts
await createProject({
  name,
  slug,
  activate: true,
  contextNote: newVentureContext.trim() || undefined,
});
```

Clear note on success/cancel.

- [ ] **Step 3: Typecheck PASS**

```bash
cd tools/org-command-center && npm run typecheck
```

---

### Task 10: Orchestrator + README + existing ventures

**Files:**
- Modify: `skills/org/orchestrator/SKILL.md` — Active venture section
- Modify: `tools/org-command-center/README.md` — one Sources bullet
- Optionally seed `docs/projects/demo-venture/MEMORY/context.md` + `SOURCES/INDEX.md` and same for `passive-grid` (empty digest) so live OCC does not 500 — **only if** `listSources` requires files; prefer code tolerating missing files instead

- [ ] **Step 1: Orchestrator bullet**

After MEMORY sessions skim line, add:

```md
3b. Skim `docs/projects/<active>/MEMORY/context.md` and `docs/projects/<active>/business-idea/SOURCES/INDEX.md` when present (operator business context + uploaded sources).
```

Renumber only if needed; keep adjacent to item 3.

- [ ] **Step 2: README** under Situation Room / Outputs:

```md
**Sources / context:** Outputs drawer → **Sources** — upload docs (text extracted for agents), edit the venture context note. New idea can set the note at create time. Assign/queue auto-adds `MEMORY/context.md` + source index to `must_read`.
```

- [ ] **Step 3: Full test suite slice**

```bash
cd tools/org-command-center && npx vitest run server/paths.test.ts server/sources server/sources-api.test.ts server/jarvis/briefing.test.ts
```

Expected: all PASS.

- [ ] **Step 4: Manual smoke checklist**

1. Start OCC (`npm run dev` + API as you normally do)
2. Switch to `demo-venture` (or create new)
3. Outputs → Sources → paste note → Save
4. Upload a small `.md` and a `.pdf`
5. Confirm files under `docs/projects/<slug>/business-idea/SOURCES/`
6. Assign any manager work → open queued YAML → `must_read` includes `MEMORY/context.md` and `SOURCES/INDEX.md`
7. `GET /api/jarvis/context` includes `contextNote` / `sourcesCount`

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| SOURCES/ + MEMORY/context.md layout | 3, 6 |
| Write allowlist | 1 |
| Extract md/txt/csv/pdf/docx + image stub | 2 |
| Caps 20MB + extension allowlist | 2, 3, 5 |
| API GET/POST/PUT/DELETE | 5 |
| Soft extract_failed | 2, 3, 5 |
| Digest markers preserve note | 3 |
| appendVentureContextReads + queue | 4, 7 |
| Jarvis context fields + spoken clause | 7 |
| Outputs Sources tab | 8 |
| New idea contextNote | 6, 9 |
| Orchestrator skim | 10 |
| TDD | all tasks |

## Placeholder / consistency self-review

- Types aligned on `SourceRecord` / `ExtractStatus` across store, routes, client
- No OCR / Chroma / voice upload in any task
- Commit steps omitted unless human requests commits
- `pdf-parse` ESM import: if default import fails, use `const pdf = (await import("pdf-parse")).default` inside async wrapper or sync require pattern compatible with Vitest — resolve during Task 2 without changing external API of `extractSourceText`
