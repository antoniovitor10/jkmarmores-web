# AGENTS.md - JK Mármores

Site institucional da JK Mármores (marmoraria), pedido por Lucas (grupo Lucas Solutions) em 11/09/2026.
Objetivo principal: a empresa voltar a ser encontrada no Google (SEO local) e gerar pedidos de orçamento pelo WhatsApp.

Fonte da verdade do escopo: `docs/ESCOPO.md`. Pendências com o cliente: `docs/PENDENCIAS.md`.
Se algo aqui conflitar com o escopo, vale o escopo. Se o escopo não responder, pergunte ao planejador (Vitor/Claude) em vez de decidir sozinho.

## Stack (padrão do workspace, sem WordPress)

- Next.js (App Router) + TypeScript + Tailwind, `output: "export"`, `trailingSlash: true`
- Conteúdo estático tipado em `src/content/` (sem CMS nesta fase)
- Estrutura: `src/app`, `src/components`, `src/content`, `src/hooks`, `src/lib`, `public`, `.github/workflows`
- Deploy: GitHub Actions -> `npm ci` -> `npm run build` -> rsync de `out/` para o servidor Napoleão (ver `docs/ESCOPO.md`, seção Deploy)

## Regras inegociáveis

1. Não inventar informação da empresa: nome, telefone, endereço, cidade, serviços, materiais, projetos, fotos, depoimentos, números, anos de mercado, prêmios. Nada.
2. Dado que falta vira pendência explícita:
   - no conteúdo, use o helper `pendente("descrição do que falta")` de `src/content/pendente.ts`;
   - em homologação ele renderiza um marcador visível; em produção (`SITE_MODE=producao`) o conteúdo pendente é omitido do HTML, e `npm run check:pendencias` falha se algum marcador de pendência chegar ao HTML publicado;
   - registre a pendência também em `docs/PENDENCIAS.md`.
3. Não copiar texto, layout, fotos ou identidade das referências (attarevestimento.com, vgrmarmoresegranitos.com.br). Elas servem só como parâmetro de escopo e qualidade.
4. Nenhum emoji ou ícone decorativo em texto, código, commit ou copy.
5. O conteúdo tem que ser indexável e útil sem JavaScript e sem a cena 3D. O 3D é camada extra, nunca dependência.
6. Não publicar, não fazer push para `main`, não rodar rsync/SSH para produção sem aprovação explícita do Vitor.
7. Fotos de terceiros (bancos de imagem, renders) só com licença registrada em `docs/PENDENCIAS.md` e marcadas como provisórias até o cliente aprovar.
8. Navegadores: reaproveite um portal ou aba já aberto em vez de criar outro. Antes de abrir, rode `maestri list`; se já existir um portal seu, troque a URL com `maestri portal edit "Nome" --url ...`. Ao terminar a tarefa, feche o que não vai mais usar (`maestri portal close "Nome"`) e encerre processos de Chrome headless ou Lighthouse que você iniciou.

## Time (papéis no Maestri, workspace "jkmarmores")

O Claude Code é o Planejador: fecha escopo, divide tarefas e cobra entregas. A execução fica com agentes Codex recrutados no canvas do Maestri com os papéis abaixo.

| Papel no Maestri | Faz | Escreve em |
|---|---|---|
| Analista de Referencias | Benchmark das referências e concorrentes locais | `docs/referencias/` |
| Estrategista de Conteudo e SEO | Arquitetura de páginas, copy, SEO local, pendências | `docs/proposta/`, `src/content/`, `docs/PENDENCIAS.md` |
| Diretor de Arte | Direção visual, tokens, tipografia, composição | `docs/proposta/`, tokens de estilo |
| Dev Frontend | Implementação Next.js, componentes, a11y, imagens | `src/`, `public/`, config |
| Engenheiro 3D | Cena WebGL, fallback estático, orçamento de performance | `src/components/stone-scene/`, `public/3d/` |
| Auditor de Qualidade | Auditoria severa: a11y, CWV, SEO, conteúdo inventado | `docs/auditorias/` (somente relatório) |
| Release e Deploy | Build, workflow, deploy no Napoleão com aprovação | `.github/workflows/`, `docs/deploy.md` |

Fluxo por fases e portões de aprovação: `docs/ESCOPO.md`.

## Comandos

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # gera out/
npm run lint
npm run check:pendencias # falha se houver conteúdo provisório
```

## Memória compartilhada

Ao terminar uma tarefa relevante, grave no ai-memory (a partir desta pasta) o que foi feito, o que falhou e o próximo passo.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
