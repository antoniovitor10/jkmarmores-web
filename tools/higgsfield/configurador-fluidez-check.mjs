import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/check.cjs');
const browser=await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const label=process.argv[2],runs=[];
try{for(let i=0;i<3;i++){
 const context=await browser.createBrowserContext(),page=await context.newPage();await page.setViewport({width:393,height:873,deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const cdp=await page.createCDPSession();await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200*1024,uploadThroughput:75*1024});
 await page.evaluateOnNewDocument(()=>{
   window.__timing={};new PerformanceObserver(list=>{window.__timing.lcp=list.getEntries().at(-1).startTime;}).observe({type:'largest-contentful-paint',buffered:true});
   function sample(){const root=document.querySelector('[data-configurador]');if(root){const rect=root.getBoundingClientRect();if(rect.top<innerHeight&&rect.bottom>0&&!window.__timing.enter)window.__timing.enter=performance.now();const canvas=root.querySelector('canvas[data-frame]');if(canvas&&!window.__timing.image)window.__timing.image=performance.now();}requestAnimationFrame(sample);}requestAnimationFrame(sample);
 });
 await page.goto('http://127.0.0.1:3107/',{waitUntil:'load'});await page.evaluate(async()=>{
   await new Promise(r=>setTimeout(r,500));const root=document.querySelector('[data-configurador]'),target=root.getBoundingClientRect().top+scrollY;const start=performance.now(),from=scrollY;
   await new Promise(resolve=>{function step(t){const y=Math.min(target,from+(t-start)*.9);scrollTo({top:y,behavior:'instant'});if(y<target)requestAnimationFrame(step);else resolve();}requestAnimationFrame(step);});
 });
 await page.waitForFunction(()=>window.__timing.image,{timeout:20000});await new Promise(r=>setTimeout(r,300));
 const result=await page.evaluate(()=>{const resources=performance.getEntriesByType('resource').filter(r=>r.name.includes('/configurador/')),nav=performance.getEntriesByType('navigation')[0];return {...window.__timing,load:nav.loadEventEnd,firstFrameRequest:resources.find(r=>/\/\d+\.avif/.test(r.name))?.startTime,waitAfterEnter:Math.max(0,window.__timing.image-window.__timing.enter),resources:resources.map(r=>({url:new URL(r.name).pathname,start:r.startTime,end:r.responseEnd,bytes:r.transferSize})),beforeLoad:resources.filter(r=>r.startTime<nav.loadEventEnd).length};});runs.push(result);console.log(JSON.stringify({label,run:i,...result,resources:result.resources.length}));await context.close();
}}finally{await browser.close();}
await fs.writeFile(`C:/Users/Vitor/Desktop/sites-wordpress/jk-marmores-configurador/src/components/configurador/fluidez-${label}.json`,JSON.stringify({label,conditions:'Chromium 393x873, DPR1, CPU4x, 150ms, 200KiB/s down,75KiB/s up, perfil novo, scroll900px/s iniciando500ms após load',runs},null,2));
