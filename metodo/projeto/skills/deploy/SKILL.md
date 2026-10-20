---
name: deploy
description: Como o site da JK Mármores é publicado - GitHub Actions com rsync para o servidor Napoleão, quais branches publicam onde (main na raiz, versao-1/2/3 em subpastas), SITE_MODE, secrets e o que conferir depois. Use em qualquer task que mexa em workflow, build de produção, branch publicada, robots, sitemap, domínio ou lançamento, e antes de qualquer push.
metadata:
  origem: projeto
  versao: "1"
---

# Deploy · JK Mármores

## Regras

- **Push é deploy.** Nenhum push em `main`, `producao` ou `versao-1/2/3`, nenhum rsync e nenhum SSH de produção sem o "sim" explícito do Vitor naquela conversa (princípio 8). Com autonomia 0 o agente para no commit da branch da task.
- **O que publica onde:**

  | Gatilho | Workflow | Destino | Modo |
  |---|---|---|---|
  | push na `main` (ou "Run workflow") | `.github/workflows/deploy.yml` | raiz de jkmarmores.com.br | `vars.SITE_MODE` (hoje `producao`) |
  | push em `versao-1`, `versao-2`, `versao-3` | `.github/workflows/deploy-versoes.yml` | `/1/`, `/2/`, `/3/` | sempre `homolog`, com `NEXT_PUBLIC_BASE_PATH=/N` |

  Mudança só em `docs/**` ou `**/*.md` não dispara deploy. O deploy da raiz preserva `.well-known/` e as subpastas `/1/ /2/ /3/` (`--exclude`).
- **Pipeline:** `npm ci` → `npm run lint` → `npm run build` → `rsync --delete` de `out/`. Se o build falhar (inclusive por pendência no HTML de produção), nada é publicado.
- **Secrets** (Settings > Secrets and variables > Actions): `SSH_HOST`, `SSH_PORT`, `SSH_USER`, `SSH_PRIVATE_KEY`, `DEPLOY_PATH`; variável `SITE_MODE`. Nenhum valor desses vai para o repositório, que é público (princípio 9). No Git Bash, grave caminho com `MSYS_NO_PATHCONV=1 gh secret set ...`.
- **Antes de pedir o push**, a task traz no relatório: build com o `SITE_MODE` do destino, `npx playwright test`, Lighthouse mobile da página tocada e a lista do que muda no ar.
- **Depois do deploy:** Actions com sucesso, HTTP 200 na URL, conferir `meta robots` (produção sem `noindex` nas páginas indexáveis; versões com `noindex`), `robots.txt` e `sitemap.xml`.

## Estado em 2026-10-20

- A raiz está no ar desde 02/10 com a versão 1: último deploy por push na `main` em `694cd01` (02/10, sucesso), `SITE_MODE=producao`. A branch `producao` aponta para o mesmo commit e fica como histórico.
- SSL Let's Encrypt (*.jkmarmores.com.br + apex) vence em 25/12/2026; o DirectAdmin renova sozinho, mas confira.
- Pendente do lançamento (`docs/deploy.md`): Search Console (verificar o domínio e enviar o sitemap) e trocar o link "Site" do Perfil da Empresa no Google (pendência D9).

## Rollback

- Reverter o commit na `main` e pedir o push (o rsync com `--delete` deixa o servidor igual ao build anterior), ou rodar "Run workflow" num commit anterior. Não edite arquivos no servidor à mão.

## Armadilhas conhecidas

- O rsync usa `--delete`: arquivo enviado à mão para o `public_html` some no próximo deploy (exceto `.well-known/` e `/1/ /2/ /3/`).
- `paths-ignore` faz uma task só de documentação não publicar; se a task precisa ir ao ar, ela tem que tocar em código ou usar "Run workflow".

## Origem das regras

- `.github/workflows/deploy.yml`, `.github/workflows/deploy-versoes.yml`, `docs/deploy.md`, `docs/ESCOPO.md` (decisões de 25/09 a 02/10), AGENTS.md anterior (regra 6)
