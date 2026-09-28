# Entrega 1 — tipografia, paleta e tokens

Base 86e2529. Fontes e licenças: docs/proposta/direcao-premium-2026-09-28.md. Código do configurador e sua linha na home intactos. Lint sem erros (dois avisos preexistentes em tools/higgsfield), imagens/build Next e check:pendencias em homolog passaram. Pendências continuam registradas; isto não equivale a liberar SITE_MODE=producao.

| Emulação, cinco execuções | Antes | Entrega 1 |
|---|---:|---:|
| LCP simulate, mediana | 2,408 s | 2,409 s |
| TBT, mediana | 22,5 ms | 23,5 ms |
| CLS | 0 | 0 |
| A11y | 100 | 100 |
| Maior long task nos primeiros 3 s | 284 ms | 180 ms |
| JS inicial gzip | 141.606 B | 141.605 B |

LCP <=2 s e todas as tarefas <=150 ms ainda não atendidos. Event Timing no teste de toque: máximo 48 ms. Rolagem: script+pintura P95 10,758 ms, máximo 26,212 ms; limite de 8 ms não atendido. A soma do script de auditoria inclui callbacks aninhados e desbloqueio de seções; não é medição física de FPS. Sem waiting e sem downloads de vídeo nos cenários slow, Save-Data e reduced-motion. Teste próprio sobrescreve navigator.connection; o conditions.cjs histórico usa apenas cabeçalho Save-Data, que não comprova a API.

Capturas válidas: antes-{390,1440}-*.png e fontes-{390,1440}-*.png. Dados de fontes/ são da revisão final. etapa1/ é diagnóstico anterior à correção da herança da fonte e não representa esta entrega. Interface: sem overflow, CTA correto, menu com Escape/inert, WhatsApp 5511967976902 e marcadores data-pendente preservados.

Seção 9: GSAP continua dinâmico depois do pôster/fontes; ignoreMobileResize preservado; sem normalização ou interceptação de scroll. Mudança visual usa transform/opacity, sem animação de geometria. O mecanismo antigo da jornada ainda mede layout por quadro; será substituído na entrega 3.

Configuração: tsconfig exclui somente o pacote independente tools/higgsfield, trazido pela main, pois não integra o frontend e tem SDK próprio. experimental.inlineCss permanece como estava. Sem geração paga, publicação ou alteração de deploy.
