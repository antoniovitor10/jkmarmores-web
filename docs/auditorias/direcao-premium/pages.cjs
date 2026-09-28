/* eslint-disable @typescript-eslint/no-require-imports -- auditoria local */
const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
 const modules=process.env.AUDIT_MODULES;
 const {default:lighthouse}=await import(pathToFileURL(path.join(modules,'lighthouse/core/index.js')));
 const puppeteer=require(require('module').createRequire(path.join(modules,'audit.cjs')).resolve('puppeteer-core'));
 const results=[];
 for(const slug of ['contato','sobre','materiais','aplicacoes','galeria']){
  const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try{
   const result=await lighthouse(`http://127.0.0.1:3105/${slug}/`,{port:Number(new URL(browser.wsEndpoint()).port),output:'json',logLevel:'error',formFactor:'mobile',throttlingMethod:'simulate',screenEmulation:{mobile:true,width:393,height:873,deviceScaleFactor:1,disabled:false},onlyCategories:['accessibility']});
   const failures=Object.entries(result.lhr.audits).filter(([,v])=>v.score===0).map(([id,v])=>({id,details:v.details}));
   const summary={slug,a11y:result.lhr.categories.accessibility.score*100,failures};results.push(summary);console.log(JSON.stringify(summary));
   fs.writeFileSync(path.join(__dirname,`${process.argv[2]}-${slug}-lighthouse.json`),result.report);
  }finally{await browser.close()}
 }
 fs.writeFileSync(path.join(__dirname,`${process.argv[2]}-pages.json`),JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
