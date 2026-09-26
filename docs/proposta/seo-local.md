# Proposta de SEO local

Data: 25/09/2026. A hipótese de Barueri/SP vem de fontes públicas, não do cliente. No site, cidade, endereço, telefone e nome comercial permanecem `pendente()` até D1, D3, D4 e D5 serem confirmados. Páginas de tipo de pedra e aplicação não indicam que a JK oferece esses itens enquanto O1 e O2 estiverem abertos.

## Intenção e pauta por URL

| URL | Busca alvo após confirmação | Intenção | Conteúdo que responde |
|---|---|---|---|
| `/` | `marmoraria em {cidade}`, `{nome comercial}` | encontrar empresa local e contato | oferta real, área atendida, prova, WhatsApp |
| `/sobre/` | `{nome comercial}`, `marmoraria {cidade} como funciona` | avaliar confiança | história e processo confirmados |
| `/materiais/` | `tipos de pedra para bancada`, `materiais para {aplicação}` | comparar | catálogo real e critérios de escolha |
| `/materiais/[slug]/` | `{nome do material} bancada`, `{nome do material} {cidade}` se natural | decidir material | foto, características, restrições, acabamentos, orçamento |
| `/aplicacoes/` | `pedra para {ambiente}` | descobrir possibilidades | aplicações efetivamente feitas pela JK |
| `/aplicacoes/[slug]/` | `{aplicação} de {material} em {cidade}` quando os três forem reais | solicitar solução | dimensões, escolhas, fotos e contato |
| `/galeria/` | `trabalhos de marmoraria {cidade}` | ver execução | obras reais contextualizadas |
| `/contato/` | `{nome comercial} contato`, `marmoraria {cidade} WhatsApp` | converter | NAP e formulário curto |

Cidade e região entram na home e no contato com informação operacional: onde está a empresa, onde atende e se recebe visitantes. Podem entrar no title de páginas comerciais quando relevantes e confirmadas. Não repetir bairro/cidade em todos os H2 nem criar páginas de localidades sem conteúdo próprio. Alphaville, Santana de Parnaíba, Osasco e outras vizinhas são hipóteses de pesquisa, não cobertura declarada.

## Modelos de metadados

Os exemplos abaixo são moldes para preenchimento com fatos confirmados, não texto pronto para publicar.

| Tipo | Title | Meta description |
|---|---|---|
| Início | `Marmoraria em {cidade} | {nome}` | `{serviço principal confirmado} em {cidade}. Veja materiais e trabalhos reais e envie os dados do projeto para pedir orçamento pelo WhatsApp.` |
| Materiais | `Materiais para {aplicações confirmadas} | {nome}` | `Compare os materiais trabalhados pela {nome}, entenda acabamentos e cuidados e peça orientação para o seu projeto.` |
| Material | `{material} para {aplicação confirmada} | {nome}` | `Veja fotos, acabamentos disponíveis, cuidados e usos do {material}. Informe sua aplicação e peça orçamento.` |
| Aplicação | `{aplicação} em {cidade} | {nome}` | `Entenda as escolhas de material e acabamento para {aplicação} e peça orçamento com medidas aproximadas.` |
| Contato | `Orçamento e contato | {nome} em {cidade}` | `Envie ambiente, material, medidas aproximadas e cidade pelo WhatsApp. Consulte os canais e a área de atendimento da {nome}.` |

Cada página precisa de H1, title, descrição e canonical únicos, com `https://jkmarmores.com.br/` e barra final. O texto acima só vira string depois da confirmação; no conteúdo tipado, o dado incerto é `pendente()`. Não gerar descrição idêntica para variantes de material. Não prometer preço, prazo, garantia ou disponibilidade sem O2/O5.

## Dados estruturados

Emitir `LocalBusiness` na home ou no contato somente quando nome, endereço ou modalidade de atendimento, telefone e região forem confirmados. `HomeAndConstructionBusiness` pode ser um tipo mais específico se representar corretamente a atividade; validar no schema.org e no Rich Results Test. Usar `@id` estável. O código abaixo é um **modelo com tokens**, nunca inserir os tokens literais no HTML público:

```json
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": "https://jkmarmores.com.br/#empresa",
  "name": "{nome comercial confirmado}",
  "url": "https://jkmarmores.com.br/",
  "telephone": "{telefone confirmado em E.164}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{logradouro, número e complemento confirmados}",
    "addressLocality": "{cidade confirmada}",
    "addressRegion": "{UF confirmada}",
    "postalCode": "{CEP confirmado}",
    "addressCountry": "BR"
  },
  "areaServed": [{ "@type": "City", "name": "{cidade atendida confirmada}" }]
}
```

Se a empresa não atender no endereço, não publicar endereço de visita nem mapa; conferir as regras do Perfil do Google para negócio de área de serviço. Incluir `openingHoursSpecification`, `sameAs`, `image` e `logo` somente com dados, URLs e direitos verificados. Não usar `aggregateRating` com nota do Maps nem reviews não exibidos e autorizados no site.

`BreadcrumbList` nas páginas internas com a mesma trilha visível e URLs canônicas. Exemplo de uma ficha de material publicada:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://jkmarmores.com.br/" },
    { "@type": "ListItem", "position": 2, "name": "Materiais", "item": "https://jkmarmores.com.br/materiais/" },
    { "@type": "ListItem", "position": 3, "name": "{material confirmado}", "item": "https://jkmarmores.com.br/materiais/{slug}/" }
  ]
}
```

`ImageObject` só quando a imagem for de uso autorizado e tiver URL pública, dimensões e legenda corretas; descrição não deve atribuir um banco de imagem à JK. O modelo abaixo vale para foto real autorizada, com crédito/licença conforme o termo recebido:

```json
{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "contentUrl": "https://jkmarmores.com.br/imagens/{arquivo-autorizado}.webp",
  "caption": "{legenda factual aprovada}",
  "width": "{largura em pixels}",
  "height": "{altura em pixels}",
  "creditText": "{crédito confirmado}",
  "license": "{URL dos termos da licença, quando aplicável}"
}
```

Omitir propriedades sem comprovação e seguir os campos aceitos na [documentação de metadados de imagem do Google](https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata). Nem schema nem metadados substituem texto visível.

## Indexação e lançamento

- `SITE_MODE=homolog`: seguir o escopo com meta robots `noindex, nofollow`, `robots.txt` com `Disallow: /` e sitemap não anunciado. O sitemap gerado é apenas para verificação local.
- `SITE_MODE=producao`: build falha com `pendente()`. Após liberar as pendências P0, remover noindex/Disallow, anunciar o sitemap no robots e enviar `https://jkmarmores.com.br/sitemap.xml` no Search Console. O sitemap deve conter apenas URLs públicas confirmadas; canonical, redirecionamentos e URLs do sitemap precisam concordar.
- Limite técnico: o Google explica que uma URL bloqueada por `robots.txt` não permite ao robô ler o `noindex` da página. Antes de abrir a homologação ao público, confirmar que ela não entrou no índice por links externos; na transição para produção, testar URLs com Inspeção de URL. [Robots meta tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).
- Domínio antigo: a pesquisa encontrou apenas a home HTML de 2016; fazer 301 de HTTP e www para HTTPS no apex, depois de DNS e SSL. Não redirecionar feeds e rotas técnicas antigas indiscriminadamente. [Levantamento](../referencias/dominio-e-presenca-atual.md).

## Perfil da Empresa no Google: conferência de lançamento

1. Confirmar com Lucas que o perfil encontrado pertence à JK e quem tem acesso de gestor; pedir confirmação da identidade antes de alterar.
2. Comparar nome, endereço ou modalidade de área de serviço, telefone principal, horário e categoria principal com site e documentação da empresa. A categoria deve descrever a atividade real; não acrescentar palavras-chave ao nome. [Ajuda oficial](https://support.google.com/business/answer/3039617?hl=pt-BR).
3. Confirmar se recebe pessoas no endereço. Se não, ajustar visibilidade do endereço e área de serviço segundo a operação real. Conferir pin do mapa e CEP.
4. Quando domínio estiver publicado e indexável, trocar o botão "Site" hoje apontado ao Facebook por `https://jkmarmores.com.br/`; manter redes sociais apenas se a posse for confirmada. [Evidência do perfil](../referencias/dominio-e-presenca-atual.md#3-busca-e-perfil-da-empresa-no-google).
5. Conferir link de WhatsApp, telefone, horários especiais e fotos autorizadas. Não publicar avaliações ou fotos de terceiros no site sem direito de uso.

Referências técnicas: [Google: LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business), [Google: BreadcrumbList](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [Google: editar Perfil da Empresa](https://support.google.com/business/answer/3039617?hl=pt-BR).
