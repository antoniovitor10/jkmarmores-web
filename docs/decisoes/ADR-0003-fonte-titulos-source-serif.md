---
id: ADR-0003
titulo: "Títulos em Source Serif 4 no lugar da Bodoni Moda"
status: aceita
data: 2026-11-01
origem: T-0011
substitui: ""
---

# ADR-0003 · Títulos em Source Serif 4 no lugar da Bodoni Moda

## Contexto

Desde a versão 1, os títulos do site usam a Bodoni Moda 400, uma didone de contraste muito alto. Em 31/10/2026 o Vitor disse que a fonte estava "pouco entendível". Nos tamanhos médios (h2 de 36 px, nomes de pedra de 24 px) os traços finos somem, e no fundo branco da versão 2 (ADR-0004) isso piora.

## Decisão

Os títulos passam a usar a Source Serif 4 500, com tamanho óptico. Ela foi escolhida pelo Vitor, vendo a comparação de 5 fontes (opção C).
- O arquivo é o subconjunto latin do Google Fonts (licença OFL, 52 KB), e fica em `public/fonts/source-serif-4-latin.woff2` com a licença ao lado.
- O carregamento é local, por `next/font/local`, com preload. Nada vai ao Google em tempo de execução.
- O `letter-spacing` dos títulos caiu de `-.025em` para `-.01em` (na capa, de `-.035em` para `-.02em`), porque o espaçamento negativo era para a Bodoni.
- O texto corrido continua em Source Sans 3.

## Alternativas consideradas

| Opção | Prós | Contras |
|---|---|---|
| (C) Source Serif 4 (escolhida) | serifada, legível em tamanho médio, tamanho óptico, mesma família de desenho da Source Sans do texto | menos "luxo de revista" que a Bodoni |
| Manter a Bodoni com mais peso ou tamanho | preserva a identidade da versão 1 | os traços finos continuam frágeis no branco |
| Uma sem serifa nos títulos | máxima legibilidade | perde o tom editorial da marca |

## Consequências

- Fica mais fácil: ler títulos médios, nomes de pedra e o telefone grande, no branco e no celular.
- Fica mais difícil: os títulos ocupam um pouco mais de largura. O `e2e/fonte.spec.ts` confere que nenhum estoura.
- Mudou: `src/components/home-fonts.ts`, os pesos e espaçamentos em `globals.css`, `HomeHero.module.css` e `StoneJourney.css`, e a seção Tipografia da skill `design-system`.
