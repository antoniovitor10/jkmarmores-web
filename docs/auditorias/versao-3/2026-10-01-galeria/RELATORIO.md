# Versão 3: rede, estabilidade mobile e favicon

01/10/2026. Branch `versao-3`, URL https://jkmarmores.com.br/3/.
Rede: `c1f86dc`. Merge dos favicons da main: `45e1db2`, incorporando `068146d`. Correção da galeria: `1b10ac8`.

## Diagnóstico e correção

Com Chrome mobile 390 × 844, toque nativo via `Input.dispatchTouchEvent` e CPU 4x, mudar a altura para 760 px durante o gesto deslocava a posição absoluta da galeria em 323,39 px. O palco preso por transform ficava até 323,89 px fora da posição esperada. A diferença corresponde à mudança de altura da capa e da jornada anteriores: 84 × (1,6 + 2,25) = 323,4 px.

`ignoreMobileResize` já estava ativo, mas não estabilizava a geometria CSS. Não havia scroll-snap nem scroll suave concorrendo com a animação. Havia uma imagem ainda não carregada durante o percurso.

O palco agora usa `position:sticky;top:0`, sem pin, spacer ou compensação vertical via JavaScript. ScrollTrigger move somente o trilho em `x`, com `force3D`, easing linear e scrub de 0,35 s. `will-change:transform` existe somente durante o trecho ativo.

A altura inicial em `100svh` é preservada para a sequência mobile. Resize apenas vertical não remonta as animações nem atualiza a distância percorrida. Mudança de largura/orientação remonta e mede novamente; desktop continua respondendo a largura e altura. O refresh automático não observa resize, que passa pelo filtro explícito. Reduced-motion limpa os efeitos e a variável de altura.

Um IntersectionObserver prepara as imagens da galeria quando a seção chega a 1,2 viewport: ativa eager somente nessas imagens e chama `img.decode()`. A decodificação não bloqueia a interação nem determina se as transições funcionam. As seis imagens responderam com variantes próprias para a largura mobile.

O percurso curto anterior permanece: 1.393 px em 390 × 844, com entrada e saída naturais. Todas as categorias continuam acessíveis por teclado. Quando os textos não cabem no viewport, a leitura vertical completa permanece disponível.

## Rede e acessibilidade do movimento

A política de rede deixou de decidir sobre CSS, GSAP ou o fade do seletor. Apenas `prefers-reduced-motion:reduce` desliga esses efeitos. Save-Data, 3G, ausência de `navigator.connection`, transferência zero em cache e TTFB alto mantêm pôsteres e transições. Esta versão utiliza imagens; nenhum elemento ou pedido de vídeo foi criado.

O teste de ausência de Connection API e cache quente emula o caso Firefox/Safari no Chromium; não é uma execução nesses navegadores. A navegação atrasada em 1 s foi medida entre 1.046 e 1.064 ms na URL pública, mantendo capa, jornada e galeria em movimento. Os sete cenários de rede passaram em 390 e 1440 px, com movimento estático apenas no cenário reduced-motion.

## Medição local do gesto

Chrome headless, DPR 1, CPU 4x, sem throttling de rede. O trace final foi gravado isoladamente, após encerrar os outros testes. Inclui seis gestos para frente, entrada, saída e um gesto de retorno; a altura muda de 844 para 760 e volta para 844 durante o toque. O registro anterior contém os quatro gestos iniciais com as mesmas mudanças de altura.

| Medida | Antes | Depois |
|---|---:|---:|
| Desvio vertical máximo no trecho ativo | 323,89 px | 0 px |
| Variação da posição absoluta da seção | 323,39 px | 0 px |
| Desvio máximo incluindo entrada/saída | Não avaliado | 0 px |
| Intervalo entre quadros, P95 | 13,9 ms | 13,8 ms |
| Tarefas longas durante o gesto | 0 | 0 |
| CLS durante o gesto | Não avaliado | 0 |
| Imagens carregadas/decodificadas | 5/6 carregadas | 6/6 decodificadas |

Os JSON de quadros guardam posição, scroll, transform e timestamp por frame. Os traces compactados podem ser descompactados para abertura no painel Performance do Chrome. Não houve reversão horizontal inesperada durante avanço, erro JavaScript ou overflow.

Na URL pública, o mesmo teste registrou 1.005 quadros, 815 no trecho ativo, P95 de 13,9 ms, desvio de entrada/saída de 0 px, posição da seção estável e CLS 0. Houve uma tarefa de 71 ms, com atualização de estilo/layout ao final do percurso; o maior intervalo observado foi 76,3 ms. Não houve salto de posição, inclusive nessa tarefa. Estas são medições instrumentadas em Chromium com emulação mobile, não uma validação em aparelho físico iOS/Android.

## Regressão e favicon

Lint: zero erros, três avisos preexistentes. Build `NEXT_PUBLIC_BASE_PATH=/3` e `check:pendencias` passaram em homologação. Os dados ainda não confirmados permanecem em `pendente()`; nenhum fato da empresa foi acrescentado.

390 e 1440 px: quatro etapas da jornada, seis categorias, seis combinações do seletor, gesto vertical, links, canonical e JSON-LD verificados. CLS 0 nos dois tamanhos; resposta máxima de evento 32 ms mobile e 40 ms desktop. O custo de entrada completo ainda excede a meta de 150 ms: 249 e 276 ms nesta bateria, que não foi usada para medir o trace isolado.

320 × 740 e 1024 × 768 mantêm galeria vertical; 390 × 740, 390 × 844, 768 × 1024 e 1440 × 900 mantêm a jornada horizontal. Foco alcança as seis categorias sem scroll interno. Passaram erro de imagem com nova tentativa, escolhas rápidas e fechamento/restauração de foco do menu. Rotação e alteração de reduced-motion durante a sessão também passaram.

O merge preservou os metadados e layout da versão 3 e removeu `icons:{icon:"data:,"}`. No HTML exportado há `rel="icon"` para `/3/icon.png?icon.2ndbqcj82s9k4.png` e `rel="apple-touch-icon"` para `/3/apple-icon.png?apple-icon.0bqrf_q30immg.png`.

O deploy de `1b10ac8` [concluiu com sucesso](https://github.com/antoniovitor10/jkmarmores-web/actions/runs/36873548968). Ambos os ícones responderam HTTP 200, `image/png`, na URL pública. Lighthouse de acessibilidade: 100 na home e nas páginas Sobre Nós, Materiais, Aplicações, Galeria e Contato; capturas de desktop dessas páginas sem overflow.

## Artefatos e reprodução

- `antes-*`: reprodução do defeito, quadros e trace.
- `depois-*`: gesto local corrigido, com trace e teste de rotação/reduced-motion.
- `publico-*`: verificação após o deploy.
- `../rodada-2/funcional.json` e `edge.json`: regressão de conteúdo, teclado, seletor e tamanhos.
- `../rodada-2/390-*.png` e `1440-*.png`: capturas atualizadas de mobile e desktop.

Com o preview da exportação em `http://127.0.0.1:3108/3/`, executar `node scripts/audit-version3-gallery-touch.mjs`. Para a URL publicada, definir `AUDIT_URL=https://jkmarmores.com.br/3/` e `AUDIT_LABEL=publico`. O script sempre encerra o navegador em `finally`.
