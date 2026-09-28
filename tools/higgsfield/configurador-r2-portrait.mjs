import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const project='C:/Users/Vitor/Desktop/sites-wordpress/jk-marmores-configurador',require=createRequire(path.join(project,'package.json')),sharp=require('sharp');
const output=path.join(project,'public/configurador/orbita-rosado/retrato');await fs.mkdir(output,{recursive:true});
let bytes=0;
for(let i=0;i<48;i++){
 const name=String(i).padStart(2,'0');
 // Exact viewport aspect ratio: preserve full source height, crop only horizontal sides.
 const data=await sharp(`configurador-assets/r2/frames/${name}.png`).extract({left:1421,top:0,width:998,height:2160}).resize(720).avif({quality:60,effort:4}).toBuffer();
 await fs.writeFile(path.join(output,`${name}.avif`),data);bytes+=data.length;
}
const recordPath=path.join(project,'public/configurador/revisao/geracao.json'),record=JSON.parse(await fs.readFile(recordPath,'utf8'));record.portrait={width:720,height:1558,bytes,source:'Recorte central nativo do vídeo 3840x2160; sem ampliação.'};await fs.writeFile(recordPath,JSON.stringify(record,null,2));console.log(record.portrait);
