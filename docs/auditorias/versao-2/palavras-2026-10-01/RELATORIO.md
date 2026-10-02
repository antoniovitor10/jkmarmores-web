# Títulos inteiros em todas as larguras

Versão clara, homologação https://jkmarmores.com.br/2/. Correção de 01/10/2026.

## Causa e correção

A regra global `overflow-wrap:break-word` autorizava a quebra de palavras nos títulos. As grades continuavam em duas colunas até 700 px, e `.split-heading .section-heading` limitava a largura a `20ch` calculados com a fonte do corpo, estreitando o título também no desktop.

Todos os títulos agora usam `overflow-wrap:normal`, `word-break:normal` e `hyphens:manual`. A quebra dentro de palavras fica restrita a e-mails e dados longos explicitamente marcados com `.contact-data`. Os contêineres de títulos usam a largura disponível; as grades têm mínimos em `ch` e empilham até 1024 px. Categorias de materiais ocupam uma coluna inteira nesse intervalo. Navegação, jornada e seletor acompanham o mesmo limite.

Os títulos de páginas e categorias usam `clamp()`, com mínimos que acomodam as palavras mais longas em 320 px. Um espaço entre as linhas da capa preserva também o texto acessível “O bruto vira arte.”. Textos da cliente, papel quente, imagens e animações foram mantidos.

## Varredura automatizada

`qa-palavras.cjs` descobre as 14 páginas exportadas: home, sobre, materiais, seis categorias, aplicações, o fallback de aplicação, galeria, contato e 404. Examina cada uma nas 57 larguras de 320 a 2560 px, em passos de 40, nas alturas de 800 e 1000 px. Acrescenta verificações em 390, 768, 1024 e 1025 px e capturas em 390, 880 e 1440 px.

O teste compara caixas de `Range` por palavra nos títulos, inclusive através de spans, e nos textos e controles comuns. Falha se uma palavra ocupar mais de uma linha, ultrapassar a tela ou a coluna do título, ou se a página apresentar overflow horizontal. Nos títulos, verifica também as três propriedades CSS. URLs e e-mails explicitamente identificados podem quebrar.

A jornada é examinada nos 18 estados entre 0,10 e 0,95 em cada largura e altura: 2.052 estados, com rolagem nativa e o scrub real. Cada tamanho começa com uma visita nova. Além das palavras, o teste verifica colisões entre título, legenda e imagem e a permanência dos textos no viewport.

Resultado final, registrado em `palavras.json`:

```text
RESULTADO: 1632 layouts, 2052 estados da jornada, 1214646 palavras; 0 falhas.
```

São 1.596 layouts da matriz completa e 36 verificações adicionais. As 12 capturas JPG mostram home, materiais, ultracompactos e contato nas três larguras de revisão; a página é percorrida antes da captura para carregar as imagens lazy.

## Verificações complementares

- Build de produção com `NEXT_PUBLIC_BASE_PATH=/2`: aprovado.
- `npm run check:pendencias`: aprovado para homologação.
- `npm run lint`: zero erros; dois avisos existentes em `tools/higgsfield/configurador-r4-layout.mjs` e `configurador-r4-swap.mjs`.
- Caminhos absolutos nos HTML exportados: zero referências sem `/2/`.
- Conteúdo, fontes, SEO, navegação e axe: 24 cenários aprovados, incluindo páginas sem JavaScript (`regressao-conteudo.json`).
- Capa, contraste, favicon e animações: aprovados em celular e desktop. Cache sem `navigator.connection`, TTFB alto, Save-Data e 3G preservam as transições; reduced-motion permanece estático (`regressao-galeria.json`).

## Reproduzir

Na raiz da worktree, com o preview do export disponível em `http://127.0.0.1:3102/2/`:

```powershell
node docs/auditorias/versao-2/palavras-2026-10-01/qa-palavras.cjs
```

`QA_URL`, `QA_OUTPUT_DIR` e `PLAYWRIGHT_MODULE` permitem trocar URL, diretório de artefatos e instalação do Playwright. `QA_WIDTHS` serve para diagnóstico parcial; o resultado acima usa a matriz completa padrão. O script fecha os navegadores e retorna código diferente de zero se encontrar qualquer falha.
