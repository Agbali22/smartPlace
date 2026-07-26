import http from 'http';
import fs from 'fs';
import path from 'path';

const port = parseInt(process.env.PORT, 10) || 3000;
const baseDir = new URL('./', import.meta.url).pathname;

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function getMimeType(filePath) {
  return mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function safeJoin(base, requestedPath) {
  const safePath = path.normalize(path.join(base, requestedPath));
  if (!safePath.startsWith(path.normalize(base))) {
    return null;
  }
  return safePath;
}

const server = http.createServer((req, res) => {
  const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  let filePath = urlPath === '/' ? 'index.html' : urlPath.slice(1);

  if (!path.extname(filePath)) {
    filePath = path.join(filePath, 'index.html');
  }

  const resolvedPath = safeJoin(baseDir, filePath);
  if (!resolvedPath) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('Bad request');
    return;
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('Not found');
      return;
    }

    const mimeType = getMimeType(resolvedPath);
    res.writeHead(200, { 'Content-Type': mimeType });
    fs.createReadStream(resolvedPath).pipe(res);
  });
});

server.listen(port, () => {
  console.log(`SmartPlace static server running at http://localhost:${port}`);
});
