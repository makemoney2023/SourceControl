import type { Context, Hono } from "hono";
import {
  deleteSource,
  listSources,
  setContextNote,
  SourceStoreError,
  uploadSource,
} from "./sources/store";

type UploadFile = { filename: string; bytes: Buffer };

async function fileEntryToUpload(entry: string | File): Promise<UploadFile | null> {
  if (typeof entry === "string") return null;
  const bytes = Buffer.from(await entry.arrayBuffer());
  return { filename: entry.name || "upload", bytes };
}

async function collectUploadFiles(
  body: Record<string, string | File | (string | File)[]>,
): Promise<UploadFile[]> {
  const out: UploadFile[] = [];

  for (const key of ["file", "files"] as const) {
    const field = body[key];
    if (!field) continue;
    const entries = Array.isArray(field) ? field : [field];
    for (const entry of entries) {
      const parsed = await fileEntryToUpload(entry);
      if (parsed) out.push(parsed);
    }
  }

  return out;
}

function storeErrorResponse(c: Context, err: SourceStoreError) {
  const status = err.code === "not_found" ? 404 : 400;
  return c.json({ ok: false, error: err.message, code: err.code }, status);
}

export function registerSourcesRoutes(app: Hono, repoRoot: string): void {
  app.get("/api/sources", (c) => {
    const { sources, contextNote } = listSources(repoRoot);
    return c.json({ sources, contextNote });
  });

  app.post("/api/sources/upload", async (c) => {
    try {
      const body = await c.req.parseBody();
      const files = await collectUploadFiles(body);
      if (files.length === 0) {
        return c.json(
          { ok: false, error: "file required", code: "invalid_path" },
          400,
        );
      }

      const warnings: string[] = [];
      for (const file of files) {
        const { warning } = await uploadSource(repoRoot, file);
        if (warning) warnings.push(warning);
      }

      const { sources } = listSources(repoRoot);
      const payload: {
        ok: true;
        sources: ReturnType<typeof listSources>["sources"];
        warning?: string;
        warnings?: string[];
      } = { ok: true, sources };

      if (warnings.length === 1) payload.warning = warnings[0];
      else if (warnings.length > 1) payload.warnings = warnings;

      return c.json(payload, 201);
    } catch (e) {
      if (e instanceof SourceStoreError) return storeErrorResponse(c, e);
      const msg = e instanceof Error ? e.message : String(e);
      return c.json({ ok: false, error: msg }, 500);
    }
  });

  app.put("/api/sources/context", async (c) => {
    const body = await c.req
      .json<{ note?: string }>()
      .catch(() => ({} as { note?: string }));
    if (typeof body.note !== "string") {
      return c.json({ ok: false, error: "note required" }, 400);
    }
    setContextNote(repoRoot, body.note);
    const { contextNote } = listSources(repoRoot);
    return c.json({ ok: true, contextNote });
  });

  app.delete("/api/sources/:id", (c) => {
    try {
      deleteSource(repoRoot, c.req.param("id"));
      const { sources } = listSources(repoRoot);
      return c.json({ ok: true, sources });
    } catch (e) {
      if (e instanceof SourceStoreError) return storeErrorResponse(c, e);
      throw e;
    }
  });
}
