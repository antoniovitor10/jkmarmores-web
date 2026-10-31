---
name: design-system
description: Regras visuais aprovadas do site da JK Mármores (versão 2, fundo branco com pedra quente e rodapé grafite, aprovada pelo Vitor e no ar desde 31/10/2026; a versão 1 escura fica como histórico). Leia SEMPRE antes de criar, alterar ou revisar qualquer interface, página, componente, cor, fonte, espaçamento, imagem, movimento ou texto de interface, no desktop e no mobile.
metadata:
  origem: projeto
  versao: "2"
  gerada_por: onboarding (extraída do código da producao, 694cd01); versão 2 pela T-0012 (ADR-0004)
---

# Design system · JK Mármores (versão 2, branca)

A versão 2 é a versão 1 (aprovada pela cliente em 07/10/2026) com fundo branco: mesma composição, tipografia, movimento e imagens, com as cores trocadas. Ela foi testada como prévia em `/1` (T-0009) e passou para o site principal por decisão do Vitor em 31/10/2026 (T-0012, ADR-0004). Esta skill descreve o que existe; não é proposta. Ainda não há `DESIGN.md` nem `tokens.css` separados: os tokens estão em `src/app/globals.css`.

## Antes de qualquer interface

1. Abra as capturas da versão aprovada em `docs/auditorias/versao-2/` (home, materiais, granito, sobre e contato em 1440 e 390) para a largura em que vai trabalhar. As de `docs/auditorias/versao-1/` mostram a composição, que não mudou, no tema escuro antigo.
2. Toda página ou seção nova começa com uma "seção de design" na task: layout no desktop e no mobile, componentes reaproveitados, tokens usados.

## Tokens (os que valem são os do bloco "T-0009 e T-0012", no fim de `globals.css`, que sobrepõe o bloco "Versão 1")

| Token | Valor | Uso |
|---|---|---|
| `--cor-fundo`, `--cor-papel` | `#ffffff` | fundo de tudo (o tema é claro; `color-scheme: light`; `themeColor` `#ffffff`) |
| `--cor-superficie` | `#f6f3ef` | painéis, fundo do seletor, chamada final da home |
| `--cor-texto` | `#1f1b18` | texto principal (17,1:1) |
| `--cor-muted` | `#5e554c` | texto de apoio (7,3:1) |
| `--cor-borda` | `#d8cfc5` | filetes de 1 px (não é texto) |
| `--cor-borda-controle` | `#8c7a66` | borda dos botões do seletor, do menu e dos campos (4,1:1) |
| `--cor-destaque`, `--cor-caramelo` | `#7a5c42` | números, datas, links e eyebrow (6,1:1); o caramelo claro `#c9ab91` tem 2,2:1 no branco e não serve para texto |
| `--cor-titulo-destaque` | `#6b4f38` | H1 institucional, H2 da assinatura e da chamada final (7,5:1) |
| `--cor-grafite`, `--botao-fundo` / `--botao-texto` | `#2b2622` / `#ffffff` | botão principal (15:1); hover `#4a3f35` |
| botão com contorno | borda `#7a5c42`; hover e foco preenchem de grafite com texto branco | |
| rodapé | `#10100f`, com os tokens da versão 1 (texto `#eee5dc`, caramelo `#c9ab91`) e o logo original | fechamento grafite da página |
| botão flutuante do WhatsApp | `#c9ab91` com texto `#151310` | igual nas duas versões |
| texto sobre foto | claro (`#eee5dc`, `#f1e8df`) sobre o escurecimento | capa da home e painéis da jornada |
| logo do cabeçalho | `public/brand/jk-monograma-240-transparente.webp` | derivado do monograma da cliente sem o fundo preto (`scripts/logo-transparente.mjs`) |
| `--raio` | `0` | nada arredondado (exceto amostras de tom no seletor) |
| `--espaco-secao` | `clamp(80px, 10vw, 144px)` | respiro entre seções |
| `--ease-*`, `--dur-*` | `--dur-press 120ms` … `--dur-focal 1200ms` | todo tempo e curva de movimento |

A capa da home fecha no monograma sobre o branco (`.hero-mask > rect`), e a base da foto não termina mais em grafite sólido.

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
- Compare com as capturas de `docs/auditorias/versao-2/`. Desvio da versão aprovada é falha, não gosto.

## Mudar a direção

Não mude aqui. Uma mudança de identidade é uma HU de Direção visual (skill `direcao-visual`), com ADR. Trocar imagens dentro da composição atual não é mudança de direção. A troca do fundo escuro pelo branco (ADR-0004) foi decisão direta do Vitor, testada antes como prévia em `/1`.

## Origem das regras

- `src/app/globals.css` (blocos "Versão 1", "Rodada 2" e "T-0009 e T-0012"), `src/components/HomeHero.module.css`, `src/components/home-fonts.ts`
- `docs/auditorias/versao-1/RELATORIO.md`, `docs/proposta/direcao-premium-2026-09-28.md`, decisão de tom de voz em `docs/ESCOPO.md` (25/09)
- Vitor, 2026-10-20: a cliente aprovou a versão 1 em produção e pediu imagens novas
- Juliana, 28/10/2026: pediu para ver o site com fundo branco; prévia em `/1` (T-0009)
- Vitor, 2026-10-31: "deixa o site em branco o principal" (T-0012, ADR-0004)
