/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Vitor/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const base = process.env.QA_URL || 'http://127.0.0.1:3102/2/';
const output = process.env.QA_OUTPUT_DIR || __dirname;
const widths = (process.env.QA_WIDTHS || '390,768,1280,1440,1680,1920,2048,2560').split(',').map(Number);
const heights = (process.env.QA_HEIGHTS || '800,1000,1300').split(',').map(Number);
const fractions = Array.from({ length: 18 }, (_, i) => Number((.1 + i * .05).toFixed(2)));
fs.mkdirSync(output, { recursive: true });
(async () => {
 const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
 const results = [];
 try {
  for (const width of widths) for (const height of heights) {
   const context = await browser.newContext({ viewport: { width, height }, isMobile: width === 390, hasTouch: width === 390 });
   const page = await context.newPage(), errors = [];
   page.on('pageerror', e => errors.push(e.message));
   page.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
   await page.goto(base, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
   await page.locator('.journey-track').evaluate(e => scrollTo(0, e.getBoundingClientRect().top + scrollY));
   await page.waitForFunction(() => document.querySelector('.journey-track')?.hasAttribute('data-enhanced'));
   for (const fraction of fractions) {
    await page.locator('.journey-track').evaluate((e, f) => scrollTo(0, e.getBoundingClientRect().top + scrollY + (e.offsetHeight - innerHeight) * f), fraction);
    // Settle the authored .35 s scrub; inspect the actual rendered composition.
    await page.waitForTimeout(500);
    const result = await page.evaluate(() => {
     const box = e => e.getBoundingClientRect().toJSON();
     const title = document.querySelector('.journey-heading h2'), heading = document.querySelector('.journey-heading');
     const current = document.querySelector('[data-current="true"]'), caption = current.querySelector('figcaption');
     const wordFragments = [...title.textContent.matchAll(/\S+/gu)].map(word => {
      const range = document.createRange(); range.setStart(title.firstChild, word.index); range.setEnd(title.firstChild, word.index + word[0].length);
      const rects = [...range.getClientRects()].map(r => r.toJSON());
      return { word: word[0], lines: new Set(rects.map(r => Math.round(r.top))).size, rects };
     });
     const dock = document.querySelector('.mobile-quote-dock');
     const media = box(current.querySelector('.journey-media')), image = box(current.querySelector('img'));
     const style = getComputedStyle(title);
     return { width: innerWidth, height: innerHeight, heading: box(heading), title: box(title), caption: box(caption), media, visibleImage: { left: Math.max(media.left, image.left), right: Math.min(media.right, image.right), top: Math.max(media.top, image.top), bottom: Math.min(media.bottom, image.bottom) }, frame: current.dataset.frame, captionText: caption.textContent, wordFragments, wordBreak: style.wordBreak, overflowWrap: style.overflowWrap, whiteSpace: style.whiteSpace, minWidth: style.minInlineSize, titleChildElements: title.childElementCount, overflow: document.documentElement.scrollWidth > innerWidth, text: [...caption.querySelectorAll('.journey-count,h3,p,a')].map(e => ({ tag: e.tagName, text: e.textContent, rect: box(e) })), dock: dock?.dataset.visible === 'true' ? box(dock) : null, progress: box(document.querySelector('.journey-progress')) };
    });
    const collision = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
    const label = `${width}x${height} @ ${fraction}`;
    assert.equal(result.overflow, false, label + ' overflow');
    assert.equal(result.wordBreak, 'normal'); assert.equal(result.overflowWrap, 'normal'); assert.equal(result.whiteSpace, 'normal');
    assert.equal(result.titleChildElements, 0, label + ' título sem split de caracteres');
    assert.ok(result.wordFragments.every(w => w.lines === 1), label + ' palavra quebrada');
    assert.ok(result.wordFragments.every(w => w.rects.every(r => r.left >= result.title.left - 1 && r.right <= result.title.right + 1)), label + ' título fora da coluna');
    assert.ok(!collision(result.title, result.caption), label + ' título/legenda');
    assert.ok(!collision(result.title, result.visibleImage), label + ' título/imagem');
    assert.ok(!collision(result.caption, result.visibleImage), label + ' legenda/imagem');
    if (width <= 900) {
     assert.ok(Math.abs(result.media.width - (width - 48)) < 1, label + ' imagem deve ocupar a coluna inteira');
     assert.ok(Math.abs(result.caption.width - (width - 48)) < 1, label + ' legenda deve ocupar a coluna inteira');
    }
    assert.ok(result.title.top >= -1 && result.title.bottom <= height, label + ' título fora da tela');
    assert.ok(result.caption.top >= -1 && result.caption.bottom <= height, label + ' legenda fora da tela');
    for (let i = 0; i < result.text.length; i++) {
     const a = result.text[i];
     assert.ok(a.rect.left >= -1 && a.rect.right <= width + 1 && a.rect.bottom <= height, label + ' texto fora da tela');
     if (result.dock) assert.ok(!collision(a.rect, result.dock), label + ' CTA flutuante/texto: ' + a.text);
     assert.ok(!collision(a.rect, result.progress), label + ' progresso/texto');
     for (let j = i + 1; j < result.text.length; j++) assert.ok(!collision(a.rect, result.text[j].rect), label + ' textos sobrepostos');
    }
    const file = `${width}-${height}-${fraction.toFixed(2)}.jpg`;
    await page.screenshot({ path: path.join(output, file), type: 'jpeg', quality: 85 });
    results.push({ fraction, file, ...result });
   }
   assert.deepEqual(errors, []); await context.close(); console.log(`${width}x${height}: 18 estados aprovados e capturados.`);
  }
  console.log(`Total: ${results.length} estados sem sobreposição ou quebra dentro de palavras.`);
 } finally { await browser.close(); fs.writeFileSync(path.join(output, 'larguras.json'), JSON.stringify(results, null, 2)); }
})().catch(e => { console.error(e); process.exitCode = 1; });
