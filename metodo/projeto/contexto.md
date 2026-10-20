# Contexto do projeto

## O que é

Site institucional da JK Mármores e Granitos, marmoraria no Parque Viana, Barueri/SP. Next.js estático (sem WordPress, sem CMS), publicado em https://jkmarmores.com.br.

Fonte da verdade do escopo: `docs/ESCOPO.md` (arquitetura de páginas, metas técnicas, fases e a tabela de decisões de 25/09 a 02/10/2026). Pendências com a cliente: `docs/PENDENCIAS.md`. Se algo aqui conflitar com o escopo, vale o escopo; se o escopo não responder, pergunte ao Vitor.

## Para quem (cliente e usuários)

- Cliente: JK Mármores e Granitos. Pedido de Lucas (grupo Lucas Solutions) em 11/09/2026; o site é da marmoraria da esposa dele, que fala com o Vitor no grupo de WhatsApp do projeto (conversa 43286 no ZapMind).
- Usuários: quem procura marmoraria em Barueri e região (São Paulo, Grande SP, ABC, interior, litoral norte e Baixada Santista) para projeto residencial, comercial ou industrial.

## Objetivo do negócio

1. A empresa voltar a ser encontrada no Google (busca local e Maps).
2. Gerar pedidos de orçamento com caminho curto até o WhatsApp (wa.me/5511967976902).

## Estado em 2026-10-20

- Produção na raiz desde 02/10/2026 com a **versão 1** (escura), aprovada pela cliente. Ela pediu **imagens novas**; o pedido ainda vai virar HU e tasks (ler a conversa no ZapMind antes).
- `/1/`, `/2/` e `/3/` são as três versões que a cliente comparou, publicadas pelas branches `versao-1/2/3` em homologação (noindex).
- A `main` remota já estava em `694cd01`, igual à `producao`; só a `main` local deste worktree estava 12 commits atrás e foi avançada no onboarding. As tasks saem da `main`; a branch `producao` fica como histórico do lançamento.
- Pendências P0 abertas no lançamento (ver `docs/PENDENCIAS.md`): CEP e atendimento no local, Perfil da Empresa no Google, serviços e pedras específicos, logo em vetor, fotos de obras reais. Em produção o conteúdo pendente é omitido, não inventado.

## Ambientes

| Ambiente | URL / local | Como publica |
|---|---|---|
| desenvolvimento | `npm run dev` em http://localhost:3000; build estático servido por `node scripts/preview-local.mjs` em http://127.0.0.1:3105 | local |
| homologação | https://jkmarmores.com.br/1/, /2/, /3/ (noindex) | push em `versao-1/2/3` (`.github/workflows/deploy-versoes.yml`) |
| produção | https://jkmarmores.com.br (servidor Napoleão, LiteSpeed + DirectAdmin) | push na `main` ou "Run workflow" (`.github/workflows/deploy.yml`), com `SITE_MODE` da variável do repositório |

Detalhes, secrets e passos de lançamento: `docs/deploy.md` e a skill `deploy`.

## Worktrees

O repositório tem vários worktrees irmãos em `C:\Users\Vitor\Desktop\sites-wordpress\`: `jk-marmores` (este), `jk-producao`, `jk-v1`, `jk-v2`, `jk-v3`, `jk-marmores-redesign`, `jk-marmores-configurador`. O material da cliente, que ficava em `../jk-marmores-refs`, foi movido em 2026-10-20 para `docs/insumos/brutos/` deste worktree; os outros não o enxergam mais, e relatórios antigos em `docs/auditorias/` ainda citam o caminho antigo.

## Achados do onboarding (conhecimento, não tasks)

- O número do WhatsApp está repetido em `src/content/configurador.ts` (linha 34), fora do lugar central (`conteudo.empresa.whatsapp` em `src/content/index.ts` e `src/lib/whatsapp.ts`).
- Há um handoff aberto no ai-memory (28/09) sobre o vídeo da capa engasgar em rede móvel lenta depois do gesto e sobre o teste do menu no Android.
- Os scripts `scripts/check-*.mjs` e `audit-*.mjs` usam `puppeteer-core` de uma pasta externa (`AUDIT_MODULES`), que ficava em `jk-marmores-refs/auditorias-fluidez/`; agora está em `docs/insumos/brutos/auditorias-fluidez/`.

## Antes do método (até 2026-10-20)

O trabalho era dividido em briefings (`docs/tarefas/00` a `05`) e executado por agentes Codex no Maestri (workspace "jkmarmores"), com o Claude Code como Planejador. Papéis usados: Analista de Referencias, Estrategista de Conteudo e SEO, Diretor de Arte, Dev Frontend, Engenheiro 3D, Auditor de Qualidade, Release e Deploy. Agentes nomeados nos documentos: Cinzel (dev), Bussola (conteúdo), Prisma (3D), Astra (redesign com Higgsfield), Orbita (configurador), Pulso (auditoria). Os papéis do método substituem esses; `modelos_por_papel` no `config.yaml` diz quem roda cada um.

Regras operacionais que continuam valendo:

- Navegadores: reaproveite um portal ou aba já aberto. Antes de abrir, rode `maestri list` (ou o equivalente do Batuta); se já existir um portal seu, troque a URL em vez de criar outro. Ao terminar, feche o que não vai usar e encerre Chrome headless ou Lighthouse que você iniciou.
- Memória: ao terminar uma tarefa relevante, grave no ai-memory (a partir desta pasta) o que foi feito, o que falhou e o próximo passo.

## Glossário

| Termo | Significado |
|---|---|
| `pendente()` | helper de `src/content/pendente.ts` que marca dado que falta. Homolog mostra "Pendente: …"; produção omite |
| `SITE_MODE` | `homolog` (noindex, robots Disallow, pendências visíveis) ou `producao` (indexável, pendências omitidas) |
| versão 1, 2, 3 | as três direções visuais publicadas em `/1/`, `/2/`, `/3/`; a 1 está na raiz e foi aprovada |
| jornada | sequência de quadros da pedra na home (`StoneJourney`), com transições guiadas pela rolagem |
| configurador | seletor estático de material e ambiente na home (`src/components/configurador/`); começou como 3D e virou seletor |
| A1 | imagem-chave aprovada em 26/09 como base visual (`assets/images/a1-*`) |
| Higgsfield | API de geração de imagem e vídeo usada nos assets ilustrativos (`tools/higgsfield/`) |
| Napoleão | servidor de hospedagem (LiteSpeed + DirectAdmin) |
| ZapMind | arquivo das conversas de WhatsApp do Vitor, no servidor Contabo; a conversa do projeto é a 43286 |

## Pessoas

| Quem | Papel | Decide sobre |
|---|---|---|
| Vitor | desenvolvedor responsável | tudo técnico, publicação, orçamento de geração paga, aprovação visual |
| Lucas (Lucas Solutions) | quem contratou | escopo comercial |
| Contato da JK (grupo do projeto) | cliente | dados da empresa, textos, fotos, aprovação do site |
