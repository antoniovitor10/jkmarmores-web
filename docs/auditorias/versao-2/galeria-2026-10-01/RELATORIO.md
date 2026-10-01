# Versão 2: galeria clara e transições independentes da rede

Entrega de 01/10/2026 para https://jkmarmores.com.br/2/. Homologação noindex. Nenhuma geração paga, novo fato da empresa ou alteração de workflow/deploy.

## Mudanças e decisão visual

- Logo original do JPEG com alfa via Sharp no header e rodapé, sem quadrado preto. Textura preservada; RGB das bordas descontaminado antes do WebP lossless. Cantos dos PNGs com alfa 0. Conferência visual em 200%; vetor oficial continua pendente.
- Capa de ambiente em 100svh nos dois dispositivos, foto até as bordas, título “O bruto vira arte.”, apoio e um CTA no terço inferior esquerdo. Gradiente localizado, sem véu no restante da imagem. Bancada inteira no desktop.
- Fonte da capa: quadro 04, 2752×1536 nativos. O close 3168×1344 foi comparado e descartado para preservar o enquadramento de ambiente. Recorte móvel 710×1536; nenhum arquivo ampliado. DPR 2 recebe a maior variante existente, sem alegação de 4K ou detalhe óptico adicional.
- Work Sans Light em escala menor e tracking discretamente aberto; Source Sans 3 com corpo maior e mais escuro. Papel quente preservado. Mesmos eixos, margens e escala em todas as seções.
- Sobre a JK precede a jornada; seis categorias reais têm resumo na home e texto integral dividido na página Materiais. Galeria com legenda à esquerda no desktop e abaixo no celular; imagem e texto avançam juntos sem sobreposição. Seletor usa o mesmo layout antes e depois da ativação, eliminando o salto do desktop. Contato agrupado e rodapé claro; removidas reservas artificiais de conteúdo.
- CSS, GSAP, monograma, cortes, scrub e troca do seletor independem da rede. Apenas reduced-motion desativa movimento. Política de rede permanece exclusiva para eventual vídeo/mídia pesada; esta versão não baixa vídeos. Layout da jornada é reservado antes do módulo GSAP, carregado quando se aproxima do viewport, para evitar CLS na ativação.
- Merge da main 068146d: favicon JK, icon.png e apple-icon.png; retirada a configuração de ícone vazio. Links gerados com /2/.

## Capturas e comparação

[Comparação lado a lado](comparacao-capas-1440.png): versão 1 à esquerda, versão 2 à direita, ambas em viewport 1440×900. A imagem principal e o conjunto título/contato são o parâmetro; papel claro, escala leve e galeria permanecem próprios da versão 2.

| Vista | 390 px | 1440 px |
|---|---|---|
| Capa, DPR 2 | [Celular](390-capa.png) | [Desktop](1440-capa.png) |
| Home inteira | [Celular](390-home-inteira-estatica.png) | [Desktop](1440-home-inteira-estatica.png) |
| Jornada ativa | [Quadro 2](390-jornada-0.5.png) | [Quadro 2](1440-jornada-0.5.png) |
| Seletor | [Celular](390-configurador.png) | [Desktop](1440-configurador.png) |
| Sobre a JK | [Celular](390-sobre.png) | [Desktop](1440-sobre.png) |
| Materiais | [Celular](390-materiais.png) | [Desktop](1440-materiais.png) |

As capturas integrais usam reduced-motion para apresentar os quatro quadros sem a repetição de espaço de uma seção sticky. É o fallback real do site, sem montagem ou alteração dos elementos. Os quatro estados da jornada normal foram capturados separadamente em ambos os dispositivos. [Logo do header em 200%](logo-header-200.png), [logo do rodapé em 200%](logo-rodape-200.png).

## Verificações

`npm run lint`: sem erros, duas advertências preexistentes em tools/higgsfield. `NEXT_PUBLIC_BASE_PATH=/2 npm run build` e `npm run check:pendencias`: aprovados para homologação. Pendências reais continuam registradas; o lançamento em produção permanece bloqueado. Varredura de todos os HTMLs exportados: nenhuma referência própria sem /2/.

[galeria.json](galeria.json): capa e CTA dentro do viewport, sem overflow, quatro quadros, ausência de erros e de vídeo, axe sem violações. Contraste mínimo amostrado nos glifos sobre o fundo renderizado: título 11,22:1 no celular / 4,67:1 no desktop; apoio 12,74:1 / 6,73:1. Atende AA. Favicon /2/icon.png e apple-touch-icon /2/apple-icon.png presentes.

Firefox/Safari foram representados pela ausência de navigator.connection e timings de cache com transferSize 0 em Chrome. Esse cenário, TTFB simulado de 850 ms, Save-Data e 3G mantêm a jornada ativa com troca real de quadros; reduced-motion permanece estático. Nenhuma dessas condições inicia vídeo. Não foi teste em aparelho físico ou instalação nativa de Firefox/Safari.

[conteudo.json](conteudo.json): 24 cenários aprovados, páginas institucionais e seis detalhes em 390/1440, além de 320/720 sem JavaScript. Texto real, seis categorias, foundingDate 2010, seis áreas atendidas, navegação, fontes locais, noindex e axe verificados. Títulos podem quebrar palavras longas em telas estreitas, inclusive durante a troca da fonte.

[qa.json](qa.json): seis cenários completos com CPU 4x, menu com foco, seletor e mensagem de orçamento. Transições normais, Save-Data e 3G ativas; reduced-motion/no-JS estáticos. CLS 0 em todos. Maior interação observada no celular normal: 56 ms; maior tarefa: 158 ms (rede 3G: 303 ms). LCP observado no celular normal local: 1,224 s; rede 3G: 3,132 s. Instrumentação da visita inteira, não percentis de campo.

[Lighthouse bruto](entrada-mobile-depois-lighthouse.json), [resumo](entrada-mobile-depois-resumo.json): mobile 390×844, DPR 2, cache frio, servidor local gzip, throttling simulado, Lighthouse 13.5.0. Performance 96, A11y 100, boas práticas 100, SEO 66 devido ao noindex de homologação. LCP **2,786 s**, CLS **0**, TBT **23,5 ms**.

Limites: a meta Lighthouse LCP ≤2 s e nenhuma tarefa >150 ms ainda não foi atingida. Interação ≤200 ms, CLS ≤0,05 e A11y 100 passaram. Não tratar a medição local como CWV real. Fotos de obras, catálogo comercial, serviços específicos, CEP, horário e vetor oficial permanecem pendentes. A entrega está tecnicamente pronta para comparação visual, ainda sujeita à aprovação da cliente.

Reprodução: qa-galeria.cjs nesta pasta; ../qa.cjs e ../cliente-2026-09-30/qa-conteudo.cjs aceitam QA_OUTPUT_DIR e QA_URL. Origem e licenças dos rasters em docs/proposta/assets-licencas.md; direção em DESIGN.md.
