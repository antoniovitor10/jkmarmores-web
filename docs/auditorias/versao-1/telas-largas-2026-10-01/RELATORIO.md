# Versão 1 — verificação preventiva de telas largas

01/10/2026. Branch versao-1. Homologação: https://jkmarmores.com.br/1/.
Base: 4e1feecebe9aaa9542106353477bbc00a8bdf5fe, com a correção do botão flutuante incluída nesta entrega.

## Escopo e método

Chrome headless, escala de pixels 1, export estático local servido em /1/. Larguras 1280, 1440, 1680, 1920, 2048 e 2560 px, cada uma com alturas 800, 1000 e 1300 px. Fontes e imagens carregadas antes das capturas. A conexão foi identificada como 4g para garantir a execução dos efeitos, sem depender da estimativa inicial do navegador.

Por combinação: cinco posições da capa/monograma, assinatura, título da jornada, cinco posições em cada um dos quatro painéis, materiais, configurador e suas escolhas, etapas do pedido, orçamento, contato e rodapé. Varredura de volta pela home em intervalos de 42% da altura da tela; varredura completa de Galeria, Materiais, Sobre, Contato e Aplicações. Redimensionamento real no monograma, além dos carregamentos independentes.

O script mede fragmentos de palavras, interseções entre os textos visíveis, largura das colunas, overflow horizontal e oclusão pelo WhatsApp. A checagem considera o recorte dos títulos animados e descarta conteúdo invisível. As capturas complementam as medidas; não são uma simulação de todas as posições possíveis do scroll.

## Problema encontrado e correção

O título da jornada não apresentou o problema de uma letra por linha. Foi encontrado outro problema em 1280 px: o botão flutuante cobria títulos ou descrições dos materiais, controles e texto do configurador. Na verificação da correção, a mesma situação apareceu na lista da área atendida em Contato.

src/components/site-interactions.ts:44 — o botão agora se oculta quando textos ou controles entram no canto que ele ocupa e reaparece quando há espaço. A área observada tem 224 × 112 px, com margem em relação ao botão. Um IntersectionObserver acompanha o canto; não há leituras de layout no evento de scroll. A observação é refeita no resize e encerrada no cleanup. O atributo inert acompanha a visibilidade para preservar a navegação por teclado. A proteção atende também o celular.

[Antes nos materiais](antes-1280x1000-materiais-home.jpg) e [depois](1280x1000-materiais-home.jpg). [Antes no configurador](antes-1280x800-configurador.jpg) e [depois](1280x800-configurador.jpg).

## Resultados

18 combinações aprovadas: 1.746 amostras de layout, 432 capturas e nenhum erro de JavaScript. Nenhuma palavra partida, interseção entre textos visíveis, coluna abaixo de 140 px ou overflow horizontal. A sobreposição do WhatsApp foi eliminada nos pontos verificados. O título da jornada permaneceu em uma linha nas 18 combinações.

| Largura | Amostras em 800 px | Em 1000 px | Em 1300 px | Caixa do título da jornada | Falhas |
|---:|---:|---:|---:|---|---:|
| 1280 | 105 | 95 | 84 | 478 × 56 | 0 |
| 1440 | 108 | 96 | 86 | 538 × 63 | 0 |
| 1680 | 108 | 98 | 87 | 560 × 66 | 0 |
| 1920 | 108 | 98 | 87 | 560 × 66 | 0 |
| 2048 | 108 | 98 | 87 | 560 × 66 | 0 |
| 2560 | 108 | 98 | 87 | 560 × 66 | 0 |

[Índice de 432 capturas](capturas.html), com filtro por dimensão e abertura no tamanho original. [Resultados completos](resultados.json). [Registro anterior à correção](antes.json): 47 posições com sobreposição em 1280 px, nas três alturas.

SHA256 do arquivo de interação verificado: 6d43687d0938b2f6be3972fba23a571fc557d1b1806e2f40b1265b6e2422413e.

Galeria continua como página de conteúdo pendente, sem obras ou fotos reais inventadas. O layout dessa página foi verificado; isso não substitui a aprovação do acervo da cliente.

## Regressão e verificações de publicação

Emulação de 390 × 844 px com touch e 1440 × 900 px, CPU 4x. Nenhum texto coberto nos pontos verificados; botão acessível pelo teclado quando visível e inert quando oculto. Seletor funcionando por toque e clique, brilho de toque concluído e limpo, reduced-motion revertendo a jornada. Axe WCAG A/AA sem violações nas duas dimensões. Dados em regressao.json.

Durante o gesto contínuo da capa até a jornada: nenhuma long task e nenhum intervalo entre frames acima de 50 ms. Máximos observados: 13,7 ms no celular e 27,8 ms no desktop. São medidas de emulação, sem aparelho físico. A primeira carga em CPU 4x registrou uma tarefa de 313 ms no celular e 99 ms no desktop. Três repetições com trace e cache HTTP desativado registraram máximos de 204,9, 152,3 e 145,5 ms, associados à execução dos chunks de Next/React, GSAP e ao layout. Dados em entrada.json. A meta de nenhuma tarefa de entrada acima de 150 ms não foi atingida consistentemente nesta emulação; permanece como ponto de otimização. As métricas Lighthouse anteriores não foram apresentadas como uma nova medição desta entrega.

Lint passou, com os dois avisos antigos dos scripts de Higgsfield. Build com NEXT_PUBLIC_BASE_PATH=/1 e SITE_MODE=homolog passou. check:pendencias passou no modo de homologação, mantendo os dados ainda não confirmados. As 16 páginas HTML exportadas preservam /1/ nos atributos href, src e poster; todas incluem icon.png e apple-icon.png com /1/, sem o antigo ícone data: vazio.
