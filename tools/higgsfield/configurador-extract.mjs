import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const project='C:/Users/Vitor/Desktop/sites-wordpress/jk-marmores-configurador';
const require=createRequire(path.join(project,'package.json'));
const sharp=require('sharp');
const root=path.resolve('configurador-assets');
const output=path.join(project,'public/configurador');
await fs.mkdir(output,{recursive:true});
const summary=[];
for(const env of ['cozinha','lavatorio']) for(const mat of ['rosado','bege','escuro']) {
 const id=`${env}-${mat}`, source=path.join(root,`${id}-video.mp4`), frames=path.join(root,id);
 await fs.mkdir(frames,{recursive:true});
 execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',source,'-vf','fps=6','-frames:v','24','-start_number','0',path.join(frames,'%02d.png')]);
 execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',source,'-vf','fps=2,scale=400:-1,tile=4x2','-frames:v','1',path.join(root,`${id}-review.jpg`)]);
 const bytes={};
 for(const width of [720,1280,2048]) {
  const dest=path.join(output,id,String(width));await fs.mkdir(dest,{recursive:true});
  bytes[width]=0;
  for(let i=0;i<24;i++) {
   const name=String(i).padStart(2,'0');
   const data=await sharp(path.join(frames,`${name}.png`)).resize(width).avif({quality:width===2048?62:width===1280?48:43,effort:4}).toBuffer();
   await fs.writeFile(path.join(dest,`${name}.avif`),data);bytes[width]+=data.length;
  }
 }
 await sharp(path.join(frames,'00.png')).resize(144).avif({quality:42}).toFile(path.join(output,id,'thumb.avif'));
 summary.push({id,bytes,nativeVideoWidth:1280,highResolution:'2048 px resampled from video; no new optical detail'});
 console.log(id,JSON.stringify(bytes));
}
await fs.mkdir(path.join(output,'closes'),{recursive:true});
for(const mat of ['rosado','bege','escuro']) for(const finish of ['polido','levigado','escovado']) {
 await sharp(path.join(root,`close-${mat}-${finish}-close.png`)).resize(720).avif({quality:55}).toFile(path.join(output,'closes',`${mat}-${finish}.avif`));
}
await fs.writeFile(path.join(project,'docs/auditorias/configurador-assets.json'),JSON.stringify(summary,null,2));
