---
id: HU-0001
titulo: "Imagens novas do site e catálogo por pedra"
trilha: funcionalidade
status: planejada
prd: sim
criada_em: 2026-10-20
origem: "cliente, grupo do projeto no WhatsApp, 13/10 e 19/10/2026; entrevista com o Vitor em 20/10/2026"
rodadas_entrevista: 5
perguntas_entrevista: 17
---

# HU-0001 · Imagens novas do site e catálogo por pedra

## História

Como **quem procura uma marmoraria em Barueri e região**, quero **ver as pedras que a JK trabalha, com imagem e nome, e pedir orçamento de uma delas direto pelo WhatsApp**, para **escolher o material sem precisar ir até a loja só para saber o que existe**.

## Contexto

A cliente aprovou a versão 1 em 07/10/2026. Em 13/10 disse que "só falta colocarmos as imagens dos materiais" e que fotos tiradas por ela não teriam qualidade. Em 19/10 mandou a lista das pedras que trabalha. Hoje `/materiais/` mostra só as 6 categorias, sem imagem, e as páginas de categoria não têm foto. Capa, jornada e configurador usam imagens e vídeos gerados em setembro (pedra rosada, Rosado/Bege/Escuro). O Vitor decidiu trocar todas as imagens por novas, geradas pelo Codex (agente Astra), e retirar os avisos de IA (ADR-0001).

Lista da cliente (19/10), fonte dos nomes: `docs/insumos/brutos/cliente/atualizacoes.md`, consulta de 20/10.

## Critérios de aceite

- **CA-1:** Dada a página de uma categoria com nomes na lista (`/materiais/granito/`, `/materiais/marmore/`, `/materiais/quartzo/`, `/materiais/ultracompacto/`), quando ela carrega, então mostra um cartão por pedra (ou por cor, nas lâminas) da lista de 19/10, cada um com imagem, nome e botão de WhatsApp, e nenhum nome fora da lista.
- **CA-2:** Dado o cartão de uma pedra (ex.: Preto São Gabriel), quando o visitante toca no botão de WhatsApp, então abre `https://wa.me/5511967976902` com a mensagem "Olá, JK! Tenho interesse no(a) Preto São Gabriel. Vi no site." (com o nome daquela pedra).
- **CA-3:** Dadas as categorias sem nomes na lista (Mármores dolomíticos e Quartzitos naturais), quando a página carrega, então mostra a imagem de topo da categoria e nenhum cartão de pedra; em homologação, a falta dos nomes aparece como pendência (O2).
- **CA-4:** Dada uma pedra marcada como oculta no conteúdo, quando o site é gerado, então ela não aparece no cartão, no HTML nem no sitemap, e as outras continuam.
- **CA-5:** Dado o fim de cada lista de pedras, então aparece a linha "Trabalhamos com outras pedras; pergunte pelo WhatsApp." com link de WhatsApp.
- **CA-6:** Dada a home, quando carrega, então a capa mostra a imagem nova (ambiente aplicado) sem vídeo, e a jornada mostra os 4 quadros novos (chapa, borda, acabamento, aplicada) como imagens, sem vídeo, com as transições de rolagem atuais.
- **CA-7:** Dado o configurador, quando o visitante escolhe ambiente (Cozinha com ilha, Lavatório) e material (Calacatta, Travertino, Preto São Gabriel), então a imagem e o nome trocam para a combinação escolhida, e o link de orçamento leva o nome da combinação.
- **CA-8:** Dada qualquer página publicada, então não existe texto de aviso de IA ou de imagem ilustrativa (rodapé, legenda ou `alt` com "gerada por IA", "ilustrativa", "não representa obra").
- **CA-9:** Dado o JavaScript desligado, quando abro `/materiais/granito/`, então os cartões, nomes, imagens e links de WhatsApp estão no HTML.
- **CA-10:** Dado o celular (Pixel 7, 4G simulado do Lighthouse), então a home continua com LCP até 2,0 s, CLS até 0,05 e até 1 MB no primeiro carregamento, e `/materiais/granito/` tem Lighthouse mobile 100 em Acessibilidade e SEO.
- **CA-11:** Dada cada imagem nova em `assets/images/`, então ela tem entrada em `docs/proposta/assets-licencas.md` com ferramenta, prompt, data e arquivo, e nenhuma foto de referência da web está no repositório.
- **CA-12:** Dada `/materiais/`, quando carrega, então cada um dos 6 cartões de categoria tem imagem própria, e a mesma imagem aparece no topo da página daquela categoria.
- **CA-13:** Dada a página de Lâminas, então acima dos 6 cartões (Lâmina branca, Lâmina bege, Lâmina cinza, Travertino, Calacatta, Taj Mahal) aparece a linha "Acabamentos polido e acetinado."

## Decisões da entrevista

| Assunto | Decisão |
|---|---|
| Escopo | catálogo por pedra, a partir da lista de 19/10, e troca de todas as imagens do site |
| Origem das imagens | geração por IA com o Codex (agente Astra) |
| Fidelidade | o agente busca fotos de referência na web e passa ao gerador; elas não entram no site |
| Registro das referências | não registrar as URLs (ADR-0001) |
| Avisos | nenhum aviso de IA ou de imagem ilustrativa em lugar nenhum; princípio 6 reescrito (ADR-0001) |
| Aprovação | o Vitor aprova e publica; pergunta à cliente depois de no ar |
| Pedra reprovada pela cliente | sai do catálogo até ter imagem nova aprovada |
| Cartão | foto, nome e WhatsApp da pedra, na página da categoria; sem página própria por pedra |
| Categorias sem nomes | Dolomíticos e Quartzitos só com imagem de topo; Lâminas com um cartão por cor; pedido dos nomes em O2 |
| Capa | ambiente aplicado (nova direção; reabre a aprovação visual) |
| Configurador | Calacatta, Travertino e Preto São Gabriel em Cozinha com ilha e Lavatório (6 imagens) |
| Vídeos | saem: capa e jornada ficam só com imagens |
| Começo | piloto antes do volume: capa e 3 pedras (Preto São Gabriel, Calacatta, Branco Itaúnas) |

## Esclarecimentos

- E1 · As 6 categorias ganham imagem própria? → Sim: uma imagem por categoria, no cartão de `/materiais/` e no topo da página da categoria (CA-12; CA-3 fica coberto).
- E2 · Qual pedra na capa e na jornada? → Calacatta em tudo: a capa (ambiente aplicado) e os 4 quadros contam a história da mesma pedra.
- E3 · `/sobre/` e o topo de `/materiais/`, que usam quadros da jornada? → Seguem os quadros novos (mesmo id de arquivo), sem imagem extra.
- E4 · Cartões das Lâminas? → Um cartão por cor (Lâmina branca, Lâmina bege, Lâmina cinza, Travertino, Calacatta, Taj Mahal) e a linha "Acabamentos polido e acetinado." (CA-13).
- E5 · Como testar a pedra oculta (CA-4), se nenhuma está oculta hoje? → Premissa: um script de checagem confere que nenhuma pedra com `oculta: true` aparece em `out/`; na task, a evidência vem de ocultar uma pedra temporariamente, rodar o build e a checagem, e desfazer.

Volume previsto de imagens: 34 cartões (11 granitos, 10 mármores, 7 quartzos, 6 lâminas), 6 categorias, capa (mais recorte mobile), 4 quadros da jornada (mais o recorte mobile da borda) e 6 do configurador: cerca de 53 arquivos.

## Premissas aprovadas

- Grafia corrigida sem mudar os nomes: Branco Itaúnas, Mármore, Calacatta, Café Imperial.
- Mármores nacionais e importados ficam juntos na página de mármores, em dois grupos com esses títulos.
- Mensagem do WhatsApp por pedra: "Olá, JK! Tenho interesse no(a) {pedra}. Vi no site." Nome repetido em mais de uma categoria (Calacatta) leva a categoria entre parênteses só na mensagem: "Calacatta (quartzo)" (PRD, P1).
- Textos que usam "ilustrativo" sem ser aviso perdem só a palavra, sem fato novo; "Tom da pedra" vira "Pedra" (PRD, P2).
- Cartão de pedra: close da chapa polida em 4:5, sem ambiente. Imagem de categoria: superfície aplicada com uma pedra típica, em 4:5 (PRD, P3).
- O `alt` descreve a imagem sem dizer que é obra da JK.
- Nenhum texto descritivo por pedra (a cliente não mandou); só o nome.
- Imagens pelo pipeline atual (`assets/images/` → AVIF/WebP em `public/img/`), com lazy fora da primeira tela.

## Fora do escopo

- Página própria por pedra.
- Pedras fora da lista de 19/10 e nomes inventados para dolomíticos e quartzitos.
- Fotos reais de obras (V3) e das chapas (V4).
- Vídeos novos.
- Mudanças de texto institucional, layout das páginas ou design system além do necessário para os cartões.

## Dúvidas do cliente (se houver)

- Nomes de mármores dolomíticos e quartzitos que a JK trabalha (O2).
- Revisão das imagens depois de no ar: alguma pedra não parece com a real?

## Tasks

| Task | Título | Cobre | Depende de |
|---|---|---|---|
| [T-0001](tasks/T-0001-piloto-geracao-codex.md) | Piloto de geração de imagens com o Codex (Astra) | CA-11 | nenhuma |
| [T-0002](tasks/T-0002-catalogo-por-pedra.md) | Catálogo por pedra nas páginas de categoria | CA-1, CA-2, CA-4, CA-5, CA-9, CA-10, CA-13 | T-0001 |
| [T-0003](tasks/T-0003-imagens-pedras-restantes.md) | Imagens das 31 pedras restantes do catálogo | CA-1, CA-11 | T-0001 |
| [T-0004](tasks/T-0004-imagens-categorias.md) | Imagem própria para as 6 categorias de material | CA-3, CA-11, CA-12 | T-0001 |
| [T-0005](tasks/T-0005-capa-jornada-sem-video.md) | Capa e jornada da pedra novas, em Calacatta e sem vídeo | CA-6, CA-10, CA-11 | T-0001 |
| [T-0006](tasks/T-0006-configurador-tres-pedras.md) | Configurador com Calacatta, Travertino e Preto São Gabriel | CA-7, CA-11 | T-0001 |
| [T-0007](tasks/T-0007-remover-avisos-ia.md) | Remover os avisos de IA e de imagem ilustrativa do site | CA-8 | nenhuma |

## Fechamento

<Preenchido pela skill fechar-hu.>
