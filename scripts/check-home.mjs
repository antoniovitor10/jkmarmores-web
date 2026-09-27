import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";

if (!process.env.AUDIT_MODULES) throw new Error("Defina AUDIT_MODULES como na auditoria.");
const requireAudit = createRequire(path.join(process.env.AUDIT_MODULES, "audit.cjs"));
const { default: puppeteer } = await import(pathToFileURL(requireAudit.resolve("puppeteer-core")));
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const checks = [];
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const js of [false, true]) {
    await page.setJavaScriptEnabled(js);
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto("http://127.0.0.1:3105/", { waitUntil: "networkidle0" });
    const state = await page.evaluate(() => ({
      h1: [...document.querySelectorAll("h1")].map(n => n.textContent),
      pending: document.querySelectorAll("[data-pendente]").length,
      overflow: document.documentElement.scrollWidth > innerWidth,
      image: { ready: document.querySelector(".home-hero img").complete, url: document.querySelector(".home-hero img").currentSrc.startsWith("data:") ? "AVIF incorporado no HTML" : document.querySelector(".home-hero img").currentSrc, priority: document.querySelector(".home-hero img").fetchPriority },
      cta: { href: document.querySelector(".home-hero .button").href, bottom: document.querySelector(".home-hero .button").getBoundingClientRect().bottom },
      noindex: document.querySelector('meta[name="robots"]').content.includes("noindex"),
      sections: [...document.querySelectorAll("main section[id]")].map(n => n.id),
      scene: document.querySelector(".scene-slot") !== null,
      deferredHydration: {
        bootstrap: !!document.querySelector('#jk-hydration-bootstrap'),
        scriptsPending: document.querySelectorAll('script[data-jk-src]').length,
        paint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        firstScript: performance.getEntriesByType('resource').filter(r => /\/_next\/static\/.*\.js$/.test(new URL(r.name).pathname)).sort((a,b) => a.startTime-b.startTime)[0]?.startTime,
      },
    }));
    assert.equal(state.h1.length, 1);
    assert.equal(state.h1[0], "Mármores e granitos em Barueri.");
    assert.equal(state.overflow, false);
    assert.ok(state.pending > 0 && state.image.ready && state.scene && state.noindex);
    assert.equal(state.deferredHydration.bootstrap, false);
    assert.equal(state.deferredHydration.scriptsPending, 0);
    assert.ok(state.cta.bottom < 844 && state.cta.href.startsWith("https://wa.me/5511967976902?text="));
    assert.deepEqual(state.sections, ["jornada-pedra", "materiais", "configurador", "orcamento", "trabalhos"]);
    checks.push({ javascript: js, ...state });
    await page.click('.home-hero a[href="/materiais/"]');
    await page.waitForFunction(() => location.pathname === "/materiais/");
    assert.equal(await page.$eval("h1", n => n.textContent), "A pedra certa começa pelo seu projeto.");
  }
  await page.goto("http://127.0.0.1:3105/", { waitUntil: "networkidle0" });
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.textContent), "Ir para o conteúdo");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.textContent), "Fale sobre seu projeto");
  checks.push({ keyboard: "Skip link seguido do CTA da abertura; foco visivel e ordem nativa" });
  await page.goto("http://127.0.0.1:3105/", { waitUntil: "networkidle0" });
  await page.focus(".mobile-nav summary");
  await page.keyboard.press("Enter");
  assert.ok(await page.$eval(".mobile-nav", n => n.open));
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.textContent), "Início");
  checks.push({ menu: "Abre por Enter e links acessiveis por Tab" });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto("http://127.0.0.1:3105/", { waitUntil: "networkidle0" });
  const reduced = await page.$eval(".home-hero .button", n => ({ transition: getComputedStyle(n).transitionDuration, videos: document.querySelectorAll("video").length, canvas: document.querySelectorAll("canvas").length }));
  assert.equal(reduced.videos, 0);
  assert.equal(reduced.canvas, 0);
  assert.ok(reduced.transition.split(",").every(value => parseFloat(value) <= 0.00001));
  checks.push({ reducedMotion: reduced });
  assert.deepEqual(errors, []);
  await fs.writeFile(`docs/auditorias/2026-09-27-${process.env.AUDIT_LABEL ?? "institucional"}-home-funcional.json`, JSON.stringify({ environment: "Emulacao Chrome headless; nenhum contato enviado", checks, errors }, null, 2));
  process.stdout.write("Home: verificacoes sem JS/com JS, imagem, links, teclado, menu, noindex e movimento reduzido passaram.\n");
} finally { await browser.close(); }
