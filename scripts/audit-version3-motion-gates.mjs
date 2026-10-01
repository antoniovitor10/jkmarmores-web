import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const requireAudit=createRequire(process.env.AUDIT_MODULES ? process.env.AUDIT_MODULES+'/audit.cjs' : 'C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer=requireAudit('puppeteer-core');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const url=process.env.AUDIT_URL ?? 'http://127.0.0.1:3108/3/';
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const report={url,cases:[]};
try {
 for(const [width,mode] of [[390,'warm-no-connection'],[1440,'warm-no-connection'],[390,'high-ttfb'],[1440,'high-ttfb'],[390,'save-data'],[390,'3g'],[390,'reduced-motion']]){
  const context=await browser.createBrowserContext(),page=await context.newPage(),errors=[],videoRequests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(/\.(mp4|webm)(\?|$)/.test(r.url()))videoRequests.push(r.url());});
  await page.setViewport({width,height:width===390?844:900,deviceScaleFactor:1,isMobile:width===390,hasTouch:width===390});
  const cdp=await page.createCDPSession();await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled',{cacheDisabled:mode!=='warm-no-connection'});
  if(mode==='warm-no-connection')await page.evaluateOnNewDocument(()=>{
   Object.defineProperty(navigator,'connection',{configurable:true,value:undefined});
   // Reproduce a fully cached critical request even if the server revalidates HTML.
   const entries=performance.getEntriesByType.bind(performance);
   performance.getEntriesByType=type=>entries(type).map(entry=>new Proxy(entry,{get(target,key){
    if(key==='transferSize')return 0;
    const value=Reflect.get(target,key,target);
    return typeof value==='function'?value.bind(target):value;
   }}));
  });
  if(mode==='high-ttfb'){
   await page.setRequestInterception(true);
   page.on('request',request=>{
    if(request.isNavigationRequest()&&request.frame()===page.mainFrame())setTimeout(()=>void request.continue(),1000);
    else void request.continue();
   });
  }
  if(['save-data','3g'].includes(mode))await page.evaluateOnNewDocument(mode=>Object.defineProperty(navigator,'connection',{configurable:true,value:Object.assign(new EventTarget(),{downlink:.1,effectiveType:mode==='3g'?'3g':'4g',saveData:mode==='save-data'})}),mode);
  if(mode==='3g')await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:200,downloadThroughput:750*1024/8,uploadThroughput:250*1024/8,connectionType:'cellular3g'});
  if(mode==='reduced-motion')await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  const response=await page.goto(url,{waitUntil:'networkidle0',timeout:45000});assert.equal(response.status(),200);
  if(mode==='warm-no-connection')await page.reload({waitUntil:'networkidle0'});
  const enabled=mode!=='reduced-motion';
  if(enabled)await page.waitForSelector('.material-gallery[data-motion]',{timeout:15000});else await pause(400);
  const state=await page.evaluate(()=>{
   const nav=performance.getEntriesByType('navigation')[0],poster=performance.getEntriesByType('resource').find(e=>e.name.includes('/img/sequencia-01-chapa-'));
   return{connectionAbsent:navigator.connection===undefined,saveData:navigator.connection?.saveData,effectiveType:navigator.connection?.effectiveType,navigationTransferSize:nav?.transferSize,posterTransferSize:poster?.transferSize,ttfbMs:nav.responseStart-nav.startTime,hero:!!document.querySelector('.cinema-hero')?.dataset.motion,journey:!!document.querySelector('.journey-track')?.dataset.enhanced,gallery:!!document.querySelector('.material-gallery')?.dataset.motion,videoCount:document.querySelectorAll('video').length,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  for(const name of ['hero','journey','gallery'])assert.equal(state[name],enabled,mode+': '+name);
  assert.equal(state.videoCount,0);assert.equal(state.overflow,false);
  if(mode==='warm-no-connection'){assert(state.connectionAbsent);assert.equal(state.navigationTransferSize,0);assert.equal(state.posterTransferSize,0);}
  if(mode==='high-ttfb')assert(state.ttfbMs>=900);
  if(enabled){
   const before=await page.$eval('.cinema-cover',e=>getComputedStyle(e).clipPath);
   const range=await page.$eval('.cinema-hero',e=>e.offsetHeight-innerHeight);
   await page.evaluate(y=>scrollTo(0,y*.7),range);await pause(400);
   state.heroClip=await page.$eval('.cinema-cover',e=>getComputedStyle(e).clipPath);assert.notEqual(state.heroClip,before);
   await page.$eval('.journey-track',e=>e.scrollIntoView());await pause(250);
   const journey=await page.$eval('.journey-track',e=>({top:e.getBoundingClientRect().top+scrollY,range:e.offsetHeight-innerHeight}));
   await page.evaluate(g=>scrollTo(0,g.top+g.range*.65),journey);await pause(400);
   state.journeyFrame=await page.$$eval('.journey-frame',items=>items.findIndex(e=>e.dataset.current==='true'));assert.equal(state.journeyFrame,2);
   await page.$eval('.material-gallery',e=>e.scrollIntoView());await pause(250);
   const gallery=await page.$eval('.material-gallery',e=>({top:e.getBoundingClientRect().top+scrollY,range:e.offsetHeight-innerHeight}));
   await page.evaluate(g=>scrollTo(0,g.top+g.range*.6),gallery);await pause(400);
   state.galleryX=await page.$eval('.gallery-rail',e=>new DOMMatrix(getComputedStyle(e).transform).m41);assert(state.galleryX<-100);
   if(mode==='save-data'){
    await page.$eval('#configurador',e=>e.scrollIntoView());await page.waitForSelector('[data-seletor]');await page.click('[data-material="bege"]');
    await page.waitForSelector('[data-escolha="cozinha-bege"]');
    state.selectorFade=await page.$eval('[data-escolha="cozinha-bege"]',e=>getComputedStyle(e).animationName);assert.notEqual(state.selectorFade,'none');
   }
  }
  assert.deepEqual(errors,[]);assert.deepEqual(videoRequests,[]);
  report.cases.push({width,mode,...state});await context.close();
 }
 fs.writeFileSync(process.env.AUDIT_REPORT ?? '.maestri/motion-always-report.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
