# Referência: VGR Mármores e Granitos

Consulta em 25/09/2026. Site analisado: https://vgrmarmoresegranitos.com.br/. Inspeção visual no portal Maestri em 1440 x 900 e 390 x 844; páginas internas, DOM, robots, sitemap e uma execução local do Lighthouse 13.5.0 em modo mobile. Os achados descrevem o site consultado e não validam as afirmações comerciais dele.

## Evidências

- [Início em 1440px](capturas/vgr-1440.png), [início em 390px](capturas/vgr-390.png), [contato em 390px](capturas/vgr-contato-390.png), [material em 390px](capturas/vgr-granitos-390.png), [galeria em 390px](capturas/vgr-projetos-390.png) e [página de orçamento em 390px](capturas/vgr-orcamentos-390.png).
- [Relatório Lighthouse mobile](lighthouse-vgr-mobile.json), gerado em 25/09/2026 às 18:58 UTC.
- Fontes públicas: [home](https://vgrmarmoresegranitos.com.br/), [sobre](https://vgrmarmoresegranitos.com.br/sobre-nos/), [granitos](https://vgrmarmoresegranitos.com.br/granitos/), [bancadas](https://vgrmarmoresegranitos.com.br/bancadas/), [projetos aplicados](https://vgrmarmoresegranitos.com.br/projetos-aplicados/), [contato](https://vgrmarmoresegranitos.com.br/contato/), [orçamentos](https://vgrmarmoresegranitos.com.br/orcamentos/), [robots.txt](https://vgrmarmoresegranitos.com.br/robots.txt) e [sitemap](https://vgrmarmoresegranitos.com.br/sitemap_index.xml).

## Área atendida

A página de contato informa Avenida Secondino, 298, Jardim Independência, São Paulo/SP. A página /orcamentos/ afirma atendimento em toda a Grande São Paulo. A página sobre também localiza a matriz na cidade de São Paulo. Não há evidência de atendimento em Ribeirão Preto. A área da JK continua pendente de confirmação pelo cliente, conforme D3 em docs/PENDENCIAS.md.

## Estrutura, navegação e hierarquia

O menu principal traz home, sobre, produtos, projetos e contato. Produtos e projetos abrem listas extensas de destinos; a home usa âncoras para as grades, enquanto os itens individuais têm páginas próprias. O sitemap de páginas lista 30 URLs. Foram observadas 13 categorias de materiais e 9 categorias de aplicação, além de home, sobre, contato, projetos aplicados, orçamento e outras páginas. A página /produtos/ existe no sitemap, embora a entrada de menu Produtos na home aponte para #produtos. /elementor-2512/, /obrigado/ e /orcamentos/ também estão no sitemap.

A home segue: cabeçalho; hero com foto grande de bancada e H1 genérico sobre mármores e granitos; texto institucional; grade de produtos; grade de aplicações; chamada para projetos aplicados; chamada de contato; rodapé. No desktop, foto e texto do hero dividem a tela. No celular, a imagem vem antes do H1 e consome cerca de metade da primeira tela; a chamada fixa de WhatsApp cobre parte do rodapé da viewport. O menu vira botão. A página de projetos aplicados separa interiores e exteriores em galerias; não foram observados dados de cada projeto, como material, local ou escopo, na seção inicial. A página /granitos/ coloca o formulário antes de boa parte do conteúdo explicativo.

## Visual e fotografia

Predominam branco, preto e cinzas, com ação de formulário em tom terroso e WhatsApp verde. O hero e as galerias usam fotografias de ambientes e superfícies de pedra; a home carrega cards de amostras de materiais. A tipografia calculada usa Roboto no menu e Poppins em listas internas; o H1 é sans-serif fino em caixa alta. O conjunto enfatiza variedade visual, mas vários cards da home usam o mesmo texto de ação “Ver mais”, dificultando a distinção quando lidos fora do contexto. A procedência e a autorização das imagens não foram verificadas. Várias imagens de cards da home foram observadas ainda sem dimensões naturais carregadas no instante da inspeção; isso não demonstra erro permanente.

## Conversão e formulários

Na home, a ação fixa “Solicite um orçamento” abre diretamente api.whatsapp.com/send com o número 5511926050274; ela permanece visível em 390px. O menu Contato abre /contato/, onde há formulário com nome, e-mail e telefone obrigatórios e mensagem opcional, além de telefone, WhatsApp, e-mail e endereço. Páginas como /granitos/ e /bancadas/ também contêm formulário de orçamento. /orcamentos/ apresenta outra página de venda com formulário e ações de WhatsApp. Nenhum formulário foi enviado.

Os destinos de WhatsApp são inconsistentes entre páginas: o botão fixo da home usa 5511926050274; o botão “Atendimento no WhatsApp” em /projetos-aplicados/ e ações em /orcamentos/ usam 5511965068434; o JSON-LD da home declara telefone 5511947565410. Há ainda um link de rodapé com hífen dentro do parâmetro phone. Isso pode encaminhar leads a números diferentes e impede identificar, só pela navegação, qual é o contato comercial correto.

## SEO on-page e infraestrutura visível

| Item | Achado em 25/09/2026 |
|---|---|
| Title da home | “HOME - VGR Mármores e Granitos”, sem cidade nem serviço específico além do nome. |
| Meta description da home | “O grupo VGR foi fundado originalmente com foco no segmento de artefatos de cimento e pré-moldados, conquistando credibilidade e solidez no mercado a mais de”. A frase termina incompleta. |
| H1 da home | “Mármores e granitos de Alto padrão”; não cita São Paulo. |
| Páginas internas | /contato/ tem title, meta e H1 próprios. /granitos/ tem title, meta e H1. /bancadas/ e /projetos-aplicados/ foram observadas sem H1; seu título visível está em H2. |
| URLs | Slugs de materiais e aplicações em português, incluindo /granitos/, /marmores/, /bancadas/ e /projetos-aplicados/. |
| JSON-LD | Um bloco gerado por Rank Math com Place, Organization/FurnitureStore, WebSite, WebPage, Person e Article. O endereço aponta para São Paulo/SP. A classificação FurnitureStore e o telefone 5511947565410 devem ser conferidos contra a oferta e os canais reais. |
| robots.txt | HTTP 200; permite rastreamento geral, bloqueia /wp-admin/ e indica sitemap_index.xml. |
| sitemap.xml | Redireciona para sitemap_index.xml, HTTP 200; o índice leva a page-sitemap.xml, com 30 URLs. |

## Lighthouse mobile

Uma execução local, Lighthouse 13.5.0, emulação mobile padrão de 412 x 823, throttling simulado. O tamanho de 390px acima é somente da inspeção visual. Os valores são de laboratório, sujeitos a variação, e não representam Core Web Vitals de usuários reais.

| Métrica | Resultado |
|---|---:|
| Performance | 49/100 |
| LCP | 8,57 s |
| CLS | 0,015 |
| TBT | 705 ms |
| Peso transferido estimado | 2.342.467 bytes, cerca de 2,34 MB |

A API pública PageSpeed Insights retornou HTTP 429. O comando Lighthouse gravou o JSON, mas retornou erro EPERM ao limpar o diretório temporário no Windows após a medição. O relatório salvo contém URL final, data, auditorias e nenhum runtimeError.

