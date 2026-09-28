import sharp from 'sharp';
import fs from 'node:fs/promises';
import { jkMonogramPath } from '../src/content/monogram.ts';

// Remove apenas o preto do JPEG que pode vazar nas bordas do traçado provisório.
const { data, info } = await sharp('public/brand/jk-textura-original.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  const light = Math.max(data[i], data[i + 1], data[i + 2]);
  data[i + 3] = Math.round(Math.max(0, Math.min(1, (light - 35) / 55)) * 255);
}
await sharp(data, { raw: info }).webp({ quality: 90 }).toFile('public/brand/jk-textura-transparente.webp');
const texture = (await fs.readFile('public/brand/jk-textura-transparente.webp')).toString('base64');
await fs.writeFile('public/brand/jk-monograma-provisorio.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><title>JK — vetorização provisória</title><defs><clipPath id="jk"><path d="${jkMonogramPath}"/></clipPath></defs><path d="${jkMonogramPath}" fill="#c9ab91"/><image href="data:image/webp;base64,${texture}" x="-5" y="-4" width="790" height="480" clip-path="url(#jk)"/></svg>`);
