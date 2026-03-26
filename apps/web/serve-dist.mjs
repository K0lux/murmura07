import { createReadStream, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('./dist', import.meta.url));
const indexPath = join(rootDir, 'index.html');
const port = 5173;

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function getFilePath(urlPath) {
  const sanitized = normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const target = join(rootDir, sanitized);
  return target.startsWith(rootDir) ? target : rootDir;
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1');
  const targetPath = requestUrl.pathname === '/' ? indexPath : getFilePath(requestUrl.pathname.slice(1));

  if (existsSync(targetPath)) {
    const extension = extname(targetPath);
    response.writeHead(200, {
      'Content-Type': contentTypes[extension] ?? 'application/octet-stream',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=300'
    });
    createReadStream(targetPath).pipe(response);
    return;
  }

  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache'
  });
  response.end(await readFile(indexPath, 'utf8'));
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Murmura web dist server listening on http://127.0.0.1:${port}`);
});
