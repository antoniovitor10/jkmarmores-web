/* eslint-disable @typescript-eslint/no-require-imports -- scripts CommonJS do protocolo Pulso */
const fs=require('fs');
const path=require('path');
const {spawnSync}=require('child_process');
const {pathToFileURL}=require('url');
const zlib=require('zlib');
(async()=>{
const label=process.argv[2];
if(!label)throw Error('Informe antes/layout/hidratacao/depois');
const modules=process.env.AUDIT_MODULES;
const {default:lighthouse}=await import(pathToFileURL(path.join(modules,'lighthouse/core/index.js')));
const puppeteer=require(require('module').createRequire(path.join(modules,'audit.cjs')).resolve('puppeteer-core'));
const base=path.join(__dirname,label);fs.mkdirSync(base,{recursive:true});
for(let i=1;i<=Number(process.env.AUDIT_RUNS||5);i++){
 const out=path.join(base,String(i));fs.mkdirSync(out,{recursive:true});
 const run=spawnSync(process.execPath,[path.join(__dirname,'../fluidez-entrada/audit.cjs')],{env:{...process.env,AUDIT_OUT:out,AUDIT_KINDS:'mobile'},encoding:'utf8'});
 console.log(run.stdout);if(run.status)throw Error(run.stderr);
 const trace=path.join(out,'mobile-entrada-trace.json');
 fs.writeFileSync(trace+'.gz',zlib.gzipSync(fs.readFileSync(trace)));fs.unlinkSync(trace);
 const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
 const result=await lighthouse('http://127.0.0.1:3105/',{port:Number(new URL(browser.wsEndpoint()).port),output:'json',logLevel:'error',formFactor:'mobile',throttlingMethod:'simulate',screenEmulation:{mobile:true,width:393,height:873,deviceScaleFactor:1,disabled:false},onlyCategories:['performance']});
 fs.writeFileSync(path.join(out,'lighthouse.json'),result.report);
 if(result.lhr.runtimeError)throw Error(result.lhr.runtimeError.message);
 const a=result.lhr.audits;console.log(JSON.stringify({label,run:i,lcp:a['largest-contentful-paint'].numericValue,tbt:a['total-blocking-time'].numericValue,cls:a['cumulative-layout-shift'].numericValue}));
 }finally{await browser.close()}
}
const c=spawnSync(process.execPath,[path.join(__dirname,'../fluidez-entrada/conditions.cjs')],{env:process.env,encoding:'utf8'});fs.writeFileSync(path.join(base,'conditions.jsonl'),c.stdout);console.log(c.stdout);if(c.status)throw Error(c.stderr);
})().catch(e=>{console.error(e);process.exitCode=1});
