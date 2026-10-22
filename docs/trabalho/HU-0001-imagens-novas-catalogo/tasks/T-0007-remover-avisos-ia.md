---
id: T-0007
titulo: "Remover os avisos de IA e de imagem ilustrativa do site"
hu: HU-0001
trilha: funcionalidade
status: em-revisao
depende_de: []
cobre: [CA-8]
complexidade: 3
risco: normal
sensivel: false
skills: [conteudo, padroes-codigo, stack, imagens, testes]
criada_em: 2026-10-21
ferramenta: "claude-code/opus"
voltas: 0
bloqueios: 0
ca_nao_verificados: 1
testes_criados: 4
testes_pegam: 4
revisao_humana: ""
homologacao: ""
---

# T-0007 · Remover os avisos de IA e de imagem ilustrativa do site

## Objetivo

Nenhuma página publicada mostra aviso de IA ou de imagem ilustrativa (rodapé, legenda, `alt` ou texto), e o build falha se um aviso voltar.

## Contexto

- **Decisão (ADR-0001, aceita; princípio 6 reescrito com o "sim" do Vitor em 20/10/2026):** imagem gerada por IA entra no site **sem aviso** de IA ou de imagem ilustrativa, desde que não mostre logo, nome de cliente nem obra identificada como da JK. O `alt` descreve o que se vê sem dizer que é obra da JK. As imagens atuais (pedra rosada, quadros da jornada, configurador) já obedecem a isso; esta task tira os avisos delas agora, e as tasks T-0005 e T-0006 escrevem os `alt` das imagens novas.
- **Avisos a remover (levantados em 21/10):**
  - Rodapé: `illustrationNotice` em `src/content/illustration.ts` ("As imagens desta página são ilustrativas, geradas por IA, e não mostram obras da JK."), usado em `src/components/SiteFooter.tsx` no `.footer-bottom`. O rodapé fica só com "JK Mármores e Granitos".
  - `Illustration` em `src/components/Institutional.tsx`: valor padrão do `caption` "Imagem ilustrativa, gerada por IA. Não representa obra da JK.", que vira `alt` quando não há outro.
  - `src/app/materiais/page.tsx`: nota "Estudo ilustrativo de matéria. Imagem gerada por IA." sob a imagem da capa.
  - `src/content/index.ts`: `aberturaHome.avisoImagem` ("Imagem ilustrativa, gerada por IA") e `aberturaHome.alt` com "Imagem gerada por IA, não representa obra da JK". `aberturaHome` não parece usado por nenhum componente: confirme; se não for usado, tire só o aviso e o trecho do `alt`.
  - `alt` com aviso: `src/components/HomeHero.tsx` ("Imagem ilustrativa de pedra rosada..."), os 4 de `src/content/stone-journey.ts` ("Imagem ilustrativa de ...", "ambiente arquitetônico fictício"), `src/components/configurador/StoneSelector.tsx` ("Imagem ilustrativa: ... Não representa obra ou catálogo da JK."), `src/components/configurador/Vista.tsx` ("Imagem ilustrativa gerada por IA", componente sem uso, mas limpe também).
  - Comentários de código com "ilustrativ" em `src/content/configurador.ts` e `src/content/stone-journey.ts`: reescrever sem afirmar que são estudos ilustrativos.
- **Textos com "ilustrativo" que não são aviso (Vitor, 21/10: tirar só a palavra, sem acrescentar fato):**
  - `src/app/page.tsx`: "Compare tons em ambientes ilustrativos." → "Compare pedras em dois ambientes." (o resto da frase continua).
  - `StoneSelector.tsx`: "Composição ilustrativa. Consulte pedras específicas, disponibilidade e acabamentos com a JK." → "Consulte pedras específicas, disponibilidade e acabamentos com a JK."
  - `src/app/materiais/page.tsx`: "Explorar combinações ilustrativas" → "Explorar combinações".
  - `src/content/index.ts` (bloco "amostra"): "Imagens de tela e composições ilustrativas servem para explorar possibilidades." → "Imagens de tela servem para explorar possibilidades." O resto ("A cor e o desenho da chapa real devem ser conferidos antes da aprovação.") continua.
- **Novos `alt` sem aviso:** descrevem o que se vê, sem "ilustrativa", "gerada por IA", "não representa obra" e sem dizer que é obra da JK. Ex.: "Pedra rosada com veios caramelo sob luz rasante."; "Chapa clara com veios cinza, apoiada em um suporte numa sala escura."
- **Checagem no build:** `scripts/check-avisos.mjs` (novo) varre os `.html` e `.txt` de `out/` e falha se achar, sem diferenciar maiúsculas, "gerada por IA", "gerado por IA", "ilustrativ", "não representa obra" ou "nao representa obra". Entra no fim do script `build` do `package.json` (hoje `images:build && next build && check:pendencias`).
- Não depende de nenhuma imagem nova; pode ser feita antes das outras tasks. A T-0006 mexe no mesmo `StoneSelector.tsx`: quem entrar depois resolve o conflito mantendo as duas mudanças.

## Arquivos / áreas prováveis

- `src/content/illustration.ts` (remover se ficar sem uso), `src/components/SiteFooter.tsx`
- `src/components/Institutional.tsx`, `src/components/HomeHero.tsx`
- `src/content/index.ts`, `src/content/stone-journey.ts`, `src/content/configurador.ts`
- `src/components/configurador/StoneSelector.tsx`, `src/components/configurador/Vista.tsx`
- `src/app/page.tsx`, `src/app/materiais/page.tsx`
- `scripts/check-avisos.mjs` (novo), `package.json`
- `e2e/avisos.spec.ts` (novo)

## Insumos

nenhum

## Passos sugeridos

1. `grep -rniE "gerad[ao] por IA|ilustrativ|n[aã]o representa obra" src` para confirmar a lista acima.
2. Remover os avisos e reescrever os `alt` e os 4 textos.
3. Criar a checagem e pôr no `build`; provar que ela pega (reintroduzir um aviso temporariamente, ver o build falhar, desfazer).
4. `npm run lint`, `npm run build` (homologação e `SITE_MODE=producao`), testes.

## Critérios de aceite

Numeração: CA-1 a CA-13 são os critérios da HU-0001 que esta task cumpre; CA-14 em diante existem só nesta task.

- **CA-8:** Dada qualquer página publicada, então não existe texto de aviso de IA ou de imagem ilustrativa: nem no rodapé, nem em legenda, nem em `alt`, nem no texto ("gerada por IA", "ilustrativa", "não representa obra"). (HU CA-8)
- **CA-14:** Dado o rodapé de qualquer página, então mostra "JK Mármores e Granitos" e nenhum aviso sobre imagens.
- **CA-15:** Dados os 4 textos listados, então aparecem com a redação nova, e o aviso de conferir a chapa real continua em `/materiais/`.
- **CA-16:** Dado um aviso reintroduzido em qualquer arquivo que chegue ao `out/`, quando roda `npm run build`, então o build falha apontando o arquivo.

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-8 | interacao | Playwright lê o `out/sitemap.xml` (e as páginas fixas da homologação), abre cada página, rola até o fim, junta `innerText` do `body` e todos os `alt` e confere a ausência das expressões |
| CA-14 | interacao | abre a home e `/materiais/`, rola até o rodapé e confere o texto do `.footer-bottom` |
| CA-15 | interacao | abre a home e `/materiais/` e procura cada frase nova; confere a frase da chapa real |
| CA-16 | integracao | evidência: aviso reintroduzido temporariamente, saída do build falhando, desfeito, build passando |

**Dados e ambiente:** `npm run build` antes; Playwright com `scripts/preview-local.mjs` na porta 3105; rodar a checagem nos dois modos (homologação e `SITE_MODE=producao`).

## Fora do escopo

- Trocar imagens (T-0001, T-0003 a T-0006).
- Mudar outros textos institucionais.
- Remover os componentes do configurador sem uso.

## Diagnóstico

## Bloqueios

## Handoff

## Execução

### Execução · 2026-10-21

**Branch:** task/T-0007-remover-avisos-ia (a partir de task/T-0006-configurador-tres-pedras, porque as duas mexem no `StoneSelector.tsx`) · **PR:** não aberto (nível 0, sem push)

**O que mudou:**
- **Rodapé:** `src/components/SiteFooter.tsx` fica só com "JK Mármores e Granitos". O `src/content/illustration.ts`, sem mais uso, foi apagado.
- **`src/components/Institutional.tsx`:** o `Illustration` perdeu a legenda padrão com aviso. O `alt` vem da jornada, e na falta dela fica vazio.
- **`src/app/materiais/page.tsx`:** saiu a nota "Estudo ilustrativo de matéria. Imagem gerada por IA.", e "Explorar combinações ilustrativas" virou "Explorar combinações".
- **`src/app/page.tsx`:** "Compare tons em ambientes ilustrativos." virou "Compare pedras em dois ambientes."
- **`src/components/configurador/StoneSelector.tsx`:** "Composição ilustrativa. Consulte…" virou "Consulte pedras específicas, disponibilidade e acabamentos com a JK."
- **`src/components/configurador/Vista.tsx`:** o `alt` usa `altEscolha()`. O componente não tem uso, mas foi limpo também.
- **`src/content/index.ts`:**
  - no bloco "amostra", "Imagens de tela e composições ilustrativas servem…" virou "Imagens de tela servem…";
  - em `aberturaHome`, que não é usado, saiu `avisoImagem` e o `alt` ficou sem o aviso.
- **Build:** `scripts/check-avisos.mjs` é novo e entra no fim do `build` em `package.json` (`check:avisos`). Ele varre os `.html` e `.txt` de `out/`.
- **Teste:** `e2e/avisos.spec.ts` é novo.
- **Já limpos antes desta task:** os `alt` da capa, da jornada e do configurador foram limpos na T-0005 e na T-0006.

**Verificação (testador):**

| CA | Tipo | Teste / como verifiquei | Pega? | Resultado |
|---|---|---|---|---|
| CA-8 | interacao | `e2e/avisos.spec.ts` "CA-8": percorre as 12 páginas do sitemap de homologação, rola até o fim e confere o texto e todos os `alt` | sim: com o aviso de volta no rodapé, no código e recompilado, falha | passa (mobile e desktop) |
| CA-14 | interacao | "CA-14": o `.footer-bottom` da home e de `/materiais/` é exatamente "JK Mármores e Granitos" | sim (mesma prova) | passa |
| CA-15 | interacao + leitura de fonte | "CA-15": as 3 frases novas estão na home e em `/materiais/`. A 4ª ("Imagens de tela servem…") vive na seção "amostra" do conteúdo, que nenhuma página exibe (nem antes desta task), então é conferida na fonte. O conselho de ver a amostra real continua nas páginas de categoria ("Confira a amostra real antes de decidir.") | sim: com a frase antiga no HTML da home, falha | **parcial**: a parte "continua em /materiais/" não se aplica, porque o texto nunca esteve em `/materiais/` |
| CA-16 | integracao | Aviso reintroduzido no `SiteFooter.tsx` → `npm run build` falha: "check-avisos: 58 arquivo(s) com aviso…", apontando cada arquivo. Desfeito, o build passa em homologação e em `SITE_MODE=producao` ("nenhum aviso"). O script sai com 1 quando acha aviso e com 0 quando não acha | sim | passa |

**Testes criados ou alterados:** `e2e/avisos.spec.ts`, com 3 testes por projeto e 6 no total, e `scripts/check-avisos.mjs`.

**Linha de base:**

| | Antes | Depois |
|---|---|---|
| lint | 0 erros, 2 avisos | igual |
| build | passa | passa (com `check:avisos`) |
| e2e | 27 passaram, 1 pulado | 33 passaram, 1 pulado |

**Revisões:**
- **Código:** aprovado.
- **Observações aplicadas:** o regex do teste ficou igual ao do script, e entrou a conferência da frase da amostra real em `/materiais/marmore/`.
- **Segurança:** não aplicável.

**Pendências / decisões para o desenvolvedor:**
- **CA-15, leitura parcial:** a seção "Veja a amostra real" do conteúdo de `/materiais/` não aparece em nenhuma página. Se você quiser que ela apareça em `/materiais/`, é uma mudança de layout de página, fora desta task.
- **JavaScript do cliente:** o script lê só `.html` e `.txt`, como a task define. Um aviso que exista só no JavaScript do cliente passaria. Hoje nenhum `.js` de `out/` tem essas expressões. Dá para incluir `.js` se você quiser.

**Proposta para skills do projeto:** nenhuma.

## Roteiro de homologação

1. `npm run build`: o fim mostra "check-avisos: nenhum aviso de IA ou de imagem ilustrativa em out/."
2. Abrir a home, `/materiais/` e `/sobre/` e rolar até o rodapé: a última linha mostra só "JK Mármores e Granitos", sem aviso sobre imagens.
3. Na home, o configurador diz "Compare pedras em dois ambientes." e "Consulte pedras específicas, disponibilidade e acabamentos com a JK."

Resultado: <a marcar por quem homologa>

## Histórico

- 2026-10-21 · criada (backlog) · planejador
- 2026-10-21 · backlog → em-desenvolvimento · desenvolvedor (pedido na conversa: "pode seguir" com a T-0002 e a T-0007)
- 2026-10-21 · execução iniciada na branch task/T-0007-remover-avisos-ia (a partir de task/T-0006) · claude-code/opus
- 2026-10-21 · em-desenvolvimento → em-revisao · claude-code/opus · relatório na seção Execução (CA-15 parcial, ver pendências); sem push (autonomia 0)
