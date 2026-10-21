// Compara as candidatas geradas de uma imagem com as fotos reais da mesma pedra (HU-0001).
// Uso: node scripts/comparar-imagens-geradas.mjs <id> [<id> ...]
// Lê docs/trabalho/HU-0001-imagens-novas-catalogo/geradas/<id>/candidata-N.png e as fotos de
// referencias/<id>/ (pastas fora do git). Mede, numa escala comum, a cor média em Lab, o contraste
// e a porcentagem de pintas ou veios escuros e claros, e mostra a distância de cada candidata
// para a média das fotos reais. A medida orienta; a escolha final é visual.
//
// Opcional: geradas/<id>/comparar.json com as áreas que têm só pedra, em fração da imagem:
// { "refDir": "pedra-marmore-calacatta", "refs": { "ref-1.jpg": [x0, y0, x1, y1] }, "candidatas": [x0, y0, x1, y1] }
// Sem o arquivo, usa a foto real inteira e o centro (60 %) da candidata, longe da luz do canto.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const base = "docs/trabalho/HU-0001-imagens-novas-catalogo";
const ids = process.argv.slice(2);
if (!ids.length) { console.error("Uso: node scripts/comparar-imagens-geradas.mjs <id> [<id> ...]"); process.exit(1); }

const linear = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
function paraLab(r, g, b) {
  const R = linear(r), G = linear(g), B = linear(b);
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047);
  const y = f(R * 0.2126 + G * 0.7152 + B * 0.0722);
  const z = f((R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

async function medir(arquivo, [x0, y0, x1, y1]) {
  const { width, height } = await sharp(arquivo).metadata();
  const left = Math.round(x0 * width), top = Math.round(y0 * height);
  const area = { left, top, width: Math.round(x1 * width) - left, height: Math.round(y1 * height) - top };
  // Lado maior em 400 px: a porcentagem de pintas fica comparável entre fotos de tamanhos diferentes.
  const imagem = sharp(arquivo).extract(area).resize(400, 400, { fit: "inside" }).removeAlpha();
  const { data, info } = await imagem.clone().raw().toBuffer({ resolveWithObject: true });
  const borrada = await imagem.clone().blur(8).raw().toBuffer();
  const total = info.width * info.height;
  let somaL = 0, somaA = 0, somaB = 0, somaL2 = 0, escuras = 0, claras = 0;
  for (let i = 0; i < total; i++) {
    const [L, a, b] = paraLab(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
    const [Lvizinho] = paraLab(borrada[i * 3], borrada[i * 3 + 1], borrada[i * 3 + 2]);
    somaL += L; somaA += a; somaB += b; somaL2 += L * L;
    if (L - Lvizinho < -10) escuras++;
    if (L - Lvizinho > 10) claras++;
  }
  const L = somaL / total;
  return { L, a: somaA / total, b: somaB / total, contraste: Math.sqrt(somaL2 / total - L * L), escuras: (100 * escuras) / total, claras: (100 * claras) / total };
}

const texto = (m) => `L ${m.L.toFixed(1)}  a ${m.a.toFixed(1)}  b ${m.b.toFixed(1)}  contraste ${m.contraste.toFixed(1)}  pintas/veios escuros ${m.escuras.toFixed(1)}%  claros ${m.claras.toFixed(1)}%`;

for (const id of ids) {
  const pastaGeradas = path.join(base, "geradas", id);
  const arquivoConfig = path.join(pastaGeradas, "comparar.json");
  const config = fs.existsSync(arquivoConfig) ? JSON.parse(fs.readFileSync(arquivoConfig, "utf8")) : {};
  const pastaRefs = path.join(base, "referencias", config.refDir || id);
  const refs = fs.readdirSync(pastaRefs).filter((nome) => /\.(jpe?g|png|webp|avif)$/i.test(nome)).sort();
  const candidatas = fs.readdirSync(pastaGeradas).filter((nome) => /^candidata-\d+\.png$/.test(nome)).sort();
  if (!refs.length || !candidatas.length) { console.error(`${id}: falta foto real em ${pastaRefs} ou candidata em ${pastaGeradas}`); process.exitCode = 1; continue; }
  console.log(`\n## ${id}`);
  const medidas = [];
  for (const nome of refs) {
    const medida = await medir(path.join(pastaRefs, nome), config.refs?.[nome] || [0, 0, 1, 1]);
    medidas.push(medida);
    console.log(`  real ${nome.padEnd(16)} ${texto(medida)}`);
  }
  const media = Object.fromEntries(Object.keys(medidas[0]).map((k) => [k, medidas.reduce((s, m) => s + m[k], 0) / medidas.length]));
  console.log(`  MÉDIA DAS REAIS       ${texto(media)}`);
  for (const nome of candidatas) {
    const m = await medir(path.join(pastaGeradas, nome), config.candidatas || [0.2, 0.2, 0.8, 0.8]);
    const cor = Math.hypot(m.L - media.L, m.a - media.a, m.b - media.b);
    const textura = Math.abs(m.contraste - media.contraste) + Math.abs(m.escuras - media.escuras) + Math.abs(m.claras - media.claras);
    console.log(`  ${nome.padEnd(21)} ${texto(m)}\n      distância de cor (ΔE) ${cor.toFixed(1)} · distância de textura ${textura.toFixed(1)}`);
  }
}
