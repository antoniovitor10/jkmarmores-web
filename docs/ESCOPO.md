# Escopo - Site JK Mármores

Status: **rascunho em fechamento** (25/09/2026). Itens marcados com `[EM ABERTO]` ainda dependem de decisão do Vitor ou do Lucas.

## 1. Contexto

- Pedido: Lucas (grupo Lucas Solutions), 11/09/2026. Site da marmoraria da esposa.
- Objetivo principal: a empresa voltar a ser encontrada no Google (busca local e Maps).
- Objetivo secundário: gerar pedidos de orçamento, com caminho curto até o WhatsApp.
- Referências enviadas em 24/09/2026: https://attarevestimento.com/ e https://vgrmarmoresegranitos.com.br/. Servem de parâmetro de escopo. Não copiar.
- Meta de qualidade: visual e técnico claramente superiores às referências e aos concorrentes locais.
- Prazo: não informado. `[EM ABERTO]`

## 2. Direção criativa

Precisão, sofisticação e confiança. Tipografia forte, composição editorial, fotografia grande, detalhes inspirados em pedra natural. Sem aparência de template, efeitos genéricos ou excesso de animação.

## 3. Arquitetura de páginas (proposta inicial, a validar)

| Página | URL | Função |
|---|---|---|
| Início | `/` | Posicionamento, prova (trabalhos reais), cena 3D, caminhos para material, aplicação e orçamento |
| A empresa | `/sobre/` | História, equipe, processo (medição, corte, acabamento, instalação), área atendida |
| Materiais | `/materiais/` | Catálogo filtrável por tipo, cor e uso |
| Material | `/materiais/[slug]/` | Foto grande, características, acabamentos, onde usar, projetos com esse material, CTA |
| Aplicações | `/aplicacoes/` e `/aplicacoes/[slug]/` | Só as aplicações confirmadas pela JK (cozinhas, banheiros, escadas, pisos, áreas externas...) |
| Projetos | `/projetos/` e `/projetos/[slug]/` | Só quando houver obras reais autorizadas; até lá, só a galeria |
| Galeria | `/galeria/` | Grade de fotos com filtro e visualização ampliada acessível |
| Contato e orçamento | `/contato/` | WhatsApp, telefone, endereço, mapa e formulário curto que monta a mensagem e abre o WhatsApp (sem backend) |

## 4. Experiência 3D

Decidido (25/09): duas experiências.

- **Configurador de ambiente** (home): cozinha/lavatório em 3D onde o visitante troca o material e o acabamento da bancada e pede orçamento daquela combinação pelo WhatsApp.
- **Explorador de chapa** (página de cada material): amostra em close com luz rasante para ver veios, borda e acabamento.

As duas compartilham motor, texturas e fallback, para não pagar o peso duas vezes. Carrega depois do conteúdo, tem poster estático equivalente e fallback para WebGL ausente, aparelho fraco e movimento reduzido. Nunca bloqueia conteúdo ou navegação. Detalhes e orçamento em `docs/proposta/3d.md` (a produzir).

## 5. Metas técnicas (celular, medido em Lighthouse mobile e em campo quando houver dados)

| Métrica | Meta |
|---|---|
| LCP | até 2,0 s (limite "bom" do Google é 2,5 s) |
| INP | até 150 ms |
| CLS | até 0,05 |
| Lighthouse mobile | Performance 90+, Acessibilidade 100, Boas práticas 100, SEO 100 |
| JS inicial por página (sem 3D) | até 150 KB gzip (ajustado em 26/09) |
| Cena 3D | até 250 KB gzip de JS, carregada sob demanda |
| Peso da página inicial sem 3D | até 1 MB no primeiro carregamento no celular |

Acessibilidade: WCAG 2.2 AA. SEO: conteúdo indexável sem JS, títulos e metadescrições únicos, JSON-LD, sitemap, robots, URLs em português sem acento.

## 6. Stack e deploy

- Next.js App Router + TypeScript + Tailwind, export estático, conteúdo tipado em `src/content/`
- Padrão do workspace (NEW-PROJECT.md) sem a parte de WordPress
- Domínio: **jkmarmores.com.br**. Hospedagem no Napoleão. Em 25/09 o DNS público ainda não apontava (Registro.br padrão, sem registro A): ver T1 em PENDENCIAS
- Repositório público `antoniovitor10/jkmarmores-web`; deploy via GitHub Actions + rsync para o diretório do domínio no Napoleão (dados do servidor só em Secrets)
- Homologação no próprio domínio com noindex até o lançamento

## 7. Fases e portões

| Fase | Entregas | Quem | Portão |
|---|---|---|---|
| 0. Escopo | Este documento fechado, PENDENCIAS enviadas ao Lucas | Planejador | Vitor aprova |
| 1. Descoberta | Benchmark das referências e concorrentes locais | Analista de Referencias | Planejador revisa |
| 2. Proposta | Arquitetura de páginas e conceito 3D (já); direção visual e wireframes (depois da logo) | Estrategista, Diretor de Arte, Engenheiro 3D | **Lucas aprova** |
| 3. Implementação | Base, design system, páginas, cena 3D, conteúdo | Dev Frontend, Engenheiro 3D, Estrategista, Diretor de Arte | Auditor sem bloqueantes |
| 4. Verificação | Auditoria, testes em aparelhos reais | Auditor de Qualidade | Vitor aprova |
| 5. Lançamento | Remover noindex, Search Console, sitemap enviado, Perfil da Empresa conferido | Release e Deploy | Pendências P0 zeradas + aprovação do Vitor |

## 8. Fora do escopo (até decisão em contrário)

- CMS/WordPress
- Loja ou preços online
- Blog e páginas-guia de conteúdo
- Analytics
- Gestão do Perfil da Empresa no Google (só conferência de NAP)

## 9. Decisões registradas

| Data | Decisão |
|---|---|
| 25/09/2026 | Sem WordPress; Next.js estático no padrão do workspace |
| 25/09/2026 | Execução por agentes Codex no Maestri (sempre `codex --yolo`); Claude Code como Planejador |
| 25/09/2026 | Domínio jkmarmores.com.br no Napoleão |
| 25/09/2026 | 3D: configurador de ambiente na home + explorador de chapa nas páginas de material |
| 25/09/2026 | Entrega completa em fases: home + materiais + contato primeiro; projetos e galeria conforme chegarem as fotos |
| 25/09/2026 | Imagens provisórias: banco livre (Unsplash/Pexels) e texturas CC0 (ambientCG/Poly Haven), cada uma marcada e registrada em PENDENCIAS, nunca apresentadas como trabalho da JK |
| 25/09/2026 | Orçamento: formulário curto (ambiente, material, medidas aproximadas, cidade) que monta a mensagem do WhatsApp; botões diretos com mensagem por página |
| 25/09/2026 | Pendências: Planejador redige a mensagem ao Lucas, Vitor envia |
| 25/09/2026 | Verificar se existe ou existiu site em jkmarmores.com.br (Wayback, índice do Google) para mapear 301 |
| 25/09/2026 | Região da JK desconhecida. As referências são de regiões diferentes (ATTA: Ribeirão Preto; VGR: Grande SP) e a ATTA é de pisos resinados. Referências valem como parâmetro de ramo e qualidade, não de região |
| 25/09/2026 | Homologação direto em jkmarmores.com.br. Enquanto houver pendência P0: meta robots noindex em todas as páginas, robots.txt com Disallow e sitemap não enviado. A troca para indexável é um passo explícito do lançamento |
| 25/09/2026 | Repositório público antoniovitor10/jkmarmores-web (Actions sem custo). Nada de host, porta, usuário, chave ou caminho do servidor versionado: só em GitHub Secrets. `.maestri/` no .gitignore |
| 25/09/2026 | Pós-lançamento: Search Console (verificação do domínio + envio do sitemap). Analytics, conteúdo de guias e otimização do Perfil do Google ficam fora por ora |
| 25/09/2026 | Identidade: esperar a logo da JK. A proposta visual (Fase 2, parte do Diretor de Arte) só começa quando a logo chegar; arquitetura, conteúdo e conceito 3D podem avançar antes |
| 25/09/2026 | Tom de voz: técnico e acolhedor. Explica material, acabamento e cuidados em linguagem simples, trata por você, sem superlativos vazios |
| 25/09/2026 | Configurador 3D v1: 4 a 6 materiais (os mais vendidos pela JK) e 2 ou 3 acabamentos |
| 25/09/2026 | Testes: Android intermediário real, iPhone real e emulação (DevTools/Lighthouse com throttling). Fallback do 3D em aparelho fraco validado por emulação |
| 25/09/2026 | Aplicações ficam como páginas próprias só para as aplicações que a JK confirmar (O1). Projetos só viram páginas quando houver obras reais autorizadas; até lá, apenas galeria |
| 25/09/2026 | Execução local autorizada pelo Vitor: Cinzel (Dev), Bussola (Estrategista) e Prisma (3D). Sem GitHub, push, SSH ou DNS nesta etapa. Briefings em docs/tarefas/ |
| 25/09/2026 | SITE_MODE: `homolog` (noindex, robots Disallow, pendências visíveis) e `producao` (indexável; o build falha se houver pendente()) |
| 26/09/2026 | Publicado em homolog em http://jkmarmores.com.br: repositório público antoniovitor10/jkmarmores-web, deploy automático por GitHub Actions + rsync, noindex ativo. Vitor testa em aparelhos reais. SSL pendente no DirectAdmin |
| 26/09/2026 | SSL emitido (*.jkmarmores.com.br + apex); https ativo com 301 de http e www |
| 26/09/2026 | 3D passa para o Astra, que gera imagens no Higgsfield via MCP. Prisma sai do 3D. Astra trabalha na branch 3d-astra; merge na main só pelo Planejador. Briefing em docs/tarefas/04-astra-3d.md |
| 26/09/2026 | Redesign completo liderado pelo Astra com Higgsfield (imagem, vídeo e 3D), sem esperar a logo (substitui a decisão de esperar a logo para a direção visual; a área da logo fica reservada). Ponto de parada: direção visual e abertura da home aprovadas pelo Vitor antes de gerar assets em volume. Briefing em docs/tarefas/05-astra-redesign.md, branch redesign-astra |
| 26/09/2026 | Meta de JS inicial ajustada de 90 para 150 KB gzip (Next 16 + React 19 já ocupa ~138 KB), mantendo LCP, INP e CLS como metas principais |
| 25/09/2026 | Catálogo: estrutura para granito, mármore, quartzito, quartzo/industrializado e ultracompacto; só aparece o tipo que o Lucas confirmar |
