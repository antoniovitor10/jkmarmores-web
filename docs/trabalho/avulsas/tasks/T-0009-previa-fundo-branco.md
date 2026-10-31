---
id: T-0009
titulo: "Prévia do site com fundo branco em /1"
hu: avulsa
trilha: micro
status: em-desenvolvimento
depende_de: []
cobre: []
complexidade: 5
risco: normal
sensivel: false
skills: [design-system, padroes-codigo, imagens, responsivo-desktop-mobile, testes, deploy]
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

(preenchido ao fim da execução)

## Histórico

- 2026-10-31 · criada (backlog) · claude-code/opus (entrevista micro com o Vitor, 1 rodada)
- 2026-10-31 · backlog → em-desenvolvimento · desenvolvedor ("Aprovo, pode começar" na conversa)
- 2026-10-31 · execução iniciada na branch task/T-0009-previa-fundo-branco (a partir de main, cf105f4) · claude-code/opus
