/* eslint-disable @typescript-eslint/no-require-imports -- diagnóstico CDP */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),zlib=require('zlib');
const dir=__dirname;
const variantsHtml=new Map();
const server=require('http').createServer(async(req,res)=>{try{const url=new URL(req.url,'http://127.0.0.1:3106');const file=path.resolve('out','.'+(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(path.resolve('out')+path.sep)){res.writeHead(403).end();return}const ext=path.extname(file);const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.avif':'image/avif','.webp':'image/webp','.woff2':'font/woff2','.mp4':'video/mp4'};const raw=url.pathname==='/'?Buffer.from(variantsHtml.get(url.searchParams.get('variant'))):fs.readFileSync(file);const gzip=/\.(html|js|css)$/.test(file);const body=gzip?zlib.gzipSync(raw):raw;res.writeHead(200,{'content-type':types[ext]||'application/octet-stream','content-length':body.length,'cache-control':'no-store',...(gzip?{'content-encoding':'gzip'}:{})});res.end(body)}catch{res.writeHead(404).end()}}).listen(3106,'127.0.0.1');
const variants={baseline:'',preload:'',optional:'',noFonts:'',noJS:'',journeyVisible:'.home-page>.stone-journey{content-visibility:visible!important}',journeySize:'.home-page>.stone-journey:has([data-enhanced]){height:calc(340svh + 117px);contain:size layout paint;}@media(max-width:700px){.home-page>.stone-journey:has([data-enhanced]){height:calc(280svh + 117px)}}',trackVisibility:'.home-page>.stone-journey{content-visibility:visible!important}.journey-track{content-visibility:auto;contain-intrinsic-block-size:auto 340svh}@media(max-width:700px){.journey-track{contain-intrinsic-block-size:auto 280svh}}'};
Object.assign(variants,{
 noTimeline:'.editorial-motion,.editorial-motion *{animation:none!important}',
 stickyNoTimeline:'.home-page>.stone-journey{content-visibility:visible!important}.journey-sticky{content-visibility:auto}.editorial-motion,.editorial-motion *{animation:none!important}',
 stickyVisibility:'.home-page>.stone-journey{content-visibility:visible!important}.journey-sticky{content-visibility:auto}',
 inactiveFrames:'[data-enhanced] .journey-frame:not(:first-child){content-visibility:hidden}',
 stickyFrames:'.home-page>.stone-journey{content-visibility:visible!important}.journey-sticky{content-visibility:auto}[data-enhanced] .journey-frame:not(:first-child){content-visibility:hidden}',
});
Object.assign(variants,{
 maskedFrames:'.home-page>.stone-journey{content-visibility:visible!important}[data-enhanced] .journey-frames{content-visibility:hidden}',
 maskedBackground:'.home-page>.stone-journey{content-visibility:visible!important}[data-enhanced] .journey-frames,[data-enhanced] .journey-heading{content-visibility:hidden}',
});
Object.assign(variants,{
 strictTrack:'.home-page>.stone-journey{content-visibility:visible!important}.journey-track[data-enhanced]{contain:strict}.journey-sticky{content-visibility:auto}',
 strictTrackNoTimeline:'.home-page>.stone-journey{content-visibility:visible!important}.journey-track[data-enhanced]{contain:strict}.journey-sticky{content-visibility:auto}.editorial-motion,.editorial-motion *{animation:none!important}',
});
(async()=>{for(const name of (process.env.PROBE_MODES||Object.keys(variants).join(',')).split(',')){
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const ctx=await browser.newContext({viewport:{width:393,height:873},deviceScaleFactor:1,isMobile:true,hasTouch:true,javaScriptEnabled:name!=='noJS'});const page=await ctx.newPage();const cdp=await ctx.newCDPSession(page);
 await cdp.send('Network.enable');await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200*1024,uploadThroughput:75*1024,connectionType:'cellular3g'});
 let html=fs.readFileSync('out/index.html','utf8');
 if(name==='preload'){const bodyFont=html.match(/url\(([^)]+instrument_sans[^)]+woff2)\)/)?.[1];if(!bodyFont)throw Error('font missing');html=html.replace('</head>',`<link rel="preload" as="font" type="font/woff2" crossorigin href="${bodyFont}"></head>`)}
 if(name==='optional')html=html.replaceAll('font-display:swap','font-display:optional');
 if(variants[name])html=html.replace('</head>',`<style>${variants[name]}</style></head>`);
 variantsHtml.set(name,html);
 if(name==='noFonts')await page.route('**/*.woff2',r=>r.abort());
 await page.addInitScript(()=>{window.__probe={tasks:[],marks:[]};new PerformanceObserver(l=>window.__probe.tasks.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});const mark=(type,data)=>window.__probe.marks.push({t:performance.now(),type,...data});for(const event of ['loading','loadingdone','loadingerror'])document.fonts.addEventListener(event,e=>mark('fonts-'+event,{fonts:[...(e.fontfaces||[])].map(f=>f.family)}));document.addEventListener('contentvisibilityautostatechange',e=>mark('cv',{target:e.target.id||e.target.className,skipped:e.skipped}),true);new MutationObserver(list=>{for(const e of list)if(['data-enhanced','data-motion'].includes(e.attributeName)||e.target===document.documentElement||e.target===document.body)mark('mutation',{target:e.target.className,attr:e.attributeName,value:e.target.getAttribute(e.attributeName)})}).observe(document,{attributes:true,subtree:true});});
 await cdp.send('Tracing.start',{categories:'devtools.timeline,blink,loading,v8,blink.user_timing,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.invalidationTracking,disabled-by-default-devtools.timeline.stack',transferMode:'ReturnAsStream'});
 await page.goto(`http://127.0.0.1:3106/?variant=${name}`,{waitUntil:'load'});await page.waitForTimeout(3200);
 const data=await page.evaluate(()=>({probe:window.__probe,resources:performance.getEntriesByType('resource').map(r=>({name:r.name,start:r.startTime,end:r.responseEnd})),paints:performance.getEntriesByType('paint').map(r=>({name:r.name,t:r.startTime})),fontFaces:[...document.fonts].map(f=>({family:f.family,status:f.status,display:f.display}))}));
 const done=new Promise(r=>cdp.once('Tracing.tracingComplete',r));await cdp.send('Tracing.end');const {stream}=await done;let trace='';while(true){const x=await cdp.send('IO.read',{handle:stream,size:1048576});trace+=x.data;if(x.eof)break}await cdp.send('IO.close',{handle:stream});
 fs.writeFileSync(path.join(dir,`${name}-trace.json.gz`),zlib.gzipSync(trace));fs.writeFileSync(path.join(dir,`${name}.json`),JSON.stringify(data,null,2));const es=JSON.parse(trace).traceEvents;console.log(JSON.stringify({name,tasks:data.probe?.tasks.filter(t=>t.start<3000),layouts:es.filter(e=>e.name==='Layout'&&e.dur>30000).map(e=>({ms:e.dur/1000,...e.args.beginData})),marks:data.probe?.marks}));
 }finally{await browser.close()}
}})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
