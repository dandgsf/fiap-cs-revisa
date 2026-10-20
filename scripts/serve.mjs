import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import { runtime } from "./project-files.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const portIndex = process.argv.indexOf("--port");
const port = portIndex < 0 ? 4317 : Number(process.argv[portIndex + 1]);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Use --port com um número entre 1024 e 65535.");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = createServer(async (request, response) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("Cache-Control", "no-store");
  if (!["GET", "HEAD"].includes(request.method)) { response.writeHead(405); response.end(); return; }
  let file;
  try { file = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname).slice(1) || "index.html"; }
  catch { response.writeHead(400); response.end(); return; }
  if (!runtime.includes(file)) { response.writeHead(404); response.end("Arquivo não encontrado."); return; }
  try {
    const body = await readFile(join(root, file));
    response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch { response.writeHead(404); response.end("Arquivo não encontrado."); }
});
server.on("error", error => {
  console.error(error.code === "EADDRINUSE" ? `A porta ${port} já está em uso. Escolha outra: npm start -- --port 4318` : "Não foi possível iniciar o servidor local.");
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () => console.log(`FIAP CS Revisa: http://127.0.0.1:${port} — Ctrl+C encerra.`));
