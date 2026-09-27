import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = path.resolve("out");
const port = Number(process.env.PORT ?? 3105);
const mediaTypes = { ".mp4": "video/mp4", ".webm": "video/webm" };
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain", ".xml": "application/xml", ".avif": "image/avif", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    const requested = decodeURIComponent(url.pathname);
    const file = path.resolve(root, `.${requested.endsWith("/") ? `${requested}index.html` : requested}`);
    if (!file.startsWith(`${root}${path.sep}`)) { res.writeHead(403).end(); return; }
    const raw = await fs.readFile(file);
    const ext = path.extname(file);
    if (mediaTypes[ext]) {
      const headers = { "Content-Type": mediaTypes[ext], "Accept-Ranges": "bytes", "Cache-Control": "no-store" };
      if (req.headers.range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        const suffix = match && !match[1] && match[2] ? Number(match[2]) : 0;
        const start = suffix ? Math.max(0, raw.length - suffix) : Number(match?.[1] ?? 0);
        const end = suffix || !match?.[2] ? raw.length - 1 : Math.min(Number(match[2]), raw.length - 1);
        if (!match || (!match[1] && !suffix) || !Number.isSafeInteger(start) || start >= raw.length || start > end) {
          res.writeHead(416, { ...headers, "Content-Range": `bytes */${raw.length}` }).end(); return;
        }
        res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${raw.length}`, "Content-Length": end - start + 1 });
        res.end(req.method === "HEAD" ? undefined : raw.subarray(start, end + 1)); return;
      }
      res.writeHead(200, { ...headers, "Content-Length": raw.length });
      res.end(req.method === "HEAD" ? undefined : raw); return;
    }
    const compress = /\.(html|js|css|json|txt|xml|svg)$/.test(file) && /gzip/.test(req.headers["accept-encoding"] ?? "");
    const body = compress ? gzipSync(raw) : raw;
    res.writeHead(200, { "Content-Type": types[ext] ?? "application/octet-stream", "Content-Length": body.length, "Cache-Control": "no-store", "Vary": "Accept-Encoding", ...(compress ? { "Content-Encoding": "gzip" } : {}) });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch { res.writeHead(404).end("Nao encontrado"); }
}).listen(port, "127.0.0.1", () => process.stdout.write(`Preview local: http://127.0.0.1:${port}/\n`));
