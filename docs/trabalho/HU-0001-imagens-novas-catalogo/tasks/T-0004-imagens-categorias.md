---
id: T-0004
titulo: "Imagem própria para as 6 categorias de material"
hu: HU-0001
trilha: funcionalidade
status: backlog
depende_de: [T-0001]
cobre: [CA-3, CA-11, CA-12]
complexidade: 4
risco: normal
sensivel: false
skills: [imagens, stack, padroes-codigo, conteudo, design-system, responsivo-desktop-mobile, testes]
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
- **Ferramenta e protocolo:** Codex CLI 0.163 (`image_generation`, agente Astra). Referências em `docs/trabalho/HU-0001-imagens-novas-catalogo/referencias/<id>/`, saídas em `.../geradas/<id>/` (ambas no `.gitignore`), modelo de prompt de ambiente aplicado em `docs/proposta/hu-0001-prompts.json` chave `_modelos`; o Claude revisa contra as referências; o Vitor aprova a prancha das 6; aprovada entra em `assets/images/`, com linha em `docs/proposta/assets-licencas.md` (seção "HU-0001") e prompt completo no JSON.
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

1. Gerar as 6 imagens pelo protocolo; prancha; "sim" do Vitor. **Parar até a aprovação.**
2. Entrar com os arquivos e os registros.
3. Ligar as imagens no cartão e no topo; ajustar pendências de dolomíticos e quartzitos se a T-0002 ainda não fez.
4. Testes, capturas nas 5 larguras e Lighthouse de uma página de categoria.

## Critérios de aceite

Numeração: CA-1 a CA-13 são os critérios da HU-0001 que esta task cumpre; CA-14 em diante existem só nesta task.

- **CA-3:** Dadas `/materiais/marmore-dolomitico/` e `/materiais/quartzito/`, quando carregam, então mostram a imagem de topo e nenhum cartão de pedra; no build de homologação, a falta dos nomes aparece como pendência. (HU CA-3)
- **CA-11:** Dada cada imagem nova, então tem linha em `assets-licencas.md` e entrada no JSON com ferramenta, prompt completo, data e arquivo; nada de `referencias/` ou `geradas/` versionado. (HU CA-11)
- **CA-12:** Dada `/materiais/`, quando carrega, então cada um dos 6 cartões de categoria tem imagem própria, e a mesma imagem (mesmo id) aparece no topo da página daquela categoria. (HU CA-12)
- **CA-14:** Dado o Vitor vendo a prancha das 6 imagens, então ele aprova (ou o relatório registra o que foi refeito).
- **CA-15:** Dada uma página de categoria no celular, então não há CLS acima de 0,05 nem rolagem horizontal nas 5 larguras, e o Lighthouse mobile continua 100 em Acessibilidade e SEO.

## Testes

| CA | Tipo | O que o teste simula e confere |
|---|---|---|
| CA-3 | interacao | abre as duas páginas e confere imagem de topo presente e zero `[data-pedra]`; no build de homologação, confere o `data-pendente` correspondente |
| CA-11 | integracao | script confere as 6 entradas no JSON e no `assets-licencas.md` e `git ls-files` limpo |
| CA-12 | interacao | Playwright abre `/materiais/`, lê o `src` da imagem de cada cartão, toca no link do cartão, chega na categoria e confere que a imagem do topo tem o mesmo id |
| CA-14 | manual | motivo: aprovação visual do Vitor; fidelidade e gosto não se automatizam |
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

## Roteiro de homologação

## Histórico

- 2026-10-21 · criada (backlog) · planejador
