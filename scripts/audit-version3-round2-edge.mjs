import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const browser=await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const report={sizes:[],retry:null,rapid:null,menu:null};
try{
 const page=await browser.newPage();
 for(const [width,height] of [[320,740],[390,740],[390,844],[768,1024],[1024,768],[1440,900]]){
  await page.setViewport({width,height});await page.goto('http://127.0.0.1:3108/3/',{waitUntil:'networkidle0'});
  await page.$eval('.material-gallery',e=>e.scrollIntoView());await pause(300);
  const state=await page.evaluate(()=>({width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,pinned:!!document.querySelector('.material-gallery').dataset.motion,noteVisible:document.querySelector('.gallery-note').getBoundingClientRect().bottom<=innerHeight,windowScroll:document.querySelector('.gallery-window').scrollLeft}));
  assert.equal(state.overflow,false);
  if(state.pinned){
   assert(state.noteVisible);
   for(let i=0;i<6;i++){
    await page.$$eval('.gallery-material a',(links,index)=>links[index].focus(),i);await pause(100);
    const focus=await page.evaluate(()=>({left:document.activeElement.getBoundingClientRect().left,right:document.activeElement.getBoundingClientRect().right,scroll:document.querySelector('.gallery-window').scrollLeft}));
    assert(focus.left>=-1&&focus.right<=width+1,JSON.stringify({width,height,index:i,focus}));assert.equal(focus.scroll,0);
   }
  }
  report.sizes.push(state);
 }
 await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
 await page.goto('http://127.0.0.1:3108/3/',{waitUntil:'networkidle0'});await page.$eval('#configurador',e=>e.scrollIntoView());await pause(600);
 await page.setRequestInterception(true);
 const deny=r=>r.url().includes('cozinha-escuro-')?r.abort():r.continue();
 page.on('request',deny);await page.click('[data-material="escuro"]');await pause(500);
 report.retry=await page.$eval('[data-seletor]',e=>({message:e.querySelector('[role="status"]').textContent,choice:e.querySelector('[data-escolha]').dataset.escolha}));
 assert(report.retry.message.includes('não carregou'));assert.equal(report.retry.choice,'cozinha-rosado');
 page.off('request',deny);await page.setRequestInterception(false);await page.click('[data-material="escuro"]');await page.waitForSelector('[data-escolha="cozinha-escuro"]');
 await page.evaluate(()=>{for(const tone of ['rosado','bege','escuro','rosado','bege'])document.querySelector('[data-material="'+tone+'"]').click();});
 await page.waitForSelector('[data-escolha="cozinha-bege"]');report.rapid=await page.$eval('[data-escolha]',e=>e.dataset.escolha);
 await page.evaluate(()=>scrollTo(0,0));await page.click('.mobile-nav summary');await pause(100);
 const trapped=await page.$eval('main',e=>e.inert);await page.keyboard.press('Escape');await pause(100);
 report.menu=await page.evaluate(trapped=>({trapped,closed:!document.querySelector('.mobile-nav').open,restored:!document.querySelector('main').inert,focus:document.activeElement.tagName}),trapped);
 assert(report.menu.trapped&&report.menu.closed&&report.menu.restored);assert.equal(report.menu.focus,'SUMMARY');
 await fs.writeFile('docs/auditorias/versao-3/rodada-2/edge.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
