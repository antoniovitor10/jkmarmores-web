import fs from 'node:fs/promises';import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/a.cjs');
const browser=await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const dir='C:/Users/Vitor/Desktop/sites-wordpress/jk-marmores-configurador/docs/auditorias/configurador-design-2026-09-28',report=[],sleep=ms=>new Promise(r=>setTimeout(r,ms));
const check=(name,pass,evidence)=>{report.push({name,pass,evidence});};
async function load(page,url='/'){await page.goto(`http://127.0.0.1:3107${url}`,{waitUntil:'networkidle0'});await page.$eval('[data-configurador]',e=>e.scrollIntoView());await page.waitForSelector('canvas[data-frame]');await sleep(1700);await page.$eval('[data-immersive]',e=>scrollTo({top:scrollY+e.getBoundingClientRect().top,behavior:'instant'}));await sleep(300);}
async function clickText(page,text){await page.evaluate(t=>[...document.querySelectorAll('[data-immersive] button')].find(e=>e.textContent.trim()===t).click(),text);}
async function state(page){return page.$eval('[data-immersive]',e=>({...e.dataset,combo:e.querySelector('canvas').dataset.combo}));}
async function axe(page,name){await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const violations=await page.evaluate(async()=> (await window.axe.run('[data-immersive]',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations);check(name,violations.length===0,violations);}
try{
for(const width of [390,1440]){
 const context=await browser.createBrowserContext(),page=await context.newPage();await page.setViewport({width,height:width===390?844:900,deviceScaleFactor:1,isMobile:width===390,hasTouch:width===390});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));await load(page);await page.screenshot({path:`${dir}/b-depois-${width}.png`});await axe(page,`Axe recolhido ${width}`);
 const cdp=await page.createCDPSession();await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.evaluate(()=>{window.__interaction={events:[],tasks:[]};new PerformanceObserver(l=>window.__interaction.events.push(...l.getEntries().map(e=>({name:e.name,duration:e.duration})))).observe({type:'event',durationThreshold:16});new PerformanceObserver(l=>window.__interaction.tasks.push(...l.getEntries().map(e=>e.duration))).observe({type:'longtask'});});
 if(width===390){
   const hidden=await page.evaluate(()=>[...document.querySelectorAll('[data-immersive] button')].filter(e=>e.getClientRects().length&&!e.closest('[inert]')).map(e=>e.textContent.trim()));check('Sem controles antigos no celular',!hidden.some(t=>/Girar|zoom|enquadramento|Vista/.test(t)),hidden);
   // Browser touch events, including capture, cancellation and native scroll arbitration.
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:295,y:400,id:0}]});
   for(let i=1;i<=7;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:295-i*18,y:400,id:0}]});await sleep(20);}
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});const immediate=await state(page);await sleep(280);const rotated=await state(page);check('Arrastar e inércia terminam no quadro',Number(rotated.position)>0&&Math.abs(Number(rotated.position)*47-Math.round(Number(rotated.position)*47))<.005,{immediate,rotated});await page.screenshot({path:`${dir}/b-giro-${width}.png`});
   await page.touchscreen.tap(210,395);await sleep(80);await page.touchscreen.tap(210,395);await sleep(420);check('Duplo toque 1,6x',Math.abs(Number((await state(page)).zoom)-1.6)<.01,await state(page));await page.screenshot({path:`${dir}/b-zoom-${width}.png`});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:145,y:380,id:0},{x:245,y:380,id:1}]});
   for(let i=1;i<=5;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:145-i*4,y:380,id:0},{x:245+i*4,y:380,id:1}]});await sleep(20);}
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});check('Pinça amplia',Number((await state(page)).zoom)>1.8,await state(page));
   const handle=await page.$('button[aria-controls]'),box=await handle.boundingBox();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:box.y+22,id:0}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y:box.y-60,id:0}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(400);
   check('Puxar abre gaveta',await handle.evaluate(e=>e.getAttribute('aria-expanded')==='true'));
   await page.screenshot({path:`${dir}/b-gaveta-${width}.png`});await axe(page,'Axe gaveta aberta');
   await clickText(page,'Levigado');await sleep(280);await page.screenshot({path:`${dir}/b-acabamento-${width}.png`});
   await clickText(page,'Recolher ajustes');await sleep(300);
   const prev=await state(page);await page.tap('[data-material="bege"]');await sleep(500);await page.screenshot({path:dir+'/b-debug-tap.png'});console.log('tap',await state(page),await page.$eval('[data-material="bege"]',e=>({html:e.outerHTML,box:e.getBoundingClientRect().toJSON(),hit:document.elementFromPoint(e.getBoundingClientRect().x+20,e.getBoundingClientRect().y+20)?.outerHTML})));await page.waitForFunction(()=>document.querySelector('[data-immersive] canvas').dataset.combo==='cozinha-bege');await sleep(320);const next=await state(page);check('Material preserva ângulo e zoom',prev.zoom===next.zoom&&prev.position===next.position,{prev,next});
 }else{
   await clickText(page,'Girar à direita');await sleep(300);check('Seta desktop anima giro',Number((await state(page)).position)>0);await page.screenshot({path:`${dir}/b-giro-${width}.png`});
   await clickText(page,'Ver de perto');await sleep(430);check('Zoom desktop',Number((await state(page)).zoom)>1);await page.screenshot({path:`${dir}/b-zoom-${width}.png`});
 }
 const controls=await page.$eval('[data-immersive]',e=>[...e.querySelectorAll('button')].filter(b=>b.textContent.trim()==='Tela cheia')[0]);
 await page.evaluate(()=>[...document.querySelectorAll('[data-immersive] button')].find(e=>e.textContent.trim()==='Tela cheia').click());await sleep(450);
 check(`Fullscreen ${width}`,await page.evaluate(()=>!!document.fullscreenElement),await state(page));await page.screenshot({path:`${dir}/b-tela-cheia-${width}.png`});await clickText(page,'Sair da tela cheia');await sleep(350);check(`Saída fullscreen ${width}`,!(await page.evaluate(()=>!!document.fullscreenElement)));
 check(`Erros JS ${width}`,errors.length===0,errors);report.push({name:`Tempos interação CPU4x ${width}`,evidence:await page.evaluate(()=>window.__interaction)});await context.close();
}
for(const mode of ['reduced','saveData']){
 const context=await browser.createBrowserContext(),page=await context.newPage();await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});if(mode==='reduced')await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);else await page.evaluateOnNewDocument(()=>Object.defineProperty(navigator.connection,'saveData',{get:()=>true}));await load(page);const evidence=await page.evaluate(()=>({state:document.querySelector('[data-immersive]').dataset.static,frames:performance.getEntriesByType('resource').filter(r=>r.name.includes('/uniforme/')).map(r=>new URL(r.name).pathname),hint:!!document.querySelector('[aria-hidden="true"] span[style]')}));check(`Estático ${mode}`,evidence.state==='true'&&evidence.frames.length===1,evidence);await context.close();
}
const page=await browser.newPage();await page.setViewport({width:390,height:844});await load(page,'/materiais/pendente/');await axe(page,'Axe compacto');await page.screenshot({path:`${dir}/b-compacto-390.png`});await page.close();
}finally{await browser.close();await fs.writeFile(`${dir}/b-interacoes.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
if(report.some(r=>r.pass===false))process.exitCode=1;
