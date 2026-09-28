# Antecipação da primeira imagem — 27/09/2026

Base `a720b3fb11ac9030577df183518dec63960ff6cb`, recebida por `git fetch` e `git merge --ff-only origin/main`; árvore limpa antes do ajuste. Responde ao achado do Pulso em `jk-marmores-refs/auditorias-fluidez/2026-09-27-2021/RELATORIO.md`.

O loader passa a preparar o módulo da experiência e os quadros 00/01 da cozinha rosada a 1,5 viewport de distância. O observador antecipado só é armado após o evento `load` e `requestIdleCallback`, com fallback de 200 ms nos navegadores sem essa API. As imagens usam prioridade baixa. Os controles continuam montando apenas a 250 px do palco; as miniaturas não entram no pré-carregamento antecipado.

Os dois quadros decodificados são compartilhados com o canvas para evitar um segundo pedido. Save-Data e reduced-motion antecipam somente o quadro estático. Importação/imagem que falhar no preparo pode ser tentada novamente na ativação. Clique explícito em Explorar continua acionando a experiência imediatamente.

## Antes e depois

Build de produção local, porta 3107. Três perfis novos por versão, Chromium 393 × 873, DPR 1, CPU 4×, latência 150 ms, download 200 KiB/s e upload 75 KiB/s. Rolagem programada a 900 px/s, iniciada 500 ms após `load`. A primeira imagem é detectada após o canvas desenhar e marcar seu primeiro quadro, amostrada por RAF. A entrada do palco é sua primeira interseção com a viewport.

| Mediana | Antes | Depois |
|---|---:|---:|
| Espera pela imagem após o palco entrar | 1.070 ms | 0 ms |
| Primeiro pedido de quadro desde a navegação | 5.691 ms | 4.374 ms |
| Primeiro quadro desenhado desde a navegação | 6.620 ms | 5.358 ms |
| LCP observado | 784 ms | 736 ms |
| Pedidos do configurador antes de `load` | 0 | 0 |

Na revisão, o quadro já estava desenhado 194–209 ms antes de o palco aparecer (mediana 199 ms). A espera original foi 1.061–1.098 ms. Os tempos absolutos desde a navegação não são comparáveis aos da auditoria publicada do Pulso: aqui a rolagem tem velocidade e início controlados. São medições locais emuladas, não INP ou dados de aparelhos físicos.

JS inicial: oito scripts, 141.324 → 141.538 bytes gzip (+214 bytes do agendamento). O módulo da experiência e suas imagens continuam fora da entrada da página. Nenhuma mudança no hero/LCP ou no restante da home.

`npm run lint`, `npm run build` e o `check:pendencias` do build passaram (modo de homologação existente). Dezesseis verificações funcionais passaram: abertura sem mídia do configurador; somente dois quadros antes da montagem em mobile/desktop; reutilização sem novo pedido; um quadro com Save-Data/reduced-motion; fallback sem requestIdleCallback; nenhum pedido enquanto o load ainda está pendente, mesmo rolando cedo até o palco. Sem erros de página.

Evidências: [antes](fluidez-antes.json), [depois](fluidez-depois.json), [limites de carregamento](fluidez-guards.json). Scripts locais de reprodução: `jk-marmores/tools/higgsfield/configurador-fluidez-check.mjs` e `configurador-fluidez-guards.mjs`; nenhum script usa a API de geração.

Custo de geração nesta tarefa: US$ 0. Sem publicação ou alteração de workflow. Preview 3107 e navegadores de teste encerrados após a entrega.
