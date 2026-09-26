import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

const root = resolve("public");
const port = Number(process.env.PORT || 4173);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};
http
  .createServer(async (req, res) => {
    try {
      if (!["GET", "HEAD"].includes(req.method)) {
        res.writeHead(405);
        return res.end();
      }
      let path = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (path === "/beta") {
        res.writeHead(308, { Location: "/beta/" });
        return res.end();
      }
      if (path === "/") path = "/index.html";
      if (path === "/beta/") path = "/beta/BoutiquePilot.html";
      const file = resolve(root, "." + path);
      if (
        !file.startsWith(root + sep) ||
        path.split("/").some((p) => p.startsWith("."))
      ) {
        res.writeHead(404);
        return res.end();
      }
      const body = await readFile(file);
      res.writeHead(200, {
        "Content-Type": mime[extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      });
      res.end(req.method === "HEAD" ? undefined : body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Page introuvable.");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`BoutiquePilot : http://127.0.0.1:${port}`),
  );
