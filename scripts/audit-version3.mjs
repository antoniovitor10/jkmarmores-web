import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer = require('puppeteer-core');
const folder='docs/auditorias/versao-3';
await fs.mkdir(folder,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const report={errors:[],viewports:[]};
try {
 for(const width of [390,1440]) {
  const page=await browser.newPage();
  await page.setViewport({width,height:width===390?844:900,deviceScaleFactor:1,isMobile:width===390,hasTouch:width===390});
  const cdp=await page.createCDPSession();await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url());});
  await page.evaluateOnNewDocument(()=>{
   window.__tasks=[];window.__shifts=[];window.__events=[];window.__gesturePaint=[];
   new PerformanceObserver(list=>window.__events.push(...list.getEntries().map(e=>({name:e.name,duration:e.duration})))).observe({type:'event',durationThreshold:16,buffered:true});
   new PerformanceObserver(list=>window.__tasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});
   new PerformanceObserver(list=>window.__shifts.push(...list.getEntries().filter(e=>!e.hadRecentInput).map(e=>e.value))).observe({type:'layout-shift',buffered:true});
  });
  await page.goto('http://127.0.0.1:3108/3/',{waitUntil:'networkidle0'});
  await page.screenshot({path:folder+'/'+width+'-capa.png'});
  const info=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,heroMotion:!!document.querySelector('.cinema-hero')?.dataset.motion,initialLongestTask:Math.max(0,...window.__tasks.map(t=>t.duration)),cls:window.__shifts.reduce((a,b)=>a+b,0),badAssets:[...document.querySelectorAll('[src],[href]')].map(el=>el.getAttribute('src')||el.getAttribute('href')).filter(x=>x?.startsWith('/')&&!x.startsWith('/3/'))}));
  const top=await page.$eval('.cinema-hero',e=>e.offsetHeight-innerHeight);
  await page.evaluate(y=>scrollTo(0,y*.7),top);await new Promise(r=>setTimeout(r,450));
  await page.screenshot({path:folder+'/'+width+'-monograma.png'});
  const journey=await page.$eval('.journey-track',e=>({top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight}));
  for(let i=0;i<4;i++) {
   await page.evaluate(y=>scrollTo(0,y),journey.top+(journey.height-(width===390?844:900))*(i+.4)/4);
   await new Promise(r=>setTimeout(r,350));
   await page.screenshot({path:folder+'/'+width+'-jornada-'+(i+1)+'.png'});
  }
  await page.$eval('#configurador',e=>e.scrollIntoView());await new Promise(r=>setTimeout(r,1200));
  await page.screenshot({path:folder+'/'+width+'-ambiente.png'});
  await page.evaluate(()=>{const view=document.querySelector('.orbit-view');const img=view.querySelector('img');let began=0;view.addEventListener('pointerdown',()=>{began=performance.now()});new MutationObserver(()=>{if(!began)return;const start=began;began=0;img.decode().then(()=>requestAnimationFrame(()=>{window.__gesturePaint.push(performance.now()-start);})).catch(()=>{});}).observe(img,{attributes:true,attributeFilter:['src']});});
  const start=await page.$eval('.orbit-view img',e=>e.src);
  const bounds=await page.$eval('.orbit-view',e=>e.getBoundingClientRect().toJSON());
  await page.mouse.move(bounds.x+bounds.width*.5,bounds.y+150);await page.mouse.down();await page.mouse.move(bounds.x+bounds.width*.5+75,bounds.y+150,{steps:8});await page.mouse.up();
  await new Promise(r=>setTimeout(r,400));
  info.orbitChanged=await page.$eval('.orbit-view img',(e,src)=>e.src!==src,start);
  await page.click('.orbit-toolbar button:nth-child(2)');
  await new Promise(r=>setTimeout(r,500));
  info.selected=await page.$eval('.orbit-description',e=>e.textContent);
  Object.assign(info,await page.evaluate(()=>({interactionMaxDuration:window.__events.length?Math.max(...window.__events.map(e=>e.duration)):'below 16ms',gestureToPaintMs:window.__gesturePaint})));
  report.viewports.push(info);await page.close();
 }
 const page=await browser.newPage();await page.setJavaScriptEnabled(false);await page.goto('http://127.0.0.1:3108/3/',{waitUntil:'networkidle0'});
 report.noJs=await page.evaluate(()=>({h1:document.querySelector('h1')?.textContent,images:[...document.querySelectorAll('img')].filter(e=>e.complete&&e.naturalWidth>0).length,whatsapp:!!document.querySelector('a[href*="wa.me/5511967976902"]')}));
 await page.close();
 const reduced=await browser.newPage();await reduced.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await reduced.goto('http://127.0.0.1:3108/3/',{waitUntil:'networkidle0'});
 report.reduced=await reduced.evaluate(()=>({motion:!!document.querySelector('.cinema-hero')?.dataset.motion,video:document.querySelectorAll('video').length}));
 await reduced.close();
 const slow=await browser.newPage();await slow.evaluateOnNewDocument(()=>Object.defineProperty(navigator,'connection',{value:Object.assign(new EventTarget(),{saveData:true,effectiveType:'3g',downlink:.7})}));await slow.goto('http://127.0.0.1:3108/3/',{waitUntil:'networkidle0'});report.saveData=await slow.evaluate(()=>({motion:!!document.querySelector('.cinema-hero')?.dataset.motion,video:document.querySelectorAll('video').length}));await slow.close();
 await fs.writeFile(folder+'/funcional.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}

