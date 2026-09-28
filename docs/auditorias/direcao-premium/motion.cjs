/* eslint-disable @typescript-eslint/no-require-imports -- cenários de movimento */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const results=[];try{
 for(const mode of ['normal','slow','save-data','reduced','no-js']){
  const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced'?'reduce':'no-preference'});const p=await ctx.newPage();const c=await ctx.newCDPSession(p);await c.send('Emulation.setCPUThrottlingRate',{rate:4});
  if(mode==='slow'){await c.send('Network.enable');await c.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200*1024,uploadThroughput:75*1024,connectionType:'cellular3g'});}
  await p.addInitScript(mode=>{
   Object.defineProperty(navigator,'connection',{configurable:true,value:{effectiveType:mode==='slow'?'3g':'4g',downlink:mode==='slow'?1:10,saveData:mode==='save-data',addEventListener(){},removeEventListener(){}}});
   window.__motion={waiting:0,scroll:0,response:null,lcp:0};new PerformanceObserver(l=>{window.__motion.lcp=l.getEntries().at(-1).startTime}).observe({type:'largest-contentful-paint',buffered:true});
   document.addEventListener('waiting',()=>window.__motion.waiting++,true);addEventListener('scroll',()=>{window.__motion.scroll ||=performance.now();requestAnimationFrame(()=>{window.__motion.response ??=performance.now()-window.__motion.scroll})},{passive:true});
  },mode);
  const media=[];p.on('request',r=>{if(/\.mp4|\/motion-frames\//.test(r.url()))media.push(r.url())});
  await p.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle'});await p.waitForTimeout(400);
  if(mode!=='no-js'){await p.mouse.wheel(0,180);await p.waitForTimeout(600);await p.locator('.journey-heading').scrollIntoViewIfNeeded();await p.waitForTimeout(700);await p.evaluate(()=>{const r=document.querySelector('.journey-track');scrollTo(0,r.getBoundingClientRect().top+scrollY+r.offsetHeight*.4)});await p.waitForTimeout(800);}
  const data=mode==='no-js'?{}:await p.evaluate(()=>({...window.__motion,videos:document.querySelectorAll('video').length,enhanced:document.querySelector('.journey-track').hasAttribute('data-enhanced')}));
  if(['slow','save-data','reduced'].includes(mode)){assert.equal(media.length,0,mode);assert.equal(data.waiting,0,mode);assert.equal(data.enhanced,false,mode);}
  await p.screenshot({path:path.join(__dirname,`${process.argv[2]}-${mode}.png`)});results.push({mode,...data,media});await ctx.close();
 }
 }finally{await b.close();fs.writeFileSync(path.join(__dirname,`${process.argv[2]}-motion.json`),JSON.stringify(results,null,2))}
})().catch(e=>{console.error(e);process.exitCode=1});
