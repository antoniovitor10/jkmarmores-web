import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ffmpeg = process.env.FFMPEG;
if (!ffmpeg) throw new Error('Defina FFMPEG com o caminho do executavel local.');
const clips = [];
for (let i = 1; i <= 4; i++) {
  const clip = { durationSeconds: 1.458333 };
  for (const device of ['desktop', 'mobile']) {
    const original = `public/video/jornada-${i}-${device}.mp4`;
    const output = `public/video/jornada-${i}-${device}-editorial.mp4`;
    execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-i', original,
      '-vf', 'eq=saturation=0.86,lutrgb=r=val*0.94+11:g=val*0.89+10:b=val*0.83+9',
      '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-g', '6', '-keyint_min', '6', '-sc_threshold', '0', '-movflags', '+faststart', output]);
    clip[device] = { src: `/video/${path.basename(output)}`, bytes: fs.statSync(output).size, ...(device === 'mobile' ? { height: 720 } : {}) };
  }
  clips.push(clip);
}
const file = 'src/content/stone-journey.ts';
const source = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file, source.slice(0, source.indexOf('export const stoneJourneyVideo:')) + `export const stoneJourneyVideo: JourneyVideo | null = ${JSON.stringify({ clips }, null, 2)};\n`);
console.log(JSON.stringify(clips));
