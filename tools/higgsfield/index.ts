// Exemplo: gera um vídeo com Seedance 2.5 (text-to-video) pela API da Higgsfield.
// Rodar: npm run exemplo  (lê HF_CREDENTIALS de .env.local; nunca imprime a credencial)
import {
  config,
  higgsfield,
  HiggsfieldError,
  NotEnoughCreditsError,
  ValidationError,
  BadInputError,
  type V2Response,
} from "@higgsfield/client/v2";

const MODELO = "bytedance/seedance-2.5/text-to-video";

if (!process.env.HF_CREDENTIALS) {
  console.error("HF_CREDENTIALS ausente. Defina em tools/higgsfield/.env.local (formato key-id:key-secret).");
  process.exit(1);
}

config({ credentials: process.env.HF_CREDENTIALS });

async function main(): Promise<number> {
  let resultado: V2Response;
  try {
    resultado = await higgsfield.subscribe(MODELO, {
      input: {
        prompt: "A cinematic scene at sunset",
        duration: 5,
        resolution: "720p",
        aspect_ratio: "16:9",
      },
      withPolling: true,
    });
  } catch (erro) {
    if (erro instanceof NotEnoughCreditsError) console.error("Falhou: saldo insuficiente na API.");
    else if (erro instanceof ValidationError || erro instanceof BadInputError) console.error(`Falhou: entrada rejeitada (${erro.message}).`);
    else if (erro instanceof HiggsfieldError) console.error(`Falhou: erro da API (${erro.name}: ${erro.message}).`);
    else console.error("Falhou: erro inesperado.", erro instanceof Error ? erro.message : erro);
    return 1;
  }

  // O SDK tipa queued | in_progress | completed | failed | nsfw; a API também pode
  // devolver cancelamento. Só é sucesso se estiver completed e com URL de vídeo.
  const status = String(resultado.status);
  const url = resultado.video?.url;
  if (status === "completed" && url) {
    console.log(`Concluído. request_id=${resultado.request_id}`);
    console.log(`URL do vídeo: ${url}`);
    return 0;
  }

  const motivo =
    status === "nsfw" ? "bloqueado pela moderação (nsfw)" :
    status === "failed" ? "a geração falhou" :
    status.startsWith("cancel") ? "a requisição foi cancelada" :
    status === "completed" ? "concluído sem URL de vídeo" :
    `status inesperado "${status}"`;
  console.error(`Falhou: ${motivo}. request_id=${resultado.request_id}`);
  return 1;
}

process.exitCode = await main();
