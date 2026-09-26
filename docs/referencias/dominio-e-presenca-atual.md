# Domínio e presença atual: jkmarmores.com.br

Consulta em 25/09/2026, por volta de 19:32 UTC. Este documento reúne pistas públicas para validação com Lucas. A coincidência de nome, endereço ou telefone entre fontes antigas e resultados atuais não confirma que sejam a mesma empresa do projeto, nem que os dados ainda estejam corretos. Não usar estes dados na copy, no rodapé ou no JSON-LD antes de confirmação.

## 1. Resposta atual do domínio

As quatro variantes foram tentadas com requisição HTTP GET, seguindo redirecionamentos manualmente caso houvesse resposta. Nenhuma chegou a uma resposta HTTP porque a resolução DNS falhou antes da conexão. Assim, não há status HTTP, cadeia de redirecionamento, título HTML nem cabeçalho Server observáveis hoje.

| URL testada | Resultado | Redirecionamento | Título | Server |
|---|---|---|---|---|
| http://jkmarmores.com.br/ | Sem resposta HTTP; erro DNS ENOTFOUND | Não observável | Não observável | Não observável |
| https://jkmarmores.com.br/ | Sem resposta HTTP; erro DNS ENOTFOUND | Não observável | Não observável | Não observável |
| http://www.jkmarmores.com.br/ | Sem resposta HTTP; erro DNS ENOTFOUND | Não observável | Não observável | Não observável |
| https://www.jkmarmores.com.br/ | Sem resposta HTTP; erro DNS ENOTFOUND | Não observável | Não observável | Não observável |

A verificação independente em DNS público mostrou: [apex A](https://dns.google/resolve?name=jkmarmores.com.br&type=A) e [apex AAAA](https://dns.google/resolve?name=jkmarmores.com.br&type=AAAA) com resposta DNS sem registro de endereço; [www A](https://dns.google/resolve?name=www.jkmarmores.com.br&type=A) com NXDOMAIN. O domínio tem zona e servidores de nomes a.auto.dns.br e b.auto.dns.br, mas não foi obtido endereço de servidor web. A mesma ausência apareceu em consultas aos resolvedores 1.1.1.1 e 8.8.8.8. Isto contradiz a anotação de que o domínio já aponta para a hospedagem em docs/ESCOPO.md; é preciso conferir configuração e propagação com Vitor. Não foi feito acesso ao servidor.

## 2. Histórico no Wayback Machine

Consulta ao [índice CDX por domínio](https://web.archive.org/cdx/search/cdx?url=jkmarmores.com.br&matchType=domain&output=json&fl=timestamp,original,statuscode). O CDX retornou capturas da home com HTTP 200 em **14/07/2016**, **15/08/2016** e **15/09/2016**. Em 19/07/2016 há capturas de feeds e endpoints técnicos. Não apareceram outras páginas HTML de conteúdo nem registros de outros anos nessa consulta. Ausência no CDX não prova ausência de site fora desses períodos.

A [home arquivada em 14/07/2016](https://web.archive.org/web/20160714141527id_/http://jkmarmores.com.br:80/) tinha o título “JK Mármores”, conteúdo de uma página com âncoras para sobre, serviços, materiais, produção e contato, e links para Facebook e arquivos do antigo WordPress. O texto arquivado citava Barueri/SP, endereço na Estrada dos Pinheiros, 379, Parque Viana, telefones (11) 4194-1875 e (11) 4194-2799, e e-mail jkmarmores@uol.com.br. Esses dados são de 2016 e podem estar desatualizados ou pertencer a outra operação; devem ser confirmados com Lucas.

| URL distinta encontrada no CDX | Tipo / situação | Relevância para migração |
|---|---|---|
| http://jkmarmores.com.br:80/ | Home HTML; três capturas em 2016 | Manter a raiz como home nova e redirecionar HTTP para HTTPS. |
| http://jkmarmores.com.br:80/?feed=rss2 | Feed RSS | Endpoint técnico, sem 301 para a home por padrão. |
| http://jkmarmores.com.br:80/?feed=comments-rss2 | Feed de comentários | Endpoint técnico, sem 301 para a home por padrão. |
| http://jkmarmores.com.br:80/?feed=rss2&page_id=7992 | Feed associado ao ID 7992 | Investigar se houve página HTML correspondente; ela não apareceu no CDX. |
| http://jkmarmores.com.br:80/?rest_route=/ | API WordPress | Endpoint técnico; não é página de conteúdo. |
| URLs com ?rest_route=/oembed/1.0/embed | OEmbed | Endpoint técnico; não é página de conteúdo. |
| /wp-includes/wlwmanifest.xml e /xmlrpc.php?rsd | Metadados WordPress | Não requerem 301 para a home. |

A home arquivada também ligava diretamente a /wp-content/uploads/2014/09/QUARTZO.png e /wp-content/uploads/2014/09/SILESTONE.png. O CDX consultado não trouxe captura desses arquivos. Só criar redirecionamento exato para imagens equivalentes se houver direito de uso, arquivo novo correspondente ou links recebidos conhecidos.

## 3. Busca e Perfil da Empresa no Google

- A busca [site:jkmarmores.com.br](https://www.google.com/search?q=site%3Ajkmarmores.com.br&hl=pt-BR) exibiu “não encontrou nenhum documento correspondente” na consulta. Isto indica ausência de resultados visíveis naquele momento, não prova desindexação completa. [Captura](capturas/google-site-jkmarmores-2026-09-25.png).
- A busca geral [“JK Mármores”](https://www.google.com/search?q=%22JK%20M%C3%A1rmores%22&hl=pt-BR&gl=br) trouxe vários perfis e empresas com nomes parecidos, inclusive em outras cidades. O nome isolado não identifica a empresa do projeto.
- A busca [“JK Mármores” Barueri](https://www.google.com/search?q=%22JK%20M%C3%A1rmores%22%20Barueri&hl=pt-BR&gl=br) exibiu um [Perfil da Empresa no Google / Maps](https://www.google.com/maps/place/JK+M%C3%81RMORES+E+GRANITOS+Ltda./data=!4m2!3m1!1s0x0:0x299c4111fb93f204) chamado “JK MÁRMORES E GRANITOS Ltda.”. O painel mostra marmoraria em **Barueri/SP**, endereço **Estr. dos Pinheiros, 379, Parque Viana**, e telefone **(11) 4194-1875**. O botão “Site” leva a [facebook.com/jkmarmores](https://www.facebook.com/jkmarmores/), não ao domínio pesquisado. [Captura do painel](capturas/google-perfil-barueri-2026-09-25.png).
- No mesmo painel, a seção “Perfis” aponta para [Instagram @jkmarmoresoficial](https://www.instagram.com/jkmarmoresoficial/) e [Facebook /jkmarmores](https://www.facebook.com/jkmarmores). O Instagram é uma pista vinculada pelo Google a esse perfil; propriedade e uso atual precisam ser confirmados por Lucas. A busca geral mostra outros handles semelhantes, portanto não escolher conta apenas pelo nome. [Captura dos perfis ligados ao painel](capturas/google-perfil-redes-2026-09-25.png).

A concordância entre o endereço e o telefone do painel atual e a home arquivada de 2016 sugere continuidade do cadastro, mas **não confirma identidade, administração atual nem autorização para reutilizar dados**. O Perfil da Empresa e a conta do Instagram podem estar desatualizados.

## 4. URLs antigas e decisão de 301

| Origem | Destino proposto após publicação | Condição |
|---|---|---|
| http://jkmarmores.com.br/ e http://jkmarmores.com.br:80/ | https://jkmarmores.com.br/ | 301 de protocolo após o DNS e o HTTPS funcionarem. |
| http://www.jkmarmores.com.br/ e https://www.jkmarmores.com.br/ | https://jkmarmores.com.br/ | 301 de host se www for ativado; no momento www não resolve. |
| https://jkmarmores.com.br/ | Nova home na mesma URL | Nenhum 301 necessário. |

**Não foi encontrada no CDX nem no Google uma página antiga de conteúdo com caminho próprio que exija 301 específica.** As seções do site de 2016 usavam fragmentos como #sobre, #servicos, #materiais, #producao e #contato; fragmentos não chegam ao servidor e não podem ser tratados com 301. Se houver links externos relevantes para essas âncoras, considerar preservar identificadores equivalentes na nova home. Feeds, API e arquivos do WordPress não devem ser redirecionados indiscriminadamente para a home. Uma lista de URLs do Search Console ou um backup do site antigo pode revelar rotas adicionais antes do lançamento.

## Perguntas objetivas para Lucas e Vitor

1. A home arquivada de 2016 e o Perfil do Google em Barueri pertencem à mesma JK do projeto? A empresa ainda atende nesse endereço e nesses telefones?
2. Lucas administra o Perfil da Empresa, o Facebook /jkmarmores e o Instagram @jkmarmoresoficial?
3. Há backup ou lista de URLs do site anterior, além da home, para planejar 301 específicas?
4. Com Vitor: por que o domínio consta como apontado no escopo, mas DNS público não fornece A/AAAA para o apex nem registro para www?

