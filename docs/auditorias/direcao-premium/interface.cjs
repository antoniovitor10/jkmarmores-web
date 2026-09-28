/* eslint-disable @typescript-eslint/no-require-imports -- auditoria local */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const results=[];
 try{for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:width===390?844:900}});
  await page.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle'});
  const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,cta:document.querySelector('[data-hero-intro] a').textContent,links:[...document.querySelectorAll('a[href^="https://wa.me/"]')].map(a=>a.href),pending:document.querySelectorAll('[data-pendente]').length,dock:document.querySelector('.mobile-quote-dock').dataset.visible}));
  assert.equal(state.overflow,false);assert.equal(state.cta,'Chamar no WhatsApp');assert.equal(state.dock,'false');assert.ok(state.pending>0);assert.ok(state.links.every(h=>h.startsWith('https://wa.me/5511967976902?text=')));
  if(width===390){
   await page.locator('.mobile-nav summary').click();
   assert.equal(await page.locator('main').evaluate(e=>e.inert),true);
   await page.screenshot({path:path.join(__dirname,`${process.argv[2]}-menu.png`)});
   await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('main').inert,{},{timeout:1000});
   await page.locator('.home-contact .button').scrollIntoViewIfNeeded();await page.waitForTimeout(400);
   assert.equal(await page.locator('.mobile-quote-dock').getAttribute('data-visible'),'false');
  }
  results.push({width,...state});await page.close();
 }}finally{await browser.close()}
 fs.writeFileSync(path.join(__dirname,`${process.argv[2]}-interface.json`),JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
