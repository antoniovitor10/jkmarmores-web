# Correção urgente: coluna do título na jornada

Homologação: https://jkmarmores.com.br/2/. Alteração limitada ao CSS da jornada. Conteúdo, animações, política de mídia e favicon preservados.

## Causa reproduzida

A coluna ocupava 42% do viewport, com o padding horizontal do contêiner de 1280px aplicado duas vezes. Em 2048×1000 sobravam **92px** para o título; em 2560×1000 a largura de conteúdo chegava a **0px**. A regra global overflow-wrap:break-word fragmentava as palavras, criando uma coluna vertical e invadindo a legenda da etapa. Não havia split de caracteres no código: o título é um único nó de texto.

[Antes em 2048](2048-1000-antes.jpg), [antes em 2560](2560-1000-antes.jpg), [medidas anteriores](antes.json).

## Correção

- Margem externa, largura útil e coluna de leitura agora são medidas distintas. Título e legenda partilham 36% da largura útil, limitada a 1280px. A imagem começa depois dessa coluna e de um intervalo de 64px. A largura do título não depende da altura nem perde espaço para dois paddings externos.
- Coluna com mínimo em ch; título com min-inline-size:12ch, word-break:normal, overflow-wrap:normal, white-space:normal e hyphens:none. Só espaços podem gerar novas linhas; nenhuma animação separa caracteres.
- Até 900px, composição empilhada com uma única coluna explícita. Imagem e legenda ocupam a largura inteira; linhas de grade reservam espaço para a legenda real, inclusive o CTA da quarta etapa. Progresso e legenda têm espaço próprio acima do WhatsApp fixo, respeitando safe-area.

## Matriz verificada

Larguras **390, 768, 1280, 1440, 1680, 1920, 2048 e 2560px**, cada uma em **800, 1000 e 1300px** de altura. Em cada viewport, 18 estados de **0,10 a 0,95**, com passo de 0,05: **432 estados e capturas integrais**. Chrome headless, DPR 1, fontes carregadas, scrub estabilizado antes de cada leitura. São dimensões CSS; não houve teste em monitor/aparelho físico.

[Todas as capturas](CAPTURAS.md), [medidas dos 432 estados](larguras.json), [script reproduzível](qa-larguras.cjs).

Verificações automáticas: cada palavra em uma única linha; título com nó de texto único e sem elementos de caracteres; título dentro de sua coluna; ausência de overflow horizontal; nenhuma interseção entre título, legenda, imagem visível, textos da legenda, progresso ou CTA fixo; título e legenda dentro do viewport. Cada estado foi capturado no tamanho integral e a seleção de telas pequenas, médias e grandes foi conferida visualmente. A revisão visual detectou uma coluna implícita herdada na primeira passada móvel; a grade foi corrigida e os 108 estados de 390/768 foram repetidos com asserts de largura integral. Os 324 estados desktop usam as mesmas regras finais, que não mudaram nessa correção móvel.

Exemplos finais: [390×800, quarta etapa](390-800-0.95.jpg), [768×800, Borda](768-800-0.50.jpg), [1280×1300, Borda](1280-1300-0.50.jpg), [2048×1000, Borda](2048-1000-0.50.jpg), [2560×1300, Borda](2560-1300-0.50.jpg).

Fallbacks reduced-motion e sem JavaScript em 390, 768 e 2560px também mantêm os quatro quadros legíveis e sem overflow: [resultados](fallbacks.json).

Lint sem erros, com duas advertências preexistentes em tools/higgsfield. Build com NEXT_PUBLIC_BASE_PATH=/2 e check:pendencias aprovados para homologação; dados pendentes continuam bloqueando produção. Varredura do export: caminhos próprios com /2/. Sem mudanças em main, workflows, .htaccess ou deploy.

Reprodução: `node docs/auditorias/versao-2/jornada-larguras-2026-10-01/qa-larguras.cjs`. QA_URL, QA_OUTPUT_DIR, QA_WIDTHS e QA_HEIGHTS permitem verificar a URL pública ou uma parte da matriz.
