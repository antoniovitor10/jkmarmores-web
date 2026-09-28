/* eslint-disable @typescript-eslint/no-require-imports -- teste funcional da rolagem */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[];try{
 for(const width of [390,1440]){
  const p=await b.newPage({viewport:{width,height:width===390?844:900},isMobile:width===390,hasTouch:width===390});
  await p.addInitScript(()=>Object.defineProperty(navigator,'connection',{configurable:true,value:{effectiveType:'4g',downlink:10,saveData:false,addEventListener(){},removeEventListener(){}}}));
  const errors=[],media=[];p.on('pageerror',e=>errors.push(String(e)));p.on('request',r=>{if(/\.mp4/.test(r.url()))media.push(r.url())});
  await p.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle'});assert.equal(media.length,0,'vídeo antes do gesto');
  await p.locator('.journey-heading').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelector('.journey-track').dataset.enhanced);
  const shots=[];
  for(const progress of [0,.25,.43,.62,.82,1,.43]){
   await p.evaluate(progress=>{const el=document.querySelector('.journey-track'),stage=el.querySelector('.journey-sticky');scrollTo(0,el.getBoundingClientRect().top+scrollY+(el.offsetHeight-stage.offsetHeight)*progress)},progress);
   await p.waitForTimeout(900);
   const state=await p.evaluate(()=>({mask:Number(getComputedStyle(document.querySelector('.journey-mask')).opacity),frames:[...document.querySelectorAll('.journey-frame')].map(e=>({opacity:Number(getComputedStyle(e).opacity),current:e.dataset.current,mode:e.dataset.mediaMode,image:e.querySelector('img').naturalWidth,video:e.querySelector('video')?.currentTime})),scrollY}));
   const name=`${process.argv[2]}-${width}-jornada-${shots.length}`;await p.screenshot({path:path.join(__dirname,name+'.png')});shots.push({progress,...state});
  }
  assert.ok(shots[0].mask>.95);assert.ok(shots[2].mask<.05);assert.ok(shots[5].frames[3].opacity>.95);assert.equal(shots[6].frames[1].current,'true');assert.equal(errors.length,0);results.push({width,shots,media,errors});await p.close();
 }
 }finally{await b.close();fs.writeFileSync(path.join(__dirname,`${process.argv[2]}-journey.json`),JSON.stringify(results,null,2))}
})().catch(e=>{console.error(e);process.exitCode=1});
