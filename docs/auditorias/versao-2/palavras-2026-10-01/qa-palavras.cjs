/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Vitor/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('node:fs'), path = require('node:path');
const base = process.env.QA_URL || 'http://127.0.0.1:3102/2/';
const output = process.env.QA_OUTPUT_DIR || __dirname;
const widths = process.env.QA_WIDTHS ? process.env.QA_WIDTHS.split(',').map(Number) : Array.from({ length: 57 }, (_, i) => 320 + i * 40);
const heights = [800, 1000];
const fractions = Array.from({ length: 18 }, (_, i) => Number((.1 + i * .05).toFixed(2)));
// Discover every exported page, including the six materials and the 404 fallback.
const routes = fs.readdirSync('out', { recursive: true }).filter(f => /(^|[\\/])index\.html$/.test(f) && !f.startsWith('_not-found')).map(f => f.replaceAll('\\', '/').replace(/index\.html$/, '')).sort();
fs.mkdirSync(output, { recursive: true });

function inspect() {
 const failures = [], headings = [...document.querySelectorAll('h1,h2,h3')];
 let words = 0;
 const shown = e => !e.closest('script,style,noscript,[hidden]') && e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
 const checkRange = (range, word, heading) => {
  const rects = [...range.getClientRects()].filter(r => r.width > .1 && r.height > .1);
  if (!rects.length) return;
  words++;
  const first = rects[0];
  if (rects.some(r => Math.abs(r.top - first.top) > first.height * .6)) failures.push({ kind: 'split-word', word, rects: rects.map(r => r.toJSON()) });
  if (rects.some(r => r.left < -1 || r.right > innerWidth + 1)) failures.push({ kind: 'word-outside-viewport', word, rects: rects.map(r => r.toJSON()) });
  if (heading) {
   const box = heading.getBoundingClientRect();
   if (rects.some(r => r.left < box.left - 1 || r.right > box.right + 1)) failures.push({ kind: 'word-outside-title-column', word, heading: heading.textContent });
  }
 };
 for (const heading of headings.filter(shown)) {
  const style = getComputedStyle(heading);
  if (style.overflowWrap !== 'normal' || style.wordBreak !== 'normal' || style.hyphens !== 'manual') failures.push({ kind: 'heading-policy', heading: heading.textContent, overflowWrap: style.overflowWrap, wordBreak: style.wordBreak, hyphens: style.hyphens });
  // Aggregate the text nodes: this also detects a word split across nested spans.
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT), nodes = [];
  let node, text = '';
  while ((node = walker.nextNode())) {
   if (node.nodeType === Node.ELEMENT_NODE) { if (node.tagName === 'BR') text += ' '; continue; }
   nodes.push({ node, start: text.length }); text += node.textContent;
  }
  for (const word of text.matchAll(/[\p{L}\p{N}][\p{L}\p{N}\p{M}]*/gu)) {
   const start = nodes.findLast(n => n.start <= word.index), endIndex = word.index + word[0].length;
   const end = nodes.findLast(n => n.start < endIndex);
   const range = document.createRange(); range.setStart(start.node, word.index - start.start); range.setEnd(end.node, endIndex - end.start);
   checkRange(range, word[0], heading);
  }
 }
 // Scan ordinary prose and interface labels too. Explicit URL/email data can wrap.
 const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
 let node;
 while ((node = walker.nextNode())) {
  const e = node.parentElement;
  if (!e || !shown(e) || e.closest('h1,h2,h3,.contact-data,a[href^="mailto:"]') || /https?:\/\/|\S+@\S+/.test(node.textContent)) continue;
  for (const word of node.textContent.matchAll(/[\p{L}\p{N}][\p{L}\p{N}\p{M}]*/gu)) {
   const range = document.createRange(); range.setStart(node, word.index); range.setEnd(node, word.index + word[0].length);
   checkRange(range, word[0]);
  }
 }
 if (document.documentElement.scrollWidth > innerWidth || document.body.scrollWidth > innerWidth) failures.push({ kind: 'horizontal-overflow', viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth });
 return { words, headings: headings.filter(shown).length, failures };
}

(async () => {
 const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
 const results = { base, widths, heights, routes, fractions, pages: 0, journeyStates: 0, words: 0, failures: [], screenshots: [] };
 const record = (result, context) => {
  results.words += result.words;
  results.failures.push(...result.failures.map(f => ({ ...context, ...f })));
 };
 try {
  const context = await browser.newContext({ viewport: { width: 880, height: 800 } });
  const page = await context.newPage();
  for (const route of routes) {
   const response = await page.goto(base + route, { waitUntil: 'networkidle' });
   if (response.status() >= 400) throw Error(`HTTP ${response.status()}: ${route}`);
   await page.evaluate(() => document.fonts.ready);
   for (const height of heights) for (const width of widths) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    record(await page.evaluate(inspect), { route, width, height }); results.pages++;
   }
   console.log(`${route || '/'}: ${widths.length * heights.length} layouts examinados.`);
  }
  await page.goto(base, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
  await page.locator('.journey-track').evaluate(e => scrollTo(0, e.offsetTop));
  await page.waitForFunction(() => document.querySelector('.journey-track')?.hasAttribute('data-enhanced'));
  // Four isolated pages test real native scroll and the authored .35 s scrub.
  // No animation timing, CSS, network policy or site implementation is replaced.
  await Promise.all(Array.from({ length: 4 }, async (_, worker) => {
   const journeyPage = await context.newPage();
   for (const height of heights) for (const width of widths.filter((_, i) => i % 4 === worker)) {
    // Each viewport starts with a fresh visit, like the client's actual devices.
    await journeyPage.setViewportSize({ width, height });
    await journeyPage.goto(base, { waitUntil: 'networkidle' }); await journeyPage.evaluate(() => document.fonts.ready);
    await journeyPage.locator('.journey-track').evaluate(e => scrollTo(0, e.getBoundingClientRect().top + scrollY));
    await journeyPage.waitForFunction(() => document.querySelector('.journey-track')?.hasAttribute('data-enhanced'));
    await journeyPage.waitForTimeout(300);
    for (const fraction of fractions) {
     await journeyPage.locator('.journey-track').evaluate((root, f) => scrollTo(0, root.getBoundingClientRect().top + scrollY + (root.offsetHeight - innerHeight) * f), fraction);
     // A media-query change can remount GSAP and browser scroll anchoring can
     // move the viewport after resize. Reapply the target after layout settles.
     await journeyPage.waitForTimeout(100);
     await journeyPage.locator('.journey-track').evaluate((root, f) => scrollTo(0, root.getBoundingClientRect().top + scrollY + (root.offsetHeight - innerHeight) * f), fraction);
     await journeyPage.waitForFunction(f => {
      const root = document.querySelector('.journey-track');
      const expected = Math.min(3, Math.max(0, Math.floor((f * 5.8 - 1) / 1.2)));
      return root.hasAttribute('data-enhanced') && document.querySelector('[data-current="true"]')?.dataset.frame === String(expected) && Math.abs(root.getBoundingClientRect().top + (root.offsetHeight - innerHeight) * f) < 2;
     }, fraction, { timeout: 5000 }).catch(async error => {
      console.error(JSON.stringify({ width, height, fraction, state: await journeyPage.evaluate(() => ({ viewport: [innerWidth, innerHeight], scroll: scrollY, root: document.querySelector('.journey-track').getBoundingClientRect().toJSON(), sticky: document.querySelector('.journey-sticky').getBoundingClientRect().toJSON(), current: document.querySelector('[data-current="true"]')?.dataset.frame, enhanced: document.querySelector('.journey-track').dataset.enhanced })) }));
      throw error;
     });
     await journeyPage.waitForTimeout(450);
     const result = await journeyPage.evaluate(inspect);
     const sceneFailures = await journeyPage.evaluate(() => {
      const title = document.querySelector('.journey-heading h2').getBoundingClientRect();
      const caption = document.querySelector('[data-current="true"] figcaption')?.getBoundingClientRect();
      if (!caption) return [{ kind: 'journey-current-frame-missing' }];
      const media = document.querySelector('[data-current="true"] .journey-media').getBoundingClientRect();
      const collision = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
      const failures = [];
      if (collision(title, caption) || collision(title, media) || collision(caption, media)) failures.push({ kind: 'journey-overlap' });
      if (title.top < -1 || title.bottom > innerHeight || caption.top < -1 || caption.bottom > innerHeight) failures.push({ kind: 'journey-copy-outside-viewport', title: title.toJSON(), caption: caption.toJSON(), root: document.querySelector('.journey-track').getBoundingClientRect().toJSON() });
      return failures;
     });
     result.failures.push(...sceneFailures); record(result, { route: '', width, height, fraction }); results.journeyStates++;
    }
    console.log(`Jornada ${width}x${height}: 18 estados examinados.`);
   }
   await journeyPage.close();
  }));
  // Extra boundary widths missed by the 40 px increment, plus captures for review.
  for (const route of ['', 'materiais/', 'materiais/ultracompacto/', 'contato/']) {
   await page.goto(base + route, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
   for (const width of [320, 390, 768, 880, 1000, 1024, 1025, 1440, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    record(await page.evaluate(inspect), { route, width, height: 1000, extra: true }); results.pages++;
    if ([390, 880, 1440].includes(width)) {
     const file = `${route.replaceAll('/', '-') || 'home-'}${width}.jpg`;
     // Visit the whole page before capturing so native lazy images are loaded.
     await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * .8) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
      await Promise.all([...document.images].filter(img => img.complete).map(img => img.decode().catch(() => {})));
      scrollTo(0, 0);
     });
     await page.waitForTimeout(500);
     await page.screenshot({ path: path.join(output, file), fullPage: true, type: 'jpeg', quality: 80 }); results.screenshots.push(file);
    }
   }
  }
 } catch (error) {
  results.failures.push({ kind: 'harness-error', message: error.message });
  throw error;
 } finally {
  await browser.close();
  fs.writeFileSync(path.join(output, 'palavras.json'), JSON.stringify(results, null, 2));
 }
 console.log(`RESULTADO: ${results.pages} layouts, ${results.journeyStates} estados da jornada, ${results.words} palavras; ${results.failures.length} falhas.`);
 if (results.failures.length) { console.error(JSON.stringify(results.failures.slice(0, 40), null, 2)); process.exitCode = 1; }
})().catch(e => { console.error(e); process.exitCode = 1; });
