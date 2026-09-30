/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const ts = require('typescript');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Vitor/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
const base = process.env.QA_URL || 'https://jkmarmores.com.br/2/';
const label = process.env.QA_LABEL || 'publica';
const output = process.env.QA_OUTPUT_DIR || __dirname;
fs.mkdirSync(output, { recursive: true });
const code = ts.transpileModule(fs.readFileSync('src/lib/motion-network.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const fast = { startTime: 0, responseStart: 100, responseEnd: 200, transferSize: 33000, encodedBodySize: 32768 };
const slow = { ...fast, responseEnd: 1600 };
const low = { effectiveType: '4g', downlink: .3 };
const cases = [
 ['navegação rápida vence estimativa baixa', low, fast, null, 'allowed'],
 ['poster rápido vence estimativa baixa', low, null, fast, 'allowed'],
 ['150 KB/s é amostra rápida', low, { ...fast, encodedBodySize: 153600, responseEnd: 1100 }, null, 'allowed'],
 ['amostra abaixo de 150 KB/s é lenta', low, slow, null, 'slow-response'],
 ['Save-Data veta amostra rápida', { ...low, saveData: true }, fast, null, 'slow-connection'],
 ['3G veta amostra rápida', { ...low, effectiveType: '3g' }, fast, null, 'slow-connection'],
 ['2G veta amostra rápida', { ...low, effectiveType: '2g' }, fast, null, 'slow-connection'],
 ['poster lento veta navegação rápida', low, fast, slow, 'slow-response'],
 ['navegação lenta veta poster rápido', low, slow, fast, 'slow-response'],
 ['TTFB lento veta transferência rápida', low, { ...fast, responseStart: 700, responseEnd: 750 }, null, 'slow-response'],
 ['cache não mede conexão atual', low, { ...fast, transferSize: 0 }, null, 'slow-connection'],
 ['sem amostra estimativa baixa continua vetando', low, null, null, 'slow-connection'],
 ['aparelho limitado permanece estático', low, fast, null, 'limited-device', 2],
 ['sem API nem amostra permanece conservador', undefined, null, null, 'unmeasured'],
];
for (const [name, connection, navigation, poster, expected, memory = 8] of cases) {
 const caseModule = { exports: {} };
 vm.runInNewContext(code, { exports: caseModule.exports, module: caseModule, navigator: { deviceMemory: memory }, performance: { getEntriesByType: type => type === 'navigation' ? [navigation].filter(Boolean) : poster ? [{ ...poster, name: '/2/img/capa-editorial-mobile-768.avif' }] : [] } });
 assert.equal(caseModule.exports.motionNetworkPolicy(connection), expected, name);
}

(async () => {
 const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
 const results = [];
 try {
  for (const mode of ['native', 'low-estimate', 'save-data', '3g', 'reduced']) {
   const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
   const page = await context.newPage(), errors = [], requests = [];
   page.on('pageerror', error => errors.push(error.message));
   page.on('response', response => { if (response.status() >= 400) errors.push(response.status() + ' ' + response.url()); });
   page.on('request', request => requests.push(request.url()));
   await page.addInitScript(mode => {
    if (mode !== 'native') Object.defineProperty(navigator, 'connection', { configurable: true, value: { effectiveType: mode === '3g' ? '3g' : '4g', downlink: .3, saveData: mode === 'save-data', addEventListener() {}, removeEventListener() {} } });
   }, mode);
   // Sem throttling de rede; altera apenas a estimativa da API nos casos indicados.
   await page.goto(base, { waitUntil: 'networkidle' });
   const samples = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const poster = performance.getEntriesByType('resource').find(entry => /\/img\/(capa-|material-detalhe-quente-)/.test(entry.name));
    return [nav, poster].filter(Boolean).map(entry => ({ name: entry.name, transferSize: entry.transferSize, bytes: entry.encodedBodySize, ttfbMs: entry.responseStart - entry.startTime, bodyMs: entry.responseEnd - entry.responseStart, KBps: entry.encodedBodySize / (entry.responseEnd - entry.responseStart) * 1000 / 1024 }));
   });
   await page.locator('.journey-track').scrollIntoViewIfNeeded();
   const animated = ['native', 'low-estimate'].includes(mode);
   if (animated) await page.waitForFunction(() => document.querySelector('.journey-track')?.hasAttribute('data-enhanced'), null, { timeout: 10000 });
   else await page.waitForTimeout(1200);
   const enhanced = await page.locator('.journey-track').evaluate(el => el.hasAttribute('data-enhanced'));
   assert.equal(enhanced, animated, mode + ': movimento');
   let stages = [];
   if (animated) {
    assert.ok(samples.some(entry => entry.transferSize > 0 && entry.bytes >= 8192 && entry.KBps >= 150), 'amostra real rápida');
    for (const progress of [.29, .5]) {
     await page.locator('.journey-track').evaluate((el, progress) => scrollTo(0, el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * progress), progress);
     await page.waitForTimeout(700);
     stages.push(await page.locator('.journey-frame[data-current="true"]').getAttribute('data-frame'));
    }
    assert.deepEqual(stages, ['0', '1']);
    const pictureClip = await page.locator('.journey-frame').nth(1).evaluate(el => getComputedStyle(el).clipPath);
    assert.equal(pictureClip, 'inset(0%)');
   }
   assert.deepEqual(errors, []); assert.equal(requests.some(url => /\.mp4(?:\?|$)/.test(url)), false);
   const heroLite = await page.locator('.home-hero').getAttribute('data-lite');
   results.push({ mode, url: base, viewport: '390x844', networkThrottling: false, enhanced, heroLite, stages, samples, errors });
   await page.screenshot({ path: path.join(output, `${label}-${mode}.png`) });
   await context.close();
  }
  console.log('14 verificações da política e 5 cenários mobile aprovados em ' + base);
 } finally { await browser.close(); fs.writeFileSync(path.join(output, `${label}.json`), JSON.stringify(results, null, 2)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
