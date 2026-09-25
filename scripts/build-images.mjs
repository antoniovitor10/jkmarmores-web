import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const fonte = path.resolve("assets/images");
const destino = path.resolve("public/img");
const manifesto = {};
await fs.mkdir(fonte, { recursive: true });
await fs.mkdir(destino, { recursive: true });
for (const nome of await fs.readdir(fonte)) {
  if (!/\.(jpe?g|png|webp|avif)$/i.test(nome)) continue;
  const id = path.parse(nome).name;
  const arquivo = path.join(fonte, nome);
  const dados = await sharp(arquivo).metadata();
  if (!dados.width || !dados.height) continue;
  const variantes = [];
  for (const width of [390, 768, 1200, 1600].filter((valor) => valor <= dados.width)) {
    const avif = `/img/${id}-${width}.avif`;
    const webp = `/img/${id}-${width}.webp`;
    await sharp(arquivo).resize({ width }).avif({ quality: 55 }).toFile(path.join(destino, path.basename(avif)));
    await sharp(arquivo).resize({ width }).webp({ quality: 72 }).toFile(path.join(destino, path.basename(webp)));
    variantes.push({ width, avif, webp });
  }
  if (!variantes.length) {
    const width = dados.width;
    const avif = `/img/${id}-${width}.avif`;
    const webp = `/img/${id}-${width}.webp`;
    await sharp(arquivo).avif({ quality: 55 }).toFile(path.join(destino, path.basename(avif)));
    await sharp(arquivo).webp({ quality: 72 }).toFile(path.join(destino, path.basename(webp)));
    variantes.push({ width, avif, webp });
  }
  const preview = await sharp(arquivo).resize({ width: 24 }).webp({ quality: 35 }).toBuffer();
  manifesto[id] = { width: dados.width, height: dados.height, placeholder: `data:image/webp;base64,${preview.toString("base64")}`, variantes };
}
await fs.mkdir(path.resolve("src/generated"), { recursive: true });
await fs.writeFile(path.resolve("src/generated/images.json"), JSON.stringify(manifesto, null, 2));
