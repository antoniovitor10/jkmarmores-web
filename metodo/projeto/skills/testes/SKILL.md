---
name: testes
description: Como testar o site da JK Mármores - Playwright em e2e/ contra o build estático, scripts de checagem e auditoria em scripts/, Lighthouse e sessão dirigida em aparelho real. Use ao planejar a tabela de Testes de uma task, ao escrever ou rodar testes e ao montar a evidência de verificação.
metadata:
  origem: projeto
  versao: "1"
---

# Testes · JK Mármores

O "o que testar" é do método (`metodo/nucleo/referencias/testes.md`). Aqui está o "como", neste repositório.

## Tipos que existem

| Tipo | Ferramenta | Onde | Quando |
|---|---|---|---|
| interação | Playwright 1.64 (`@playwright/test`) | `e2e/*.spec.ts` | todo CA com interface |
| checagem de build | `scripts/check-pendencias.mjs` (roda no `npm run build`) | `scripts/` | sempre; falha em produção se houver pendência no HTML |
| auditoria e medição | `scripts/check-*.mjs`, `audit-*.mjs`, `capture-*.mjs` (puppeteer-core), Lighthouse | `scripts/`, relatórios em `docs/auditorias/` | tasks de interface, movimento ou desempenho |
| sessão dirigida | portal do Maestri/Batuta ou Chrome, aparelho real | relatório da task | o que a automação não cobre: Android e iPhone físicos, gesto, vídeo em rede lenta |

Não há testes de unidade. Lógica pura nova (ex.: montar mensagem do WhatsApp) pode ganhar teste com `node:test` se a task pedir.

## Playwright

- Config: `playwright.config.ts`. Usa o Chrome instalado (`channel: "chrome"`), sem baixar navegador. Projetos `mobile` (Pixel 7) e `desktop` (1440×900).
- O `webServer` sobe `node scripts/preview-local.mjs` na porta 3105 (ou `E2E_PORT`) e reaproveita um servidor já aberto. **Rode `npm run build` antes**: o teste lê `out/`.
- Rodar tudo: `npx playwright test`. Um arquivo: `npx playwright test e2e/home.spec.ts`. Um teste: `-g "menu do celular"`. Falha guarda trace em `test-results/` (fora do git): `npx playwright show-trace <arquivo>`.
- Seletores: papel e nome acessível (`getByRole("link", { name: "Chamar no WhatsApp" })`, `getByRole("navigation", { name: "Navegação móvel" })`). Só use classe quando o elemento não tem papel útil (o `summary` do menu: `.mobile-nav > summary`). Se precisar de identificador, acrescente `data-testid` no componente.
- O controle do menu (Escape, foco, `inert`) e o movimento montam **depois do evento `load`** (`src/components/SiteInteractions.tsx`). Teste que interage com eles usa `page.goto("/", { waitUntil: "networkidle" })`.
- Sem JavaScript: `browser.newContext({ javaScriptEnabled: false })`. Todo CA de conteúdo confere também esse caso (princípio 3).
- Versão em subpasta: build com `NEXT_PUBLIC_BASE_PATH=/1` e `PREVIEW_BASE_PATH=/1`, e `baseURL` com o prefixo.

## Exemplo real

`e2e/home.spec.ts`: o CTA da capa leva a `wa.me/5511967976902` com a mensagem da home; sem JS o H1 e o CTA continuam; no celular o menu abre ao tocar, deixa `main` inerte e fecha com Escape devolvendo o foco. Prova de que pega (2026-10-20): trocar o número em `out/index.html` faz os dois testes do CTA falharem.

## Scripts de auditoria (puppeteer-core)

- Precisam de `AUDIT_MODULES` apontando para uma pasta com `puppeteer-core` instalado. Hoje: `docs/insumos/brutos/auditorias-fluidez/2026-09-27-2021` (fora do git). Chrome em `CHROME_PATH` ou o caminho padrão do Windows.
- Exemplos: `scripts/check-home.mjs` (H1, pendências, overflow, LCP da capa com e sem JS em 390 px), `scripts/check-motion-network.mjs` (movimento por condição de rede), `scripts/check-contrast.mjs`.
- Para tasks novas, prefira escrever o teste em Playwright; use esses scripts para medição e comparação com relatórios antigos.

## Lighthouse e metas

- Mobile com throttling, servidor local com gzip (`preview-local.mjs`), cache frio. Registre método (simulate ou DevTools), porque os números diferem.
- Metas: LCP até 2,0 s, CLS até 0,05, INP até 150 ms (laboratório não é campo), Acessibilidade e SEO 100. Em homolog o SEO cai por causa do noindex: meça SEO com `SITE_MODE=producao`.
- Relatórios em `docs/auditorias/<assunto>/`. Encerre todo Chrome headless que abrir.

## Armadilhas conhecidas

- `npm run build` reescreve `src/generated/images.json` (às vezes só fim de linha).
- O popup de tradução do Chrome no Android interceptou toque no menu em teste anterior; desative antes de testar no emulador.

## Origem das regras

- `playwright.config.ts`, `e2e/home.spec.ts`, `scripts/check-home.mjs`, `scripts/preview-local.mjs`, `src/components/SiteInteractions.tsx`
- Onboarding de 2026-10-20 (Vitor pediu Playwright, os scripts documentados e sessão dirigida), handoff de auditoria de 28/09
