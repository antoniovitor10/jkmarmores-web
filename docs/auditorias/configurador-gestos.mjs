import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer=require('puppeteer-core');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={checks:[]};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
try {
 const page=await browser.newPage();await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
 await page.goto('http://127.0.0.1:3107/',{waitUntil:'networkidle0'});
 await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelector('[data-configurador]').scrollIntoView();});
 await page.waitForSelector('[data-configurador] img[draggable="false"]');await wait(400);
 const stage='[data-configurador] [tabindex="0"]';
 const cdp=await page.createCDPSession();
 const pos=await page.$eval(stage,el=>{const b=el.getBoundingClientRect();return{x:b.x+b.width/2,y:b.y+b.height/2};});
 const touch=async(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map((p,i)=>({id:i,x:p.x,y:p.y,radiusX:1,radiusY:1,force:1}))});
 await touch('touchStart',[{x:pos.x-45,y:pos.y},{x:pos.x+45,y:pos.y}]);
 for(let i=1;i<=5;i++){await touch('touchMove',[{x:pos.x-45-i*9,y:pos.y},{x:pos.x+45+i*9,y:pos.y}]);await wait(40);}
 await touch('touchEnd',[]);await wait(400);
 assert.match(await page.$eval('[data-configurador] img[draggable="false"]',i=>i.style.transform),/scale\(2\)/);report.checks.push('Pinça nativa CDP: 1x para 2x');
 await page.click('[data-configurador] button::-p-text(Reenquadrar)');
 await touch('touchStart',[pos]);await touch('touchEnd',[]);await wait(100);await touch('touchStart',[pos]);await touch('touchEnd',[]);await wait(400);
 assert.match(await page.$eval('[data-configurador] img[draggable="false"]',i=>i.style.transform),/scale\(2\)/);report.checks.push('Duplo toque: 2x');
 await page.click('[data-configurador] button::-p-text(Reenquadrar)');
 await touch('touchStart',[{x:pos.x+70,y:pos.y}]);
 for(let i=1;i<=7;i++){await touch('touchMove',[{x:pos.x+70-i*12,y:pos.y}]);await wait(25);}
 await touch('touchEnd',[]);await wait(500);
 assert.match(await page.$eval('[data-configurador] img[draggable="false"]',i=>i.src),/07.avif/);report.checks.push('Swipe horizontal: ângulo 01 para 08');
 await page.close();
 const desktop=await browser.newPage();await desktop.setViewport({width:1440,height:1000});
 await desktop.goto('http://127.0.0.1:3107/',{waitUntil:'networkidle0'});await desktop.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelector('[data-configurador]').scrollIntoView();});await desktop.waitForSelector('[data-configurador] img[draggable="false"]');
 const wheel=await desktop.$eval(stage,el=>{const e=new WheelEvent('wheel',{deltaY:100,bubbles:true,cancelable:true});el.dispatchEvent(e);return e.defaultPrevented;});assert.equal(wheel,false);
 await desktop.focus(stage);const wheelFocused=await desktop.$eval(stage,el=>{const e=new WheelEvent('wheel',{deltaY:-100,bubbles:true,cancelable:true});el.dispatchEvent(e);return e.defaultPrevented;});assert.equal(wheelFocused,true);await wait(200);report.checks.push('Roda livre fora de foco; zoom com foco');
 await desktop.click('[data-configurador] button::-p-text(Reenquadrar)');
 const ctrl=await desktop.$eval(stage,el=>{el.blur();const e=new WheelEvent('wheel',{deltaY:-100,ctrlKey:true,bubbles:true,cancelable:true});el.dispatchEvent(e);return e.defaultPrevented;});assert.equal(ctrl,true);report.checks.push('Ctrl+roda ativa zoom sem foco');
 await desktop.click('[data-configurador] button::-p-text(Reenquadrar)');await wait(200);
 const center=await desktop.$eval(stage,el=>{const r=el.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});await desktop.mouse.click(center.x,center.y);await wait(80);await desktop.mouse.click(center.x,center.y);await wait(300);assert.match(await desktop.$eval('[data-configurador] img[draggable="false"]',i=>i.style.transform),/scale\(2\)/);report.checks.push('Duplo clique: 2x');
 await desktop.close();
 const slow=await browser.newPage();await slow.setViewport({width:390,height:844});const slowCdp=await slow.createCDPSession();await slowCdp.send('Emulation.setCPUThrottlingRate',{rate:4});await slowCdp.send('Network.enable');await slowCdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});
 await slow.goto('http://127.0.0.1:3107/',{waitUntil:'networkidle0'});
 const started=Date.now();await slow.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelector('[data-configurador]').scrollIntoView();});await slow.waitForSelector('[data-configurador] img[draggable="false"]');report.firstFrameMs=Date.now()-started;
 report.deferred=await slow.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.startTime>1000).map(r=>({name:new URL(r.name).pathname,bytes:r.transferSize})));
 await slow.close();
}finally{await fs.writeFile('docs/auditorias/configurador-gestos.json',JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify(report,null,2));
