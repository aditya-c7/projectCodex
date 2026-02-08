const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 8000;
const publicDir = path.join(__dirname, "public");
const rootDir = __dirname;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const resolvePath = (urlPath) => {
  const safePath = urlPath === "/" ? "/index.html" : urlPath;
  const publicPath = path.join(publicDir, safePath);
  if (fs.existsSync(publicPath)) {
    return publicPath;
  }
  const rootPath = path.join(rootDir, safePath);
  if (fs.existsSync(rootPath)) {
    return rootPath;
  }
  return null;
};

const server = http.createServer((req, res) => {
  const filePath = resolvePath(req.url);
  if (!filePath) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
  console.log(`Portfolio running on http://localhost:${port}`);
});
