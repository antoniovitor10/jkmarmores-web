/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Vitor/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const base = process.env.QA_URL || 'http://127.0.0.1:3102/2/';
const output = process.env.QA_OUTPUT_DIR || __dirname;
fs.mkdirSync(output, { recursive: true });
(async () => {
 const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const results=[];
 try {
  for(const [width,mode] of [[390,'normal'],[1440,'normal'],[390,'reduced'],[390,'save-data'],[390,'slow'],[390,'no-js']]) {
   const ctx=await browser.newContext({viewport:{width,height:width===390?844:900},isMobile:width===390,hasTouch:width===390,reducedMotion:mode==='reduced'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});
   const page=await ctx.newPage(), cdp=await ctx.newCDPSession(page);
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
   if(mode==='slow') {await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200*1024,uploadThroughput:75*1024,connectionType:'cellular3g'});}
   await page.addInitScript(mode=>{
    Object.defineProperty(navigator,'connection',{configurable:true,value:{effectiveType:mode==='slow'?'3g':'4g',downlink:mode==='slow'?1:10,saveData:mode==='save-data',addEventListener(){},removeEventListener(){}}});
    window.__qa={lcp:0,cls:0,clsSources:[],long:[],events:[],frames:[],scrollResponse:0};
    new PerformanceObserver(l=>window.__qa.lcp=l.getEntries().at(-1).startTime).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput){window.__qa.cls+=e.value; window.__qa.clsSources.push({at:e.startTime,scroll:scrollY,value:e.value,sources:e.sources.map(s=>({name:s.node?.className,prev:s.previousRect,next:s.currentRect}))})}})).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__qa.long.push({at:e.startTime,ms:e.duration}))).observe({type:'longtask',buffered:true});
    new PerformanceObserver(l=>l.getEntries().filter(e=>e.interactionId).forEach(e=>window.__qa.events.push({name:e.name,ms:e.duration}))).observe({type:'event',buffered:true,durationThreshold:16});
   },mode);
   const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});page.on('request',r=>requests.push(r.url()));
   await page.goto(base,{waitUntil:'networkidle'});
   await page.screenshot({path:path.join(output,width+'-'+mode+'-capa.png')});
   const initial=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,ctaBottom:document.querySelector('.home-hero .button').getBoundingClientRect().bottom,noindex:document.querySelector('meta[name=robots]').content.includes('noindex'),badLinks:[...document.querySelectorAll('a[href]')].filter(a=>a.origin===location.origin&&!a.pathname.startsWith('/2/')).map(a=>a.href)}));
   assert.equal(initial.overflow,false);assert.equal(initial.h1,1);assert.equal(initial.noindex,true);assert.equal(initial.badLinks.length,0);assert.ok(initial.ctaBottom<844);
   let enhanced=false,stages=[];
   if(mode!=='no-js') {
    await page.evaluate(()=>{const r=document.querySelector('.journey-track');scrollTo(0,r.getBoundingClientRect().top+scrollY)});
    await page.waitForTimeout(800);
    enhanced=await page.locator('.journey-track').evaluate(r=>r.hasAttribute('data-enhanced'));
    if(mode!=='reduced'){
     assert.ok(enhanced,'jornada ativa');
     await page.screenshot({path:path.join(output,width+'-monograma.png')});
     for(const fraction of [.29,.50,.70,.93]){
      await page.evaluate(f=>{const r=document.querySelector('.journey-track');scrollTo(0,r.getBoundingClientRect().top+scrollY+(r.offsetHeight-innerHeight)*f)},fraction);
      await page.waitForTimeout(700);
      stages.push(await page.locator('[data-current="true"]').evaluate(f=>({step:f.dataset.frame,title:f.querySelector('h3').textContent,clip:getComputedStyle(f).clipPath})));
     }
     assert.deepEqual(stages.map(s=>s.step),['0','1','2','3']);
     await page.screenshot({path:path.join(output,width+'-jornada.png')});
    }else assert.equal(enhanced,false,mode);
    await page.locator('#configurador').scrollIntoViewIfNeeded();await page.waitForTimeout(500);
    await page.getByRole('button',{name:'Bege',exact:true}).click();
    await page.waitForTimeout(400);assert.equal(await page.locator('[data-material=bege]').getAttribute('aria-pressed'),'true');
    await page.getByRole('button',{name:'Lavatório',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('[data-escolha]')?.getAttribute('data-escolha')==='lavatorio-bege',null,{timeout:10000});
    assert.equal(await page.locator('[data-escolha]').getAttribute('data-escolha'),'lavatorio-bege');
    assert.ok(decodeURIComponent(await page.getByRole('link',{name:'Pedir orçamento desta pedra'}).getAttribute('href')).includes('Lavatório / Bege'));
    await page.locator('[data-escolha]').evaluate(async el => { await Promise.all(el.getAnimations({subtree:true}).map(animation => animation.finished)); });
    if(mode==='normal')await page.screenshot({path:path.join(output,width+'-configurador.png')});
    if(width===390&&mode==='normal'){
     await page.evaluate(()=>scrollTo(0,0)); await page.locator('.mobile-nav summary').click();await page.waitForTimeout(200);assert.equal(await page.locator('main').evaluate(e=>e.inert),true);
     await page.keyboard.press('Escape');await page.waitForTimeout(200);assert.equal(await page.locator('main').evaluate(e=>e.inert),false);
    }
   }else{
    assert.equal(await page.locator('.journey-frame').count(),4);
    await page.locator('.journey-frame').last().scrollIntoViewIfNeeded();await page.waitForTimeout(400);
   }
   assert.equal(requests.filter(u=>/\.mp4|motion-frames/.test(u)).length,0);
   const data=mode==='no-js'?{}:await page.evaluate(()=>window.__qa);
   results.push({width,mode,initial,enhanced,stages,...data,errors,badAssetRequests:requests.filter(u=>u.startsWith(new URL(base).origin)&&!u.includes('/2/'))});
   assert.equal(errors.length,0,JSON.stringify(errors));
   await ctx.close();
  }
 }finally{await browser.close();fs.writeFileSync(path.join(output,'qa.json'),JSON.stringify(results,null,2));}
})().catch(e=>{console.error(e);process.exitCode=1;});

