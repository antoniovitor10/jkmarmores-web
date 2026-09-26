# Arquitetura de informação e caminho ao orçamento

Proposta da Bussola, 25/09/2026. A cidade, a lista de serviços, os materiais e as obras da JK ainda dependem de confirmação. Uma URL dinâmica só entra na navegação e no sitemap quando tiver conteúdo real e autorização. O esqueleto local pode exibir marcadores `pendente()` em homologação.

## Mapa de URLs

| URL | Papel | Condição para publicação |
|---|---|---|
| `/` | Apresentar a oferta confirmada, orientar por material ou aplicação e levar ao orçamento. | D1, D3, D5, O1 e ao menos uma imagem aprovada para a primeira dobra. |
| `/sobre/` | Explicar quem é a empresa, como trabalha e onde atende. | D10, O4 e fotos ou descrição verificável do processo. |
| `/materiais/` | Comparar apenas os tipos e materiais confirmados. | O2 e conteúdo de comparação útil. |
| `/materiais/[slug]/` | Explicar um material comercial específico, acabamentos, uso e cuidados. | Nome e tipo confirmados, imagem de amostra autorizada, ficha técnica revisada e CTA contextual. Não criar uma URL por cor ou nome sem esses elementos. |
| `/aplicacoes/` | Guiar por necessidade de uso. | Ao menos uma aplicação confirmada em O1. |
| `/aplicacoes/[slug]/` | Responder à busca por aplicação e ligar aos materiais adequados. | Aplicação confirmada, requisitos técnicos revisados e exemplo real ou informação prática suficiente. |
| `/galeria/` | Mostrar somente trabalhos reais autorizados e identificados corretamente. | V3 com autorização de uso. Se não houver fotos, não publicar a rota. |
| `/projetos/[slug]/` | Contar uma obra com contexto de escolha e execução. | Obra real, autorização, fotos e dados do projeto; adiar toda a seção até haver acervo. |
| `/contato/` | Reunir WhatsApp, telefone, endereço ou modalidade de atendimento e formulário curto. | D3 a D5, O4; mapa só se o local receber público. |

`/projetos/` não entra inicialmente: a galeria cumpre a descoberta visual; fichas de projeto só existem quando houver casos documentados. Não criar páginas por cidade vizinha, bairro, marca de pedra ou serviço ainda não confirmado. Não há blog nem loja nesta fase.

## Ordem das seções

| Página | Seções, na ordem, e função |
|---|---|
| Início | 1. Hero: dizer o que pode ser orçado e levar ao CTA. 2. Caminhos por material e aplicação confirmados: ajudar a escolher. 3. Configurador 3D com poster equivalente: explorar combinações, sem bloquear texto e CTA. 4. Como pedir orçamento: informar ambiente, material, medida aproximada e cidade. 5. Trabalhos reais autorizados: prova visual quando V3 chegar. 6. Área atendida e contato: validar a intenção local. 7. CTA final: WhatsApp com contexto. |
| Sobre | 1. Quem é a empresa, com história confirmada. 2. Como funciona o atendimento, da conversa à entrega, apenas nas etapas confirmadas. 3. Equipe, oficina ou fotos reais, se autorizadas. 4. Área atendida e modalidade de visita. 5. CTA para explicar o projeto. |
| Materiais | 1. Introdução: critérios de escolha sem afirmar estoque. 2. Comparação entre tipos confirmados: aparência, cuidados e compatibilidade dependentes da ficha. 3. Lista filtrável por tipo, cor e uso apenas com dados reais. 4. Explicação de acabamento e variação de chapa. 5. CTA para informar aplicação e solicitar opções. |
| Material | 1. Nome comercial, tipo e foto da amostra. 2. Características e variação entre chapas. 3. Acabamentos disponíveis na JK. 4. Cuidados e restrições específicos. 5. Aplicações confirmadas ligadas. 6. Explorador 3D com fallback de foto. 7. Fotos de obras com o mesmo material, se houver. 8. CTA com nome do material. |
| Aplicações | 1. Escolha pelo ambiente ou peça. 2. Lista de aplicações confirmadas. 3. Pontos que alteram escolha e orçamento. 4. CTA. |
| Aplicação | 1. Necessidade prática e escopo confirmado. 2. Medidas, recortes e acabamento a esclarecer no orçamento. 3. Materiais adequados, com links para fichas confirmadas. 4. Fotos de trabalhos reais. 5. Cuidados relevantes. 6. CTA com aplicação. |
| Galeria | 1. Introdução factual. 2. Grade de obras reais com filtros que existam nos metadados. 3. Visualização ampliada acessível com legenda, material e aplicação quando confirmados. 4. CTA do projeto observado. |
| Contato | 1. WhatsApp direto e telefone confirmado. 2. Formulário curto que monta mensagem de WhatsApp, sem armazenar dados: ambiente, material, medidas aproximadas e cidade. 3. Endereço e mapa somente se o local atender visitantes; senão explicar área atendida. 4. Horários confirmados. |

## Jornada e ligações internas

- Cada página tem um CTA primário de orçamento e um link comum para `/contato/`. O texto da mensagem identifica a página de origem, material ou aplicação selecionados e os campos preenchidos; não promete prazo de resposta.
- Home liga a `/materiais/`, `/aplicacoes/`, `/galeria/` e `/contato/` conforme as rotas estiverem publicadas. Menu e rodapé não devem oferecer destinos vazios.
- Material confirmado liga somente a aplicações compatíveis confirmadas. Aplicação confirmada devolve links às fichas dos materiais pertinentes. A relação é editorial e requer revisão técnica da JK.
- Foto da galeria pode ligar à ficha de projeto apenas quando ela existir. Projeto liga de volta à aplicação, ao material e ao contato.
- O formulário não deve supor que a JK orça por foto ou faz medição no local até O4 ser respondido. Medidas aproximadas são contexto inicial, não especificação final.

## Conteúdo mínimo para evitar páginas rasas

Uma ficha de material precisa de nome e tipo confirmados, foto da própria amostra ou chapa autorizada, descrição distinta, disponibilidade e acabamento confirmados, indicação de uso validada, cuidados que não contradigam o fabricante e CTA contextual. Uma ficha de aplicação precisa dizer exatamente o que a JK executa, quais decisões afetam o orçamento, quais materiais confirmados podem servir e ter imagem real ou orientação concreta. Uma ficha de projeto precisa de obra, fotos autorizadas, aplicação, material, contexto e legenda; depoimento e localização só com permissão. Sem esses dados, a URL fica fora do build público.
