Rodada vigente: [cinema pela rolagem e textos da cliente](rodada-2/RELATORIO.md). O relatório abaixo descreve a entrega anterior, preservada como histórico.

# Versão 3 — cinematográfica
Entrega em 30/09/2026. Base 3f27ffa, branch versao-3, homologação https://jkmarmores.com.br/3/.

## Composição e movimento
Source Sans 3 regular, grafite mineral, papel e caramelo da marca. Capa em tela cheia, vídeo preso à rolagem, corte diagonal que revela o monograma JK com a mesma chapa dentro. Um segundo corte abre a jornada com quatro etapas, vídeos curtos em scrub, legendas exclusivas por etapa e progresso segmentado. O celular percorre 90 svh na capa e 200 svh na jornada; rolagem nativa, sem snap obrigatório.

Ambiente com 24 vistas por combinação, arraste horizontal, botões alternativos para teclado, dois ambientes e três tons. Quadros 720/1280 restaurados de 9cb4e70, carregados por proximidade e demanda; a imagem anterior permanece até a nova decodificar. Nenhuma geração paga. Referências ilustrativas e possibilidades comerciais a confirmar permanecem separadas.

WhatsApp na capa, seleção e fechamento; dock contextual também no desktop. Endereço confirmado, aviso de imagens de IA, páginas institucionais existentes, títulos leves e tokens compartilhados.

## Validação
- npm run lint: aprovado, zero erros; dois avisos preexistentes em tools/higgsfield.
- NEXT_PUBLIC_BASE_PATH=/3 npm run build e check:pendencias: aprovados em homologação. P0 comerciais continuam bloqueando produção; nenhuma pendência removida.
- Lighthouse 13.5 mobile, cache frio, rede simulada e CPU 4x, servidor local gzip: desempenho 98, acessibilidade 100, boas práticas 100, SEO 69 (noindex esperado).
- LCP final 2,344 s, FCP 0,820 s, TBT 48 ms, CLS 0, peso auditado 217.700 bytes. LCP ficou acima da meta de 2 s; a rodada inicial marcou 1,79 s, mas não é a medição final.
- CPU 4x com movimento ativo: maior tarefa na entrada móvel 124 ms; desktop 242 ms. A meta de 150 ms foi atingida no ensaio móvel final, mas ainda existe trabalho de entrada a reduzir no desktop.
- Interação Event Timing: máximo 24 ms; gesto até nova imagem pintada: 37,4 ms móvel e 21,6 ms desktop. São medidas de laboratório, não INP de campo.
- 140.186 bytes gzip de JS inicial; GSAP/ScrollTrigger em chunk dinâmico depois do pôster.
- Capturas de 390 e 1440 px: capa, monograma, quatro etapas e ambiente. Sem overflow, erros HTTP/JS ou referências de recursos sem /3/.
- Sem JS: título, dez imagens carregadas e WhatsApp presentes. Movimento reduzido e Save-Data/3g: capa estática, nenhum vídeo criado.
- Web Interface Guidelines: foco visível, controles com nomes, alvos de 44 px, alternativas ao gesto, HTML sem dependência dos vídeos, sem transição all.
- Navegadores headless das verificações encerrados por finally. Nenhum portal aberto.

## Correções e limites
A primeira instrumentação encontrou texto mal codificado pelo pipe do PowerShell, legendas sobrepostas por contexto de empilhamento e um limite de Network Information API que desativava o movimento em conexão 4g. Corrigidos: arquivos UTF-8, isolamento das figuras/legenda ativa, decisão combinando rede nominal e timings reais. Vídeos continuam condicionados a buffering completo; não entram como dependência do gesto.

A jornada passa a ser montada somente quando se aproxima da tela. Fontes usam optional, com Arial ajustada em conexão lenta. Export e medidor de bundle aceitam /3/. Canonical de cada página respeita o prefixo.

Próxima revisão: aprovação visual da cliente, teste em aparelho físico e reduzir LCP abaixo de 2 s. Não houve nova geração de imagens, mudança em main, secrets, workflow, .htaccess ou acesso de produção.

## Fechamento da rodada e pausa solicitada
Vitor pediu pausa em 30/09/2026 após a auditoria das páginas terminar. Não houve nova mudança de implementação depois dessa instrução.

A rodada adicional corrigiu o clique dos botões de giro, a duplicação do WhatsApp na etapa 04, o contraste/nitidez da capa móvel e a recuperação de imagens. Incluiu crossfade de 240 ms apenas na troca de referência, corte diagonal para o papel, campos opcionais no primeiro contato e retirada do Suspense desnecessário do rodapé.

Verificação completa: 320/390/768/1440/1920 px sem overflow; 12 combinações verificadas (seis em cada tamanho principal); quatro etapas com uma única legenda ativa; CTA fixo oculto na etapa 04; giro por clique/teclado/toque real via CDP; rolagem vertical sobre a imagem preservada (274 px); menu móvel com foco contido e Escape; cinco rotas secundárias e mensagem do formulário verificadas, sem abrir janela externa; falha de imagem simulada e recuperação aprovadas. Capturas móveis e desktop das cinco páginas foram gravadas. Lighthouse de acessibilidade: 100 nas seis páginas, sem falhas. Detector Impeccable sem apontamentos.

Última medição com rede/CPU aplicadas pelo DevTools, cache frio e CPU 4x: desempenho 99, acessibilidade 100, boas práticas 100, LCP 0,965 s, CLS 0, TBT 95,856 ms e 209.339 bytes. A maior tarefa desse ensaio foi 174,972 ms, acima da meta de 150 ms; isso permanece registrado, apesar de o ensaio funcional com movimento ativo ter marcado 126 ms no celular e 169 ms no desktop, com gesto até pintura em 13,2/13,4 ms. O resultado simulado anterior (LCP 2,344 s) foi preservado; são métodos distintos, não medições de campo.

Depois dessa medição, foi restaurado content-visibility nas figuras estáticas da jornada para reduzir o layout inicial. O último build/check e a auditoria de acessibilidade já incluem esse ajuste; não houve nova rodada de performance após ele, respeitando a pausa. Lint passou sem erros, com três avisos documentados no log, incluindo uma variável sem uso no script de auditoria.

Próximo passo: aguardar as informações novas da cliente e a instrução do Vitor. Não iniciar novos refinamentos nem alterar o escopo comercial.
