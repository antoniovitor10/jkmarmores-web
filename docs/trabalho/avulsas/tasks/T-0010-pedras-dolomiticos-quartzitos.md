---
id: T-0010
titulo: "Pedras de Mármores dolomíticos e Quartzitos naturais no catálogo"
hu: avulsa
trilha: micro
status: concluida
depende_de: []
cobre: []
complexidade: 5
risco: normal
sensivel: false
skills: [conteudo, imagens, padroes-codigo, design-system, responsivo-desktop-mobile, testes, deploy]
criada_em: 2026-10-31
ferramenta: "claude-code/opus"
voltas: 1
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 5
testes_pegam: 1
revisao_humana: "aprovado"
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
  - **Imagens:** primeiro foi decidido o Higgsfield, com orçamento aprovado antes do lote. **Troca (Vitor, 31/10/2026):** a chave da API do Higgsfield venceu em 26/10 e o Vitor mandou usar o Codex (agente Astra), como na HU-0001, sem custo por imagem: "usa o codex pra isso pode usar" e "se nao ficar bom mudamos".
- **Exceção ao princípio 1 (Vitor, 31/10/2026):** as pedras de dolomíticos e quartzitos vêm de pesquisa de mercado e vão ao ar antes da confirmação da cliente. A lista é enviada a ela, e o que ela tirar sai do site. A regra geral continua valendo para todo o resto.
- **Como o catálogo funciona (T-0002, decisão D2 do PRD da HU-0001):** a pedra fica em `src/content/pedras.json` (`slug`, `nome`, `categoria`), e o cartão só aparece quando a imagem `pedra-<slug>` existe no manifesto do build. Portanto, pedra sem imagem aprovada não aparece.
- **Imagem (mesmo padrão das 34 atuais, T-0001 e T-0003):**
  - Close da chapa polida, sem ambiente, retrato 4:5, com pelo menos 768 px de largura.
  - Mesma luz e escala de veio da família atual. O modelo de prompt é `close_pedra` em `docs/proposta/hu-0001-prompts.json`, com as lições de mármore.
  - Referência: de 2 a 4 fotos reais por pedra, salvas em `docs/trabalho/avulsas/T-0010/referencias/<id>/` (pasta fora do git).
  - As fotos de fornecedor são só referência de cor e veio. Nunca entram no repositório nem no site, e a gerada não pode ser cópia próxima delas (ADR-0001, princípio 4).
  - A comparação usa `node scripts/comparar-imagens-geradas.mjs` (adaptado para a pasta desta task) mais a revisão visual.
  - Até 3 tentativas por pedra. Pedra que não ficar parecida fica sem imagem, e portanto fora do site, e vai para o relatório.
- **Higgsfield (skill `imagens`), plano original, fica como alternativa se o Codex não ficar bom:**
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
2. Codex: 1 pedra de teste (Mont Blanc) e comparação.
3. As outras 13, com referência, geração, comparação e escolha (protocolo da T-0003: `gerar.sh` com as referências anexadas por `-i`).
4. Entradas no `pedras.json`, licenças, PENDENCIAS e testes.
5. Build, testes, capturas e Lighthouse das duas páginas.
6. Com o "sim" do Vitor: merge e push na `main` e na `versao-1`.

## Critérios de aceite

- **CA-1:** Dada `/materiais/marmore-dolomitico/`, então aparecem os cartões dos dolomíticos aprovados, cada um com foto, nome e "Chamar no WhatsApp".
- **CA-2:** Dada `/materiais/quartzito/`, então aparecem os cartões dos quartzitos aprovados, do mesmo jeito.
- **CA-3:** Dado o botão de um cartão novo, então ele abre o WhatsApp com o nome da pedra na mensagem.
- **CA-4:** Dada cada imagem nova, então ela é close de chapa em 4:5 na mesma família visual das atuais, parecida com a pedra real (comparação registrada) e sem cópia de foto de fornecedor.
- **CA-5:** Dado o build de produção, então `check:pendencias`, `check:avisos` e `check:pedras` passam e as páginas novas não têm aviso de IA.
- **CA-6:** Dada cada imagem nova, então ela está registrada em `assets-licencas.md` (arquivo, ferramenta, data, chave do prompt) e o prompt em `docs/proposta/hu-0001-prompts.json` (com `"task": "T-0010"`, porque o `check-imagens-geradas` lê esse arquivo); sem gasto no Higgsfield.
- **CA-7:** Dadas a raiz e `/1`, então as duas mostram as pedras novas, e `/1` continua com fundo branco.

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-1 | interacao | Playwright abre a página pelo cartão "Conhecer mármores dolomíticos" em `/materiais/`, conta os cartões e confere foto, nome e botão |
| CA-2 | interacao | o mesmo, partindo de "Conhecer quartzitos naturais" |
| CA-3 | interacao | confere o `href` `wa.me` com o nome da pedra e clica |
| CA-4 | manual | motivo: semelhança com a pedra real é julgamento visual; prancha e medida do `comparar-imagens-geradas` no relatório |
| CA-5 | integracao | `npm run build` com `SITE_MODE=producao` |
| CA-6 | integracao | `node scripts/check-imagens-geradas.mjs` e conferência do registro |
| CA-7 | manual | conferir as duas URLs depois do deploy (200, cartões, fundo) |

**Dados e ambiente:** `npm run build` antes; Playwright com `scripts/preview-local.mjs` na porta 3105.

## Fora do escopo

- Trocar as 34 imagens atuais.
- Acabamentos por pedra.
- Levar o fundo branco para a raiz.

## Execução

**Branch:** `task/T-0010-pedras-dolomiticos-quartzitos`, no worktree `../jk-t0010` (a pasta `jk-marmores` ficou para a sessão da fonte). Sem push (autonomia 0).

**Ferramenta:** o plano era o Higgsfield, mas a chave da API venceu em 26/10/2026 e o CLI não estava logado. Por decisão do Vitor ("usa o codex pra isso pode usar"), usei o Codex CLI 0.166.0 (`image_generation`, agente Astra). Gasto no Higgsfield: zero. O script `tools/higgsfield/t0010-pedras.mjs` (estimar e gerar, com `z-image/turbo` ou `qwen-image-3/edit`) fica pronto, caso seja preciso voltar.

**Como foi feito (protocolo da T-0003)**
1. **Referências:** de 1 a 3 fotos reais por pedra, de distribuidores (27 fotos), em `docs/trabalho/avulsas/T-0010/referencias/`, fora do git. Antes da rodada 2, saíram as fotos de ambiente, porque puxavam o gerador para o lado errado.
2. **Geração:** `gerar.sh` anexa as fotos com `-i` e instrui a usá-las só para cor, veio e granulação. Foram 2 candidatas por rodada, 2 gerações em paralelo, e 40 imagens no total.
3. **Escolha:**
   - Medida com `node scripts/comparar-imagens-geradas.mjs`, que agora aceita `BASE`.
   - Revisão visual em pranchas lado a lado.
   - A segunda opinião do agy não foi rodada.
4. **Recorte:** 13 imagens vieram em 1024×1536 e foram cortadas pelo centro para 1024×1280 (4:5). O Mont Blanc já veio em 1122×1402.

| Pedra | Categoria | Rodadas | Escolhida | Motivo |
|---|---|---|---|---|
| Super White | dolomítico | 2 | candidata-3 | rodada 1 branca com veio de Calacatta; rodada 2 cinza-azulado brechado, ΔE 4,4 |
| Branco Michelangelo | dolomítico | 2 | candidata-3 | rede de veios finos ramificados, como a chapa real |
| Lunar | dolomítico | 1 | candidata-1 | ΔE 3,5 |
| Biancatto | dolomítico | 2 | candidata-4 | rodada 1 amarelada; rodada 2 branco frio com ondas, ΔE 6,7 |
| Donatello | dolomítico | 2 | candidata-3 | rodada 1 marrom em ondas; rodada 2 cinza-azulado manchado (a medida de cor é distorcida pelo fundo branco da foto) |
| Thassos | dolomítico | 1 | candidata-1 | ΔE 1,4 |
| Taj Mahal | quartzito | 3 | candidata-6 | rodadas 1 e 2 douradas demais; rodada 3 greige claro com poucos veios tan |
| Perla Venata | quartzito | 1 | candidata-2 | ΔE 3,6 |
| Mont Blanc | quartzito | 1 | candidata-2 | pedra de teste; ΔE 1,9, textura 0,1 |
| Cristallo | quartzito | 3 | candidata-5 | rodadas 1 e 2 com dourado ou linha cinza forte; rodada 3 branco fibroso translúcido |
| Sea Pearl | quartzito | 1 | candidata-1 | ΔE 4,8 |
| Fusion | quartzito | 1 | candidata-1 | ondas ferrugem, azul e verde do Fusion multicolor |
| Azul Macaúbas | quartzito | 2 | candidata-4 | rodada 1 com veio laranja; rodada 2 azul com faixas creme, ΔE 7,1 |
| Verde Alexandrita | quartzito | 2 | candidata-3 | verde-água com áreas brancas e veios escuros, como a chapa real |

Nenhuma pedra ficou de fora.

**O que mudou**
- `assets/images/pedra-<slug>.png`: 14 imagens novas.
- `src/content/pedras.json`: 14 entradas.
- `src/content/pedras.ts`: categorias `marmore-dolomitico` e `quartzito`, com rótulo para o `alt` e para a mensagem. Taj Mahal agora existe em lâmina e em quartzito, então a mensagem de WhatsApp leva a categoria, como já acontecia com o Calacatta.
- `src/content/institucional.ts`: a pendência das duas categorias agora diz que os nomes vêm da pesquisa e esperam a confirmação da cliente (aparece só em homologação).
- `docs/PENDENCIAS.md`: O2 atualizada.
- `docs/proposta/hu-0001-prompts.json`: 14 entradas, com a marca `"task": "T-0010"`.
- `docs/proposta/assets-licencas.md`: seção nova "T-0010".
- `.gitignore`: as pastas de trabalho da T-0010.
- `scripts/comparar-imagens-geradas.mjs`: aceita `BASE`.
- `e2e/materiais-categorias.spec.ts`: o teste antigo, que exigia as categorias vazias, foi trocado pelos testes da T-0010.

**Verificação (31/10/2026)**
- `npm run lint`: 0 erros e 2 avisos antigos em `tools/higgsfield/`.
- `MSYS_NO_PATHCONV=1 SITE_MODE=producao npm run build`: ok. `check-pendencias`, `check-avisos` e `check-pedras` passaram (48 pedras, nenhuma no sitemap).
- `node scripts/check-imagens-geradas.mjs`: 67 imagens com registro completo.
- `npx playwright test` com o build de homologação: na rodada completa, 64 passaram, 2 foram pulados e 2 falharam por tempo, com a máquina carregada.
  - Falharam o CA-7 do configurador (instabilidade já conhecida) e o CA-8 de avisos, que percorre todas as páginas esperando a rede parar e estourou os 30 s.
  - Rodando de novo `avisos`, `configurador`, `materiais-categorias` e `materiais` com 2 workers, os 34 passaram.
  - O teste novo pegou um erro meu: a regex do `alt` estava mal escapada e foi trocada por uma checagem sem regex.
- Lighthouse mobile e desktop:
  - `/materiais/marmore-dolomitico/`: 95 e 100.
  - `/materiais/quartzito/`: 95 e 100.
  - Acessibilidade 100 nas quatro medições.
  - LCP no celular entre 2,78 e 2,89 s, vindo da foto de topo, que não mudou nesta task.
  - Relatórios em `qa/lighthouse/T-0010-*`.
- Capturas nas 5 larguras em `qa/capturas/T-0010/`. Os avisos do script (alvo de 43 a 48 px e imagem lazy na primeira tela) são os mesmos das outras páginas e já existiam.

| CA | Resultado | Evidência |
|---|---|---|
| CA-1 | ok | `materiais-categorias` T-0010 CA-1/CA-2 (dolomíticos, 6 cartões, partindo de `/materiais/`) |
| CA-2 | ok | o mesmo teste para quartzitos, 8 cartões |
| CA-3 | ok | `materiais-categorias` T-0010 CA-3 (`wa.me` com Mont Blanc, clique; Taj Mahal leva "(quartzito)") |
| CA-4 | ok | pranchas, medida e tabela acima; nenhuma candidata copia a foto de fornecedor |
| CA-5 | ok | build de produção com os 3 checks |
| CA-6 | ok | `check-imagens-geradas` (67 com registro) e seção T-0010 no `assets-licencas.md`; sem gasto no Higgsfield |
| CA-7 | ok | depois do deploy: raiz com 6 e 8 cartões, `index, follow`, tema escuro; `/1` com 6 e 8 cartões, `noindex`, fundo branco; nenhuma pedra no sitemap |

## Histórico

- 2026-10-31 · criada (backlog) · claude-code/opus (entrevista micro com o Vitor, 2 rodadas, mais a exceção ao princípio 1)
- 2026-10-31 · backlog → em-desenvolvimento · desenvolvedor ("Aprovo, pode começar" na conversa)
- 2026-10-31 · execução iniciada na branch task/T-0010-pedras-dolomiticos-quartzitos (a partir de main, cf105f4) · claude-code/opus
- 2026-10-31 · troca do Higgsfield (chave da API vencida) pelo Codex (agente Astra) · desenvolvedor ("usa o codex pra isso pode usar" na conversa)
- 2026-10-31 · em-desenvolvimento → em-revisao · claude-code/opus · relatório na seção Execução; sem push (autonomia 0)
- 2026-10-31 · publicada na raiz e em /1 · claude-code/opus · Vitor na conversa: "Sim, publica". Push na main (cf105f4..b871a80, Actions 41248196945 com sucesso) e merge na versao-1 (586aa91, índice regenerado no conflito, Actions 41248223430 com sucesso). Raiz e /1 com 200 e as pedras nas duas categorias
- 2026-11-01 · em-revisao → concluida · desenvolvedor ("Pode mover pra concluídas e publicar" na conversa); revisão humana: aprovado
