import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(path.join(process.env.AUDIT_MODULES,'audit.cjs'));
const browser = await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report = {environment:'Emulação Chrome 390/1440, sem envio externo',checks:[]};
try {
  const page = await browser.newPage();
  for(const width of [390,1440]) {
    await page.setViewport({width,height:width===390?844:900});
    await page.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle0'});
    const state=await page.evaluate(()=>{
      const intro=document.querySelector('[data-hero-intro]');
      const dock=document.querySelector('.mobile-quote-dock');
      const button=document.querySelector('.home-hero button');
      return {
        cta:intro.querySelector('a').textContent,
        actions:intro.querySelectorAll('a').length,
        controlBottom:button.getBoundingClientRect().bottom,dockTop:dock.getBoundingClientRect().top,
        pendingClosed:!document.querySelector('.pending-summary').open,
        links:[...document.querySelectorAll('a[href^="https://wa.me/"]')].map(a=>({url:a.href,label:a.textContent})),
        overflow:document.documentElement.scrollWidth>innerWidth,
      };
    });
    assert.equal(state.actions,1); assert.equal(state.cta,'Fale com a JK no WhatsApp');
    assert.equal(state.pendingClosed,true); assert.equal(state.overflow,false);
    if(width===390) assert.ok(state.controlBottom<state.dockTop,'Controle da capa livre do botão flutuante');
    assert.ok(state.links.every(a=>a.url.startsWith('https://wa.me/5511967976902?text=')));
    for(const [name,selector] of [['capa','.home-hero'],['contato','.home-contact'],['rodape','.site-footer']]) {
      await page.$eval(selector,el=>{document.documentElement.style.scrollBehavior='auto';el.scrollIntoView();});
      await new Promise(r=>setTimeout(r,300));
      await page.screenshot({path:`docs/proposta/capturas/leve-final-${name}-${width}-secao.png`});
    }
    await page.focus('.pending-summary summary'); await page.keyboard.press('Enter');
    assert.equal(await page.$eval('.pending-summary',el=>el.open),true);
    assert.ok(await page.$$eval('.pending-summary [data-pendente]',els=>els.length>0));
    await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
    const violations=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});
    assert.deepEqual(violations,[]);
    report.checks.push({width,...state,violations,keyboardDisclosure:true});
  }
  const rgb=hex=>hex.match(/[0-9a-f]{2}/gi).map(n=>parseInt(n,16));
  const lum=c=>c.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
  const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  const worst=rgb('191715').map(x=>x*.8+255*.2);
  report.contrast={method:'Pior fundo possível branco puro sob véu mínimo80% nas áreas de texto; vale para qualquer quadro. Véu só sai depois que o texto termina de sair; retorna imediatamente ao foco.',title:ratio(rgb('f3ece2'),worst),eyebrow:ratio(rgb('e3bd96'),worst),button:ratio(rgb('191715'),rgb('cea57e')),contact:ratio(rgb('d8cec3'),rgb('3a2e24'))};
  assert.ok(Object.entries(report.contrast).filter(([,v])=>typeof v==='number').every(([,v])=>v>=4.5));
  await fs.writeFile('docs/auditorias/2026-09-27-leve-conversao.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify({checks:report.checks.length,contrast:report.contrast}));
} finally {await browser.close();}
