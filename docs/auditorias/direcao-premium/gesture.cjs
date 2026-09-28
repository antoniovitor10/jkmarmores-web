/* eslint-disable @typescript-eslint/no-require-imports -- entrada nativa CDP emulada */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[];try{
 for(const mode of ['touch-4g','touch-slow','wheel'])for(let run=1;run<=3;run++){
  const mobile=mode!=='wheel',ctx=await b.newContext({viewport:{width:mobile?390:1440,height:mobile?844:900},isMobile:mobile,hasTouch:mobile});
  const p=await ctx.newPage(),c=await ctx.newCDPSession(p);await c.send('Emulation.setCPUThrottlingRate',{rate:4});
  if(mode==='touch-slow'){await c.send('Network.enable');await c.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200*1024,uploadThroughput:75*1024,connectionType:'cellular3g'})}
  await p.goto('http://127.0.0.1:3105/',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>performance.getEntriesByName('first-contentful-paint').length>0);
  await p.evaluate(()=>{window.__gesture={start:performance.now()};addEventListener('scroll',()=>requestAnimationFrame(()=>{window.__gesture.paint=performance.now()}),{once:true,passive:true})});
  if(mobile){await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:650}]});await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y:450}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})}
  else await p.mouse.wheel(0,200);
  await p.waitForFunction(()=>window.__gesture.paint);results.push({mode,run,...await p.evaluate(()=>({responseMs:window.__gesture.paint-window.__gesture.start,scrollY}))});await ctx.close();
 }
}finally{await b.close()}
fs.writeFileSync(path.join(__dirname,`${process.argv[2]}-gesture.json`),JSON.stringify(results,null,2));console.log(JSON.stringify(results));
})().catch(e=>{console.error(e);process.exitCode=1});
