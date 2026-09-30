import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer=require('puppeteer-core');
const directory='docs/auditorias/versao-1/rodada-2';
const origin=process.env.VERIFY_ORIGIN || 'http://127.0.0.1:3111';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const report={origin,environment:'Chrome headless; 390 px touch e 1440 px; CPU 4x; axe WCAG A/AA',routes:[],errors:[]};
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
try {
 const page=await browser.newPage();
 page.on('pageerror',error=>report.errors.push(error.message));
 await page.evaluateOnNewDocument(()=>{Object.defineProperty(navigator,'connection',{value:{saveData:false,effectiveType:'4g',downlink:10}});window.entryTasks=[];new PerformanceObserver(list=>window.entryTasks.push(...list.getEntries().map(e=>e.duration))).observe({type:'longtask',buffered:true});});
 const cdp=await page.createCDPSession();await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 const slugs=['marmore','granito','marmore-dolomitico','quartzito','quartzo','ultracompacto'];
 for(const width of [390,1440]) {
  await page.setViewport({width,height:width===390?844:900,isMobile:width===390,hasTouch:width===390,deviceScaleFactor:1});
  for(const route of ['', 'sobre/', 'materiais/', ...slugs.map(slug=>'materiais/'+slug+'/'), 'contato/']) {
   await page.goto(origin+'/1/'+route,{waitUntil:'networkidle0'});await delay(1500);
   const row=await page.evaluate(()=>({width:innerWidth,route:location.pathname,h1:document.querySelector('h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth,title:document.title,description:document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href,categories:document.querySelectorAll('.material-card').length,company:[...document.querySelectorAll('script[type="application/ld+json"]')].map(script=>JSON.parse(script.textContent)).find(data=>data['@type']==='LocalBusiness'),maxEntryTask:Math.max(0,...window.entryTasks)}));
   for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=700){await page.evaluate(y=>window.scrollTo(0,y),y);await delay(90);}await delay(1200);await page.evaluate(()=>window.scrollTo(0,0));await delay(300);
   await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   row.violations=await page.evaluate(async()=>{const result=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
   report.routes.push(row);
   if(['sobre/','materiais/','contato/'].includes(route))await page.screenshot({path:directory+'/'+route.replace('/','')+'-'+width+'.png',fullPage:true});
   if(!route){for(const [name,selector] of [['assinatura','.stone-signature'],['materiais-home','.home-materials'],['contato-home','.contact-panel']]){await page.$eval(selector,e=>e.scrollIntoView());await delay(400);await page.screenshot({path:directory+'/'+name+'-'+width+'.png'});}}
  }
 }
 await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:1});
 await page.goto(origin+'/1/',{waitUntil:'networkidle0'});await delay(1500);await page.$eval('#configurador',e=>e.scrollIntoView());await delay(350);
 const button=await page.$('.selector-controls button');await button.evaluate(e=>e.scrollIntoView({block:'center'}));const box=await button.boundingBox();await page.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);await delay(180);
 report.touchShine=await button.evaluate(e=>({active:e.dataset.gleam==='true',animation:getComputedStyle(e,'::before').animationName}));await delay(800);report.shineCleaned=await button.evaluate(e=>!e.dataset.gleam);
 await page.goto(origin+'/1/contato/',{waitUntil:'networkidle0'});
 await page.evaluate(()=>{window.open=(url)=>{window.quoteTarget=url;return null;};});
 const fields=await page.$$('.quote-form input');for(const [index,value] of ['Ambiente de teste','Quartzos','120 cm','Barueri'].entries()){await fields[index].type(value);}
 await page.$eval('.quote-form',form=>form.requestSubmit());report.quote=await page.evaluate(()=>window.quoteTarget);
 const staticPage=await browser.newPage();await staticPage.setJavaScriptEnabled(false);await staticPage.goto(origin+'/1/materiais/',{waitUntil:'networkidle0'});report.noJsMaterials=await staticPage.evaluate(()=>({count:document.querySelectorAll('.material-card').length,text:document.querySelector('main').innerText}));
 await fs.writeFile(directory+'/conteudo-a11y.json',JSON.stringify(report,null,2));
 const failed=report.routes.filter(row=>row.overflow||row.violations.length||row.company.foundingDate!=='2010'||row.company.areaServed.length!==6||(['/1/','/1/materiais/'].includes(row.route)&&row.categories!==6));
 console.log(JSON.stringify({routes:report.routes.length,failed,errors:report.errors,touchShine:report.touchShine,shineCleaned:report.shineCleaned,quote:report.quote,noJsCount:report.noJsMaterials.count,maxEntryTask:Math.max(...report.routes.map(row=>row.maxEntryTask))},null,2));
 if(failed.length||report.errors.length||!report.touchShine.active||!report.shineCleaned||report.noJsMaterials.count!==6||!report.quote?.startsWith('https://wa.me/5511967976902?'))process.exitCode=1;
}finally{await browser.close();}
