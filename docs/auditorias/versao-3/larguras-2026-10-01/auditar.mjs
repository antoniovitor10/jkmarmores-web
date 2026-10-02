import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const requireAudit=createRequire((process.env.AUDIT_MODULES ?? 'C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules')+'/audit.cjs');
const puppeteer=requireAudit('puppeteer-core');
const auditRoot=path.dirname(fileURLToPath(import.meta.url));
const folder=process.env.AUDIT_LABEL ? path.join(auditRoot,process.env.AUDIT_LABEL) : auditRoot;
const url=process.env.AUDIT_URL ?? 'https://jkmarmores.com.br/3/';
const widths=(process.env.AUDIT_WIDTHS ?? '1280,1440,1680,1920,2048,2560').split(',').map(Number);
const heights=(process.env.AUDIT_HEIGHTS ?? '800,1000,1300').split(',').map(Number);
const materialsOnly=process.env.AUDIT_ONLY_MATERIALS==='1';
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const report={url,source:process.env.AUDIT_SOURCE ?? '1b10ac8',date:'2026-10-01',viewports:[],errors:[]};
await fs.mkdir(path.join(folder,'capturas'),{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});

async function inspect(page,label){
 return page.evaluate(label=>{
  const issues=[],headings=[];
  const rect=r=>({left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height});
  const inView=r=>r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;
  const visible=e=>{
   if(!e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}))return false;
   for(let node=e;node&&node!==document.documentElement;node=node.parentElement){if(Number(getComputedStyle(node).opacity)<.1)return false;}
   return inView(e.getBoundingClientRect());
  };
  const textRects=e=>{
   const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),result=[];
   let node;
   while((node=walker.nextNode())){
    if(!node.textContent.trim())continue;
    const range=document.createRange();range.selectNodeContents(node);
    for(const r of range.getClientRects()){
     if(r.width<2||r.height<2||!inView(r))continue;
     const x=(Math.max(0,r.left)+Math.min(innerWidth,r.right))/2,y=(Math.max(0,r.top)+Math.min(innerHeight,r.bottom))/2;
     const hit=document.elementFromPoint(x,y);
     // Keep pointer-events:none titles, but omit text covered by the hero image
     // or clipped behind another gallery card.
     if(getComputedStyle(e).pointerEvents!=='none'&&hit&&!e.contains(hit)&&!hit.contains(e))continue;
     result.push(rect(r));
    }
   }
   return result;
  };
  const blocks=[...document.querySelectorAll('main h1,main h2,main h3,main p,main address,main a,main button,.site-footer h2,.site-footer p,.site-footer a,.mobile-whatsapp')].filter(visible);
  const painted=blocks.map(e=>({element:e,text:e.textContent.trim(),rects:textRects(e)})).filter(b=>b.rects.length);
  for(const e of blocks){
   if(!/^H[123]$/.test(e.tagName))continue;
   const box=e.getBoundingClientRect(),style=getComputedStyle(e),words=[];
   const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let node;
   while((node=walker.nextNode()))for(const match of node.textContent.matchAll(/[\p{L}\p{N}][\p{L}\p{M}\p{N}-]*/gu)){
    const range=document.createRange();range.setStart(node,match.index);range.setEnd(node,match.index+match[0].length);
    const lines=new Set([...range.getClientRects()].filter(r=>r.width>.5).map(r=>Math.round(r.top)));
    if(lines.size>1)words.push(match[0]);
   }
   headings.push({text:e.textContent.trim(),width:box.width,height:box.height,font:parseFloat(style.fontSize),brokenWords:words});
   if(words.length)issues.push({type:'broken-word',text:e.textContent.trim(),words});
   if(box.width<parseFloat(style.fontSize)*1.5&&e.textContent.trim().length>8)issues.push({type:'collapsed-heading',text:e.textContent.trim(),width:box.width});
   if(e.scrollWidth>e.clientWidth+4)issues.push({type:'heading-overflow',text:e.textContent.trim(),width:e.clientWidth,scrollWidth:e.scrollWidth});
  }
  for(let i=0;i<painted.length;i++)for(let j=i+1;j<painted.length;j++){
   const a=painted[i],b=painted[j];
   if(a.element.contains(b.element)||b.element.contains(a.element))continue;
   const overlap=a.rects.some(r=>b.rects.some(s=>Math.min(r.right,s.right)-Math.max(r.left,s.left)>2&&Math.min(r.bottom,s.bottom)-Math.max(r.top,s.top)>2));
   if(overlap)issues.push({type:'text-overlap',a:a.text,b:b.text});
  }
  const grids=[...document.querySelectorAll('.home-about,.gallery-description,.split-heading,.home-contact-grid,.material-list article,.company-introduction,.contact-grid,.footer-grid')].filter(visible).map(e=>({class:e.className,columns:getComputedStyle(e).gridTemplateColumns,children:[...e.children].map(c=>c.getBoundingClientRect().width)}));
  for(const g of grids)if(g.children.some(w=>w<80))issues.push({type:'collapsed-column',...g});
  if(document.documentElement.scrollWidth>innerWidth+1)issues.push({type:'page-overflow',width:innerWidth,scrollWidth:document.documentElement.scrollWidth});
  return{label,scrollY,headings,grids,issues};
 },label);
}

async function capture(page,result,label,y,{fullPage=false}={}){
 if(y!==undefined)await page.evaluate(y=>scrollTo(0,y),Math.max(0,y));
 await pause(420);
 const state=await inspect(page,label);
 const file=`capturas/${result.width}x${result.height}-${label}.webp`;
 await page.screenshot({path:path.join(folder,file),type:'webp',quality:82,fullPage});
 state.file=file;result.states.push(state);
}

async function section(page,selector){
 return page.$eval(selector,e=>({top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight,travel:e.offsetHeight-innerHeight}));
}

try{
 const page=await browser.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url());});
 for(const width of widths)for(const height of heights){
  const result={width,height,states:[]};
  await page.setViewport({width,height,deviceScaleFactor:1});
  await page.goto(materialsOnly?url+'materiais/':url,{waitUntil:'networkidle0'});
  if(!materialsOnly){
  await page.waitForSelector('.journey-track[data-enhanced]');await pause(250);await page.evaluate(()=>document.fonts.ready);
  const hero=await section(page,'.cinema-hero');
  for(const [label,p] of [['capa',0],['capa-transicao-1',.28],['capa-transicao-2',.55],['monograma',.94]])await capture(page,result,label,hero.top+hero.travel*p);
  const about=await section(page,'.home-about');await capture(page,result,'sobre',about.top-60);
  const journey=await section(page,'.journey-track');
  for(let i=0;i<4;i++){
   await capture(page,result,'jornada-'+(i+1),journey.top+journey.travel*(i+.45)/4);
   if(i<3)await capture(page,result,'jornada-corte-'+(i+1),journey.top+journey.travel*(i+1)/4);
  }
  const gallery=await section(page,'.material-gallery');
  result.galleryTravel=gallery.travel;
  result.galleryLayout=await page.$eval('.material-gallery',root=>root.dataset.motion?'horizontal':'vertical');
  if(result.galleryLayout==='horizontal')for(let i=0;i<6;i++){
    await capture(page,result,'galeria-'+(i+1),gallery.top+gallery.travel*i/5);
    if(i<5)await capture(page,result,'galeria-troca-'+(i+1),gallery.top+gallery.travel*(i+.5)/5);
  }else{
    await page.$eval('.material-gallery',root=>root.scrollIntoView());await pause(420);
    const cards=await page.$$eval('.gallery-material',items=>items.map(e=>e.getBoundingClientRect().top+scrollY));
    for(let i=0;i<cards.length;i++)await capture(page,result,'galeria-'+(i+1),cards[i]-40);
  }
  for(const [label,selector] of [['ambiente','#configurador'],['assinatura','.signature-section'],['contato','#orcamento'],['rodape','.site-footer']]){
   const area=await section(page,selector);await capture(page,result,label,area.top-40);
  }
  await page.goto(url+'materiais/',{waitUntil:'networkidle0'});
  }
  await page.evaluate(()=>document.fonts.ready);
  await capture(page,result,'materiais-capa',0);
  const list=await page.$$eval('.material-list article',items=>items.map(e=>({id:e.id,top:e.getBoundingClientRect().top+scrollY})));
  for(const item of list)await capture(page,result,'materiais-'+item.id,item.top-40);
  for(const [label,selector] of [['materiais-fechamento','.warm-section'],['materiais-contato','.contact-panel'],['materiais-rodape','.site-footer']]){
   const area=await section(page,selector);await capture(page,result,label,area.top-40);
  }
  // Native flow, all six category texts and the closing block in one full capture.
  await capture(page,result,'materiais-completa',0,{fullPage:true});
  report.viewports.push(result);
  await fs.writeFile(path.join(folder,'medicoes.json'),JSON.stringify(report,null,2));
  const issues=result.states.flatMap(s=>s.issues.map(issue=>({state:s.label,...issue})));
  console.log(JSON.stringify({width,height,states:result.states.length,issues}));
 }
 const total=report.viewports.reduce((n,v)=>n+v.states.length,0);
 const issues=report.viewports.flatMap(v=>v.states.flatMap(s=>s.issues.map(issue=>({width:v.width,height:v.height,state:s.label,...issue}))));
 const index='<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>JK V3: auditoria de telas largas</title><style>body{font:16px system-ui;margin:32px;background:#f0eee7;color:#302b26}h1{font-weight:400}nav{display:flex;flex-wrap:wrap;gap:12px;position:sticky;top:0;background:#f0eee7;padding:12px 0}a{color:inherit}section{scroll-margin-top:100px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px}figure{margin:0}img{width:100%;aspect-ratio:16/10;object-fit:contain;object-position:top;background:#e4ddd1}figcaption{padding:8px 0}details{margin:32px 0}summary{cursor:pointer;font-size:24px}</style><h1>Versao 3: 18 tamanhos de desktop</h1><p>Fonte '+report.url+'; codigo '+report.source+'. '+total+' capturas. '+issues.length+' achados geometricos.</p><nav>'+report.viewports.map(v=>`<a href="#${v.width}x${v.height}">${v.width} x ${v.height}</a>`).join('')+'</nav>'+report.viewports.map(v=>`<section id="${v.width}x${v.height}"><details open><summary>${v.width} x ${v.height}</summary><div class="grid">${v.states.map(s=>`<figure><a href="${s.file}"><img loading="lazy" src="${s.file}" alt="${s.label}, ${v.width} por ${v.height} pixels"></a><figcaption>${s.label}${s.issues.length?' — revisar '+s.issues.length+' achados':''}</figcaption></figure>`).join('')}</div></details></section>`).join('')+'</html>';
 await fs.writeFile(path.join(folder,'index.html'),index);
 await fs.writeFile(path.join(folder,'resumo.json'),JSON.stringify({url,source:report.source,viewports:report.viewports.length,captures:total,issues,errors:report.errors},null,2));
 assert.deepEqual(report.errors,[]);assert.deepEqual(issues,[]);
}finally{await browser.close();}
