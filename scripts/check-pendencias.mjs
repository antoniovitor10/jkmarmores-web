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
for (const arquivo of await arquivos("out", ".html")) {
  const conteudo = await fs.readFile(arquivo, "utf8");
  for (const match of conteudo.matchAll(/data-pendente="([^"]+)"/g)) pendencias.push(`${arquivo}: ${match[1]}`);
}
if (pendencias.length) process.stdout.write(`${[...new Set(pendencias)].join("\n")}\n`);
if (process.env.SITE_MODE === "producao" && pendencias.length) process.exitCode = 1;
