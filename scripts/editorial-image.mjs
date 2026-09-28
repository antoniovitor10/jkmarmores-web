import sharp from 'sharp';

// Tratamento determinista nos derivados. Os originais pagos ficam intactos.
export async function editorialImage(source, width, warmStone = false) {
  const { data, info } = await sharp(source).rotate().resize({ width, withoutEnlargement: true })
    .removeAlpha().modulate({ saturation: .86 })
    .linear(warmStone ? [.94, .89, .83] : [.92, .91, .90], warmStone ? [11, 10, 9] : [10, 9, 8]).raw().toBuffer({ resolveWithObject: true });
  let seed = 27092026;
  for (let i = 0; i < data.length; i += info.channels) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const grain = ((seed >>> 24) / 255 - .5) * 2.4;
    for (let channel = 0; channel < 3; channel++) data[i + channel] = Math.max(0, Math.min(255, data[i + channel] + grain));
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } });
}
