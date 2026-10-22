---
id: T-0008
titulo: "Links e botões visíveis no site"
hu: avulsa
trilha: micro
status: backlog
depende_de: []
cobre: []
complexidade: 3
risco: normal
sensivel: false
skills: [design-system, padroes-codigo, responsivo-desktop-mobile, testes]
criada_em: 2026-10-22
ferramenta: ""
voltas: null
bloqueios: null
ca_nao_verificados: null
testes_criados: null
testes_pegam: null
revisao_humana: ""
homologacao: ""
---

# T-0008 · Links e botões visíveis no site

## Objetivo

Os links e o "Chamar no WhatsApp" do site passam a parecer clicáveis: botão com contorno onde há ação principal, link caramelo sublinhado com seta nos demais, e o ícone do WhatsApp nos botões de WhatsApp dos cartões e do painel de contato.

## Contexto

- Depois da publicação da HU-0001 (22/10/2026), o Vitor achou os links "muito ruins": hoje todos usam `.text-link` (`src/app/globals.css`), texto de 14 px, sem sublinhado e da mesma cor do texto (12 px no celular em `.actions`). Exemplo: "Conheça os materiais / Conheça a JK" na home (`src/app/page.tsx`, seção `.request-story .actions`).
- **Decisões do Vitor (entrevista de 22/10, 1 rodada):**
  - **Par de links lado a lado:** o primeiro vira botão com contorno (borda caramelo de 1 px, sem fundo, texto claro) e o segundo fica como link caramelo sublinhado. Os dois levam a seta "→".
  - **Link isolado:** link caramelo sublinhado com seta "→".
  - **"Chamar no WhatsApp" do cartão de pedra:** botão com contorno na largura do cartão, com o ícone do WhatsApp.
- **ADR-0002 e princípio 5:** o ícone do WhatsApp pode aparecer nos botões que abrem o WhatsApp. Ele é SVG inline monocromático (`currentColor`) com `aria-hidden="true"`; o nome acessível continua sendo o texto. Nenhum outro ícone, nenhum emoji.
- **Fora desta task:** o fundo escuro e a tipografia (Bodoni). O Vitor acha o site pesado, e isso vai para uma HU de direção visual própria.
- **Design system (versão 1):** só tokens de `globals.css` (`--cor-caramelo #c9ab91`, `--cor-texto`, `--cor-borda`), nada arredondado, alvos de toque de 44 px, foco visível (`outline 3px #98704d`), hover só com `@media (hover: hover)`.

**Onde está cada link (levantamento de 22/10):**

| Lugar | Hoje | Vira |
|---|---|---|
| Home, "Conte o que você imagina" (`src/app/page.tsx`): "Conheça os materiais" e "Conheça a JK" | 2 links soltos | botão com contorno e link com seta |
| Home, materiais (`src/app/page.tsx`): "Explorar todos os materiais" | `.text-link` | link com seta |
| Home, assinatura (`src/components/StoneEditorial.tsx`): "Conheça a JK" | `.text-link` | link com seta |
| `/materiais/` e home, cartões de categoria (`MaterialCollection.tsx`): "Conhecer …" | `.text-link` | link com seta |
| `/materiais/`, fechamento (`src/app/materiais/page.tsx`): "Explorar combinações" | `.text-link` | link com seta |
| Página da categoria (`src/app/materiais/[slug]/page.tsx`): "Ver todos os materiais" | `.text-link` ao lado do botão | link com seta |
| Cartão de pedra (`PedraCatalogo.tsx`): "Chamar no WhatsApp" | `.text-link` | botão com contorno, largura do cartão, ícone do WhatsApp |
| Fim da lista de pedras (`PedraCatalogo.tsx`): "Trabalhamos com outras pedras…" | link caramelo sublinhado | link com seta |
| Painel de contato (`Institutional.tsx` `ContactPanel`): "Chamar no WhatsApp" | `.text-link` | botão com contorno e ícone do WhatsApp |

## Arquivos / áreas prováveis

- `src/app/globals.css`: `.text-link` (caramelo, sublinhado, 16 px, seta por `::after`), classe nova de botão com contorno (`.button-outline`), regras de `.actions` no celular.
- `src/components/IconeWhatsApp.tsx` (novo): SVG inline com `aria-hidden`.
- `src/components/PedraCatalogo.tsx`, `src/components/Institutional.tsx` (`ContactPanel`), `src/app/page.tsx`.
- `e2e/links.spec.ts` (novo).

## Insumos

nenhum

## Passos sugeridos

1. Estilo único de `.text-link` com seta em `::after` (não no texto, para o nome acessível não mudar) e `text-decoration: underline`.
2. `.button-outline`: borda caramelo de 1 px, fundo transparente, texto `--cor-texto`, hover e foco com fundo caramelo leve.
3. Aplicar nos lugares da tabela, mantendo os textos.
4. `IconeWhatsApp` nos dois botões de WhatsApp listados.
5. Testes, capturas nas 5 larguras e Lighthouse (home e `/materiais/granito/`).

## Critérios de aceite

- **CA-1:** Dada a home, então "Conheça os materiais" é um botão com contorno caramelo e "Conheça a JK" é um link caramelo sublinhado, os dois com a seta "→", levando a `/materiais/` e `/sobre/`.
- **CA-2:** Dado qualquer link de navegação da tabela, então ele aparece em caramelo, sublinhado, com seta e alvo de 44 px, em todas as larguras.
- **CA-3:** Dado o cartão de uma pedra, então "Chamar no WhatsApp" é um botão com contorno na largura do cartão, com o ícone do WhatsApp à esquerda do texto, e o link continua com a mensagem da pedra.
- **CA-4:** Dado o painel de contato, então "Chamar no WhatsApp" é um botão com contorno e o ícone do WhatsApp.
- **CA-5:** Dado o leitor de tela, então o nome dos links e botões continua igual ao texto (o ícone e a seta não entram no nome), e o Lighthouse mobile segue com 100 em Acessibilidade na home e em `/materiais/granito/`.
- **CA-6:** Dado o teclado, então cada link e botão novo tem foco visível.
- **CA-7:** Dado o resto do site, então fundo, fontes e textos não mudam.

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-1 | interacao | Playwright abre a home, encontra os dois pelo nome, confere classe/estilo (borda caramelo no botão, sublinhado no link), a seta no `::after` e toca em cada um, chegando a `/materiais/` e `/sobre/` |
| CA-2 | interacao | para cada link da tabela, confere `text-decoration` sublinhado, cor caramelo, seta e altura ≥ 44 px, no desktop e no celular |
| CA-3 | interacao | abre `/materiais/granito/`, confere o botão com contorno na largura do cartão, o `svg[aria-hidden]` e o `href` com a mensagem da pedra |
| CA-4 | interacao | rola até o painel de contato e confere o botão com o ícone |
| CA-5 | integracao | nome acessível pelo `getByRole` igual ao texto; Lighthouse mobile da home e do granito |
| CA-6 | interacao | navega com Tab até os links novos e confere o `outline` de foco |
| CA-7 | manual | motivo: comparação visual das capturas antes e depois; a mudança é só de estilo de link |

**Dados e ambiente:** `npm run build` antes; Playwright com `scripts/preview-local.mjs` na porta 3105.

## Fora do escopo

- Cor de fundo, tipografia e direção visual (HU própria).
- Textos dos links.
- Ícones em qualquer outro lugar.

## Diagnóstico

## Bloqueios

## Handoff

## Execução

## Roteiro de homologação

## Histórico

- 2026-10-22 · criada (backlog) · planejador (entrevista micro com o Vitor)
