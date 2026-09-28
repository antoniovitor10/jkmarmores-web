# Entrega A: contato e informação

Base 9cb4e709a37595fd7c0369ecd9f005ccc620dce3, árvore limpa; fetch e merge --ff-only origin/main sem alteração. Sem publicação ou geração paga.

WhatsApp unificado fora do configurador, dock em pílula de 56 px após a capa e oculto nas zonas de contato/configurador, menu móvel em tela cheia com Escape e foco contido. Aviso de IA único na capa e repetido no rodapé; legendas redundantes, eyebrows soltos e painel público de pendências removidos. Os atributos data-pendente continuam no HTML. A chamada da jornada está na etapa 04. Nenhuma afirmação nova de atendimento.

O controlador existente da capa passou a import dinâmico para compensar a pequena ilha de interação global. Não se reescreve HTML nem se adia a hidratação do Next. Configurador e sua linha na home intactos; a introdução/aviso desse componente continua reservada à Orbita.

## Aceite, seção 9

Emulação Chrome, CPU 4x, 393x873; cinco execuções Pulso e Lighthouse simulate. Scripts e resultados nesta pasta. Lint, build e check:pendencias passaram em SITE_MODE=homolog; dados pendentes não estão resolvidos.

| Medida | Antes (rodada base, local) | A |
|---|---:|---:|
| LCP simulate mediano | 2,341 s | 2,408 s; 0/5 até 2 s |
| TBT mediano | 30,2 ms | 40 ms |
| CLS | 0 | 0 |
| Acessibilidade | 100 | 100, 5/5 |
| JS inicial gzip | 142.298 bytes | 141.866 bytes |
| Maior tarefa por execução, primeiros 3 s | 136/152/144/143/145 ms | 126/146/169/134/138 ms |
| Event Timing do toque no menu | — | 32 ms |
| Gesto em rede lenta | 87 ms | 113 ms; zero waiting e zero vídeo |

Trace de rolagem: script + pintura por intervalo AnimationFrame::Render, máximo 19,59 ms, p95 5,27 ms. Inclui troca/desbloqueio de seções e chamadas do harness; não é medição em telefone físico. O ideal de 8 ms em todos os quadros, LCP 2 s e tarefa máxima 150 ms não foi atingido nesta entrega; não se declara aceite integral. Uma execução teve concorrência com captura automatizada; os próximos lotes devem ser isolados.

Capturas a-antes/a-depois em 390 e 1440 px. As capturas antigas da capa mostram o estado após rolagem; a-depois-capa mostra a entrada após corrigir o harness. Comparação de primeiro quadro não é equivalente nessa dupla. Menu, contato e rodapé conferidos; links wa.me apontam 5511967976902, sem envio de mensagem.

O conditions.cjs legado altera o cabeçalho Save-Data, mas registra connectionSaveData=false no Chrome: não comprova essa API. O teste de rede lenta de gestures.cjs injeta a conexão e comprova a ausência de mídia. Os demais cenários de mídia da base não foram reexecutados integralmente, pois o algoritmo não mudou.
