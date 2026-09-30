import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer = require('puppeteer-core');
const directory = 'docs/auditorias/versao-1/rodada-2';
const origin = 'http://127.0.0.1:3111';
const browser = await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const result = {environment:'Chrome headless, CPU 4x, viewport 390x844; gestos por CDP, sem dispositivo físico',pages:[], errors:[], badPaths:[]};
try {
 const page = await browser.newPage();
 page.on('pageerror',error=>result.errors.push(error.message));
 page.on('requestfailed',request=>result.errors.push(request.url()+': '+request.failure()?.errorText));
 page.on('request',request=>{ if(request.url().startsWith(origin) && !new URL(request.url()).pathname.startsWith('/1/'))result.badPaths.push(request.url()); });
 await page.evaluateOnNewDocument(()=>{
   Object.defineProperty(navigator,'connection',{value:{saveData:false,effectiveType:'4g',downlink:10}});
   window.tasks=[]; window.events=[];
   new PerformanceObserver(list=>window.tasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});
   new PerformanceObserver(list=>window.events.push(...list.getEntries().map(e=>({name:e.name,duration:e.duration})))).observe({type:'event',buffered:true,durationThreshold:16});
 });
 const session=await page.createCDPSession();
 await session.send('Emulation.setCPUThrottlingRate',{rate:4});
 for(const width of [390,1440]) {
   await page.setViewport({width,height:width===390?844:900,deviceScaleFactor:1,isMobile:width===390,hasTouch:width===390});
   await page.goto(origin+'/1/',{waitUntil:'networkidle0'});
   await page.screenshot({path:directory+`/home-${width}.png`});
   result.pages.push(await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,robots:document.querySelector('meta[name=robots]')?.content,background:getComputedStyle(document.body).backgroundColor,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)})));
   await page.evaluate(()=>document.querySelector('.stone-panel-1').scrollIntoView());
   await new Promise(r=>setTimeout(r,400));
   await page.screenshot({path:directory+`/jornada-${width}.png`});
   await page.evaluate(()=>document.querySelector('#configurador').scrollIntoView());
   await new Promise(r=>setTimeout(r,400));
   await page.screenshot({path:directory+`/seletor-${width}.png`});
 }
 await page.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});
 await page.goto(origin+'/1/',{waitUntil:'networkidle0'});
 await page.click('.mobile-nav summary');
 result.menuOpen=await page.$eval('.mobile-nav',e=>e.open);
 await page.keyboard.press('Escape');
 result.menuEscClosed=await page.$eval('.mobile-nav',e=>!e.open);
 await page.evaluate(()=>document.querySelector('#configurador').scrollIntoView());
 for(const text of ['Bege','Escuro','Rosado','Lavatório']) {
   await page.evaluate(text=>[...document.querySelectorAll('.selector-controls button')].find(b=>b.textContent===text).click(),text);
   await page.waitForFunction(()=>document.querySelector('.selector-image').getAttribute('aria-busy')==='false');
 }
 result.selected=await page.$eval('.selector-caption',e=>e.textContent);
 result.whatsapp=await page.$eval('.selector-controls a',e=>e.href);
 await page.evaluate(()=>document.querySelector('#configurador').scrollIntoView());
 await new Promise(r=>setTimeout(r,400));
 result.dockBeforeSelectorCta=await page.$eval('.mobile-quote-dock',e=>e.dataset.visible);
 await page.evaluate(()=>document.querySelector('.selector-controls a').scrollIntoView());
 await new Promise(r=>setTimeout(r,400));
 result.dockWithSelectorCta=await page.$eval('.mobile-quote-dock',e=>e.dataset.visible);
 await page.evaluate(()=>window.scrollTo(0,0));
 await session.send('Input.synthesizeScrollGesture',{x:190,y:650,yDistance:-700,speed:650});
 await page.waitForFunction(()=>document.querySelector('.prologo').dataset.enhanced === 'true');
 result.motion=await page.evaluate(()=>({panelTransform:document.querySelector('.stone-panel-image').style.transform,signatureTransform:document.querySelector('.hero-monogram-path').getAttribute('transform'),videoCount:document.querySelectorAll('video,canvas').length,tasks:window.tasks,events:window.events}));
 for(const route of ['sobre','materiais','contato','galeria','aplicacoes','materiais/marmore','materiais/granito','materiais/marmore-dolomitico','materiais/quartzito','materiais/quartzo','materiais/ultracompacto']) {
   await page.goto(origin+'/1/'+route+'/',{waitUntil:'networkidle0'});
   result.pages.push(await page.evaluate(()=>({route:location.pathname,overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,canonical:document.querySelector('link[rel=canonical]')?.href})));
 }
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await page.goto(origin+'/1/',{waitUntil:'networkidle0'});
 result.reduced=await page.evaluate(()=>({enhanced:document.querySelector('.prologo').dataset.enhanced,animation:getComputedStyle(document.querySelector('.home-hero img')).animationName,lightAnimation:getComputedStyle(document.querySelector('.home-hero > div[aria-hidden]')).animationName}));
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
 const lite=await browser.newPage();
 await lite.evaluateOnNewDocument(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,effectiveType:'3g'}}));
 await lite.goto(origin+'/1/',{waitUntil:'networkidle0'});
 await lite.evaluate(()=>document.querySelector('.stone-signature').scrollIntoView());
 result.saveData=await lite.evaluate(()=>({enhanced:document.querySelector('.prologo').dataset.enhanced,lightEnabled:document.querySelector('.home-hero').dataset.motionReady,videoCount:document.querySelectorAll('video').length}));
 const staticPage=await browser.newPage();
 await staticPage.setJavaScriptEnabled(false);
 await staticPage.setViewport({width:390,height:844});
 await staticPage.goto(origin+'/1/',{waitUntil:'networkidle0'});
 result.noJavaScript=await staticPage.evaluate(()=>({h1:document.querySelector('h1')?.textContent,panels:document.querySelectorAll('.stone-panel').length,whatsapp:document.querySelector('.home-hero .button')?.href,selectorImage:document.querySelector('.selector-image img')?.getAttribute('src')}));
 await fs.writeFile(directory+'/funcional.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify({...result,motion:{...result.motion,tasks:result.motion.tasks.filter(e=>e.duration>150),events:result.motion.events}},null,2));
 if(result.errors.length||result.badPaths.length||result.pages.some(p=>p.overflow)||!result.menuEscClosed||result.dockBeforeSelectorCta!=='true'||result.dockWithSelectorCta!=='false') process.exitCode=1;
} finally {await browser.close();}
