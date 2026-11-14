---
id: T-0014
titulo: "Branco Paraná e variações em Mármores dolomíticos"
hu: avulsa
trilha: micro
status: em-desenvolvimento
depende_de: []
cobre: []
complexidade: 3
risco: normal
sensivel: false
skills: [conteudo, imagens, padroes-codigo, design-system, responsivo-desktop-mobile, testes, deploy]
criada_em: 2026-11-14
ferramenta: "claude-code/opus"
voltas: 0
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 0
testes_pegam: 0
revisao_humana: ""
homologacao: ""
---

# T-0014 · Branco Paraná e variações em Mármores dolomíticos

## Objetivo

A página `/materiais/marmore-dolomitico/` passa a abrir com 4 cartões: o Branco Paraná e as 3 variações que a cliente pediu. Publica na raiz e em `/1`.

## Contexto

- **Pedido da cliente (WhatsApp, 11/11/2026):** "Eu achei que está otimo assim, porém na parte dos marmores dolomiticos, gostaria que colocasse o Marmore Branco paraná, e incluisse também as diversidades dele: Matarazzo, Monte Cristo, Macchia oro". O Vitor confirmou o pedido em 14/11.
- **Confirmação da lista da T-0010:** o "achei que está ótimo assim" responde à mensagem de 31/10 com as páginas de dolomíticos e quartzitos. Os 14 nomes de pesquisa (exceção ao princípio 1 da T-0010) passam a ser confirmados pela cliente, e a O2 de `docs/PENDENCIAS.md` é atualizada.
- **Os nomes vêm da cliente**, então não há exceção ao princípio 1 nesta task.
- **Decisões do Vitor (14/11/2026, 2 rodadas):**
  - **Nomes nos cartões, com a família:** Branco Paraná, Branco Paraná Matarazzo, Branco Paraná Monte Cristo e Branco Paraná Macchia Oro.
  - **Posição:** os 4 abrem a lista de dolomíticos, nessa ordem, antes do Super White. Os 6 atuais seguem depois, na ordem de hoje.
  - **Mármores continua igual:** o Branco Paraná e o Paraná Matarazzo continuam em Mármores nacionais (lista da cliente de 19/10) e aparecem também em Dolomíticos.
  - **Imagens:** Codex (agente Astra), como na T-0010, sem custo por imagem.
  - **Publicação:** na raiz (`main`) e em `/1` (`versao-1`) juntas.
- **Imagens:**
  - **Branco Paraná e Branco Paraná Matarazzo:** reusam as imagens que já estão no site (`assets/images/pedra-marmore-branco-parana.png` e `pedra-marmore-parana-matarazzo.png`), sem gerar nada. É a mesma pedra nas duas páginas.
  - Para não duplicar o arquivo, o `pedras.json` ganha um campo opcional `imagem`, com o nome da imagem do manifesto. Sem ele, continua valendo `pedra-<slug>`. O `imagemPedra`, o `pedrasVisiveis` e o `scripts/check-pedras.mjs` passam a respeitar o campo.
  - **Monte Cristo e Macchia Oro:** geradas no Codex com o protocolo da T-0010:
    - close de chapa polida, retrato 4:5, mesma família visual;
    - de 1 a 3 fotos reais de chapa como referência, em `docs/trabalho/avulsas/T-0014/referencias/<id>/`, pasta fora do git;
    - comparação com `node scripts/comparar-imagens-geradas.mjs` (`BASE` na pasta da task);
    - até 3 tentativas por pedra;
    - o recorte de 2:3 para 4:5 registrado.
  - Se não houver foto real confiável de uma das variações, ou se a pedra não ficar parecida em 3 tentativas, **pare e avise o Vitor**. Ele pode pedir uma foto à cliente. Pedra sem imagem não aparece (PRD D2).
- **Mensagem do WhatsApp:** o nome "Branco Paraná" fica repetido em duas categorias, então o `mensagemPedra` já põe "(mármore dolomítico)" na mensagem. Isso é o comportamento esperado.

## Arquivos / áreas prováveis

- `src/content/pedras.json`: 4 entradas novas no começo do bloco `marmore-dolomitico`.
- `src/content/pedras.ts`: campo opcional `imagem` e o comentário do topo (os dolomíticos e quartzitos já foram confirmados pela cliente).
- `scripts/check-pedras.mjs`: respeitar o campo `imagem`.
- `assets/images/pedra-marmore-dolomitico-branco-parana-monte-cristo.png` e `pedra-marmore-dolomitico-branco-parana-macchia-oro.png`.
- `docs/proposta/assets-licencas.md` e `docs/proposta/hu-0001-prompts.json` (`"task": "T-0014"`).
- `docs/PENDENCIAS.md` (O2).
- `e2e/`: cartões de dolomíticos.

## Insumos

- Mensagem da cliente no WhatsApp de 11/11/2026 (citada acima, sem dado pessoal).

## Passos sugeridos

1. Branch `task/T-0014-branco-parana-dolomiticos` a partir da `main` (968deed).
2. Campo `imagem` e as 2 entradas que reusam imagem; conferir a página.
3. Referências e geração no Codex de Monte Cristo e Macchia Oro, com comparação e escolha.
4. Licenças, prompts, PENDENCIAS e testes.
5. Build, testes, capturas (1440 e 390) e Lighthouse da página de dolomíticos.
6. Com o "sim" do Vitor: merge e push na `main` e na `versao-1`.

## Critérios de aceite

- **CA-1:** Dada `/materiais/marmore-dolomitico/`, então os 4 primeiros cartões são Branco Paraná, Branco Paraná Matarazzo, Branco Paraná Monte Cristo e Branco Paraná Macchia Oro, cada um com foto, nome e "Chamar no WhatsApp", seguidos dos 6 de antes.
- **CA-2:** Dada `/materiais/marmore/`, então o Branco Paraná e o Paraná Matarazzo continuam em Mármores nacionais, com a mesma imagem de antes.
- **CA-3:** Dado o botão de cada cartão novo, então ele abre o WhatsApp com o nome da pedra; no Branco Paraná, com "(mármore dolomítico)".
- **CA-4:** Dadas as 2 imagens geradas, então são close de chapa em 4:5 na família visual das atuais, parecidas com a pedra real (comparação registrada) e sem cópia de foto de fornecedor.
- **CA-5:** Dado o build de produção, então `check:pendencias`, `check:avisos`, `check:pedras` e `check-imagens-geradas` passam, e nenhuma imagem é duplicada em `assets/images/`.
- **CA-6:** Dadas a raiz e `/1`, então as duas mostram os 4 cartões novos.

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-1 | interacao | Playwright entra em `/materiais/`, clica em "Conhecer mármores dolomíticos" e confere a ordem, a foto, o nome e o botão dos 4 primeiros cartões e o total de 10 |
| CA-2 | interacao | Playwright abre Mármores pelo menu e confere os 2 cartões em "Mármores nacionais" |
| CA-3 | interacao | confere o `href` `wa.me` de cada cartão novo e clica |
| CA-4 | manual | motivo: semelhança com a pedra real é julgamento visual; prancha e medida do `comparar-imagens-geradas` no relatório |
| CA-5 | integracao | `npm run build` com `SITE_MODE=producao` e os checks |
| CA-6 | manual | conferir as duas URLs depois do deploy (200 e cartões) |

**Dados e ambiente:** `npm run build` antes; Playwright com `scripts/preview-local.mjs` na porta 3105.

## Fora do escopo

- Tirar o Branco Paraná ou o Matarazzo de Mármores.
- Trocar as imagens que já estão no site.
- Acabamentos por pedra.

## Histórico

- 2026-11-14 · criada (backlog) · claude-code/opus (pedido da cliente de 11/11 lido no Zapmind; entrevista micro com o Vitor, 2 rodadas)
- 2026-11-14 · backlog → em-desenvolvimento · desenvolvedor ("Aprovo, pode começar" na conversa)
