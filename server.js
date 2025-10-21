const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".otf": "font/otf",
};

function sendNotFound(response) {
  response.statusCode = 404;
  response.end("Not Found");
}

const server = http.createServer((request, response) => {
  const safePath = path.normalize(request.url.split("?")[0]).replace(/^\/+/, "");
  let filePath = path.join(ROOT_DIR, safePath || "index.html");

  if (!filePath.startsWith(ROOT_DIR)) {
    response.statusCode = 403;
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error) {
      return sendNotFound(response);
    }

    let targetPath = filePath;
    if (stats.isDirectory()) {
      targetPath = path.join(filePath, "index.html");
    }

    fs.readFile(targetPath, (readError, content) => {
      if (readError) {
        return sendNotFound(response);
      }
      const ext = path.extname(targetPath).toLowerCase();
      response.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
      response.statusCode = 200;
      response.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Curious site available at http://localhost:${PORT}`);
});
