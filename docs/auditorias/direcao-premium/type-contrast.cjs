/* eslint-disable @typescript-eslint/no-require-imports -- auditoria local */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const p=await b.newPage({viewport:{width:1440,height:900}});await p.goto('http://127.0.0.1:3105/',{waitUntil:'networkidle'});
 const result=await p.evaluate(()=>{
  const lum=c=>{const a=c.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return a[0]*.2126+a[1]*.7152+a[2]*.0722};
  const h=getComputedStyle(document.querySelector('h1')),nav=getComputedStyle(document.querySelector('.desktop-nav a')),paper=getComputedStyle(document.body).getPropertyValue('--cor-papel').trim();
  const sample=document.createElement('span');sample.style.color=paper;document.body.append(sample);const bg=getComputedStyle(sample).color;sample.remove();
  const l=[lum(nav.color),lum(bg)].sort((a,b)=>b-a);
  return {h1:{font:h.fontFamily,weight:h.fontWeight,loaded:document.fonts.check(`${h.fontSize} ${h.fontFamily.split(',')[0]}`)},h2:[...document.querySelectorAll('h2')].map(e=>({text:e.textContent,font:getComputedStyle(e).fontFamily})),navColor:nav.color,paper:bg,contrast:(l[0]+.05)/(l[1]+.05),navBottom:document.querySelector('.desktop-nav').getBoundingClientRect().bottom,imageTop:document.querySelector('.home-hero figure').getBoundingClientRect().top};
 });assert.match(result.h1.font,/homeDisplay/);assert.equal(result.h1.loaded,true);assert.equal(result.h1.weight,'400');assert.ok(result.contrast>=4.5);assert.ok(result.navBottom<result.imageTop);
 fs.writeFileSync(path.join(__dirname,`${process.argv[2]}-type-contrast.json`),JSON.stringify(result,null,2));console.log(result);
 }finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
