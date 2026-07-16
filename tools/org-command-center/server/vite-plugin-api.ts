import type { Plugin } from "vite";
import { createApi } from "./api";
import { resolveRepoRoot } from "./paths";

export function orgCommandCenterApi(): Plugin {
  return {
    name: "org-command-center-api",
    configureServer(server) {
      const repoRoot = resolveRepoRoot();
      const app = createApi(repoRoot);
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api")) return next();
        try {
          const host = req.headers.host ?? "localhost";
          const url = new URL(req.url, `http://${host}`);
          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) {
            if (v) headers.set(k, Array.isArray(v) ? v.join(",") : v);
          }
          let body: Uint8Array | undefined;
          if (req.method !== "GET" && req.method !== "HEAD") {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            const buf = Buffer.concat(chunks);
            body = buf.length ? new Uint8Array(buf) : undefined;
          }
          const request = new Request(url, {
            method: req.method,
            headers,
            body: body as RequestInit["body"],
            // Node undici requires duplex when sending a body
            ...(body ? ({ duplex: "half" } as RequestInit) : {}),
          });
          const response = await app.fetch(request);
          res.statusCode = response.status;
          response.headers.forEach((value: string, key: string) => {
            res.setHeader(key, value);
          });
          const buf = Buffer.from(await response.arrayBuffer());
          res.end(buf);
        } catch (err) {
          next(err);
        }
      });
    },
  };
}
