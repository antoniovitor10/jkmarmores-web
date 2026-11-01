---
id: T-0013
titulo: "Navegação e cor: cabeçalho grafite, menu do celular, WhatsApp fixo, seta de voltar e faixas de cor"
hu: avulsa
trilha: micro
status: backlog
depende_de: []
cobre: []
complexidade: 5
risco: normal
sensivel: false
skills: [design-system, padroes-codigo, responsivo-desktop-mobile, testes, deploy]
criada_em: 2026-11-01
ferramenta: "claude-code/opus"
voltas: 0
bloqueios: 0
ca_nao_verificados: 0
testes_criados: 0
testes_pegam: 0
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

## Histórico

- 2026-11-01 · criada (backlog) · claude-code/opus (entrevista micro com o Vitor, 2 rodadas)
- 2026-11-01 · escopo ampliado (3ª rodada): cabeçalho grafite no celular e no desktop, faixas pedra e fechamento grafite · claude-code/opus
