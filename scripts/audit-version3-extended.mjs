import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer=require('puppeteer-core');
const folder='docs/auditorias/versao-3';
const root='http://127.0.0.1:3108/3/';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const result={geometry:[],journey:[],combinations:[],routes:[],errors:[]};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function roomReady(page,room,material){await page.waitForFunction((r,m)=>document.querySelector('.orbit-view > img:not(.orbit-previous)').src.includes('/'+r+'-'+m+'/'),{timeout:5000},room,material);await pause(260);}
try {
 for(const width of [320,390,768,1440,1920]){
  const page=await browser.newPage();await page.setViewport({width,height:width<700?844:900,deviceScaleFactor:1,isMobile:width<700,hasTouch:width<700});
  page.on('pageerror',e=>result.errors.push(e.message));
  await page.goto(root,{waitUntil:'networkidle0'});
  const geometry=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,h1Count:document.querySelectorAll('h1').length,hero:document.querySelector('.cinema-hero').dataset.motion,cta:document.querySelector('.cinema-intro .button').getBoundingClientRect().toJSON(),poster:document.querySelector('.cinema-cover img').currentSrc}));
  assert.equal(geometry.overflow,false);assert.equal(geometry.h1Count,1);assert(geometry.cta.bottom<844 || width>=700);
  result.geometry.push(geometry);
  if(width===390||width===1440){
   await page.evaluate(()=>scrollTo(0,document.querySelector('.cinema-hero').offsetHeight-100));await pause(500);
   const track=await page.$eval('.journey-track',e=>({top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight-innerHeight}));
   for(let step=0;step<4;step++){
    await page.evaluate(y=>scrollTo(0,y),track.top+track.height*(step+.55)/4);await pause(420);
    const state=await page.evaluate(()=>({current:[...document.querySelectorAll('.journey-frame')].filter(e=>e.dataset.current==='true').map(e=>e.dataset.frame),visibleCaptions:[...document.querySelectorAll('.journey-frame figcaption')].filter(e=>getComputedStyle(e).visibility==='visible').length,dock:document.querySelector('.mobile-quote-dock').dataset.visible}));
    assert.deepEqual(state.current,[String(step)]);assert.equal(state.visibleCaptions,1);
    if(step===3)assert.equal(state.dock,'false');
    result.journey.push({width,step,...state});
   }
   await page.evaluate(y=>scrollTo(0,y),track.top+track.height);await pause(400);
   const exit=await page.$eval('.journey-exit',e=>getComputedStyle(e).clipPath);
   assert.equal(exit,'polygon(0px 0px, 100% 0px, 100% 100%, 0px 100%)');
   result.journey.push({width,exit});
   await page.screenshot({path:folder+'/'+width+'-saida-jornada.png'});
   await page.$eval('.orbit-view',e=>e.scrollIntoView({block:'start'}));await pause(800);
   const source=()=>page.$eval('.orbit-view > img:not(.orbit-previous)',e=>e.src);
   const initial=await source();
   await page.click('.orbit-directions button:first-child');await pause(180);
   assert((await source()).endsWith('/23.avif'),'click should rotate left and wrap');
   await page.click('.orbit-directions button:last-child');await pause(180);
   assert((await source()).endsWith('/00.avif'),'click should rotate right');
   await page.focus('.orbit-directions button:last-child');await page.keyboard.press('Enter');await pause(180);
   assert((await source()).endsWith('/01.avif'),'keyboard should rotate');
   if(width===390){
    const cdp=await page.createCDPSession();const box=await page.$eval('.orbit-view',e=>e.getBoundingClientRect().toJSON());
    const x=box.x+80,y=Math.max(180,box.y+180),old=await source();
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
    for(let move=1;move<=6;move++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+move*18,y}]});await pause(18);}
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(150);
    assert.notEqual(await source(),old,'real touch should rotate');
    result.touch=true;
    const oldY=await page.evaluate(()=>scrollY);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:500}]});
    for(let move=1;move<=8;move++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y:500-move*24}]});await pause(18);}
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(180);
    result.verticalTouchScroll=await page.evaluate(y=>scrollY-y,oldY);
    assert(result.verticalTouchScroll>40,'vertical touch should preserve document scroll');
   }
   const rooms=['cozinha','lavatorio'],tones=['rosado','bege','escuro'];
   for(let r=0;r<2;r++)for(let m=0;m<3;m++){
    await page.click('.orbit-toolbar fieldset:first-child button:nth-child('+(r+1)+')');
    await page.click('.orbit-toolbar fieldset:nth-child(2) button:nth-child('+(m+1)+')');
    await roomReady(page,rooms[r],tones[m]);
    const quote=await page.$eval('.orbit-toolbar > a',e=>e.href);
    assert(quote.startsWith('https://wa.me/5511967976902?'));
    result.combinations.push({width,room:rooms[r],tone:tones[m],source:await source(),quoteMessage:decodeURIComponent(quote.split('text=')[1])});
   }
   if(width===390){
    await page.evaluate(()=>scrollTo(0,0));await pause(300);
    await page.click('.mobile-nav summary');await pause(80);
    assert.equal(await page.$eval('main',e=>e.inert),true);
    await page.screenshot({path:folder+'/390-menu.png'});
    await page.focus('.mobile-nav nav a:last-child');await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.tagName),'SUMMARY');
    await page.keyboard.press('Escape');await pause(100);
    assert.equal(await page.$eval('main',e=>e.inert),false);
    result.menuTrap=true;
   }
   result.buttons=true;
  }
  await page.close();
 }
 for(const route of ['sobre/','materiais/','aplicacoes/','galeria/','contato/']){
  const page=await browser.newPage();await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
  await page.goto(root+route,{waitUntil:'networkidle0'});
  const state=await page.evaluate(()=>({h1:document.querySelector('h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth,canonical:document.querySelector('link[rel=canonical]')?.href,noindex:document.querySelector('meta[name=robots]')?.content,whatsapp:!!document.querySelector('a[href*="wa.me/5511967976902"]')}));
  assert(state.h1);assert.equal(state.overflow,false);assert(state.canonical.includes('/3/'+route));assert(state.noindex.includes('noindex'));assert(state.whatsapp);
  await page.screenshot({path:folder+'/390-'+route.replace('/','')+'.png',fullPage:true});
  if(route==='contato/'){
   await page.evaluate(()=>{window.__opened=null;window.open=(url)=>{window.__opened=url;return null;};});
   await page.type('[name=ambiente]','Cozinha');await page.type('[name=cidade]','Barueri');
   await page.click('.quote-form button');
   const message=await page.evaluate(()=>window.__opened);
   assert(message?.startsWith('https://wa.me/5511967976902?text='));
   assert(!decodeURIComponent(message).includes('Material de interesse: .'));
   result.form={url:message,optionalMaterial:true,externalWindowOpened:false};
  }
  result.routes.push({route,...state});await page.close();
 }
 const failed=await browser.newPage();await failed.setViewport({width:390,height:844});
 await failed.setRequestInterception(true);
 failed.on('request',req=>req.url().includes('/cozinha-escuro/720/00.avif')?req.abort():req.continue());
 await failed.goto(root,{waitUntil:'networkidle0'});await failed.$eval('.orbit-view',e=>e.scrollIntoView());await pause(800);
 const before=await failed.$eval('.orbit-view > img:not(.orbit-previous)',e=>e.src);
 await failed.click('.orbit-toolbar fieldset:nth-child(2) button:last-child');
 await failed.waitForFunction(()=>document.querySelector('.orbit-status').textContent.includes('outro tom'),{timeout:5000});
 assert.equal(await failed.$eval('.orbit-view > img:not(.orbit-previous)',e=>e.src),before);
 await failed.click('.orbit-toolbar fieldset:nth-child(2) button:first-child');await roomReady(failed,'cozinha','rosado');
 result.errorRecovery=true;await failed.close();
 assert.equal(result.errors.length,0);
 await fs.writeFile(folder+'/verificacao-completa.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify({geometry:result.geometry.map(e=>({width:e.width,overflow:e.overflow})),journey:result.journey,combinations:result.combinations.length,touch:result.touch,verticalTouchScroll:result.verticalTouchScroll,menuTrap:result.menuTrap,routes:result.routes.length,errorRecovery:result.errorRecovery,errors:result.errors}));
}finally{await browser.close();}
