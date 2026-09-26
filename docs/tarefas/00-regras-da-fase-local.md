# Regras da fase local (vale para todos)

Data: 25/09/2026. O Vitor autorizou execução **local**. Nada de remoto: sem GitHub, sem push, sem SSH, sem rsync, sem mexer em DNS.

## Quem trabalha agora

| Agente | Papel | Tarefa |
|---|---|---|
| Cinzel | Dev Frontend | `01-cinzel-base.md` |
| Bussola | Estrategista de Conteúdo e SEO | `02-bussola-arquitetura-seo.md` |
| Prisma | Engenheiro 3D | `03-prisma-3d.md` |

O Diretor de Arte ainda não entra (decisão do Vitor: a direção visual espera a logo). Até lá o visual é neutro, de wireframe, e todo estilo sai de tokens CSS, para que a troca depois seja só nos tokens.

## Posse de arquivos (evita conflito entre agentes)

- **Git:** só o Cinzel faz `git init` e commits locais. Os outros editam arquivos e avisam o Cinzel quando um bloco estiver pronto para commit. Commits pequenos e em português, sem emoji.
- **`docs/PENDENCIAS.md`:** só a Bussola edita. Quem precisar registrar algo manda para ela com `maestri ask "Bussola" "..."`.
- **`src/content/`:** a Bussola escreve o conteúdo; o Cinzel define os tipos em `src/lib/types.ts` e os helpers. Mudança de tipo é combinada entre os dois.
- **`src/components/stone-scene/` e `public/3d/`:** só o Prisma. A interface do componente com o resto do site é combinada com o Cinzel.
- **`docs/proposta/`:** cada um no seu arquivo (`arquitetura.md` e `seo-local.md` da Bussola, `3d.md` e `assets-licencas.md` do Prisma).
- **`docs/ESCOPO.md`:** só o Planejador edita. Se algo no escopo estiver errado ou faltando, avise no resumo final.

## Modo do site (decisão do Planejador, 25/09)

Variável `SITE_MODE` com dois valores:

- `homolog` (padrão): meta robots `noindex, nofollow` em todas as páginas, `robots.txt` com `Disallow: /`, sitemap gerado mas não anunciado no robots, marcadores de pendência visíveis.
- `producao`: sem noindex, sitemap anunciado, e o build **falha** se houver qualquer `pendente()` (script `check:pendencias`).

## Resumo final de cada tarefa

No máximo 15 linhas: o que fez, arquivos principais, como verificou (comandos e resultados), o que ficou pendente e perguntas para o Planejador. Grave também no ai-memory, a partir da pasta do projeto.
