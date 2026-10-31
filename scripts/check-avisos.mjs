// Falha o build se um aviso de IA ou de imagem ilustrativa voltar ao site (HU-0001, CA-8; ADR-0001).
// Varre os .html e .txt de out/ (o .txt é a carga do React Server Components, que também chega ao navegador).
import fs from "node:fs";
import path from "node:path";

const raiz = path.resolve("out");
const AVISOS = /gerad[ao] por (IA|intelig[eê]ncia artificial)|ilustrativ|n[aã]o representa obra/i;

function arquivos(pasta) {
  return fs.readdirSync(pasta, { withFileTypes: true }).flatMap((item) => {
    const caminho = path.join(pasta, item.name);
    if (item.isDirectory()) return arquivos(caminho);
    return /\.(html|txt)$/.test(item.name) ? [caminho] : [];
  });
}

if (!fs.existsSync(raiz)) {
  console.error("check-avisos: out/ não existe; rode o next build antes.");
  process.exit(1);
}

const achados = [];
for (const arquivo of arquivos(raiz)) {
  const texto = fs.readFileSync(arquivo, "utf8");
  const m = texto.match(AVISOS);
  if (!m) continue;
  const i = m.index;
  achados.push(`${path.relative(process.cwd(), arquivo)}: "${texto.slice(Math.max(0, i - 40), i + 60).replace(/\s+/g, " ")}"`);
}

if (achados.length) {
  console.error(`check-avisos: ${achados.length} arquivo(s) com aviso de IA ou de imagem ilustrativa:\n- ${achados.join("\n- ")}`);
  process.exit(1);
}
console.log("check-avisos: nenhum aviso de IA ou de imagem ilustrativa em out/.");
