import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/check.cjs');
const browser=await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const pause=ms=>new Promise(r=>setTimeout(r,ms)),checks=[],errors=[];
try{for(const mode of ['normal','desktop','reduced','save','fallback']){
 const context=await browser.createBrowserContext(),page=await context.newPage();await page.setViewport({width:mode==='desktop'?1440:393,height:mode==='desktop'?1000:873});await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:mode==='reduced'?'reduce':'no-preference'}]);
 if(mode==='save')await page.evaluateOnNewDocument(()=>Object.defineProperty(navigator.connection,'saveData',{value:true}));
 if(mode==='fallback')await page.evaluateOnNewDocument(()=>{delete window.requestIdleCallback;delete window.cancelIdleCallback;});
 const requests=[];page.on('request',r=>{if(r.url().includes('/configurador/'))requests.push(new URL(r.url()).pathname);});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3107/',{waitUntil:'load'});await pause(700);checks.push({name:`${mode}: nenhum asset na abertura`,pass:requests.length===0,requests:[...requests]});
 await page.$eval('[data-configurador]',el=>scrollTo({top:scrollY+el.getBoundingClientRect().top-innerHeight*2,behavior:'instant'}));await pause(1700);
 const expected=mode==='save'||mode==='reduced'?1:2;
 checks.push({name:`${mode}: só ${expected} quadros iniciais antes da montagem`,pass:requests.length===expected&&requests.every(url=>/orbita-rosado\/(retrato|1280)\/0[01]\.avif$/.test(url))&&!(await page.$('[data-immersive]')),requests:[...requests]});
 await page.$eval('[data-configurador]',el=>el.scrollIntoView());await page.waitForSelector('canvas[data-frame]');await pause(150);checks.push({name:`${mode}: primeiro quadro reutilizado sem novo pedido`,pass:requests.filter(url=>/\/00\.avif$/.test(url)).length===1});await context.close();
}
 const context=await browser.createBrowserContext(),page=await context.newPage();await page.setViewport({width:393,height:873});await page.setRequestInterception(true);page.on('request',r=>{if(/capa-poster.*\.avif/.test(r.url()))setTimeout(()=>r.continue(),2200);else void r.continue();});const starts=[];page.on('request',r=>{if(r.url().includes('/configurador/'))starts.push(r.url());});await page.goto('http://127.0.0.1:3107/',{waitUntil:'domcontentloaded'});await page.$eval('[data-configurador]',el=>el.scrollIntoView());await pause(400);checks.push({name:'load pendente: nenhuma antecipação mesmo com palco próximo',pass:await page.evaluate(()=>document.readyState!=='complete')&&starts.length===0});await page.waitForFunction(()=>document.readyState==='complete');await page.waitForSelector('canvas[data-frame]');await context.close();
}catch(e){errors.push(e.stack);}finally{await browser.close();}
await fs.writeFile('C:/Users/Vitor/Desktop/sites-wordpress/jk-marmores-configurador/src/components/configurador/fluidez-guards.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors}));if(errors.length||checks.some(c=>!c.pass))process.exitCode=1;
