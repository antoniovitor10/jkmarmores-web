import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const modules = process.env.AUDIT_MODULES;
if (!modules) throw new Error("Defina AUDIT_MODULES com o caminho das dependencias Lighthouse e Puppeteer de auditoria.");
const requireAudit = createRequire(path.join(modules, "audit.cjs"));
const { default: puppeteer } = await import(pathToFileURL(requireAudit.resolve("puppeteer-core")));
const { default: lighthouse } = await import(pathToFileURL(path.join(modules, "lighthouse/core/index.js")));
const stage = process.argv[2];
if (!["antes", "depois"].includes(stage)) throw new Error("Use antes ou depois.");
const url = `http://127.0.0.1:${process.env.AUDIT_PORT ?? "3105"}${process.env.AUDIT_ROUTE ?? "/"}`;
const label = process.env.AUDIT_LABEL ?? "a1";
const prefix = `docs/auditorias/2026-09-26-${label}-${stage}`;
await fs.mkdir("docs/proposta/capturas", { recursive: true });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-first-run", "--disable-extensions"] });
try {
  const result = await lighthouse(url, { port: Number(new URL(browser.wsEndpoint()).port), output: "json", logLevel: "error", throttlingMethod: process.env.AUDIT_THROTTLING ?? "simulate", onlyCategories: ["performance", "accessibility", "best-practices", "seo"], screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false } });
  await fs.writeFile(`${prefix}-lighthouse.json`, result.report);
  if (result.lhr.runtimeError) throw new Error(result.lhr.runtimeError.message);
  const audit = result.lhr.audits;
  const summary = { stage, environment: `Emulacao Chrome headless; Lighthouse mobile, throttling ${process.env.AUDIT_THROTTLING ?? "simulate"}; servidor local gzip; cache frio`, lighthouseVersion: result.lhr.lighthouseVersion, userAgent: result.lhr.userAgent, fetchTime: result.lhr.fetchTime, settings: result.lhr.configSettings, scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([key, value]) => [key, value.score * 100])), lcpMs: audit["largest-contentful-paint"].numericValue, fcpMs: audit["first-contentful-paint"].numericValue, tbtMs: audit["total-blocking-time"].numericValue, cls: audit["cumulative-layout-shift"].numericValue, totalBytes: audit["total-byte-weight"].numericValue, failures: Object.values(audit).filter(item => item.score !== null && item.score < 1 && item.details).map(item => ({ id: item.id, title: item.title, displayValue: item.displayValue })) };
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.evaluateOnNewDocument(() => {
    window.__atLoad = null;
    addEventListener("load", () => { window.__atLoad = performance.getEntriesByType("resource").map(r => ({ name: new URL(r.name).pathname, type: r.initiatorType, bytes: r.transferSize })); });
  });
  summary.viewports = [];
  for (const width of [390, 1440]) {
    await page.setViewport({ width, height: width === 390 ? 844 : 900, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    if (process.env.AUDIT_SKIP_CAPTURE !== "1") await page.screenshot({ path: `docs/proposta/capturas/${label}-${stage}-${width}.png` });
    summary.viewports.push(await page.evaluate(() => ({ width: innerWidth, height: innerHeight, overflow: document.documentElement.scrollWidth > innerWidth, h1Count: document.querySelectorAll("h1").length, h1: document.querySelector("h1")?.getBoundingClientRect().toJSON(), cta: document.querySelector(".home-hero .button, .page-intro .button")?.getBoundingClientRect().toJSON(), resourcesAtLoad: window.__atLoad, resourcesAfterIdle: performance.getEntriesByType("resource").map(r => ({ name: new URL(r.name).pathname, type: r.initiatorType, bytes: r.transferSize })), navigation: performance.getEntriesByType("navigation").map(n => ({ bytes: n.transferSize, loadMs: n.loadEventEnd })) })));
  }
  await fs.writeFile(`${prefix}-resumo.json`, JSON.stringify(summary, null, 2));
  process.stdout.write(JSON.stringify({ ...summary, settings: undefined, viewports: summary.viewports.map(({ resourcesAtLoad, resourcesAfterIdle, ...v }) => ({ ...v, resourcesAtLoadBytes: resourcesAtLoad.reduce((n, r) => n + r.bytes, 0), resourcesAfterIdleBytes: resourcesAfterIdle.reduce((n, r) => n + r.bytes, 0) })) }, null, 2));
} finally { await browser.close(); }
