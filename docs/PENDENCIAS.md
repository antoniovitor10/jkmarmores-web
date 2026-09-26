# Pendências - JK Mármores

Tudo o que precisa vir do cliente (Lucas) ou ser decidido antes de publicar.
Nada daqui pode ser inventado. Enquanto faltar, o conteúdo usa `pendente("...")`.

Status: aberto | pista (achado público, precisa de confirmação do Lucas; não usar no site) | parcial | resolvido

Prioridade: **P0** bloqueia a publicação | **P1** bloqueia uma página ou seção | **P2** melhoria

## Leitura por prioridade

| Prioridade | Itens abertos ou parciais | Efeito |
|---|---|---|
| P0 | D1, D3, D4, D5, D9, O1, O2, V1, V3, V6, T1, T2 | Sem esses dados ou aprovações, o lançamento permanece bloqueado. |
| P1 | D2, D6, D10, O3, O4, O6, V2, V4, T3 | Segurar a página, seção ou funcionalidade que dependa de cada item. |
| P2 | D7, D8, O5, V5 | Melhorias condicionadas à confirmação. |

Os registros detalhados seguem agrupados por assunto abaixo. Um item com status `pista` continua pendente até confirmação do Lucas.

## Dados da empresa

| # | Item | Prioridade | Status | Fonte / observação |
|---|---|---|---|---|
| D1 | Nome comercial exato (grafia, se usa "JK Mármores", "JK Mármores e Granitos" etc.) | P0 | pista | Perfil Google: "JK MÁRMORES E GRANITOS Ltda."; site 2016: "JK Mármores". Confirmar |
| D2 | Razão social e CNPJ (rodapé e dados estruturados) | P1 | aberto | |
| D3 | Cidade, bairro e região atendida (cidades vizinhas) | P0 | pista | Barueri/SP (Perfil Google e site 2016). Região atendida desconhecida. Confirmar |
| D4 | Endereço completo com CEP, ou confirmação de que não atende no local | P0 | pista | Estr. dos Pinheiros, 379, Parque Viana, Barueri/SP (Perfil Google e site 2016). Confirmar e pegar CEP |
| D5 | Telefone fixo e número de WhatsApp (e se são o mesmo) | P0 | pista | Fixo (11) 4194-1875 no Perfil Google; (11) 4194-2799 também no site 2016. WhatsApp desconhecido |
| D6 | Horário de funcionamento | P1 | aberto | |
| D7 | E-mail comercial | P2 | pista | jkmarmores@uol.com.br no site 2016. Confirmar se ainda usa |
| D8 | Instagram e outras redes | P2 | pista | @jkmarmoresoficial e facebook.com/jkmarmores ligados ao Perfil Google. Confirmar posse |
| D9 | Link e acesso ao Perfil da Empresa no Google (existe? quem administra?) | P0 | pista | Existe perfil em Barueri; botão Site aponta para o Facebook. Confirmar quem administra; trocar o link para jkmarmores.com.br no lançamento |
| D10 | Anos de atuação / história da empresa / quem é a responsável | P1 | aberto | só com confirmação |

## Oferta

| # | Item | Prioridade | Status | Fonte / observação |
|---|---|---|---|---|
| O1 | Lista de serviços (bancadas, lavatórios, escadas, pisos, soleiras, fachadas, lareiras, instalação, polimento, restauração...) | P0 | aberto | |
| O2 | Lista de materiais trabalhados, com nome comercial, tipo (granito, mármore, quartzo, porcelanato, ultracompacto) e acabamentos | P0 | aberto | |
| O3 | Tem estoque/showroom para visita? | P1 | aberto | |
| O4 | Faz orçamento por foto/medida pelo WhatsApp? Faz visita técnica para medição? | P1 | aberto | |
| O5 | Prazo médio de entrega e garantia | P2 | aberto | só se o cliente afirmar |
| O6 | Fichas técnicas ou orientação do fornecedor para cada material confirmado: usos, restrições, acabamentos e cuidados | P1 | aberto | Necessário para páginas de material e cruzamento confiável com aplicações. |

## Material visual

| # | Item | Prioridade | Status | Fonte / observação |
|---|---|---|---|---|
| V1 | Logo em vetor (SVG, AI, PDF) | P0 | aberto | |
| V2 | Cores e fontes da marca, se existirem | P1 | aberto | |
| V3 | Fotos de trabalhos reais, com autorização de uso e, se possível, local e material de cada uma | P0 | aberto | |
| V4 | Fotos das chapas/amostras dos materiais (para catálogo e texturas do 3D) | P1 | aberto | |
| V5 | Fotos da equipe, da oficina ou da fachada | P2 | aberto | |

## Assets provisórios

| # | Item | Prioridade | Status | Fonte / observação |
|---|---|---|---|---|
| V6 | Três texturas CC0 de demonstração e maquete procedural do 3D | P0 | aberto | Licenças, autores, arquivos e limites em [assets-licencas.md](proposta/assets-licencas.md). Não representam materiais, acabamentos, aplicações ou obras da JK. Substituir por fotos de chapas reais autorizadas e confirmar nomes, acabamentos e aplicações antes de apresentá-los como catálogo; relacionado a O2, V3 e V4. |

## Técnico

V7 (P0, aberto para o cliente): Vitor aprovou A1 como base visual em 26/09/2026 e autorizou quatro imagens-chave ilustrativas para a jornada da pedra. Não representam obra, material ou processo da JK; O1/O4 não foram resolvidos. A divergência do modelo foi esclarecida antes das novas gerações pelo mapeamento oficial: MCP `nano_banana_pro` corresponde ao backend/CLI `nano_banana_2` (Nano Banana Pro). Fontes, prompts, licença, jobs e gasto total de 10 créditos (2 A1 + 8 sequência; saldo 0) em [assets-licencas.md](proposta/assets-licencas.md) e [sequencia-geracao.md](proposta/sequencia-geracao.md). Abertura mobile recortada do A1, sem outra geração. Aprovação do cliente e revisão da segunda entrega pelo Vitor pendentes; vídeo não autorizado nem gerado.

Site anterior: existiu um WordPress de uma página em 2016 (Wayback). Não há URLs antigas de conteúdo que exijam 301 específica; só 301 de http e www para https no apex. Detalhes em docs/referencias/dominio-e-presenca-atual.md.


| # | Item | Prioridade | Status | Fonte / observação |
|---|---|---|---|---|
| T1 | Domínio e SSL | P0 | resolvido | DNS apontado e Let's Encrypt emitido (*.jkmarmores.com.br + apex, vence 25/12/2026). https ativo com 301 de http e www (26/09) |
| T2 | Hospedagem e deploy | P0 | resolvido | Domínio criado no DirectAdmin; deploy automático via GitHub Actions funcionando desde 26/09 (docs/deploy.md) |
| T3 | Acesso ao Google Search Console / Analytics, se existirem | P1 | aberto | |
