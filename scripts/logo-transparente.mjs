// T-0009: deriva o monograma do cabeçalho com o fundo preto transparente,
// para a prévia com fundo branco. Não redesenha a marca: só troca preto por alfa.
// Uso: node scripts/logo-transparente.mjs
import sharp from 'sharp';

const entrada = 'public/brand/jk-monograma-240.webp';
const saida = 'public/brand/jk-monograma-240-transparente.webp';

const { data, info } = await sharp(entrada).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const px = info.width * info.height;
const rgba = Buffer.alloc(px * 4);
for (let i = 0; i < px; i++) {
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
  const max = Math.max(r, g, b);
  // Preto vira transparente; a borda suavizada ganha alfa parcial.
  const a = Math.max(0, Math.min(255, (max - 18) * 3));
  const k = a > 0 ? 255 / a : 0;
  rgba[i * 4] = Math.min(255, Math.round(r * k));
  rgba[i * 4 + 1] = Math.min(255, Math.round(g * k));
  rgba[i * 4 + 2] = Math.min(255, Math.round(b * k));
  rgba[i * 4 + 3] = a;
}
await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ quality: 90, alphaQuality: 100 }).toFile(saida);
console.log('gerado', saida);
