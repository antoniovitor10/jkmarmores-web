/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Vitor/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const base = process.env.QA_URL || 'http://127.0.0.1:3102/2/';
const output = process.env.QA_OUTPUT_DIR || __dirname;
fs.mkdirSync(output, { recursive: true });
const axePath = path.join(process.cwd(), '.maestri/audit-tools/node_modules/axe-core/axe.min.js');
const categories = ['marmore', 'granito', 'marmore-dolomitico', 'quartzito', 'quartzo', 'ultracompacto'];

(async () => {
 const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
 const results = [];
 try {
  for (const width of [390, 1440]) {
   const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, isMobile: width === 390, hasTouch: width === 390 });
   const page = await context.newPage();
   const errors = [];
   page.on('pageerror', error => errors.push(error.message));
   page.on('response', response => { if (response.status() >= 400) errors.push(response.status() + ' ' + response.url()); });
   for (const route of ['sobre/', 'materiais/', ...categories.map(slug => `materiais/${slug}/`), 'contato/']) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.addScriptTag({ path: axePath });
    const data = await page.evaluate(async () => {
     const schema = [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)).find(item => item['@type'] === 'LocalBusiness');
     const h1 = document.querySelector('h1');
     return {
      h1: h1.textContent, h1Count: document.querySelectorAll('h1').length,
      font: getComputedStyle(h1).fontFamily, weight: getComputedStyle(h1).fontWeight,
      overflow: document.documentElement.scrollWidth > innerWidth,
      noindex: document.querySelector('meta[name="robots"]').content.includes('noindex'),
      foundingDate: schema.foundingDate, areas: schema.areaServed,
      badLinks: [...document.querySelectorAll('a[href]')].filter(a => a.origin === location.origin && !a.pathname.startsWith('/2/')).map(a => a.href),
      violations: (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } })).violations.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.map(node => node.target) })),
     };
    });
    assert.equal(data.h1Count, 1); assert.equal(data.overflow, false); assert.equal(data.noindex, true);
    assert.equal(data.foundingDate, '2010'); assert.equal(data.areas.length, 6);
    assert.equal(data.weight, '300'); assert.ok(!data.font.includes('Bodoni'));
    assert.equal(data.badLinks.length, 0);
    if (route === 'sobre/') {
     await assert.doesNotReject(() => page.getByText('Desde 2010.', { exact: true }).waitFor());
     await assert.doesNotReject(() => page.getByRole('heading', { name: 'Onde a matéria-prima encontra a precisão. E o bruto vira arte.' }).waitFor());
    }
    if (route === 'materiais/') assert.equal(await page.locator('.material-categories > li').count(), 6);
    if (['sobre/', 'materiais/'].includes(route)) {
     // Materializa imagens lazy e revelações antes da captura integral.
     await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight * .7) { scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } });
     await page.waitForTimeout(1100); await page.evaluate(() => scrollTo(0, 0));
     await page.screenshot({ path: path.join(output, `${width}-${route.replace('/', '')}.png`), fullPage: true });
    }
    results.push({ width, route, ...data });
   }
   assert.deepEqual(errors, []); await context.close();
  }
  for (const width of [320, 720]) {
   const context = await browser.newContext({ viewport: { width, height: 844 }, javaScriptEnabled: false });
   const page = await context.newPage();
   for (const route of ['sobre/', 'materiais/', 'materiais/ultracompacto/']) {
    await page.goto(base + route);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (route === 'materiais/') assert.equal(await page.locator('.material-categories > li').count(), 6);
    results.push({ width, route, javaScript: false, overflow: false });
   }
   await context.close();
  }
  assert.deepEqual(results.filter(item => item.violations?.length), []);
  console.log('Conteúdo, fontes, SEO, navegação e axe: ' + results.length + ' cenários aprovados.');
 } finally { await browser.close(); fs.writeFileSync(path.join(output, 'conteudo.json'), JSON.stringify(results, null, 2)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
