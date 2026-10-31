---
name: design-system
description: Regras visuais aprovadas do site da JK Mármores (versão 1, grafite e pedra quente, aprovada pela cliente e no ar desde 02/10/2026). Leia SEMPRE antes de criar, alterar ou revisar qualquer interface, página, componente, cor, fonte, espaçamento, imagem, movimento ou texto de interface, no desktop e no mobile.
metadata:
  origem: projeto
  versao: "1"
  gerada_por: onboarding (extraída do código da producao, 694cd01)
---

# Design system · JK Mármores (versão 1)

A versão 1 foi aprovada pela cliente como está em produção. Ela pediu só imagens novas. Esta skill descreve o que existe; não é proposta. Ainda não há `DESIGN.md` nem `tokens.css` separados: os tokens estão em `src/app/globals.css`.

## Antes de qualquer interface

1. Abra as capturas da versão aprovada em `docs/auditorias/versao-1/` (`home-390.png`, `home-1440.png`, `jornada-*`, `seletor-*`, `materiais-*`, `sobre-*`, `contato-*`) para a largura em que vai trabalhar.
2. Toda página ou seção nova começa com uma "seção de design" na task: layout no desktop e no mobile, componentes reaproveitados, tokens usados.

## Tokens (os que valem são os do bloco "Versão 1" em `globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--cor-fundo`, `--cor-grafite`, `--cor-papel` | `#10100f` | fundo de tudo (o tema é escuro; `color-scheme: dark`) |
| `--cor-superficie` | `#1a1917` | painéis, fundo do seletor |
| `--cor-texto` | `#eee5dc` | texto principal |
| `--cor-muted` | `#b9aaa0` | texto de apoio |
| `--cor-borda` | `#62564b` | filetes e bordas de 1 px |
| `--cor-destaque` | `#d4b699` | números, datas, lead |
| `--cor-caramelo` | `#c9ab91` | botão, eyebrow, links de destaque |
| `--botao-fundo` / `--botao-texto` | `#c9ab91` / `#151310` | botão principal; hover `#dfc5ad` |
| títulos de destaque | `#dfc5ad` | H1 institucional, H2 da assinatura |
| rodapé | `#080807`, filete `#3a332d` | |
| `--raio` | `0` | nada arredondado (exceto amostras de tom no seletor) |
| `--espaco-secao` | `clamp(80px, 10vw, 144px)` | respiro entre seções |
| `--ease-*`, `--dur-*` | `--dur-press 120ms` … `--dur-focal 1200ms` | todo tempo e curva de movimento |

Hex novo só com motivo no relatório da task; prefira um token existente. Contraste confere com `node metodo/projeto/skills/direcao-visual/scripts/contraste.mjs` ou `scripts/check-contrast.mjs`.

## Tipografia

- Títulos: **Bodoni Moda 400** (`--fonte-display-a1`, `public/fonts/bodoni-latin-400.woff2`), peso único, `letter-spacing: -.025em`, `text-wrap: balance`. H1 `clamp(48px, 6vw, 88px)`; na capa `clamp(56px, 7.4vw, 108px)`.
- Corpo e interface: **Source Sans 3 400** (`--fonte-corpo-a1`), `line-height: 1.65`.
- Eyebrow: 11 px, `letter-spacing .14em`, caixa alta escrita no texto (ex.: "MÁRMORES E GRANITOS / BARUERI, SP").
- Nenhum negrito em título, nenhuma outra família. As fontes Barlow e Instrument Sans em `public/fonts/` são de rodadas anteriores e não entram.
- Carregadas por `next/font/local` em `src/components/home-fonts.ts`, com preload e fallback ajustado. Nada de Google Fonts em runtime.

## Composição

- Editorial: imagem grande, margem larga (`.container` = `min(100% - 80px, 1280px)`), grade de 2 colunas com `gap` 80 a 120 px no desktop, filetes de 1 px em vez de cartões.
- Capa da home: imagem em tela cheia com véu escuro, H1 em duas linhas e um CTA; fecha no monograma JK (máscara SVG) ao rolar (`.prologo`).
- Jornada da pedra: painéis de 88svh com legenda sobre gradiente (`.stone-panel`), índice numerado (`.stone-index`).
- Botão: retangular, `padding 14px 24px`, texto 14 px, com brilho de luz rasante no hover/foco/toque (`grazing-light`).
- Assinatura da marca: monograma JK e a frase da cliente "Onde a matéria-prima encontra a precisão. E o bruto vira arte." (`cliente.assinatura` em `src/content/cliente.ts`; na home em `src/components/StoneEditorial.tsx`, na Sobre em `.brand-statement`), no máximo uma vez por página.

## Mobile obrigatório

- Quebras: 1100, 1000, 800 (menu vira `details` "Menu"/"Fechar"), 700 (uma coluna).
- Capa com H1 e CTA visíveis sem rolar a 390 px; dock fixo do WhatsApp (`.mobile-whatsapp`, caramelo) que some quando outro CTA está na tela ou o menu está aberto.
- Alvos de toque de no mínimo 44 px (`button, a, summary { min-height: 44px }`); campos de formulário 52 px.
- Sem rolagem horizontal em nenhuma largura.

## Movimento

- Um momento orquestrado por página: na home, a passagem de luz na capa, o fechamento no monograma e a jornada com scrub.
- GSAP/ScrollTrigger só depois do pôster e das fontes; não monta com `prefers-reduced-motion`, Save-Data ou rede lenta. `body[data-motion-static]` desliga tudo.
- Hover só em `@media (hover: hover)`, sempre com `:focus-visible` equivalente (contorno `3px #98704d`).

## Imagens

- Todas as atuais são geradas por IA ou CC0. Desde o ADR-0001 elas entram sem aviso de IA; a HU-0001 remove `illustrationNotice` (`src/content/illustration.ts`), `avisoImagem` e os avisos nos `alt` (`src/content/index.ts`). Nenhuma mostra logo, nome de cliente ou obra identificada como da JK (princípio 6). Tratamento uniforme por `scripts/editorial-image.mjs` (saturação 0,86, tom levemente quente nas `sequencia-*`, grão determinístico). Regras de produção na skill `imagens`.

## Voz

- Técnica e acolhedora, trata por "você", sem superlativo vazio ("o melhor", "incrível", "líder"). Texto da cliente é usado como veio, enxugado sem acrescentar fato.
- CTA padrão: "Chamar no WhatsApp".

## Como verificar

- Antes de concluir uma task de interface: skill `responsivo-desktop-mobile` (capturas nas 5 larguras + Lighthouse) e a varredura da `anti-cara-de-ia`.
- Compare com as capturas de `docs/auditorias/versao-1/`. Desvio da versão aprovada é falha, não gosto.

## Mudar a direção

Não mude aqui. Uma mudança de identidade é uma HU de Direção visual (skill `direcao-visual`), com ADR. Trocar imagens dentro da composição atual não é mudança de direção.

## Origem das regras

- `src/app/globals.css` (bloco "Versão 1" e "Rodada 2"), `src/components/HomeHero.module.css`, `src/components/home-fonts.ts`
- `docs/auditorias/versao-1/RELATORIO.md`, `docs/proposta/direcao-premium-2026-09-28.md`, decisão de tom de voz em `docs/ESCOPO.md` (25/09)
- Vitor, 2026-10-20: a cliente aprovou a versão 1 em produção e pediu imagens novas
