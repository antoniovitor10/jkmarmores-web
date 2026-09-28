import { config, higgsfield } from '@higgsfield/client/v2';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = 'C:/Users/Vitor/Desktop/sites-wordpress/jk-marmores/tools/higgsfield/configurador-assets';
await fs.mkdir(root, {recursive:true});
config({credentials:process.env.HF_CREDENTIALS});
const [kind, id] = process.argv.slice(2);
const ledgerPath = path.join(root,'ledger.json');
const ledger = await fs.readFile(ledgerPath,'utf8').then(JSON.parse).catch(()=>[]);
if (ledger.some(x=>x.id===id && x.kind===kind)) throw new Error('Already submitted; inspect ledger, never repeat automatically');
const materials = {rosado:'warm blush pink marble with delicate ivory and caramel veins',bege:'warm sandy beige stone with restrained cream veins',escuro:'deep charcoal black stone with fine warm copper veins'};
const [env, mat, finish] = id.split('-');
let prompt, input, model, estimated;
if(kind==='video') {
 const still=ledger.find(x=>x.kind==='image'&&x.id===id&&x.url);
 if(!still) throw new Error('Review a completed still first');
 prompt='One continuous architectural photography shot. The camera orbits clockwise around the stationary stone island through a smooth 90 degree arc, revealing its adjacent side, with strong natural background parallax. Constant distance and camera height, keep the entire island centered. No zoom, no cuts. Perfectly rigid stone edges and stable vein patterns. The furniture and room remain completely still and coherent. No people, no text, no logos. Realistic daylight and reflections.';
 model='kling-video/v3.0/std/image-to-video';estimated=4*0.0693;
 input={image_url:still.url,prompt,duration:4,sound:'off',multi_shots:false,cfg_scale:0.5};
} else {
 model='z-image/turbo';estimated=0.015;
 if(kind==='close') {
 const finishes={polido:'mirror polished surface, crisp soft window reflection, smooth reflective finish',levigado:'honed matte surface, soft broad reflection, smooth low sheen finish',escovado:'brushed tactile surface, fine irregular micro relief under raking light, soft satin finish'};
 prompt=`Architectural material macro photograph of ${materials[mat]}, ${finishes[finish]}. A thick stone slab edge in foreground, surface fills image. Warm lateral daylight at 4500K, 90mm macro lens, believable mineral detail. Minimal dark background. No people, text, logos, watermark. Photographic, no plastic CGI.`;
 } else {
 const room=env==='cozinha'?'spacious contemporary kitchen, walnut cabinetry, plaster walls, floor to ceiling side window, a freestanding rectangular stone kitchen island with waterfall sides':'contemporary spa bathroom with warm plaster walls, walnut storage, freestanding rectangular stone washstand island with one sculpted oval vessel basin and bronze faucet, a large side window';
 prompt=`Editorial architectural interior photograph. ${room}. The entire island is ${materials[mat]}, polished finish. Whole island visible centered with generous space around all sides, foreground floor and complete room around it. Camera at counter height, three-quarter view, 35mm lens. Warm 4500K side daylight, precise straight edges, natural mineral veining, realistic reflections, restrained luxurious atmosphere. No people, text, logos, watermark, no plastic CGI.`;
 }
 input={prompt,resolution:'2k',aspect_ratio:'16:9',prompt_extend:false,seed:27461};
}
const reserved=ledger.reduce((s,x)=>s+x.estimated,0);
if(reserved+estimated>2) throw new Error('Budget cap exceeded');
const entry={kind,id,model,input,estimated,status:'submitting',date:new Date().toISOString()};
ledger.push(entry);await fs.writeFile(ledgerPath,JSON.stringify(ledger,null,2));
try {
 const result=await higgsfield.subscribe(model,{input,withPolling:true});
 entry.request_id=result.request_id;entry.status=result.status;
 entry.url=kind==='video'?result.video?.url:result.images?.[0]?.url;
 await fs.writeFile(ledgerPath,JSON.stringify(ledger,null,2));
 if(result.status!=='completed'||!entry.url) throw new Error('Generation did not return completed media');
 const response=await fetch(entry.url);if(!response.ok) throw new Error('Download failed');
 entry.file=path.join(root,`${id}-${kind}.${kind==='video'?'mp4':'png'}`);
 await fs.writeFile(entry.file,Buffer.from(await response.arrayBuffer()));
 await fs.writeFile(ledgerPath,JSON.stringify(ledger,null,2));
 console.log(JSON.stringify({id,kind,status:entry.status,request_id:entry.request_id,estimated,reservedTotal:reserved+estimated,file:entry.file}));
} catch(e) {console.error('Generation stopped:',e.name,e.message);process.exitCode=1;}
