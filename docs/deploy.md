# Deploy

Repositório: https://github.com/antoniovitor10/jkmarmores-web (público).
Site: https://jkmarmores.com.br (servidor LiteSpeed com DirectAdmin).

## Como funciona

Push na `main` (ou "Run workflow" em Actions) roda `.github/workflows/deploy.yml`:

1. `npm ci`
2. `npm run lint`
3. `npm run build` com `SITE_MODE` vindo da variável do repositório
4. `rsync --delete` de `out/` para o diretório do domínio (preserva `.well-known/`)

Mudanças só em `docs/` ou em arquivos `.md` não disparam deploy.

## Secrets e variáveis (Settings > Secrets and variables > Actions)

| Nome | Tipo | Uso |
|---|---|---|
| `SSH_HOST`, `SSH_PORT`, `SSH_USER` | secret | acesso SSH |
| `SSH_PRIVATE_KEY` | secret | chave de deploy |
| `DEPLOY_PATH` | secret | caminho absoluto do `public_html` do domínio |
| `SITE_MODE` | variável | `homolog` (padrão) ou `producao` |

Ao gravar secrets com caminho pelo Git Bash, use `MSYS_NO_PATHCONV=1 gh secret set ...`; sem isso, o `/home/...` vira caminho do Windows e o rsync falha.

## Modo do site

- `homolog`: `noindex, nofollow` em todas as páginas, `robots.txt` com `Disallow: /`, pendências visíveis.
- `producao`: indexável; o build falha se houver qualquer `pendente()`.

## Lançamento (quando as pendências P0 estiverem zeradas)

1. Emitir o SSL Let's Encrypt de `jkmarmores.com.br` e `www` no DirectAdmin.
2. Descomentar o redirecionamento http para https em `public/.htaccess` e trocar o redirecionamento do www para https.
3. `gh variable set SITE_MODE -b producao` e rodar o workflow.
4. Search Console: verificar o domínio e enviar `https://jkmarmores.com.br/sitemap.xml`.
5. Trocar o link "Site" do Perfil da Empresa no Google para o domínio.
