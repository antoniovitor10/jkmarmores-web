import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const project='C:/Users/Vitor/Desktop/sites-wordpress/jk-marmores-configurador';
const require=createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer=require('puppeteer-core');
const {default:lighthouse}=await import('file:///C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/lighthouse/core/index.js');
const dir=path.join(project,'public/configurador/revisao');await fs.mkdir(dir,{recursive:true});
const label=process.argv[2]??'antes';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const report={label,runs:[]};
try {
 const result=await lighthouse('http://127.0.0.1:3107/',{port:Number(new URL(browser.wsEndpoint()).port),output:'json',logLevel:'error',throttlingMethod:'simulate',onlyCategories:['performance','accessibility','best-practices','seo'],screenEmulation:{mobile:true,width:390,height:844,deviceScaleFactor:2,disabled:false}});
 report.lighthouse={scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,v.score*100])),lcp:result.lhr.audits['largest-contentful-paint'].numericValue,cls:result.lhr.audits['cumulative-layout-shift'].numericValue};
 await fs.writeFile(path.join(dir,`${label}-lighthouse.json`),result.report);
 for(let i=0;i<3;i++) {
  const page=await browser.newPage();await page.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});await page.setCacheEnabled(false);
  const cdp=await page.createCDPSession();await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});
  await page.evaluateOnNewDocument(()=>{window.__lcp=[];new PerformanceObserver(list=>window.__lcp.push(...list.getEntries().map(e=>e.startTime))).observe({type:'largest-contentful-paint',buffered:true});});
  await page.goto('http://127.0.0.1:3107/',{waitUntil:'networkidle0'});
  report.runs.push(await page.evaluate(()=>({lcp:window.__lcp.at(-1),configuradorResources:performance.getEntriesByType('resource').filter(r=>r.name.includes('/configurador/')).map(r=>r.name)})));await page.close();
 }
}finally{await fs.writeFile(path.join(dir,`${label}.json`),JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify(report));
