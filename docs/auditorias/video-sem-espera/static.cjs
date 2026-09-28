/* eslint-disable @typescript-eslint/no-require-imports -- verificação sem JavaScript */
const {chromium}=require('playwright'),assert=require('assert/strict'),fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const results=[];try{
for(const mode of ['no-js','save-data','reduced']){
 const ctx=await b.newContext({viewport:{width:390,height:844},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
 if(mode==='save-data')await ctx.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,addEventListener(){},removeEventListener(){}}}));
 const page=await ctx.newPage();await page.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle'});
 const state=await page.evaluate(()=>({videos:document.querySelectorAll('video').length,frames:[...document.querySelectorAll('.journey-frame')].map(el=>getComputedStyle(el).position),skip:document.querySelector('.skip-link')?.getAttribute('href')}));
 assert.equal(state.videos,0);assert.deepEqual(state.frames,['static','static','static','static']);assert.ok(state.skip);results.push({mode,...state});await ctx.close();
}
fs.writeFileSync(path.join(__dirname,'static.json'),JSON.stringify(results,null,2));console.log(results);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
