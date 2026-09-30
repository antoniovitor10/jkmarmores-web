import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer = require('puppeteer-core');
const folder = 'docs/auditorias/versao-3/rodada-2';
await fs.mkdir(folder, { recursive:true });
const browser = await puppeteer.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions'] });
const report = { errors:[],viewports:[],fallbacks:[],pages:[] };
const pause = ms => new Promise(resolve => setTimeout(resolve,ms));
const base = 'http://127.0.0.1:3108/3/';
try {
 for (const width of [390,1440]) {
  const page = await browser.newPage();
  await page.setViewport({width,height:width===390?844:900,isMobile:width===390,hasTouch:width===390,deviceScaleFactor:1});
  const cdp=await page.createCDPSession();await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url());});
  await page.evaluateOnNewDocument(()=>{
   window.__tasks=[];window.__shifts=[];window.__events=[];
   new PerformanceObserver(list=>window.__tasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});
   new PerformanceObserver(list=>window.__shifts.push(...list.getEntries().filter(e=>!e.hadRecentInput).map(e=>e.value))).observe({type:'layout-shift',buffered:true});
   new PerformanceObserver(list=>window.__events.push(...list.getEntries().map(e=>({name:e.name,duration:e.duration})))).observe({type:'event',durationThreshold:16,buffered:true});
  });
  await page.goto(base,{waitUntil:'networkidle0'});
  await page.waitForSelector('.material-gallery[data-motion]');
  const info=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,initialMaxTask:Math.max(0,...window.__tasks.map(t=>t.duration)),initialCls:window.__shifts.reduce((a,b)=>a+b,0),badAssets:[...document.querySelectorAll('[src],[href]')].map(el=>el.getAttribute('src')||el.getAttribute('href')).filter(x=>x?.startsWith('/')&&!x.startsWith('/3/')),noOrbit:!document.querySelector('.orbit-view'),videoCount:document.querySelectorAll('video').length}));
  assert.equal(info.overflow,false);assert.deepEqual(info.badAssets,[]);assert(info.noOrbit);assert.equal(info.videoCount,0);
  await page.screenshot({path:folder+'/'+width+'-capa.png'});
  const hero=await page.$eval('.cinema-hero',e=>e.offsetHeight-innerHeight);
  await page.evaluate(y=>scrollTo(0,y*.9),hero);await pause(450);
  await page.screenshot({path:folder+'/'+width+'-jk.png'});
  const journey=await page.$eval('.journey-track',e=>({top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight-innerHeight}));
  info.journey=[];
  for (let i=0;i<4;i++) {
   await page.evaluate(y=>scrollTo(0,y),journey.top+journey.height*(i+.45)/4);await pause(450);
   const step=await page.evaluate(()=>({active:[...document.querySelectorAll('.journey-frame')].findIndex(e=>e.dataset.current==='true'),loaded:[...document.querySelectorAll('.journey-frame img')].every(e=>e.complete&&e.naturalWidth>0)}));
   assert.equal(step.active,i);assert(step.loaded);info.journey.push(step);
   await page.screenshot({path:folder+'/'+width+'-jornada-'+(i+1)+'.png'});
  }
  const gallery=await page.$eval('.material-gallery',e=>({top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight-innerHeight}));
  info.gallery=[];info.galleryTravel=gallery.height;
  for(let i=0;i<6;i++){
   await page.evaluate(y=>scrollTo(0,y),gallery.top+gallery.height*i/5);await pause(500);
   const item=await page.$$eval('.gallery-material',(items,index)=>{const e=items[index],rect=e.getBoundingClientRect(),link=e.querySelector('a').getBoundingClientRect();return {name:e.querySelector('h3').textContent,left:rect.left,right:rect.right,linkTop:link.top,linkBottom:link.bottom,imageLoaded:e.querySelector('img').complete&&e.querySelector('img').naturalWidth>0,overflow:document.documentElement.scrollWidth>innerWidth};},i);
   assert.equal(item.overflow,false);assert(item.imageLoaded);assert(item.left>=-2&&item.left<width/2);assert(item.linkBottom< (width===390?844:900));
   info.gallery.push(item);
   if(i===0||i===5)await page.screenshot({path:folder+'/'+width+'-material-'+(i+1)+'.png'});
  }
  // Keyboard users can reach every offscreen link without a scroll trap.
  await page.$eval('.gallery-material:nth-child(3) a',e=>e.focus());await pause(350);
  info.focusedMaterial=await page.evaluate(()=>({text:document.activeElement.textContent,left:document.activeElement.getBoundingClientRect().left}));
  assert(info.focusedMaterial.left>=0&&info.focusedMaterial.left<width);
  await page.$eval('#configurador',e=>e.scrollIntoView());await pause(850);
  info.combinations=[];
  for(const room of ['cozinha','lavatorio'])for(const tone of ['rosado','bege','escuro']){
   await page.click('[data-configurador] button[data-ambiente="'+room+'"]');
   await page.click('[data-configurador] button[data-material="'+tone+'"]');
   await page.waitForSelector('[data-escolha="'+room+'-'+tone+'"]');await pause(400);
   const state=await page.$eval('[data-escolha]',e=>({choice:e.dataset.escolha,loaded:e.complete&&e.naturalWidth>0}));
   assert(state.loaded);info.combinations.push(state);
  }
  await page.screenshot({path:folder+'/'+width+'-ambiente.png'});
  const box=await page.$eval('[data-escolha]',e=>e.getBoundingClientRect().toJSON());
  if(width===390){
   const before=await page.evaluate(()=>scrollY);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:Math.min(650,Math.max(300,box.top+150))}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y:180}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(350);
   info.nativeVerticalGesture=await page.evaluate(start=>scrollY>start+50,before);assert(info.nativeVerticalGesture);
  }
  await page.$eval('#orcamento',e=>e.scrollIntoView());await pause(350);await page.screenshot({path:folder+'/'+width+'-contato.png'});
  info.eventMax=await page.evaluate(()=>Math.max(0,...window.__events.map(e=>e.duration)));
  info.cls=await page.evaluate(()=>window.__shifts.reduce((a,b)=>a+b,0));
  report.viewports.push(info);
  await page.close();
 }
 for(const mode of ['no-js','reduced','save-data','slow','landscape']){
  const page=await browser.newPage();
  await page.setViewport({width:390,height:mode==='landscape'?600:844,isMobile:true,hasTouch:true});
  if(mode==='no-js')await page.setJavaScriptEnabled(false);
  if(mode==='reduced')await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  if(['save-data','slow'].includes(mode))await page.evaluateOnNewDocument(saved=>Object.defineProperty(navigator,'connection',{value:Object.assign(new EventTarget(),{saveData:saved,effectiveType:'3g',downlink:.7})}),mode==='save-data');
  await page.goto(base,{waitUntil:'networkidle0'});
  const result=await page.evaluate(()=>({heroMotion:!!document.querySelector('.cinema-hero')?.dataset.motion,galleryMotion:!!document.querySelector('.material-gallery')?.dataset.motion,categories:document.querySelectorAll('.gallery-material').length,overflow:document.documentElement.scrollWidth>innerWidth,video:document.querySelectorAll('video').length,whatsapp:!!document.querySelector('a[href*="wa.me/5511967976902"]')}));
  assert.equal(result.categories,6);assert.equal(result.overflow,false);assert.equal(result.video,0);assert(result.whatsapp);
  if(mode==='landscape')assert.equal(result.galleryMotion,false);else {assert.equal(result.heroMotion,false);assert.equal(result.galleryMotion,false);}
  report.fallbacks.push({mode,...result});await page.close();
 }
 for(const route of ['sobre/','materiais/','materiais/marmore/','materiais/granito/','materiais/marmore-dolomitico/','materiais/quartzito/','materiais/quartzo/','materiais/ultracompacto/','contato/']){
  const page=await browser.newPage();await page.setViewport({width:390,height:844});await page.goto(base+route,{waitUntil:'networkidle0'});
  const result=await page.evaluate(()=>({h1:document.querySelector('h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth,canonical:document.querySelector('link[rel="canonical"]')?.href,noindex:document.querySelector('meta[name="robots"]')?.content,ld:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>JSON.parse(e.textContent)).find(e=>e['@type']==='LocalBusiness'),body:document.querySelector('main').innerText}));
  assert.equal(result.overflow,false);assert(result.canonical.includes('/3/'+route));assert(result.noindex.includes('noindex'));assert.equal(result.ld.foundingDate,'2010');assert.equal(result.ld.areaServed.length,6);
  if(route==='sobre/')assert(result.body.includes('Desde 2010')&&result.body.includes('Baixada Santista'));
  if(route==='materiais/')assert(result.body.includes('Mármores Dolomíticos')&&result.body.includes('Lâminas Ultracompactas Sinterizadas'));
  delete result.body;report.pages.push({route,...result});
  if(['sobre/','materiais/'].includes(route))await page.screenshot({path:folder+'/390-'+route.replace('/','')+'.png',fullPage:true});
  await page.close();
 }
 assert.deepEqual(report.errors,[]);
 await fs.writeFile(folder+'/funcional.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
} finally {await browser.close();}
