import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer = require('puppeteer-core');
const directory = 'docs/auditorias/versao-1/telas-largas-2026-10-01';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-first-run', '--disable-extensions'] });
process.once('SIGINT', async () => { await browser.close(); process.exit(130); });
const report = { cases: [], errors: [] };
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  const page = await browser.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'connection', { value: { saveData: false, effectiveType: '4g', downlink: 10 } });
    window.auditTasks = [];
    new PerformanceObserver(list => window.auditTasks.push(...list.getEntries().map(e => ({ start: e.startTime, duration: e.duration })))).observe({ type: 'longtask', buffered: true });
  });
  const cdp = await page.createCDPSession();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  for (const width of [390, 1440]) {
    const height = width === 390 ? 844 : 900;
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width === 390, hasTouch: width === 390 });
    await page.goto('http://127.0.0.1:3111/1/', { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.querySelector('.prologo')?.dataset.enhanced === 'true');
    await delay(1900);
    const row = { width, height, maxEntryTask: await page.evaluate(() => Math.max(0, ...window.auditTasks.map(t => t.duration))), dockChecks: [] };
    report.cases.push(row);
    const distance = await page.$eval('.prologo', el => el.offsetHeight - el.querySelector('.home-hero').offsetHeight);
    await page.evaluate(() => { window.auditGaps = []; window.auditRecording = true; let previous = 0; function frame(time) { if (previous) window.auditGaps.push(time - previous); previous = time; if (window.auditRecording) requestAnimationFrame(frame); } requestAnimationFrame(frame); });
    const start = await page.evaluate(() => performance.now());
    await cdp.send('Input.synthesizeScrollGesture', { x: Math.round(width * .5), y: 600, yDistance: -Math.round(distance + 2400), speed: 700, gestureSourceType: width === 390 ? 'touch' : 'mouse' });
    await page.evaluate(() => { window.auditRecording = false; });
    row.scroll = await page.evaluate(start => ({ frames: window.auditGaps.length, maxGapMs: Math.max(0, ...window.auditGaps), gapsAbove50ms: window.auditGaps.filter(g => g > 50).length, maxLongTaskMs: Math.max(0, ...window.auditTasks.filter(t => t.start >= start).map(t => t.duration)) }), start);
    const checkDock = async state => {
      await delay(250);
      row.dockChecks.push(await page.evaluate(state => {
        const dock = document.querySelector('.mobile-quote-dock');
        const visible = dock.dataset.visible === 'true';
        const bounds = dock.getBoundingClientRect();
        const covered = [];
        if (visible) {
          const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!node.textContent.trim() || node.parentElement.closest('script,style,svg')) continue;
            let hidden = false;
            for (let e = node.parentElement; e; e = e.parentElement) { const style = getComputedStyle(e); if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) < .1) hidden = true; }
            if (hidden) continue;
            const range = document.createRange(); range.selectNodeContents(node);
            if ([...range.getClientRects()].some(r => Math.min(r.right, bounds.right) - Math.max(r.left, bounds.left) > 3 && Math.min(r.bottom, bounds.bottom) - Math.max(r.top, bounds.top) > 3)) covered.push(node.textContent.trim());
          }
        }
        return { state, visible, inert: dock.inert, covered, overflow: document.documentElement.scrollWidth > innerWidth };
      }, state));
    };
    for (const selector of ['.stone-panel-0', '.home-materials', '#configurador', '.request-story', '.contact-panel', '.site-footer']) {
      await page.$eval(selector, e => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await checkDock(selector);
      if (width === 390 && ['.home-materials', '#configurador'].includes(selector)) await page.screenshot({ path: `${directory}/mobile-${selector.replace(/[.#]/g, '')}-${width}.jpg`, type: 'jpeg', quality: 80 });
    }
    await page.$eval('.stone-panel-0', e => e.scrollIntoView());
    await delay(300);
    row.dockFocusable = await page.$eval('.mobile-quote-dock', e => { const link = e.querySelector('a'); link.focus(); return !e.inert && document.activeElement === link; });
    await page.$eval('#configurador', e => e.scrollIntoView());
    const button = await page.$('.selector-controls button:last-child');
    await button.evaluate(e => e.scrollIntoView({ block: 'center' }));
    const before = await page.$eval('.selector-caption', e => e.textContent);
    if (width === 390) { const box = await button.boundingBox(); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); } else await button.click();
    await delay(250);
    row.shine = await button.evaluate(e => e.dataset.gleam === 'true');
    await page.waitForFunction(() => document.querySelector('.selector-image').getAttribute('aria-busy') === 'false');
    row.selectorChanged = before !== await page.$eval('.selector-caption', e => e.textContent);
    await delay(850);
    row.shineCleaned = await button.evaluate(e => !e.dataset.gleam);
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    row.violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })));
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    row.reducedMotion = await page.$eval('.prologo', e => e.dataset.enhanced !== 'true');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    console.log(JSON.stringify(row));
  }
  await fs.writeFile(`${directory}/regressao.json`, JSON.stringify(report, null, 2));
  if (report.errors.length || report.cases.some(c => c.violations.length || !c.selectorChanged || !c.shineCleaned || !c.dockFocusable || !c.reducedMotion || c.dockChecks.some(d => d.covered.length || d.overflow || d.visible === d.inert))) process.exitCode = 1;
} finally { await browser.close(); }
