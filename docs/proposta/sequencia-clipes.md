# Vídeos independentes por etapa — nova abordagem (e)

27/09/2026. Autorização do Planejador após a rejeição da transição 01→02: gerar um trecho de 3–4 s por quadro, somente com sua imagem inicial, sem imagem final. A rolagem do site faz a passagem entre as etapas; o gerador não precisa transformar uma peça em outra.

Modelo confirmado: `kling-video/v3.0/std/image-to-video`, `duration: 4`, `sound: off`, `cfg_scale: 0.5`, `multi_shots: false`, apenas `image_url`. Preflight autenticado: US$ 0,185 cada, US$ 0,740 para quatro, acumulado planejado US$ 1,649 incluindo todas as provas anteriores. Teto Astra US$ 2,70. Custo efetivo a conferir por Vitor, conforme autorização para seguir pelas estimativas.

Primeiro teste (01) aprovado na inspeção a intervalos de 0,5 s: chapa permanece em pé sobre seus suportes, veios ancorados, câmera se aproxima sem transformar a geometria. Só depois disso foi enviado o 02. Todos os demais trechos também passam por inspeção antes do envio seguinte. A primeira prova rejeitada permanece registrada em `sequencia-video-parada.md` e não será aplicada.

Implementação: cada vídeo dentro de seu próprio `figure`, acompanhando exatamente a opacidade e os pontos de troca já existentes. Tempo local proporcional à rolagem dentro da etapa, seek nos dois sentidos. Carrega a etapa visível e antecipa a próxima perto da transição, após load e pintura do pôster. Mídia não altera título, legenda, 01/04 ou barra de progresso; altura limitada à área da imagem, sem cobrir a legenda HTML.

Máscara PEDRA: mesmo DOM, CSS, textura e fórmulas de escala/opacidade, sem vídeo dentro das letras. Reduced-motion, Save-Data e ação de ver sem movimento mantêm as quatro imagens estáticas; falha individual de mídia conserva o quadro correspondente. Sem sequestro da rolagem, biblioteca ou alteração do configurador.

Mobile 02: derivação por recorte da região aprovada (proporção equivalente a x950/y470/850×1063 do original 2752×1536), afastando o fundo vazio superior e o recorte solto da lateral. Demais trechos mantêm enquadramento responsivo do quadro. Vídeos sem áudio, H.264, faststart, 24 fps e GOP8; limite agregado dos quatro: desktop 8 MB e celular 3 MB.

Os quatro trechos passaram na inspeção: em 02 a quina e a amostra permanecem sobre a mesa; em 03 os veios seguem ancorados durante o deslocamento da câmera; em 04 a peça aplicada continua rígida em relação ao ambiente. Sem rotação autônoma ou transformação perceptível. Quadros em `capturas/jornada-rigida-{1,2,3,4}-quadros.jpg`.

Prompts integrais, parâmetros sem imagem final, quatro request IDs, preços, durações, dimensões, bytes e GOP medidos em [sequencia-clipes-api.json](sequencia-clipes-api.json). O custo acumulado estimado final é **US$ 1,649**, com **US$ 1,051** restantes do teto. Não é uma leitura de saldo financeiro da conta; o débito real é conferido por Vitor. Nenhum crédito MCP gasto nesta rodada.

Os quatro arquivos somam **1.875.503 bytes no desktop** e **1.085.168 bytes no celular**, abaixo dos tetos agregados de 8 MB e 3 MB. Duração individual 4,041667 s, 24 fps, GOP máximo 0,333334 s. A sequência não acrescenta nenhuma requisição de vídeo na carga inicial.

Validação completa: lint/build/check:pendencias homolog; 12 pontos de rolagem em 390/1440; retorno ao primeiro trecho; legenda fora da área do vídeo; fallback sem JavaScript, reduced-motion, Save-Data e botão de ver sem movimento. Eventos atrasados de seek são ignorados após desligar o componente, impedindo reativação de mídia. Máscara comparada pixel a pixel com as capturas anteriores; mesmos DOM/CSS/textos e fórmulas de movimento.

Medições finais e limitações de LCP em [entrega-capa-premium.md](../auditorias/2026-09-27-entrega-capa-premium.md). Capturas de todas as páginas em `capturas/final-*`, pontos da sequência em `capturas/sequencia-final-*`. Nenhuma publicação por Astra.
