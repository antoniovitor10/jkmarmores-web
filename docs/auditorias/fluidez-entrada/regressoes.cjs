/* eslint-disable @typescript-eslint/no-require-imports -- verificação local sem geração */
const {chromium}=require('playwright');const fs=require('fs');const assert=require('assert/strict');const path=require('path');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const checks=[];try{for(const width of [390,1440]){const page=await b.newPage({viewport:{width,height:width===390?844:900}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle'});await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').innerText(),'Ir para o conteúdo');
await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelector('#configurador').scrollIntoView()});await page.waitForSelector('[data-fullscreen]');
const initial=await page.locator('[data-fullscreen]').boundingBox();assert.equal(Math.round(initial.width),width);assert.equal(Math.round(initial.x),0);
// Exercita também o fallback fixed em plataformas sem Fullscreen API.
await page.evaluate(()=>Object.defineProperty(Element.prototype,'requestFullscreen',{configurable:true,value:undefined}));
await page.getByRole('button',{name:'Tela cheia',exact:true}).click();await page.waitForSelector('[data-fullscreen="true"]');const box=await page.locator('[data-fullscreen="true"]').boundingBox();assert.equal(Math.round(box.x),0);assert.equal(Math.round(box.y),0);assert.equal(Math.round(box.width),width);assert.equal(Math.round(box.height),width===390?844:900);
await page.getByRole('button',{name:'Sair',exact:true}).click();
assert.deepEqual(errors,[]);checks.push({width,initial,fullscreenFallback:box,errors});await page.close();}fs.writeFileSync(path.join(__dirname,'regressoes.json'),JSON.stringify(checks,null,2));console.log(JSON.stringify(checks));}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
