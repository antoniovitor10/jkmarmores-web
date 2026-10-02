# Versão 3: verificação preventiva de telas largas

01/10/2026. Site: https://jkmarmores.com.br/3/. Código corrigido: `498e8db`.

Matriz: 1280, 1440, 1680, 1920, 2048 e 2560 px de largura, cada uma com 800, 1000 e 1300 px de altura. Chrome desktop, DPR 1, sem throttling, fontes carregadas.

A capa, seus dois estados intermediários e o monograma foram capturados. A jornada foi percorrida nas quatro etapas e nos três cortes intermediários. A galeria foi percorrida nas seis categorias e, quando horizontal, nas cinco posições entre categorias. Também foram conferidos Sobre Nós da home, seletor, assinatura, contato, rodapé e a página Materiais inteira, incluindo as seis categorias e o fechamento.

## Achado e correção

Não foi reproduzido o título com uma letra por linha. A jornada mantém palavras inteiras e separação entre o título e as legendas em todos os tamanhos, inclusive 2048 e 2560 px.

O título da jornada ocupa uma linha: 437,61 × 56,31 px em largura de 1280, 492,31 × 63,34 px em 1440 e 512,83 × 66 px a partir de 1680. A coluna não encolhe nas telas maiores.

Foi encontrada uma sobreposição diferente na página Materiais: o WhatsApp fixo cobria parte do texto de fechamento em 1280 × 1000, 1440 × 800 e 1440 × 1300. As capturas originais e os achados estão em `capturas/`, `medicoes.json` e `resumo.json`.

O fechamento ganhou a classe `materials-closing-copy`. Em desktop, o texto reserva apenas o espaço que falta no recuo lateral para acomodar os 176 px do WhatsApp, os 24 px da margem e 8 px de separação. Em telas largas com recuo suficiente, o espaço adicional é zero. A regra aplica-se acima de 1100 px. A posição do botão e o conteúdo da cliente permanecem iguais.

## Evidência e limites

O script usa Range por palavra para detectar palavras partidas nos títulos, mede as larguras das colunas e testa interseções entre os fragmentos de texto efetivamente visíveis. Verifica ainda overflow horizontal e erros JavaScript/HTTP. As capturas foram revisadas visualmente nas larguras críticas e nos casos que apontaram sobreposição.

Cada combinação gera 33 ou 38 estados/capturas, totalizando 654 na matriz. A galeria usa o fluxo vertical completo nos viewports de 800 px de altura quando a cópia não cabe no palco; nas alturas de 1000 e 1300 px, usa a rolagem horizontal. O fallback preserva as seis descrições e não é uma coluna colapsada.

As capturas finais estão no [índice depois da correção](depois/index.html); o [índice anterior](index.html) documenta os três achados. Cada miniatura abre a captura na resolução original. `depois/medicoes.json` guarda as medidas por estado e `depois/resumo.json` o resultado consolidado.

A segunda passagem completa na exportação corrigida registrou 18 combinações e 654 capturas, com zero palavras partidas, títulos ou colunas colapsados, interseções indevidas de texto, overflow horizontal ou erros JavaScript/HTTP. A revisão inclui as posições que apresentavam os três achados antes da correção.

Lint e build com `NEXT_PUBLIC_BASE_PATH=/3`, incluindo `check:pendencias` de homologação, passaram. Lint: zero erros e três avisos preexistentes. Nenhum dado da empresa foi acrescentado.

O commit `498e8db` foi enviado à `versao-3`; o [deploy 36947455728](https://github.com/antoniovitor10/jkmarmores-web/actions/runs/36947455728) concluiu com sucesso.

Depois do deploy, a página Materiais foi conferida novamente na URL pública nas 18 combinações: 198 estados/capturas, zero achados e zero erros. A classe e o CSS corrigidos estão presentes na homologação. Evidência em [publico/index.html](publico/index.html) e `publico/resumo.json`.

Para reproduzir: `node docs/auditorias/versao-3/larguras-2026-10-01/auditar.mjs`. `AUDIT_URL` seleciona o servidor e `AUDIT_LABEL` um subdiretório de saída. O navegador é fechado em `finally`.
