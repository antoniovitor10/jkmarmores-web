---
id: T-0005
titulo: "Capa e jornada da pedra novas, em Calacatta e sem vídeo"
hu: HU-0001
trilha: funcionalidade
status: backlog
depende_de: [T-0001]
cobre: [CA-6, CA-10, CA-11]
complexidade: 5
risco: alto
sensivel: false
skills: [imagens, stack, padroes-codigo, design-system, responsivo-desktop-mobile, testes, anti-cara-de-ia]
criada_em: 2026-10-21
ferramenta: ""
voltas: null
bloqueios: null
ca_nao_verificados: null
testes_criados: null
testes_pegam: null
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
- **Ferramenta e protocolo:** Codex CLI 0.163 (`image_generation`, agente Astra); referências em `docs/trabalho/HU-0001-imagens-novas-catalogo/referencias/<id>/` e saídas em `.../geradas/<id>/` (ambas no `.gitignore`); modelo de prompt de ambiente aplicado em `docs/proposta/hu-0001-prompts.json`, chave `_modelos`; o Claude revisa; o Vitor aprova a prancha; aprovada entra em `assets/images/` com linha em `docs/proposta/assets-licencas.md` (seção "HU-0001") e prompt completo no JSON. Para os 4 quadros parecerem a mesma pedra, gere a partir de uma imagem-base (`-i`) do Calacatta aprovado.
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
2. Gerar o recorte mobile da capa e os 5 quadros; prancha com a capa do piloto; "sim" do Vitor. **Parar até a aprovação.**
3. Entrar com os arquivos e os registros; ajustar `build-images.mjs`.
4. Trocar a capa e desligar o vídeo; remover os mp4; ajustar `motion-network.ts` e os scripts.
5. `npm run build`, testes, capturas nas 5 larguras (skill `responsivo-desktop-mobile`), Lighthouse, varredura `anti-cara-de-ia` da home.
6. Medir de novo e comparar.

## Critérios de aceite

Numeração: CA-1 a CA-13 são os critérios da HU-0001 que esta task cumpre; CA-14 em diante existem só nesta task.

- **CA-6:** Dada a home, quando carrega, então a capa mostra `capa-calacatta` no desktop e `capa-calacatta-mobile` no celular (≤ 700 px), sem `<video>` na página. (HU CA-6)
- **CA-10:** Dado o celular (Pixel 7, 4G simulado do Lighthouse), então a home tem LCP até 2,0 s, CLS até 0,05 e até 1 MB no primeiro carregamento, com os números de antes e depois no relatório. (HU CA-10, parte da home)
- **CA-11:** Dada cada imagem nova, então tem linha em `assets-licencas.md` e entrada no JSON com ferramenta, prompt completo, data e arquivo; nada de `referencias/` ou `geradas/` versionado; `public/video/` sem mp4. (HU CA-11)
- **CA-14:** Dado o Vitor vendo a prancha, então ele aprova a capa (desktop e mobile) e os 5 quadros (ou o relatório registra o que foi refeito).
- **CA-15:** Dada a jornada, quando o visitante rola por ela, então os 4 quadros novos aparecem como imagens, com as transições de rolagem atuais, e nenhum vídeo é baixado (nenhuma requisição `.mp4`). (HU CA-6)
- **CA-16:** Dadas `/sobre/` e `/materiais/`, então mostram os quadros novos `sequencia-04-aplicada` e `sequencia-01-chapa`.
- **CA-17:** Dados os `alt` da capa e da jornada, então descrevem a imagem nova sem "gerada por IA", "ilustrativa" ou "não representa obra".

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-6 | interacao | Playwright abre a home em 1440×900 e em 390×844, confere o `currentSrc` da imagem da capa (id certo) e `document.querySelectorAll('video').length === 0` |
| CA-10 | integracao | Lighthouse mobile da home antes e depois, com a saída real no relatório |
| CA-11 | integracao | script confere as entradas no JSON e no `assets-licencas.md`; `git ls-files public/video` vazio |
| CA-14 | manual | motivo: aprovação visual do Vitor; fidelidade e gosto não se automatizam |
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

## Roteiro de homologação

## Histórico

- 2026-10-21 · criada (backlog) · planejador
