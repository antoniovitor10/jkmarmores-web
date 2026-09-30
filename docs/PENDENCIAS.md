# Pendências - JK Mármores

Tudo o que precisa vir do cliente (Lucas) ou ser decidido antes de publicar.
Nada daqui pode ser inventado. Enquanto faltar, o conteúdo usa `pendente("...")`.

Status: aberto | pista (achado público, precisa de confirmação do Lucas; não usar no site) | parcial | resolvido

Prioridade: **P0** bloqueia a publicação | **P1** bloqueia uma página ou seção | **P2** melhoria

## Leitura por prioridade

| Prioridade | Itens abertos ou parciais | Efeito |
|---|---|---|
| P0 | D4 (CEP/visita), D9, O1 (serviços específicos), O2 (pedras específicas), V1 (vetor), V3, V6, V7 | Sem esses dados ou aprovações, o lançamento permanece bloqueado. D1, D5, T1 e T2 resolvidos. |
| P1 | D2, D6, O3, O4, O6, V2, V4, T3 | Segurar a página, seção ou funcionalidade que dependa de cada item. |
| P2 | D7, D8, O5, V5 | Melhorias condicionadas à confirmação. |

Os registros detalhados seguem agrupados por assunto abaixo. Um item com status `pista` continua pendente até confirmação do Lucas.

## Dados da empresa

| # | Item | Prioridade | Status | Fonte / observação |
|---|---|---|---|---|
| D1 | Nome comercial exato | P0 | resolvido | Cliente, grupo do projeto, 26/09/2026, encaminhado por Vitor/Planejador: "JK Marmores e Granitos". Logo recebida no mesmo dia. |
| D2 | Razão social e CNPJ (rodapé e dados estruturados) | P1 | aberto | O CNPJ do Vitor encontrado no histórico não pertence à JK e não pode ser usado. |
| D3 | Cidade, bairro e região atendida | P0 | resolvido | Sede em Parque Viana, Barueri/SP (26/09). Região atendida informada pela cliente no texto "Sobre Nós" (28/09): São Paulo, Grande São Paulo, ABC, interior, litoral norte e Baixada Santista. Texto integral em jk-marmores-refs/cliente/textos-cliente-2026-09-28.txt |
| D4 | Endereço completo com CEP, ou confirmação de que não atende no local | P0 | parcial | Cliente confirmou Estrada dos Pinheiros, 379, Parque Viana, Barueri/SP em 26/09/2026. CEP e atendimento a visitantes pendentes. Sem mapa ou promessa de showroom. |
| D5 | Telefone e número de WhatsApp (e se são o mesmo) | P0 | resolvido | Vitor confirmou em 27/09/2026 que (11) 96797-6902 também é o WhatsApp da JK. CTAs e formulário usam wa.me/5511967976902. Telefones históricos não usados. |
| D6 | Horário de funcionamento | P1 | aberto | |
| D7 | E-mail comercial | P2 | pista | jkmarmores@uol.com.br no site 2016. Confirmar se ainda usa |
| D8 | Instagram e outras redes | P2 | pista | @jkmarmoresoficial e facebook.com/jkmarmores ligados ao Perfil Google. Confirmar posse |
| D9 | Link e acesso ao Perfil da Empresa no Google (existe? quem administra?) | P0 | pista | Existe perfil em Barueri; botão Site aponta para o Facebook. Confirmar quem administra; trocar o link para jkmarmores.com.br no lançamento |
| D10 | Anos de atuação / história da empresa | P1 | resolvido | "Desde 2010", texto "Sobre Nós" enviado pela cliente em 28/09/2026 (usar o texto dela, sem acrescentar fatos). Responsável e equipe continuam sem informação |

## Oferta

| # | Item | Prioridade | Status | Fonte / observação |
|---|---|---|---|---|
| O1 | Lista de serviços | P0 | parcial | Cliente informou atendimento a projetos residenciais, comerciais e industriais, "da concepção à execução" (28/09). Lista de serviços específicos (bancadas, escadas etc.) ainda não enviada: não listar peças como serviço confirmado |
| O2 | Materiais trabalhados | P0 | parcial | Categorias confirmadas em 28/09, nacionais e importados: mármores, granitos, mármores dolomíticos, quartzitos naturais, quartzos e lâminas ultracompactas sinterizadas, com textos da cliente. Nomes comerciais de pedras específicas e acabamentos ainda pendentes |
| O3 | Tem estoque/showroom para visita? | P1 | aberto | |
| O4 | Faz orçamento por foto/medida pelo WhatsApp? Faz visita técnica para medição? | P1 | aberto | |
| O5 | Prazo médio de entrega e garantia | P2 | aberto | só se o cliente afirmar |
| O6 | Fichas técnicas ou orientação do fornecedor para cada material confirmado: usos, restrições, acabamentos e cuidados | P1 | aberto | Necessário para páginas de material e cruzamento confiável com aplicações. |

## Material visual

| # | Item | Prioridade | Status | Fonte / observação |
|---|---|---|---|---|
| V1 | Logo em vetor (SVG, AI, PDF) | P0 | parcial | JPEG 1600×1200 recebido da cliente em 26/09/2026. Original em assets/brand/; recorte WebP sem redesenho no header e rodapé, resolução suficiente para 2x. Vetor oficial ainda pendente. Monograma SVG traçado manualmente do JPEG na rodada premium é PROVISÓRIO, a substituir pelo original; textura vem da própria logo. |
| V2 | Cores e fontes da marca, se existirem | P1 | parcial | Paleta derivada do JPEG: preto/grafite, pedra quente e caramelo. Direção editorial Bodoni Moda/Source Sans 3 e papel quente aplicada por decisão do Vitor em 28/09; não são fontes oficiais da marca. Manual ou fontes oficiais da marca não recebidos. |
| V3 | Fotos de trabalhos reais, com autorização de uso e, se possível, local e material de cada uma | P0 | aberto | Cliente informou em 26/09 que vai providenciar; nenhuma imagem ilustrativa apresentada como obra. |
| V4 | Fotos das chapas/amostras dos materiais (para catálogo e texturas do 3D) | P1 | aberto | |
| V5 | Fotos da equipe, da oficina ou da fachada | P2 | aberto | |

## Assets provisórios

| # | Item | Prioridade | Status | Fonte / observação |
|---|---|---|---|---|
| V6 | Três texturas CC0 de demonstração e maquete procedural do 3D | P0 | aberto | Licenças, autores, arquivos e limites em [assets-licencas.md](proposta/assets-licencas.md). Não representam materiais, acabamentos, aplicações ou obras da JK. Substituir por fotos de chapas reais autorizadas e confirmar nomes, acabamentos e aplicações antes de apresentá-los como catálogo; relacionado a O2, V3 e V4. |

## Técnico

Revisão de 27/09/2026: Vitor aprovou manter as transições, a máscara PEDRA e a jornada escura de quatro quadros de eef51ef. Pediu nova abertura e apresentação institucional a partir da logo recebida. Terceira rodada sem geração paga; A1 e quadros reaproveitados, com recortes locais do A1 e quadro 02 no celular. Aprovação visual desta rodada e aprovação da cliente continuam pendentes; vídeo fica para depois. O registro V7 abaixo é histórico da segunda entrega.

V7 (P0, aberto para o cliente): Vitor aprovou A1 como base visual em 26/09/2026 e autorizou quatro imagens-chave ilustrativas para a jornada da pedra. Não representam obra, material ou processo da JK; O1/O4 não foram resolvidos. A divergência do modelo foi esclarecida antes das novas gerações pelo mapeamento oficial: MCP `nano_banana_pro` corresponde ao backend/CLI `nano_banana_2` (Nano Banana Pro). Fontes, prompts, licença, jobs e gasto total de 10 créditos (2 A1 + 8 sequência; saldo 0) em [assets-licencas.md](proposta/assets-licencas.md) e [sequencia-geracao.md](proposta/sequencia-geracao.md). Abertura mobile recortada do A1, sem outra geração. Aprovação do cliente e revisão da segunda entrega pelo Vitor pendentes; vídeo não autorizado nem gerado.

Site anterior: existiu um WordPress de uma página em 2016 (Wayback). Não há URLs antigas de conteúdo que exijam 301 específica; só 301 de http e www para https no apex. Detalhes em docs/referencias/dominio-e-presenca-atual.md.


| # | Item | Prioridade | Status | Fonte / observação |
|---|---|---|---|---|
| T1 | Domínio e SSL | P0 | resolvido | DNS apontado e Let's Encrypt emitido (*.jkmarmores.com.br + apex, vence 25/12/2026). https ativo com 301 de http e www (26/09) |
| T2 | Hospedagem e deploy | P0 | resolvido | Domínio criado no DirectAdmin; deploy automático via GitHub Actions funcionando desde 26/09 (docs/deploy.md) |
| T3 | Acesso ao Google Search Console / Analytics, se existirem | P1 | aberto | |

## Integração do texto da cliente — versão 1, 30/09/2026

Texto de 28/09 integrado à home, Sobre Nós, Materiais e às seis páginas de categoria. Fundação em 2010 e área atendida também no SEO e JSON-LD. D3/D10 não geram mais marcadores. O2 mantém apenas pedras específicas e acabamentos pendentes; O1, fotos reais, CEP, visita e horário seguem sem confirmação. Nenhum serviço específico, obra ou foto real foi acrescentado.
