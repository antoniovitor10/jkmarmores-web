import path from 'node:path';
import { createRequire } from 'node:module';
const requireAudit=createRequire(path.join(process.env.AUDIT_MODULES,'audit.cjs'));
const browser=await requireAudit('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 const page=await browser.newPage();
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 for(const width of [390,1440]) {
  await page.setViewport({width,height:width===390?844:900});
  await page.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle0'});
  for(const [name,selector] of [['empresa','.company-introduction'],['materiais','#materiais'],['orcamento','#orcamento'],['trabalhos','#trabalhos']]) {
   const section=await page.$(selector);
   await section.scrollIntoView();
   await section.evaluate(async el=>{await document.fonts.ready;await Promise.all([...el.querySelectorAll('img')].map(img=>img.decode().catch(()=>{})));});
   await section.screenshot({path:`docs/proposta/capturas/premium-${process.argv[2]}-${name}-${width}.png`});
  }
 }
 console.log('Oito capturas por seção concluídas.');
} finally {await browser.close();}
