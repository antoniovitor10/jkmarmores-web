// T-0010: gera o close de chapa de uma pedra de dolomíticos ou quartzitos pela API da Higgsfield.
// Uso (dentro de tools/higgsfield):
//   node --env-file=<caminho do .env.local> t0010-pedras.mjs estimar <id> <modelo>
//   node --env-file=<caminho do .env.local> t0010-pedras.mjs gerar <id> <modelo> [n]
// <id> é a chave em docs/trabalho/avulsas/T-0010/referencias/pedidos.json (fora do git) (prompt e URLs de referência).
// <modelo>: z-image/turbo (só texto) ou alibaba/qwen-image-3/edit (com referência em image_urls).
// Saída em docs/trabalho/avulsas/T-0010/geradas/<id>/ (fora do git): candidata-N.png e registro.json.
// Nunca imprime a credencial.
import fs from "node:fs/promises";
import path from "node:path";
import { config, higgsfield } from "@higgsfield/client/v2";

const [acao, id, modelo, nArg] = process.argv.slice(2);
if (!process.env.HF_CREDENTIALS) { console.error("HF_CREDENTIALS ausente."); process.exit(1); }
if (!["estimar", "gerar"].includes(acao) || !id || !modelo) { console.error("Uso: t0010-pedras.mjs estimar|gerar <id> <modelo> [n]"); process.exit(1); }

const raiz = path.resolve("../../docs/trabalho/avulsas/T-0010");
const pedidos = JSON.parse(await fs.readFile(path.join(raiz, "referencias", "pedidos.json"), "utf8"));
const pedido = pedidos[id];
if (!pedido) { console.error(`Sem pedido para ${id}.`); process.exit(1); }

function entrada(semente) {
  const base = { prompt: pedido.prompt, aspect_ratio: "3:4", resolution: "2k", seed: semente };
  if (modelo === "z-image/turbo") return { ...base, prompt_extend: false };
  if (modelo === "alibaba/qwen-image-3/edit") return { ...base, image_urls: pedido.referencias.slice(0, 2), prompt_extend: false };
  throw new Error(`Modelo não previsto: ${modelo}`);
}

if (acao === "estimar") {
  const r = await fetch(`https://api.higgsfield.ai/estimate/${modelo}`, {
    method: "POST",
    headers: { Authorization: `Key ${process.env.HF_CREDENTIALS}`, "Content-Type": "application/json" },
    body: JSON.stringify(entrada(1031)),
  });
  console.log(JSON.stringify({ modelo, status: r.status, resultado: await r.json().catch(() => null) }));
  process.exit(0);
}

config({ credentials: process.env.HF_CREDENTIALS });
const pasta = path.join(raiz, "geradas", id);
await fs.mkdir(pasta, { recursive: true });
const registroArq = path.join(pasta, "registro.json");
const registro = JSON.parse(await fs.readFile(registroArq, "utf8").catch(() => "[]"));
const n = Number(nArg ?? 1);
for (let i = 0; i < n; i++) {
  const semente = 1031 + registro.length * 7 + i;
  const input = entrada(semente);
  const item = { modelo, input, criado: new Date().toISOString() };
  try {
    const r = await higgsfield.subscribe(modelo, { input, withPolling: true });
    item.status = String(r.status); item.request_id = r.request_id;
    const url = r.images?.[0]?.url;
    if (item.status === "completed" && url) {
      const arq = `candidata-${registro.length + 1}.png`;
      const resp = await fetch(url);
      await fs.writeFile(path.join(pasta, arq), Buffer.from(await resp.arrayBuffer()));
      item.arquivo = arq;
    }
  } catch (e) {
    item.status = "erro"; item.erro = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }
  registro.push(item);
  await fs.writeFile(registroArq, JSON.stringify(registro, null, 2));
  console.log(JSON.stringify({ id, status: item.status, request_id: item.request_id, arquivo: item.arquivo, erro: item.erro }));
}
