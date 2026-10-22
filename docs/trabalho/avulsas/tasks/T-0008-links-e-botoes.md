---
id: T-0008
titulo: "Links e botões visíveis no site"
hu: avulsa
trilha: micro
status: em-revisao
depende_de: []
cobre: []
complexidade: 3
risco: normal
sensivel: false
skills: [design-system, padroes-codigo, responsivo-desktop-mobile, testes]
criada_em: 2026-10-22
ferramenta: "claude-code/opus"
voltas: 1
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 6
testes_pegam: 6
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

### Execução · 2026-10-22

**Branch:** task/T-0008-links-e-botoes (a partir de main, 34bda1b) · **PR:** não aberto (nível 0, sem push)

**O que mudou:**
- **`src/components/IconeWhatsApp.tsx` (novo):** símbolo do WhatsApp em SVG inline, `currentColor`, com `aria-hidden` e `focusable="false"` (ADR-0002).
- **`src/components/PedraCatalogo.tsx`:** o "Chamar no WhatsApp" do cartão vira botão com contorno na largura do cartão, com o ícone à esquerda.
- **`src/components/Institutional.tsx`:** o "Chamar no WhatsApp" do `ContactPanel` vira botão com contorno e ícone.
- **`src/app/page.tsx`:** "Conheça os materiais" vira botão com contorno e seta; "Conheça a JK" fica como link.
- **`src/app/globals.css`:**
  - bloco novo no fim: `a.text-link` em caramelo, sublinhado, 16 px, alvo de 44 px e seta por `::after` com `content: "→" / ""`, que fica fora do nome acessível;
  - `.button-outline` com borda caramelo de 1 px. Com mouse, o hover preenche de caramelo; com teclado, o foco também. No toque, o hover não gruda;
  - o telefone (`a[href^="tel:"]`) fica sem seta;
  - saíram 3 regras antigas que ficaram sem efeito.
- **`e2e/links.spec.ts` (novo).**
- **Fundo, fontes e textos:** não mudaram.

**Verificação (testador):**

| CA | Tipo | Teste / como verifiquei | Pega? | Resultado |
|---|---|---|---|---|
| CA-1 | interacao | `e2e/links.spec.ts` "CA-1": confere a borda caramelo de 1 px e a seta no botão, o link caramelo sublinhado com seta, e toca nos dois, chegando a `/materiais/` e `/sobre/` | sim: com a cor do link trocada no CSS e recompilado, falha | passa (mobile e desktop) |
| CA-2 | interacao | "CA-2": "Explorar todos os materiais", "Conhecer granitos", "Explorar combinações", "Ver todos os materiais", "Trabalhamos com outras pedras…" e "Conheça a JK" da assinatura. Confere caramelo, sublinhado, 16 px, seta e altura ≥ 44 px | sim (mesma prova) | passa |
| CA-3 | interacao | "CA-3": no cartão do Preto São Gabriel, o botão tem contorno caramelo e a largura do cartão, o ícone com `aria-hidden` é o primeiro filho e a mensagem é a da pedra | sim: sem o ícone no código, falha | passa |
| CA-4 | interacao | "CA-4": no painel de contato de `/sobre/`, o botão tem contorno, ícone e link `wa.me` | sim (mesma classe da prova) | passa |
| CA-5 | interacao + integracao | "CA-5": `toHaveAccessibleName` confirma que o nome é o texto, sem seta nem ícone, nos 5 elementos novos. Lighthouse mobile em produção: home e `/materiais/granito/` com Acessibilidade 100, SEO 100 e Boas práticas 100 | sim (nome exato) | passa |
| CA-6 | interacao | "CA-6": navega com Tab até o botão com contorno, o link, o botão do cartão e o do painel. Confere o `outline` sólido de 3 px em todos, e o fundo caramelo no foco do botão com contorno | sim | passa |
| CA-7 | manual | motivo: comparação visual. As capturas em 1440 e 390 mostram fundo, fontes e textos iguais; só links e botões mudam | não se aplica | passa |

**Testes criados ou alterados:** `e2e/links.spec.ts`, com 6 testes por projeto e 12 no total.

**Linha de base:**

| | Antes | Depois |
|---|---|---|
| lint | 0 erros, 2 avisos | igual |
| build | passa | passa |
| e2e | 45 passaram, 1 pulado | 57 passaram, 1 pulado |

**Revisões:**
- **Código:** ajustes na volta 1, todos aplicados:
  - hover só com mouse e foco equivalente;
  - telefone sem seta;
  - testes cobrindo a assinatura, a posição do ícone, o foco de todos os botões e o nome acessível;
  - regras antigas removidas.
- **Segurança:** não aplicável.

**Pendências / sugestões fora do escopo:**
- O peso visual do site (fundo preto e Bodoni) vai para a HU de direção visual.
- A 360 px, o "Chamar no WhatsApp" do cartão quebra em duas linhas, sem transbordar e com alvo ≥ 44 px.

**Proposta para skills do projeto:** registrar na skill `design-system` o padrão novo de link (caramelo, sublinhado, com seta) e o `.button-outline`. Depende do seu "sim".

## Roteiro de homologação

1. `npm run build`, depois `node scripts/preview-local.mjs`, e abrir a home. Em "Conte o que você imagina", "Conheça os materiais" aparece com contorno e seta, e "Conheça a JK" como link sublinhado com seta.
2. Abrir `/materiais/granito/`: cada pedra tem o botão "Chamar no WhatsApp" com o ícone, na largura do cartão.
3. Rolar até "Vamos conversar sobre seu projeto?": o botão do WhatsApp com o ícone.
4. No celular, tocar num botão com contorno: ele não fica preenchido depois do toque.

Resultado: <a marcar por quem homologa>

## Histórico

- 2026-10-22 · criada (backlog) · planejador (entrevista micro com o Vitor)
- 2026-10-22 · backlog → em-desenvolvimento · desenvolvedor · movida no quadro do Batuta
- 2026-10-22 · backlog → em-desenvolvimento · desenvolvedor ("sim" na conversa)
- 2026-10-22 · execução iniciada na branch task/T-0008-links-e-botoes (a partir de main, 34bda1b) · claude-code/opus
- 2026-10-22 · em-desenvolvimento → em-revisao · claude-code/opus · relatório na seção Execução; sem push (autonomia 0)
