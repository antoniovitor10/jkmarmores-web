import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer = require('puppeteer-core');
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-first-run', '--disable-extensions'] });
const directory = 'docs/auditorias/versao-1/telas-largas-2026-10-01';
const report = [];
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await page.evaluateOnNewDocument(() => Object.defineProperty(navigator, 'connection', { value: { saveData: false, effectiveType: '4g', downlink: 10 } }));
  const cdp = await page.createCDPSession();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.setCacheEnabled(false);
  for (let attempt = 1; attempt <= 3; attempt++) {
    const trace = path.join(os.tmpdir(), `jk-v1-wide-entry-${attempt}.json`);
    await page.tracing.start({ path: trace, categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'toplevel', 'v8.execute'] });
    await page.goto('http://127.0.0.1:3111/1/', { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.querySelector('.prologo')?.dataset.enhanced === 'true');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.tracing.stop();
    const events = JSON.parse(await fs.readFile(trace, 'utf8')).traceEvents;
    const threads = new Set(events.filter(e => e.name === 'thread_name' && e.args.name === 'CrRendererMain').map(e => `${e.pid}:${e.tid}`));
    const tasks = events.filter(e => e.name === 'RunTask' && e.ph === 'X' && threads.has(`${e.pid}:${e.tid}`)).sort((a, b) => b.dur - a.dur).slice(0, 6);
    const summaries = tasks.map(task => ({ durationMs: task.dur / 1000, events: events.filter(e => e.ph === 'X' && e.pid === task.pid && e.tid === task.tid && e.ts >= task.ts && e.ts + (e.dur ?? 0) <= task.ts + task.dur && !['RunTask', 'ThreadControllerImpl::RunTask'].includes(e.name)).sort((a, b) => b.dur - a.dur).slice(0, 8).map(e => ({ name: e.name, durationMs: e.dur / 1000, data: e.args?.data })) }));
    report.push({ attempt, tasks: summaries });
    console.log(JSON.stringify({ attempt, tasks: summaries.slice(0, 2) }));
    await fs.unlink(trace);
  }
  await fs.writeFile(`${directory}/entrada.json`, JSON.stringify(report, null, 2));
} finally { await browser.close(); }
