import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { createRequire } from 'node:module';

const requireAudit=createRequire((process.env.AUDIT_MODULES ?? 'C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules')+'/audit.cjs');
const puppeteer=requireAudit('puppeteer-core');
const url=process.env.AUDIT_URL ?? 'http://127.0.0.1:3108/3/';
const label=process.env.AUDIT_LABEL ?? 'depois';
const folder='docs/auditorias/versao-3/2026-10-01-galeria';
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const percentile=(values,p)=>[...values].sort((a,b)=>a-b)[Math.min(values.length-1,Math.floor(values.length*p))] ?? 0;
await fs.mkdir(folder,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
try {
 const page=await browser.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 const viewport={width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true};
 await page.setViewport(viewport);
 const cdp=await page.createCDPSession();
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.goto(url,{waitUntil:'networkidle0'});
 await page.waitForSelector('.material-gallery[data-motion]');
 await page.$eval('.material-gallery',root=>scrollTo(0,root.getBoundingClientRect().top+scrollY-600));
 await pause(500);
 await page.$eval('.material-gallery',root=>scrollTo(0,root.getBoundingClientRect().top+scrollY-90));
 await pause(500);
 await page.tracing.start({categories:['devtools.timeline','disabled-by-default-devtools.timeline.frame','blink.user_timing','toplevel']});
 await page.evaluate(()=>{
  const root=document.querySelector('.material-gallery'),stage=root.querySelector('.gallery-stage'),rail=root.querySelector('.gallery-rail');
  window.galleryAudit={frames:[],marks:[],running:true};
  let previous=performance.now();
  new PerformanceObserver(list=>window.galleryAudit.marks.push(...list.getEntries().map(e=>({name:'longtask',t:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:false});
  new PerformanceObserver(list=>window.galleryAudit.marks.push(...list.getEntries().filter(e=>!e.hadRecentInput).map(e=>({name:'layout-shift',t:e.startTime,value:e.value})))).observe({type:'layout-shift',buffered:false});
  const sample=t=>{
   if(!window.galleryAudit.running)return;
   const r=root.getBoundingClientRect(),s=stage.getBoundingClientRect();
   window.galleryAudit.frames.push({t,dt:t-previous,y:scrollY,rootTop:r.top+scrollY,rootHeight:r.height,stageTop:s.top,stageHeight:s.height,expectedTop:Math.min(Math.max(r.top,0),r.bottom-s.height),x:new DOMMatrix(getComputedStyle(rail).transform).m41,viewport:innerHeight});
   previous=t;requestAnimationFrame(sample);
  };requestAnimationFrame(sample);
 });
 const mark=async name=>page.evaluate(name=>{performance.mark(name);window.galleryAudit.marks.push({name,t:performance.now()});},name);
 // CDP dispatchTouchEvent drives native scrolling; resize occurs before touchEnd.
 for(let gesture=0;gesture<7;gesture++){
  await mark('toque-'+gesture);
  const reverse=gesture===6;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:reverse?280:650,radiusX:3,radiusY:3,force:1}]});
  for(let step=1;step<=24;step++){
   if(gesture===1&&step===10){await mark('barra-expandida');await page.setViewport({...viewport,height:760});}
   if(gesture===2&&step===10){await mark('barra-recolhida');await page.setViewport(viewport);}
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y:reverse?280+step*12:650-step*12,radiusX:3,radiusY:3,force:1}]});
   await pause(16);
  }
  // Finish with a stationary finger to avoid a fling hiding individual positions.
  await pause(120);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(100);
 }
 await pause(350);
 const samples=await page.evaluate(()=>{window.galleryAudit.running=false;return window.galleryAudit;});
 const trace=await page.tracing.stop();
 await fs.writeFile(folder+'/'+label+'-trace.json.gz',gzipSync(trace));
 await fs.writeFile(folder+'/'+label+'-quadros.json',JSON.stringify(samples,null,2));
 const frames=samples.frames.filter(frame=>frame.y>frame.rootTop+10&&frame.y<frame.rootTop+frame.rootHeight-frame.stageHeight-10);
 const errorsY=frames.map(f=>Math.abs(f.stageTop-f.expectedTop));
 const rootPositions=samples.frames.map(f=>f.rootTop);
 const jumps=[];
 for(let i=1;i<frames.length;i++){
  const a=frames[i-1],b=frames[i];
  if(b.y>a.y+2&&b.x>a.x+2)jumps.push({t:b.t,scrollDelta:b.y-a.y,xDelta:b.x-a.x});
 }
 const state=await page.evaluate(()=>({stagePosition:getComputedStyle(document.querySelector('.gallery-stage')).position,pinSpacers:document.querySelectorAll('.pin-spacer').length,images:[...document.querySelectorAll('.gallery-material img')].map(img=>({loaded:img.complete&&img.naturalWidth>0,width:img.naturalWidth,loading:img.loading,decoded:img.dataset.decoded==='true'})),overflow:document.documentElement.scrollWidth>innerWidth}));
 const summary={url,label,cpu:4,touch:'CDP dispatchTouchEvent',heightChanges:[844,760,844],frames:samples.frames.length,activeFrames:frames.length,frameIntervalP95Ms:percentile(frames.map(f=>f.dt),.95),stageErrorMaxPx:Math.max(...errorsY),stageErrorP95Px:percentile(errorsY,.95),entryExitErrorMaxPx:Math.max(...samples.frames.map(f=>Math.abs(f.stageTop-f.expectedTop))),rootPositionRangePx:Math.max(...rootPositions)-Math.min(...rootPositions),horizontalReversals:jumps,longTasks:samples.marks.filter(m=>m.name==='longtask'),cls:samples.marks.filter(m=>m.name==='layout-shift').reduce((total,m)=>total+m.value,0),errors,state};
 await fs.writeFile(folder+'/'+label+'-resumo.json',JSON.stringify(summary,null,2));
 await page.$eval('.material-gallery',root=>scrollTo(0,root.getBoundingClientRect().top+scrollY+200));await pause(400);
 await page.screenshot({path:folder+'/'+label+'-390.png'});
 if(label!=='antes'){
  await page.setViewport({...viewport,width:844,height:390});await pause(500);
  const landscape=await page.evaluate(()=>({gallery:!!document.querySelector('.material-gallery').dataset.motion,overflow:document.documentElement.scrollWidth>innerWidth}));
  assert.equal(landscape.gallery,false);assert.equal(landscape.overflow,false);
  await page.setViewport(viewport);await page.waitForSelector('.material-gallery[data-motion]');await pause(500);
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await pause(500);
  const reduced=await page.evaluate(()=>({hero:!!document.querySelector('.cinema-hero').dataset.motion,gallery:!!document.querySelector('.material-gallery').dataset.motion,journey:!!document.querySelector('.journey-track').dataset.enhanced,viewportVariable:document.documentElement.style.getPropertyValue('--motion-viewport')}));
  assert.deepEqual(reduced,{hero:false,gallery:false,journey:false,viewportVariable:''});
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);await page.waitForSelector('.material-gallery[data-motion]');
  summary.responsive={landscape,reduced,restored:true};
  await fs.writeFile(folder+'/'+label+'-resumo.json',JSON.stringify(summary,null,2));
 }
 console.log(JSON.stringify(summary,null,2));
 if(label!=='antes'){
  assert(frames.length>50);assert(summary.stageErrorMaxPx<=1,'Vertical gallery jump');
  assert(summary.entryExitErrorMaxPx<=1,'Entry/exit gallery jump');assert.equal(summary.cls,0);
  assert(summary.rootPositionRangePx<=1,'Height resize changed the scroll itinerary');
  assert.deepEqual(jumps,[]);assert.deepEqual(errors,[]);assert.equal(state.overflow,false);
  assert.equal(state.stagePosition,'sticky');assert.equal(state.pinSpacers,0);
  assert(state.images.every(img=>img.loaded&&img.decoded));
 }
}finally{await browser.close();}
