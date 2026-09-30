# Versão 2: tipografia e conteúdo real, 30/09/2026

Worktree `jk-v2`, branch `versao-2`, publicação `https://jkmarmores.com.br/2/`, homologação noindex. Base da rodada: `9654e0b`; fetch e merge de origin/main concluídos em `07245aa`, sem conflitos. A pausa anterior foi encerrada pela nova instrução do Vitor.

## O que mudou

- Bodoni Moda substituída em todas as páginas por Work Sans Light 300. Source Sans 3 400 continua no corpo. Títulos longos leves, assinatura da JK em caixa alta espaçada, papel quente, imagens editoriais e sistema de movimento preservados.
- Início e Sobre Nós apresentam os dados da cliente: desde 2010, propósito, precisão, personalização, projetos residenciais/comerciais/industriais e área atendida. Assinatura integral: “Onde a matéria-prima encontra a precisão. E o bruto vira arte.”
- Materiais apresenta as seis categorias e as descrições recebidas, incluindo mármores dolomíticos. Cada categoria tem página estática com o mesmo conteúdo confirmado. O seletor ilustrativo permanece no início, sem ser associado a uma categoria comercial. Removida a referência antiga a maquete 3D.
- SEO e JSON-LD usam foundingDate=2010 e as seis áreas informadas. Os marcadores de história, região e categorias foram substituídos; nomes de pedras, acabamentos, serviços específicos, fichas técnicas, fotos reais, equipe, CEP e horários continuam pendentes. Não há novos serviços, nomes de pedra ou fatos inventados.
- WhatsApp flutuante identificado como região de atendimento para leitores de tela. A captura do seletor agora aguarda o término do crossfade, além do decode, para registrar a imagem correspondente à legenda.

Fonte de conteúdo: `jk-marmores-refs/cliente/textos-cliente-2026-09-28.txt`, enviado por Juliana Vitelli. Os textos de categoria foram apenas divididos em resumo e descrição; os textos institucionais foram enxugados mantendo o sentido.

## Justificativa tipográfica em três linhas

Work Sans Light traz títulos leves e um desenho sóbrio, próximo da clareza das referências de pedra e arquitetura.
Caixa alta com espaçamento amplo marca a assinatura da JK; títulos longos usam leitura natural e menos espaço entre letras.
Source Sans 3 mantém o texto confortável, enquanto os subsets locais preservam a entrega rápida e os acentos portugueses.

[Work Sans](https://github.com/google/fonts/tree/main/ofl/worksans) tem licença SIL OFL 1.1, copiada integralmente em `public/fonts/WorkSans-OFL.txt`. Subset estático Latin-1/português WOFF2: 16.924 bytes; Source Sans 3: 11.836 bytes. Somadas: 28.760 bytes. Fontes self-hosted com next/font/local e fallback métrico; sem pedidos externos em runtime. Nenhuma geração paga; custo US$ 0.

## Verificação

`npm run lint`, build com NEXT_PUBLIC_BASE_PATH=/2 e check:pendencias homolog passaram. Lint mantém somente os dois avisos anteriores de variáveis não usadas em ferramentas Higgsfield. As pendências preservadas bloqueiam o lançamento em SITE_MODE=producao. Exportação inclui as seis páginas de categoria; todas as referências absolutas HTML de src/href/srcset usam /2/. Detector tipográfico Impeccable sem achados.

`qa-conteudo.cjs`: 24 cenários aprovados. Sobre, Materiais, seis categorias e Contato em 390 e 1440 px; fonte/peso, um H1, noindex, JSON-LD, navegação, ausência de overflow e axe WCAG 2 A/AA, 2.1 AA e boas práticas. Mais seis cenários sem JavaScript em 320 e 720 px, verificando legibilidade estrutural e ausência de overflow; 720 px cobre a largura efetiva de desktop 1440 em zoom 200%. Nenhuma violação axe, erro JavaScript ou resposta HTTP de erro.

`../qa.cjs`: seis cenários aprovados (390/1440 normal, 390 reduced-motion, Save-Data, 3G e sem JS). Jornada nas quatro etapas, monograma, seletor, imagem decodificada/crossfade, mensagem WhatsApp, menu com foco e inert, Escape e modo estático verificados. Nenhum vídeo ou asset sem prefixo carregado. CPU emulada 4x:

| Cenário | Maior tarefa | Maior evento de interação | CLS |
|---|---:|---:|---:|
| 390 normal | 165 ms | 56 ms | 0 |
| 1440 normal | 136 ms | 32 ms | 0 |
| 390 reduced-motion | 124 ms | 24 ms | 0 |
| 390 Save-Data | 137 ms | 24 ms | 0 |
| 390 3G | 226 ms | 32 ms | 0 |

Cinco execuções Lighthouse 13.5 mobile, Chrome headless, cache frio, servidor local gzip, throttling simulate, 390×844, DPR 2. Execuções sequenciais, sem auditorias concorrentes:

| Rodada | Performance | A11y | Boas práticas | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 97 | 100 | 100 | 2406 ms | 90 ms | 0 |
| 2 | 98 | 100 | 100 | 2406 ms | 40 ms | 0 |
| 3 | 97 | 100 | 100 | 2439 ms | 90 ms | 0 |
| 4 | 98 | 100 | 100 | 2412 ms | 38 ms | 0 |
| 5 | 98 | 100 | 100 | 2413 ms | 26 ms | 0 |

Medianas: Performance 98, LCP 2412 ms, TBT 40 ms, CLS 0. A11y e boas práticas 100 em todas; SEO 66 por noindex intencional. A descoberta da imagem LCP passa (eager, fetchpriority high, presente no HTML); sem recurso CSS bloqueante apontado pelo Lighthouse.

Metas de LCP até 2 s e tarefa até 150 ms ainda não foram atingidas em todos os modos. Interações observadas ficaram abaixo de 200 ms e CLS abaixo de 0,05. Não confundir Event Timing de cliques/teclado com uma medição de gesto contínuo: o roteiro usa saltos de rolagem. Emulação de navegador não substitui aparelho físico, Safari/iOS ou métricas de campo; esses testes continuam necessários.

## Evidências e reprodução

Capturas em 390 e 1440 px nesta pasta: capa, monograma, jornada, seletor, Sobre Nós e Materiais. Revisão visual confirma hierarquia leve, títulos longos sem cortes, corpo legível e unidade quente. Dados brutos em `qa.json`, `conteudo.json` e `entrada-1..5-mobile-depois-{lighthouse,resumo}.json`.

Para repetir: iniciar `scripts/preview-local.mjs` com PORT=3102 e NEXT_PUBLIC_BASE_PATH=/2; definir QA_OUTPUT_DIR para esta pasta e executar `node docs/auditorias/versao-2/qa.cjs`; executar `node docs/auditorias/versao-2/cliente-2026-09-30/qa-conteudo.cjs`. Playwright via PLAYWRIGHT_MODULE ou instalação global; axe em `.maestri/audit-tools/node_modules`. Lighthouse via `scripts/audit-home.mjs`, AUDIT_ROUTE=/2/ e AUDIT_MODULES local. Todos os navegadores de auditoria são fechados em finally. Preview encerrado ao concluir; nenhum portal novo criado.

Próximos passos: comparação da cliente, fotos reais/vetor oficial, nomes comerciais e serviços confirmados; otimização do custo inicial e testes em telefone físico. Nenhuma mudança em main, workflow, .htaccess, secrets ou deploy.
