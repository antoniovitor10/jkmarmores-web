import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/check.cjs');
const browser=await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const pause=ms=>new Promise(r=>setTimeout(r,ms)),checks=[],errors=[];
try{
 const page=await browser.newPage();await page.setViewport({width:390,height:844});page.on('pageerror',e=>errors.push(e.message));const failed=[];page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
 await page.goto('http://127.0.0.1:3107/',{waitUntil:'networkidle0'});await page.$eval('[data-configurador]',el=>el.scrollIntoView());await page.waitForSelector('canvas[data-frame]');await page.$eval('[data-immersive]',el=>el.focus());await page.keyboard.press('+');await pause(650);
 for(let i=0;i<7;i++){await page.keyboard.press('ArrowRight');await pause(500);}
 const result=await page.$eval('[data-immersive]',el=>({quality:el.querySelector('canvas').dataset.quality,zoom:+el.dataset.zoom,position:+el.dataset.position}));checks.push({name:'Zoom nativo e rotação após limitar cache de alta',pass:result.quality==='native-2560'&&result.zoom>1&&result.position>.3,evidence:result});
 const media=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.includes('/configurador/')).map(r=>r.name));checks.push({name:'Somente combinação escolhida',pass:media.every(url=>url.includes('/orbita-rosado/')||url.includes('/closes/'))});checks.push({name:'Assets sem erros HTTP',pass:failed.length===0,evidence:failed});
 await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const a=await page.evaluate(async()=>{const r=await axe.run('[data-immersive]',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations;});checks.push({name:'Axe na revisão final',pass:a.length===0,evidence:a});
}catch(e){errors.push(e.stack);}finally{await browser.close();}
const result={checks,errors};await fs.writeFile('C:/Users/Vitor/Desktop/sites-wordpress/jk-marmores-configurador/public/configurador/revisao/revisao-final.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));if(errors.length||checks.some(c=>!c.pass))process.exitCode=1;
