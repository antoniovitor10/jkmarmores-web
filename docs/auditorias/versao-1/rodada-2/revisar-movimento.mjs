import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import os from 'node:os';
const require=createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer=require('puppeteer-core');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const directory='docs/auditorias/versao-1/rodada-2';
const result={screens:[],frames:[],errors:[],routes:[]};
try {
 const page=await browser.newPage();
 page.on('pageerror',e=>result.errors.push(e.message));
 await page.evaluateOnNewDocument(()=>{
   Object.defineProperty(navigator,'connection',{value:{saveData:false,effectiveType:'4g',downlink:10}});
 });
 const cdp=await page.createCDPSession();
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 for(const width of [390,1440]) {
  await page.setViewport({width,height:width===390?844:900,deviceScaleFactor:1,isMobile:width===390,hasTouch:width===390});
  await page.goto('http://127.0.0.1:3111/1/',{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>document.querySelector('.prologo').dataset.enhanced==='true');
  const distance=await page.$eval('.prologo',e=>e.offsetHeight-e.querySelector('.home-hero').offsetHeight);
  for(const progress of [0,.2,.5,.8,1]) {
   await page.evaluate(y=>window.scrollTo(0,y),distance*progress);
   await new Promise(r=>setTimeout(r,250));
   await page.screenshot({path:`${directory}/transicao-${width}-${Math.round(progress*100)}.png`});
   result.screens.push(await page.evaluate(progress=>({width:innerWidth,progress,scrollY,mask:document.querySelector('.hero-monogram-path').getAttribute('transform'),introOpacity:getComputedStyle(document.querySelector('[data-hero-intro]')).opacity,signatureOpacity:getComputedStyle(document.querySelector('.hero-signature')).opacity,dock:document.querySelector('.mobile-quote-dock').dataset.visible,overflow:document.documentElement.scrollWidth>innerWidth}),progress));
  }
  await page.evaluate(y=>window.scrollTo(0,y),distance*.5);
  await new Promise(r=>setTimeout(r,250));
  const before=await page.$eval('.hero-monogram-path',e=>e.getAttribute('transform'));
  await new Promise(r=>setTimeout(r,750));
  const after=await page.$eval('.hero-monogram-path',e=>e.getAttribute('transform'));
  result.screens.push({width,hold:before===after,reverseMatrix:after});
  await page.evaluate(()=>window.scrollTo(0,0));
  const traceFile=`${os.tmpdir()}/jk-v1-rolagem-${width}-trace.json`;
  await page.tracing.start({path:traceFile,categories:['devtools.timeline','disabled-by-default-devtools.timeline','toplevel']});
  await page.evaluate(()=>{
    window.frameGaps=[];window.recordFrames=true;let previous=0;
    function frame(time){if(previous)window.frameGaps.push(time-previous);previous=time;if(window.recordFrames)requestAnimationFrame(frame);}
    requestAnimationFrame(frame);
  });
  await cdp.send('Input.synthesizeScrollGesture',{x:Math.round(width*.5),y:650,yDistance:-Math.round(distance),speed:420,gestureSourceType:width===390?'touch':'mouse'});
  await cdp.send('Input.synthesizeScrollGesture',{x:Math.round(width*.5),y:650,yDistance:Math.round(distance),speed:420,gestureSourceType:width===390?'touch':'mouse'});
  await page.evaluate(()=>window.recordFrames=false);
  await page.tracing.stop();
  const gaps=await page.evaluate(()=>window.frameGaps);
  const events=JSON.parse(await fs.readFile(traceFile,'utf8')).traceEvents;
  const paints=events.filter(e=>e.name==='Paint'&&e.ph==='X').map(e=>e.dur/1000);
  const rendererThreads=new Set(events.filter(e=>e.name==='thread_name'&&e.args.name==='CrRendererMain').map(e=>`${e.pid}:${e.tid}`));
  const tasks=events.filter(e=>e.name==='RunTask'&&e.ph==='X'&&rendererThreads.has(`${e.pid}:${e.tid}`)).map(e=>e.dur/1000);
  result.frames.push({width,samples:gaps.length,maxGapMs:Math.max(...gaps),gapsAbove34ms:gaps.filter(d=>d>34).length,maxPaintMs:Math.max(0,...paints),maxTaskMs:Math.max(0,...tasks)});
  await page.evaluate(()=>document.querySelector('.stone-panel-0').scrollIntoView());
  await page.tracing.start({path:traceFile,categories:['devtools.timeline','disabled-by-default-devtools.timeline','toplevel']});
  await page.evaluate(()=>{ window.frameGaps=[];window.recordFrames=true;let previous=0;function frame(time){if(previous)window.frameGaps.push(time-previous);previous=time;if(window.recordFrames)requestAnimationFrame(frame);}requestAnimationFrame(frame); });
  await cdp.send('Input.synthesizeScrollGesture',{x:Math.round(width*.5),y:650,yDistance:-2600,speed:600,gestureSourceType:width===390?'touch':'mouse'});
  await cdp.send('Input.synthesizeScrollGesture',{x:Math.round(width*.5),y:650,yDistance:2600,speed:600,gestureSourceType:width===390?'touch':'mouse'});
  await page.evaluate(()=>window.recordFrames=false);await page.tracing.stop();
  const journeyGaps=await page.evaluate(()=>window.frameGaps);
  const journeyEvents=JSON.parse(await fs.readFile(traceFile,'utf8')).traceEvents;
  const journeyPaint=journeyEvents.filter(e=>e.name==='Paint'&&e.ph==='X').map(e=>e.dur/1000);
  const journeyTasks=journeyEvents.filter(e=>e.name==='RunTask'&&e.ph==='X'&&rendererThreads.has(`${e.pid}:${e.tid}`)).map(e=>e.dur/1000);
  result.frames.push({width,section:'jornada',samples:journeyGaps.length,maxGapMs:Math.max(...journeyGaps),gapsAbove34ms:journeyGaps.filter(d=>d>34).length,maxPaintMs:Math.max(0,...journeyPaint),maxTaskMs:Math.max(0,...journeyTasks)});
  for(const progress of [.15,.38,.55]) {const top=await page.$eval('.stone-panel-0',el=>el.getBoundingClientRect().top+scrollY);const height=await page.$eval('.stone-panel-0',el=>el.offsetHeight);await page.evaluate(y=>window.scrollTo(0,y),top-(width===390?844:900)+progress*(height+(width===390?844:900)));await new Promise(r=>setTimeout(r,250));await page.screenshot({path:`${directory}/corte-${width}-${Math.round(progress*100)}.png`});result.screens.push(await page.evaluate(progress=>({width:innerWidth,section:'jornada',progress,cut:getComputedStyle(document.querySelector('.stone-panel-cut')).clipPath,title:getComputedStyle(document.querySelector('.stone-panel h3 > span')).transform,descriptionOpacity:getComputedStyle(document.querySelector('.stone-panel figcaption p')).opacity}),progress));}
  for(const route of ['sobre','materiais','contato','galeria','aplicacoes']){
   await page.goto(`http://127.0.0.1:3111/1/${route}/`,{waitUntil:'networkidle0'});
   result.routes.push(await page.evaluate(()=>({width:innerWidth,route:location.pathname,overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,background:getComputedStyle(document.body).backgroundColor})));
   for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=700){await page.evaluate(y=>window.scrollTo(0,y),y);await new Promise(r=>setTimeout(r,80));}await new Promise(r=>setTimeout(r,1200));await page.evaluate(()=>window.scrollTo(0,0));await new Promise(r=>setTimeout(r,300));
   if(['sobre','materiais','contato'].includes(route))await page.screenshot({path:`${directory}/${route}-${width}.png`,fullPage:true});
  }
 }
 await page.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});
 await page.goto('http://127.0.0.1:3111/1/',{waitUntil:'networkidle0'});
 await page.waitForFunction(()=>document.querySelector('.prologo').dataset.enhanced==='true');
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 result.preferenceChanged=await page.$eval('.prologo',e=>e.dataset.enhanced!=='true');
 await fs.writeFile(`${directory}/movimento.json`,JSON.stringify(result,null,2));
 console.log(JSON.stringify(result,null,2));
 if(result.errors.length||result.routes.some(r=>r.overflow)||result.screens.some(s=>s.overflow||s.hold===false)||!result.preferenceChanged)process.exitCode=1;
}finally{await browser.close();}
