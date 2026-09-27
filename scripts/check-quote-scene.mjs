import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import assert from "node:assert/strict";

const requireAudit = createRequire(path.join(process.env.AUDIT_MODULES, "audit.cjs"));
const puppeteer = requireAudit("puppeteer-core");
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const results = [];
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  const cdp = await page.createCDPSession();
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.evaluateOnNewDocument(() => { window.__opened = []; window.open = url => { window.__opened.push(url); return null; }; });
  await page.goto("http://127.0.0.1:3105/contato/", { waitUntil: "networkidle0" });
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.textContent), "Ir para o conteúdo");
  await page.keyboard.press("Enter");
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press("Tab");
    if (await page.evaluate(() => document.activeElement.tagName === "INPUT")) break;
  }
  for (const value of ["Cozinha de teste", "Material a confirmar", "Medidas de teste", "Cidade de teste"]) {
    assert.equal(await page.evaluate(() => document.activeElement.tagName), "INPUT");
    await page.keyboard.type(value);
    const visible = await page.evaluate(() => ({ bottom: document.activeElement.getBoundingClientRect().bottom, dock: document.querySelector(".mobile-quote-dock").getBoundingClientRect().top, dockHidden: getComputedStyle(document.querySelector(".mobile-quote-dock")).visibility === "hidden" }));
    assert.ok(visible.dockHidden || visible.bottom <= visible.dock, "Orcamento fixo nao pode cobrir campo focado");
    await page.keyboard.press("Tab");
  }
  await page.keyboard.press("Enter");
  const opened = await page.evaluate(() => window.__opened);
  assert.equal(opened.length, 1);
  assert.ok(opened[0].startsWith("https://wa.me/5511967976902?text="));
  assert.ok(new URL(opened[0]).searchParams.get("text").includes("Cozinha de teste"));
  results.push({ contact: "Teclado do skip link ao submit; 4 campos visiveis; Mensagem WhatsApp correta interceptada sem envio externo" });
  await page.evaluateOnNewDocument(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) { return /webgl/i.test(type) ? null : original.call(this, type, ...args); };
  });
  for (const route of ["/", "/materiais/pendente/"]) {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.goto(`http://127.0.0.1:3105${route}`, { waitUntil: "networkidle0" });
    if (route === "/materiais/pendente/") {
      assert.ok(await page.$("[data-pendente]"));
      assert.equal(await page.$(".scene-slot"), null);
      results.push({ route, pendingCatalog: true, note: "Rota de material continua placeholder, sem catalogo confirmado. Explorador preservado no codigo da rota real; nao exercitado por esta pagina." });
      continue;
    }
    await page.$eval(".scene-slot", el => el.scrollIntoView());
    await page.click(".scene-slot button");
    await page.waitForSelector(".scene-slot select");
    const selects = await page.$$(".scene-slot select");
    for (const select of selects) {
      const values = await select.$$eval("option", nodes => nodes.map(n => n.value));
      if (values.length > 1) await select.select(values[1]);
    }
    const state = await page.$eval(".scene-slot", el => ({ controls: el.querySelectorAll("select").length, summary: el.querySelector('[aria-live="polite"]').textContent, image: el.querySelector("img").currentSrc, status: el.querySelector('[role="status"]')?.textContent, quote: el.querySelector("a").href }));
    assert.ok(state.image.includes(".webp") && state.quote.startsWith("https://wa.me/5511967976902?text="));
    assert.equal(state.controls, route === "/" ? 3 : 2);
    const retry = await page.$$(".scene-slot button");
    for (const button of retry) if ((await button.evaluate(n => n.textContent)) === "Tentar visualização 3D") await button.click();
    await page.waitForFunction(() => document.querySelector('.scene-slot [role="status"]')?.textContent.includes("não está disponível"));
    results.push({ route, reducedMotion: true, webglBlocked: true, cpuSlowdown: 4, ...state, unavailableAfterRetry: true });
    await page.$eval('.scene-slot', el => el.scrollIntoView());
    await page.screenshot({ path: `docs/proposta/capturas/${process.env.AUDIT_LABEL ?? "institucional"}-390-configurador-fallback.png` });
  }
  await fs.writeFile(`docs/auditorias/2026-09-27-${process.env.AUDIT_LABEL ?? "institucional"}-orcamento-3d.json`, JSON.stringify({ environment: "Emulacao Chrome headless, CPU 4x; WebGL bloqueado; nenhum envio externo", results }, null, 2));
  console.log("Orcamento por teclado, configurador e fallbacks 3D passaram; rota de material permanece pendente de catalogo.");
} finally { await browser.close(); }
