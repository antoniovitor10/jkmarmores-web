import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const requireAudit = createRequire(path.join(process.env.AUDIT_MODULES, 'audit.cjs'));
const puppeteer = requireAudit('puppeteer-core');
const browser = await puppeteer.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true });
const results = { environment:'Emulação Chrome headless, rolagem nativa, DPR 1; nenhum contato enviado', checks:[], errors:[] };
const pause = ms => new Promise(resolve => setTimeout(resolve,ms));
try {
  const page = await browser.newPage();
  page.on('pageerror', e => results.errors.push(e.message));
  page.on('response', r => { if(r.status() >= 400) results.errors.push(`${r.status()} ${r.url()}`); });
  for(const width of [390,1440]) {
    await page.setViewport({width,height:width === 390 ? 844 : 900,deviceScaleFactor:1});
    await page.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle0'});
    const initial = await page.evaluate(() => ({ videos:document.querySelectorAll('video').length, media:performance.getEntriesByType('resource').filter(r => /\.mp4/.test(r.name)).length, ctaBottom:document.querySelector('.home-hero .button').getBoundingClientRect().bottom, overflow:document.documentElement.scrollWidth>innerWidth, poster:document.querySelector('.home-hero img').currentSrc }));
    assert.equal(initial.videos,0); assert.equal(initial.media,0); assert.equal(initial.overflow,false); assert.ok(initial.ctaBottom < (width===390 ? 768 : 900));
    await page.screenshot({path:`docs/proposta/capturas/capa-video-${width}-00.png`});
    const times = [];
    for(const progress of [.25,.5,.95,.25]) {
      await page.evaluate(p => {
        const stage = document.querySelector('[data-hero-stage]'); const root=stage.parentElement;
        scrollTo({top:scrollY+root.getBoundingClientRect().top+p*(root.offsetHeight-stage.offsetHeight),behavior:'instant'});
      },progress);
      await page.waitForFunction(p => { const v=document.querySelector('.home-hero video');return v?.readyState>=2 && !v.seeking && Math.abs(v.currentTime-p*(v.duration-.05))<.08; },{timeout:30000},progress);
      const state = await page.evaluate(() => ({ time:document.querySelector('.home-hero video').currentTime, source:document.querySelector('.home-hero video').currentSrc, scroll:scrollY, introInert:document.querySelector('[data-hero-intro]').inert }));
      assert.equal(state.introInert,true);
      times.push({progress,...state});
      await page.screenshot({path:`docs/proposta/capturas/capa-video-${width}-${times.length}.png`});
    }
    assert.ok(times[0].time < times[1].time && times[1].time < times[2].time && times[3].time < times[2].time);
    await page.click('.home-hero button');
    const frozen = await page.$eval('.home-hero video',v=>v.currentTime);
    await page.mouse.wheel({deltaY:300}); await pause(350);
    assert.ok(Math.abs(await page.$eval('.home-hero video',v=>v.currentTime)-frozen)<.04);
    assert.equal(await page.$eval('.home-hero button',b=>b.getAttribute('aria-pressed')),'true');
    await page.click('.home-hero button');
    results.checks.push({width,initial,times,pause:'Congela o vídeo mantendo a rolagem nativa'});
  }
  for(const mode of ['reduced-motion','save-data']) {
    const isolated = await browser.newPage();
    await isolated.setViewport({width:390,height:844});
    if(mode==='reduced-motion') await isolated.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    else await isolated.evaluateOnNewDocument(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,addEventListener(){},removeEventListener(){}}}));
    await isolated.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle0'});
    await isolated.evaluate(()=>scrollTo(0,300)); await pause(250);
    assert.equal(await isolated.$eval('.home-hero',el=>el.querySelectorAll('video').length),0);
    assert.equal(await isolated.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/\.mp4/.test(r.name)).length),0);
    assert.equal(await isolated.$eval('[data-hero-stage]',el=>el.parentElement.hasAttribute('data-motion')),false);
    results.checks.push({mode,posterOnly:true,videoRequests:0});
    await isolated.close();
  }
  assert.deepEqual(results.errors,[]);
  await fs.writeFile('docs/auditorias/2026-09-27-capa-video-funcional.json',JSON.stringify(results,null,2));
  console.log('Capa: carga posterior ao pôster/rolagem, avanço, retorno, pausa, reduced-motion e Save-Data passaram.');
} finally { await browser.close(); }
