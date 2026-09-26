# A1: linha de base e comparação local

## Antes de alterar o código do site

Referência: `145a179f34b3ef12d8be628df09f2a1eb0c65995`, branch `redesign-astra`, worktree exclusiva. Medido em 26/09/2026 às 20:20 UTC. Código de `src/`, conteúdo e assets ainda intactos. Os únicos arquivos adicionados nesta fase foram instrumentos de auditoria/preview e documentação. `npm ci` instalou o lockfile existente, sem alterar dependências.

Comandos PowerShell executados da raiz da worktree:

```powershell
npm ci
$env:SITE_MODE='homolog'
npm run build
npm run measure:bundle
node scripts/preview-local.mjs
# Em outro terminal, com Lighthouse 13.5.0 e Puppeteer instalados no cache npm:
$env:AUDIT_MODULES="$env:LOCALAPPDATA/npm-cache/_npx/0f94ee7615faf582/node_modules"
node scripts/audit-home.mjs antes
```

Servidor em `http://127.0.0.1:3105/`, export estático de `out/`, gzip de HTML/CSS/JS, cache desabilitado. Lighthouse 13.5.0, Chrome 153 headless, 390 x 844, DPR 2, throttling mobile simulado (configuração exata no JSON bruto). Capturas visuais separadas em DPR 1, 390 x 844 e 1440 x 900. Nenhuma medição em aparelho físico; TBT não substitui INP de campo.

| Medida | Antes |
|---|---:|
| Performance | 99 |
| Acessibilidade | 100 |
| Boas práticas | 100 |
| SEO | 69 |
| LCP | 2.051,06 ms |
| FCP | 756,06 ms |
| TBT | 45 ms |
| CLS | 0 |
| Transferência total Lighthouse | 154.953 bytes |
| JS inicial, gzip em disco | 138.338 bytes |
| Transferência até load, 390 px, HTML + recursos | 151.978 bytes |
| Transferência após idle, 390 px, HTML + recursos | 155.916 bytes |

SEO 69 decorre do noindex/robots de homologação, preservado. O LCP antes já ficou 51 ms acima da meta de 2 s nesta execução. Resultados são uma amostra de laboratório; não representam distribuição nem campo.

Evidências: `2026-09-26-a1-antes-lighthouse.json`, `2026-09-26-a1-antes-resumo.json`, `../proposta/capturas/a1-antes-390.png`, `../proposta/capturas/a1-antes-1440.png`. A primeira tentativa de auditoria não iniciou por diferença do caminho interno do Puppeteer; o script passou a resolver o entrypoint declarado pelo pacote e concluiu normalmente.

## Depois

Medido em 26/09/2026 às 20:34 UTC, com os mesmos instrumentos e configurações. Comandos: `npm run build`, `npm run measure:bundle`, `node scripts/audit-home.mjs depois`, `node scripts/check-home.mjs`, `npm run lint`, `git diff --check`. `AUDIT_MODULES` e `SITE_MODE=homolog` como acima. Build, lint e verificações funcionais passaram. O checker em `SITE_MODE=producao` falhou conforme esperado pelas pendências existentes; o bloqueio não foi relaxado.

| Medida | Antes | Depois | Leitura |
|---|---:|---:|---|
| Performance | 99 | 98 | Acima de 90 |
| Acessibilidade | 100 | 100 | Sem falhas automáticas |
| Boas práticas | 100 | 100 | Sem erros na amostra mobile final |
| SEO | 69 | 69 | Noindex de homologação preservado |
| LCP | 2.051,06 ms | 2.432,18 ms | **Meta de 2 s ainda não atendida** |
| FCP | 756,06 ms | 1.212,18 ms | Aumento com fontes e CSS da abertura |
| TBT | 45 ms | 22,5 ms | Não equivale a INP |
| CLS | 0 | 0,0002184 | Abaixo de 0,05 |
| Transferência total Lighthouse | 154.953 bytes | 224.428 bytes | Abaixo de 1 MB |
| JS inicial em disco, gzip | 138.338 bytes | 138.338 bytes | Inalterado, abaixo de 150 KB |
| INP | Não medido | Não medido | Requer interação representativa/campo; não inferir pelo TBT |

### Peso por tipo e momento

Valores de `PerformanceResourceTiming.transferSize`, incluindo o overhead de 300 bytes reportado pelo navegador por recurso. Visita fria separada, 390 x 844, DPR 1, sem throttling; usada para contabilidade de transferência e captura, não para afirmar tempos mobile. A auditoria Lighthouse acima usa DPR 2 e throttling simulado. A seleção responsiva do AVIF difere entre DPR 1 e 2.

| Até load, mobile DPR 1 | Antes | Depois |
|---|---:|---:|
| HTML | 4.621 | 5.834 |
| JavaScript | 140.438 | 140.438 |
| CSS | 3.579 | 6.041 |
| Fontes | 0 | 51.724 |
| Imagens | 3.340 | 9.600 |
| Vídeo | 0 | 0 |
| Motor/texturas 3D | 0 | 0 |
| **Total até load** | **151.978** | **213.637** |
| Total após network idle | 155.916 | 218.609 |

Antes, a imagem carregada era o poster da cena existente. Depois, é o AVIF 1200 do A1; o poster 3D fica mais distante da primeira dobra e não entra nessa visita mobile. Os 4.972 bytes adicionais após load no resultado final são consultas/prefetch RSC da rota; nenhum vídeo ou motor 3D foi solicitado. Em desktop DPR 1: 217.458 bytes até load e 228.067 após idle. Todos os recursos e URLs estão nos JSON de resumo.

O código 3D e os seus assets não mudaram. A cena permanece fora do carregamento inicial; o orçamento e as medições anteriores do motor estão em `../proposta/3d.md`, sem afirmar que foram repetidos nesta entrega A1. O PNG fonte de 6,4 MB não é servido ao visitante. Maior AVIF: 13.121 bytes, inclusive quando selecionado no mobile DPR 2; muito abaixo dos 180 KB definidos.

### LCP: pendência e alternativa

A prova visual **não está aprovada tecnicamente para lançamento**: LCP de 2,43 s excede a meta por aproximadamente 432 ms, contra 51 ms na linha de base. Não alterar a meta. O poster é o elemento LCP, tem `fetchPriority=high`, carregamento eager e preload responsivo AVIF. O JS inicial não aumentou; fontes e CSS acrescentam recursos críticos. A inspeção Lighthouse aponta encadeamento de CSS como oportunidade. A imagem já é pequena; reduzir sua qualidade não é a alternativa indicada.

Alternativa para a próxima fase, após revisão desta abertura: consolidar o CSS crítico/fontes da home e reduzir o subset/variação da fonte de corpo, conservando a tipografia aprovada; medir novamente nas mesmas condições e em aparelhos reais. Não afirmar ganho antes de medir. A prova atual preserva a qualidade visual para que o Vitor avalie essa escolha.

O ensaio intermediário (`*-intermediario-*.json`) registrou LCP 2,37 s e boas práticas 96 por prefetch de `/materiais/__next.materiais.__PAGE__.txt`. O export no Windows grava esse segmento sob uma pasta diferente. O novo link da abertura usa navegação HTML nativa e passou com e sem JS. O erro dessa nova ação foi eliminado; o mapa de requisições desktop ainda mostra tentativas de prefetch herdadas da navegação global, também presentes na linha de base. A configuração de export/deploy não foi alterada. Uma medição após o primeiro ajuste deu LCP 2,38 s; a medição final de 2,43 s corresponde à moldura mobile de 260 px e foi mantida sem escolher o melhor resultado.

### Verificação funcional e visual

- Um H1, seis seções existentes na ordem original, configurador e pendências preservados.
- Conteúdo e links de orçamento presentes com JavaScript desativado. Número comercial ainda pendente: o link existente abre a composição genérica do WhatsApp, sem destinatário inventado. Nenhuma mensagem foi enviada.
- CTA mobile de y=339,94 a y=389,13 em viewport de 844 px; título termina em y=254,16. Ambos antes da rolagem.
- Sem overflow horizontal em 390 e 1440 px. Menu abre por Enter, links recebem Tab; skip link seguido do CTA da abertura. Foco visível.
- Movimento reduzido mantém imagem estática; nenhum vídeo ou canvas inicia. A cena 3D existente continua acessível e não foi redesenhada.
- Contrastes teóricos registrados na direção visual; acessibilidade automática 100. Isso não substitui avaliação humana completa ou teste físico.
- Capturas finais inspecionadas em `../proposta/capturas/a1-depois-390.png` e `a1-depois-1440.png`. PNGs exatos em 390 x 844 e 1440 x 900, emulação, DPR 1.

### Seis critérios para o ponto de revisão

1. **Composição e iluminação:** faixa clara editorial e panorama contínuo; luz rasante quente revela a borda.
2. **Aparência e escala dos materiais:** quina próxima, veios finos e textura de pedra; estudo de IA identificado, sem atribuição à JK.
3. **Tipografia e hierarquia:** Instrument Serif no H1 e Instrument Sans no apoio; dois arquivos locais, com licença.
4. **Espaço para conteúdo e orçamento:** CTA primário e Ver materiais separados da foto; campos comerciais pendentes permanecem explícitos.
5. **Adaptação ao celular:** título e CTA antes da imagem, recorte da mesma prova, legenda legível e sem overflow; geração 4:5 reservada.
6. **Movimento principal:** proposta de corte horizontal de 350 ms documentada; nesta prova, imagem estática e apenas hover/foco de 180 ms.

### Como abrir e próximos passos

Da worktree: `npm ci` se necessário, `$env:SITE_MODE='homolog'; npm run build`, depois `node scripts/preview-local.mjs`. Abrir `http://127.0.0.1:3105/`. O servidor escuta somente localhost. Também há portais Maestri "JK A1 desktop" e "JK A1 mobile". Nenhum deploy, SSH ou alteração de infraestrutura.

Parar neste ponto para revisão do Vitor/Planejador. Gasto A1: 2 créditos; saldo consultado após conclusão: 8. Não gerar variações/finais antes da revisão. A inconsistência `nano_banana_pro` no envio/inventário versus `nano_banana_2` em jobs_wait está registrada em `assets-licencas.md`; esclarecer antes de gastar a reserva. Sem nova geração para tentar resolver o metadado.
