import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { editorialImage } from './editorial-image.mjs';

const fonte = path.resolve("assets/images");
const destino = path.resolve("public/img");
const manifesto = {};
await fs.mkdir(fonte, { recursive: true });
await fs.mkdir(destino, { recursive: true });
const sources = (await fs.readdir(fonte)).map(nome => ({ nome, arquivo: path.join(fonte, nome) }));
sources.push({ nome: 'capa-editorial-mobile.png', arquivo: await sharp(path.join(fonte, 'material-detalhe-quente.png'))
  .extract({ left: 160, top: 0, width: 900, height: 1152 }).png().toBuffer() });
for (const { nome, arquivo } of sources) {
  if (!/\.(jpe?g|png|webp|avif)$/i.test(nome)) continue;
  const id = path.parse(nome).name;
  // Fontes históricas ficam no acervo, sem derivados sem uso no site exportado.
  if (["a1-mobile", "capa-aberto-01"].includes(id)) continue;
  if (id === "a1-prova-01") {
    await (await editorialImage(arquivo, 1200)).avif({ quality: 50 }).toFile(path.join(destino, "a1-prova-01-1200.avif"));
    continue;
  }
  const dados = await sharp(arquivo).metadata();
  if (!dados.width || !dados.height) continue;
  const variantes = [];
  for (const width of [390, 768, 1200, 1600].filter((valor) => valor <= dados.width)) {
    const avif = `/img/${id}-${width}.avif`;
    const webp = `/img/${id}-${width}.webp`;
    const treated = await editorialImage(arquivo, width);
    await treated.clone().avif({ quality: 50 }).toFile(path.join(destino, path.basename(avif)));
    await treated.clone().webp({ quality: 72 }).toFile(path.join(destino, path.basename(webp)));
    variantes.push({ width, avif, webp });
  }
  if (!variantes.length) {
    const width = dados.width;
    const avif = `/img/${id}-${width}.avif`;
    const webp = `/img/${id}-${width}.webp`;
    const treated = await editorialImage(arquivo, width);
    await treated.clone().avif({ quality: 50 }).toFile(path.join(destino, path.basename(avif)));
    await treated.clone().webp({ quality: 72 }).toFile(path.join(destino, path.basename(webp)));
    variantes.push({ width, avif, webp });
  }
  const preview = await sharp(arquivo).resize({ width: 24 }).webp({ quality: 35 }).toBuffer();
  manifesto[id] = { width: dados.width, height: dados.height, placeholder: `data:image/webp;base64,${preview.toString("base64")}`, variantes };
}
await fs.mkdir(path.resolve("src/generated"), { recursive: true });
await fs.writeFile(path.resolve("src/generated/images.json"), JSON.stringify(manifesto, null, 2));
