---
id: T-0005
titulo: "Capa e jornada da pedra novas, em Calacatta e sem vídeo"
hu: HU-0001
trilha: funcionalidade
status: em-revisao
depende_de: [T-0001]
cobre: [CA-6, CA-10, CA-11]
complexidade: 5
risco: alto
sensivel: false
skills: [imagens, stack, padroes-codigo, design-system, responsivo-desktop-mobile, testes, anti-cara-de-ia]
criada_em: 2026-10-21
ferramenta: "claude-code/opus (maestro e implementação) + codex (Astra, geração) + agy (segunda opinião)"
voltas: 1
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 4
testes_pegam: 4
revisao_humana: ""
homologacao: ""
---

# T-0005 · Capa e jornada da pedra novas, em Calacatta e sem vídeo

## Objetivo

A home abre com a capa nova (ambiente aplicado em Calacatta) e a jornada da pedra mostra 4 quadros novos de Calacatta como imagens, sem nenhum vídeo, mantendo as transições e as metas de desempenho.

## Contexto

- **Hoje:** a capa (`src/components/HomeHero.tsx`) usa `<Foto id="material-detalhe-quente" mobileId="capa-editorial-mobile" ... prioridade />`; `material-detalhe-quente` tem 2048×1152 e `capa-editorial-mobile` (900×1152) é um recorte feito por coordenadas fixas dentro de `scripts/build-images.mjs`. A capa já não usa vídeo. A jornada (`src/components/StoneJourney.tsx`, `src/components/journey-motion.ts`, conteúdo em `src/content/stone-journey.ts`) tem 4 quadros: `sequencia-01-chapa`, `sequencia-02-borda` (com `sequencia-02-borda-mobile`, 850×1063), `sequencia-03-acabamento`, `sequencia-04-aplicada`, todos 2752×1536, mais vídeos curtos em `public/video/jornada-*-editorial.mp4` ligados por `stoneJourneyVideo`.
- **Decisões (entrevista, esclarecimentos e PRD):**
  - Capa: **ambiente aplicado em Calacatta** (nova direção). A imagem `capa-calacatta` aprovada no piloto T-0001 é a base; esta task cria o recorte mobile.
  - Jornada: os **4 quadros em Calacatta**, contando a história da mesma pedra (chapa, borda, acabamento, peça aplicada), **mesmos ids de arquivo** (o original novo substitui o antigo em `assets/images/`; o antigo fica no histórico do git). Assim `/sobre/` (`sequencia-04-aplicada`) e o topo de `/materiais/` (`sequencia-01-chapa`) seguem os quadros novos sem mudança de código (esclarecimento E3).
  - **D4:** vídeos saem: `stoneJourneyVideo = null` (o `journey-motion.ts` já aceita `null` e fica no pôster com as transições de rolagem atuais). Todos os `public/video/*.mp4` saem do `public/` (ficam no histórico do git; originais de prova em `assets/provas/` continuam).
  - **D5:** recorte mobile vira arquivo: `assets/images/capa-calacatta-mobile.png`, entrando por `mobileId`. O recorte fixo de `material-detalhe-quente` sai do `build-images.mjs`, e `material-detalhe-quente` entra na lista de ids pulados (não apagar o original).
- **Imagens a gerar ou preparar:**

| id | O que mostra | Proporção e tamanho |
|---|---|---|
| `capa-calacatta-mobile` | recorte ou recomposição da capa para retrato, a pedra visível atrás do título e do CTA | ~0,78 (como a atual 900×1152), ≥ 900 px de largura |
| `sequencia-01-chapa` | chapa inteira de Calacatta em pé, num suporte, sala escura | 16:9 (atual 2752×1536) |
| `sequencia-02-borda` | borda de Calacatta e um pequeno recorte sobre uma bancada | 16:9 |
| `sequencia-02-borda-mobile` | o mesmo quadro em retrato | 4:5 (atual 850×1063) |
| `sequencia-03-acabamento` | close da textura polida do Calacatta sob luz lateral | 16:9 |
| `sequencia-04-aplicada` | ilha ou bancada de Calacatta num ambiente arquitetônico | 16:9 |

  O site é escuro (`#10100f`) e quente; os painéis da jornada têm 88svh com legenda sobre gradiente (deixar área calma embaixo). Proporção diferente da atual muda o `width/height` no manifesto e pode gerar CLS: manter as proporções da tabela e conferir as 5 larguras.
- **Regras (ADR-0001, princípio 6, skill `imagens`):** sem aviso de IA; sem logo, nome de cliente, pessoas, texto ou obra identificada como da JK; referências da web só como cor e veio, fora do git, sem URL registrada e sem cópia próxima; nada da empresa vai ao gerador. `alt` descreve sem dizer que é obra da JK e sem "ilustrativa", ex.: "Ilha de cozinha em mármore Calacatta, branco com veios dourados, sob luz lateral."
- **Ferramenta e protocolo:** Codex CLI 0.163 (`image_generation`, agente Astra); referências em `docs/trabalho/HU-0001-imagens-novas-catalogo/referencias/<id>/` e saídas em `.../geradas/<id>/` (ambas no `.gitignore`); modelo de prompt de ambiente aplicado em `docs/proposta/hu-0001-prompts.json`, chave `_modelos`; o Claude revisa; o Claude escolhe a mais próxima da pedra real, com segunda opinião do agy (decisão do Vitor, 21/10/2026); aprovada entra em `assets/images/` com linha em `docs/proposta/assets-licencas.md` (seção "HU-0001") e prompt completo no JSON. Para os 4 quadros parecerem a mesma pedra, gere a partir de uma imagem-base (`-i`) do Calacatta aprovado.
- **Desempenho (princípio 10, HU CA-10):** home no celular (Pixel 7, 4G simulado do Lighthouse) com LCP até 2,0 s, CLS até 0,05 e até 1 MB no primeiro carregamento. **Medir antes e depois** da troca e pôr os dois números no relatório. A capa é o LCP (`prioridade`). Se o gerador entregou a capa com menos de 1600 px, documentar a largura usada e a nitidez no 1440.
- `src/lib/motion-network.ts` procura o pôster por `/\/img\/(capa-|material-detalhe-quente-)/`; `capa-calacatta` casa com `capa-`. Tirar o trecho de `material-detalhe-quente-`.
- Scripts que falam de vídeo: `scripts/check-motion-network.mjs` testa um `.home-hero video` que já não existe; `check-short-motion.mjs`, `shorten-motion-videos.mjs`, `editorial-videos.mjs`, `report-home-light.mjs`, `capture-institutional.mjs` e `check-home.mjs` citam vídeo. Ajuste ou aposente os que testam vídeo na home e diga no relatório o que fez com cada um. Ferramentas que só produzem vídeo podem ficar.

## Arquivos / áreas prováveis

- `assets/images/capa-calacatta-mobile.png` (novo) e os 4 `sequencia-*` + `sequencia-02-borda-mobile` (substituídos)
- `src/components/HomeHero.tsx` — novo id, `mobileId` e `alt`
- `src/components/HomeHero.module.css` — conferir `object-position` e véu com a imagem nova
- `scripts/build-images.mjs` — tira o recorte fixo; pula `material-detalhe-quente`
- `src/content/stone-journey.ts` — `stoneJourneyVideo = null`, alts novos
- `src/lib/motion-network.ts` — regex do pôster
- `public/video/` — remover os mp4
- `scripts/check-*.mjs` citados acima, `e2e/home.spec.ts`
- `docs/proposta/hu-0001-prompts.json`, `docs/proposta/assets-licencas.md`

## Insumos

nenhum

## Passos sugeridos

1. Medir a home atual (Lighthouse mobile, peso do primeiro carregamento) e guardar o número.
2. Gerar o recorte mobile da capa e os 5 quadros; prancha com a capa do piloto; escolha da mais próxima (Claude e agy).
3. Entrar com os arquivos e os registros; ajustar `build-images.mjs`.
4. Trocar a capa e desligar o vídeo; remover os mp4; ajustar `motion-network.ts` e os scripts.
5. `npm run build`, testes, capturas nas 5 larguras (skill `responsivo-desktop-mobile`), Lighthouse, varredura `anti-cara-de-ia` da home.
6. Medir de novo e comparar.

## Critérios de aceite

Numeração: CA-1 a CA-13 são os critérios da HU-0001 que esta task cumpre; CA-14 em diante existem só nesta task.

- **CA-6:** Dada a home, quando carrega, então a capa mostra `capa-calacatta` no desktop e `capa-calacatta-mobile` no celular (≤ 700 px), sem `<video>` na página. (HU CA-6)
- **CA-10:** Dado o celular (Pixel 7, 4G simulado do Lighthouse), então a home tem LCP até 2,0 s, CLS até 0,05 e até 1 MB no primeiro carregamento, com os números de antes e depois no relatório. (HU CA-10, parte da home)
- **CA-11:** Dada cada imagem nova, então tem linha em `assets-licencas.md` e entrada no JSON com ferramenta, prompt completo, data e arquivo; nada de `referencias/` ou `geradas/` versionado; `public/video/` sem mp4. (HU CA-11)
- **CA-14:** Dadas as candidatas da capa mobile e dos 5 quadros, então a escolhida é a mais próxima da pedra real pela medida de cor e textura (scripts/comparar-imagens-geradas.mjs) e pela revisão visual do Claude, com o parecer cego do agy registrado no relatório (decisão do Vitor em 21/10/2026).
- **CA-15:** Dada a jornada, quando o visitante rola por ela, então os 4 quadros novos aparecem como imagens, com as transições de rolagem atuais, e nenhum vídeo é baixado (nenhuma requisição `.mp4`). (HU CA-6)
- **CA-16:** Dadas `/sobre/` e `/materiais/`, então mostram os quadros novos `sequencia-04-aplicada` e `sequencia-01-chapa`.
- **CA-17:** Dados os `alt` da capa e da jornada, então descrevem a imagem nova sem "gerada por IA", "ilustrativa" ou "não representa obra".

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-6 | interacao | Playwright abre a home em 1440×900 e em 390×844, confere o `currentSrc` da imagem da capa (id certo) e `document.querySelectorAll('video').length === 0` |
| CA-10 | integracao | Lighthouse mobile da home antes e depois, com a saída real no relatório |
| CA-11 | integracao | script confere as entradas no JSON e no `assets-licencas.md`; `git ls-files public/video` vazio |
| CA-14 | manual | motivo: fidelidade é julgamento visual; a medida de cor e textura orienta e o parecer cego do agy fica no relatório |
| CA-15 | interacao | rola a página pela jornada inteira registrando as requisições; confere os 4 quadros com os ids novos visíveis um a um e nenhuma requisição `.mp4` |
| CA-16 | interacao | abre `/sobre/` e `/materiais/` e confere o `currentSrc` das imagens |
| CA-17 | interacao | lê os `alt` na página e confere a ausência das palavras |

**Dados e ambiente:** `npm run build` antes; Playwright com `scripts/preview-local.mjs` na porta 3105; Lighthouse pela skill `responsivo-desktop-mobile`.

## Fora do escopo

- Vídeos novos.
- Mudar texto, layout ou movimento da capa e da jornada além do necessário para as imagens novas.
- Configurador (T-0006) e avisos do rodapé (T-0007).

## Diagnóstico

## Bloqueios

## Handoff

## Execução

### Execução · 2026-10-22

**Branch:** task/T-0005-capa-jornada-sem-video (a partir de task/T-0004-imagens-categorias) · **PR:** não aberto (nível 0, sem push)

**O que mudou:**
- **Imagens:**
  - `assets/images/capa-calacatta-mobile.png` (novo, 1122×1402);
  - `sequencia-01-chapa`, `sequencia-02-borda`, `sequencia-03-acabamento` e `sequencia-04-aplicada` substituídos com os mesmos ids (1672×941). Os originais de setembro continuam no histórico do git;
  - `sequencia-02-borda-mobile` substituído (1122×1402).
- **`src/components/HomeHero.tsx`:** a capa passa a usar `capa-calacatta` e `capa-calacatta-mobile`, com `alt` novo e sem aviso.
- **`src/content/stone-journey.ts`:** `stoneJourneyVideo = null`, alts novos e comentário sem "ilustrativo". Saiu o import `asset`, que ficou sem uso.
- **`src/lib/motion-network.ts`:** a regex do pôster virou `/\/img\/capa-/`.
- **`scripts/build-images.mjs`:** o recorte fixo de `material-detalhe-quente` saiu, e esse id entrou na lista de pulados. O original foi mantido em `assets/images/`.
- **Arquivos removidos do `public/`:**
  - os 21 `public/video/*.mp4`;
  - os derivados `material-detalhe-quente-*` e `capa-editorial-mobile-*` de `public/img/`.

  Todos ficam no histórico do git, e as provas originais continuam em `assets/provas/`.
- **Scripts:**

| Script | Destino | Motivo |
|---|---|---|
| `check-motion-network.mjs` | aposentado | testava `.home-hero video`, que já não existia antes desta task |
| `check-short-motion.mjs` | aposentado | idem, mais os vídeos da jornada |
| `audit-journey.mjs`, `check-cover.mjs` | aposentados | só faziam `import './check-short-motion.mjs'` |
| `report-institutional.mjs` | ajustado | a lista de comandos troca `audit-journey.mjs` por `npx playwright test e2e/capa-jornada.spec.ts` |
| `check-home.mjs`, `capture-institutional.mjs` | mantidos | conferem que não há `<video>`, o que continua valendo |
| `editorial-videos.mjs`, `shorten-motion-videos.mjs` | mantidos | ferramentas que só produzem vídeo |
| `report-home-light.mjs` | mantido | relatório histórico a partir de um JSON de auditoria |

- **Registro e teste:**
  - `docs/proposta/hu-0001-prompts.json` e `assets-licencas.md` (subseção "T-0005");
  - `e2e/capa-jornada.spec.ts` (novo).

**Imagens:**
- **Geração:** cada imagem saiu de 2 candidatas, geradas com a capa e o close de Calacatta já escolhidos como base, para a mesma pedra contar a sequência.
- **Acabamento:** precisou de uma segunda rodada. Na primeira, a superfície parecia papel amassado (o agy apontou, e conferi). Na segunda, a candidata 3 tinha uma faixa de luz vertical artificial, então ficou a 4.
- **Escolhidas:** capa mobile 2, chapa 2, borda 1, borda mobile 2, acabamento 4 e peça aplicada 2. Todas são as escolhas do agy, conferidas na folha de comparação.

**Achado:** a home mostra a jornada pelo `StoneEditorial`, com 4 painéis de imagem lazy. O `StoneJourney.tsx`, que usava os vídeos pelo `journey-motion.ts`, não está em nenhuma página. Ou seja, o vídeo da jornada já não aparecia na home antes desta task. Desligar o vídeo e remover os mp4 tira peso do repositório e do deploy, e as transições de rolagem do `StoneEditorial` não mudaram.

**Verificação (testador):**

| CA | Tipo | Teste / como verifiquei | Pega? | Resultado |
|---|---|---|---|---|
| CA-6 | interacao | `e2e/capa-jornada.spec.ts` "CA-6": `currentSrc` da capa é `capa-calacatta` no desktop e `capa-calacatta-mobile` no Pixel 7, e zero `<video>` | sim: com a imagem da capa trocada no HTML, falha | passa |
| CA-10 | integracao | Lighthouse mobile da home em produção, antes e depois (tabela abaixo) | não se aplica | ver nota |
| CA-11 | integracao | `node scripts/check-imagens-geradas.mjs` → "OK: 47"; `git ls-files public/video` vazio | sim (provado na T-0001) | passa |
| CA-14 | manual | motivo: fidelidade é julgamento visual. Revisão lado a lado e parecer cego do agy, registrados no JSON | não se aplica | passa |
| CA-15 | interacao | "CA-15": rola os 4 painéis; cada um entra na tela e carrega o id certo, com `width=1672` (só os quadros novos); zero `<video>` e nenhuma requisição `.mp4` | sim: com a largura antiga (2752) no HTML, falha | passa |
| CA-16 | interacao | "CA-16": `/sobre/` e `/materiais/` carregam `sequencia-04-aplicada` e `sequencia-01-chapa` com `width=1672` | sim: largura antiga no `/sobre/` → falha | passa |
| CA-17 | interacao | "CA-17", sem JavaScript: os `alt` da capa e da jornada têm mais de 10 caracteres, citam Calacatta e não têm aviso de IA | sim: "ilustrativa" no alt da capa → falha | passa |

**Medida de desempenho (CA-10), home no celular, Lighthouse em produção, mesma máquina:**

| | LCP | CLS | Peso do primeiro carregamento | Elemento do LCP |
|---|---|---|---|---|
| Antes (2 rodadas) | 2,0 s e 2,6 s | 0 | 286 KiB | H1 da capa |
| Depois (3 rodadas) | 1,5 s, 2,9 s e 2,9 s | 0 | 347 KiB | H1 da capa |

- O CLS ficou em 0 e o peso em 347 KiB, abaixo de 1 MB.
- O LCP oscila muito nesta máquina, de 1,5 a 2,9 s, tanto antes quanto depois, e o elemento continua sendo o título, não a imagem.
- Os 61 KiB a mais vêm da capa nova e dos quadros, que ficaram mais pesados (lazy e fora da primeira tela).
- Não dá para afirmar que a meta de 2,0 s é cumprida de forma estável nesta máquina, nem antes nem depois. É preciso medir de novo com a máquina livre ou num aparelho real, antes de publicar.
- **Nitidez:** a capa tem 1672 px de largura e gera até a variante de 1600 px, então fica nítida no 1440. A capa mobile vai até 768 px, como a antiga.

**Testes criados ou alterados:** `e2e/capa-jornada.spec.ts`, com 4 testes por projeto e 8 no total.

**Linha de base:**

| | Antes | Depois |
|---|---|---|
| lint | 0 erros, 2 avisos | igual |
| build | passa | passa |
| e2e | 13 passaram, 1 pulado | 21 passaram, 1 pulado |

**Revisões:**
- **Código:** ajustes na volta 1, todos aplicados:
  - aposentados os dois atalhos que importavam o script removido, e a referência a eles saiu do relatório institucional;
  - o teste do CA-15 passou a provar que os quadros são os novos.
- **Segurança:** não aplicável.

**Roteiro de homologação:** na seção própria.

**Pendências / sugestões fora do escopo:**
- O aviso "Imagem gerada por IA" em `/materiais/` e a legenda padrão do `Illustration` ficam para a T-0007.
- `StoneJourney.tsx` e `journey-motion.ts` são código morto, sem página. Vale remover numa task própria.

**Proposta para skills do projeto (depende do seu "sim"):**
- `metodo/projeto/skills/testes/SKILL.md`, linha 41: tirar o exemplo `scripts/check-motion-network.mjs`, que foi aposentado.
- `metodo/projeto/skills/imagens/SKILL.md`, seção Vídeos: "Desde a HU-0001 (D4) o site não publica vídeo: `public/video/` está vazio e `stoneJourneyVideo = null`. Originais de prova ficam em `assets/provas/`. Vídeo novo só com HU própria; ao voltar, segue as regras abaixo."

## Roteiro de homologação

1. `npm run build`, depois `node scripts/preview-local.mjs`, e abrir `http://127.0.0.1:3105/`: a capa mostra a cozinha com ilha em Calacatta, com o título legível. No celular, ou abaixo de 700 px, aparece a versão em retrato.
2. Rolar a home: os 4 painéis (Chapa, Borda, Acabamento, Peça aplicada) mostram o mesmo Calacatta, sem vídeo.
3. Abrir `/sobre/` e `/materiais/`: aparecem os quadros novos da peça aplicada e da chapa.

Resultado: <a marcar por quem homologa>

## Histórico

- 2026-10-21 · criada (backlog) · planejador
- 2026-10-21 · escolha das imagens delegada ao Claude, com segunda opinião do agy, em vez da aprovação por prancha · desenvolvedor (pedido na conversa da T-0001)
- 2026-10-21 · backlog → em-desenvolvimento · desenvolvedor (pedido na conversa: "T-0003 a T-0006")
- 2026-10-22 · execução iniciada na branch task/T-0005-capa-jornada-sem-video (a partir de task/T-0004-imagens-categorias) · claude-code/opus (maestro), codex (Astra), agy (segunda opinião)
- 2026-10-22 · em-desenvolvimento → em-revisao · claude-code/opus · relatório na seção Execução; sem push (autonomia 0)
