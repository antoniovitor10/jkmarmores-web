import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const project='C:/Users/Vitor/Desktop/sites-wordpress/jk-marmores-configurador',require=createRequire(path.join(project,'package.json')),sharp=require('sharp');
const root=path.resolve('configurador-assets'),report=[];
for(const env of ['cozinha','lavatorio'])for(const mat of ['rosado','bege','escuro']){
 const combo=`${env}-${mat}`,main=combo==='cozinha-rosado',count=main?48:24,frames=main?path.join(root,'r2/frames'):path.join(root,combo),native=main?[3840,2160]:[1280,720],bytes={};
 for(const variant of ['720','1280','2560','retrato']){
  const dir=path.join(project,'public/configurador/uniforme',combo,variant);await fs.mkdir(dir,{recursive:true});bytes[variant]=0;
  for(let i=0;i<count;i++){
   const name=String(i).padStart(2,'0');let pipeline=sharp(path.join(frames,`${name}.png`));
   if(variant==='retrato')pipeline=pipeline.resize(720,1558,{fit:'cover',position:'centre'});else pipeline=pipeline.resize(Number(variant));
   const data=await pipeline.avif({quality:64,effort:4}).toBuffer();await fs.writeFile(path.join(dir,`${name}.avif`),data);bytes[variant]+=data.length;
  }
 }
 report.push({combo,count,native,quality:64,dimensions:{720:[720,405],1280:[1280,720],2560:[2560,1440],retrato:[720,1558]},bytes,note:main?'Fonte 4K existente':'Fonte 720p existente: redimensionamento não cria detalhe óptico'});console.log(combo,JSON.stringify(bytes));
}
await fs.mkdir(path.join(project,'docs/auditorias/configurador-design-2026-09-28'),{recursive:true});await fs.writeFile(path.join(project,'docs/auditorias/configurador-design-2026-09-28/assets.json'),JSON.stringify({apiCostUsd:0,method:'Recorte central e resize Lanczos3 dos quadros extraídos dos vídeos pagos; AVIF quality64 effort4 em todas as variantes.',assets:report},null,2));
