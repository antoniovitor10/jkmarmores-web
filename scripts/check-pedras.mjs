// Confere o catálogo de pedras no site gerado (HU-0001, T-0002): pedra oculta some do HTML e do sitemap,
// pedra visível com imagem aparece na página da sua categoria. Pedra sem imagem só gera aviso (PRD D2).
import fs from "node:fs";
import path from "node:path";

const out = path.resolve("out");
const pedras = JSON.parse(fs.readFileSync("src/content/pedras.json", "utf8"));
const manifesto = JSON.parse(fs.readFileSync("src/generated/images.json", "utf8"));

function htmls(pasta) {
  return fs.readdirSync(pasta, { withFileTypes: true }).flatMap((item) => {
    const caminho = path.join(pasta, item.name);
    if (item.isDirectory()) return htmls(caminho);
    return item.name.endsWith(".html") ? [caminho] : [];
  });
}

if (!fs.existsSync(out)) {
  console.error("check-pedras: out/ não existe; rode o next build antes.");
  process.exit(1);
}

const paginas = htmls(out).map((arquivo) => ({ arquivo, texto: fs.readFileSync(arquivo, "utf8") }));
const sitemap = fs.existsSync(path.join(out, "sitemap.xml")) ? fs.readFileSync(path.join(out, "sitemap.xml"), "utf8") : "";
const problemas = [];
const semImagem = [];

for (const pedra of pedras) {
  const marca = `data-pedra="${pedra.slug}"`;
  if (sitemap.includes(pedra.slug)) problemas.push(`${pedra.slug}: aparece no sitemap (não há página por pedra)`);
  if (pedra.oculta) {
    for (const { arquivo, texto } of paginas) if (texto.includes(marca)) problemas.push(`${pedra.slug}: oculta, mas está em ${path.relative(process.cwd(), arquivo)}`);
    continue;
  }
  if (!manifesto[`pedra-${pedra.slug}`]) { semImagem.push(pedra.slug); continue; }
  const pagina = paginas.find(({ arquivo }) => arquivo === path.join(out, "materiais", pedra.categoria, "index.html"));
  if (!pagina || !pagina.texto.includes(marca)) problemas.push(`${pedra.slug}: visível com imagem, mas não está em out/materiais/${pedra.categoria}/`);
}

if (semImagem.length) console.warn(`check-pedras: ${semImagem.length} pedra(s) sem imagem, fora do catálogo até ter imagem: ${semImagem.join(", ")}`);
if (problemas.length) {
  console.error(`check-pedras: ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
  process.exit(1);
}
const ocultas = pedras.filter((pedra) => pedra.oculta).length;
console.log(`check-pedras: ${pedras.length - ocultas - semImagem.length} pedra(s) no catálogo, ${ocultas} oculta(s), nenhuma no sitemap.`);
