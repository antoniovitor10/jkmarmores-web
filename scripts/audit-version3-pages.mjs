import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const require=createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/audit.cjs');
const puppeteer=require('puppeteer-core');
const {default:lighthouse}=await import(pathToFileURL('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/lighthouse/core/index.js'));
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const folder=process.env.AUDIT_FOLDER ?? 'docs/auditorias/versao-3', report=[];
const routes=(process.env.AUDIT_ROUTES ?? ',sobre/,materiais/,aplicacoes/,galeria/,contato/').split(',');
await fs.mkdir(folder,{recursive:true});
try{
 for(const route of routes){
  const r=await lighthouse('http://127.0.0.1:3108/3/'+route,{port:Number(new URL(browser.wsEndpoint()).port),output:'json',logLevel:'error',onlyCategories:['accessibility'],screenEmulation:{mobile:true,width:390,height:844,deviceScaleFactor:2,disabled:false}});
  report.push({route:route||'/',accessibility:r.lhr.categories.accessibility.score*100,failures:Object.values(r.lhr.audits).filter(a=>a.score!==null&&a.score<1).map(a=>({id:a.id,title:a.title,details:a.details}))});
 }
 const page=await browser.newPage();await page.setViewport({width:1440,height:900});
 for(const route of ['sobre/','materiais/','aplicacoes/','galeria/','contato/']){
  await page.goto('http://127.0.0.1:3108/3/'+route,{waitUntil:'networkidle0'});
  await page.screenshot({path:folder+'/1440-'+route.replace('/','')+'.png',fullPage:true});
  report.push({desktop:route,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
 }
 await fs.writeFile(folder+'/acessibilidade-paginas.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report.map(r=>({...r,failures:r.failures?.map(f=>f.id)}))));
 if(report.some(r=>r.accessibility !== undefined && r.accessibility !== 100 || r.overflow)) throw new Error('Falha de acessibilidade ou overflow.');
}finally{await browser.close();}
