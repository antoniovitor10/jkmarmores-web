import fs from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
const read=async label=>JSON.parse(await fs.readFile(`docs/auditorias/2026-09-27-${label}-resumo.json`,'utf8'));
const before=await read('leve-antes-antes'),after=await read('leve-entrega-depois');
const media=JSON.parse(await fs.readFile('docs/auditorias/2026-09-27-videos-curtos.json','utf8'));
const aggregate=s=>{const r=s.viewports[0];const groups={html:r.navigation[0].bytes};for(const x of r.resourcesAtLoad){const type=/\.js$/.test(x.name)?'js':/\.woff2$/.test(x.name)?'fonts':/\.(avif|webp)$/.test(x.name)?'images':/\.mp4$/.test(x.name)?'video':'other';groups[type]=(groups[type]??0)+x.bytes;}return groups;};
const html=await fs.readFile('out/index.html','utf8');
const scripts=[...new Set([...html.matchAll(/<script[^>]+src="([^"]+\.js)"[^>]*>/g)].filter(m=>!/noModule/i.test(m[0])).map(m=>m[1]))];
let jsGzip=0;for(const script of scripts) jsGzip+=gzipSync(await fs.readFile(`out${script}`)).length;
const sizes=[];for(const width of [390,1440]){const a=await sharp(`docs/proposta/capturas/leve-antes-home-${width}-inteira.png`).metadata();const b=await sharp(`docs/proposta/capturas/leve-final-home-${width}-inteira.png`).metadata();sizes.push({width,beforeHeight:a.height,afterHeight:b.height,reductionPercent:100*(1-b.height/a.height),mode:'Capturas integrais em reduced-motion, com quatro quadros estáticos; não altura do percurso animado'});}
const original=execFileSync('git',['show','ee13af9:src/app/page.tsx'],{encoding:'utf8'}).split('\n').find(l=>l.includes('<Configurador />'));
const current=(await fs.readFile('src/app/page.tsx','utf8')).split('\n').find(l=>l.includes('<Configurador />'));
const result={environment:after.environment,before:{lcpMs:before.lcpMs,tbtMs:before.tbtMs,cls:before.cls,initialBytesByType:aggregate(before)},after:{lcpMs:after.lcpMs,tbtMs:after.tbtMs,cls:after.cls,scores:after.scores,initialBytesByType:aggregate(after),jsGzip},screenshots:sizes,configuratorLineUnchanged:original.trimEnd()===current.trimEnd(),paidGenerationUSD:0,media};
await fs.writeFile('docs/auditorias/2026-09-27-leve-resumo-final.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({...result,media:undefined},null,2));
