# Tarefa 05 - Astra: redesign completo do site, com Higgsfield (imagem, vídeo e 3D)

Substitui a tarefa 04. Decisão do Vitor (26/09/2026): o Astra lidera a qualidade visual e tem liberdade para reconstruir o layout de todas as páginas, usando o Higgsfield (via MCP) para imagens e vídeos. O resultado precisa ser **de alto nível, bonito e leve**. O Planejador (Claude Code) cuida de escopo, regras e revisão; o Vitor aprova.

**Status: preparada, aguardando o Vitor liberar uma vaga de execução para o JK.** Nada roda nem é gerado antes disso.

Worktree exclusiva: `C:\Users\Vitor\Desktop\sites-wordpress\jk-marmores-redesign`, branch `redesign-astra`; o SHA de referência vem na mensagem de encaminhamento. Trabalhe só nessa pasta. Não troque de branch na pasta compartilhada `jk-marmores` e nunca use `--force`, `reset --hard` ou descarte de alterações para liberar um checkout.

**Equipe durante o redesign:** você é o único escritor. O Planejador revisa cada entrega num commit identificável e não implementa versão concorrente; as correções voltam para você. Os agentes Codex (Sonda, Bussola, Cinzel, Prisma) não recebem tarefas sobre o redesign. Não abra subagentes nem ciclos contínuos de acompanhamento sem autorização. Ao iniciar, informe o modelo que está realmente selecionado no seu terminal.

---

## 0. Leia antes de tudo

1. `AGENTS.md`: as regras inegociáveis valem para você também.
2. `docs/ESCOPO.md`: contexto, metas técnicas (seção 5) e decisões (seção 9).
3. `docs/proposta/arquitetura.md`: ordem e função das seções de cada página. A ordem pode mudar se você justificar; a função de cada seção não.
4. `docs/proposta/seo-local.md` e `docs/proposta/3d.md`.
5. `docs/referencias/comparativo.md` e `docs/referencias/concorrentes-barueri.md`: o que o mercado faz e o que evitar. Não copie nada.
6. O site atual no ar: https://jkmarmores.com.br. É um wireframe neutro de propósito; nada do visual dele precisa ser preservado.

---

## 1. Seu mandato

- **Você é dono:** direção de arte, layout, sistema visual (tokens, tipografia, grid, espaçamento), componentes visuais, motion, fotografia e vídeo gerados, e a experiência 3D.
- **Pode:** reescrever `src/app/globals.css`, os componentes de `src/components/` e o JSX das páginas em `src/app/**/page.tsx`, criar componentes novos, reorganizar seções e reescrever a cena 3D inteira.
- **Pode ajustar o texto** de `src/content/` para caber no layout (encurtar, dividir título e subtítulo, criar legendas). Não pode acrescentar fatos: todo dado da empresa continua saindo de `pendente()`.
- **Não pode quebrar:** rotas e URLs, `metadataPagina`, JSON-LD, `sitemap.ts`, `robots.ts`, `SITE_MODE`, `pendente()` e `check:pendencias`, o formulário de orçamento que monta a mensagem e abre o WhatsApp, o link do WhatsApp que funciona sem JS e o contrato `StoneSceneProps` / `StoneSelection` de `src/lib/stone.ts` (pode ampliar, não quebrar).
- **A liberdade não autoriza:**
  - inventar dados da JK (nomes comerciais, serviços, contatos, características);
  - remover sem discussão uma funcionalidade aprovada: configurador de ambiente, explorador de chapa, seleção de material e acabamento e orçamento pelo WhatsApp continuam vigentes;
  - alterar infraestrutura (`.github/workflows/`, `public/.htaccess`, `output: "export"` em `next.config`, secrets e variáveis do repositório);
  - publicar. Homologação, noindex e os bloqueios de lançamento continuam como estão.
- **Apresentação e interação são coisas separadas:** uma abertura em vídeo ou imagem cinematográfica é apresentação e não substitui as interações acima.
- **A direção é ponto de partida:** o conceito "o corte" (seção 2) e a lista de assets (seção 4) podem ser refinados com justificativa curta. Não é preciso produzir todos os assets só para cumprir a lista.

---

## 2. Direção criativa

A briefing original do cliente: **precisão, sofisticação e confiança. Tipografia forte, composição editorial, fotografias grandes, detalhes inspirados em pedra natural. Sem aparência de template, sem efeitos genéricos, sem excesso de animação.**

Tradução para decisões (ponto de partida; você pode propor outro caminho no passo 1, justificando):

- **Conceito:** "o corte". A marmoraria transforma um bloco bruto numa peça exata. O site mostra essa passagem: matéria bruta e textura em escala grande, contra tipografia e grid de precisão milimétrica. Linhas finas como traço de serra, medidas e legendas técnicas como detalhe gráfico.
- **Tipografia:**
  - Um display com personalidade (serifada de alto contraste ou grotesca estreita e firme) mais um texto de leitura excelente.
  - Licença livre para web, self-hosted em woff2 com subset latino, no máximo 2 famílias e 4 arquivos, preload do display e `font-display: swap`.
  - Evite o óbvio: Playfair, Montserrat, Poppins, Inter como única fonte, Cormorant.
  - Use números tabulares nas legendas técnicas.
- **Cor:**
  - Tirada da pedra: travertino, calcário claro, grafite, basalto e um acento metálico (bronze, latão) usado com parcimônia.
  - Fundo claro com seções escuras de contraste, ou o inverso, desde que haja ritmo.
  - Todos os pares de texto passam no WCAG AA (4,5:1 texto normal, 3:1 grande), com a verificação documentada.
- **Composição:**
  - Grid de 12 colunas no desktop e 4 no celular, com assimetria editorial e muito respiro.
  - Imagens que sangram a borda, legendas pequenas alinhadas ao grid e seções numeradas.
  - Proporções recorrentes (ex.: 4:5, 3:2, 21:9) para dar coerência.
- **Detalhe de pedra:** veio, borda (reta, meia-esquadria, boleada), acabamento (polido, levigado, escovado), luz rasante que revela a textura. Isso vira sistema: por exemplo, o hover de um cartão de material revela o acabamento com uma luz rasante sutil.
- **Motion:**
  - Uma assinatura, no máximo duas: por exemplo, a luz que desliza sobre a pedra conforme a rolagem, ou uma revelação de imagem em "corte".
  - Transições de 150 a 400 ms com easing suave.
  - Nada de parallax em tudo, contadores animados, carrosséis automáticos ou texto que aparece letra por letra.
  - Com `prefers-reduced-motion`, tudo estático.
- **Proibido:**
  - gradientes genéricos, glassmorphism, blobs, sombras pesadas;
  - grade de ícones genéricos, emojis, bandeirinhas de "1000 clientes";
  - depoimentos inventados, carrossel de logos;
  - botões com cantos exageradamente arredondados, tudo centralizado.

---

## 3. Página por página

A ordem e a função das seções vêm de `docs/proposta/arquitetura.md`. O que muda é a execução.

### Início (`/`)

1. **Abertura:**
   - Imagem ou vídeo em tela cheia (ou 85vh) de pedra em escala e luz rasante. H1 curto e forte, CTA de orçamento e link secundário "Ver materiais".
   - No celular, H1 e CTA visíveis sem rolar.
   - A imagem pôster é o LCP e deve chegar rápido.
2. **Caminhos:** escolha por material e por aplicação. Composição editorial, não uma grade de cartões iguais.
3. **Configurador 3D:** seção de destaque, escura ou de contraste. Explicação curta, o poster e o botão "Explorar em 3D". Detalhes na seção 5.
4. **Como pedir orçamento:** 3 ou 4 passos com numeração tipográfica grande, sem ícones.
5. **Trabalhos:** enquanto não houver fotos reais, mostre o bloco honesto já previsto ("fotos de obras em breve"), bem desenhado. **Nunca preencha com imagem gerada apresentada como obra.**
6. **Área atendida e contato:** texto do conteúdo e mapa só quando confirmado.
7. **CTA final:** WhatsApp com contexto.

### Sobre, Materiais, Material, Aplicações, Aplicação, Galeria, Contato

- Mesmo sistema. Cada página com uma abertura própria (imagem, título e intro), seções com ritmo e CTA final.
- **Material:** a página mais importante depois da home. Foto grande, ficha técnica diagramada como documento de precisão (tabela bem desenhada), acabamentos lado a lado e o explorador de chapa 3D.
- **Galeria:** grade editorial preparada para fotos reais. Hoje mostra o estado vazio honesto.
- **Contato:** o formulário é o protagonista. Campos grandes, rótulos visíveis, e o erro e o sucesso claros.

### Header, rodapé e WhatsApp fixo

- **Header:** fino e elegante, e pode ficar transparente sobre a abertura. Transparente ou não, o contraste tem que ser suficiente.
- **Logo:** a logo ainda não chegou (V1). Reserve a área e use o nome da empresa que vem do conteúdo (hoje é `pendente`). Não desenhe um logo falso.
- **Botão fixo de WhatsApp no celular:** discreto, sem cobrir conteúdo nem formulário.

---

## 4. Higgsfield: plano de assets

### 4.1 Créditos e orçamento (conta nova)

1. **Antes de qualquer geração paga, informe ao Vitor:**
   - quais ferramentas o MCP do Higgsfield realmente expõe no seu terminal;
   - qual conta está autenticada;
   - o saldo;
   - o custo estimado da primeira prova.

   Se alguma ferramenta não permitir consultar isso, diga qual limitação encontrou. Não invente valores.
2. **Saldo não é orçamento autorizado.** Proponha um teto em créditos que cubra a prova inicial, as variações previstas e uma reserva para os arquivos finais, e **espere o Vitor aprovar** antes de gerar conteúdo pago.
3. **Custos a considerar:**
   - não recarregue a conta nem contrate outro serviço;
   - estime o custo de cada geração antes de enviar;
   - vídeo só a partir de um frame já aprovado (image-to-video), nunca direto de texto.
4. **Modelos mais baratos:** servem para explorar composição e luz, mas trocar de modelo depois pode não reproduzir a cena aprovada. Defina cedo o modelo em que a versão final será feita.
5. **Se o plano não couber no teto aprovado,** siga a ordem de prioridade da lista abaixo e avise o Vitor do que ficou de fora.

### 4.2 Lista de assets, em ordem de prioridade

| # | Asset | Formato final | Observação |
|---|---|---|---|
| A1 | Abertura da home: close de bancada de pedra clara com veio, luz rasante de manhã, borda meia-esquadria em primeiro plano, fundo arquitetônico desfocado | imagem 21:9 (desktop) e 4:5 (celular) | é o pôster e o LCP |
| A2 | Vídeo da abertura: a partir do A1, movimento lento de câmera (dolly lateral ou luz que atravessa a pedra), 6 a 8 s, que funcione em loop | vídeo 16:9 e 9:16 | sem áudio, sem pessoas, sem cortes; Kling 3.0 ou Seedance 1.5 Pro para plano único sem cortes, Seedance 2.0 só se precisar |
| A3 | Texturas seamless para o 3D e o catálogo: mármore branco com veio, granito escuro, quartzito com veio, pedra clara levigada | 2048 px quadrado, seamless | vira textura do 3D e a foto de "material" provisória |
| A4 | Aberturas de Sobre, Materiais, Aplicações e Contato: detalhes de pedra e oficina sem pessoas nem marcas (chapa na bancada de corte, disco de serra parado, pó de pedra na luz, pilha de chapas) | imagem 3:2 ou 4:5 | coerentes com o A1 em luz e cor |
| A5 | Aplicações: cozinha, lavatório, escada, piso, área externa. Ambientes arquitetônicos sem pessoas, com o material em destaque | imagem 4:5 | legendados como "imagem ilustrativa" |
| A6 | Segundo vídeo (opcional): transição do bruto para o polido, para a seção do 3D ou de Materiais | vídeo 16:9 | só se houver crédito |

### 4.3 Regras de prompt e consistência

- **Linguagem fotográfica:** lente (ex.: 50 mm ou 90 mm macro), direção e cor da luz (rasante, lateral, manhã, 4500 K), profundidade de campo, textura e acabamento da superfície.
- **Sempre excluir:** pessoas, mãos, texto, logos, marcas d'água, reflexos distorcidos, geometria impossível.
- **Consistência:** mesma direção de luz e mesma paleta em todas as imagens. Use a imagem aprovada anterior como referência (`image` ou `start_image`) nas próximas.
- **Revisão:** confira cada imagem com lupa (veio que se repete de forma artificial, bordas derretidas, pedra "plástica"). Imagem com cara de IA não entra.

### 4.4 Tratamento e peso

- **Imagens:** fonte em `assets/images/` e pipeline existente (`npm run images:build`), que gera AVIF e WebP em várias larguras.
- **Metas de peso das imagens:**
  - abertura até 180 KB em AVIF no celular;
  - demais imagens até 120 KB na largura exibida.
- **Vídeo:** com o ffmpeg já instalado (SVT-AV1 e x264 disponíveis):
  - MP4 H.264 como fallback e AV1 (WebM ou MP4) como principal;
  - sem trilha de áudio, `-movflags +faststart`;
  - desktop com 1280 px de largura e até 2,5 MB, celular com 720 px e até 1,2 MB;
  - loop sem emenda visível (crossfade das pontas se precisar).
- **Regras de reprodução do vídeo:**
  - `<video muted playsinline loop preload="none" poster="...">`;
  - só dá play depois do carregamento da página e com a seção visível;
  - não dá play com `prefers-reduced-motion`, com `navigator.connection.saveData` ou em conexão 2g/3g lenta (fica no pôster);
  - pausa fora da tela;
  - botão acessível de pausar.
  - O vídeo nunca atrasa o LCP: o LCP é o pôster.
- **Registro obrigatório:** cada asset gerado entra em `docs/proposta/assets-licencas.md` com:
  - ferramenta e modelo;
  - prompt;
  - data;
  - custo informado pela ferramenta;
  - arquivo final;
  - os termos de uso comercial disponíveis;
  - a nota "provisório, gerado por IA, não representa obra ou material da JK".

  Nunca registre credenciais, tokens ou dados da conta.
- **Na página:** imagem gerada que mostre ambiente leva a legenda discreta "Imagem ilustrativa". Galeria e trabalhos só com foto real.

---

## 5. A experiência 3D

- **Qualidade visual:** a cena atual é um protótipo funcional (three.js puro, 136 KB gzip, primeiro frame em 1,43 s). Pode reescrever para ficar à altura do novo visual:
  - materiais PBR com as texturas do A3 e mapas de normal e rugosidade derivados;
  - luz de área ou HDRI leve (até 200 KB) para reflexo convincente no polido;
  - sombras suaves assadas (baked) em vez de sombras em tempo real;
  - câmera com movimento contido.
- **Configurador (home):** bancada de cozinha ou lavatório. O visitante troca o material (4 a 6) e o acabamento (polido, levigado, escovado) e vê a diferença de brilho e reflexo. Os controles são botões HTML reais sobre ou ao lado do canvas, e o botão "Pedir orçamento desta combinação" chama `onQuoteRequest`.
- **Explorador de chapa (página de material):** amostra em close com luz rasante que o usuário move (arrastar ou setas), e borda visível.
- **Limites:**
  - JS da cena até 250 KB gzip;
  - textura inicial até 300 KB;
  - primeiro frame em até 2,5 s (CPU 4x, 4G lenta);
  - pixel ratio máximo de 1,5 no celular;
  - render sob demanda (sem loop contínuo quando nada muda).
- **Fallback:** mantenha tudo o que já existe (WebGL ausente, perda de contexto, FPS baixo, aparelho fraco, movimento reduzido). Refaça os pôsteres para ficarem equivalentes à cena nova.
- **Alternativa aceitável:** se uma parte do 3D ficar melhor e mais leve como vídeo ou sequência de imagens (ex.: o giro da chapa), proponha. O critério é qualidade percebida por byte.

---

## 6. Limites técnicos (não negociáveis)

Metas no celular, Lighthouse mobile em build de produção:

| Métrica | Meta |
|---|---|
| LCP | até 2,0 s |
| CLS | até 0,05 |
| INP | até 150 ms |
| Performance | 90+ |
| Acessibilidade | 100 |
| Boas práticas | 100 |
| JS inicial por página, sem 3D | até 150 KB gzip (hoje 138 KB, não deixe crescer à toa) |
| Peso até o `load` da home, sem contar vídeo e 3D | até 1 MB |

- **Acessibilidade:**
  - navegação completa por teclado, foco visível e bonito (parte do design, não o azul padrão);
  - skip link, alvos de 44 px, landmarks, alt descritivo;
  - contraste AA também sobre imagem (use véu ou área sólida sob o texto);
  - `lang="pt-BR"`.
- **SEO:** todo texto no HTML estático, um único H1 por página e hierarquia correta. Nada de conteúdo importante só dentro do canvas ou do vídeo.
- **Dependências:** não adicione biblioteca de animação pesada (GSAP completo, Framer Motion). CSS e a API Web Animations resolvem. Qualquer dependência nova precisa de justificativa em bytes.

---

## 7. Processo e ponto de consulta

0. **Linha de base (antes de mudar qualquer coisa):** registre em `docs/auditorias/` as medidas do estado atual com os comandos exatos. Serve de "antes" para comparar.
1. **Primeira entrega: só a abertura da home, não o redesign completo.**
   - **Orçamento:** passo 1 da seção 4.1, com o teto aprovado pelo Vitor.
   - **Direção:** crie `docs/proposta/direcao-visual.md` com conceito, paleta com contrastes medidos, fontes (com licença), grid, a proposta do movimento principal, a lista de assets com prompts e o custo estimado contra o teto aprovado.
   - **Imagem:** gere **uma** imagem representativa da qualidade final pretendida para o A1 e implemente a abertura da home com ela. Nesta etapa não entram vídeo nem variações em volume. O movimento principal é descrito, ou demonstrado com CSS sobre a imagem.
   - **Referência externa:** se o Vitor indicar uma referência (por exemplo, um vídeo) que você não consiga acessar, diga isso. Não apresente uma proposta própria como reprodução verificada da referência.
   - **Onde mostrar:** preview local (`npm run dev` ou `out/` servido localmente), com capturas em 390 px e 1440 px em `docs/proposta/capturas/`. **Não publique no domínio para apresentar.**
   - **Pare e mostre ao Vitor**, num commit identificável, o que vai ser avaliado:
     - composição e iluminação;
     - aparência e escala dos materiais;
     - tipografia e hierarquia;
     - espaço para conteúdo e orçamento;
     - adaptação ao celular;
     - proposta do movimento principal.

     É o único ponto de parada obrigatório.
2. **Produção:** depois da aprovação, gere os assets necessários dentro do teto (A1 final, A2 a A6 só se fizerem sentido) e implemente todas as páginas e o 3D.
3. **Verificação:** rode a checklist da seção 8.
4. **Entrega:** commits pequenos e descritivos em português, sem emoji, na branch `redesign-astra`, com push dela. **Não faça push nem merge na `main`**, porque a `main` publica direto em https://jkmarmores.com.br. O Planejador revisa e faz o merge.

---

## 8. Checklist de entrega

- [ ] `npm run lint`, `npm run build` e `npm run check:pendencias` (homolog) sem erro.
- [ ] `npm run measure:bundle` com o JS inicial da home até 150 KB gzip.
- [ ] Relatório de peso, antes e depois da mudança, separando:
  - carregamento inicial;
  - downloads adiados (vídeo, 3D, imagens fora da tela);
  - peso por tipo (imagens, vídeos, 3D, JS, fontes).

  Cada resultado indica se foi medido em emulação ou em aparelho real; um não substitui o outro. Se uma meta impedir um resultado visual aceitável, apresente o conflito e uma alternativa. Não aumente limites por conta própria nem sacrifique a qualidade só para bater um número.
- [ ] Lighthouse mobile da home, de uma página de material e do contato, servidos de `out/` com compressão, dentro das metas da seção 6. Relatórios em `docs/auditorias/`.
- [ ] Página navegada só com teclado, do skip link ao envio do formulário.
- [ ] Página com JS desativado mostrando todo o texto e os links de WhatsApp.
- [ ] 3D testado com WebGL desativado, CPU 4x e `prefers-reduced-motion`.
- [ ] Vídeo testado com `prefers-reduced-motion` e Save-Data (deve ficar no pôster).
- [ ] Capturas finais de todas as páginas em 390 px e 1440 px em `docs/proposta/capturas/`.
- [ ] `docs/proposta/assets-licencas.md` completo, com créditos gastos.
- [ ] Nenhum dado da empresa fora de `pendente()` (`grep` por telefone, endereço, cidade).
- [ ] Resumo final: o que mudou, os assets gerados e os créditos gastos, as medições, o que ficou pendente e as dúvidas.
