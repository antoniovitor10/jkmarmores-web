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
  await fs.writeFile(`docs/auditorias/2026-09-27-${process.env.AUDIT_LABEL ?? "institucional"}-orcamento.json`, JSON.stringify({ environment: "Emulacao Chrome headless, CPU 4x; nenhum envio externo", results }, null, 2));
  console.log("Orcamento por teclado e mensagem WhatsApp passaram, sem envio externo.");
} finally { await browser.close(); }
