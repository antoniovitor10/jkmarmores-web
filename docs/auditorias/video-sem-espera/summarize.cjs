/* eslint-disable @typescript-eslint/no-require-imports -- ferramenta local de auditoria */
const fs=require('fs'),path=require('path');
const median=a=>[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
const result={method:'Chrome emulado 393x873 DPR1; CDP CPU4x,150ms,200KiB/s down,75KiB/s up; Lighthouse13.5 simulate; preview gzip3105; caches frios; sem aparelho real',stages:{}};
for(const label of ['antes','layout','hidratacao','depois']){
 const dir=path.join(__dirname,label);if(!fs.existsSync(dir))continue;const runs=[];
 for(const n of fs.readdirSync(dir).filter(x=>/^\d+$/.test(x))){const p=path.join(dir,n);if(!fs.existsSync(path.join(p,'lighthouse.json')))continue;
 const entry=JSON.parse(fs.readFileSync(path.join(p,'mobile-entrada.json'))).entry;
 const a=JSON.parse(fs.readFileSync(path.join(p,'lighthouse.json'))).audits;
 const tasks=entry.audit.longTasks.filter(x=>x.start<3000);
 runs.push({run:+n,lcp:a['largest-contentful-paint'].numericValue,tbt:a['total-blocking-time'].numericValue,cls:a['cumulative-layout-shift'].numericValue,maxTask:Math.max(0,...tasks.map(x=>x.duration)),entryBlocking:tasks.reduce((s,x)=>s+Math.max(0,x.duration-50),0),tasks,connection:entry.connection});}
 if(runs.length)result.stages[label]={runs,median:Object.fromEntries(['lcp','tbt','cls','maxTask','entryBlocking'].map(k=>[k,median(runs.map(x=>x[k]))]))};
}
fs.writeFileSync(path.join(__dirname,'resumo.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(Object.fromEntries(Object.entries(result.stages).map(([k,v])=>[k,v.median])),null,2));
