import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const portArg = process.argv.indexOf('--port');
const port = Number(portArg >= 0 ? process.argv[portArg + 1] : process.env.PORT || 4190);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.ttf': 'font/ttf', '.woff2': 'font/woff2' };
const publicFiles = new Set(['index.html', 'app.js', 'data.js', 'style.css', 'alinhamento.css', 'flows.css', 'interface.css']);

export const server = createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '') || 'index.html';
    const file = resolve(root, path);
    if (!file.startsWith(root + sep) || (!publicFiles.has(path) && !/^assets\/[\w.-]+$/.test(path))) {
      res.writeHead(404).end('Não encontrado');
      return;
    }
    if (!(await stat(file)).isFile()) throw new Error('not a file');
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch {
    res.writeHead(404).end('Não encontrado');
  }
});

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  server.listen(port, '127.0.0.1', () => console.log(`CorpLaw CRM: http://localhost:${port}`));
}
