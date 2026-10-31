---
name: padroes-codigo
description: Padrões de código do site da JK Mármores - componentes React de servidor, conteúdo tipado com Texto e pendente(), CSS global com tokens, imagens pelo componente Foto, movimento carregado depois do load. Use em qualquer task que crie ou altere componente, página, conteúdo, CSS ou script deste projeto.
metadata:
  origem: projeto
  versao: "1"
---

# Padrões de código · JK Mármores

## Regras

- **Componentes de servidor por padrão.** `"use client"` só em ilha que precisa do navegador (`src/components/SiteInteractions.tsx`, `src/components/configurador/ConfiguradorLoader.tsx`). Comportamento de página inteira vai em módulo carregado por `import()` depois do `load`, nunca no bundle inicial.
- **Conteúdo fora do componente.** Texto, CTA e SEO moram em `src/content/` e são tipados em `src/lib/types.ts`. Campo que pode faltar é `Texto` (`string | Pendente`); renderize com `<PendenteTexto valor={...} />` ou `texto(valor, fallback)` de `src/lib/site.ts`. Nunca escreva texto da empresa direto no JSX.
- **WhatsApp num lugar só.** Link sempre por `linkWhatsApp(mensagem, conteudo.empresa.whatsapp)` (`src/lib/whatsapp.ts`); a mensagem vem do `cta` da página (`ctaOrcamento()` em `src/content/index.ts`). Exceção conhecida a corrigir: `src/content/configurador.ts` repete o número.
- **Caminhos com prefixo.** Imagem, vídeo e link interno passam por `asset()` / `SiteLink`, senão quebram em `/1/`, `/2/`, `/3/`.
- **Imagens pelo `Foto`.** `<Foto id="..." mobileId="..." alt="..." sizes="..." prioridade />` (`src/components/Foto.tsx`) lê `src/generated/images.json` e monta `picture` AVIF + WebP com placeholder. Só a imagem do LCP usa `prioridade`. Detalhes na skill `imagens`.
- **SEO por página.** `export const metadata = metadataPagina(conteudo.paginas.X.seo, "/caminho/", indexavel)`. Página sem conteúdo confirmado passa `indexavel = false` e fica fora do sitemap em produção (`src/app/sitemap.ts`), como `aplicacoes` e `galeria`.
- **CSS.** Estilo global em `src/app/globals.css` com classes semânticas em inglês curto (`.site-header`, `.stone-panel`, `.material-card`); CSS Module só para componente isolado (`HomeHero.module.css`, `Configurador.module.css`). Tailwind está instalado, mas o projeto quase não usa utilitários: siga o CSS existente. Cores e tempos só por `var(--*)` (skill `design-system`).
- **Movimento** respeita `prefers-reduced-motion`, Save-Data e rede lenta (`src/lib/motion-network.ts`), e nunca esconde conteúdo sem JS.
- **Nomes:** domínio em português (`pendente`, `conteudo`, `linkWhatsApp`, `materiais`), termos técnicos podem ficar em inglês (`journey-motion.ts`, `after-poster.ts`). Arquivos de componente em PascalCase, utilitários em kebab-case.
- **Comentários** curtos, em português, explicando o porquê (ex.: `src/lib/site.ts`: "Em homologação a pendência aparece; em produção some").
- Commits em português, sem emoji, no padrão do `config.yaml` (`feat(T-0007): ...`).

## Exemplos do projeto

- `src/components/PageView.tsx`: página institucional que filtra seções pendentes em produção e fecha com CTA do WhatsApp.
- `src/components/SiteHeader.tsx`: navegação desktop e menu móvel com `details/summary`, sem JS obrigatório.
- `src/components/SiteInteractions.tsx` + `site-interactions.ts`: carregamento tardio de menu, dock do WhatsApp e brilho de botões.
- `src/app/layout.tsx`: JSON-LD `LocalBusiness` só quando nome, telefone, endereço e cidade não estão pendentes.

## Armadilhas conhecidas

- O que monta depois do `load` não existe no primeiro instante: testes e medições precisam esperar (skill `testes`).
- `globals.css` tem camadas de rodadas sucessivas (tokens claros no topo, "Versão 1" e "Rodada 2" depois). A regra que vale é a última; ao mexer, procure todas as ocorrências da classe.

## Origem das regras

- Código citado acima; AGENTS.md anterior (conteúdo em `src/content/`, `pendente()`); `docs/auditorias/versao-1/RELATORIO.md`
