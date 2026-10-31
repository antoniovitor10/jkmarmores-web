---
id: T-0012
titulo: "Site principal com fundo branco"
hu: avulsa
trilha: micro
status: backlog
depende_de: []
cobre: []
complexidade: 3
risco: alto
sensivel: false
skills: [design-system, padroes-codigo, responsivo-desktop-mobile, testes, deploy]
criada_em: 2026-10-31
ferramenta: "claude-code/opus"
voltas: 0
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 0
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

## Histórico

- 2026-10-31 · criada (backlog) · claude-code/opus (pedido do Vitor: "deixa o site em branco o principal")
