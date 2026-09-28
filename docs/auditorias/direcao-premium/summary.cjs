/* eslint-disable @typescript-eslint/no-require-imports -- auditoria local */
const fs=require('fs'),path=require('path');
const label=process.argv[2],dir=path.join(__dirname,label);
const median=a=>a.slice().sort((x,y)=>x-y)[Math.floor(a.length/2)];
const runs=fs.readdirSync(dir).filter(n=>/^\d+$/.test(n)).map(n=>{
 const l=JSON.parse(fs.readFileSync(path.join(dir,n,'lighthouse.json'))),a=l.audits;
 const e=JSON.parse(fs.readFileSync(path.join(dir,n,'mobile-entrada.json')));
 return {run:Number(n),lcp:a['largest-contentful-paint'].numericValue,tbt:a['total-blocking-time'].numericValue,cls:a['cumulative-layout-shift'].numericValue,a11y:l.categories.accessibility.score*100,longTaskMax:Math.max(0,...e.entry.audit.longTasks.filter(t=>t.start<3000).map(t=>t.duration)),failures:Object.entries(a).filter(([,v])=>v.score===0&&v.details?.items?.length).map(([k])=>k)};
});
const result={label,emulation:'393x873 CPU4x; Lighthouse simulate; entry CDP 200KiB/s 150ms',runs,median:{lcp:median(runs.map(r=>r.lcp)),tbt:median(runs.map(r=>r.tbt)),cls:median(runs.map(r=>r.cls))},maxLongTask:Math.max(...runs.map(r=>r.longTaskMax))};
fs.writeFileSync(path.join(__dirname,`${label}-resumo.json`),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
