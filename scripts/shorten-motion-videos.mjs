import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
// Fontes aprovadas, fixadas em commit: repetir não acelera arquivos já acelerados.
const directory = '.maestri/short-motion';
await fs.mkdir(directory, { recursive:true });
const files = (await fs.readdir('public/video')).filter(name => /^(capa-|jornada-)/.test(name) && name.endsWith('.mp4'));
const report = [];
for (const name of files) {
  const original = execFileSync('git',['show',`cc06d32:public/video/${name}`],{maxBuffer:10_000_000});
  const input = `${directory}/original-${name}`;
  const output = `${directory}/${name}`;
  await fs.writeFile(input,original);
  const probe = file => JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration:stream=width,height,codec_name','-of','json',file],{encoding:'utf8'}));
  const duration = Number(probe(input).format.duration);
  const av1 = name.includes('av1');
  const codec = av1 ? ['-c:v','libsvtav1','-preset','8','-crf',name.includes('mobile')?'34':'31'] : ['-c:v','libx264','-preset','slow','-crf',name.includes('mobile')?'27':'24','-keyint_min','6','-sc_threshold','0'];
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',input,'-an','-vf',`setpts=${1.45/duration}*PTS,fps=24`,...codec,'-g','6','-pix_fmt','yuv420p','-movflags','+faststart',output],{stdio:'pipe'});
  const final = probe(output);
  const bytes = (await fs.stat(output)).size;
  report.push({file:`public/video/${name}`,sourceCommit:'cc06d32',originalBytes:original.length,bytes,originalDuration:duration,duration:Number(final.format.duration),streams:final.streams,gopFrames:6});
  await fs.copyFile(output,`public/video/${name}`);
}
await fs.writeFile('docs/auditorias/2026-09-27-videos-curtos.json',JSON.stringify(report,null,2));
const source = 'src/content/stone-journey.ts';
let content = await fs.readFile(source,'utf8');
const clips = [1,2,3,4].map(index => {
  const desktop = report.find(r=>r.file.endsWith(`jornada-${index}-desktop.mp4`));
  const mobile = report.find(r=>r.file.endsWith(`jornada-${index}-mobile.mp4`));
  return {desktop:{src:desktop.file.replace('public',''),bytes:desktop.bytes},mobile:{src:mobile.file.replace('public',''),bytes:mobile.bytes,height:720},durationSeconds:desktop.duration};
});
content = content.slice(0,content.indexOf('export const stoneJourneyVideo:'))+`export const stoneJourneyVideo: JourneyVideo | null = ${JSON.stringify({clips},null,2)};\n`;
await fs.writeFile(source,content);
console.log(JSON.stringify(report.map(({file,originalBytes,bytes,duration})=>({file,originalBytes,bytes,duration})),null,2));
