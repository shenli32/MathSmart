const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { askMath, safeError, logErrorFix } = require("./server/ai");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function serveFile(requestPath, response) {
  const requested = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!filePath.startsWith(PUBLIC_DIR + path.sep)) return sendJson(response, 403, { error: { message: "That page is not available.", fix: "Use the MathSmart home page." } });
  fs.readFile(filePath, (error, data) => {
    if (error) return sendJson(response, 404, { error: { message: "That page could not be found.", fix: "Go back to the MathSmart home page." } });
    response.writeHead(200, { "Content-Type": MIME_TYPES[path.extname(filePath)] || "application/octet-stream" });
    response.end(data);
  });
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", chunk => {
      body += chunk;
      if (body.length > 10_000) reject(new Error("Request is too large."));
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

const server = http.createServer(async (request, response) => {
  if (request.method === "POST" && request.url === "/api/ask") {
    try {
      const body = JSON.parse(await readBody(request));
      const answer = await askMath(body.question);
      return sendJson(response, 200, { answer });
    } catch (error) {
      logErrorFix(error);
      return sendJson(response, 400, { error: safeError(error) });
    }
  }
  if (request.method === "GET") return serveFile(request.url.split("?")[0], response);
  return sendJson(response, 405, { error: { message: "That action is not available.", fix: "Use the MathSmart buttons." } });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`MathSmart is running at http://127.0.0.1:${PORT}`);
});
