---
id: T-0002
titulo: "Catálogo por pedra nas páginas de categoria"
hu: HU-0001
trilha: funcionalidade
status: em-revisao
depende_de: [T-0001]
cobre: [CA-1, CA-2, CA-4, CA-5, CA-9, CA-10, CA-13]
complexidade: 5
risco: normal
sensivel: false
skills: [stack, padroes-codigo, conteudo, design-system, imagens, responsivo-desktop-mobile, testes, anti-cara-de-ia]
criada_em: 2026-10-21
ferramenta: "claude-code/opus"
voltas: 1
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 7
testes_pegam: 7
revisao_humana: ""
homologacao: ""
---

# T-0002 · Catálogo por pedra nas páginas de categoria

## Objetivo

As páginas de granito, mármore, quartzo e lâminas passam a listar as pedras da cliente em cartões com imagem, nome e botão de WhatsApp da pedra, no HTML estático.

## Contexto

- Site estático (Next.js 16, React 19, export em `out/`), conteúdo em `src/content/`. Hoje `/materiais/<slug>/` (`src/app/materiais/[slug]/page.tsx`) mostra só o texto da categoria e um `pendente(...)` de catálogo; as 6 categorias vêm de `materiaisCliente` em `src/content/cliente.ts` (slugs `marmore`, `granito`, `marmore-dolomitico`, `quartzito`, `quartzo`, `ultracompacto`).
- **Lista de pedras da cliente (19/10/2026), única fonte dos nomes.** Grafia corrigida sem mudar os nomes (Branco Itaúnas, Mármore, Calacatta, Café Imperial). Nenhum nome fora desta lista:

| Categoria (slug) | Grupo | Nome | slug da pedra |
|---|---|---|---|
| granito | | Branco Itaúnas | granito-branco-itaunas |
| granito | | Preto São Gabriel | granito-preto-sao-gabriel |
| granito | | Preto Absoluto | granito-preto-absoluto |
| granito | | Café Imperial | granito-cafe-imperial |
| granito | | Branco Pitaya | granito-branco-pitaya |
| granito | | Dallas | granito-dallas |
| granito | | Cinza Corumbá | granito-cinza-corumba |
| granito | | Verde Ubatuba | granito-verde-ubatuba |
| granito | | Siena | granito-siena |
| granito | | Branco Fortaleza | granito-branco-fortaleza |
| granito | | Cinza Andorinha | granito-cinza-andorinha |
| marmore | Mármores nacionais | Travertino Nacional | marmore-travertino-nacional |
| marmore | Mármores nacionais | Mármore Branco Rajado | marmore-branco-rajado |
| marmore | Mármores nacionais | Mármore Branco Pinta Cinza | marmore-branco-pinta-cinza |
| marmore | Mármores nacionais | Branco Paraná | marmore-branco-parana |
| marmore | Mármores nacionais | Paraná Matarazzo | marmore-parana-matarazzo |
| marmore | Mármores importados | Nero Marquina | marmore-nero-marquina |
| marmore | Mármores importados | Travertino Romano bruto | marmore-travertino-romano-bruto |
| marmore | Mármores importados | Carrara | marmore-carrara |
| marmore | Mármores importados | Crema Marfil | marmore-crema-marfil |
| marmore | Mármores importados | Calacatta | marmore-calacatta |
| quartzo | | Branco Super White | quartzo-branco-super-white |
| quartzo | | Bege (Capuccino) | quartzo-bege-capuccino |
| quartzo | | Cinza (Light Grey) | quartzo-cinza-light-grey |
| quartzo | | Branco Stellar | quartzo-branco-stellar |
| quartzo | | Cinza Stellar | quartzo-cinza-stellar |
| quartzo | | Preto Stellar | quartzo-preto-stellar |
| quartzo | | Calacatta | quartzo-calacatta |
| ultracompacto | | Lâmina branca | lamina-branca |
| ultracompacto | | Lâmina bege | lamina-bege |
| ultracompacto | | Lâmina cinza | lamina-cinza |
| ultracompacto | | Travertino | lamina-travertino |
| ultracompacto | | Calacatta | lamina-calacatta |
| ultracompacto | | Taj Mahal | lamina-taj-mahal |

  A imagem de cada pedra tem id `pedra-<slug da pedra>` (arquivo `assets/images/pedra-<slug>.png`). O piloto T-0001 entrega 3: `pedra-granito-preto-sao-gabriel`, `pedra-marmore-calacatta`, `pedra-granito-branco-itaunas`. As outras chegam pela T-0003.
- **Decisões do PRD copiadas:**
  - **D1:** pedras num arquivo próprio, ligado à categoria pelo slug; `cliente.ts` continua só com o texto da cliente. Sugestão: dados em `src/content/pedras.json` (para o script de checagem ler sem TypeScript) e tipo/funções em `src/content/pedras.ts`. Tipo: `{ slug, nome, categoria, grupo?, imagem, oculta? }`.
  - **D2:** pedra com `oculta: true` **ou** sem imagem no manifesto (`src/generated/images.json`) não renderiza. A checagem do build lista as pedras sem imagem como aviso (não falha).
  - **D7:** slug único com a categoria; cada cartão leva `data-pedra="<slug>"`. A checagem de oculta procura o slug, não o nome (há três "Calacatta").
- **Cartão:** imagem 4:5 (close da chapa polida), nome, botão/link "Chamar no WhatsApp". Sem página própria por pedra, sem texto descritivo por pedra (a cliente não mandou). `alt` descreve o que se vê sem dizer que é obra da JK, ex.: "Chapa polida de granito Preto São Gabriel, fundo preto com pintas claras."
- **WhatsApp:** `https://wa.me/5511967976902` com a mensagem "Olá, JK! Tenho interesse no(a) {nome}. Vi no site." Use `linkWhatsApp(mensagem, conteudo.empresa.whatsapp)` de `src/lib/whatsapp.ts`. **Nome repetido em mais de uma categoria** (hoje só "Calacatta") leva a categoria entre parênteses **só na mensagem**: "Olá, JK! Tenho interesse no(a) Calacatta (quartzo). Vi no site." Rótulos: mármore, quartzo, lâmina. O cartão mostra só o nome. Calcule a repetição a partir dos dados, não à mão.
- **Mármores:** um só bloco na página `/materiais/marmore/`, com dois grupos titulados "Mármores nacionais" e "Mármores importados".
- **Lâminas (`/materiais/ultracompacto/`):** acima dos 6 cartões, a linha "Acabamentos polido e acetinado."
- **Fim de cada lista:** a linha "Trabalhamos com outras pedras; pergunte pelo WhatsApp." com link de WhatsApp usando a mensagem de orçamento que a categoria já tem (`item.cta.mensagem`). Não criar mensagem nova.
- **Dolomíticos e quartzitos** não têm nomes na lista: nenhum cartão e nenhuma linha final nessas páginas (a imagem de topo vem na T-0004).
- **Pendência de catálogo:** hoje toda página de categoria mostra `institucional.catalogo` = `pendente('confirmar nomes comerciais de pedras e acabamentos trabalhados pela JK')`. Nas categorias com pedras, troque por um `pendente` só de acabamentos (ex.: "confirmar acabamentos trabalhados em granitos"); nas lâminas, nenhum (acabamentos vieram da cliente); em dolomíticos e quartzitos, `pendente` de nomes das pedras e acabamentos (pendência O2). Em produção `pendente` some do HTML (`npm run check:pendencias`).
- **Design system (versão 1, aprovada):** fundo escuro `#10100f`, títulos Bodoni Moda 400, corpo Source Sans 3, filetes de 1 px em vez de caixas, nada arredondado (`--raio: 0`), alvos de toque de 44 px, sem rolagem horizontal. Use só tokens de `src/app/globals.css`. Comece pela seção de design (abaixo) e compare com as capturas de `docs/auditorias/versao-1/materiais-*`.
- **Imagens:** só por `<Foto>` (`src/components/Foto.tsx`), `loading="lazy"` (padrão; nenhum cartão tem `prioridade`), `sizes` coerente com a grade.
- **Sitemap:** não muda (não há página por pedra). A checagem confere que nenhum slug de pedra vira URL no `out/sitemap.xml`.

### Seção de design (proposta; o implementador pode melhorar e descreve no relatório)

- Desktop (1440): grade de 4 colunas dentro de `.container`, imagem 4:5 no topo, nome abaixo (Bodoni Moda, tamanho de H3 já existente), link de texto "Chamar no WhatsApp" (`text-link`); filete de 1 px `--cor-borda` entre linhas. Mármores: título de grupo como H3/eyebrow acima de cada grade.
- 1000 e 800: 3 colunas. 700 e abaixo (390): 2 colunas, nome e link com alvo de 44 px.
- Linha final e linha de acabamentos em `--cor-muted`, corpo 16 px.

## Arquivos / áreas prováveis

- `src/content/pedras.json` e `src/content/pedras.ts` (novos) — dados, tipo, `pedrasVisiveis(categoria)`, mensagem do WhatsApp
- `src/components/PedraCatalogo.tsx` (novo) — componente de servidor dos cartões, grupos e linhas
- `src/app/materiais/[slug]/page.tsx` — usa o catálogo e a pendência ajustada
- `src/content/institucional.ts` — pendências de catálogo por categoria
- `src/app/globals.css` — estilos dos cartões, só com tokens
- `scripts/check-pedras.mjs` (novo) e `package.json` — checagem no fim do `build`
- `e2e/materiais.spec.ts` (novo)

## Insumos

- `cliente/zapmind-43286-desde-2026-09-28.txt` (fonte de texto, autorização sim): de onde veio a lista de 19/10. **Não precisa abrir**: a lista está copiada acima. O resto do arquivo é conversa pessoal e não vai para o código.

## Passos sugeridos

1. Ler as skills listadas e as capturas de `docs/auditorias/versao-1/materiais-*`.
2. Criar os dados e as funções (visíveis = não ocultas e com imagem no manifesto; mensagem com categoria só nos nomes repetidos).
3. Criar `PedraCatalogo` e ligar na página de categoria; ajustar as pendências.
4. Estilos na grade da seção de design.
5. `scripts/check-pedras.mjs`: para cada pedra oculta, falha se `data-pedra="<slug>"` aparecer em qualquer HTML de `out/`; para cada visível com imagem, falha se não aparecer em `out/materiais/<categoria>/index.html`; falha se algum slug de pedra aparecer no `out/sitemap.xml`; avisa as pedras sem imagem. Acrescentar ao fim do script `build`.
6. Escrever e rodar os testes; capturas nas 5 larguras e Lighthouse (skill `responsivo-desktop-mobile`); varredura `anti-cara-de-ia`.
7. Evidência do CA-4: marcar uma pedra com imagem como `oculta: true`, rodar `npm run build` e a checagem, mostrar a saída, desfazer.

## Critérios de aceite

Numeração: CA-1 a CA-13 são os critérios da HU-0001 que esta task cumpre; CA-14 em diante existem só nesta task.

- **CA-1:** Dada `/materiais/granito/`, `/materiais/marmore/`, `/materiais/quartzo/` ou `/materiais/ultracompacto/`, quando carrega, então mostra um cartão para cada pedra da tabela acima que tem imagem e não está oculta, com imagem, nome e botão de WhatsApp, e nenhum nome fora da tabela. (HU CA-1; com só as 3 imagens do piloto, aparecem 2 cartões em granito e 1 em mármore.)
- **CA-2:** Dado o cartão do Preto São Gabriel, quando o visitante toca em "Chamar no WhatsApp", então o link é `https://wa.me/5511967976902?text=` + "Olá, JK! Tenho interesse no(a) Preto São Gabriel. Vi no site." codificado; e no cartão do Calacatta de mármore a mensagem diz "Calacatta (mármore)". (HU CA-2)
- **CA-4:** Dada uma pedra com `oculta: true`, quando o site é gerado, então ela não aparece no HTML nem no sitemap, as outras continuam, e `npm run build` falha se ela aparecer. (HU CA-4)
- **CA-5:** Dado o fim de cada lista de pedras, então aparece "Trabalhamos com outras pedras; pergunte pelo WhatsApp." com link de WhatsApp. (HU CA-5)
- **CA-9:** Dado o JavaScript desligado, quando abro `/materiais/granito/`, então cartões, nomes, imagens e links de WhatsApp estão no HTML. (HU CA-9)
- **CA-10:** Dado o celular, então `/materiais/granito/` tem Lighthouse mobile 100 em Acessibilidade e SEO, sem rolagem horizontal em nenhuma das 5 larguras. (HU CA-10, parte do catálogo)
- **CA-13:** Dada `/materiais/ultracompacto/`, então "Acabamentos polido e acetinado." aparece acima dos cartões. (HU CA-13; os cartões das lâminas aparecem quando as imagens da T-0003 chegarem.)
- **CA-14:** Dada `/materiais/marmore/`, então os cartões ficam em dois grupos titulados "Mármores nacionais" e "Mármores importados", cada um só com as pedras do seu grupo.

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-1 | interacao | Playwright abre as 4 páginas; conta os `[data-pedra]` e compara com os dados (visíveis com imagem); confere que cada nome exibido está na lista |
| CA-2 | interacao | toca no link do cartão do Preto São Gabriel e do Calacatta de mármore (interceptando a navegação) e confere o `href` decodificado |
| CA-4 | integracao | a checagem roda no build; evidência: ocultar uma pedra temporariamente, build e checagem mostrando que ela sumiu e que o build falha se o HTML for adulterado para conter o slug; desfazer |
| CA-5 | interacao | em cada página com pedras, rola até o fim da lista, vê a linha e confere o link de WhatsApp |
| CA-9 | interacao | contexto Playwright com `javaScriptEnabled: false` abre `/materiais/granito/` e encontra cartões, `img` com `alt` e `href` de WhatsApp |
| CA-10 | integracao | Lighthouse mobile em `/materiais/granito/` (skill `responsivo-desktop-mobile`) e capturas nas 5 larguras, com a saída no relatório |
| CA-13 | interacao | abre a página das lâminas e confere a linha antes do primeiro cartão (ou antes da linha final, enquanto não houver cartões) |
| CA-14 | interacao | abre `/materiais/marmore/` e confere que os slugs de cada grupo batem com os dados |

**Dados e ambiente:** `npm run build` antes; o Playwright sobe `scripts/preview-local.mjs` na porta 3105 (`playwright.config.ts`). Imagens disponíveis: as 3 do piloto. Testes leem os dados de `src/content/pedras.json` para não fixar a contagem.

## Fora do escopo

- Gerar imagens (T-0001, T-0003) e imagem de categoria e de topo (T-0004).
- Página própria por pedra, texto descritivo por pedra, filtro ou busca.
- Nomes de dolomíticos e quartzitos.
- Mudar o texto institucional da cliente.

## Diagnóstico

## Bloqueios

## Handoff

## Execução

### Execução · 2026-10-21

**Branch:** task/T-0002-catalogo-por-pedra (a partir de task/T-0007-remover-avisos-ia) · **PR:** não aberto (nível 0, sem push)

**O que mudou:**
- **`src/content/pedras.json` (novo):** as 34 pedras da tabela, com slug, nome, categoria e grupo.
- **`src/content/pedras.ts` (novo):**
  - o tipo `Pedra`;
  - `pedrasVisiveis()`, que mostra só a pedra não oculta e com imagem no manifesto (D2);
  - `mensagemPedra()`, que põe a categoria só nos nomes repetidos (Calacatta em mármore, quartzo e lâmina);
  - `altPedra()`, `acabamentosCategoria`, `outrasPedras` e `tituloPedras`.
- **`src/components/PedraCatalogo.tsx` (novo):**
  - componente de servidor com cartões de imagem 4:5, nome em H3 e "Chamar no WhatsApp";
  - nos mármores, grupos com H2;
  - nas outras categorias, um H2 "Pedras" só para leitores de tela, para manter a ordem H1, H2, H3 que o Lighthouse exige;
  - a linha de acabamentos nas lâminas e a linha de outras pedras no fim.
- **`src/app/materiais/[slug]/page.tsx`:** o catálogo entra logo depois do topo, antes do texto da categoria. A pendência é por categoria e só aparece em homologação, sem deixar `<p>` vazio em produção.
- **`src/content/institucional.ts`:** `catalogoCategoria`, com pendência de acabamento em granitos, mármores e quartzos, nenhuma nas lâminas, e de nomes e acabamentos em dolomíticos e quartzitos (O2).
- **`src/app/globals.css`:** um bloco novo do catálogo, só com tokens. A regra de `.text-link` foi unificada com a de `.material-card`.
- **`src/components/site-interactions.ts`:** o botão fixo de WhatsApp no celular some enquanto o catálogo ocupa metade da tela, porque cada cartão já tem o seu. A varredura anti-cara-de-ia mostrou que ele cobria as amostras.
- **`scripts/check-pedras.mjs` (novo):** entra no fim do `build` (`check:pedras`).
- **Testes:** `e2e/materiais.spec.ts` é novo. O `e2e/configurador.spec.ts`, da T-0006 e fora da lista de arquivos desta task, recebeu um ajuste de estabilidade: espera a hidratação do seletor antes de clicar e dá 10 s para a troca da imagem. Sem isso, ele falhava de vez em quando com a suíte inteira em paralelo.

**Seção de design (como ficou):**
- **Grade:** 4 colunas no desktop; 5 nos grupos de mármore com 5 pedras, a partir de 1101 px, para não sobrar cartão sozinho; 3 colunas até 1000 px; 2 colunas até 700 px.
- **Cartão órfão no celular:** o último cartão ímpar ocupa a linha inteira, em 16:9.
- **Filetes e borda:** filete de 1 px (`--cor-borda`) em cima de cada cartão, e borda de 1 px na imagem, para as pedras pretas não sumirem no fundo.
- **Tipografia:** nome em Bodoni de 24 px (20 px no celular) e links de 44 px de altura.
- **Desvio da proposta:** a linha "Trabalhamos com outras pedras…" ficou como link inteiro em `--cor-caramelo`, sublinhado e com filete em cima, e não como texto em `--cor-muted`. É o único caminho para quem procura uma pedra fora da lista, e a varredura anti-cara-de-ia apontou que em cinza parecia nota de rodapé.

**Verificação (testador):**

| CA | Tipo | Teste / como verifiquei | Pega? | Resultado |
|---|---|---|---|---|
| CA-1 | interacao | `e2e/materiais.spec.ts` "CA-1": nas 4 páginas, o número de `[data-pedra]` bate com os dados (visíveis com imagem). Cada cartão tem H3 com o nome, `alt` e link `wa.me`, e nenhum nome fora da lista | sim: com o Verde Ubatuba oculto e recompilado, o granito cai para 10 cartões e o teste acompanha os dados | passa: 11 granitos, 10 mármores, 7 quartzos e 6 lâminas |
| CA-2 | interacao | "CA-2": toque no WhatsApp do Preto São Gabriel, com a navegação para o wa.me interceptada. A mensagem é "Olá, JK! Tenho interesse no(a) Preto São Gabriel. Vi no site.". Calacatta sai com "(mármore)", "(quartzo)" e "(lâmina)" conforme a categoria | sim (mensagens exatas) | passa |
| CA-4 | integracao | Verde Ubatuba com `oculta: true` → `npm run build` passa: "check-pedras: 33 pedra(s) no catálogo, 1 oculta(s)". Ele some de todo o `out/` (0 arquivos) e o granito fica com 10. Com o cartão dele recolocado no HTML, a checagem acusa "oculta, mas está em out\materiais\granito\index.html" e sai com 1. Com um slug de pedra no `sitemap.xml`, também sai com 1. Tudo desfeito, ela volta a 34 e sai com 0 | sim | passa |
| CA-5 | interacao | "CA-5": nas 4 páginas, a linha de outras pedras aparece, abaixo do último cartão, com link `wa.me` | sim (posição e link) | passa |
| CA-9 | interacao | "CA-9", sem JavaScript: o granito tem os cartões, `alt` com "granito" e o `href` do WhatsApp no HTML | sim | passa |
| CA-10 | integracao | Lighthouse mobile em produção: granito com Acessibilidade 100, SEO 100, Boas práticas 100 e CLS 0; mármore igual. Capturas em 5 larguras sem rolagem horizontal. A primeira medição deu Acessibilidade 98 pela ordem dos títulos, o que foi corrigido com o H2 | não se aplica | passa |
| CA-13 | interacao | "CA-13": "Acabamentos polido e acetinado." fica acima do primeiro cartão das lâminas, pela posição vertical | sim | passa |
| CA-14 | interacao | "CA-14": os slugs de cada grupo ("Mármores nacionais" e "Mármores importados") batem com os dados, na ordem | sim | passa |

**Regressão:** o CA-3 da T-0004 (dolomíticos e quartzitos sem cartão, com a pendência dos nomes) continua passando.

**Testes criados ou alterados:**
- `e2e/materiais.spec.ts`: 6 testes por projeto, 12 no total;
- `scripts/check-pedras.mjs`;
- `e2e/configurador.spec.ts`: o ajuste de estabilidade descrito acima.

**Linha de base:**

| | Antes | Depois |
|---|---|---|
| lint | 0 erros, 2 avisos | igual |
| tsc | passa | passa |
| build | passa | passa (com `check:pedras`) |
| e2e | 33 passaram, 1 pulado | 45 passaram, 1 pulado (3 rodadas seguidas) |

**Revisões:**
- **Código:** ajustes na volta 1, todos aplicados:
  - o CA-2 cobre a lâmina e intercepta a navegação;
  - o CA-5 confere a posição da linha;
  - o teste do configurador espera a hidratação, em vez de repetir o clique;
  - grupo vazio não renderiza;
  - a regra de CSS repetida foi unificada;
  - o tipo `Partial<Record<string, Pendente>>` agora é verificado pela página.
- **Anti-cara-de-ia:** aprovado com correções. Apliquei 4 das 5: o cartão órfão, a borda nas pedras escuras, o botão fixo que cobria o catálogo e o rótulo "PEDRAS" visível trocado pelo H2 só para leitores de tela.
  - A 5ª, regerar o Preto Absoluto e uniformizar a luz das amostras, é de imagem e fica para depois.
  - Notas mais baixas da varredura: identidade 5 e imagem 5. A seção é genérica por função; as amostras são geradas por IA (ADR-0001) e têm luz desigual entre si.
- **Segurança:** não aplicável.

**Pendências / decisões para o desenvolvedor:**
- **Imagens:** o Preto Absoluto quase não mostra textura, e a luz das amostras varia (algumas com brilho no canto, outras chapadas). Uma rodada de imagem resolveria. A cliente também deve confirmar o Travertino Nacional, que parece uma brecha.
- **Nomes da cliente:** "Mármore Branco Rajado" e "Mármore Branco Pinta Cinza" repetem "Mármore" dentro do grupo "Mármores nacionais", e "Travertino Romano bruto" tem minúscula. Mexer nisso precisa do seu "sim" (skill `conteudo`).

**Proposta para skills do projeto:** nenhuma.

## Roteiro de homologação

1. `npm run build`, depois `node scripts/preview-local.mjs`, e abrir `http://127.0.0.1:3105/materiais/granito/`: logo abaixo do topo aparecem os 11 granitos, com foto, nome e "Chamar no WhatsApp".
2. Tocar em "Chamar no WhatsApp" no Preto São Gabriel: abre o WhatsApp da JK com "Olá, JK! Tenho interesse no(a) Preto São Gabriel. Vi no site."
3. Abrir `/materiais/marmore/`: dois grupos, "Mármores nacionais" e "Mármores importados", com 5 pedras cada.
4. Abrir `/materiais/ultracompacto/`: a linha "Acabamentos polido e acetinado." e as 6 lâminas.
5. No fim de cada lista, o link "Trabalhamos com outras pedras; pergunte pelo WhatsApp."
6. No celular, rolar o catálogo: o botão fixo de WhatsApp some enquanto os cartões ocupam a tela.

Resultado: <a marcar por quem homologa>

## Histórico

- 2026-10-21 · criada (backlog) · planejador
- 2026-10-21 · backlog → em-desenvolvimento · desenvolvedor (pedido na conversa: "pode seguir" com a T-0002 e a T-0007)
- 2026-10-21 · execução iniciada na branch task/T-0002-catalogo-por-pedra (a partir de task/T-0007-remover-avisos-ia) · claude-code/opus
- 2026-10-21 · em-desenvolvimento → em-revisao · claude-code/opus · relatório na seção Execução; sem push (autonomia 0)
