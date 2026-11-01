---
id: T-0013
titulo: "Navegação e cor: cabeçalho grafite, menu do celular, WhatsApp fixo, seta de voltar e faixas de cor"
hu: avulsa
trilha: micro
status: em-revisao
depende_de: []
cobre: []
complexidade: 5
risco: normal
sensivel: false
skills: [design-system, padroes-codigo, responsivo-desktop-mobile, testes, deploy]
criada_em: 2026-11-01
ferramenta: "claude-code/opus"
voltas: 1
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 10
testes_pegam: 2
revisao_humana: ""
homologacao: ""
---

# T-0013 · Navegação e cor: cabeçalho grafite, menu do celular, WhatsApp fixo, seta de voltar e faixas de cor

## Objetivo

Navegar pelo site no celular fica claro e bonito:
- **Topo fixo:** um cabeçalho que acompanha a rolagem.
- **Menu grafite:** organizado, com atalho para os materiais.
- **WhatsApp:** botão sempre à mão.
- **Seta de voltar:** em toda página que não é a inicial.

## Contexto

- **Pedidos do Vitor (01/11/2026):**
  - "quando eu tiver em outra tela que nao seja a principal coloca algo como uma setinha pra voltar"
  - "coloca botão do whatsapp fixo e coloca esse cabeçalho mais bonito tá bem estranho desse jeito"
  - "to falando do menu mobile, preciso de algo melhor o outro pode manter assim"
  - "mas o cabeçalho tá péssimo"
  - "deixa ele com cor diferente, contrastando com o resto do site, e o site tá muito branco como um todo se vc conseguir colocar alguma seções de outra cor, constratando um pouco ficaria melhor"
- **Como está hoje (`src/components/SiteHeader.tsx`, `globals.css`):**
  - Abaixo de 800 px, o topo tem só o monograma de 48 px e a palavra "Menu" em 13 px.
  - O topo não acompanha a rolagem.
  - O menu aberto é uma tela branca vazia: um "Fechar" pequeno no canto, três links em 24 px, um vão grande e o botão preto do WhatsApp lá embaixo.
  - O botão flutuante do WhatsApp só aparece depois de rolar e some quando outro botão de WhatsApp está na tela (`site-interactions.ts`).
- **Decisões do Vitor (01/11/2026, 2 rodadas):**
  - **Cabeçalho em grafite, no celular e no desktop (3ª rodada):**
    - Fundo `#10100f`, como o rodapé, com o texto do menu claro (`#eee5dc`) e o botão do WhatsApp em caramelo `#c9ab91` com texto escuro.
    - O monograma transparente fica sobre o grafite.
    - No desktop, a disposição continua a mesma: logo, menu e botão. Só a cor muda, e o cabeçalho passa a ficar fixo ao rolar.
    - Na home, começa transparente sobre a foto e fica grafite ao rolar.
  - **Topo do celular (abaixo de 800 px):**
    - Fixo ao rolar, grafite.
    - Monograma maior, com o nome "JK Mármores e Granitos" ao lado em texto.
    - Botão "Menu" com três tracinhos, com 44 px de alvo.
    - Na home, começa transparente sobre a foto e fica grafite ao rolar.
  - **Menu aberto do celular, grafite:**
    - Fundo `#10100f`, com os tokens do rodapé.
    - No topo, o logo original e "Fechar" com ×.
    - Links grandes na fonte dos títulos, numerados (01 A empresa, 02 Materiais, 03 Contato) e com filete entre eles.
    - Embaixo de Materiais, os 6 tipos de material como atalho.
    - Depois, telefone e endereço, e o botão do WhatsApp com ícone (caramelo com texto escuro, como o botão flutuante).
    - Abre deslizando, sem animação com `prefers-reduced-motion`.
  - **Botão flutuante do WhatsApp:**
    - Sempre visível desde a abertura da página, no celular e no desktop, no canto inferior direito, com o ícone.
    - Some só com o menu do celular aberto e quando o teclado do formulário está aberto (já é assim hoje).
  - **Faixas de cor (3ª rodada):**
    - Uma ou duas seções por página em tom pedra quente `#efe7dd` (token novo `--cor-pedra`), largura total:
      - Home: "Sua ideia começa aqui".
      - Materiais: "A matéria-prima...".
      - Categoria: "A escolha começa pelo seu projeto".
      - A empresa: "Projetos com identidade".
      - Contato: "Prepare seu primeiro contato".
    - As `.warm-section` passam de `#f6f3ef` para o pedra.
    - O bloco "Vamos conversar sobre seu projeto?" (`.contact-panel`) fica grafite em todas as páginas, emendando no rodapé, que continua grafite. A página termina num bloco escuro.
    - Contraste no pedra: texto 13,96:1, apoio 5,95:1, caramelo de texto 4,99:1, títulos de destaque 6,12:1. No grafite: texto 15,3:1, caramelo 8,8:1.
  - **Seta de voltar (páginas que não são a inicial):**
    - Fica acima do título, como link discreto.
    - Se a pessoa veio de outra página do site, a seta volta como o voltar do navegador e mostra o nome da página anterior (ex.: "← Materiais").
    - Se chegou de fora (Google, link direto), a seta vai para a página de cima, com o nome dela:
      - Categoria → Materiais.
      - Materiais, A empresa, Contato, Aplicações e Galeria → Início.
    - Sem JavaScript, a seta é um link comum para a página de cima.
- **Regra que muda (princípio 5, `metodo/projeto/principios.md`):**
  - Hoje: "Nenhum emoji ou ícone decorativo em texto, código, commit ou copy. Exceção: o ícone do WhatsApp nos botões que abrem o WhatsApp, para o visitante reconhecer o canal (ADR-0002, Vitor em 22/10/2026)."
  - Texto novo proposto: "... Exceções: o ícone do WhatsApp nos botões que abrem o WhatsApp (ADR-0002, Vitor em 22/10/2026) e os ícones funcionais do menu do celular, três linhas para abrir e × para fechar, sempre ao lado do texto 'Menu' e 'Fechar' (T-0013, Vitor em 01/11/2026)."
  - Ícones em SVG inline, monocromáticos (`currentColor`) e com `aria-hidden`. O nome acessível continua sendo o texto.
- **Design system (versão 2):**
  - Tokens existentes (grafite e caramelo do rodapé) e um novo, `--cor-pedra` `#efe7dd`.
  - A tabela de tokens e a seção "Mobile obrigatório" da skill `design-system` são atualizadas: cabeçalho grafite, faixas pedra e fechamento grafite.
  - Nada arredondado, exceto o botão flutuante, que já é assim.
  - Foco visível e alvos de 44 px.
  - A seção "Mobile obrigatório" da skill `design-system` é atualizada.

## Arquivos / áreas prováveis

- `src/components/SiteHeader.tsx`: topo do celular, botão Menu com ícone e menu grafite (links, categorias, contato, WhatsApp).
- `src/components/IconeMenu.tsx` (novo): três linhas e ×.
- `src/components/SetaVoltar.tsx` (novo): componente de cliente para o voltar do navegador e o nome da página anterior.
- `src/components/Institutional.tsx` (`PageIntro`), `src/components/PageView.tsx` e `src/app/not-found.tsx`: a seta acima do título.
- `src/components/SiteFooter.tsx` e `src/components/site-interactions.ts`: botão flutuante sempre visível.
- `src/app/globals.css`: estilos novos num bloco "T-0013".
- `metodo/projeto/principios.md`, `metodo/projeto/skills/design-system/SKILL.md` e os adaptadores regerados.
- `e2e/navegacao.spec.ts` (novo). `e2e/home.spec.ts` e `e2e/links.spec.ts` podem precisar de ajuste onde conferem o botão flutuante escondido.

## Insumos

nenhum

## Passos sugeridos

1. Topo do celular e menu grafite.
2. Botão flutuante sempre visível.
3. Seta de voltar.
4. Princípio 5 e skill `design-system`.
5. Testes de interação, capturas em 390, 360 e 768, e Lighthouse da home e de `/materiais/granito/`.
6. Com o "sim" do Vitor: push na `main` e merge na `versao-1`.

## Critérios de aceite

- **CA-1:** No celular, ao rolar qualquer página, o topo fica fixo com o monograma, o nome "JK Mármores e Granitos" e o botão "Menu" com três tracinhos.
- **CA-2:** No celular, ao tocar em "Menu", abre o menu grafite com os 3 links numerados, os 6 tipos de material, o telefone, o endereço e o WhatsApp. Ao tocar em um tipo de material, abre a página dele. "Fechar" fecha o menu.
- **CA-3:** Em qualquer página, desde a abertura, o botão flutuante do WhatsApp está visível no canto inferior direito, no celular e no desktop, e abre o WhatsApp.
- **CA-4:** Na página de uma categoria aberta a partir de Materiais, "← Materiais" aparece acima do título e volta para Materiais.
- **CA-5:** Na mesma página aberta direto (sem página anterior do site), a seta mostra "← Materiais" e leva a `/materiais/`. Em Materiais, A empresa e Contato abertos direto, ela mostra "← Início".
- **CA-6:** Na página inicial, não há seta de voltar.
- **CA-7:** No desktop, o cabeçalho é grafite, com a mesma disposição, e fica fixo ao rolar. Os testes de links (T-0008) e do tema (T-0009, ajustado às faixas) continuam passando, e o Lighthouse mobile mantém Acessibilidade 100 e CLS 0.
- **CA-8:** Em cada página, a faixa indicada fica em tom pedra na largura total, e o bloco "Vamos conversar" fica grafite, emendando no rodapé; os textos de todas as faixas mantêm contraste mínimo de 4,5:1.

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-1 | interacao | em 390, rola até o meio da página e confere o topo fixo, o nome e o botão com ícone (`aria-hidden`) |
| CA-2 | interacao | toca em Menu, confere fundo grafite, links numerados, 6 categorias, telefone, endereço e WhatsApp; toca em "Quartzitos" e chega em `/materiais/quartzito/`; abre de novo e fecha |
| CA-3 | interacao | abre 3 páginas sem rolar e confere o botão visível; o clique abre `wa.me` (roteado localmente) |
| CA-4 | interacao | vai a Materiais, clica no cartão de Granitos, confere "← Materiais" e clica, voltando a `/materiais/` |
| CA-5 | interacao | abre `/materiais/quartzito/` direto e confere "← Materiais" com `href` para `/materiais/`; abre `/sobre/` direto e confere "← Início" |
| CA-6 | interacao | confere que a home não tem a seta |
| CA-7 | integracao | suíte inteira mais Lighthouse; confere a cor do cabeçalho e que ele continua visível depois de rolar no desktop |
| CA-8 | interacao | navega pelo menu por 5 páginas, rola até a faixa e confere a cor de fundo, a largura total e o contraste dos textos (o CA-2 do `tema-claro` passa a calcular sobre o fundo real) |

**Dados e ambiente:** `npm run build` antes; Playwright com `scripts/preview-local.mjs`.

## Fora do escopo

- A disposição do cabeçalho do desktop.
- Textos e fonte.

## Execução

**Branch:** `task/T-0013-seta-voltar`, no worktree `../jk-t0013`, a partir de `origin/main` (690761e, com T-0010, T-0011 e T-0012). Sem push.

**O que mudou**
- `src/components/SiteHeader.tsx`:
  - Nome "JK Mármores / e Granitos" ao lado do monograma (só no celular, `aria-hidden`, porque o `alt` do logo já dá o nome).
  - Botão "Menu" e "Fechar" com ícone.
  - Menu do celular com links numerados, os 6 materiais (nomes curtos), telefone, endereço e WhatsApp com ícone.
- `src/components/IconeMenu.tsx` (novo): três linhas e ×, em SVG, com `currentColor` e `aria-hidden`.
- `src/components/SetaVoltar.tsx` e `src/lib/rotas.ts` (novos):
  - A seta lê a página anterior por `document.referrer`, com `useSyncExternalStore`, sem efeito nem diferença na hidratação. O `SiteLink` navega de forma nativa, então o `referrer` é sempre a página anterior.
  - Página do site conhecida: volta com `history.back()` e mostra o nome dela.
  - Senão, é um link para a página de cima.
  - Entra em `PageIntro` (Materiais, categorias, A empresa, Contato) e no topo padrão do `PageView` (Aplicações e Galeria).
- `src/components/SiteFooter.tsx`: o botão flutuante sai do servidor já visível, com o ícone, e funciona sem JavaScript.
- `src/components/site-interactions.ts`:
  - Saiu a lógica que escondia o botão flutuante (fora da capa, sobre textos, perto de outros botões). Agora ele some só com o menu aberto; o teclado do formulário continua escondendo pelo CSS.
  - Entrou a marca `data-rolado` no cabeçalho, para a home.
- `src/app/globals.css`, bloco "T-0013":
  - Cabeçalho grafite e fixo (na home, transparente até rolar), botão caramelo e foco caramelo no escuro.
  - Topo e menu do celular.
  - Seta de voltar.
  - Faixas `--cor-pedra` `#efe7dd`: `.warm-section`, `#orcamento` e `.material-detail` na largura total.
  - "Vamos conversar" em grafite com os tokens do rodapé.
  - `scroll-padding-top` e `scroll-margin`, para o cabeçalho fixo e o botão flutuante não cobrirem âncoras e foco.
- `metodo/projeto/principios.md`: princípio 5 com a exceção dos ícones do menu.
- Skill `design-system`: tokens `--cor-pedra`, cabeçalho e fechamento grafite, e a seção "Mobile obrigatório". Os adaptadores foram regerados.
- Testes:
  - `e2e/navegacao.spec.ts` (novo, 10 testes).
  - `e2e/links.spec.ts`: borda caramelo-clara no painel grafite; no levantamento do CA-11, o link é centralizado na tela antes do hover, porque o botão flutuante agora fica sempre no canto.
  - `e2e/tema-claro.spec.ts`: o CA-4 agora confere o menu grafite.

**O que os testes pegaram**
1. Com o menu aberto, o painel ficava por cima do "Fechar": uma regra antiga dava `z-index:1` ao botão aberto, e não dava para fechar tocando nele. Corrigido com `z-index:2`.
2. O lint barrou `setState` dentro do efeito da seta. A seta foi refeita com `useSyncExternalStore`.

**Verificação (01/11/2026)**
- `npm run lint`: 0 erros e 2 avisos antigos em `tools/higgsfield/`.
- `SITE_MODE=homolog npm run build` e `npx playwright test --workers=2`: 98 passaram e 6 foram pulados (testes só de celular ou só de desktop).
- `MSYS_NO_PATHCONV=1 SITE_MODE=producao npm run build`: ok, com `check-pendencias`, `check-avisos` e `check-pedras`.
- Lighthouse no build de produção:
  - Home: 100 no celular (LCP 1,00 s) e 100 no desktop.
  - Granito: entre 86 e 89 no celular (LCP de 3,54 a 3,78 s) e 100 no desktop.
  - A `main` atual, medida na mesma hora e na mesma máquina, deu LCP de 3,45 a 3,55 s no granito. A diferença, de 0,1 a 0,2 s, vem de um script a mais (a seta) e de cerca de 24 KB a mais de HTML (o menu). Os 3,18 s da T-0011 foram medidos com a máquina mais livre.
  - CLS 0 e Acessibilidade 100 nas medições.
- Capturas em `qa/capturas/T-0013/`, olhadas: topo do granito com a seta, rolagem com o topo fixo, menu aberto, home, fim da página A empresa, e dolomíticos no desktop.

| CA | Resultado | Evidência |
|---|---|---|
| CA-1 | ok | `navegacao` CA-1 |
| CA-2 | ok | `navegacao` CA-2 (abre, confere o conteúdo, vai a Quartzitos, abre e fecha) |
| CA-3 | ok | `navegacao` CA-3 (3 páginas sem rolar; o clique abre `wa.me`) |
| CA-4 | ok | `navegacao` CA-4 e CA-4b |
| CA-5 | ok | `navegacao` CA-5 |
| CA-6 | ok | `navegacao` CA-6 |
| CA-7 | ok | `navegacao` CA-7, a suíte inteira e o Lighthouse |
| CA-8 | ok | `navegacao` CA-8 (5 páginas: cor, largura total, contraste e fim grafite) |

## Histórico

- 2026-11-01 · criada (backlog) · claude-code/opus (entrevista micro com o Vitor, 2 rodadas)
- 2026-11-01 · escopo ampliado (3ª rodada): cabeçalho grafite no celular e no desktop, faixas pedra e fechamento grafite · claude-code/opus
- 2026-11-01 · backlog → em-desenvolvimento · desenvolvedor ("Aprovo, pode começar" na conversa, incluindo a exceção ao princípio 5 e as cores)
- 2026-11-01 · execução iniciada na branch task/T-0013-seta-voltar (a partir de origin/main, 690761e) · claude-code/opus
- 2026-11-01 · em-desenvolvimento → em-revisao · claude-code/opus · relatório na seção Execução; sem push
