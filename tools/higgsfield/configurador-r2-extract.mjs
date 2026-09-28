import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const project='C:/Users/Vitor/Desktop/sites-wordpress/jk-marmores-configurador',require=createRequire(path.join(project,'package.json')),sharp=require('sharp');
const root=path.resolve('configurador-assets/r2'),frames=path.join(root,'frames'),output=path.join(project,'public/configurador/orbita-rosado');
await fs.mkdir(frames,{recursive:true});
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',path.join(root,'cozinha-rosado-4k.mp4'),'-vf','fps=12','-frames:v','48','-start_number','0',path.join(frames,'%02d.png')]);
const sizes={};
for(const width of [720,1280,2560]){
 await fs.mkdir(path.join(output,String(width)),{recursive:true});sizes[width]=0;
 for(let i=0;i<48;i++){const name=String(i).padStart(2,'0');const data=await sharp(path.join(frames,name+'.png')).resize(width).avif({quality:width===2560?64:width===1280?53:48,effort:4}).toBuffer();await fs.writeFile(path.join(output,String(width),name+'.avif'),data);sizes[width]+=data.length;}
 console.log(width,sizes[width]);
}
const record=JSON.parse(await fs.readFile(path.join(root,'request.json'),'utf8'));record.input.image_url='Imagem-chave cozinha rosada da rodada anterior, request abcf1de8-6eed-4510-8aca-e6827d7ed421';delete record.url;
Object.assign(record,{sourceResolution:[3840,2160],frames:48,widths:[720,1280,2560],bytes:sizes,review:'Órbita ampliada com passagem pela lateral e vista do outro lado; geometria e ambiente coerentes. Não se anunciam graus calibrados.',terms:['https://open.higgsfield.ai/terms-of-service','https://higgsfield.ai/terms-of-use-agreement'],notice:'Ilustração gerada por IA; não representa obra ou material confirmado da JK. Custo estimado autenticado; débito final não retornado.'});
await fs.writeFile(path.join(project,'public/configurador/revisao/geracao.json'),JSON.stringify(record,null,2));
await fs.copyFile(path.join(root,'review.jpg'),path.join(project,'public/configurador/revisao/orbita-revisada.jpg'));
