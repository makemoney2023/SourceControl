import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { Hono } from "hono";
import { registerFileRoutes } from "./file-routes";

function seedRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-file-api-"));
  mkdirSync(join(root, "docs/projects/demo/business-idea/images"), {
    recursive: true,
  });
  writeFileSync(
    join(root, "docs/projects/demo/business-idea/images/hero.png"),
    Buffer.from([0x89, 0x50, 0x4e, 0x47]),
  );
  writeFileSync(
    join(root, "docs/projects/demo/business-idea/notes.md"),
    "# hello\n",
  );
  return root;
}

describe("GET /api/file and /api/file/raw", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("returns text content for markdown and binary metadata + raw bytes for images", async () => {
    root = seedRepo();
    const app = new Hono();
    registerFileRoutes(app, root);

    const md = await app.request(
      "/api/file?path=" +
        encodeURIComponent("docs/projects/demo/business-idea/notes.md"),
    );
    expect(md.status).toBe(200);
    const mdBody = await md.json();
    expect(mdBody.previewKind).toBe("text");
    expect(mdBody.content).toMatch(/hello/);

    const imgPath = "docs/projects/demo/business-idea/images/hero.png";
    const meta = await app.request(
      `/api/file?path=${encodeURIComponent(imgPath)}`,
    );
    expect(meta.status).toBe(200);
    const metaBody = await meta.json();
    expect(metaBody.binary).toBe(true);
    expect(metaBody.previewKind).toBe("image");
    expect(metaBody.mime).toBe("image/png");
    expect(metaBody.rawUrl).toContain("/api/file/raw?");

    const raw = await app.request(
      `/api/file/raw?path=${encodeURIComponent(imgPath)}`,
    );
    expect(raw.status).toBe(200);
    expect(raw.headers.get("Content-Type")).toBe("image/png");
    const bytes = new Uint8Array(await raw.arrayBuffer());
    expect(bytes[0]).toBe(0x89);
  });

  it("rejects paths outside the read allowlist", async () => {
    root = seedRepo();
    writeFileSync(join(root, "secret.env"), "nope");
    const app = new Hono();
    registerFileRoutes(app, root);
    const res = await app.request("/api/file?path=secret.env");
    expect(res.status).toBe(403);
  });
});
