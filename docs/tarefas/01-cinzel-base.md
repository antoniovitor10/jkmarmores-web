# Tarefa 01 - Cinzel (Dev Frontend): base do projeto

Leia antes: `AGENTS.md`, `docs/ESCOPO.md`, `docs/tarefas/00-regras-da-fase-local.md`, `docs/referencias/comparativo.md`.

Objetivo: deixar a base técnica pronta e correta, para o conteúdo (Bussola), o 3D (Prisma) e, depois, a direção visual entrarem sem retrabalho. **Não invista em estética**: o visual é neutro e todo estilo vem de tokens.

## Entregas

1. **Repositório local:** `git init` com branch `main`, sem remote. O `.gitignore` já existe; mantenha `.maestri/` nele.
2. **Next.js** (versão estável atual) com App Router, TypeScript estrito, Tailwind, ESLint, `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`. Estrutura `src/app`, `src/components`, `src/content`, `src/hooks`, `src/lib`, `public`. Fixe a versão do Node em `.nvmrc` e `engines`.
3. **Pendências:**
   - `src/content/pendente.ts` exporta `pendente(descricao)` e um tipo que marca o valor como provisório.
   - O componente que renderiza uma pendência mostra um marcador visível e acessível em `homolog`, com o atributo `data-pendente` no HTML.
   - `npm run check:pendencias` varre `src/content` e o `out/` gerado e falha quando `SITE_MODE=producao` e existe pendência. Em `homolog`, só lista as pendências.
4. **Modo do site:** `SITE_MODE` conforme `00-regras`. Centralize em `src/lib/site.ts` (URL canônica `https://jkmarmores.com.br`, modo, helpers).
5. **SEO técnico:**
   - Helper de metadata por página: title, description, canonical e Open Graph.
   - Componente de JSON-LD.
   - `app/sitemap.ts` e `app/robots.ts` compatíveis com export estático e respeitando o modo.
   - 404 estática.
   - `lang="pt-BR"`.
6. **Rotas** (esqueleto, cada uma com H1 e conteúdo vindo de `src/content`):
   - `/`
   - `/sobre/`
   - `/materiais/` e `/materiais/[slug]/` (com `generateStaticParams`)
   - `/aplicacoes/` e `/aplicacoes/[slug]/`
   - `/galeria/`
   - `/contato/`
   - `/projetos/` ainda não entra.
7. **Tipos:** em `src/lib/types.ts`, os tipos de empresa (nome, NAP, horário, redes), material, acabamento, aplicação, item de galeria e SEO por página. Combine com a Bussola (`maestri ask "Bussola" ...`) antes de fechar os tipos.
8. **WhatsApp:**
   - Helper `linkWhatsApp(mensagem)`, com o número vindo do conteúdo (hoje é `pendente`).
   - CTA no header, no fim das seções e um botão fixo discreto no celular que não cobre conteúdo nem formulário.
   - Formulário de orçamento em `/contato/` (ambiente, material, medidas aproximadas, cidade) que monta a mensagem e abre o WhatsApp. Sem JS, precisa sobrar um link direto funcionando.
9. **Acessibilidade:**
   - Skip link.
   - Foco visível.
   - Navegação por teclado no menu mobile.
   - `prefers-reduced-motion` respeitado.
   - Alvos de toque de 44px.
   - Landmarks corretos.
10. **Imagens:**
    - Pipeline com sharp: fonte em `assets/images/`, saída AVIF e WebP em larguras definidas em `public/img/`, mais um manifesto com width, height e placeholder leve.
    - Componente `<Foto>` com `<picture>`, `srcset`, `sizes`, dimensões explícitas e `loading`/`fetchpriority` por uso.
    - Imagens provisórias só entram com licença registrada, e o registro passa pela Bussola.
11. **Tokens de estilo:** CSS variables para cor, tipografia, espaçamento e raio, ligadas ao Tailwind. Use fontes do sistema por enquanto; a escolha de fonte é do Diretor de Arte.
12. **Espaço do 3D:** um componente de encaixe que mostra o poster estático e só carrega a cena por import dinâmico no cliente, quando ela se aproxima da tela ou o usuário aciona. Combine a interface (props, eventos, como o material escolhido vira mensagem de WhatsApp) com o Prisma.

## Verificação obrigatória

- `npm run lint`, `npm run build` e `npm run check:pendencias` (em homolog) sem erro.
- Confira no HTML de `out/` que H1, textos e links existem sem JS.
- Abra o dev server num portal do Maestri (`maestri portal create http://localhost:3000 "JK local" --size 390x844`) e confira em 390px e 1440px, incluindo navegação só por teclado.
- Rode um Lighthouse mobile local da home e registre os números como linha de base em `docs/auditorias/2026-09-25-linha-de-base.md`.
- Faça commits locais por bloco lógico.
