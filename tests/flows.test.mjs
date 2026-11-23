import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

// DOM tests verify state/transitions only. Native dialog, focus and rendering
// require the separate Playwright suite; these shims do not validate layout.
const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
function app() {
  const dom = new JSDOM(read('index.html'), { url: 'http://localhost:4190/', runScripts: 'outside-only' });
  const w = dom.window;
  w.structuredClone = structuredClone;
  w.scrollTo = () => {};
  w.performance.getEntriesByType = () => [];
  w.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  w.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new w.Event('close')); };
  const style = w.document.createElement('style');
  style.textContent = 'body[data-profile=reader] .manager-only { display: none; }';
  w.document.head.append(style);
  w.eval(read('data.js') + '\n' + read('app.js'));
  return dom;
}
test('18 verificações funcionais dos quatro percursos finais', () => {
  const dom = app();
  try {
    for (let i = 1; i <= 4; i++) {
      let source = read(`tests/fixtures/flow-check-${i}.js`);
      // Explicitly omit the source's geometry assertion: jsdom has no layout.
      source = source.replace(/check\('Page and open dialog fit viewport',[^;]+;/, '');
      const result = dom.window.eval(source);
      assert.equal(result.passed, true, JSON.stringify(result));
    }
    assert.equal(dom.window.flowChecks.length, 18);
  } finally { dom.window.close(); }
});
test('27 verificações de regressão da proposta', () => {
  const dom = app();
  try {
    const result = dom.window.eval(read('tests/fixtures/verify.js'));
    assert.equal(result.passed, true, JSON.stringify(result));
    assert.equal(result.total, 27);
  } finally { dom.window.close(); }
});
test('etapa ocupada não pode ser removida, e nomes de funil não se repetem', () => {
  const dom = app(), w = dom.window, q = s => w.document.querySelector(s);
  try {
    q('[data-config-funnel]').click();
    q('#funnel-stages').value = 'Entrada\nQualificação\nReunião';
    q('#funnel-form').requestSubmit();
    assert.match(q('#funnel-error').textContent, /tem oportunidades/);
    assert.equal(w.designState().stages.length, 4);
    q('dialog').close();
    [...w.document.querySelectorAll('[data-nav]')].find(el => el.dataset.nav === 'ajustes').click();
    q('[data-new-funnel]').click();
    q('#funnel-name').value = 'Parcerias';
    q('#funnel-form').requestSubmit();
    q('[data-config-funnel]').click();
    q('#funnel-name').value = 'Novos negócios';
    q('#funnel-form').requestSubmit();
    assert.match(q('#funnel-error').textContent, /Nome já usado/);
  } finally { w.close(); }
});
test('falha de Agenda mantém cenário ao editar e não cria reunião', () => {
  const dom = app(), w = dom.window, q = s => w.document.querySelector(s);
  try {
    q('[data-open="d1"]').click();
    q('#schedule').click();
    q('#meeting-scenario').value = 'error';
    q('#meeting-form').requestSubmit();
    q('#edit-meeting').click();
    assert.equal(q('#meeting-scenario').value, 'error');
    assert.equal(w.designState().deals[0].meeting, false);
  } finally { w.close(); }
});
test('hash navega entre áreas e atalho de conteúdo preserva a área', () => {
  const dom = app(), w = dom.window, q = s => w.document.querySelector(s);
  try {
    w.location.hash = 'catalogo';
    w.dispatchEvent(new w.HashChangeEvent('hashchange'));
    assert.equal(w.designState().section, 'catalogo');
    q('.skip').click();
    assert.equal(w.designState().section, 'catalogo');
    assert.equal(w.document.activeElement.id, 'main');
    assert.equal(w.location.hash, '#catalogo');
    assert.equal(q('.demo a').getAttribute('href'), '#ajustes');
    q('.demo a').click();
    assert.equal(w.designState().section, 'ajustes');
  } finally { w.close(); }
});
