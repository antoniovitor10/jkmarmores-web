import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/check.cjs');
const puppeteer=require('puppeteer-core');
const dir='C:/Users/Vitor/Desktop/sites-wordpress/jk-marmores-configurador/public/configurador/revisao';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const report={checks:[],errors:[],screenshots:[]};
function check(name,pass,evidence){report.checks.push({name,pass:!!pass,evidence});console.log(name,pass?'PASS':'FAIL',JSON.stringify(evidence));}
async function state(page){return page.$eval('[data-immersive]',el=>({position:+el.dataset.position,zoom:+el.dataset.zoom,pan:el.dataset.pan,full:el.dataset.fullscreen,quality:el.querySelector('canvas').dataset.quality,frame:el.querySelector('canvas').dataset.frame,combo:el.querySelector('canvas').dataset.combo,rect:{width:el.clientWidth,height:el.clientHeight,top:el.getBoundingClientRect().top},opacity:getComputedStyle(el.querySelector('[class*="_hud"]')).opacity}));}
async function click(page,text){await page.evaluate(text=>{const b=[...document.querySelectorAll('[data-immersive] button')].find(el=>el.textContent.trim()===text||el.getAttribute('aria-label')===text);if(!b)throw Error(`Missing ${text}`);b.click();},text);}
async function wake(page){await page.$eval('[data-immersive]',el=>el.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerType:'mouse'})));}
async function align(page){await page.$eval('[data-configurador]',el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY,behavior:'instant'}));await pause(100);}
async function open(page,mode){if(mode==='reduced')await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);if(mode==='save')await page.evaluateOnNewDocument(()=>{Object.defineProperty(navigator.connection,'saveData',{value:true});});await page.goto('http://127.0.0.1:3107/',{waitUntil:'networkidle0'});check(`${mode??'normal'} zero mídia inicial`,await page.evaluate(()=>performance.getEntriesByType('resource').every(r=>!r.name.includes('/configurador/'))));await align(page);await page.waitForSelector('[data-immersive] canvas[data-frame]',{timeout:20000});await align(page);}
async function screenshot(page,width,name){const file=`${width}-${name}.png`;await page.screenshot({path:`${dir}/${file}`});report.screenshots.push(file);}
try{
 for(const width of [1440,390]){
  const page=await browser.newPage();await page.setViewport({width,height:width===390?844:900,deviceScaleFactor:1,isMobile:width===390,hasTouch:width===390});
  page.on('pageerror',e=>report.errors.push(e.message));
  await open(page);await pause(2500);let s=await state(page);check(`${width} demo na entrada`,s.position>.09,s);
  check(`${width} palco ocupa viewport`,Math.abs(s.rect.width-width)<=1&&Math.abs(s.rect.height-(width===390?844:900))<=1,s.rect);
  check(`${width} sem overflow horizontal`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await pause(4100);s=await state(page);check(`${width} controles ocultam`,s.opacity==='0',s.opacity);await screenshot(page,width,'imersao');
  await wake(page);await pause(500);check(`${width} controles retornam`,(await state(page)).opacity==='1');
  const before=(await state(page)).position;await click(page,'Girar para a direita');await pause(95);const mid=(await state(page)).position;await pause(400);const end=(await state(page)).position;
  check(`${width} seta animada`,mid>before&&mid<end,{before,mid,end});
  // Drag + coast, keeping away from overlaid controls.
  await page.mouse.move(width*.7,360);await page.mouse.down();await pause(60);await page.mouse.move(width*.6,365,{steps:8});await pause(15);await page.mouse.move(width*.53,365,{steps:4});await page.mouse.up();const release=(await state(page)).position;await pause(250);const coast=(await state(page)).position;
  check(`${width} inércia após arrastar`,coast>release,{release,coast});await pause(900);await wake(page);await screenshot(page,width,'giro');
  const initial=(await state(page)).zoom;
  await page.$eval('[data-immersive]',el=>el.blur());
  const wheelFree=await page.$eval('[data-immersive]',el=>{const e=new WheelEvent('wheel',{deltaY:-120,clientX:140,clientY:380,bubbles:true,cancelable:true});el.dispatchEvent(e);return !e.defaultPrevented;});
  check(`${width} roda livre sem foco`,wheelFree&&(await state(page)).zoom===initial);
  const wheelCtrl=await page.$eval('[data-immersive]',el=>{const e=new WheelEvent('wheel',{deltaY:-350,ctrlKey:true,clientX:120,clientY:400,bubbles:true,cancelable:true});el.dispatchEvent(e);return e.defaultPrevented;});
  await pause(800);s=await state(page);check(`${width} zoom ancorado + alta nativa`,wheelCtrl&&s.zoom>1.6&&s.pan!=='0.0,0.0'&&s.quality==='native-2560',s);await screenshot(page,width,'zoom');
  const camera={position:s.position,zoom:s.zoom,pan:s.pan};await click(page,'Material');await click(page,'Pedra bege');await pause(700);s=await state(page);check(`${width} material preserva câmera`,s.position===camera.position&&s.zoom===camera.zoom&&s.pan===camera.pan,s);
  await click(page,'Ambiente');await click(page,'Lavatório');await pause(650);s=await state(page);check(`${width} ambiente preserva câmera`,s.position===camera.position&&s.zoom===camera.zoom&&s.combo==='lavatorio-bege',s);await click(page,'Cozinha com ilha');await pause(650);
  await click(page,'Acabamento');await click(page,'Levigado');await pause(350);s=await state(page);check(`${width} acabamento preserva câmera`,s.position===camera.position&&s.zoom===camera.zoom&&s.pan===camera.pan,s);
  const href=await page.$eval('[data-immersive] a',el=>decodeURIComponent(el.href));check(`${width} WhatsApp combinação`,href.includes('5511967976902')&&href.includes('pedra bege')&&href.includes('levigado'),href);
  await screenshot(page,width,'selecao');await click(page,'Fechar detalhe');await click(page,'Material');await click(page,'Mármore rosado');await click(page,'Reenquadrar');await pause(700);
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});await wake(page);await pause(500);
  let axe=await page.evaluate(async()=>{const r=await axe.run('[data-immersive]',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations;});check(`${width} axe componente`,axe.length===0,axe);
  // Real trusted fullscreen click, including actual touch at 390.
  const fsButton=await page.$('[data-immersive] button');await fsButton.click();await pause(600);const native=await page.evaluate(()=>!!document.fullscreenElement);check(`${width} Fullscreen API`,native,await state(page));await wake(page);await screenshot(page,width,'tela-cheia');
  axe=await page.evaluate(async()=>{const r=await axe.run('[data-immersive]',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations;});check(`${width} axe tela cheia`,axe.length===0,axe);
  if(width===390){const exit=await page.$('[data-immersive] button[class*="_exit"]');await exit.tap();}else await page.keyboard.press('Escape');await pause(300);check(`${width} sair tela cheia`,!(await page.evaluate(()=>!!document.fullscreenElement))&&(await state(page)).full==='false');
  await align(page);await wake(page);await page.$eval('[data-immersive]',el=>el.focus());await page.keyboard.press('Home');await pause(450);await page.keyboard.press('ArrowRight');await pause(450);check(`${width} teclado gira`,(await state(page)).position>.04);await page.keyboard.press('+');await pause(350);check(`${width} teclado aproxima`,(await state(page)).zoom>1);
  await click(page,'Reenquadrar');await pause(300);await page.mouse.click(width*.6,380);await page.mouse.click(width*.6,380);await pause(400);check(`${width} duplo clique`,(await state(page)).zoom>1.9);await click(page,'Reenquadrar');await pause(350);
  if(width===390){
    await page.touchscreen.tap(210,370);await page.touchscreen.tap(210,370);await pause(400);check('390 duplo toque',(await state(page)).zoom>1.9);await click(page,'Reenquadrar');await pause(350);
    const cdp=await page.createCDPSession();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:130,y:360},{x:250,y:360}]});await pause(60);await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:90,y:360},{x:290,y:360}]});await pause(80);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(500);check('390 pinça fluida',(await state(page)).zoom>1.5,await state(page));
  }
  // Unsupported fullscreen path: background inert and restoration.
  await page.$eval('[data-immersive]',el=>el.requestFullscreen=undefined);await click(page,'Tela cheia');await pause(200);check(`${width} fallback modal`,await page.$eval('[data-immersive]',el=>el.getAttribute('aria-modal')==='true'&&document.body.style.overflow==='hidden'&&document.querySelector('header').inert));await click(page,'Sair');await pause(200);check(`${width} restaura fallback e foco`,await page.evaluate(()=>document.body.style.overflow!=='hidden'&&!document.querySelector('header').inert&&document.activeElement.textContent==='Tela cheia'));
  const preserved=(await state(page)).position;await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await pause(500);await align(page);await pause(2500);check(`${width} demonstração somente uma vez`,(await state(page)).position===preserved);
  await page.close();
 }
 for(const mode of ['reduced','save']){const page=await browser.newPage();await page.setViewport({width:390,height:844});await open(page,mode);await pause(2600);const s=await state(page);const media=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/\/configurador\/.+\/\d+\.avif/.test(r.name)).map(r=>r.name));check(`${mode} imagem estática`,s.position===0&&media.length===1,{state:s,media});await page.close();}
 const page=await browser.newPage();await page.setJavaScriptEnabled(false);await page.goto('http://127.0.0.1:3107/',{waitUntil:'networkidle0'});check('sem JS: imagem e WhatsApp',await page.$eval('[data-configurador]',el=>!!el.querySelector('noscript img')&&el.querySelector('a').href.includes('5511967976902')));await page.close();
}catch(e){report.errors.push(e.stack);console.error(e);}finally{await fs.writeFile(`${dir}/interacoes.json`,JSON.stringify(report,null,2));await browser.close();}
if(report.errors.length||report.checks.some(c=>!c.pass))process.exitCode=1;
