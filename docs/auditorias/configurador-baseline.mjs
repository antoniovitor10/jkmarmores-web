// Reproduces the baseline in the same worktree without switching branches.
// Current integrations are backed up, then always restored in finally.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const direct=process.argv.includes('--direct');
const files=['src/app/page.tsx','src/app/materiais/[slug]/page.tsx'];
const saved=await Promise.all(files.map(async file=>({file,content:await fs.readFile(file,'utf8')})));
const backup=path.join(os.tmpdir(),`configurador-integracao-${Date.now()}.json`);
await fs.writeFile(backup,JSON.stringify(saved));
console.log('Integration backup:',backup);
const env={...process.env,AUDIT_MODULES:'C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules',AUDIT_PORT:'3107',AUDIT_SKIP_CAPTURE:'1'};
const build=()=>{const output=execFileSync('cmd.exe',['/c','npm run build'],{encoding:'utf8',env,maxBuffer:10*1024*1024});console.log(output.split('\n').filter(l=>/Compiled|Finished TypeScript|Generating static pages/.test(l)).join('\n'));};
async function measure(label) {
 const require=createRequire(path.join(env.AUDIT_MODULES,'audit.cjs'));
 const browser=await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const runs=[];
 try {for(let i=0;i<3;i++) {
  const page=await browser.newPage();await page.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});await page.setCacheEnabled(false);
  const cdp=await page.createCDPSession();await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});
  await page.evaluateOnNewDocument(()=>{window.__lcp=[];new PerformanceObserver(list=>{window.__lcp.push(...list.getEntries().map(e=>({time:e.startTime,element:e.element?.tagName,url:e.url})));}).observe({type:'largest-contentful-paint',buffered:true});});
  await page.goto('http://127.0.0.1:3107/',{waitUntil:'networkidle0'});await new Promise(r=>setTimeout(r,500));
  runs.push(await page.evaluate(()=>({lcp:window.__lcp.at(-1),media:performance.getEntriesByType('resource').filter(r=>r.name.includes('/configurador/')).length})));await page.close();
 }}finally{await browser.close();}
 await fs.writeFile(`docs/auditorias/configurador-direto-${label}.json`,JSON.stringify({environment:'Chrome 153; viewport 390x844 DPR2; cache disabled; CDP CPU4x, latency150ms, download200000B/s, upload100000B/s; 3 cold navigations',runs},null,2));console.log(label,JSON.stringify(runs));
}
try {
 for(const {file} of saved)await fs.writeFile(file,execFileSync('git',['show',`e215a56:${file}`]));
 build();
 if(direct)await measure('antes');
 else for(const n of [2,3]) {console.log('Baseline run',n);execFileSync(process.execPath,['scripts/audit-home.mjs','antes'],{env:{...env,AUDIT_LABEL:`configurador-base-${n}`},maxBuffer:10*1024*1024});}
}finally{
 for(const {file,content} of saved)await fs.writeFile(file,content);
 console.log('Integrations restored. Rebuilding final version.');build();
}
if(direct)await measure('depois');
