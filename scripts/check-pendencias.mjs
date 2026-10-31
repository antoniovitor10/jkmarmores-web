import fs from "node:fs/promises";
import path from "node:path";

async function arquivos(pasta, extensao) {
  try {
    const itens = await fs.readdir(pasta, { withFileTypes: true });
    const listas = await Promise.all(itens.map((item) => item.isDirectory() ? arquivos(path.join(pasta, item.name), extensao) : item.name.endsWith(extensao) ? [path.join(pasta, item.name)] : []));
    return listas.flat();
  } catch { return []; }
}

const pendencias = [];
for (const arquivo of await arquivos("src/content", ".ts")) {
  if (arquivo.endsWith("pendente.ts")) continue;
  const conteudo = await fs.readFile(arquivo, "utf8");
  for (const match of conteudo.matchAll(/pendente\(\s*["'`]([^"'`]+)["'`]\s*\)/g)) pendencias.push(`${arquivo}: ${match[1]}`);
}
// Em produção vale o HTML publicado: nenhuma pendência pode chegar ao ar.
// As pendências que continuam em src/content são informativas (o conteúdo correspondente some em produção).
const publicadas = [];
for (const arquivo of await arquivos("out", ".html")) {
  const conteudo = await fs.readFile(arquivo, "utf8");
  for (const match of conteudo.matchAll(/data-pendente="([^"]+)"/g)) publicadas.push(`${arquivo}: ${match[1]}`);
  for (const match of conteudo.matchAll(/(Pendente: [^<"]{0,80}|>A confirmar<|class="pendente")/g)) publicadas.push(`${arquivo}: ${match[1]}`);
}
const producao = process.env.SITE_MODE === "producao";
if (pendencias.length) process.stdout.write(`${producao ? "Pendencias no codigo (ocultas em producao):" : "Pendencias:"}\n${[...new Set(pendencias)].join("\n")}\n`);
if (publicadas.length) process.stdout.write(`Pendencias no HTML publicado:\n${[...new Set(publicadas)].join("\n")}\n`);
if (producao && publicadas.length) process.exitCode = 1;
