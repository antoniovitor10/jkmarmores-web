// Confere o registro das imagens geradas da HU-0001 (ADR-0001, princípio 6).
// Uso: node scripts/check-imagens-geradas.mjs [id ...]
// Sem ids, confere todo arquivo de assets/images/ que tem entrada em docs/proposta/hu-0001-prompts.json
// e também os prefixos da HU-0001 (pedra-, categoria-, capa-calacatta, configurador-).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const raiz = process.cwd();
const pastaImagens = path.join(raiz, "assets/images");
const jsonPrompts = path.join(raiz, "docs/proposta/hu-0001-prompts.json");
const licencas = fs.readFileSync(path.join(raiz, "docs/proposta/assets-licencas.md"), "utf8");
const prompts = JSON.parse(fs.readFileSync(jsonPrompts, "utf8"));
const prefixos = /^(pedra-|categoria-|capa-calacatta|configurador-)/;

// Proporção esperada por tipo: largura / altura, tolerância e largura mínima.
function formato(id) {
  if (id.startsWith("pedra-") || id.startsWith("categoria-")) return { proporcao: 0.8, tolerancia: 0.01, minimo: id.startsWith("pedra-") ? 768 : 1200 };
  if (id === "capa-calacatta-mobile") return { proporcao: 0.78, tolerancia: 0.03, minimo: 900 };
  if (id.endsWith("-mobile")) return { proporcao: 0.8, tolerancia: 0.02, minimo: 768 };
  return { proporcao: 16 / 9, tolerancia: 0.02, minimo: 1280 };
}

const arquivos = fs.readdirSync(pastaImagens).filter((nome) => /\.(png|jpe?g|webp|avif)$/i.test(nome));
const pedidos = process.argv.slice(2);
const ids = pedidos.length
  ? pedidos
  : arquivos.map((nome) => path.parse(nome).name).filter((id) => prefixos.test(id) || prompts[id]);

const problemas = [];
for (const id of ids) {
  const nome = arquivos.find((arquivo) => path.parse(arquivo).name === id);
  if (!nome) { problemas.push(`${id}: arquivo não está em assets/images/`); continue; }
  const entrada = prompts[id];
  if (!entrada) problemas.push(`${id}: sem entrada em docs/proposta/hu-0001-prompts.json`);
  else for (const campo of ["ferramenta", "prompt", "data", "arquivo"]) if (!entrada[campo]) problemas.push(`${id}: entrada do JSON sem "${campo}"`);
  if (entrada?.arquivo && entrada.arquivo !== `assets/images/${nome}`) problemas.push(`${id}: "arquivo" do JSON não aponta para assets/images/${nome}`);
  if (!licencas.includes(`assets/images/${nome}`)) problemas.push(`${id}: sem linha em docs/proposta/assets-licencas.md`);
  const { width, height } = await sharp(path.join(pastaImagens, nome)).metadata();
  const esperado = formato(id);
  const real = width / height;
  if (Math.abs(real - esperado.proporcao) > esperado.tolerancia) problemas.push(`${id}: proporção ${real.toFixed(3)}, esperada ${esperado.proporcao.toFixed(3)}`);
  if (width < esperado.minimo) problemas.push(`${id}: largura ${width}px, mínimo ${esperado.minimo}px`);
  console.log(`${id}: ${width}x${height}`);
}

const modelos = prompts._modelos;
if (!modelos) problemas.push('docs/proposta/hu-0001-prompts.json sem a chave "_modelos"');
else for (const campo of ["close_pedra", "ambiente_aplicado", "saida", "recorte"]) if (!modelos[campo]) problemas.push(`_modelos sem "${campo}"`);

// Referências da web e candidatas reprovadas nunca vão para o git (ADR-0001).
const versionados = execFileSync("git", ["ls-files", "docs/trabalho/HU-0001-imagens-novas-catalogo"], { encoding: "utf8" })
  .split("\n").filter((linha) => /\/(referencias|geradas)\//.test(linha));
if (versionados.length) problemas.push(`arquivos de referencias/ ou geradas/ versionados: ${versionados.join(", ")}`);
for (const pasta of ["referencias", "geradas"]) {
  try {
    execFileSync("git", ["check-ignore", "-q", `docs/trabalho/HU-0001-imagens-novas-catalogo/${pasta}/teste.png`]);
  } catch {
    problemas.push(`docs/trabalho/HU-0001-imagens-novas-catalogo/${pasta}/ não está no .gitignore`);
  }
}

if (problemas.length) {
  console.error(`\n${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
  process.exit(1);
}
console.log(`\nOK: ${ids.length} imagem(ns) gerada(s) com registro completo.`);
