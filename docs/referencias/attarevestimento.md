# Referência: ATTA Revestimentos

Consulta em 25/09/2026. Site analisado: https://attarevestimento.com/. Inspeção visual no portal Maestri em 1440 x 900 e 390 x 844; inspeção de DOM, robots, sitemaps e uma execução local do Lighthouse 13.5.0 em modo mobile. Os achados descrevem o site consultado e não validam as afirmações comerciais dele.

## Evidências

- [Início em 1440px](capturas/atta-1440.png), [início em 390px](capturas/atta-390.png) e [contato em 390px](capturas/atta-contato-390.png).
- [Relatório Lighthouse mobile](lighthouse-atta-mobile.json), gerado em 25/09/2026 às 18:58 UTC.
- Fontes públicas: [início](https://attarevestimento.com/), [robots.txt](https://attarevestimento.com/robots.txt), [sitemap.xml](https://attarevestimento.com/sitemap.xml) e [sitemap de imagens](https://attarevestimento.com/sitemap-images.xml).

## Área atendida

O H1 e a seção de contato apontam Ribeirão Preto e região. O FAQ cita, entre outras, Sertãozinho, Franca, Araraquara, São Carlos, Barretos, Batatais e Jaboticabal. A lista de cidades aparece no próprio [início, seção de contato](https://attarevestimento.com/#contato). Isto não confirma a área de atendimento da JK; D3 segue aberto em docs/PENDENCIAS.md.

## Estrutura, navegação e hierarquia

O site observado funciona como uma página única. O menu leva a âncoras: início, produtos, aplicações, benefícios e contato. O corpo segue a sequência: hero com serviço e cidade no H1; duas ações; vantagens breves; tipos de resina em abas; benefícios; aplicações por ambiente; processo em quatro etapas; FAQ; contato com mapa; rodapé. O sitemap contém somente a home. No desktop, há navegação horizontal, telefone clicável e ação de orçamento no cabeçalho. Em 390px, o menu vira botão e a ação principal permanece na primeira tela.

A ação secundária que promete projetos leva a #aplicacoes, uma seção de usos e ambientes, sem página de portfólio de obras identificáveis. Links de soluções no rodapé apontam para a raiz (#), assim como privacidade e termos. Isto reduz a utilidade da navegação e cria promessas de conteúdo sem destino específico.

## Visual e fotografia

Hero em fotografia de aplicação de piso com camada escura; composição centralizada, título branco e ações amarela e branca. A interface alterna fundos azul ardósia escuro e seções claras; a cor de ação é amarelo dourado, com verde nos links de WhatsApp. Tipografia de interface e títulos: pilha sans-serif do sistema, sem família editorial própria identificada no estilo calculado. No desktop, o H1 ocupa várias linhas sobre a foto; no celular, a foto, o logo repetido, o H1 e as duas ações consomem quase toda a primeira tela. Abaixo há imagens de pisos com descrições alternativas. A procedência e a autorização das fotos não foram verificadas.

## Conversão e formulários

A rota mais curta ao WhatsApp é o telefone do cabeçalho no desktop ou o botão flutuante visível em ambos os tamanhos: um clique abre wa.me/5516988199446. A ação principal do hero, “Solicitar Orçamento”, leva primeiro a #contato; dali o botão “Falar pelo WhatsApp” abre o mesmo número, em dois cliques. A seção de contato traz telefone, e-mail e mapa. Não há elemento form na home; o orçamento depende do WhatsApp ou do e-mail. O destino do botão secundário foi conferido pelo href no DOM, sem iniciar conversa externa.

## SEO on-page e infraestrutura visível

| Item | Achado em 25/09/2026 |
|---|---|
| Title | “ATTA Revestimentos - Pisos Resinados de Alto Desempenho” |
| Meta description | “Pisos Resinados de Alto Desempenho para Ambientes Exigentes. Especialistas em revestimentos epóxi, poliuretano e uretano.” Não menciona cidade. |
| H1 | “Pisos Resinados e Epóxi de Alto Desempenho em Ribeirão Preto e Região”; apenas um H1 observado. |
| URLs | Página única em /; seções por âncoras; sem URL própria para material, aplicação ou obra. |
| JSON-LD | Um bloco com LocalBusiness, Service, Product e FAQPage. LocalBusiness traz Ribeirão Preto/SP. |
| robots.txt | HTTP 200, permite rastreamento e anuncia dois sitemaps. |
| sitemap.xml | HTTP 200, um loc para a home. sitemap-images.xml também responde HTTP 200. |

Há um problema verificável de consistência de domínio: o site visitado é attarevestimento.com, mas a canonical, o loc dos dois sitemaps e URLs centrais do JSON-LD usam attarevestimentos.com, com “s” final. Em 25/09/2026 a tentativa de resolver esse segundo domínio falhou por DNS. Isso pode desviar sinais de indexação e deve ser evitado na JK. O JSON-LD também inclui um Review com autor genérico; não há, nesta inspeção, evidência para validar a origem dessa avaliação.

## Lighthouse mobile

Uma execução local, Lighthouse 13.5.0, emulação mobile padrão de 412 x 823, throttling simulado. O tamanho de 390px acima é somente da inspeção visual. Os valores são de laboratório, sujeitos a variação, e não representam Core Web Vitals de usuários reais.

| Métrica | Resultado |
|---|---:|
| Performance | 46/100 |
| LCP | 6,48 s |
| CLS | 0,000 |
| TBT | 651 ms |
| Peso transferido estimado | 724.769 bytes, cerca de 0,72 MB |

A API pública PageSpeed Insights retornou HTTP 429. O comando Lighthouse concluiu e gravou o JSON, mas retornou erro EPERM ao limpar o diretório temporário no Windows após a medição. O relatório salvo contém URL final, data, auditorias e nenhum runtimeError.

