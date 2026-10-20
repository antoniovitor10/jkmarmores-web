---
name: stack
description: Stack, versões, estrutura de pastas e comandos do site da JK Mármores (Next.js 16 estático, React 19, Tailwind 4, TypeScript). Use antes de planejar ou executar qualquer task que mexa em código, build, dependência ou configuração deste projeto.
metadata:
  origem: projeto
  versao: "1"
  revisar_em: "2027-01-20"
---

# Stack · JK Mármores

## Regras

- Next.js **16.3.6** (App Router), React **19.3.0**, TypeScript 5.9, Tailwind **4.3.3** (via `@tailwindcss/postcss`), GSAP 3.15, sharp 0.34. Node **24** (`.nvmrc` e `engines`).
- Esta versão do Next tem mudanças que não estão no seu treino: leia o guia em `node_modules/next/dist/docs/` antes de usar uma API do Next (bloco no fim do `AGENTS.md`).
- Export estático: `output: "export"`, `trailingSlash: true`, `images.unoptimized`, `experimental.inlineCss` (`next.config.ts`). Nada que dependa de servidor: sem rotas de API, sem `cookies()`, sem ISR, sem middleware.
- `basePath` vem de `NEXT_PUBLIC_BASE_PATH` (vazio na raiz, `/1` `/2` `/3` nas versões). Todo caminho interno passa por `asset()` de `src/lib/base-path.ts`; links internos usam `SiteLink` (`src/components/SiteLink.tsx`), não `next/link` direto.
- Modo do site por `SITE_MODE` (`src/lib/site.ts`): `homolog` (padrão) ou `producao`. Use `isHomolog` / `isProducao`, nunca leia a variável de novo.
- Dependência nova só com aprovação do Vitor (o orçamento de JS inicial é 150 KB gzip, princípio 10).
- `tools/higgsfield/` é um pacote separado (próprio `package.json` e `node_modules`), fora do TypeScript do site (`tsconfig.json` → `exclude`). Não importe nada dele em `src/`.

## Estrutura

| Pasta | O que tem |
|---|---|
| `src/app/` | rotas: `/`, `sobre`, `materiais`, `materiais/[slug]`, `aplicacoes`, `aplicacoes/[slug]`, `galeria`, `contato`, `robots.ts`, `sitemap.ts`, ícones |
| `src/components/` | componentes; `configurador/` é o seletor de material da home |
| `src/content/` | conteúdo tipado (`index.ts`, `cliente.ts`, `institucional.ts`, `stone-journey.ts`, `configurador.ts`) e `pendente.ts` |
| `src/lib/` | `site.ts` (modo, metadata, URLs), `whatsapp.ts`, `base-path.ts`, `types.ts`, utilitários de movimento e rede |
| `src/generated/images.json` | manifesto gerado por `scripts/build-images.mjs`; não editar à mão |
| `assets/` | originais versionados: `brand/`, `images/` (fonte das imagens do site), `provas/` (vídeos e quadros de prova) |
| `public/` | `img/` (gerado), `fonts/`, `video/`, `brand/`, `configurador/` |
| `scripts/` | build de imagens, checagens, auditorias, preview local |
| `e2e/` | testes Playwright |
| `docs/` | escopo, pendências, propostas, auditorias, deploy |

## Comandos

```bash
npm ci                        # instalar
npm run dev                   # http://localhost:3000
npm run lint                  # eslint (linha de base: 0 erros, 2 avisos em tools/higgsfield)
npm run build                 # images:build + next build + check:pendencias -> out/
node scripts/preview-local.mjs  # serve out/ em http://127.0.0.1:3105 (PORT, PREVIEW_BASE_PATH)
npx playwright test           # testes de interação (precisa do build)
npm run measure:bundle        # peso do JS
```

- `npm run build` reescreve `src/generated/images.json`. Se só mudou fim de linha (LF/CRLF), desfaça antes do commit.
- Build de uma versão: `NEXT_PUBLIC_BASE_PATH=/1 SITE_MODE=homolog npm run build` e `PREVIEW_BASE_PATH=/1 node scripts/preview-local.mjs`.

## Armadilhas conhecidas

- O `next dev` reescreve o bloco `nextjs-agent-rules` no `AGENTS.md` e cria `CLAUDE.md` com `@AGENTS.md`. Mantenha o bloco no commit.
- Variáveis `NEXT_PUBLIC_*` vazias viram string vazia no workflow; use `||`, não `??`, para cair no padrão.

## Origem das regras

- `package.json`, `next.config.ts`, `tsconfig.json`, `.nvmrc`, `src/lib/site.ts`, `src/lib/base-path.ts`
- AGENTS.md anterior (stack e comandos), `docs/proposta/direcao-premium-2026-09-28.md` (exclusão do tools/higgsfield)
