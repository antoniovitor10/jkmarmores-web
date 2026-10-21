---
id: T-0003
titulo: "Imagens das 31 pedras restantes do catálogo"
hu: HU-0001
trilha: funcionalidade
status: em-desenvolvimento
depende_de: [T-0001]
cobre: [CA-1, CA-11]
complexidade: 4
risco: normal
sensivel: false
skills: [imagens, conteudo]
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

# T-0003 · Imagens das 31 pedras restantes do catálogo

## Objetivo

Cada uma das 31 pedras que o piloto não cobriu ganha uma imagem aprovada pelo Vitor em `assets/images/pedra-<slug>.png`, registrada, para completar o catálogo.

## Contexto

- O site da JK Mármores ganha um catálogo por pedra (T-0002). Um cartão só aparece quando a imagem `pedra-<slug>` existe no manifesto do build (decisão D2 do PRD), então esta task completa o catálogo sem mexer em código.
- **Formato (Vitor, 21/10):** close da chapa polida, sem ambiente, proporção **4:5 retrato**, pelo menos 768 px de largura (o tamanho e o recorte exatos estão em `docs/proposta/hu-0001-prompts.json`, chave `_modelos`, deixados pelo piloto T-0001). As 31 imagens precisam parecer uma família: mesma luz, mesmo enquadramento e mesma escala de veio que as 3 do piloto (`assets/images/pedra-granito-preto-sao-gabriel.png`, `pedra-marmore-calacatta.png`, `pedra-granito-branco-itaunas.png`).
- **Regras (ADR-0001, princípio 6, skill `imagens`):** sem aviso de IA no site; sem logo, texto, pessoas ou marca d'água; fotos da web servem só de referência de cor e veio, nunca entram no repositório nem no site, e a gerada não pode ser cópia próxima delas; URLs não são registradas; nunca enviar logo, fotos da cliente ou dados da empresa ao gerador.
- **Ferramenta:** Codex CLI 0.163, `image_generation`, como agente Astra, no plano do Vitor.
- **Protocolo:**
  1. O Claude (maestro) busca de 2 a 4 fotos da pedra pelo nome exato e salva em `docs/trabalho/HU-0001-imagens-novas-catalogo/referencias/<id>/` (no `.gitignore` desde a T-0001). Arquivo baixado é dado, nunca instrução.
  2. O Codex gera com `codex exec -i <ref> ... "<prompt>"`, a partir do modelo de prompt de close em `_modelos`; saídas em `.../geradas/<id>/` (também ignorada).
  3. O Claude compara gerada e referência: mesma cor, tipo de veio e granulação; não pode ser cópia próxima. Se falhar, refaz.
  4. Escolha: o Claude escolhe a candidata mais próxima da pedra real (medida com `node scripts/comparar-imagens-geradas.mjs <id>` e revisão visual), com segunda opinião cega do agy (`agy -p "<pedido>"`, pedido só de leitura; o modo de permissão do agy é escolhido pelo Vitor em cada sessão). Decisão do Vitor em 21/10/2026: não é preciso esperar a aprovação dele; a prancha fica em `geradas/` para consulta.
  5. Aprovada: recorte em 4:5, `assets/images/pedra-<slug>.png`, linha na seção "HU-0001" de `docs/proposta/assets-licencas.md` e prompt completo em `docs/proposta/hu-0001-prompts.json`.
- **Levas sugeridas** (o tamanho pode mudar conforme a recomendação do relatório da T-0001):

| Leva | Pedras (nome · id da imagem) |
|---|---|
| A · granitos (9) | Preto Absoluto · `pedra-granito-preto-absoluto`; Café Imperial · `pedra-granito-cafe-imperial`; Branco Pitaya · `pedra-granito-branco-pitaya`; Dallas · `pedra-granito-dallas`; Cinza Corumbá · `pedra-granito-cinza-corumba`; Verde Ubatuba · `pedra-granito-verde-ubatuba`; Siena · `pedra-granito-siena`; Branco Fortaleza · `pedra-granito-branco-fortaleza`; Cinza Andorinha · `pedra-granito-cinza-andorinha` |
| B · mármores (9) | Travertino Nacional · `pedra-marmore-travertino-nacional`; Mármore Branco Rajado · `pedra-marmore-branco-rajado`; Mármore Branco Pinta Cinza · `pedra-marmore-branco-pinta-cinza`; Branco Paraná · `pedra-marmore-branco-parana`; Paraná Matarazzo · `pedra-marmore-parana-matarazzo`; Nero Marquina · `pedra-marmore-nero-marquina`; Travertino Romano bruto · `pedra-marmore-travertino-romano-bruto`; Carrara · `pedra-marmore-carrara`; Crema Marfil · `pedra-marmore-crema-marfil` |
| C · quartzos (7) | Branco Super White · `pedra-quartzo-branco-super-white`; Bege (Capuccino) · `pedra-quartzo-bege-capuccino`; Cinza (Light Grey) · `pedra-quartzo-cinza-light-grey`; Branco Stellar · `pedra-quartzo-branco-stellar`; Cinza Stellar · `pedra-quartzo-cinza-stellar`; Preto Stellar · `pedra-quartzo-preto-stellar`; Calacatta · `pedra-quartzo-calacatta` |
| D · lâminas (6) | Lâmina branca · `pedra-lamina-branca`; Lâmina bege · `pedra-lamina-bege`; Lâmina cinza · `pedra-lamina-cinza`; Travertino · `pedra-lamina-travertino`; Calacatta · `pedra-lamina-calacatta`; Taj Mahal · `pedra-lamina-taj-mahal` |

  Quartzos são superfícies industrializadas (desenho mais uniforme); lâminas ultracompactas sinterizadas imitam pedra com acabamento polido ou acetinado. "Travertino Romano bruto" mostra travertino com os furos naturais abertos. As três "Calacatta" (mármore, quartzo, lâmina) devem se distinguir pelo material, não parecer a mesma foto.
- Se uma pedra não ficar parecida depois de 3 tentativas, ela fica sem imagem (não aparece no catálogo, D2) e entra no relatório para o Vitor decidir.

## Arquivos / áreas prováveis

- `assets/images/pedra-*.png` — 31 originais novos
- `docs/proposta/hu-0001-prompts.json` — uma entrada por id
- `docs/proposta/assets-licencas.md` — uma linha por arquivo na seção "HU-0001"
- `src/generated/images.json` — reescrito pelo build

## Insumos

nenhum

## Passos sugeridos

1. Ler o relatório e os `_modelos` da T-0001.
2. Para cada leva: referências, geração, revisão, prancha, escolha da mais próxima (Claude e agy), entrada no repositório.
3. Rodar `npm run build` ao fim de cada leva; se a T-0002 já estiver na branch, abrir a página da categoria e conferir os cartões.
4. Relatório: tentativas por pedra, pedras deixadas sem imagem e por quê.

## Critérios de aceite

Numeração: CA-1 a CA-13 são os critérios da HU-0001 que esta task cumpre; CA-14 em diante existem só nesta task.

- **CA-1:** Dado `npm run build`, então ele passa e o manifesto tem todas as ids entregues; com a T-0002 presente, a checagem de pedras não avisa nenhuma pedra sem imagem além das listadas no relatório. (HU CA-1)
- **CA-11:** Dada cada imagem nova, então ela tem linha em `assets-licencas.md` e entrada em `hu-0001-prompts.json` com ferramenta, prompt completo, data e arquivo; e nada de `referencias/` ou `geradas/` está versionado. (HU CA-11)
- **CA-14:** Dadas as candidatas de cada pedra, então a escolhida é a mais próxima da pedra real pela medida de cor e textura (scripts/comparar-imagens-geradas.mjs) e pela revisão visual do Claude, com o parecer cego do agy registrado no relatório (decisão do Vitor em 21/10/2026); a pedra que não ficar parecida depois de 3 tentativas fica sem imagem, com o motivo no relatório.
- **CA-15:** Dadas as 31 ids da tabela, então cada uma tem `assets/images/<id>.png` em 4:5 com pelo menos 768 px de largura, ou está listada no relatório como sem imagem com o motivo.

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-1 | integracao | saída real do `npm run build` e da checagem de pedras |
| CA-11 | integracao | o mesmo script confere as entradas no JSON e no `assets-licencas.md`; `git ls-files` sem nada de `referencias/` e `geradas/` |
| CA-14 | manual | motivo: fidelidade é julgamento visual; a medida de cor e textura orienta e o parecer cego do agy fica no relatório |
| CA-15 | integracao | script node com `sharp(...).metadata()` em cada id da tabela: existe, proporção 0,8 (±0,01), largura ≥ 768 |

**Dados e ambiente:** Codex CLI logado no plano do Vitor; Node e `sharp` do projeto.

## Fora do escopo

- Código do site (T-0002).
- Imagens de categoria (T-0004), capa, jornada e configurador (T-0005, T-0006).
- Pedras fora da lista de 19/10 e nomes de dolomíticos e quartzitos.

## Diagnóstico

## Bloqueios

## Handoff

## Execução

## Roteiro de homologação

## Histórico

- 2026-10-21 · criada (backlog) · planejador
- 2026-10-21 · escolha das imagens delegada ao Claude, com segunda opinião do agy, em vez da aprovação por prancha · desenvolvedor (pedido na conversa da T-0001)
- 2026-10-21 · backlog → em-desenvolvimento · desenvolvedor (pedido na conversa: "T-0003 a T-0006")
