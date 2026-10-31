---
id: T-0006
titulo: "Configurador com Calacatta, Travertino e Preto São Gabriel"
hu: HU-0001
trilha: funcionalidade
status: em-teste
depende_de: [T-0001]
cobre: [CA-7, CA-11]
complexidade: 4
risco: normal
sensivel: false
skills: [imagens, stack, padroes-codigo, conteudo, design-system, responsivo-desktop-mobile, testes]
criada_em: 2026-10-21
ferramenta: "claude-code/opus (maestro e implementação) + codex (Astra, geração) + agy (segunda opinião)"
voltas: 1
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 3
testes_pegam: 3
revisao_humana: ""
homologacao: ""
---

# T-0006 · Configurador com Calacatta, Travertino e Preto São Gabriel

## Objetivo

O configurador da home troca os tons genéricos (Rosado, Bege, Escuro) por 3 pedras da lista da cliente (Calacatta, Travertino, Preto São Gabriel) em Cozinha com ilha e Lavatório, com 6 imagens novas geradas pelo build.

## Contexto

- **Hoje:** a home (`src/app/page.tsx`, seção `#configurador`) usa `StoneSelector` (`src/components/configurador/StoneSelector.tsx`, componente de cliente). Ele lê `src/content/configurador.ts`: ambientes `cozinha` ("Cozinha com ilha") e `lavatorio` ("Lavatório"), materiais `rosado`, `bege`, `escuro`, e monta a URL `public/configurador/estatico/{ambiente}-{material}-{720|1280}.avif` (1280×720, 16:9). Essas 12 AVIF estão prontas no `public/`, sem original em `assets/` e sem o tratamento editorial. O link "Chamar no WhatsApp" usa `orcamentoConfigurador(escolha)`, que já põe o nome da combinação na mensagem ("Gostei desta referência: Cozinha com ilha / Calacatta."). As amostras de cor ficam em `src/app/globals.css` (`.stone-swatch [data-tone="rosado"]` etc.).
- `Configurador.tsx`, `ConfiguradorLoader.tsx`, `Seletor.tsx` e `Vista.tsx` (mesma pasta) **não são usados por nenhuma página**; não remova (fora do escopo), mas o TypeScript precisa continuar compilando com os ids novos.
- **Decisões:**
  - Materiais (entrevista): **Calacatta**, **Travertino**, **Preto São Gabriel**; ids `calacatta`, `travertino`, `preto-sao-gabriel`; escolha inicial `cozinha` + `calacatta`.
  - **D3 do PRD:** os originais vão para `assets/images/configurador-<ambiente>-<material>.png` (ex.: `configurador-cozinha-calacatta.png`) e o `scripts/build-images.mjs` grava também `public/configurador/estatico/<ambiente>-<material>-720.avif` e `-1280.avif` com o mesmo `editorialImage`; esses ids **não** geram as variantes de `/img/` nem entram no manifesto (o seletor não usa `<Foto>`). Motivo: segue a regra "original em assets, derivado gerado" sem mudar o código do cliente; ler o manifesto no seletor levaria os placeholders base64 para o JS da home e furaria a meta de 150 KB.
  - A legenda "Tom da pedra" vira **"Pedra"** (Vitor, 21/10).
  - As 12 AVIF antigas saem de `public/configurador/estatico/` (ficam no histórico do git).
- **Imagens (6):** 16:9, pelo menos 1280×720. Para a troca parecer o mesmo ambiente com outra pedra, gere a cozinha e o lavatório primeiro em Calacatta e depois peça ao Codex a mesma cena trocando só a pedra (`codex exec -i <cena aprovada>`). Travertino: travertino bege claro com veios horizontais (genérico; o nome no configurador é só "Travertino"). Preto São Gabriel: granito preto com pintas claras.
- **Regras (ADR-0001, princípio 6, skill `imagens`):** sem aviso de IA; sem logo, nome de cliente, pessoas, texto, marca legível ou obra identificada como da JK; referências da web só como cor e veio, fora do git, sem URL registrada e sem cópia próxima; nada da empresa vai ao gerador. `alt` descreve sem aviso, ex.: "Cozinha com ilha em Calacatta." (sem "Imagem ilustrativa" nem "Não representa obra ou catálogo da JK").
- **Ferramenta e protocolo:** Codex CLI 0.163 (`image_generation`, agente Astra); referências em `docs/trabalho/HU-0001-imagens-novas-catalogo/referencias/<id>/` e saídas em `.../geradas/<id>/` (ambas no `.gitignore`); modelo de prompt de ambiente aplicado em `docs/proposta/hu-0001-prompts.json`, chave `_modelos`; o Claude revisa; o Claude escolhe a mais próxima da pedra real, com segunda opinião do agy (decisão do Vitor, 21/10/2026); aprovada entra em `assets/images/` com linha em `docs/proposta/assets-licencas.md` (seção "HU-0001") e prompt completo no JSON.
- **Cores das amostras:** 3 hex novos, um por pedra, tirados da cor média da imagem aprovada; registrar o motivo no relatório (design system pede motivo para hex novo).
- **Conflito possível:** a T-0007 mexe no mesmo `StoneSelector.tsx` (texto "Composição ilustrativa..." e `alt`). Quem entrar depois resolve o conflito mantendo as duas mudanças.

## Arquivos / áreas prováveis

- `assets/images/configurador-*.png` — 6 originais
- `scripts/build-images.mjs` — saída do configurador e exclusão do `/img/`
- `src/content/configurador.ts` — ids, nomes, escolha inicial, comentário do topo sem "ilustrativas"
- `src/components/configurador/StoneSelector.tsx` — legenda "Pedra" e `alt`
- `src/app/globals.css` — `data-tone` das 3 pedras
- `public/configurador/estatico/` — remover as 12 AVIF antigas (as novas são geradas pelo build)
- `scripts/check-home.mjs`, `scripts/check-quote-scene.mjs` e `e2e/` se citarem `rosado`, `bege` ou `escuro`
- `docs/proposta/hu-0001-prompts.json`, `docs/proposta/assets-licencas.md`

## Insumos

nenhum

## Passos sugeridos

1. Gerar as 6 imagens pelo protocolo; prancha; escolha da mais próxima (Claude e agy).
2. Entrar com os originais e os registros; estender o `build-images.mjs`.
3. Trocar ids, nomes, escolha inicial, legenda, `alt` e amostras; remover as AVIF antigas.
4. `npm run build`, testes, capturas do configurador nas 5 larguras.

## Critérios de aceite

Numeração: CA-1 a CA-13 são os critérios da HU-0001 que esta task cumpre; CA-14 em diante existem só nesta task.

- **CA-7:** Dado o configurador, quando o visitante escolhe um ambiente (Cozinha com ilha, Lavatório) e uma pedra (Calacatta, Travertino, Preto São Gabriel), então a imagem e o nome trocam para a combinação escolhida, e o link de orçamento leva o nome da combinação. (HU CA-7)
- **CA-11:** Dada cada imagem nova, então tem linha em `assets-licencas.md` e entrada no JSON com ferramenta, prompt completo, data e arquivo; nada de `referencias/` ou `geradas/` versionado. (HU CA-11)
- **CA-14:** Dadas as candidatas de cada uma das 6 imagens, então a escolhida é a mais próxima da pedra real pela medida de cor e textura (scripts/comparar-imagens-geradas.mjs) e pela revisão visual do Claude, com o parecer cego do agy registrado no relatório (decisão do Vitor em 21/10/2026).
- **CA-15:** Dado o configurador ao carregar, então a escolha é Cozinha com ilha / Calacatta e a legenda do grupo de pedras é "Pedra".
- **CA-16:** Dado `npm run build`, então `public/configurador/estatico/` tem exatamente as 12 AVIF novas (6 combinações × 720 e 1280), geradas a partir de `assets/images/configurador-*`, e nenhuma com `rosado`, `bege` ou `escuro`; o manifesto não tem ids `configurador-*`.
- **CA-17:** Dado o `alt` da imagem do configurador, então ele descreve a combinação sem "ilustrativa", "gerada por IA" ou "não representa".

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-7 | interacao | Playwright rola até `#configurador`, toca em "Lavatório" e depois em "Preto São Gabriel", espera a imagem trocar; confere `src` (`lavatorio-preto-sao-gabriel`), a legenda "Lavatório / Preto São Gabriel" e o `href` do WhatsApp decodificado com esse nome; repete para as 6 combinações |
| CA-11 | integracao | script confere as 6 entradas no JSON e no `assets-licencas.md`; `git ls-files` limpo |
| CA-14 | manual | motivo: fidelidade é julgamento visual; a medida de cor e textura orienta e o parecer cego do agy fica no relatório |
| CA-15 | interacao | abre a home, confere o botão `aria-pressed="true"` em "Cozinha com ilha" e "Calacatta" e o texto da `legend` |
| CA-16 | integracao | lista `public/configurador/estatico/` depois do build e confere os 12 nomes; lê o manifesto |
| CA-17 | interacao | lê o `alt` depois de cada troca no teste do CA-2 |

**Dados e ambiente:** `npm run build` antes; Playwright com `scripts/preview-local.mjs` na porta 3105, desktop 1440×900 e celular 390×844.

## Fora do escopo

- Novos ambientes ou mais pedras no configurador.
- Remover os componentes não usados (`Configurador`, `Vista`, `Seletor`, `ConfiguradorLoader`).
- Textos com "ilustrativo" fora do configurador e o aviso do rodapé (T-0007).

## Diagnóstico

## Bloqueios

## Handoff

## Execução

### Execução · 2026-10-21

**Branch:** task/T-0006-configurador-tres-pedras (a partir de task/T-0005-capa-jornada-sem-video) · **PR:** não aberto (nível 0, sem push)

**O que mudou:**
- **Imagens:** `assets/images/configurador-{cozinha,lavatorio}-{calacatta,travertino,preto-sao-gabriel}.png`, 6 originais em 1672×941.
- **`scripts/build-images.mjs`:** os ids `configurador-*` viram `public/configurador/estatico/<ambiente>-<material>-<720|1280>.avif` (1280×720 e 720×405, AVIF q50, com o mesmo `editorialImage`). Ficam fora de `/img/` e do manifesto (PRD D3).
- **AVIF antigas:** as 12 de Rosado, Bege e Escuro saíram, e continuam no histórico do git. O deploy usa `rsync --delete`, então também saem do servidor.
- **`src/content/configurador.ts`:** ids e nomes Calacatta, Travertino e Preto São Gabriel, escolha inicial Cozinha com ilha / Calacatta, função nova `altEscolha()` e comentário do topo sem "ilustrativas".
- **`src/components/configurador/StoneSelector.tsx`:** a legenda passa a ser "Pedra" e o `alt` vem de `altEscolha()` ("Cozinha com ilha em Calacatta."), sem aviso. O texto "Composição ilustrativa..." fica para a T-0007, como previsto.
- **`src/app/globals.css`:** 3 hex novos de amostra. O motivo está nas decisões abaixo.
- **Registro e teste:**
  - `docs/proposta/hu-0001-prompts.json` e `assets-licencas.md` (subseção "T-0006");
  - `e2e/configurador.spec.ts` (novo).

**Imagens:**
- **Ambientes base:** a cozinha e o lavatório foram gerados primeiro em Calacatta, com 2 candidatas cada. Escolhi a cozinha 2 e o lavatório 1, porque têm a peça centrada, e o agy concordou.
- **Troca de pedra:** as 4 combinações restantes foram geradas a partir da cena escolhida (`-i`) com o close da pedra do catálogo, pedindo para trocar só a pedra. O ambiente ficou igual nas 3 versões.
- **Travertino:** a candidata 1 nos dois ambientes, escolha também do agy.
- **Preto São Gabriel:**
  - a primeira rodada saiu granulada demais, com cara de outro granito, e o agy apontou isso;
  - a segunda rodada saiu quase preta, com brilho esparso; escolhi a candidata 4 nos dois ambientes;
  - esta rodada não passou pelo agy, porque a cota dele acabou (erro 429, volta em cerca de 1 hora). O fato está registrado no JSON.

**Decisões tomadas:**
- **Hex das amostras:**
  - os valores: Calacatta `#e1dcd4`, Travertino `#ccbca9` e Preto São Gabriel `#100f0d`;
  - a origem: a cor média do close de cada pedra no catálogo, e não a cena aprovada, que a task sugeria. A face da peça na cena está na sombra da luz de fim de tarde e dava tons escuros e marrons (`#796655`, `#7a6652`) que não representam a pedra;
  - a visibilidade: o preto fica quase igual ao fundo, mas a amostra tem borda de 1 px (`#b6a79a`), então continua visível.
- **Datas:** corrigi os registros da T-0005 que eu tinha datado como 22/10; o dia certo é 21/10. A correção da task T-0005 está no commit `0b8eee8`. A dos registros em `hu-0001-prompts.json` e `assets-licencas.md` vai junto com este commit, porque são os mesmos arquivos.

**Verificação (testador):**

| CA | Tipo | Teste / como verifiquei | Pega? | Resultado |
|---|---|---|---|---|
| CA-7 | interacao | `e2e/configurador.spec.ts` "CA-7": clica nos 2 ambientes e nas 3 pedras. Em cada combinação confere `src` (`<ambiente>-<pedra>-1280.avif`), legenda, `alt` sem aviso e `href` do WhatsApp decodificado com o nome da combinação. No fim, volta por clique a Cozinha com ilha / Calacatta | sim: com "Preto São Gabriel" renomeado no código e recompilado, falha | passa (mobile e desktop) |
| CA-11 | integracao | `node scripts/check-imagens-geradas.mjs` → "OK: 53 imagem(ns) gerada(s) com registro completo." | sim (provado na T-0001) | passa |
| CA-14 | manual | motivo: fidelidade é julgamento visual. Revisão lado a lado e parecer cego do agy na rodada 1; a rodada 2 do Preto São Gabriel ficou sem agy (cota) | não se aplica | passa, com a ressalva |
| CA-15 | interacao | "CA-15": ao carregar, `aria-pressed="true"` em "Cozinha com ilha" e "Calacatta" e a `legend` das pedras com o texto "Pedra" | sim: com a escolha inicial trocada no código, falha | passa |
| CA-16 | integracao | "CA-16": `out/configurador/estatico` tem exatamente as 12 AVIF novas, os originais em `assets/images/configurador-*` batem com as 6 combinações e o manifesto não tem ids `configurador-*` | sim: com um arquivo `cozinha-rosado-720.avif` a mais, falha | passa |
| CA-17 | interacao | dentro do CA-7: o `alt` de cada combinação é "<ambiente> em <pedra>." e não tem aviso de IA | sim (o mesmo teste) | passa |

**Capturas:** configurador em 1440 e 390, com Preto São Gabriel selecionado, sem rolagem horizontal. Na home completa, em 5 larguras (`qa/capturas/t0006-home`), só aparecem os mesmos avisos de antes da task (alvos de 44 px contra os 48 px do script).

**Testes criados ou alterados:** `e2e/configurador.spec.ts`, com 3 testes por projeto e 6 no total.

**Linha de base:**

| | Antes | Depois |
|---|---|---|
| lint | 0 erros, 2 avisos | igual |
| build | passa | passa |
| e2e | 21 passaram, 1 pulado | 27 passaram, 1 pulado |

**Revisões:**
- **Código:** ajustes na volta 1, todos aplicados:
  - datas corrigidas para 21/10;
  - `alt` montado por `altEscolha()` no conteúdo;
  - o teste do CA-7 alcança a combinação inicial por clique, e o do CA-16 confere os originais.
- **Segurança:** não aplicável.

**Pendências / sugestões fora do escopo:**
- Rodar o agy na segunda rodada do Preto São Gabriel quando a cota voltar.
- Para a retrospectiva da HU: a skill `imagens` só descreve a saída em `public/img`. Falta registrar a exceção do configurador (PRD D3).

**Proposta para skills do projeto:** a mesma linha da retrospectiva acima, que depende do seu "sim".

## Roteiro de homologação

1. `npm run build`, depois `node scripts/preview-local.mjs`, e abrir `http://127.0.0.1:3105/#configurador`: começa em Cozinha com ilha / Calacatta.
2. Tocar em "Lavatório" e em cada pedra (Calacatta, Travertino, Preto São Gabriel): a imagem e a legenda trocam e o ambiente continua o mesmo.
3. Tocar em "Chamar no WhatsApp": a mensagem traz a combinação escolhida.

Resultado: <a marcar por quem homologa>

## Histórico

- 2026-10-21 · criada (backlog) · planejador
- 2026-10-21 · escolha das imagens delegada ao Claude, com segunda opinião do agy, em vez da aprovação por prancha · desenvolvedor (pedido na conversa da T-0001)
- 2026-10-21 · backlog → em-desenvolvimento · desenvolvedor (pedido na conversa: "T-0003 a T-0006")
- 2026-10-21 · execução na branch task/T-0006-configurador-tres-pedras (a partir de task/T-0005) · claude-code/opus
- 2026-10-21 · em-desenvolvimento → em-revisao · claude-code/opus · relatório na seção Execução; sem push (autonomia 0)
- 2026-10-21 · em-revisao → em-teste · desenvolvedor · movida no quadro do Batuta
