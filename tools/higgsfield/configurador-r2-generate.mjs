import {config,higgsfield} from '@higgsfield/client/v2';
import fs from 'node:fs/promises';
const folder='configurador-assets/r2';await fs.mkdir(folder,{recursive:true});
const old=JSON.parse(await fs.readFile('configurador-assets/ledger.json','utf8'));
const source=old.find(x=>x.kind==='image'&&x.id==='cozinha-rosado');
const model='kling-video/v3.0/4k/image-to-video';
const input={image_url:source.url,duration:4,sound:'off',cfg_scale:0.8,multi_shots:false,prompt:'A single uninterrupted 4K architectural walkthrough. The CAMERA MOVES BRISKLY on a wide circular track CLOCKWISE around the stationary pink marble island, completing a large 120 degree orbit in four seconds. Start at the reference three-quarter view, pass square-on across the short end, finish viewing the OPPOSITE long side. Large unmistakable perspective change and strong background parallax. Camera is physically moving around the object, never rotating the object. Constant eye-level height and radius, island remains centered and fills the lower half of the frame. Preserve the exact rigid island shape, stone veins and kitchen layout. Photorealistic warm daylight, no cuts, no zoom, no morphing, no people, no text, no logos.'};
if(process.argv.includes('--estimate')) {
 const response=await fetch(`https://api.higgsfield.ai/estimate/${model}`,{method:'POST',headers:{Authorization:`Key ${process.env.HF_CREDENTIALS}`,'Content-Type':'application/json'},body:JSON.stringify(input)});
 const result=await response.json();await fs.writeFile(`${folder}/estimate.json`,JSON.stringify({model,input,result,status:response.status},null,2));console.log(JSON.stringify({status:response.status,result}));
} else {
 const marker=`${folder}/request.json`;
 try{await fs.access(marker);throw new Error('Request already submitted; never repeat automatically');}catch(e){if(e.code!=='ENOENT')throw e;}
 const record={model,input,estimateConservativeUsd:0.924,budgetUsd:1.2,created:new Date().toISOString(),status:'submitting'};
 await fs.writeFile(marker,JSON.stringify(record,null,2));
 config({credentials:process.env.HF_CREDENTIALS});
 const result=await higgsfield.subscribe(model,{input,withPolling:true});
 Object.assign(record,{request_id:result.request_id,status:result.status,url:result.video?.url});await fs.writeFile(marker,JSON.stringify(record,null,2));
 if(result.status!=='completed'||!result.video?.url)throw new Error('Generation not completed');
 const download=await fetch(result.video.url);if(!download.ok)throw new Error('Download failed');await fs.writeFile(`${folder}/cozinha-rosado-4k.mp4`,Buffer.from(await download.arrayBuffer()));
 console.log(JSON.stringify({status:result.status,request_id:result.request_id,estimatedUsd:0.924}));
}
