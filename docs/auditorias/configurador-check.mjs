import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer = require('puppeteer-core');
const browser = await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const base='http://127.0.0.1:3107/';
const report={viewports:[],checks:[]};
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function clickText(page,text) { await page.evaluate(text=>{const button=[...document.querySelectorAll('[data-configurador] button')].find(b=>b.textContent.trim()===text||b.textContent.trim().replace(/^0\d/,'')===text);if(!button)throw new Error('Missing button: '+text);button.click();},text); }
async function ready(page) { await page.waitForSelector('[data-configurador] img[draggable="false"]');await page.waitForFunction(()=>document.querySelector('[data-configurador] img[draggable="false"]')?.complete);await pause(350); }
async function frame(page,suffix) {await page.waitForFunction(suffix=>document.querySelector('[data-configurador] img[draggable="false"]')?.getAttribute('src')?.endsWith(suffix),{},suffix);}
try {
 for(const width of [390,1440]) {
  const page=await browser.newPage();await page.setViewport({width,height:width===390?844:1200,deviceScaleFactor:1,isMobile:width===390,hasTouch:width===390});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle0'});
  const initial=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.includes('/configurador/')).map(r=>r.name));assert.equal(initial.length,0,'No initial configurator media');
  await page.$eval('[data-configurador]',el=>el.scrollIntoView({block:'start'}));await ready(page);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No horizontal overflow');
  const capture=async name=>{await page.$eval('[data-configurador]',el=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,el.getBoundingClientRect().top+scrollY-8);});await pause(150);await page.screenshot({path:`docs/auditorias/configurador-${width}-${name}.png`});};
  await clickText(page,'Material');await clickText(page,'Pedra bege');await frame(page,'cozinha-bege/'+(width===390?'720':'1280')+'/00.avif');
  await capture('selecao');
  for(let i=0;i<8;i++)await page.click('[data-configurador] [aria-label="Próximo ângulo"]');
  await frame(page,'08.avif');await capture('rotacao');
  await page.click('[data-configurador] [aria-label="Aumentar zoom"]');await page.waitForFunction(()=>document.querySelector('[data-configurador] img[draggable="false"]').src.includes('/2048/'));await capture('zoom');
  const stage='[data-configurador] [tabindex="0"]';
  await page.focus(stage);await page.keyboard.press('ArrowRight');
  assert.match(await page.$eval('[data-configurador] img[draggable="false"]',el=>el.style.transform),/-40px/,'Keyboard pan');
  await page.keyboard.press('Escape');await frame(page,'08.avif');
  await page.keyboard.press('ArrowRight');await frame(page,'09.avif');
  await page.keyboard.press('Home');await frame(page,'00.avif');
  await page.keyboard.press('End');await frame(page,'23.avif');
  assert.equal(await page.$eval('[aria-label="Próximo ângulo"]',b=>b.disabled),true);
  await page.keyboard.press('Home');await frame(page,'00.avif');
  const bounds=await page.$eval(stage,el=>{const r=el.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});
  await page.mouse.move(bounds.x,bounds.y);await page.mouse.down();await page.mouse.move(bounds.x-84,bounds.y,{steps:8});await page.mouse.up();await frame(page,'07.avif');
  await clickText(page,'Acabamento');await clickText(page,'Escovado');await page.waitForSelector('aside[aria-label="Detalhe do acabamento"]');
  const href=await page.$eval('[data-configurador] a',a=>a.href);assert.match(decodeURIComponent(href),/Cozinha com ilha.*Pedra bege.*Escovado/);assert.match(href,/wa.me\/5511967976902/);
  await capture('acabamento');await clickText(page,'Fechar detalhe');
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const axe=await page.evaluate(async()=>{const result=await window.axe.run(document.querySelector('[data-configurador]'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});
  report.viewports.push({width,initialMedia:initial.length,errors,axe});assert.equal(errors.length,0);assert.equal(axe.length,0);
  await page.close();
 }
 for(const mode of ['reduced','save-data','no-js']) {
  const page=await browser.newPage();await page.setViewport({width:390,height:844});
  if(mode==='reduced')await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  if(mode==='save-data')await page.evaluateOnNewDocument(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,addEventListener(){},removeEventListener(){}}}));
  if(mode==='no-js')await page.setJavaScriptEnabled(false);
  await page.goto(base,{waitUntil:'networkidle0'});await page.$eval('[data-configurador]',el=>el.scrollIntoView());
  if(mode!=='no-js') {await ready(page);assert.equal(await page.$eval('[aria-label="Próximo ângulo"]',b=>b.disabled),true);const media=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/\/configurador\/.*\/\d+\/\d+\.avif/.test(r.name)).map(r=>r.name));assert(media.every(url=>url.endsWith('/00.avif')));}
  else assert.match(await page.$eval('[data-configurador]',el=>el.textContent),/Cozinha com ilha/);
  await page.screenshot({path:`docs/auditorias/configurador-390-${mode}.png`});report.checks.push(mode);await page.close();
 }
} finally { await fs.writeFile('docs/auditorias/configurador-funcional.json',JSON.stringify(report,null,2));await browser.close(); }
console.log(JSON.stringify(report,null,2));
