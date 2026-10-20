# Índice de insumos

<!-- Versionado. Uma linha por arquivo (ou pasta, quando o conteúdo é homogêneo) em docs/insumos/brutos/, que fica FORA do git.
     As tasks leem este índice, não a pasta bruta. Um bruto só é aberto quando a task cita o arquivo.
     Uso: fonte de texto | asset final | só contexto
     Autorização: sim | não confirmada | não se aplica
     Dados pessoais: sim | não. Com "sim", o agente só lê pelo metodo/nucleo/scripts/mascarar.mjs, salvo autorização do desenvolvedor na conversa.
     Caminhos relativos a docs/insumos/brutos/. -->

Atualizado em: 2026-10-20. Origem: conteúdo de `../jk-marmores-refs`, movido para `brutos/` no onboarding do método.

## Da cliente

| Arquivo (em `brutos/`) | O que é | De quem / data | Uso | Autorização | Dados pessoais | Observação |
|---|---|---|---|---|---|---|
| `cliente/textos-cliente-2026-09-28.txt` | texto "Sobre Nós" e descrição das categorias de materiais | cliente, grupo do projeto, 2026-09-28 | fonte de texto | sim | sim | nome da remetente no cabeçalho de cada mensagem; o texto institucional já está em `src/content/cliente.ts`, sem acréscimos |
| `cliente/logo-jk-whatsapp-2026-09-26.jpg` | logo enviada pelo WhatsApp | cliente, 2026-09-26 | asset final | sim | não | versão oficial: `assets/brand/logo-jk-cliente-2026-09-26.jpg` (mesma logo, arquivo versionado). Vetor ainda pendente (V1) |
| `cliente/2026-09-28-1406-audio-atualizacao-site.ogg` | áudio do Vitor no grupo, aviso de andamento | Vitor, 2026-09-28 | só contexto | não se aplica | sim | transcrição resumida em `cliente/atualizacoes.md`; não abrir |
| `cliente/atualizacoes.md` | registro das mensagens do grupo até 28/09 | Planejador, 2026-09-27 a 30 | só contexto | não se aplica | sim | contém nome e telefone; ler só mascarado. Mensagens depois de 28/09 ainda não registradas (ler a conversa 43286 no ZapMind) |
| `cliente/radar-estado.json` | marcador da última mensagem lida da conversa 43286 | Planejador, 2026-09-30 | só contexto | não se aplica | não | última leitura: 2026-09-28 14:44 |

## Referências visuais (terceiros)

| Arquivo (em `brutos/`) | O que é | De quem / data | Uso | Autorização | Dados pessoais | Observação |
|---|---|---|---|---|---|---|
| `referencias-premium/*.png`, `*.jpg` (11 arquivos) | capturas de sites de pedra premium (Antolini, Decolores, Lithos, Quarry House, Salvatori, Scavata, Stone & Style) e duas fotos `folha*.jpg` | Planejador e Vitor, 2026-09-28 | só contexto | não se aplica | não | parâmetro de linguagem; nunca copiar (princípio 4). Leitura em `docs/proposta/direcao-premium-2026-09-28.md` |
| `referencias-premium$n-1440.png` | captura solta com nome quebrado (sobra de script) | 2026-09-28 | só contexto | não se aplica | não | provável duplicata de uma das capturas acima |
| `referencia-tutorial-astra.md` | análise do vídeo "Crie um Site Cinematográfico com GPT-6 Astra" | Planejador, 2026-09-26 | só contexto | não se aplica | não | técnica de máscara tipográfica e rolagem; não usar imagem, texto nem marca do vídeo |
| `abertura.jpg`, `final.jpg` | quadros extraídos do vídeo acima | 2026-09-26 | só contexto | não se aplica | não | idem |
| `transcricao.txt` | legenda automática do vídeo acima | 2026-09-26 | só contexto | não se aplica | não | idem |

## Trabalho interno (auditorias e homologação)

| Arquivo (em `brutos/`) | O que é | De quem / data | Uso | Autorização | Dados pessoais | Observação |
|---|---|---|---|---|---|---|
| `auditorias-fluidez/2026-09-27-2021/`, `2026-09-27-2137/` | relatórios, traces e scripts da auditoria de fluidez (Pulso), com `node_modules` do `puppeteer-core` | agentes, 2026-09-27 | só contexto | não se aplica | não | é o `AUDIT_MODULES` dos `scripts/check-*.mjs`. Handoff aberto no ai-memory sobre o vídeo em rede lenta |
| `homologacao/` | `homologar.cjs`, Lighthouse da produção (`lh-prod-*.json`) e capturas local e pública | agentes, 2026-10-02 | só contexto | não se aplica | não | homologação do lançamento |
| `revisoes/2026-09-28-0018/` | revisão de design (`REVISAO.md`, `PRIORIDADES.md`, `SISTEMA-DE-MOVIMENTO.md`) e capturas | agentes, 2026-09-28 | só contexto | não se aplica | não | |

Pastas `.batuta/` e `.maestri/` dentro de `brutos/` são configuração dos orquestradores, não insumo.

## Pendências com o cliente

As pendências de dados, oferta e material visual estão em `docs/PENDENCIAS.md` (fonte única). Do índice:

- Fotos de obras reais com autorização (V3) e fotos das chapas (V4): nenhuma recebida.
- Logo em vetor (V1): só o JPEG.
- Pedido de imagens novas depois da aprovação da versão 1: ler a conversa 43286 no ZapMind e registrar aqui o que chegar.
