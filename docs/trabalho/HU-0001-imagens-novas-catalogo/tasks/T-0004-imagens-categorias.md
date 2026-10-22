---
id: T-0004
titulo: "Imagem própria para as 6 categorias de material"
hu: HU-0001
trilha: funcionalidade
status: em-teste
depende_de: [T-0001]
cobre: [CA-3, CA-11, CA-12]
complexidade: 4
risco: normal
sensivel: false
skills: [imagens, stack, padroes-codigo, conteudo, design-system, responsivo-desktop-mobile, testes]
criada_em: 2026-10-21
ferramenta: "claude-code/opus (maestro e implementação) + codex (Astra, geração) + agy (segunda opinião)"
voltas: 1
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 4
testes_pegam: 2
revisao_humana: ""
homologacao: ""
---

# T-0004 · Imagem própria para as 6 categorias de material

## Objetivo

Cada uma das 6 categorias ganha uma imagem gerada e aprovada, mostrada no cartão da categoria em `/materiais/` e no topo da página da categoria.

## Contexto

- As 6 categorias vêm de `materiaisCliente` em `src/content/cliente.ts`: `marmore` (Mármores nacionais e importados), `granito` (Granitos), `marmore-dolomitico` (Mármores dolomíticos), `quartzito` (Quartzitos naturais), `quartzo` (Quartzos), `ultracompacto` (Lâminas ultracompactas sinterizadas). Hoje os cartões de `/materiais/` (`src/components/MaterialCollection.tsx`) não têm imagem e a página da categoria (`src/app/materiais/[slug]/page.tsx`) começa por `PageIntro` sem foto.
- **Formato (Vitor, 21/10):** superfície **aplicada** (bancada, lavatório, piso ou parede) com uma pedra típica da categoria, proporção **4:5 retrato**, pelo menos 1200 px de largura (o topo da página pode ocupar meia tela no desktop). O **mesmo arquivo** serve ao cartão e ao topo. Ids: `categoria-<slug>` (ex.: `categoria-granito`), arquivo `assets/images/categoria-<slug>.png`.
- **Pedra de cada imagem:** para mármore, granito, quartzo e lâminas, usar uma pedra da lista da cliente (sugestão: mármore Carrara, granito Cinza Corumbá, quartzo Branco Stellar, lâmina Taj Mahal; o Vitor confirma na prancha). Para **dolomíticos e quartzitos não há nome** na lista: a imagem mostra uma pedra genérica do tipo (dolomítico: fundo branco com veio cinza suave; quartzito: veios amplos e translúcidos), e o `alt` não dá nome comercial.
- **Cena:** sem pessoas, texto, logo, marca legível ou qualquer coisa que identifique uma obra real; luz quente e rasante, coerente com a capa e a jornada (Calacatta, entregues pela T-0005) e com o site escuro. As 6 imagens precisam parecer uma família.
- **Dolomíticos e quartzitos (HU CA-3):** as páginas mostram só a imagem de topo e nenhum cartão de pedra (a T-0002 já não renderiza cartões nem linha final nelas); em homologação, a falta dos nomes aparece como pendência (O2) via `pendente(...)`. Se a T-0002 ainda não estiver na branch, esta task garante que a pendência dessas duas páginas fala de nomes das pedras e acabamentos.
- **Regras (ADR-0001, princípio 6, skill `imagens`):** sem aviso de IA; referências da web só como cor e veio, fora do git, sem URL registrada, sem cópia próxima; nada da empresa vai ao gerador. `alt` descreve sem dizer que é obra da JK, ex.: "Bancada de cozinha em mármore branco com veios cinza sob luz lateral."
- **Ferramenta e protocolo:** Codex CLI 0.163 (`image_generation`, agente Astra). Referências em `docs/trabalho/HU-0001-imagens-novas-catalogo/referencias/<id>/`, saídas em `.../geradas/<id>/` (ambas no `.gitignore`), modelo de prompt de ambiente aplicado em `docs/proposta/hu-0001-prompts.json` chave `_modelos`; o Claude revisa contra as referências; o Claude escolhe a mais próxima da pedra real, com segunda opinião do agy (decisão do Vitor, 21/10/2026); aprovada entra em `assets/images/`, com linha em `docs/proposta/assets-licencas.md` (seção "HU-0001") e prompt completo no JSON.
- **Código:** imagens só por `<Foto>` com `loading="lazy"`, exceto a do topo da categoria, que é a maior imagem da primeira tela (avaliar `prioridade` pelo LCP). Design system versão 1: filetes de 1 px, nada arredondado, só tokens de `globals.css`; compare com `docs/auditorias/versao-1/materiais-*`.

### Seção de design (proposta)

- `/materiais/`: cada cartão de categoria ganha a imagem 4:5 acima do número e do título; a grade atual se mantém.
- Página de categoria: no desktop, topo em 2 colunas (texto do `PageIntro` à esquerda, imagem 4:5 à direita); no mobile (≤ 700 px), imagem abaixo do título, largura total, sem empurrar o primeiro conteúdo útil para fora da primeira tela além do necessário.

## Arquivos / áreas prováveis

- `assets/images/categoria-*.png` — 6 originais
- `src/components/MaterialCollection.tsx` — imagem no cartão
- `src/app/materiais/[slug]/page.tsx` e, se preciso, `PageIntro` em `src/components/Institutional.tsx` — imagem de topo
- `src/content/cliente.ts` não muda (texto da cliente); o id da imagem pode ser derivado do slug
- `src/app/globals.css` — layout do topo
- `docs/proposta/hu-0001-prompts.json`, `docs/proposta/assets-licencas.md`
- `e2e/materiais-categorias.spec.ts` (novo) ou extensão do e2e de materiais

## Insumos

nenhum

## Passos sugeridos

1. Gerar as 6 imagens pelo protocolo; prancha; escolha da mais próxima (Claude e agy).
2. Entrar com os arquivos e os registros.
3. Ligar as imagens no cartão e no topo; ajustar pendências de dolomíticos e quartzitos se a T-0002 ainda não fez.
4. Testes, capturas nas 5 larguras e Lighthouse de uma página de categoria.

## Critérios de aceite

Numeração: CA-1 a CA-13 são os critérios da HU-0001 que esta task cumpre; CA-14 em diante existem só nesta task.

- **CA-3:** Dadas `/materiais/marmore-dolomitico/` e `/materiais/quartzito/`, quando carregam, então mostram a imagem de topo e nenhum cartão de pedra; no build de homologação, a falta dos nomes aparece como pendência. (HU CA-3)
- **CA-11:** Dada cada imagem nova, então tem linha em `assets-licencas.md` e entrada no JSON com ferramenta, prompt completo, data e arquivo; nada de `referencias/` ou `geradas/` versionado. (HU CA-11)
- **CA-12:** Dada `/materiais/`, quando carrega, então cada um dos 6 cartões de categoria tem imagem própria, e a mesma imagem (mesmo id) aparece no topo da página daquela categoria. (HU CA-12)
- **CA-14:** Dadas as candidatas de cada uma das 6 imagens, então a escolhida é a mais próxima da pedra real pela medida de cor e textura (scripts/comparar-imagens-geradas.mjs) e pela revisão visual do Claude, com o parecer cego do agy registrado no relatório (decisão do Vitor em 21/10/2026).
- **CA-15:** Dada uma página de categoria no celular, então não há CLS acima de 0,05 nem rolagem horizontal nas 5 larguras, e o Lighthouse mobile continua 100 em Acessibilidade e SEO.

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-3 | interacao | abre as duas páginas e confere imagem de topo presente e zero `[data-pedra]`; no build de homologação, confere o `data-pendente` correspondente |
| CA-11 | integracao | script confere as 6 entradas no JSON e no `assets-licencas.md` e `git ls-files` limpo |
| CA-12 | interacao | Playwright abre `/materiais/`, lê o `src` da imagem de cada cartão, toca no link do cartão, chega na categoria e confere que a imagem do topo tem o mesmo id |
| CA-14 | manual | motivo: fidelidade é julgamento visual; a medida de cor e textura orienta e o parecer cego do agy fica no relatório |
| CA-15 | integracao | capturas nas 5 larguras e Lighthouse mobile de uma página de categoria (skill `responsivo-desktop-mobile`) |

**Dados e ambiente:** `npm run build` antes; Playwright com `scripts/preview-local.mjs` na porta 3105; para o CA-3 em homologação, build sem `SITE_MODE=producao`.

## Fora do escopo

- Cartões de pedra (T-0002) e imagens das pedras (T-0003).
- Imagem de capa de `/materiais/` (segue `sequencia-01-chapa`, trocada pela T-0005).
- Nomes de dolomíticos e quartzitos.

## Diagnóstico

## Bloqueios

## Handoff

## Execução

### Execução · 2026-10-21

**Branch:** task/T-0004-imagens-categorias (a partir de task/T-0003-imagens-pedras-restantes) · **PR:** não aberto (nível 0, sem push)

**O que mudou:**
- `assets/images/categoria-*.png`: 6 cenas em 1200×1500 (4:5).
- `src/content/categorias.ts` (novo): id e `alt` da imagem de cada categoria. O `cliente.ts`, com o texto da cliente, não mudou.
- `src/components/MaterialCollection.tsx`: imagem no cartão só com a prop `comImagem`, que apenas `/materiais/` passa. A home mantém os cartões da versão aprovada. O cartão ganhou `data-categoria`.
- `src/components/Institutional.tsx`: `PageIntro` aceita `imagem` opcional e então monta duas colunas, com a imagem em `prioridade`. Sem `imagem`, a marcação não muda.
- `src/app/materiais/[slug]/page.tsx` passa a imagem da categoria; `src/app/materiais/page.tsx` passa `comImagem`.
- `src/app/globals.css`: bloco no fim (`.material-image`, `.intro-grid`, `.intro-image`), sem hex novo e nada arredondado. No mobile o topo recorta em 4:3 para não empurrar o conteúdo.
- `e2e/materiais-categorias.spec.ts` (novo).
- O registro foi feito em `docs/proposta/hu-0001-prompts.json` e `assets-licencas.md`.

**Imagens:**
- **Pedras usadas:** Carrara, Cinza Corumbá, Branco Stellar e lâmina Taj Mahal, com a foto real e o close já escolhido no catálogo como referência. Dolomíticos e quartzitos mostram uma pedra genérica do tipo, sem nome comercial.
- **Geração e escolha:** 2 candidatas por categoria. Usei a comparação relativa, porque a luz da cena muda a medida absoluta, mais a revisão visual e o parecer cego do agy.
- **Escolhidas:** mármore 2, granito 1, dolomítico 2, quartzito 2, quartzo 2 e lâminas 1.
- **Com o agy:** concordamos de cara em 3 categorias. Nas outras 3, fiquei com a escolha dele depois de olhar lado a lado: no granito, a 2 puxava para bege; no quartzito, a ponta do banco se fundia ao pilar na 1; na lâmina, a 2 tinha veios ramificados demais.

**Decisões tomadas:**
- As imagens foram ampliadas em 7% (de 1122×1402 para 1200×1500, lanczos3) para cumprir a largura mínima de 1200 px do topo. Não há detalhe novo, e isso está registrado no campo `tratamento` do JSON.
- Testei um recorte mobile em arquivo próprio para baixar o LCP. Não mudou nada (2,8 s), então desfiz o teste.

**Verificação (testador):**

| CA | Tipo | Teste / como verifiquei | Pega? | Resultado |
|---|---|---|---|---|
| CA-3 | interacao | `e2e/materiais-categorias.spec.ts` "CA-3": nas páginas de dolomíticos e quartzitos, imagem de topo carregada (id certo), zero `[data-pedra]` e o `data-pendente` dos nomes presente | sim: imagem do topo do quartzito tirada do HTML → falha; pendência trocada → falha | passa (mobile e desktop) |
| CA-11 | integracao | `node scripts/check-imagens-geradas.mjs` → "OK: 41 imagem(ns) gerada(s) com registro completo." | sim (provado na T-0001) | passa |
| CA-12 | interacao | "CA-12": abre `/materiais/`, lê o `currentSrc` de cada cartão, toca em "Conhecer…", chega na categoria e confere o mesmo id no topo. Sem JavaScript as imagens estão no HTML, e a home segue sem elas | sim: troca da imagem do topo do granito no HTML → falha ("Expected categoria-granito, Received categoria-marmore") | passa (mobile e desktop) |
| CA-14 | manual | motivo: fidelidade é julgamento visual. Comparação, revisão lado a lado e parecer do agy estão no JSON | não se aplica | passa |
| CA-15 | integracao | capturas em 5 larguras de `/materiais/granito/` e `/materiais/`, sem rolagem horizontal; Lighthouse mobile em produção em granito e quartzito: Acessibilidade 100, SEO 100, Boas práticas 100, CLS 0 | não se aplica | passa |

**LCP:**
- Medido em produção, no celular: 2,6 s nas duas páginas de categoria, estável em 3 rodadas; a imagem do topo é o LCP.
- Na mesma máquina e na mesma hora, a home mediu 2,6 s e `/contato/`, só texto, 2,4 s.
- **Conclusão:** a imagem acrescenta cerca de 0,2 s em relação a uma página só de texto. Os números absolutos estão inflados pela máquina, que estava com 0,1 GB de memória livre.
- A meta de 2,0 s (princípio 10) precisa ser medida de novo com a máquina livre, antes de publicar.

**Testes criados ou alterados:** `e2e/materiais-categorias.spec.ts`, com 4 testes por projeto e 8 no total.

**Linha de base:**

| | Antes | Depois |
|---|---|---|
| lint | 0 erros, 2 avisos | igual |
| build | passa | passa |
| e2e | 5 passaram, 1 pulado | 13 passaram, 1 pulado |

**Revisões:**
- **Código:** ajustes na volta 1, todos aplicados:
  - imagem fora da home, com a prop `comImagem`;
  - CA no nome dos testes;
  - tipo importado em vez de duplicado;
  - classe sem uso removida;
  - espaço entre colunas mais perto dos 80 px.
- **Segurança:** não aplicável.

**Pendências / sugestões fora do escopo:**
- Os avisos das capturas são anteriores à task: alvos de 44 px (padrão do projeto) contra os 48 px do script, "Contato" e "Galeria" com 43 px no menu, e a imagem lazy da capa de `/materiais/`. Esta última é trocada na T-0005.
- Rodar o CA-3 de novo depois que a T-0002 entrar: hoje o `[data-pedra]` ainda não existe no site.

**Proposta para skills do projeto:** nenhuma.

## Roteiro de homologação

1. `npm run build`, depois `node scripts/preview-local.mjs`, e abrir `http://127.0.0.1:3105/materiais/`: cada um dos 6 cartões tem foto.
2. Tocar em "Conhecer granitos": o topo mostra a mesma foto ao lado do título no desktop, e abaixo dele no celular.
3. Abrir `/materiais/marmore-dolomitico/` e `/materiais/quartzito/`: há foto no topo e nenhum cartão de pedra.
4. Abrir a home: os cartões de materiais continuam sem foto, como na versão aprovada.

Resultado: <a marcar por quem homologa>

## Histórico

- 2026-10-21 · criada (backlog) · planejador
- 2026-10-21 · escolha das imagens delegada ao Claude, com segunda opinião do agy, em vez da aprovação por prancha · desenvolvedor (pedido na conversa da T-0001)
- 2026-10-21 · backlog → em-desenvolvimento · desenvolvedor (pedido na conversa: "T-0003 a T-0006")
- 2026-10-21 · execução na branch task/T-0004-imagens-categorias (a partir de task/T-0003) · claude-code/opus
- 2026-10-21 · em-desenvolvimento → em-revisao · claude-code/opus · relatório na seção Execução; sem push (autonomia 0)
- 2026-10-21 · em-revisao → em-teste · desenvolvedor · movida no quadro do Batuta
