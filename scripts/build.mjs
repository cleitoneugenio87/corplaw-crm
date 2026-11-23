import { cp, mkdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await mkdir(new URL('dist/', root), { recursive: true });
for (const file of ['index.html', 'app.js', 'data.js', 'style.css', 'alinhamento.css', 'flows.css', 'interface.css', 'assets']) {
  await cp(new URL(file, root), new URL(`dist/${file}`, root), { recursive: true });
}
console.log('Interface estática gerada em dist/. Nenhuma publicação executada.');
