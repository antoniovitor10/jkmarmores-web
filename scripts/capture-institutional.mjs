import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const requireAudit = createRequire(path.join(process.env.AUDIT_MODULES, 'audit.cjs'));
const puppeteer = requireAudit('puppeteer-core');
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const results = { environment: 'Emulação Chrome, DPR 1, 390x844 e 1440x900. Captura integral da home no modo estático acessível para mostrar os quatro quadros; rolagem animada documentada separadamente.', pages: [], errors: [] };
try {
  const page = await browser.newPage();
  page.on('pageerror', e => results.errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) results.errors.push(`${r.status()} ${r.url()}`); });
  // Evita ativação automática do 3D nas capturas documentais longas.
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  for (const width of [390, 1440]) {
    await page.setViewport({ width, height: width === 390 ? 844 : 900, deviceScaleFactor: 1 });
    for (const [name, route] of [['home','/'], ['sobre','/sobre/'], ['materiais','/materiais/'], ['contato','/contato/'], ['aplicacoes','/aplicacoes/'], ['galeria','/galeria/'], ['material-pendente','/materiais/pendente/'], ['aplicacao-pendente','/aplicacoes/pendente/']]) {
      if (process.env.CAPTURE_ROUTES && !process.env.CAPTURE_ROUTES.split(',').includes(name)) continue;
      await page.goto(`http://127.0.0.1:3105${route}`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      // Percorre a página para que os lazy loads correspondam ao que o visitante vê.
      await page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = 'auto';
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0,y); await new Promise(resolve => setTimeout(resolve,70)); }
        await Promise.all([...document.images].filter(img => img.currentSrc && img.getBoundingClientRect().width > 0).map(img => img.decode().catch(() => {})));
        scrollTo(0,0);
      });
      const state = await page.evaluate(() => ({
        title: document.title, h1: [...document.querySelectorAll('h1')].map(el => el.textContent),
        overflow: document.documentElement.scrollWidth > innerWidth,
        noindex: document.querySelector('meta[name="robots"]').content,
        canonical: document.querySelector('link[rel="canonical"]').href,
        schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)),
        phones: [...document.querySelectorAll('a[href^="tel:"]')].map(el => el.href),
        whatsapp: [...document.querySelectorAll('a')].map(el => el.href).filter(href => /wa\.me|api\.whatsapp/.test(href)),
        images: [...document.images].filter(img => img.getBoundingClientRect().width > 0).map(img => ({ url: img.currentSrc, complete: img.complete && img.naturalWidth > 0 })),
        logo: [...document.querySelectorAll('.brand-image')].map(img => ({ url: img.currentSrc, naturalWidth: img.naturalWidth, width: img.getBoundingClientRect().width })),
        videos: document.querySelectorAll('video').length,
        bodyFont: getComputedStyle(document.body).fontFamily,
        displayFont: getComputedStyle(document.querySelector('h1')).fontFamily,
      }));
      assert.equal(state.h1.length,1);
      assert.equal(state.overflow,false);
      assert.ok(state.noindex.includes('noindex'));
      assert.ok(state.phones.every(url => url === 'tel:+5511967976902'));
      assert.ok(state.whatsapp.length > 0 && state.whatsapp.every(url => url.startsWith('https://wa.me/5511967976902?text=')), 'Todos os destinos devem usar o WhatsApp confirmado');
      const business = state.schema.find(item => item['@type'] === 'LocalBusiness');
      assert.equal(business.name,'JK Marmores e Granitos');
      assert.equal(business.telephone,'+5511967976902');
      assert.equal(business.address.addressLocality,'Barueri');
      assert.equal(business.address.addressRegion,'SP');
      assert.ok(!business.address.postalCode && !business.taxID && !business.openingHours);
      assert.ok(!JSON.stringify(business).includes('__pendente'));
      assert.ok(state.images.every(img => img.complete),'Imagens visíveis devem carregar');
      assert.equal(state.videos,0);
      assert.ok(/homeBody|InstrumentBody/i.test(state.bodyFont));
      const file = `docs/proposta/capturas/${process.env.AUDIT_LABEL ?? 'institucional'}-${name}-${width}-inteira.png`;
      await page.screenshot({ path: file, fullPage: true });
      results.pages.push({ route, width, capture: file, ...state });
    }
  }
  assert.deepEqual(results.errors,[]);
  await fs.writeFile(`docs/auditorias/2026-09-27-${process.env.AUDIT_LABEL ?? 'institucional'}-paginas.json`,JSON.stringify(results,null,2));
  console.log(`Capturas e verificações de ${results.pages.length} páginas/viewports concluídas.`);
} finally { await browser.close(); }
