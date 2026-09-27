import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";

if (!process.env.AUDIT_MODULES) throw new Error("Defina AUDIT_MODULES como na auditoria da home.");
const requireAudit = createRequire(path.join(process.env.AUDIT_MODULES, "audit.cjs"));
const { default: puppeteer } = await import(pathToFileURL(requireAudit.resolve("puppeteer-core")));
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const results = { environment: "Emulacao Chrome headless; viewports 390x844 e 1440x900, DPR 1; CPU 4x nos testes de interacao; nenhum aparelho real", captures: [], fallbacks: [], errors: [] };
const label = process.env.AUDIT_LABEL ?? "institucional";
const expectVideo = process.env.EXPECT_JOURNEY_VIDEO === "1";
try {
  const page = await browser.newPage();
  page.on("pageerror", e => results.errors.push(e.message));
  await page.evaluateOnNewDocument(() => {
    window.__interactions = [];
    new PerformanceObserver(list => { for (const e of list.getEntries()) if (e.interactionId) window.__interactions.push({ name: e.name, duration: e.duration, id: e.interactionId }); }).observe({ type: "event", buffered: true, durationThreshold: 16 });
  });
  for (const width of [390, 1440]) {
    await page.setViewport({ width, height: width === 390 ? 844 : 900, deviceScaleFactor: 1 });
    await page.goto("http://127.0.0.1:3105/", { waitUntil: "networkidle0" });
    await page.waitForSelector(".journey-track[data-enhanced]");
    assert.ok(await page.$$eval(".journey-frame noscript", nodes => nodes.every(n => getComputedStyle(n).display === "none")), "Fallback noscript deve ficar oculto com JS ativo");
    await page.evaluate(() => document.fonts.ready);
    for (const [name, progress] of [["mascara", 0], ["transicao", .13], ["01", .28], ["02", .48], ["03", .71], ["04", .98]]) {
      await page.evaluate(p => {
        document.documentElement.style.scrollBehavior = "auto";
        const el = document.querySelector(".journey-track");
        const height = document.querySelector(".journey-sticky").offsetHeight;
        scrollTo(0, scrollY + el.getBoundingClientRect().top + (el.offsetHeight - height) * p);
      }, progress);
      await new Promise(resolve => setTimeout(resolve, 350));
      if (expectVideo) await page.waitForFunction(p => {
        const story = Math.max(0, Math.min(1, (p - .22) / .78));
        const position = story * 3.65;
        const index = Math.min(3, Math.floor(position + .15));
        const media = document.querySelector(`[data-frame="${index}"] .journey-video`);
        const start = index === 0 ? 0 : index - .3;
        const end = index === 3 ? 3.65 : index + .7;
        const local = Math.max(0, Math.min(1, (position - start) / (end - start)));
        return media?.readyState >= 2 && !media.seeking && Math.abs(media.currentTime - local * (media.duration - .04)) < .1;
      }, { timeout:30000 }, progress);
      await page.evaluate(() => Promise.all([...document.querySelectorAll(".journey-frame img")].map(img => img.decode())));
      const capture = `docs/proposta/capturas/${label}-${width}-${name}.png`;
      await page.screenshot({ path: capture });
      const state = await page.evaluate(() => ({
        width: innerWidth, scrollY, overflow: document.documentElement.scrollWidth > innerWidth,
        current: document.querySelector('[data-current="true"] h3')?.textContent,
        sticky: document.querySelector(".journey-sticky").getBoundingClientRect().toJSON(),
        caption: document.querySelector('[data-current="true"] figcaption').getBoundingClientRect().toJSON(),
        dock: document.querySelector(".mobile-quote-dock").getBoundingClientRect().toJSON(),
        video: document.querySelectorAll(".journey-video").length,
        videoTime: document.querySelector('[data-current="true"] .journey-video')?.currentTime ?? null,
        videoBounds: document.querySelector('[data-current="true"] .journey-video')?.getBoundingClientRect().toJSON() ?? null,
        resources: performance.getEntriesByType("resource").map(r => ({ name: new URL(r.name).pathname, bytes: r.transferSize, type: r.initiatorType })),
      }));
      assert.equal(state.overflow, false);
      if (expectVideo) assert.ok(state.video >= 1 && state.video <= 4);
      else assert.equal(state.video, 0);
      if (expectVideo) assert.ok(state.videoBounds.bottom <= state.caption.top + 1, "Vídeo não deve cobrir a legenda HTML");
      assert.ok(Math.abs(state.sticky.top) < 2);
      if (width === 390) assert.ok(state.caption.bottom <= state.dock.top, "Legenda deve terminar antes da faixa de orcamento");
      results.captures.push({ capture, progress, ...state });
    }
    // Rolagem reversa deve restaurar a primeira etapa.
    await page.evaluate(() => { const el = document.querySelector(".journey-track"); scrollTo(0, scrollY + el.getBoundingClientRect().top + (el.offsetHeight - document.querySelector(".journey-sticky").offsetHeight) * .28); });
    await page.waitForFunction(() => document.querySelector('[data-current="true"] h3')?.textContent === "Chapa");
    if (expectVideo) await page.waitForFunction(() => {
      const v = document.querySelector('[data-frame="0"] .journey-video');
      return v && !v.seeking && v.currentTime > 1.4 && v.currentTime < 1.8;
    });
  }
  const cdp = await page.createCDPSession();
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.setViewport({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:3105/", { waitUntil: "networkidle0" });
  await page.focus(".mobile-nav summary");
  await page.keyboard.press("Enter");
  assert.ok(await page.$eval(".mobile-nav", n => n.open));
  await page.keyboard.press("Enter");
  await page.focus(".journey-controls button");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => !document.querySelector(".journey-track").hasAttribute("data-enhanced"));
  await new Promise(resolve => setTimeout(resolve, 300));
  assert.equal(await page.$$eval('.journey-video', nodes => nodes.length), 0, 'Ver sem movimento deve remover todos os vídeos mesmo após eventos de seek pendentes');
  results.interactions = await page.evaluate(() => ({ samples: window.__interactions, note: "Event Timing em sessao sintetica curta, nao INP de campo; valores abaixo de 16ms nao entram no observador." }));
  for (const mode of ["sem-js", "reduced-motion", "save-data"]) {
    const fallback = await browser.newPage();
    await fallback.setViewport({ width: 390, height: 844 });
    if (mode === "sem-js") await fallback.setJavaScriptEnabled(false);
    if (mode === "reduced-motion") await fallback.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    if (mode === "save-data") await fallback.evaluateOnNewDocument(() => Object.defineProperty(navigator, "connection", { value: { saveData: true, addEventListener() {}, removeEventListener() {} }, configurable: true }));
    await fallback.goto("http://127.0.0.1:3105/", { waitUntil: "networkidle0" });
    const state = await fallback.evaluate(() => ({ enhanced: document.querySelector(".journey-track").hasAttribute("data-enhanced"), frames: [...document.querySelectorAll(".journey-frame")].map(n => ({ title: n.querySelector("h3").textContent, display: getComputedStyle(n).display, position: getComputedStyle(n).position, caption: getComputedStyle(n.querySelector("figcaption")).visibility })), videos: document.querySelectorAll("video").length, h1: document.querySelectorAll("h1").length, whatsapp: document.querySelector(".mobile-whatsapp").href, scene: !!document.querySelector(".scene-slot") }));
    if (mode !== "sem-js") assert.equal(state.enhanced, false);
    assert.equal(state.frames.length, 4);
    assert.ok(state.frames.every(n => n.display !== "none" && n.position === "static" && n.caption === "visible"));
    assert.equal(state.videos, 0);
    assert.equal(state.h1, 1);
    assert.ok(state.scene && state.whatsapp.startsWith("https://wa.me/5511967976902?text="));
    await fallback.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; document.querySelector(".journey-frame").scrollIntoView(); });
    await fallback.waitForFunction(() => Math.abs(document.querySelector(".journey-frame").getBoundingClientRect().top) < 2);
    await fallback.waitForFunction(() => [...document.querySelectorAll(".journey-frame img")].some(img => img.getBoundingClientRect().width > 0 && img.complete && img.naturalWidth > 0));
    await fallback.screenshot({ path: `docs/proposta/capturas/${label}-390-${mode}.png` });
    results.fallbacks.push({ mode, ...state });
    await fallback.close();
  }
  assert.deepEqual(results.errors, []);
  await fs.writeFile(`docs/auditorias/2026-09-27-${label}-jornada.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ captures: results.captures.length, fallbacks: results.fallbacks, interactions: results.interactions, errors: results.errors }, null, 2));
} finally { await browser.close(); }
