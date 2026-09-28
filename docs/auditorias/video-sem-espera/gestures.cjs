/* eslint-disable @typescript-eslint/no-require-imports -- auditoria local CDP */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const url='http://127.0.0.1:3105/';
const hero='[data-hero-stage]';
async function step(page,index){
  await page.evaluate(i=>{
    const root=document.querySelector('.journey-track'),sticky=document.querySelector('.journey-sticky');
    const mask=(innerHeight*6.2-sticky.offsetHeight)*.22;
    scrollTo(0,scrollY+root.getBoundingClientRect().top+(i<0?0:mask+(root.offsetHeight-sticky.offsetHeight-mask)*(i+.18)/3.65));
  },index);
}
async function swipe(page,cdp,desktop){
  if(desktop){await page.mouse.move(700,450);await page.mouse.wheel(0,140);return;}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:190,y:650}]});
  for(let y=630;y>=510;y-=20){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:190,y}]});await page.waitForTimeout(25);}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
}
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[];
try{
for(const mode of (process.env.VIDEO_MODES||'normal4g,desktop,slow4g,noapi-slow,noapi-ttfb,noapi-fast,3g,2g,save-data,reduced,unready,partial-buffer').split(',')){
  const desktop=mode==='desktop',slow=['slow4g','noapi-slow'].includes(mode);
  const ctx=await browser.newContext({viewport:desktop?{width:1440,height:900}:{width:393,height:873},isMobile:!desktop,hasTouch:!desktop,reducedMotion:mode==='reduced'?'reduce':'no-preference'});
  const page=await ctx.newPage(),cdp=await ctx.newCDPSession(page),requests=[],errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\.mp4/.test(r.url()))requests.push(r.url());});
  if(!desktop){await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:slow?150:40,downloadThroughput:(slow?200:1000)*1024,uploadThroughput:75*1024,connectionType:'cellular4g'});}
  if(mode==='noapi-ttfb')await page.route('**/img/capa-poster-*',async route=>{await new Promise(r=>setTimeout(r,850));await route.continue();});
  let release;
  if(mode==='unready'){
    const gate=new Promise(r=>{release=r;});
    await page.route('**/video/*.mp4',async route=>{await gate;await route.continue();});
  }
  await page.addInitScript(mode=>{
    if(mode.startsWith('noapi'))Object.defineProperty(navigator,'connection',{value:undefined});
    if(['3g','2g','save-data'].includes(mode))Object.defineProperty(navigator,'connection',{value:{effectiveType:mode==='save-data'?'4g':mode,saveData:mode==='save-data',addEventListener(){},removeEventListener(){}}});
    if(mode==='partial-buffer'){
      const original=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,'buffered').get;
      window.__partial=true;
      Object.defineProperty(HTMLMediaElement.prototype,'buffered',{get(){return window.__partial?{length:1,start:()=>0,end:()=>.1}:original.call(this);}});
    }
    window.__motion={samples:[],events:[],scrollAt:null};
    addEventListener('scroll',()=>{window.__motion.scrollAt??=performance.now();},{passive:true});
    for(const name of ['waiting','playing'])document.addEventListener(name,e=>{if(e.target instanceof HTMLVideoElement)window.__motion.events.push({name,at:performance.now(),src:e.target.currentSrc});},true);
  },mode);
  await page.goto(url,{waitUntil:'load'});await page.waitForTimeout(450);
  await page.evaluate(()=>{
    document.documentElement.style.scrollBehavior='auto';
    function sample(){
      const root=document.querySelector('[data-hero-stage]').parentElement,img=root.querySelector('figure img'),v=root.querySelector('video');
      window.__motion.samples.push({at:performance.now(),mode:root.dataset.mediaMode,settled:root.dataset.mediaSettled,transform:getComputedStyle(img).transform,time:v?.currentTime,ready:v?.readyState});
      if(!window.__motion.stop)requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  const baseline=await page.locator(hero).evaluate(el=>({policy:el.parentElement.dataset.mediaPolicy,ready:el.querySelector('video')?.readyState}));
  await swipe(page,cdp,desktop);await page.waitForTimeout(1650);
  const state=await page.evaluate(()=>{window.__motion.stop=true;return window.__motion;});
  const fallback=['slow4g','noapi-slow','noapi-ttfb','3g','2g','unready','partial-buffer'].includes(mode);
  const staticMode=['save-data','reduced'].includes(mode);
  if(!staticMode){
    assert.equal(state.samples.at(-1).mode,fallback?'poster':'video',mode);
    assert.equal(state.samples.at(-1).settled,'1',mode);
    assert.equal(state.events.filter(e=>e.name==='waiting').length,0,`${mode}: buffering`);
  }
  const first=state.samples.find(x=>fallback?x.transform!=='none'&&x.transform!=='matrix(1, 0, 0, 1, 0, 0)':x.time>0);
  const end=state.samples.find(x=>x.settled==='1');
  const stages=[];
  if(!staticMode){
    await step(page,-1);await page.waitForTimeout(700);
    for(let i=0;i<4;i++){
      await step(page,i);await page.waitForTimeout(1600);
      const frame=await page.locator(`[data-frame="${i}"]`).evaluate(el=>({index:el.dataset.frame,mode:el.dataset.mediaMode,settled:el.dataset.mediaSettled,ready:el.querySelector('video')?.readyState,transform:getComputedStyle(el.querySelector('img')).transform}));
      assert.equal(frame.settled,'1',`${mode}: etapa ${i}`);
      if(fallback)assert.equal(frame.mode,'poster',`${mode}: etapa ${i}`);
      if(['normal4g','desktop','noapi-fast'].includes(mode))assert.equal(frame.mode,'video',`${mode}: próxima etapa aquecida`);
      stages.push(frame);
    }
  }else assert.equal(await page.locator('video').count(),0);
  if(['unready','partial-buffer'].includes(mode)){
    if(release)release();else await page.evaluate(()=>{window.__partial=false;});
    await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=3&&v.buffered.length&&v.buffered.end(v.buffered.length-1)>=v.duration-.05));
    await page.waitForTimeout(400);
    assert.equal(await page.locator('[data-frame="3"]').getAttribute('data-media-mode'),'poster','dados tardios não podem trocar o modo');
    assert.equal(await page.locator('.home-hero video').evaluate(v=>v.currentTime),0,'vídeo tardio não toca');
    await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1600);
    await swipe(page,cdp,desktop);await page.waitForTimeout(1650);
    assert.equal(await page.locator(hero).evaluate(el=>el.parentElement.dataset.mediaMode),'video','próximo gesto usa vídeo pronto');
    // Voltar à máscara rearma todos os quatro trechos, agora completamente carregados.
    await step(page,-1);await page.waitForTimeout(1600);
    for(let i=0;i<4;i++){await step(page,i);await page.waitForTimeout(1600);assert.equal(await page.locator(`[data-frame="${i}"]`).getAttribute('data-media-mode'),'video');}
  }
  if(fallback&&!['unready','partial-buffer'].includes(mode)||staticMode)assert.equal(requests.length,0,`${mode}: não deve requisitar vídeo`);
  assert.deepEqual(errors,[]);
  const result={mode,baseline,responseMs:first?first.at-state.scrollAt:null,finishMs:end?end.at-state.scrollAt:null,stages,requests,events:state.events,samples:state.samples};
  results.push(result);console.log(JSON.stringify({...result,samples:undefined}));
  await ctx.close();
}
}finally{fs.writeFileSync(path.join(__dirname,`${process.argv[2]||'depois'}-gestures.json`),JSON.stringify(results,null,2));await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
