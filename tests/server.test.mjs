import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { server } from '../scripts/serve.mjs';
let base;
before(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));
test('entrada e assets locais servidos com MIME correto', async () => {
  for (const [path, type] of [['/', 'text/html'], ['/app.js', 'text/javascript'], ['/assets/logo.png', 'image/png']]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.ok(response.headers.get('content-type').startsWith(type));
  }
  assert.match(await (await fetch(base)).text(), /connect-src 'none'/);
});
test('servidor expõe apenas interface e recusa escrita', async () => {
  for (const path of ['/package.json', '/tests/server.test.mjs', '/.env', '/%2e%2e/package.json', '/assets/%2e%2e/package.json']) {
    assert.equal((await fetch(base + path)).status, 404);
  }
  assert.equal((await fetch(base, { method: 'POST', body: 'teste' })).status, 405);
});
