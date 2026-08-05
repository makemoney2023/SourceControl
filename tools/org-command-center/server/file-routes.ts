import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { join, relative } from "node:path";
import type { Hono } from "hono";
import { mimeForPath, previewKindForPath } from "../src/lib/file-preview";
import { assertReadable } from "./paths";

export function registerFileRoutes(app: Hono, repoRoot: string) {
  app.get("/api/file", async (c) => {
    const rel = c.req.query("path");
    if (!rel) return c.json({ error: "path required" }, 400);
    try {
      const abs = assertReadable(repoRoot, rel);
      if (!existsSync(abs)) return c.json({ error: "not found" }, 404);
      const st = statSync(abs);
      if (st.isDirectory()) {
        const entries = readdirSync(abs).map((name) => {
          const child = join(abs, name);
          const cst = statSync(child);
          return {
            name,
            path: relative(repoRoot, child).split("\\").join("/"),
            type: cst.isDirectory() ? "dir" : "file",
          };
        });
        return c.json({ type: "dir", path: rel, entries });
      }
      const kind = previewKindForPath(rel);
      if (kind === "text") {
        return c.json({
          type: "file",
          path: rel,
          content: readFileSync(abs, "utf8"),
          previewKind: "text",
        });
      }
      let extract: string | undefined;
      if (kind === "docx") {
        try {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({ path: abs });
          extract = result.value?.trim().slice(0, 8000) || undefined;
        } catch {
          extract = undefined;
        }
      }
      return c.json({
        type: "file",
        path: rel,
        binary: true,
        previewKind: kind,
        mime: mimeForPath(rel),
        rawUrl: `/api/file/raw?path=${encodeURIComponent(rel)}`,
        content: extract,
      });
    } catch (e) {
      return c.json({ error: e instanceof Error ? e.message : String(e) }, 403);
    }
  });

  app.get("/api/file/raw", (c) => {
    const rel = c.req.query("path");
    if (!rel) return c.json({ error: "path required" }, 400);
    try {
      const abs = assertReadable(repoRoot, rel);
      if (!existsSync(abs)) return c.json({ error: "not found" }, 404);
      const st = statSync(abs);
      if (st.isDirectory()) return c.json({ error: "not a file" }, 400);
      const body = readFileSync(abs);
      return new Response(body, {
        status: 200,
        headers: {
          "Content-Type": mimeForPath(rel),
          "Content-Length": String(body.byteLength),
          "Cache-Control": "private, max-age=60",
        },
      });
    } catch (e) {
      return c.json({ error: e instanceof Error ? e.message : String(e) }, 403);
    }
  });
}
