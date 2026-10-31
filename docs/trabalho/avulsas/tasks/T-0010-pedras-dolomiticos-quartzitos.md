---
id: T-0010
titulo: "Pedras de Mármores dolomíticos e Quartzitos naturais no catálogo"
hu: avulsa
trilha: micro
status: em-desenvolvimento
depende_de: []
cobre: []
complexidade: 5
risco: normal
sensivel: false
skills: [conteudo, imagens, padroes-codigo, design-system, responsivo-desktop-mobile, testes, deploy]
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

# T-0010 · Pedras de Mármores dolomíticos e Quartzitos naturais no catálogo

## Objetivo

As páginas `/materiais/marmore-dolomitico/` e `/materiais/quartzito/` passam a ter cartões de pedra, com foto e botão de WhatsApp, como as outras categorias. Publica na raiz e em `/1`.

## Contexto

- **Pedido da cliente (áudio de 23/10/2026):** as duas categorias estão vazias e são as principais que faltam; ela não mandou os nomes.
- **Pesquisa de mercado (31/10/2026):** `docs/referencias/pesquisa-dolomiticos-quartzitos.md`.
- **Decisões do Vitor (31/10/2026):**
  - **As 14 pedras da pesquisa**, sem repetir nenhuma pedra que já está no site:
    - **Dolomíticos (6):** Super White, Branco Michelangelo, Lunar, Biancatto, Donatello e Thassos.
    - **Quartzitos (8):** Taj Mahal, Perla Venata, Mont Blanc, Cristallo, Sea Pearl, Fusion, Azul Macaúbas e Verde Alexandrita.
    - Matarazzo e Branco Paraná continuam só em Mármores.
    - O Taj Mahal das lâminas é outro material (lâmina sinterizada); o quartzito Taj Mahal entra em Quartzitos com imagem própria.
  - **Publicação:** na raiz (`main`) e em `/1` (`versao-1`) juntas.
  - **Imagens:** geradas no Higgsfield, com orçamento aprovado antes de gerar o lote.
- **Exceção ao princípio 1 (Vitor, 31/10/2026):** as pedras de dolomíticos e quartzitos vêm de pesquisa de mercado e vão ao ar antes da confirmação da cliente. A lista é enviada a ela, e o que ela tirar sai do site. A regra geral continua valendo para todo o resto.
- **Como o catálogo funciona (T-0002, decisão D2 do PRD da HU-0001):** a pedra fica em `src/content/pedras.json` (`slug`, `nome`, `categoria`), e o cartão só aparece quando a imagem `pedra-<slug>` existe no manifesto do build. Portanto, pedra sem imagem aprovada não aparece.
- **Imagem (mesmo padrão das 34 atuais, T-0001 e T-0003):**
  - Close da chapa polida, sem ambiente, retrato 4:5, com pelo menos 768 px de largura.
  - Mesma luz e escala de veio da família atual. O modelo de prompt é `close_pedra` em `docs/proposta/hu-0001-prompts.json`, com as lições de mármore.
  - Referência: de 2 a 4 fotos reais por pedra, salvas em `docs/trabalho/avulsas/T-0010/referencias/<id>/` (pasta fora do git).
  - As fotos de fornecedor são só referência de cor e veio. Nunca entram no repositório nem no site, e a gerada não pode ser cópia próxima delas (ADR-0001, princípio 4).
  - A comparação usa `node scripts/comparar-imagens-geradas.mjs` (adaptado para a pasta desta task) mais a revisão visual.
  - Até 3 tentativas por pedra. Pedra que não ficar parecida fica sem imagem, e portanto fora do site, e vai para o relatório.
- **Higgsfield (skill `imagens`):**
  - A ferramenta fica em `tools/higgsfield/`. A credencial está em `.env.local` e nunca é aberta.
  - **Antes do lote:** estimar o custo por imagem, gerar 1 pedra de teste e passar ao Vitor o custo por pedra e o total com 20% de reserva. O lote só roda com o "sim" e o teto dele.
  - Cada imagem ganha uma linha em `docs/proposta/assets-licencas.md` (modelo, prompt, request ID e custo) e uma entrada de prompt em JSON.
  - Nada da cliente vai para a API (logo, fotos ou dados).
- **Pendência:** a O2 de `docs/PENDENCIAS.md` passa a registrar que os nomes de dolomíticos e quartzitos vieram de pesquisa e aguardam a confirmação da cliente.

## Arquivos / áreas prováveis

- `src/content/pedras.json`: 14 entradas novas (`categoria` `marmore-dolomitico` e `quartzito`).
- `assets/images/pedra-<slug>.png`: originais aprovados (o build gera os AVIF e WebP).
- `docs/proposta/assets-licencas.md` e o JSON de prompts.
- `scripts/comparar-imagens-geradas.mjs`: aceitar a pasta da task.
- `e2e/materiais-categorias.spec.ts`: as duas categorias com os cartões.
- `docs/PENDENCIAS.md` (O2).

## Insumos

nenhum (pesquisa em `docs/referencias/`)

## Passos sugeridos

1. Branch `task/T-0010-pedras-dolomiticos-quartzitos` a partir da `main`.
2. Estimativa no Higgsfield, 1 pedra de teste e comparação. Parar e pedir o orçamento ao Vitor.
3. Com o teto aprovado: as outras 13, com referência, geração, comparação e escolha.
4. Entradas no `pedras.json`, licenças, PENDENCIAS e testes.
5. Build, testes, capturas e Lighthouse das duas páginas.
6. Com o "sim" do Vitor: merge e push na `main` e na `versao-1`.

## Critérios de aceite

- **CA-1:** Dada `/materiais/marmore-dolomitico/`, então aparecem os cartões dos dolomíticos aprovados, cada um com foto, nome e "Chamar no WhatsApp".
- **CA-2:** Dada `/materiais/quartzito/`, então aparecem os cartões dos quartzitos aprovados, do mesmo jeito.
- **CA-3:** Dado o botão de um cartão novo, então ele abre o WhatsApp com o nome da pedra na mensagem.
- **CA-4:** Dada cada imagem nova, então ela é close de chapa em 4:5 na mesma família visual das atuais, parecida com a pedra real (comparação registrada) e sem cópia de foto de fornecedor.
- **CA-5:** Dado o build de produção, então `check:pendencias`, `check:avisos` e `check:pedras` passam e as páginas novas não têm aviso de IA.
- **CA-6:** Dado o gasto no Higgsfield, então ele fica dentro do teto aprovado e registrado em `assets-licencas.md`.
- **CA-7:** Dadas a raiz e `/1`, então as duas mostram as pedras novas, e `/1` continua com fundo branco.

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-1 | interacao | Playwright abre a página pelo cartão "Conhecer mármores dolomíticos" em `/materiais/`, conta os cartões e confere foto, nome e botão |
| CA-2 | interacao | o mesmo, partindo de "Conhecer quartzitos naturais" |
| CA-3 | interacao | confere o `href` `wa.me` com o nome da pedra e clica |
| CA-4 | manual | motivo: semelhança com a pedra real é julgamento visual; prancha e medida do `comparar-imagens-geradas` no relatório |
| CA-5 | integracao | `npm run build` com `SITE_MODE=producao` |
| CA-6 | manual | motivo: o custo vem da API do Higgsfield; soma registrada no relatório |
| CA-7 | manual | conferir as duas URLs depois do deploy (200, cartões, fundo) |

**Dados e ambiente:** `npm run build` antes; Playwright com `scripts/preview-local.mjs` na porta 3105.

## Fora do escopo

- Trocar as 34 imagens atuais.
- Acabamentos por pedra.
- Levar o fundo branco para a raiz.

## Histórico

- 2026-10-31 · criada (backlog) · claude-code/opus (entrevista micro com o Vitor, 2 rodadas, mais a exceção ao princípio 1)
- 2026-10-31 · backlog → em-desenvolvimento · desenvolvedor ("Aprovo, pode começar" na conversa)
- 2026-10-31 · execução iniciada na branch task/T-0010-pedras-dolomiticos-quartzitos (a partir de main, cf105f4) · claude-code/opus
