---
id: T-0003
titulo: "Imagens das 31 pedras restantes do catálogo"
hu: HU-0001
trilha: funcionalidade
status: em-revisao
depende_de: [T-0001]
cobre: [CA-1, CA-11]
complexidade: 4
risco: normal
sensivel: false
skills: [imagens, conteudo]
criada_em: 2026-10-21
ferramenta: "claude-code/opus (maestro) + codex (Astra, geração) + agy (segunda opinião)"
voltas: 1
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 0
testes_pegam: 0
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

### Handoff · 2026-10-21 ~14h10 · claude-code/opus (maestro)

**Feito:**
- **Referências reais:** prontas para as 31 pedras, em `referencias/<id>/`, montadas por 4 subagentes, um por leva. Fotos que distorcem a pedra (tom desviado, grão diferente, luz azulada) ficam em `referencias/<id>/extra/`. Elas não são anexadas ao Codex nem entram na medida.
- **Candidatas:** de 2 a 4 por pedra, em `geradas/<id>/candidata-N.png`, todas em 1122×1402 (4:5). O prompt atual de cada pedra está em `geradas/<id>/prompt.txt`, e o da primeira rodada, quando houve, em `prompt-rodada-1.txt`.
- **Segunda rodada em 17 pedras:**
  - quartzos: Calacatta, Cinza Stellar e Preto Stellar;
  - mármores: Travertino Nacional, Pinta Cinza, Branco Paraná, Matarazzo, Travertino Romano bruto, Carrara e Crema Marfil;
  - granitos: Café Imperial, Branco Pitaya, Cinza Corumbá, Siena e Cinza Andorinha;
  - no piloto (T-0001): Preto São Gabriel e Branco Itaúnas.
- **Escolha:** feita para as 31 pelo Claude, com a medida de `node scripts/comparar-imagens-geradas.mjs <id>` e a comparação visual. A lista "id candidata | motivo" está em `geradas/_trabalho-t0003/escolhas-t0003.txt`, fora do git.
- **Scripts de lote** em `geradas/_trabalho-t0003/`, rodando da raiz do repositório:
  - `gerar.sh <id> [n]`: roda o Codex com as referências e copia as candidatas;
  - `lote.sh <paralelo> <n> <ids...>`: roda o `gerar.sh` em paralelo;
  - `folha.cjs <saida.png> <ids...>`: monta a folha de comparação.
- **Pedidos ao agy** prontos em `geradas/_trabalho-t0003/agy-1.txt` (15 pedras) e `agy-2.txt` (16 pedras).

**Falta, na ordem:**
1. Segunda opinião cega do agy. Rode `agy -p "$(cat .../agy-1.txt)"` e depois o `agy-2.txt`, uma parte de cada vez, em primeiro plano (o modo de permissão é decisão do Vitor). Compare o "mais_fiel" de cada pedra com a escolha da lista e, onde divergir, olhe as duas de perto antes de decidir.
2. Copie cada escolhida para `assets/images/<id>.png`.
3. Acrescente cada uma em `docs/proposta/hu-0001-prompts.json`: ferramenta, prompt (o do `prompt.txt`), `prompt_rodada_1` quando houver, data, tentativas, escolhida, arquivo, avaliação com o motivo da lista e o parecer do agy. Inclua também uma linha por arquivo na seção HU-0001 de `docs/proposta/assets-licencas.md`.
4. Rode `node scripts/check-imagens-geradas.mjs`, `npm run build` e `npm run lint`. Se a T-0002 já estiver na branch, abra as páginas de categoria.
5. Preencha a seção Execução (CA-1, CA-11, CA-14, CA-15) e mova para `em-revisao`.

**Branch e último commit:** task/T-0003-imagens-pedras-restantes · c512235. Nada da T-0003 foi commitado ainda: imagens e registros não entraram no repositório. Só este Handoff e o histórico estão alterados.

**Comandos que rodei e resultado:**
- O Codex gerou 108 imagens no total, sem falha de geração.
- A comparação rodou para todas as pedras.
- Build e lint não foram rodados nesta task, porque nada entrou no repositório.

**Decisões tomadas nesta sessão:**
- **Densidade nos prompts:** todos dizem a densidade de pintas ou veios em porcentagem e pedem "neutral natural color balance (not orange, not oversaturated)". Sem isso, o gerador deixou os travertinos, o Café Imperial e o Branco Paraná laranja demais.
- **Branco Pitaya:** escolhida a candidata 3, contra a medida. A medida favorece a 1 por causa da sombra nas fotos reais, mas a 1 tem veio de mármore, e a pedra real tem só pintas pretas.
- **Matarazzo e Branco Paraná:** separados de propósito. O Matarazzo não tem laranja e tem mais nuvem; o Branco Paraná tem pouco ocre.

**Dúvidas em aberto:** nenhuma que bloqueie. As pedras com menos certeza são Capuccino (o tom exato que a JK chama assim), Branco Paraná (muita variação entre lotes) e Siena. Vale a cliente olhar depois de no ar.

**Armadilhas:**
- **Memória da máquina.** A trava do Claude Code parou três vezes os comandos em segundo plano: dois lotes do Codex e o agy. Rode o Codex com no máximo 2 em paralelo e o agy em primeiro plano. Processos parados pela trava podem continuar vivos e gravar em `~/.codex/generated_images/<sessão>/`. O `gerar.sh` já copia as candidatas sozinho, então, antes de copiar de novo, confira com `cmp` para não duplicar.
- **Comparação com fotos de bancada:** a média com essas fotos fica mais escura e com menos detalhe, então a distância de cor engana nos brancos e pretos. Decida pela medida e pelo olho juntos.

Retomado em 2026-10-21 na mesma sessão, a pedido do Vitor; concluído abaixo.

## Execução

### Execução · 2026-10-21

**Branch:** task/T-0003-imagens-pedras-restantes (a partir de task/T-0001-piloto-geracao-codex) · **PR:** não aberto (nível 0, sem push)

**O que mudou:**
- `assets/images/`: 31 originais `pedra-*.png`, em 1122×1402 (4:5), com os ids da tabela.
- `public/img/` e `src/generated/images.json`: derivados gerados pelo build. São 124 arquivos (390 e 768 px, AVIF e WebP); o manifesto só ganhou ids.
- `docs/proposta/hu-0001-prompts.json`: 31 entradas com ferramenta, prompt da rodada escolhida, prompts das outras rodadas, data, tentativas, escolhida, arquivo e avaliação (motivo e parecer do agy).
- `docs/proposta/assets-licencas.md`: subseção "T-0003" com uma linha por arquivo.

**Como foi:**
1. **Referências:** 4 subagentes, um por leva, juntaram de 2 a 4 fotos reais por pedra, fora do git e sem URL registrada.
2. **Geração:** o Codex (Astra) gerou de 2 a 6 candidatas por pedra, 112 imagens no total.
3. **Rodadas extras:** segunda rodada em 16 pedras e terceira no Cinza Andorinha, com o prompt corrigido pela medida:
   - densidade de pintas ou veios em porcentagem;
   - "neutral color balance, not orange";
   - o tipo certo de desenho, por exemplo brecha no Bege Bahia e manchas alongadas no Pinta Cinza.
4. **Parecer do agy:** às cegas para as 31, incluindo a rodada final de cada uma. Ele concordou em 9 de cara; nas outras, olhei as duas lado a lado.
   - Fiquei com a escolha dele em 7: Nero Marquina 1, Branco Paraná 1, Carrara 1, Calacatta de quartzo 4, Café Imperial 4, Branco Pitaya 4 e Dallas 4.
   - Mantive a minha nas demais. No Cinza Stellar, a dele é da rodada 1, com 4 vezes mais brilho que o real.
   - O motivo de cada escolha está no campo `avaliacao` do JSON.

**Decisões tomadas:**
- **Branco Paraná na rodada 1:** a pedra real tem veio ocre visível, e a rodada 2 tirou ocre demais. O Matarazzo continua sem laranja, então as duas ficam diferentes.
- **Carrara na rodada 1:** o veio cinza suave dela é o da foto real da pedreira.
- **Crema Marfil 4:** conferida lado a lado com a foto real que o agy apontou. Não é cópia: o estilo é o mesmo, mas o desenho do veio é outro, e o alerta dele era sobre a candidata 3.
- **Memória da máquina:** a trava do Claude Code parou três comandos em segundo plano. A partir daí, o agy rodou em primeiro plano, em lotes de 4 pedras e com cópias JPEG de 640 px. Inteiro, o pedido passou do limite de 30 MB da mensagem.

**Verificação (testador):**

| CA | Tipo | Teste / como verifiquei | Pega? | Resultado |
|---|---|---|---|---|
| CA-1 | integracao | `npm run build` passa; o manifesto tem as 34 ids `pedra-` (31 novas e 3 do piloto). As páginas ainda não mostram os cartões, porque a T-0002 não está nesta branch | não se aplica | passa (o cartão aparece quando a T-0002 entrar) |
| CA-11 | integracao | `node scripts/check-imagens-geradas.mjs` → "OK: 35 imagem(ns) gerada(s) com registro completo." | sim (provado na T-0001: acusa registro faltando e referência versionada) | passa |
| CA-14 | manual | motivo: fidelidade é julgamento visual. Para cada pedra houve medida, revisão lado a lado e parecer cego do agy, e a escolha e o motivo estão no JSON | não se aplica | passa |
| CA-15 | integracao | o mesmo script mede 0,800 e 1122 px nas 31 | sim | passa |

**Testes criados ou alterados:** nenhum no repositório. Os scripts da T-0001 bastaram. Os auxiliares de lote ficam em `geradas/_trabalho-t0003/`, fora do git.

**Linha de base:**

| | Antes | Depois |
|---|---|---|
| lint | 0 erros, 2 avisos em `tools/higgsfield` | igual |
| build | passa | passa |
| e2e | 5 passaram, 1 pulado | igual |

Um script auxiliar `.cjs`, na pasta ignorada, fez o lint acusar erro; virou `.mjs` e o lint voltou à linha de base.

**Revisões:**
- **Código:** ajustes na volta 1, todos aplicados:
  - "16 pedras" no lugar de "15";
  - o parecer do agy sobre a rodada final do Dallas e do Cinza Andorinha;
  - o prompt descartado do Branco Paraná e do Carrara;
  - o esclarecimento do Crema Marfil.
- **Segurança:** não aplicável. Nada de URL, segredo ou marca de fabricante no registro.

**Roteiro de homologação:** na seção própria.

**Pendências / sugestões fora do escopo:**
- **Pedras com menos certeza, para a cliente olhar depois de no ar:** Capuccino (o tom que a JK chama assim), Branco Paraná (varia muito entre lotes), Siena e Cinza Andorinha (o agy notou grão "em pontinhos").
- **Cinza Stellar e Cinza Corumbá:** saíram um pouco mais neutros que o tom levemente azulado do real.

**Proposta para skills do projeto:** acrescentar na skill `imagens`, seção Codex (T-0003):
- "Para o agy, mande cópias JPEG de 640 px e lotes de até 4 pedras: o pedido inteiro passa do limite de 30 MB e do tempo de 10 min."
- "Com pouca memória livre, rode o Codex com no máximo 2 em paralelo e o agy em primeiro plano."

## Roteiro de homologação

Sem interface nesta task. As imagens aparecem nos cartões quando a T-0002 entrar.
1. Abrir `assets/images/pedra-*.png` (31 arquivos) e conferir cada imagem com o nome da pedra.
2. Rodar `node scripts/check-imagens-geradas.mjs` e ver "OK".
3. Para comparar com as fotos reais, as folhas de trabalho ficam em `docs/trabalho/HU-0001-imagens-novas-catalogo/referencias/` e `geradas/` (locais, fora do git).

Resultado: <a marcar por quem homologa>

## Histórico

- 2026-10-21 · criada (backlog) · planejador
- 2026-10-21 · escolha das imagens delegada ao Claude, com segunda opinião do agy, em vez da aprovação por prancha · desenvolvedor (pedido na conversa da T-0001)
- 2026-10-21 · backlog → em-desenvolvimento · desenvolvedor (pedido na conversa: "T-0003 a T-0006")
- 2026-10-21 · execução iniciada na branch task/T-0003-imagens-pedras-restantes (a partir de task/T-0001-piloto-geracao-codex, dependência em revisão) · claude-code/opus (maestro), codex (Astra), agy (segunda opinião)
- 2026-10-21 · handoff (parado a pedido do Vitor para liberar memória; 31 escolhas feitas, falta o parecer do agy e a entrada no repositório) · claude-code/opus
- 2026-10-21 · retomada e concluída; em-desenvolvimento → em-revisao · claude-code/opus · relatório na seção Execução; sem push (autonomia 0)
