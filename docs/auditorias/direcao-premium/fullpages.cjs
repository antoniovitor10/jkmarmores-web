/* eslint-disable @typescript-eslint/no-require-imports -- capturas locais */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const results=[];
 for(const width of [390,1440])for(const slug of ['','sobre','materiais','contato','aplicacoes','galeria']){
  // Visao integral estatica explicita: cada etapa aparece, sem achatar um sticky em um unico quadro.
  const p=await b.newPage({viewport:{width,height:width===390?844:900},reducedMotion:'reduce'});
  await p.goto(`http://127.0.0.1:3105/${slug}${slug?'/':''}`,{waitUntil:'networkidle'});
  for(let y=0;y<await p.evaluate(()=>document.documentElement.scrollHeight);y+=650){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(80)}
  await p.waitForTimeout(300);await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(150);
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,`${slug} ${width}`);
  await p.screenshot({path:path.join(__dirname,`${process.argv[2]}-${width}-${slug||'home'}-inteira-estatica.png`),fullPage:true});
  results.push({slug:slug||'home',width,overflow,mode:'prefers-reduced-motion: reduce'});await p.close();
 }
 fs.writeFileSync(path.join(__dirname,`${process.argv[2]}-fullpages.json`),JSON.stringify(results,null,2));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
