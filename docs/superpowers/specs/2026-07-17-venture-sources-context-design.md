# Design: Venture Sources & Business Context

**Date:** 2026-07-17  
**Status:** Active  
**Approach:** A — Filesystem sources pack (extract on upload; digest + must_read wiring)  
**App:** `tools/org-command-center/`  
**Related:** [Multi-venture projects](./2026-07-16-multi-venture-projects-design.md), [Org Command Center](./2026-07-16-org-command-center-design.md)

## Jobs to be done

| Job | Outcome |
|-----|---------|
| Upload documents for the active venture | Originals + greppable extracts land under `business-idea/SOURCES/` |
| Provide freeform business context | Operator note persisted in `MEMORY/context.md` |
| Agents always see context | Jarvis digest includes note/counts; assign/queue packets auto-append must_read paths |
| Discoverability in OCC | Outputs drawer **Sources** tab + optional note on **New idea** |

## Non-goals (v1)

- Chroma / vector RAG
- OCR for images
- Cloud object storage or external DB
- Multi-tenant auth / cross-venture source libraries
- Voice/Jarvis “upload this file” intents
- In-place extract editing (re-upload to replace)
- Drag-and-drop onto the 3D org scene

## Decisions locked

| Topic | Choice |
|-------|--------|
| Primary job | Upload **and** freeform note, both wired into packets |
| Storage | Extract text on upload; keep originals |
| UI | Outputs **Artifacts \| Sources**; New idea optional context note |
| Packet wiring | Digest inject **and** auto must_read |
| Architecture | Filesystem under active venture (no blob/DB) |

---

## Filesystem layout

```
docs/projects/<slug>/
  business-idea/
    SOURCES/
      INDEX.md                      # auto-maintained catalog
      <id>-<safe-name>.<ext>        # original (binaries / docs)
      <id>-<safe-name>.extract.md   # greppable text for agents
  MEMORY/
    context.md                      # operator note + sources digest
```

### Naming

- `<id>` = UTC timestamp slug (`YYYYMMDDTHHMMSSmsec` or equivalent collision-safe token)
- Filename sanitized to `[a-zA-Z0-9._-]+`; reject `..` and absolute paths
- Pure text uploads (`.md` / `.txt` / `.csv`): store **once** as the source file (no duplicate extract); INDEX marks `extract: self`
- Other types: original + sibling `.extract.md`

### Allowlists

Extend `assertWritable` to allow:

`docs/projects/<slug>/business-idea/SOURCES/**`

Jarvis `file.read` already allows active-venture `business-idea/**` (extracts readable).  
`MEMORY/context.md` already covered by `MEMORY/**` write allowlist.

Create-venture scaffolds empty `SOURCES/` + seed `MEMORY/context.md` template.

---

## MEMORY/context.md contract

```md
# Venture context

## Operator note

<freeform markdown from operator>

## Sources digest

<!-- auto:sources-digest -->
- `<id>` <title> — <one-line summary>
<!-- /auto:sources-digest -->
```

- **Operator note** — only `PUT /api/sources/context` (and create-venture `contextNote`) may change this section
- **Sources digest** — regenerated on upload/delete; bounded (e.g. newest 20 lines, ~200 chars each)
- Helpers must parse by section / HTML-comment markers so note text is never clobbered

---

## SOURCES/INDEX.md contract

Auto-maintained table or bullet list including at least:

| Field | Meaning |
|-------|---------|
| id | Source id |
| original | Relative path under repo |
| extract | Relative path or `self` |
| title | Display name |
| mime/ext | Type |
| status | `ok` \| `extract_failed` \| `image_stub` |
| uploaded_at | ISO timestamp |

---

## Extraction

Pure function: `extractSourceText(filename, bytes) → { text, method, warning? }`

| Type | Method (v1) |
|------|-------------|
| `.md` / `.txt` / `.csv` | UTF-8 decode |
| `.pdf` | Node PDF text extract (`pdf-parse` or equivalent) |
| `.docx` | `mammoth` → plain text |
| `.png` / `.jpg` / `.jpeg` / `.webp` | No OCR — stub extract instructing operator to caption via context note |

Extract file header:

```md
# Extract: <original-name>
**Source id:** …
**Method:** …
**Status:** ok | extract_failed | image_stub
```

If extraction throws or returns empty: **keep original**, write stub extract with `extract_failed`, return API warning. Upload still succeeds.

### Caps

- Max **20 MB** per file
- Allowed extensions: `md`, `txt`, `csv`, `pdf`, `docx`, `png`, `jpg`, `jpeg`, `webp`
- Active venture only

---

## API

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/sources` | List sources + `contextNote` for active venture |
| `POST` | `/api/sources/upload` | Multipart file(s); write + extract + refresh INDEX/digest |
| `PUT` | `/api/sources/context` | `{ "note": string }` → operator note section |
| `DELETE` | `/api/sources/:id` | Remove original (+ extract if any); refresh INDEX/digest |

`POST /api/project/create` gains optional `contextNote?: string` (seeds operator note).

### Error codes (JSON)

`too_large` | `unsupported_type` | `extract_failed` | `not_found` | `invalid_path`

`extract_failed` is a soft failure on upload response (`warning`), not a hard 4xx that rolls back the original.

---

## Digest + must_read wiring

### Jarvis context

`buildJarvisContext(repoRoot)` adds:

- `contextNote` — operator note truncated (~500 chars) for tool consumers
- `sourcesCount` — number of indexed sources
- `spokenBrief` — remains mission-only; if note non-empty, append one short clause: “Context note on file; N sources attached.”

### Assign / queue

Helper `appendVentureContextReads(repoRoot, must_read: string[]): string[]`:

1. Prepend (deduped) `docs/projects/<active>/MEMORY/context.md`
2. Prepend `…/business-idea/SOURCES/INDEX.md` if present
3. Prepend up to **3 newest** extract paths (or self-text sources)
4. Preserve any caller-supplied must_read after

Call from `queueValidatedDispatch` so Assign UI, `dispatch.queue_for`, and `work.request` all inherit context.

### Orchestrator

Update `skills/org/orchestrator/SKILL.md`: when starting phase work, skim `MEMORY/context.md` and `SOURCES/INDEX.md` (in addition to existing MEMORY sessions).

---

## UI

### Outputs drawer

Segmented control: **Artifacts | Sources**.

**Sources pane**

- Textarea + Save for context note
- File drop / picker (multi-file) for upload
- List rows: title, type, status, Delete
- Row select → Preview pane shows extract (or text source)
- Inline warning when status ≠ ok

Reuse existing `j-btn` / `j-glass` and shadcn Input / Textarea / Button.

### New idea

Optional **Context note** textarea on the create panel; passed as `contextNote`. File upload happens after create via Sources tab.

---

## Module boundaries

| Unit | Responsibility |
|------|----------------|
| `server/paths.ts` | Allowlist `SOURCES/**` |
| `server/sources/extract.ts` | Text extraction only |
| `server/sources/store.ts` | Write/delete files, INDEX + context.md maintenance |
| `server/sources/context-reads.ts` | `appendVentureContextReads` |
| `server/sources-routes.ts` | HTTP handlers |
| `server/create-venture.ts` | Seed SOURCES + context.md; accept `contextNote` |
| `server/queue-validated-dispatch.ts` | Call append helper |
| `server/jarvis/briefing.ts` | Context fields + spoken clause |
| `src/api/client.ts` | Fetch helpers |
| `src/jarvis/hud/SourcesPanel.tsx` | Sources UI |
| `src/jarvis/hud/OutputsDashboard.tsx` | Tab shell |
| `src/jarvis/SituationRoom.tsx` | New idea context note field |
| `skills/org/orchestrator/SKILL.md` | Skim instruction |
| `templates` / create-venture seeds | Empty INDEX + context template |

Prefer small focused files under `server/sources/` rather than growing `api.ts` unbounded.

---

## Testing (TDD)

1. Writable allowlist includes `SOURCES/**`; traversal rejected  
2. Extract: text / pdf / docx happy path; empty/throw → stub  
3. Upload store: files + INDEX + digest refresh; size/type rejection  
4. Context PUT preserves digest markers  
5. Delete removes pair and refreshes INDEX  
6. `appendVentureContextReads` order, dedupe, extract cap  
7. `queueValidatedDispatch` includes context paths in packet  
8. Create-venture seeds dirs + optional note  
9. `buildJarvisContext` exposes note/count (and spoken clause when note set)  
10. API client / route smoke tests for happy path  

No full browser e2e required in v1.

---

## Rollout

1. Server store + extract + routes (TDD)  
2. Packet + Jarvis + create-venture wiring  
3. OCC Sources UI + New idea field  
4. Orchestrator + template docs  
5. Manual smoke: upload PDF on demo-venture, assign work, confirm must_read paths in queued YAML  

## Open follow-ups (explicitly later)

- OCR for images  
- Chroma when SOURCES outgrow grep  
- Re-extract / replace-in-place API  
- Voice intent to attach a path already on disk
