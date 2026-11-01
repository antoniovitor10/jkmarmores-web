---
id: T-0012
titulo: "Site principal com fundo branco"
hu: avulsa
trilha: micro
status: em-revisao
depende_de: []
cobre: []
complexidade: 3
risco: alto
sensivel: false
skills: [design-system, padroes-codigo, responsivo-desktop-mobile, testes, deploy]
criada_em: 2026-10-31
ferramenta: "claude-code/opus"
voltas: 1
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 1
testes_pegam: 0
revisao_humana: ""
homologacao: ""
---

# T-0012 · Site principal com fundo branco

## Objetivo

O site oficial (jkmarmores.com.br) passa a ter o fundo branco da prévia `/1`, que foi testada na T-0009. O design system passa a ser a versão 2, branca.

## Contexto

- **Pedido do Vitor (31/10/2026):** "deixa o site em branco o principal".
- **Base:** o tema branco já existe na branch `task/T-0009-previa-fundo-branco` (bloco "T-0009" em `src/app/globals.css`, monograma transparente, `themeColor` branco e `e2e/tema-claro.spec.ts`). Ele está no ar em `/1` desde 31/10 e foi verificado: acessibilidade 100, contraste mínimo de 4,5:1 e testes de interação.
- **Regra que muda (skill `design-system`, versão 1):**
  - Hoje: "Regras visuais aprovadas do site da JK Mármores (versão 1, grafite e pedra quente, aprovada pela cliente e no ar desde 02/10/2026)" e "fundo de tudo `#10100f` (o tema é escuro; `color-scheme: dark`)".
  - Texto novo proposto: "versão 2, fundo branco, aprovada pelo Vitor em 31/10/2026 a partir da prévia `/1` (T-0009, T-0012)", com a tabela de tokens do branco: fundo `#ffffff`, texto `#1f1b18`, caramelo de texto `#7a5c42`, títulos de destaque `#6b4f38`, apoio `#5e554c`, filetes `#d8cfc5`, superfície `#f6f3ef`, botão grafite `#2b2622`, rodapé grafite `#10100f`. A versão 1 escura fica registrada como histórico na skill.
  - ADR-0004 registra a troca de direção visual. (A T-0011, da fonte, reservou o ADR-0003.)
  - Os adaptadores são regerados por `node metodo/nucleo/scripts/gerar-adaptadores.mjs`.
- **Fonte:** fica de fora. A troca da Bodoni pela Source Serif 4 é a T-0011, em outra sessão. As duas mexem em `globals.css`, então a ordem combinada é o branco primeiro e a T-0011 depois, partindo da `main` nova.
- **`/1`:** continua como está, porque fica igual à raiz.

## Arquivos / áreas prováveis

- Mesclar `task/T-0009-previa-fundo-branco` nesta branch. O conflito esperado é só no `INDICE.md`, que é gerado.
- `src/app/globals.css`: tirar do comentário do bloco T-0009 a frase "publicada só em /1; a raiz segue escura".
- `e2e/tema-claro.spec.ts`: o CA-8 (`noindex`) vale só no build de homologação; no de produção, as páginas indexáveis ficam com `index`.
- `metodo/projeto/skills/design-system/SKILL.md`, `docs/decisoes/ADR-0004-site-branco.md` e os adaptadores regerados.

## Insumos

nenhum

## Passos sugeridos

1. Mesclar a T-0009 e resolver o índice.
2. Ajustar o comentário do CSS e o teste do `noindex`.
3. Atualizar a skill `design-system`, escrever o ADR-0004 e regerar os adaptadores.
4. Build de produção, Playwright, lint, capturas e Lighthouse da home e de `/materiais/granito/`.
5. Com o "sim" do Vitor: push na `main`.

## Critérios de aceite

- **CA-1:** Dada qualquer página da raiz, então o fundo é `#ffffff` e o texto é escuro, no desktop e no celular.
- **CA-2:** Dados textos e links, então o contraste é de pelo menos 4,5:1, e o Lighthouse dá 100 em Acessibilidade na home e em `/materiais/granito/`.
- **CA-3:** Dado o cabeçalho, então o logo aparece sem caixa preta.
- **CA-4:** Dado o build de produção, então as páginas indexáveis continuam com `index, follow`, e `check:pendencias` passa.
- **CA-5:** Dada a skill `design-system`, então ela descreve a versão 2 branca, e o ADR-0004 registra a troca.

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-1 | interacao | `tema-claro` CA-1: navega pelo menu nas 7 páginas, em 1440 e 390 |
| CA-2 | integracao | `tema-claro` CA-2 e Lighthouse |
| CA-3 | interacao | `tema-claro` CA-3 |
| CA-4 | integracao | build com `SITE_MODE=producao` e conferência do `meta robots` no ar |
| CA-5 | manual | motivo: é texto de regra; revisão do diff da skill e do ADR |

**Dados e ambiente:** `npm run build` antes; Playwright com `scripts/preview-local.mjs`.

## Fora do escopo

- A fonte (T-0011).
- Mudanças de layout ou de texto.

## Execução

**Branch:** `task/T-0012-site-principal-branco`, no worktree `../jk-t0012`, a partir da `main` (b871a80, que já tem a T-0010). Sem push (autonomia 0). A `main` avança direto, sem conflito, com o push desta branch.

**O que mudou**
- **Mescla da `task/T-0009-previa-fundo-branco`:** traz o bloco do tema branco em `globals.css`, o monograma transparente, o `themeColor` branco, `e2e/tema-claro.spec.ts` e `e2e/links.spec.ts` com as cores novas. O único conflito foi o `INDICE.md`, resolvido regenerando o arquivo.
- **`src/app/globals.css`:** o comentário do bloco não diz mais "publicada só em /1; a raiz segue escura".
- **`e2e/tema-claro.spec.ts`:** o teste do `noindex` agora segue o modo do build. Ele lê o `robots.txt`: em homologação exige `noindex`, em produção exige `index, follow`.
- **`metodo/projeto/skills/design-system/SKILL.md`:** versão 2, com a tabela de tokens do branco, as capturas de referência em `docs/auditorias/versao-2/` e a origem da decisão. Os adaptadores e a linha do `AGENTS.md` foram regerados pelo `gerar-adaptadores.mjs`; fora a skill de design, as outras diferenças eram só de fim de linha.
- **`docs/decisoes/ADR-0004-site-branco.md`:** registra a troca (o ADR-0003 fica reservado para a fonte, na T-0011).
- **`docs/auditorias/versao-2/`:** capturas da primeira tela em 1440 e 390 (home, materiais, granito, sobre e contato).

**Verificação (31/10/2026)**
- `npm run lint`: 0 erros e 2 avisos antigos em `tools/higgsfield/`.
- `SITE_MODE=homolog npm run build` e `npx playwright test --workers=2`: 77 passaram e 3 foram pulados (testes só de celular ou só de desktop). Isso inclui os testes da T-0009 e da T-0010 juntos.
- `MSYS_NO_PATHCONV=1 SITE_MODE=producao npm run build`: ok, com `check-pendencias`, `check-avisos` e `check-pedras` (48 pedras). `tema-claro` e `links` passaram no build de produção (30 passaram e 2 foram pulados), inclusive o `index, follow`.
- Lighthouse no build de produção:
  - Home: 97 no celular e 100 no desktop.
  - `/materiais/granito/`: 94 no celular e 100 no desktop. O LCP de 3,12 s no celular vem da foto do topo, que não mudou.
  - Acessibilidade 100 nas quatro medições.
- Capturas em `qa/capturas/T-0012/`, olhadas no celular: home, granito, quartzito e contato.

| CA | Resultado | Evidência |
|---|---|---|
| CA-1 | ok | `tema-claro` CA-1 nos builds de homologação e de produção |
| CA-2 | ok | `tema-claro` CA-2 e Lighthouse Acessibilidade 100 |
| CA-3 | ok | `tema-claro` CA-3 |
| CA-4 | ok | build de produção com `check-pendencias`; teste de indexação com `index, follow`; conferir no ar depois do push |
| CA-5 | ok | diff da skill `design-system` e o ADR-0004 |

## Histórico

- 2026-10-31 · criada (backlog) · claude-code/opus (pedido do Vitor: "deixa o site em branco o principal")
- 2026-10-31 · backlog → em-desenvolvimento · desenvolvedor ("Aprovo, pode começar" na conversa, incluindo a troca da regra do design system)
- 2026-10-31 · execução iniciada na branch task/T-0012-site-principal-branco (a partir de main, b871a80) · claude-code/opus
- 2026-10-31 · em-desenvolvimento → em-revisao · claude-code/opus · relatório na seção Execução; sem push (autonomia 0)
