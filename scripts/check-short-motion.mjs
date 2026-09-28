import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(path.join(process.env.AUDIT_MODULES, 'audit.cjs'));
const browser = await require('puppeteer-core').launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true });
const label = process.env.AUDIT_LABEL ?? 'rolagem-curta';
const results = { environment:'Emulação Chrome, touch CDP e mouse wheel; servidor local, sem throttling de rede; tempos de gesto até último quadro, não medição em aparelho real.', checks:[], errors:[] };
const sleep = ms => new Promise(r => setTimeout(r, ms));
try {
  const page = await browser.newPage();
  page.on('pageerror', e => results.errors.push(e.message));
  for (const width of [390,1440]) {
    await page.setViewport({width,height:width===390?844:900,isMobile:width===390,hasTouch:width===390});
    await page.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle0'});
    await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
    assert.equal(await page.$$eval('.home-hero video',v=>v.length),1);
    assert.equal(await page.$eval('.home-hero video',v=>v.currentTime),0,'Preload não pode iniciar reprodução');
    const start=Date.now();
    if(width===390) {
      const cdp=await page.createCDPSession();
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:190,y:650}]});
      for(let y=630;y>=510;y-=20) { await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:190,y}]}); await sleep(25); }
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await cdp.detach();
    } else { await page.mouse.move(700,450); await page.mouse.wheel({deltaY:140}); }
    console.log('gesto',width,await page.evaluate(()=>({y:scrollY,v:document.querySelector('.home-hero video')?.currentTime})));
    await page.waitForFunction(()=>{const v=document.querySelector('.home-hero video');return v?.dataset.settled==='1' && !v.seeking && v.readyState>=2;});
    const coverMs=Date.now()-start;
    assert.ok(coverMs<2400,`Capa demorou ${coverMs}ms`);
    const scrollAfter=await page.evaluate(()=>scrollY);
    await sleep(250);
    assert.equal(await page.evaluate(()=>scrollY),scrollAfter,'A animação não pode rolar a página');
    await page.screenshot({path:`docs/proposta/capturas/${label}-${width}-capa.png`});
    await page.evaluate(()=>scrollTo(0,0));
    await page.waitForFunction(()=>{const v=document.querySelector('.home-hero video');return v?.dataset.settled==='0' && !v.seeking && v.readyState>=2;});
    const dimensions=await page.evaluate(()=>({hero:document.querySelector('[data-hero-stage]').parentElement.offsetHeight,journey:document.querySelector('.journey-track').offsetHeight,viewport:innerHeight}));
    const points=[];
    for(const index of [-1,0,1,2,3]) {
      await page.evaluate(i=>{
        const root=document.querySelector('.journey-track');
        const sticky=document.querySelector('.journey-sticky');
        const mask=(innerHeight*6.2-sticky.offsetHeight)*.22;
        const position=i<0?0:mask+(root.offsetHeight-sticky.offsetHeight-mask)*(i+.18)/3.65;
        scrollTo(0,scrollY+root.getBoundingClientRect().top+position);
      },index);
      const begin=Date.now();
      if(index>=0) await page.waitForFunction(i=>{const v=document.querySelector(`[data-frame="${i}"] video`);return v?.dataset.settled==='1' && !v.seeking && v.readyState>=2;},{},index);
      else await sleep(250);
      const elapsed=Date.now()-begin;
      if(index>=0) assert.ok(elapsed<2300,`Etapa ${index}: ${elapsed}ms`);
      const state=await page.evaluate(()=>({current:document.querySelector('[data-current="true"]')?.dataset.frame,caption:document.querySelector('[data-current="true"] figcaption').getBoundingClientRect().toJSON(),dock:document.querySelector('.mobile-quote-dock').getBoundingClientRect().toJSON(),overflow:document.documentElement.scrollWidth>innerWidth}));
      assert.equal(state.overflow,false);
      if(index>=0) assert.equal(Number(state.current),index);
      if(width===390 && index>=0) assert.ok(state.caption.bottom<=state.dock.top+1);
      await page.screenshot({path:`docs/proposta/capturas/${label}-${width}-${index<0?'pedra':index+1}.png`});
      points.push({index,elapsed,...state});
    }
    // Voltar um estado e sair do trecho não pode prender a página.
    await page.mouse.wheel({deltaY:-180}); await sleep(250);
    const reverse=await page.$eval('[data-current="true"]',el=>Number(el.dataset.frame));
    assert.ok(reverse<3);
    results.checks.push({width,coverMs,scrollAfter,dimensions,points,reverse});
  }
  for(const mode of ['reduced-motion','save-data','no-js']) {
    const p=await browser.newPage(); await p.setViewport({width:390,height:844});
    if(mode==='no-js') await p.setJavaScriptEnabled(false);
    if(mode==='reduced-motion') await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    if(mode==='save-data') await p.evaluateOnNewDocument(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,addEventListener(){},removeEventListener(){}}}));
    await p.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle0'});
    await p.evaluate(()=>scrollTo(0,1500)); await sleep(200);
    assert.equal(await p.$$eval('video',items=>items.length),0);
    assert.equal(await p.$$eval('.journey-frame',items=>items.filter(el=>getComputedStyle(el).position==='static').length),4);
    results.checks.push({mode,staticFrames:4,videos:0}); await p.close();
  }
  assert.deepEqual(results.errors,[]);
  await fs.writeFile(`docs/auditorias/2026-09-27-${label}-gestos.json`,JSON.stringify(results,null,2));
  console.log(JSON.stringify(results.checks.map(({width,coverMs,points,mode})=>({width,coverMs,stepMs:points?.map(p=>p.elapsed),mode})),null,2));
} finally { await browser.close(); }
