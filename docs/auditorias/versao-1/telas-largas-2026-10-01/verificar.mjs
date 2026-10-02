import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer = require('puppeteer-core');
const directory = 'docs/auditorias/versao-1/telas-largas-2026-10-01';
const widths = process.env.AUDIT_WIDTH ? [Number(process.env.AUDIT_WIDTH)] : [1280, 1440, 1680, 1920, 2048, 2560];
const heights = process.env.AUDIT_HEIGHT ? [Number(process.env.AUDIT_HEIGHT)] : [800, 1000, 1300];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const result = { source: '4e1feecebe9aaa9542106353477bbc00a8bdf5fe + correção de clearance do WhatsApp', cases: [], errors: [], captures: [] };
await fs.mkdir(directory, { recursive: true });
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-first-run', '--disable-extensions'] });
process.once('SIGINT', async () => { await browser.close(); process.exit(130); });

function geometry() {
  const findings = [];
  const viewport = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
  const intersect = (a, b) => ({ left: Math.max(a.left, b.left), top: Math.max(a.top, b.top), right: Math.min(a.right, b.right), bottom: Math.min(a.bottom, b.bottom) });
  const visibleRect = (rect, element) => {
    let box = intersect(rect, viewport);
    for (let e = element; e; e = e.parentElement) {
      const style = getComputedStyle(e);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < .08 || e.closest('[inert]')) return null;
      const bounds = e.getBoundingClientRect();
      if (['hidden', 'clip'].includes(style.overflowX)) { box.left = Math.max(box.left, bounds.left); box.right = Math.min(box.right, bounds.right); }
      if (['hidden', 'clip'].includes(style.overflowY)) { box.top = Math.max(box.top, bounds.top); box.bottom = Math.min(box.bottom, bounds.bottom); }
    }
    return box.right - box.left > 2 && box.bottom - box.top > 2 ? box : null;
  };
  const identify = e => `${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ''}${e.classList.length ? '.' + [...e.classList].join('.') : ''}`;
  if (document.documentElement.scrollWidth > innerWidth + 1) findings.push({ type: 'horizontal-overflow', width: document.documentElement.scrollWidth });
  const texts = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    if (!parent || !node.textContent.trim() || parent.closest('script,style,svg,noscript')) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = [...range.getClientRects()].map(r => visibleRect(r, parent)).filter(Boolean);
    if (!rects.length) continue;
    const block = parent.closest('h1,h2,h3,h4,p,a,button,label,legend,li,dt,dd,figcaption') ?? parent;
    texts.push({ parent, block, text: node.textContent.trim().slice(0, 90), rects });
    for (const match of node.textContent.matchAll(/[\p{L}\p{M}\p{N}]+/gu)) {
      if (match[0].length < 3) continue;
      range.setStart(node, match.index); range.setEnd(node, match.index + match[0].length);
      const lines = [...range.getClientRects()].filter(r => r.width > .5 && r.height > .5);
      if (new Set(lines.map(r => Math.round(r.top))).size > 1) findings.push({ type: 'broken-word', word: match[0], element: identify(block), lines: lines.length });
    }
  }
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
    const a = texts[i], b = texts[j];
    if (a.block === b.block || a.parent.contains(b.parent) || b.parent.contains(a.parent)) continue;
    if (a.rects.some(r => b.rects.some(s => { const overlap = intersect(r, s); return overlap.right - overlap.left > 3 && overlap.bottom - overlap.top > 3; }))) findings.push({ type: 'text-overlap', a: a.text, b: b.text, elements: [identify(a.block), identify(b.block)] });
  }
  const dock = document.querySelector('.mobile-quote-dock[data-visible="true"]');
  if (dock && getComputedStyle(dock).opacity > .5) {
    const bounds = dock.getBoundingClientRect();
    for (const text of texts.filter(t => !dock.contains(t.parent) && t.parent.closest('main'))) if (text.rects.some(r => { const overlap = intersect(r, bounds); return overlap.right - overlap.left > 3 && overlap.bottom - overlap.top > 3; })) findings.push({ type: 'dock-covers-text', text: text.text, element: identify(text.block) });
  }
  const grids = [...document.querySelectorAll('.signature-stage,.split-heading,.stone-selector,.material-collection,.contact-grid,.request-steps,.footer-grid,.content-section,.material-detail')].filter(e => visibleRect(e.getBoundingClientRect(), e)).map(e => ({ element: identify(e), columns: getComputedStyle(e).gridTemplateColumns, children: [...e.children].map(child => Math.round(child.getBoundingClientRect().width)) }));
  for (const grid of grids) if (grid.children.some(width => width > 0 && width < 140)) findings.push({ type: 'collapsed-column', ...grid });
  const journeyTitle = document.querySelector('#stone-title');
  return { scrollY: Math.round(scrollY), findings, grids, journeyTitle: journeyTitle ? { width: Math.round(journeyTitle.getBoundingClientRect().width), height: Math.round(journeyTitle.getBoundingClientRect().height), text: journeyTitle.textContent } : null };
}

try {
  const page = await browser.newPage();
  page.on('pageerror', error => result.errors.push(error.message));
  await page.evaluateOnNewDocument(() => Object.defineProperty(navigator, 'connection', { value: { saveData: false, effectiveType: '4g', downlink: 10 } }));
  for (const width of widths) for (const height of heights) {
    const dimensions = `${width}x${height}`;
    const current = { width, height, samples: [], captures: [] };
    result.cases.push(current);
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    const check = async (state, y, capture = false, settle = 140) => {
      if (y !== undefined) await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
      await delay(settle);
      const sample = await page.evaluate(geometry);
      current.samples.push({ route: new URL(page.url()).pathname, state, ...sample });
      if (capture) {
        await page.evaluate(async () => { await Promise.all([...document.images].filter(i => { const r = i.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; }).map(i => i.decode().catch(() => {}))); });
        const file = `${dimensions}-${state}.jpg`;
        await page.screenshot({ path: `${directory}/${file}`, type: 'jpeg', quality: 76 });
        current.captures.push(file); result.captures.push({ dimensions, state, file });
      }
    };
    const top = selector => page.$eval(selector, e => e.getBoundingClientRect().top + scrollY);
    const navigate = async route => {
      await page.goto(`http://127.0.0.1:3111/1/${route}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      if (!route) await page.waitForFunction(() => document.querySelector('.prologo')?.dataset.enhanced === 'true');
      await delay(route ? 250 : 1900);
    };
    await navigate('');
    const distance = await page.$eval('.prologo', e => e.offsetHeight - e.querySelector('.home-hero').offsetHeight);
    for (const progress of [0, .2, .5, .8, 1]) await check(['capa', 'capa-saida', 'monograma-transicao', 'monograma', 'monograma-final'][[0, .2, .5, .8, 1].indexOf(progress)], distance * progress, true, 260);
    await check('assinatura', await top('.stone-signature') - height * .1, true);
    await check('jornada-titulo', await top('.stone-heading') - height * .25, true);
    for (let panel = 0; panel < 4; panel++) {
      const elementTop = await top(`.stone-panel-${panel}`);
      const elementHeight = await page.$eval(`.stone-panel-${panel}`, e => e.offsetHeight);
      for (const progress of [.15, .31, .38, .55, .8]) await check(`jornada-${panel + 1}-${Math.round(progress * 100)}`, elementTop - height + progress * (elementHeight + height), progress === .55 || (panel === 0 && progress === .31));
    }
    for (const [name, selector] of [['materiais-home', '.home-materials'], ['configurador', '#configurador'], ['pedido', '.request-story'], ['orcamento', '#orcamento'], ['contato-home', '.contact-panel'], ['rodape', '.site-footer']]) {
      if (await page.$(selector)) await check(name, await top(selector) - height * .12, true, 1000);
    }
    const buttons = await page.$$('.selector-controls button');
    for (let i = 0; i < buttons.length; i++) {
      await page.evaluate(el => el.click(), buttons[i]);
      await check(`seletor-${i}`, await top('#configurador'), false, 180);
    }
    let limit = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let y = limit; y >= 0; y -= height * .42) await check('varredura-home-reversa', y, false, 90);
    // Redimensionamento real no estado final da máscara, além de carregamentos independentes.
    await page.evaluate(y => window.scrollTo(0, y), distance);
    await page.setViewport({ width: width === 2560 ? 2048 : 2560, height, deviceScaleFactor: 1 });
    await delay(300);
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await check('monograma-apos-redimensionar', distance, false, 350);
    for (const route of ['galeria/', 'materiais/', 'sobre/', 'contato/', 'aplicacoes/']) {
      await navigate(route);
      limit = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      for (let y = 0; y <= limit + height * .42; y += height * .42) await check(`varredura-${route.slice(0, -1)}`, Math.min(y, limit), false, 90);
      await delay(1000);
      if (['galeria/', 'materiais/'].includes(route)) {
        await check(`${route.slice(0, -1)}-inicio`, 0, true, 250);
        await check(`${route.slice(0, -1)}-meio`, route === 'materiais/' ? await top('.material-collection') - height * .12 : limit * .45, true, 250);
        await check(`${route.slice(0, -1)}-final`, limit, true, 250);
      }
    }
    const failures = current.samples.filter(sample => sample.findings.length);
    console.log(JSON.stringify({ dimensions, samples: current.samples.length, captures: current.captures.length, failures: failures.length, examples: failures.slice(0, 2) }));
    await fs.writeFile(`${directory}/resultados.json`, JSON.stringify(result, null, 2));
  }
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const cards = result.captures.map(c => `<article data-size="${c.dimensions}"><a href="${c.file}"><img loading="lazy" src="${c.file}" alt="${escape(c.state)} em ${c.dimensions}"><p>${c.dimensions} · ${escape(c.state)}</p></a></article>`).join('\n');
  const options = [...new Set(result.captures.map(c => c.dimensions))].map(size => `<option>${size}</option>`).join('');
  await fs.writeFile(`${directory}/capturas.html`, `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>JK versão 1 — telas largas</title><style>body{background:#10100f;color:#eee5dc;font:16px system-ui;margin:32px}h1{font-weight:400}select{padding:12px;background:#25221f;color:inherit}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;margin-top:32px}img{width:100%;display:block}a{color:inherit;text-decoration:none}article{border:1px solid #48413b}p{padding:0 16px}article[hidden]{display:none}</style><h1>JK Mármores — verificação de telas largas</h1><p>18 combinações. Capa, monograma, assinatura, jornada, materiais, configurador, contato e galeria. Clique em uma captura para ver o tamanho original.</p><label for="size">Dimensões </label><select id="size"><option value="">Todas</option>${options}</select><main>${cards}</main><script>document.querySelector('select').addEventListener('change',e=>document.querySelectorAll('article').forEach(a=>a.hidden=!!e.target.value&&a.dataset.size!==e.target.value));</script></html>`);
  const failures = result.cases.flatMap(c => c.samples.filter(s => s.findings.length).map(s => ({ dimensions: `${c.width}x${c.height}`, ...s })));
  console.log(JSON.stringify({ cases: result.cases.length, samples: result.cases.reduce((n, c) => n + c.samples.length, 0), captures: result.captures.length, failures: failures.length, errors: result.errors }));
  if (failures.length || result.errors.length) process.exitCode = 1;
} finally { await browser.close(); }
