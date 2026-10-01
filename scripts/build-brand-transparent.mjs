import sharp from 'sharp';
import fs from 'node:fs/promises';

// JPEG fornecido pela cliente. Remove o preto, sem redesenhar a marca.
// Nas bordas, desassocia o RGB do preto para evitar halo após a composição.
const source = 'assets/brand/logo-jk-cliente-2026-09-26.jpg';
await fs.mkdir('public/brand', { recursive: true });
for (const [name, crop, widths] of [
  ['jk-monograma-alfa', { left: 382, top: 280, width: 780, height: 472 }, [160, 320, 640]],
  ['jk-logo-alfa', { left: 278, top: 280, width: 1036, height: 637 }, [320, 640, 1036]],
]) {
 const { data, info } = await sharp(source).extract(crop).removeAlpha().raw().toBuffer({ resolveWithObject: true });
 const rgba = Buffer.alloc(info.width * info.height * 4);
 const light = (x, y) => Math.max(...data.subarray((y * info.width + x) * 3, (y * info.width + x) * 3 + 3));
 for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
  const input = (y * info.width + x) * 3, output = (y * info.width + x) * 4;
  const value = light(x, y);
  let alpha = value >= 72 ? 1 : 0;
  if (value > 16 && value < 72) {
   let reference = 0, distance = Infinity;
   for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
    if (x + dx < 0 || x + dx >= info.width || y + dy < 0 || y + dy >= info.height) continue;
    const sample = light(x + dx, y + dy), d = dx * dx + dy * dy;
    if (sample >= 72 && d < distance) { distance = d; reference = sample; }
   }
   if (reference) alpha = Math.min(1, value / reference);
  }
  for (let c = 0; c < 3; c++) rgba[output + c] = alpha ? Math.min(255, Math.round(data[input + c] / alpha)) : 0;
  rgba[output + 3] = Math.round(alpha * 255);
 }
 const transparent = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } });
 await transparent.clone().png().toFile(`public/brand/${name}-original.png`);
 for (const width of widths) await transparent.clone().resize({ width, withoutEnlargement: true }).webp({ lossless: true }).toFile(`public/brand/${name}-${width}.webp`);
 console.log(`${name}: ${info.width}x${info.height}, alfa e RGB descontaminado`);
}
