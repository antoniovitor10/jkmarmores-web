---
name: conteudo
description: Regras de conteúdo e SEO local do site da JK Mármores - nada inventado, pendente() e PENDENCIAS.md, textos da cliente usados sem acréscimo, tom de voz, homolog x produção, sitemap e JSON-LD. Use em qualquer task que escreva ou altere texto, título, meta description, CTA, página, material, aplicação ou dado da empresa.
metadata:
  origem: projeto
  versao: "1"
---

# Conteúdo e SEO local · JK Mármores

## Regras

- **Nada inventado** (princípio 1): nome, telefone, endereço, cidade, serviços, peças, pedras, acabamentos, obras, fotos, depoimentos, números, anos, prêmios, prazos, garantias. Se a cliente não disse, não existe.
- **O que falta é `pendente("o que falta, em uma frase")`** no campo `Texto` correspondente em `src/content/`, e a mesma pendência entra em `docs/PENDENCIAS.md` com ID, prioridade (P0, P1, P2) e status. Em homolog aparece "A confirmar" com `data-pendente`; em produção o conteúdo some (`PendenteTexto` devolve `null`, `texto()` usa o fallback, `PageView` esconde a seção).
- **Textos da cliente** ficam em `src/content/cliente.ts` com a fonte no comentário. Podem ser divididos e enxugados; não ganham fato, adjetivo de mérito nem número. A fonte bruta está em `docs/insumos/brutos/cliente/textos-cliente-2026-09-28.txt` (ver `docs/insumos/INDICE.md`).
- **Dados confirmados hoje:** nome "JK Mármores e Granitos"; desde 2010; Estrada dos Pinheiros, 379, Parque Viana, Barueri/SP (CEP pendente); telefone e WhatsApp (11) 96797-6902; região São Paulo, Grande SP, ABC, interior, litoral norte e Baixada Santista; projetos residenciais, comerciais e industriais; categorias mármores, granitos, mármores dolomíticos, quartzitos, quartzos e ultracompactos. Qualquer outra coisa: confira em `docs/PENDENCIAS.md` antes de usar.
- **Material só aparece com `confirmado: true`** (`src/content/index.ts`, tipo `Material`), e só o tipo que a cliente confirmou. Aplicação idem. Páginas de aplicações e galeria ficam `indexavel = false` e fora do sitemap até haver conteúdo real.
- **Tom de voz:** técnico e acolhedor, trata por "você", explica material, acabamento e cuidado em linguagem simples, sem superlativo vazio. Português do Brasil com acentuação correta no texto do site (os nomes de arquivo e commits podem ficar sem acento).
- **CTA:** "Chamar no WhatsApp", com mensagem pré-preenchida que diz a página de origem (`ctaOrcamento()` em `src/content/index.ts`).
- **SEO local:** title e meta description únicos por página (campo `seo` de cada página), canonical por `urlPagina()`, um H1 por página, JSON-LD `LocalBusiness` montado em `src/app/layout.tsx` só com dados não pendentes. URLs em português sem acento e com barra final. Estratégia em `docs/proposta/seo-local.md`.
- **Homolog x produção:** em homolog tudo tem `noindex, nofollow` e `robots.txt` com `Disallow`. Em produção o build falha se um marcador de pendência chegar ao HTML (princípio 2). Rode `SITE_MODE=producao npm run build` em toda task que mexa em conteúdo.
- **Referências** (attarevestimento.com, vgrmarmoresegranitos.com.br, sites premium) são parâmetro de qualidade: nenhum texto, estrutura de frase ou slogan delas (princípio 4).

## Exemplos do projeto

- `src/content/index.ts`: seção "aplicacoes" da home com `texto: pendente("confirmar quais aplicações a JK executa ...")`.
- `src/components/PendenteTexto.tsx`: marcador acessível em homolog, nada em produção.
- `scripts/check-pendencias.mjs`: lista pendências do código (informativo) e reprova o HTML de produção.

## Armadilhas conhecidas

- O CNPJ encontrado no histórico não é da JK e não pode ser usado (D2).
- E-mail e redes sociais achados em fontes públicas são "pista", não dado confirmado (D7, D8).
- Telefones históricos encontrados na web não são usados; só o confirmado pelo Vitor em 27/09.

## Origem das regras

- AGENTS.md anterior (regras 1 a 3), `docs/ESCOPO.md` (tom de voz, catálogo, SITE_MODE), `docs/PENDENCIAS.md`
- `src/lib/site.ts`, `src/components/PendenteTexto.tsx`, `src/components/PageView.tsx`, `src/app/sitemap.ts`, `src/app/layout.tsx`
