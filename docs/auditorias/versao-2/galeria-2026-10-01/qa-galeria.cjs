/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Vitor/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), sharp = require('sharp');
const base = process.env.QA_URL || 'http://127.0.0.1:3102/2/';
const output = process.env.QA_OUTPUT_DIR || __dirname;
fs.mkdirSync(output, { recursive: true });
const luminance = rgb => rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((n, v, i) => n + v * [.2126, .7152, .0722][i], 0);

(async () => {
 const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
 const rows = [];
 try {
  for (const width of [390, 1440]) {
   const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 2, isMobile: width === 390, hasTouch: width === 390 });
   const page = await context.newPage(), errors = [], requests = [];
   page.on('pageerror', e => errors.push(e.message));
   page.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
   page.on('request', r => requests.push(r.url()));
   await page.goto(base, { waitUntil: 'networkidle' }); await page.waitForTimeout(1400);
   const hero = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, hero: document.querySelector('.home-hero').getBoundingClientRect().toJSON(), cta: document.querySelector('.home-hero .button').getBoundingClientRect().toJSON(), image: document.querySelector('.home-hero img').currentSrc, overflow: document.documentElement.scrollWidth > innerWidth, rects: ['h1', 'p'].map(s => document.querySelector('.home-hero ' + s).getBoundingClientRect().toJSON()), icons: [...document.querySelectorAll('link[rel="icon"],link[rel="apple-touch-icon"]')].map(e => ({ rel: e.rel, href: e.getAttribute('href') })) }));
   assert.equal(hero.hero.height, hero.height); assert.equal(hero.hero.width, width); assert.equal(hero.overflow, false); assert.ok(hero.cta.bottom < hero.height);
   assert.ok(hero.icons.some(e => e.rel === 'icon' && e.href.startsWith('/2/icon.png')));
   assert.ok(hero.icons.some(e => e.rel === 'apple-touch-icon' && e.href.startsWith('/2/apple-icon.png')));
   const original = await page.screenshot({ path: path.join(output, `${width}-capa.png`) });
   // Capture only the background; the normal image is kept as the deliverable.
   // CSS module names differ across builds, so target the support line semantically.
   await page.locator('.home-hero h1').evaluate(e => e.parentElement.style.visibility = 'hidden');
   const backdrop = await page.screenshot();
   await page.locator('.home-hero h1').evaluate(e => e.parentElement.style.removeProperty('visibility'));
   const normal = await sharp(original).removeAlpha().raw().toBuffer({ resolveWithObject: true });
   const behind = await sharp(backdrop).removeAlpha().raw().toBuffer();
   const contrasts = hero.rects.map((r, index) => {
    let min = Infinity, count = 0;
    for (let y = Math.ceil(r.top * 2); y < Math.floor(r.bottom * 2); y++) for (let x = Math.ceil(r.left * 2); x < Math.floor(r.right * 2); x++) {
     const offset = (y * normal.info.width + x) * 3;
     const foreground = [...normal.data.subarray(offset, offset + 3)], background = [...behind.subarray(offset, offset + 3)];
     if (foreground.every(v => v >= 245) && foreground.some((v, i) => v - background[i] > 40)) { min = Math.min(min, 1.05 / (luminance(background) + .05)); count++; }
    }
    assert.ok(count > 20, 'amostra de glifos'); assert.ok(min >= (index ? 4.5 : 3), 'contraste sobre a imagem: ' + min);
    return { element: index ? 'apoio' : 'titulo', minimum: min, sampledPixels: count };
   });
   await page.locator('.journey-track').evaluate(e => scrollTo(0, e.getBoundingClientRect().top + scrollY)); await page.waitForTimeout(900);
   const stages = [];
   for (const fraction of [.29, .5, .7, .93]) {
    await page.locator('.journey-track').evaluate((e, f) => scrollTo(0, e.getBoundingClientRect().top + scrollY + (e.offsetHeight - innerHeight) * f), fraction); await page.waitForTimeout(800);
    const stage = await page.locator('[data-current="true"]').evaluate(e => ({ frame: e.dataset.frame, title: e.querySelector('h3').textContent, clip: getComputedStyle(e).clipPath, background: getComputedStyle(e).backgroundColor }));
    assert.notEqual(stage.background, 'rgba(0, 0, 0, 0)'); stages.push(stage);
    await page.screenshot({ path: path.join(output, `${width}-jornada-${fraction}.png`) });
   }
   assert.deepEqual(stages.map(s => s.frame), ['0', '1', '2', '3']);
   await page.locator('#configurador').scrollIntoViewIfNeeded(); await page.waitForTimeout(900);
   await page.screenshot({ path: path.join(output, `${width}-configurador.png`) });
   await page.addScriptTag({ path: path.join(process.cwd(), '.maestri/audit-tools/node_modules/axe-core/axe.min.js') });
   const violations = await page.evaluate(async () => (await axe.run()).violations.map(e => ({ id: e.id, nodes: e.nodes.map(n => n.target) })));
   assert.deepEqual(violations, []); assert.deepEqual(errors, []);
   assert.equal(requests.filter(u => /\.mp4|motion-frames/.test(u)).length, 0);
   rows.push({ width, hero, contrasts, stages, violations, errors }); await context.close();

   const staticContext = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: 'reduce' });
   const staticPage = await staticContext.newPage(); await staticPage.goto(base, { waitUntil: 'networkidle' });
   await staticPage.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight * .7) { scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } });
   await staticPage.waitForTimeout(1000); await staticPage.evaluate(() => scrollTo(0, 0));
   await staticPage.screenshot({ path: path.join(output, `${width}-home-inteira-estatica.png`), fullPage: true }); await staticContext.close();
  }
  for (const mode of ['sem-connection-cache', 'ttfb-alto', 'save-data', '3g', 'reduced']) {
   const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
   await context.addInitScript(mode => {
    Object.defineProperty(navigator, 'connection', { configurable: true, value: mode === 'sem-connection-cache' ? undefined : { saveData: mode === 'save-data', effectiveType: mode === '3g' ? '3g' : '4g', downlink: 10, addEventListener() {}, removeEventListener() {} } });
    if (['sem-connection-cache', 'ttfb-alto'].includes(mode)) {
     const get = performance.getEntriesByType.bind(performance);
     performance.getEntriesByType = type => get(type).map(e => ['navigation', 'resource'].includes(type) ? { ...e.toJSON(), transferSize: mode === 'sem-connection-cache' ? 0 : e.transferSize, responseStart: mode === 'ttfb-alto' ? e.startTime + 850 : e.responseStart, responseEnd: mode === 'ttfb-alto' ? e.startTime + 950 : e.responseEnd } : e);
    }
   }, mode);
   const page = await context.newPage(), requests = [];
   page.on('request', r => requests.push(r.url())); await page.goto(base, { waitUntil: 'networkidle' });
   const condition = await page.evaluate(() => ({ connection: navigator.connection ? { saveData: navigator.connection.saveData, effectiveType: navigator.connection.effectiveType } : null, navigation: performance.getEntriesByType('navigation')[0] }));
   if (mode === 'sem-connection-cache') { assert.equal(condition.connection, null); assert.equal(condition.navigation.transferSize, 0); }
   if (mode === 'ttfb-alto') assert.ok(condition.navigation.responseStart - condition.navigation.startTime > 600);
   await page.locator('.journey-track').evaluate(e => scrollTo(0, e.getBoundingClientRect().top + scrollY)); await page.waitForTimeout(1000);
   const enhanced = await page.locator('.journey-track').evaluate(e => e.hasAttribute('data-enhanced'));
   assert.equal(enhanced, mode !== 'reduced', mode);
   if (enhanced) {
    for (const [fraction, index] of [[.29, '0'], [.7, '2']]) {
     await page.locator('.journey-track').evaluate((e, f) => scrollTo(0, e.getBoundingClientRect().top + scrollY + (e.offsetHeight - innerHeight) * f), fraction); await page.waitForTimeout(700);
     assert.equal(await page.locator('[data-current="true"]').getAttribute('data-frame'), index, mode);
    }
   }
   const heavyRequests = requests.filter(u => /\.mp4|motion-frames/.test(u)); assert.deepEqual(heavyRequests, []);
   rows.push({ mode, enhanced, condition, heavyRequests }); await context.close();
  }
  const zoom = await browser.newContext({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const page = await zoom.newPage(); await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('.site-header .brand').screenshot({ path: path.join(output, 'logo-header-200.png') });
  await page.locator('.site-footer .brand').screenshot({ path: path.join(output, 'logo-rodape-200.png') }); await zoom.close();
  console.log('Galeria, contraste, favicon, transicoes e fallbacks: aprovados.');
 } finally { await browser.close(); fs.writeFileSync(path.join(output, 'galeria.json'), JSON.stringify(rows, null, 2)); }
})().catch(e => { console.error(e); process.exitCode = 1; });
