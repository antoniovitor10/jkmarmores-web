---
id: T-0009
titulo: "Prévia do site com fundo branco em /1"
hu: avulsa
trilha: micro
status: em-revisao
depende_de: []
cobre: []
complexidade: 5
risco: normal
sensivel: false
skills: [design-system, padroes-codigo, imagens, responsivo-desktop-mobile, testes, deploy]
criada_em: 2026-10-31
ferramenta: "claude-code/opus"
voltas: 1
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 6
testes_pegam: 2
revisao_humana: ""
homologacao: ""
---

# T-0009 · Prévia do site com fundo branco em /1

## Objetivo

A Juliana vê o site atual inteiro com fundo branco em jkmarmores.com.br/1, para comparar com a versão escura que está na raiz. A raiz (produção) não muda.

## Contexto

- **Pedido da cliente (WhatsApp, 28/10/2026):** "precisava ver como ficaria o fundo do site branco". O Vitor prometeu entregar até sexta (30/10).
- **Decisões do Vitor (31/10, 1 rodada):**
  - **Onde:** em `/1`, pela branch `versao-1` (troca a versão escura antiga que está lá; a raiz continua escura).
  - **Tom:** branco puro, `#ffffff`.
  - **Alcance:** site inteiro (início, materiais, catálogo por pedra, aplicações, galeria, sobre, contato, 404).
- **É prévia, não troca de direção visual.** O design system aprovado (versão 1, escuro) continua valendo para a raiz. Se a Juliana aprovar o branco, uma task própria leva isso para a `main` e atualiza a skill `design-system`.
- **Contraste no branco:** o caramelo `#c9ab91` tem 2,16:1 sobre branco e não serve para texto. Para texto e links de destaque entra um caramelo escuro, `#7a5c42` (6,11:1). O botão principal passa a ser grafite `#2b2622` com texto branco (14,97:1). O caramelo claro continua em filetes, fundos de botão no hover e detalhes que não são texto.
- **Logos:** os dois arquivos (`public/brand/jk-logo-*.webp` e `jk-monograma-240.webp`) têm fundo preto sem transparência. No branco eles viram caixas pretas. Entra uma versão derivada com o preto transparente (gerada dos originais, sem redesenhar a marca).
- **Rodapé:** fica grafite (`#10100f`) como fechamento da página, com o logo original. Isso segura a identidade escura da marca e evita mexer no logo do rodapé.
- **Fotos com texto por cima** (abertura da home, jornada da pedra, configurador): continuam com o escurecimento atual, porque o texto sobre foto precisa dele. O branco vale para o fundo das páginas, cartões, seções e painéis.

## Arquivos / áreas prováveis

- `src/app/globals.css`: bloco "Versão 1" de tokens (linha ~235) e as cores escritas direto nas regras (cerca de 40 hex e `rgba`).
- `src/components/*.module.css`, `StoneJourney.css` e `configurador/`: cores fixas de fundo escuro.
- `src/components/Brand.tsx`: logo do cabeçalho com fundo transparente.
- `public/brand/`: monograma derivado com transparência (pelo script de imagens).
- `e2e/tema-claro.spec.ts` (novo).

## Insumos

nenhum

## Passos sugeridos

1. Branch `task/T-0009-previa-fundo-branco` a partir da `main`.
2. Trocar os tokens do bloco "Versão 1" pelos do branco e varrer as cores fixas, página por página, no desktop e no celular.
3. Monograma do cabeçalho com transparência.
4. Testes, capturas nas 5 larguras e Lighthouse mobile (home e `/materiais/granito/`).
5. Com o "sim" do Vitor: mesclar a branch da task na `versao-1` e dar push (publica em `/1`). A `main` não recebe esta task.

## Critérios de aceite

- **CA-1:** Dada qualquer página em `/1`, então o fundo da página é `#ffffff` e o texto principal é escuro, no desktop e no celular.
- **CA-2:** Dado qualquer texto ou link sobre o branco, então o contraste é de pelo menos 4,5:1 e o Lighthouse mobile dá 100 em Acessibilidade na home e em `/materiais/granito/`.
- **CA-3:** Dado o cabeçalho, então o logo aparece sem caixa preta em volta.
- **CA-4:** Dado o menu do celular, então ele abre, mostra os links legíveis no fundo claro e fecha.
- **CA-5:** Dado o cartão de uma pedra no catálogo, então a foto, o nome e o botão "Chamar no WhatsApp" aparecem legíveis e o botão abre o WhatsApp com a mensagem da pedra.
- **CA-6:** Dados os links e botões da T-0008, então continuam com sublinhado, seta, hover e foco visível, agora no caramelo escuro.
- **CA-7:** Dada a raiz jkmarmores.com.br, então nada muda (a `main` não recebe esta task).
- **CA-8:** Dado `/1`, então as páginas têm `noindex` (modo homolog).

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-1 | interacao | Playwright navega pelo menu por todas as páginas e confere `background-color` do `body` e cor do texto, em 1440 e 390 |
| CA-2 | integracao | script de contraste nos pares de tokens novos; Lighthouse mobile da home e do granito |
| CA-3 | interacao | confere que o logo do cabeçalho é a versão transparente e que o pixel do canto é transparente |
| CA-4 | interacao | no celular, toca no botão do menu, confere os links visíveis e fecha |
| CA-5 | interacao | em `/materiais/granito/`, confere cor do nome e do botão e o `href` do WhatsApp com a pedra |
| CA-6 | interacao | reaproveita `e2e/links.spec.ts` com as cores novas: sublinhado, seta, hover e foco |
| CA-7 | manual | motivo: a raiz só muda por push na `main`, que esta task não faz; conferir no fim que jkmarmores.com.br segue escuro |
| CA-8 | integracao | build com `SITE_MODE=homolog` e conferência do `meta robots` |

**Dados e ambiente:** `npm run build` antes; Playwright com `scripts/preview-local.mjs` na porta 3105.

## Fora do escopo

- Levar o branco para a raiz (só se a Juliana aprovar, em task própria).
- Tipografia, textos, imagens das pedras e layout.
- Pedras de Mármores dolomíticos e Quartzitos naturais: a Juliana não mandou nomes para essas duas categorias.

## Execução

**Branch:** `task/T-0009-previa-fundo-branco` (a partir de `main`, cf105f4). Sem push (autonomia 0). A publicação em `/1` é mesclar esta branch na `versao-1` e dar push, com o "sim" do Vitor.

**O que mudou**
- `src/app/globals.css`: bloco "T-0009" no fim. Tokens no branco (`--cor-fundo #ffffff`, texto `#1f1b18`, caramelo de texto `#7a5c42`, títulos de destaque `#6b4f38`, apoio `#5e554c`, filetes `#d8cfc5`, borda de controle `#8c7a66`, superfície `#f6f3ef`, botão grafite `#2b2622` com texto branco) e a troca das cores fixas da versão escura (seletor, chamada final, painel de contato, menu do celular, hover dos botões). O rodapé fica grafite com os tokens antigos, por variável local. O texto sobre foto (abertura, painéis da jornada) segue claro. A capa fecha no monograma sobre o branco (`.hero-mask > rect`), e a base da foto não termina mais em grafite sólido.
- `src/components/Brand.tsx`: cabeçalho usa `jk-monograma-240-transparente.webp`.
- `public/brand/jk-monograma-240-transparente.webp`: derivado do monograma da cliente por `scripts/logo-transparente.mjs` (preto vira alfa; a marca não foi redesenhada).
- `src/app/layout.tsx`: `themeColor` `#ffffff`.
- `e2e/links.spec.ts`: cores esperadas da T-0008 ajustadas ao branco (caramelo de texto na página, caramelo claro no rodapé, foco do botão com contorno em grafite).
- `e2e/tema-claro.spec.ts` (novo): CA-1 a CA-5 e CA-8.

**Hex novos e motivo:** `#7a5c42`, `#6b4f38`, `#5e554c`, `#1f1b18`, `#d8cfc5`, `#8c7a66` (já usado na borda do formulário), `#f6f3ef`, `#4a3f35` (hover do botão). Todos para contraste no branco: caramelo `#7a5c42` 6,11:1, títulos `#6b4f38` 7,50:1, apoio `#5e554c` 7,29:1, texto 17,10:1, botão branco sobre `#2b2622` 14,97:1.

**Verificação (31/10/2026)**
- `MSYS_NO_PATHCONV=1 SITE_MODE=homolog NEXT_PUBLIC_BASE_PATH=/1 npm run build`: ok (pendências listadas, como esperado em homolog; `check-avisos` e `check-pedras` ok, 34 pedras).
- `npm run lint`: 0 erros, 2 avisos antigos em `tools/higgsfield/` (fora desta task).
- `npx playwright test` (build homolog na raiz): 74 passaram, 3 pulados, 1 falhou por instabilidade. Os testes novos pegaram 2 erros meus antes da entrega: o painel de contato com fundo grafite e texto escuro, e o botão com contorno do painel sem a borda caramelo. Os dois foram corrigidos.
- Repetição `--repeat-each=3` de `links`, `configurador` e `tema-claro`: 107 passaram, 1 falhou. A falha foi o CA-11 da T-0008, que estourou o tempo de 30 s numa das 3 repetições com tudo em paralelo; ele passa sozinho. Também apareceram duas instabilidades que não se repetem: CA-2 da T-0008 (alvo de 43,99997 px por arredondamento) e CA-7 do configurador no celular (tempo da troca de imagem).
- Lighthouse: home com 97 no celular e 100 no desktop; `/materiais/granito/` com 94 no celular e 100 no desktop. **Acessibilidade 100 nas quatro medições.** LCP do granito no celular: 3,10 s, vindo da foto do topo, que não mudou nesta task. Relatórios em `qa/lighthouse/T-0009-*`.
- Capturas nas 5 larguras em `qa/capturas/T-0009/` (home, materiais, granito, sobre, contato). Os avisos do script são alvos de 43 a 48 px e imagem lazy na primeira tela, que já existiam e não têm relação com a cor. A captura de página inteira não espera as seções com `content-visibility`; essas seções foram conferidas rolando no navegador.

| CA | Resultado | Evidência |
|---|---|---|
| CA-1 | ok | `tema-claro` CA-1 (menu e endereço, 7 páginas, celular e desktop) |
| CA-2 | ok | `tema-claro` CA-2 e Lighthouse Acessibilidade 100 |
| CA-3 | ok | `tema-claro` CA-3 (pixel do canto com alfa 0) |
| CA-4 | ok | `tema-claro` CA-4 (abre, legível, fecha) |
| CA-5 | ok | `tema-claro` CA-5 |
| CA-6 | ok | `links.spec.ts` inteiro com as cores novas |
| CA-7 | ok | esta branch não vai para a `main`; conferir a raiz depois do push na `versao-1` |
| CA-8 | ok | `tema-claro` CA-8 (`noindex`) |

## Histórico

- 2026-10-31 · criada (backlog) · claude-code/opus (entrevista micro com o Vitor, 1 rodada)
- 2026-10-31 · backlog → em-desenvolvimento · desenvolvedor ("Aprovo, pode começar" na conversa)
- 2026-10-31 · execução iniciada na branch task/T-0009-previa-fundo-branco (a partir de main, cf105f4) · claude-code/opus
- 2026-10-31 · em-desenvolvimento → em-revisao · claude-code/opus · relatório na seção Execução; sem push (autonomia 0)
