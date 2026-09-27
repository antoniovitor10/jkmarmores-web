import fs from 'node:fs/promises';
import path from 'node:path';

// Export estático: apresenta HTML, CSS, imagem e fontes antes de executar a hidratação.
// A ativação é automática (load + duas pinturas), com antecipação por interação.
const boot = `<script id="jk-hydration-bootstrap">(()=>{let started=false,observer,timer;const events=['pointerdown','keydown'];function start(){if(started)return;started=true;clearTimeout(timer);observer?.disconnect();events.forEach(e=>removeEventListener(e,start,true));document.querySelectorAll('script[data-jk-src]').forEach(old=>{const script=document.createElement('script');for(const attr of old.attributes){if(attr.name!=='type'&&attr.name!=='data-jk-src')script.setAttribute(attr.name,attr.value)}script.src=old.dataset.jkSrc;old.replaceWith(script)})}function painted(){requestAnimationFrame(()=>requestAnimationFrame(start))}function ready(){if(started)return;timer=setTimeout(start,1500);if(performance.getEntriesByName('first-contentful-paint').length)painted();else if('PerformanceObserver'in window&&PerformanceObserver.supportedEntryTypes?.includes('paint')){observer=new PerformanceObserver(list=>{if(list.getEntries().some(e=>e.name==='first-contentful-paint')){observer.disconnect();painted()}});observer.observe({type:'paint',buffered:true})}else painted()}events.forEach(e=>addEventListener(e,start,{capture:true,once:true}));if(document.readyState==='complete')ready();else addEventListener('load',ready,{once:true})})();</script>`;

async function visit(directory) {
  let total=0;
  for(const item of await fs.readdir(directory,{withFileTypes:true})) {
    const file=path.join(directory,item.name);
    if(item.isDirectory()) { total+=await visit(file); continue; }
    if(!item.name.endsWith('.html')) continue;
    let html=await fs.readFile(file,'utf8');
    if(html.includes('id="jk-hydration-bootstrap"')) { await fs.writeFile(file,html.replace(/<script id="jk-hydration-bootstrap">[\s\S]*?<\/script>/,boot)); total++; continue; }
    let count=0;
    html=html.replace(/<script\b[^>]*\bsrc="\/_next\/static\/[^"<>]+\.js"[^>]*><\/script>/g,tag=>{
      if(/\bnoModule\b/i.test(tag)) return tag;
      count++;
      return tag.replace(/\bsrc=/,'data-jk-src=').replace('<script','<script type="application/x-jk-deferred"');
    });
    if(!count) throw new Error(`Nenhum script Next reconhecido em ${file}; revisar export antes de continuar.`);
    html=html.replace(/<link\b[^>]*>/g,tag => /\brel="(?:preload|modulepreload)"/.test(tag) && /\bhref="\/_next\/static\/[^"<>]+\.js"/.test(tag) ? '' : tag);
    if(!html.includes('</body>')) throw new Error(`HTML sem body em ${file}`);
    await fs.writeFile(file,html.replace('</body>',`${boot}</body>`));
    total++;
  }
  return total;
}
console.log(`Hidratação após pintura preparada em ${await visit('out')} arquivos HTML.`);
