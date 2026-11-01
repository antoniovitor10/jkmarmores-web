---
id: T-0011
titulo: "Fonte dos títulos: Source Serif 4 no lugar da Bodoni Moda"
hu: avulsa
trilha: micro
status: em-revisao
depende_de: []
cobre: []
complexidade: 3
risco: normal
sensivel: false
skills: [design-system, padroes-codigo, responsivo-desktop-mobile, testes, deploy]
criada_em: 2026-10-31
ferramenta: "claude-code/opus"
voltas: 1
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 4
testes_pegam: 0
revisao_humana: ""
homologacao: ""
---

# T-0011 · Fonte dos títulos: Source Serif 4 no lugar da Bodoni Moda

## Objetivo

Os títulos do site ficam fáceis de ler: a Bodoni Moda sai e entra a Source Serif 4 (peso 500, com tamanho óptico), na raiz e em `/1`.

## Contexto

- **Pedido do Vitor (31/10/2026):** "essa fonte usada em todo o site tá pouco entendível, melhora ela usa outra".
- **Diagnóstico:** a Bodoni Moda 400 tem contraste muito alto. Os traços finos somem nos tamanhos médios (h2 de 36 px, nomes de pedra de 24 px) e no fundo branco. Veja a comparação em `qa/comparacao-fontes.png` (fora do git).
- **Decisões do Vitor (31/10/2026, 1 rodada, vendo a comparação A a E):**
  - **Fonte:** Source Serif 4 (opção C).
  - **Onde:** raiz e `/1`. Desde 31/10/2026 as duas são brancas (T-0012, design system versão 2, ADR-0004).
  - **Texto corrido:** fica a Source Sans 3, como está.
- **Regra que muda (skill `design-system`, versão 2, linha dos títulos):**
  - Hoje: "Títulos: **Bodoni Moda 400** (`--fonte-display-a1`, `public/fonts/bodoni-latin-400.woff2`), peso único, `letter-spacing: -.025em`, `text-wrap: balance`."
  - Texto novo proposto: "Títulos: Source Serif 4 500 com tamanho óptico (`--fonte-display-a1`, `public/fonts/source-serif-4-latin.woff2`). Nenhuma outra família. A Bodoni Moda saiu em 31/10/2026 (T-0011, ADR-0003) por legibilidade."
  - O ADR-0003 registra a troca. A skill `design-system` é atualizada, e os adaptadores são regerados por `gerar-adaptadores.mjs`.
- **Arquivo de fonte (precisa do ok para baixar):**
  - Fonte: Google Fonts, `fonts.gstatic.com`, licença OFL.
  - Arquivo: Source Serif 4, subconjunto latin, eixos opsz e wght, woff2, em torno de 50 a 90 KB.
  - Fica em `public/fonts/source-serif-4-latin.woff2`, com o `OFL-SourceSerif4.txt` ao lado. O arquivo é servido localmente por `next/font/local`; nada de Google Fonts em tempo de execução.
- **Ajustes prováveis:**
  - O `letter-spacing: -.025em` dos títulos foi pensado para a Bodoni e deve cair para algo como `-.01em`.
  - Os tamanhos dos títulos podem precisar de ajuste fino, porque a Source Serif é mais larga.
  - Conferir quebras de linha na capa, nos cartões de pedra e no menu do celular.

## Arquivos / áreas prováveis

- `src/components/home-fonts.ts`: `homeDisplay` aponta para o arquivo novo (com `weight` e `adjustFontFallback`).
- `src/app/globals.css`: `letter-spacing` e tamanhos dos títulos, se precisar.
- `src/components/HomeHero.module.css`: h1 da capa.
- `public/fonts/`: o woff2 novo e a licença.
- `docs/decisoes/ADR-0003-fonte-titulos-source-serif.md` (novo) e `metodo/projeto/skills/design-system/SKILL.md`.
- `e2e/`: teste da fonte nos títulos.

## Insumos

nenhum

## Passos sugeridos

1. Branch `task/T-0011-fonte-titulos-source-serif` a partir da `origin/main` (9e2c77f, com T-0010 e T-0012). A `main` local está atrasada em cf105f4.
2. Baixar o woff2 e a licença (com o ok do Vitor) e trocar em `home-fonts.ts`.
3. Ajustar o espaçamento das letras e os tamanhos; conferir as quebras de linha em 1440, 768 e 390.
4. ADR-0003 e skill `design-system`.
5. Testes, capturas e Lighthouse (home e `/materiais/granito/`): LCP e CLS não podem piorar.
6. Com o "sim" do Vitor: merge e push na `main` e na `versao-1`.

## Critérios de aceite

- **CA-1:** Dado qualquer título (h1, h2, h3, nome de pedra, chamada), então a fonte usada é a Source Serif 4, na raiz e em `/1`.
- **CA-2:** Dado o texto corrido, então ele continua em Source Sans 3.
- **CA-3:** Dada a capa e os cartões, no desktop e no celular, então nenhum título estoura a largura nem quebra uma palavra.
- **CA-4:** Dado o Lighthouse mobile da home e do granito, então o CLS continua 0 e o LCP não piora mais que 0,2 s em relação à `main` atual (9e2c77f).
- **CA-5:** Dado o HTML publicado, então nenhuma requisição vai a `fonts.googleapis.com` ou `fonts.gstatic.com`.

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-1 | interacao | Playwright navega pelo menu por 4 páginas e confere `font-family` computada de h1, h2 e h3 e `document.fonts.check` da Source Serif |
| CA-2 | interacao | confere `font-family` do parágrafo |
| CA-3 | interacao | em 390 e 1440, confere que `scrollWidth` dos títulos não passa da largura do contêiner |
| CA-4 | integracao | Lighthouse mobile da home e do granito |
| CA-5 | integracao | Playwright registra as requisições da home e falha se houver domínio do Google Fonts |

**Dados e ambiente:** `npm run build` antes; Playwright com `scripts/preview-local.mjs` na porta 3105.

## Fora do escopo

- Fonte do texto corrido.
- Cores e fundo (bloco "T-0009 e T-0012" no fim de `src/app/globals.css`; só a fonte e o `letter-spacing` mudam). O `e2e/tema-claro.spec.ts` roda depois da troca para provar que as cores não mudaram.
- Pedras de dolomíticos e quartzitos (T-0010, já publicada).

## Execução

**Branch:** `task/T-0011-fonte-titulos-source-serif`, no worktree `../jk-t0011`, a partir de `origin/main` (9e2c77f). A task foi assumida pela sessão da T-0010 e da T-0012, porque o Vitor pediu lá ("pode subir a fonte nova tambem"). A outra sessão foi avisada.

**O que mudou**
- **Fonte nova:** `public/fonts/source-serif-4-latin.woff2`, baixada do Google Fonts (`fonts.gstatic.com`; Source Serif 4, subconjunto latin, peso 500, eixo de tamanho óptico, 52.344 bytes), com `public/fonts/OFL-SourceSerif4.txt` ao lado, vindo do repositório google/fonts.
- **`src/components/home-fonts.ts`:** `homeDisplay` aponta para a fonte nova, com peso 500 e fallback em Times New Roman.
- **`src/app/globals.css`:**
  - Títulos com `font-weight:500`, `letter-spacing:-.01em` (era `-.025em`) e `font-optical-sizing:auto`; `--peso-titulo` passou a 500.
  - Números das etapas, telefone grande e frase da marca também no 500.
  - As cores não mudaram.
- **Ajustes de títulos fora do `globals.css`:**
  - `HomeHero.module.css`: o h1 da capa passou de `-.035em` para `-.02em`.
  - `StoneJourney.css`: títulos da jornada no peso 500.
- **Regra e registro:** skill `design-system`, seção Tipografia, e `docs/decisoes/ADR-0003-fonte-titulos-source-serif.md`. Os adaptadores foram regerados; fora a skill de design, as diferenças eram só de fim de linha.
- **`e2e/fonte.spec.ts` (novo):** CA-1, CA-2, CA-3 e CA-5. O CA-3 acusou de início o título "Pedras", que é escondido só para leitor de tela (1 px, recortado de propósito); o teste passou a ignorar elementos com 1 px de largura.

**Verificação (01/11/2026)**
- `npm run lint`: 0 erros e 2 avisos antigos em `tools/higgsfield/`.
- `SITE_MODE=homolog npm run build` e `npx playwright test --workers=2`: 83 passaram e 3 foram pulados (testes só de celular ou só de desktop). Isso inclui `tema-claro`, que prova que as cores não mudaram.
- `MSYS_NO_PATHCONV=1 SITE_MODE=producao npm run build`: ok, com `check-pendencias`, `check-avisos` e `check-pedras`.
- Lighthouse no build de produção, comparado com a T-0012 (main 9e2c77f):
  - Home: 100 no celular (antes 97), LCP de 0,83 s (antes 0,88 s), CLS 0. 100 no desktop.
  - Granito: 93 no celular, LCP de 3,18 s (antes 3,12 s, +0,06 s, dentro do limite de 0,2 s), CLS 0. 100 no desktop.
  - Acessibilidade 100 nas quatro medições.
- Capturas em `qa/capturas/T-0011/`. Olhei a capa, materiais, quartzito, sobre e contato, no celular e no desktop: as quebras de linha estão boas e nenhum título estoura.

| CA | Resultado | Evidência |
|---|---|---|
| CA-1 | ok | `fonte` CA-1 (menu, 4 páginas, celular e desktop; família, peso 500 e fonte carregada) |
| CA-2 | ok | `fonte` CA-1/CA-2 (o parágrafo não usa a fonte dos títulos) |
| CA-3 | ok | `fonte` CA-3 (7 páginas, celular e desktop, sem estouro nem rolagem lateral) |
| CA-4 | ok | Lighthouse acima |
| CA-5 | ok | `fonte` CA-5 (nenhuma requisição ao Google Fonts) |

## Histórico

- 2026-10-31 · criada (backlog) · claude-code/opus (entrevista micro com o Vitor, 1 rodada, com comparação visual)
- 2026-11-01 · backlog → em-desenvolvimento · desenvolvedor ("pode subir a fonte nova tambem" na conversa: aprova a task, a troca da regra, o download da fonte e a publicação)
- 2026-11-01 · execução iniciada na branch task/T-0011-fonte-titulos-source-serif (a partir de origin/main, 9e2c77f), assumida pela sessão da T-0010/T-0012 · claude-code/opus
- 2026-11-01 · em-desenvolvimento → em-revisao · claude-code/opus · relatório na seção Execução
- 2026-11-01 · publicada na raiz e em /1 · claude-code/opus · Vitor na conversa: "pode subir a fonte nova tambem". Push na main (9e2c77f..690761e, Actions 41270959686 com sucesso) e merge na versao-1 (82a65b6, índice regenerado, Actions 41270962856 com sucesso). No ar: Source Serif 4 servida localmente (52.344 bytes), Bodoni fora, nenhuma chamada ao Google Fonts; raiz com index, follow e /1 com noindex
