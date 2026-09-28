/* eslint-disable @typescript-eslint/no-require-imports -- protocolo CDP */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),zlib=require('zlib');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const ctx=await b.newContext({viewport:{width:393,height:873},isMobile:true,hasTouch:true});const p=await ctx.newPage(),c=await ctx.newCDPSession(p);
 await c.send('Emulation.setCPUThrottlingRate',{rate:4});
 await p.addInitScript(()=>{Object.defineProperty(navigator,'connection',{configurable:true,value:{effectiveType:'4g',downlink:10,saveData:false,addEventListener(){},removeEventListener(){}}});window.__events=[];new PerformanceObserver(l=>window.__events.push(...l.getEntries().map(e=>({name:e.name,duration:e.duration,interactionId:e.interactionId})))).observe({type:'event',buffered:true,durationThreshold:16});});
 await p.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle'});await p.locator('summary').first().tap();await p.waitForTimeout(100);await p.keyboard.press('Escape');
 await c.send('Tracing.start',{categories:'devtools.timeline,disabled-by-default-devtools.timeline',transferMode:'ReturnAsStream'});
 for(let i=0;i<100;i++){await p.evaluate(()=>scrollBy(0,45));await p.waitForTimeout(17);}
 const done=new Promise(r=>c.once('Tracing.tracingComplete',r));await c.send('Tracing.end');const {stream}=await done;let raw='';for(;;){const v=await c.send('IO.read',{handle:stream});raw+=v.data;if(v.eof)break;}await c.send('IO.close',{handle:stream});
 const ev=JSON.parse(raw).traceEvents,main=ev.find(e=>e.name==='thread_name'&&e.args?.name==='CrRendererMain');
 const frames=ev.filter(e=>e.tid===main?.tid&&e.name==='AnimationFrame::Render'&&e.ph==='b').map(e=>e.ts).sort((a,b)=>a-b);
 const costs=frames.slice(0,-1).map((s,i)=>{const end=frames[i+1];return ev.filter(e=>e.tid===main?.tid&&e.ph==='X'&&['FunctionCall','Paint'].includes(e.name)&&e.ts>=s&&e.ts<end).reduce((a,e)=>a+(e.dur||0)/1000,0)});
 const result={emulation:'393x873 CPU 4x; scrollBy de 45 px, sem aparelho real',frameCount:costs.length,scriptPaintMaxMs:Math.max(0,...costs),scriptPaintP95Ms:costs.sort((a,b)=>a-b)[Math.floor(costs.length*.95)]??null,eventTiming:await p.evaluate(()=>window.__events)};
 fs.writeFileSync(path.join(__dirname,`${process.argv[2]}-pin-trace.json.gz`),zlib.gzipSync(raw));fs.writeFileSync(path.join(__dirname,`${process.argv[2]}-pin.json`),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
