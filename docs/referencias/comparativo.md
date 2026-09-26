# Comparativo das referências e implicações para a JK Mármores

Levantamento de 25/09/2026. Detalhes e provas em [ATTA](attarevestimento.md) e [VGR](vgr.md); metas e restrições da JK em [ESCOPO](../ESCOPO.md) e [PENDENCIAS](../PENDENCIAS.md). Capturas foram feitas no portal Maestri em 1440 x 900 e 390 x 844. Lighthouse 13.5.0 foi executado uma vez por home com emulação mobile padrão de 412 x 823 e throttling simulado. Não há dados de campo para comparar INP.

| Critério | ATTA | VGR | Implicação para a JK |
|---|---|---|---|
| Região declarada | Ribeirão Preto e cidades do entorno, no H1, FAQ e contato. | Endereço em São Paulo/SP; /orcamentos/ declara Grande São Paulo. | A hipótese de que ambas atendem a mesma área não se confirmou. Confirmar cidade e cobertura da JK com o cliente antes de qualquer texto local; D3 permanece aberto. |
| Mapa | Uma home com âncoras; sitemap lista só a raiz. | 30 URLs no sitemap, incluindo materiais, aplicações, galerias e páginas utilitárias. | Páginas próprias podem atender buscas específicas, desde que tenham conteúdo e imagens reais. |
| Caminho ao WhatsApp | Botão flutuante direto; ação principal do hero leva à seção de contato e então ao WhatsApp. | Botão fixo direto; formulários em contato e páginas internas. | Um contato único, visível e testado em cada página, com contexto claro para pedir orçamento. |
| SEO local | H1 cita Ribeirão Preto, mas canonical, sitemap e JSON-LD apontam para domínio diferente e não resolvido. | Endereço e schema presentes; home sem cidade no title/H1, meta truncada e páginas internas sem H1. | Alinhar URL canônica, sitemap, schema e dados comerciais; títulos úteis por página. |
| Lighthouse mobile, laboratório | 46/100; LCP 6,48 s; CLS 0; TBT 651 ms; 0,72 MB. | 49/100; LCP 8,57 s; CLS 0,015; TBT 705 ms; 2,34 MB. | As metas do escopo da JK, se atingidas, ficariam acima destas duas medições: LCP até 2 s, CLS até 0,05, performance 90+ e carga inicial até 1 MB sem 3D. |

## O que evitar

1. **Destinos SEO incoerentes.** Na ATTA, canonical e sitemaps usam attarevestimentos.com, enquanto a página está em attarevestimento.com; o domínio indicado não resolveu na consulta. Na JK, gerar todos os endereços a partir do domínio confirmado e conferir URLs publicadas. [Evidência técnica ATTA](attarevestimento.md#seo-on-page-e-infraestrutura-visível).
2. **Prometer conteúdo que a ação não entrega.** O botão de “projetos” da ATTA leva a uma seção de aplicações, e links do rodapé voltam para #. Na JK, só chamar de projeto uma obra real autorizada e levar ao registro correspondente. [Evidência ATTA](attarevestimento.md#estrutura-navegação-e-hierarquia).
3. **Multiplicar contatos conflitantes.** A VGR tem pelo menos três números distintos entre botão fixo, página de projetos/orçamentos e JSON-LD. A JK precisa do número confirmado em D5, usado e testado em todas as rotas. [Evidência VGR](vgr.md#conversão-e-formulários).
4. **Páginas finas ou genéricas.** A home da VGR tem title “HOME”, descrição truncada e H1 sem cidade; /bancadas/ e /projetos-aplicados/ não tinham H1 na inspeção. A JK deve evitar criar páginas de material ou aplicação só para preencher um menu. [Evidência VGR](vgr.md#seo-on-page-e-infraestrutura-visível).
5. **Hero pesado e longo no celular.** A [captura da ATTA em 390px](capturas/atta-390.png) mostra H1, foto, logos e duas ações ocupando quase toda a primeira tela; a [VGR em 390px](capturas/vgr-390.png) traz imagem antes do H1. Ambas tiveram LCP acima de 6 s no ensaio local. Priorizar imagem responsiva, título legível, CTA cedo e carregamento progressivo.
6. **Usar afirmações ou fotos sem prova.** A auditoria de páginas não comprova a origem das imagens nem alegações comerciais das referências. Para a JK, projetos, materiais, números, depoimentos e área atendida dependem dos itens em PENDENCIAS; não transferir fatos das referências.

## Mínimo esperado para uma marmoraria institucional

- Home que explique serviço, local atendido e próximo passo; apresentação da empresa; páginas de materiais e aplicações com conteúdo útil; galeria de trabalhos reais; contato com caminho curto ao orçamento. A navegação extensa da VGR mostra a demanda por materiais e aplicações, mas a arquitetura proposta no ESCOPO deve ser publicada somente com conteúdo confirmado.
- Telefone e WhatsApp consistentes, com destino verificável, além de formulário apenas se houver canal real para receber e responder pedidos. A ATTA resolve o contato pelo WhatsApp; a VGR oferece formulário em contato e páginas de material.
- Uma URL por assunto que mereça busca própria, com title, meta description, H1 e texto específicos. Sitemap, robots, canonical e JSON-LD devem descrever exatamente o site publicado e o endereço comercial confirmado.
- Fotos reais licenciadas da JK, com contexto de material e aplicação, texto alternativo útil, tamanho apropriado e apresentação que não atrase o primeiro conteúdo.
- Navegação e orçamento acessíveis em 390px, sem encobrir formulário ou conteúdo importante com CTA fixo.

## Onde a JK pode ser claramente superior

1. **Confiança local verificável.** Após resolver D3, D4, D5 e D9, apresentar cobertura real, endereço ou modalidade de atendimento, contato único e dados estruturados coerentes. Isso corrige as lacunas de ambas as referências sem presumir que a JK atende Ribeirão Preto ou São Paulo.
2. **Portfólio com contexto.** Quando V3 e O2 forem confirmados, cada obra pode informar aplicação, material, acabamento e local autorizado, com fotos da própria JK. A ATTA não oferece portfólio específico; a VGR exibe galerias, mas a seção inicial observada não contextualiza cada obra. [Galeria VGR em 390px](capturas/vgr-projetos-390.png).
3. **Orientação de escolha.** Materiais e aplicações podem cruzar uso, características e exemplos reais, conduzindo a um pedido de orçamento pertinente. A VGR lista muitos tipos, mas a [página de granitos em 390px](capturas/vgr-granitos-390.png) mostra formulário seguido de explicação longa, sem filtro ou caminho visível de comparação na parte inspecionada.
4. **Desempenho mensurável.** Buscar as metas mobile já estabelecidas no ESCOPO: LCP até 2 s, CLS até 0,05, Lighthouse performance 90+ e carga inicial até 1 MB sem 3D. O 3D deve carregar depois do conteúdo, como prevê o escopo. Comparar novamente com Lighthouse nas mesmas condições e medir em campo após publicação.
5. **Jornada simples e honesta.** Um CTA principal de orçamento com contexto, WhatsApp direto e teste de destino em todas as páginas. Caso haja formulário, indicar os dados necessários para preparar o pedido e garantir que a JK possa recebê-lo. Não prometer prazo, garantia ou orçamento por foto até O4 e O5 serem confirmados.

## Limites desta análise

A região da JK não foi fornecida. ATTA é de revestimentos de pisos resinados, portanto referência de experiência e presença local, não concorrente equivalente em produto. VGR é uma marmoraria, mas declara Grande São Paulo; não deve ser tratada como concorrente local da JK sem confirmar D3. A API pública PageSpeed retornou HTTP 429; os valores apresentados são de uma execução local por site. Os dois comandos Lighthouse gravaram relatórios íntegros e encerraram com erro de limpeza temporária EPERM no Windows. Nenhuma conversa de WhatsApp foi iniciada e nenhum formulário foi enviado.
