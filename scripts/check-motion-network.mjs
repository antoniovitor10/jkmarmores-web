import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const b=await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 const p=await b.newPage();await p.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
 await p.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle0'});
 const c=await p.createCDPSession();await c.send('Network.enable');
 await c.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});
 await c.send('Emulation.setCPUThrottlingRate',{rate:4});
 const start=Date.now();
 await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:190,y:600}]});
 for(let y=580;y>=460;y-=20){await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:190,y}]});await new Promise(r=>setTimeout(r,25));}
 await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await p.waitForFunction(()=>{const v=document.querySelector('.home-hero video');return v?.dataset.settled==='1'&&!v.seeking&&v.readyState>=2;});
 const result={environment:'Emulação Chrome touch390x844, CPU4x; vídeo sob150ms/200000Bps depois do load, cache frio de mídia; não aparelho real',gestureToLastFrameMs:Date.now()-start,...await p.$eval('.home-hero video',v=>({src:v.currentSrc,currentTime:v.currentTime,duration:v.duration,ready:v.readyState,seeking:v.seeking}))};
 await fs.writeFile('docs/auditorias/2026-09-27-leve-rede.json',JSON.stringify(result,null,2));console.log(result);
} finally {await b.close();}
