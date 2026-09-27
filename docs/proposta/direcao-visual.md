# Direção visual: o corte

## Terceira entrega: identidade institucional, 27/09/2026

Esta seção é a direção vigente. Vitor aprovou a máscara PEDRA e os quatro quadros da segunda entrega, mas pediu reconstrução da abertura e das páginas institucionais. A logo JPEG da cliente, recebida em 26/09, passa a orientar a identidade. Os registros de A1 e da segunda entrega abaixo são históricos.

Tom: confiança institucional com composição editorial. Preto na marca, grafite na abertura e no contato, pedra quente nos intervalos e caramelo nos detalhes e ações. A apresentação responde quem é a empresa, onde está e como falar com ela usando exclusivamente os dados confirmados. Serviços e materiais não recebidos continuam explicitamente pendentes. Sem números comerciais, depoimentos, prazos ou promessas técnicas inventados; sem gradientes genéricos, ícones decorativos ou imagens de IA apresentadas como obras.

Logo: recorte integral do desenho e assinatura do JPEG, mantendo fundo preto e proporção. WebP 288/480 px com seleção responsiva; atende 2x no header (120/144 px) e no rodapé (180/210 px). Sem vetor fabricado, redesenho ou mudança de cores da marca. V1 parcial até chegar o vetor.

Instrument Serif 400 continua nos títulos e Instrument Sans 400 no corpo e controles. Subset com caracteres portugueses, agora com cobertura de títulos das páginas internas. Desktop: H1 até 104 px e H2 até 60 px; mobile: H1 54 px e H2 40 px. Corpo de 15–18 px, com entrelinha de 1,65. Apenas o display recebe preload; fallback com size-adjust. O peso 400 estático do Sans evita transferir eixos não usados.

| Par de cor | Contraste |
|---|---:|
| Texto `#211c18` / papel `#f3ece2` | 14,40:1 |
| Secundário `#695b4e` / superfície `#e8ddcf` | 4,89:1 |
| Papel `#f3ece2` / grafite `#191715` | 15,24:1 |
| Caramelo `#cea57e` / grafite | 7,92:1 |
| Botão claro `#fff8f0` / bronze `#835638` | 5,95:1 |
| Pendência `#62462f` / fundo `#ead7bc` | 6,13:1 |

Todos os pares funcionais, hover e foco estão em `docs/auditorias/2026-09-27-institucional-contraste.json`, reproduzidos por `node scripts/check-contrast.mjs`. O caramelo fica sobre o escuro; no claro, texto e botão usam bronze mais escuro.

Home: abertura com nome de atividade/cidade, CTA cedo e A1 reenquadrado; apresentação local antes da sequência para situar o visitante; máscara PEDRA e jornada escura aprovadas; orientação sobre material/aplicação; configurador 3D; três passos para preparar o contato; espaço honesto para obras reais; endereço e telefone. A inclusão da apresentação antes da jornada corrige a ausência de contexto institucional sem substituir a experiência aprovada.

Sobre apresenta os dados confirmados e orienta o primeiro contato, sem inventar história ou processo. Materiais oferece critérios de escolha e o estado explícito do catálogo ainda não recebido. Contato prioriza telefone e endereço, com formulário de rascunho enquanto o WhatsApp não for confirmado. Aplicações, Galeria e placeholders herdam tipografia, header, footer e composição coerentes. Os controles do 3D ganham painel com hierarquia, mantendo contratos e fallback.

Grid de até 1280 px; margens móveis de 24 px; respiro alternado de 64/100 px. A1 reaproveitado na abertura; imagens da sequência reaproveitadas em blocos editoriais com legendas ilustrativas. O quadro 02 ganha somente um recorte móvel mais próximo da quina, excluindo a peça solta da direita; desktop permanece intacto. Máscara, duração da rolagem, quatro etapas e alternativas estáticas preservadas. Sem novas gerações, sem vídeo e sem publicação.

Configuração experimental `inlineCss: true`, introduzida em eef51ef, permanece: o CSS chega no HTML para eliminar uma requisição bloqueante. A opção é global e duplica estilos no payload RSC; perde cache independente entre páginas e aumenta HTML. Não houve nova alteração de `next.config.ts` nesta rodada. O comando de build em `package.json` agora inclui `scripts/defer-hydration.mjs`: no export estático, scripts de interatividade iniciam automaticamente após load e a primeira pintura observada, sem depender de clique; interação pode antecipar. Há fallback de 1,5 s e preservação dos scripts originais. Isso exige rever o pós-processamento ao atualizar Next/React; os testes conferem início automático, ausência de erros de hidratação, formulário e 3D. HTML, CSS, fontes e imagem continuam disponíveis sem JS. O relatório mede também o tráfego após a ativação dos scripts, para não confundir o novo load antecipado com economia de bytes. Workflow e destino de deploy permanecem intactos.

Prova A1 e segunda entrega, 26/09/2026. Tarefa vigente: `docs/tarefas/05-astra-redesign.md`. A1 aprovado por Vitor como base, não como resultado final. A revisão mais recente abaixo substitui as reservas e o movimento da primeira prova. O histórico da direção A1 está preservado nas seções seguintes.

## Segunda entrega: da matéria à forma

Referência lida: `jk-marmores-refs/referencia-tutorial-astra.md`, `abertura.jpg`, `final.jpg` e transcrição. Leitura de quadros estáticos, não reprodução verificada do vídeo. Aproveitamos a técnica de máscara tipográfica e a relação entre rolagem, enquadramento, legenda fixa e progresso. Não usamos imagens, texto, marca, paleta azul ou composição do Aurora.

Mantemos a abertura A1, Instrument Serif/Sans e paleta clara. A palavra neutra PEDRA ganha preenchimento com A1, aumenta com a rolagem e dá passagem a uma seção escura. Quatro imagens-chave, com luz e paleta de A1, apresentam chapa, borda, acabamento e peça aplicada. Legenda em HTML, número 01/04 a 04/04 e linha de progresso permanecem no enquadramento. Os títulos descrevem o estudo ilustrativo, não serviços da empresa. Aviso explícito: não representam obras, materiais ou processos da JK.

`position: sticky`, rolagem nativa e `requestAnimationFrame`, sem biblioteca de animação, sem captura de wheel/touch e sem reprodução automática. A sequência ocupa 620svh; 22% do percurso prepara a máscara, 78% distribui as quatro etapas. Há links para pular aos materiais e trocar para imagens sem movimento. Sem JS, reduced-motion ou Save-Data, as quatro imagens e legendas ficam em fluxo normal. Em 2g/3g, apenas o vídeo futuro é bloqueado; as imagens continuam guiadas pela rolagem. Configurador, explorador, seleção e WhatsApp continuam abaixo da apresentação e nas rotas existentes.

No celular, faixa de orçamento opaca de 76 px mais safe-area, botão de 48 px, espaço correspondente no fim do documento e na altura sticky. A faixa fica oculta enquanto o formulário de contato está em foco, para não cobrir campos nem o botão de envio. A pendência introdutória tem respiro depois da legenda A1 para não encostar na faixa na abertura. O A1 mobile é recorte do mesmo arquivo; nenhuma nova geração mobile.

Performance: display com preload via `next/font/local`; corpo sem preload, incorporado como WOFF2 no CSS do HTML estático para eliminar a dependência de uma segunda requisição de fonte. Mesmas famílias e pesos, subsets menores e fallback com `size-adjust` (Times New Roman para display; Arial a 103,22% para corpo, métricas obtidas do loader Next para o mesmo arquivo). O Next experimental `inlineCss` entrega CSS crítico junto do HTML; custo: CSS duplicado no payload RSC e perda de cache separado. A detecção do Tailwind foi limitada a src, conforme a [documentação oficial](https://tailwindcss.com/docs/detecting-classes-in-source-files), para não gerar utilitários encontrados em relatórios. A configuração de export, rotas e deploy permanece a mesma. As imagens da sequência só recebem src/srcset ao entrar no viewport; noscript fornece imagens nativas lazy. A textura da máscara também espera load e visibilidade. O AVIF de 1600 px do A1 (13.121 bytes) é incorporado ao HTML para eliminar também a requisição do pôster; mantém prioridade alta e carregamento eager, com WebP responsivo como alternativa para navegadores sem AVIF. Isso amplia o HTML e abre mão do cache separado da abertura. Os demais AVIF continuam arquivos externos carregados quando necessários.

A altura sticky já está reservada no HTML para evitar um salto na hidratação. Sem JS, um bloco noscript restaura o fluxo contínuo das imagens; as legendas continuam HTML. Links compartilhados de header, rodapé e CTA usam âncoras nativas: o export em Windows apresentava prefetch de segmentos RSC inexistentes e erros 404 intermitentes. As URLs e o comportamento sem JS permanecem válidos.

Vídeo futuro: contrato desativado em `src/content/stone-journey.ts`. O controlador só atribui src após load, duas pinturas e visibilidade; não faz autoplay, sincroniza currentTime com a mesma progressão, preserva legendas HTML e imagens como fallback em erro. Desktop limitado a 8.000.000 bytes; mobile 720p a 3.000.000 bytes, com fontes separadas. A produção aprovada deverá validar GOP curto, faststart, ausência de áudio e busca fluida. Arquivo e comportamento de decodificação reais ainda não testados, pois nenhum vídeo foi gerado. Reduced-motion/Save-Data não criam elemento de vídeo.

Orçamento revisado: quatro imagens Nano Banana Pro, 2 créditos estimados e debitados em cada envio; 8 nesta etapa, 10 acumulados e saldo 0. Prompts, confirmação de modelo e cotações em [sequencia-geracao.md](sequencia-geracao.md). Vídeo ~20 s: Kling 3.0 std sem áudio, 2 x 10 s, 30 créditos; Seedance 1.5 Pro 720p sem áudio, 12 + 8 s, 23,99. Nenhuma geração de vídeo autorizada.

## Conceito e composição

O encontro entre matéria e precisão: o veio irregular da pedra contra linhas retas, composição editorial e tipografia de alto contraste. A fotografia mostra uma borda em meia-esquadria próxima à câmera; a linha horizontal da bancada prolonga o grid. O tom é editorial sóbrio, com luz de manhã, calcário e grafite quente, adequado a uma escolha de material que precisa ser vista em detalhe.

A abertura ocupa aproximadamente uma tela: título e orçamento em uma faixa clara, fotografia panorâmica sangrando as laterais logo abaixo e legenda técnica discreta. Refinamento da abertura inteiramente sobre foto sugerida no briefing: separar a tipografia da imagem conserva o contraste, deixa os veios livres e traz o CTA antes da fotografia no celular. A imagem continua dominante na área visual e é servida com prioridade alta. Não usar marca fictícia: o nome vem de `conteudo.empresa.nome`, com marcador enquanto D1/V1 estiverem abertos.

Desktop: grid de 12 colunas, margem de 56 px em 1440 px, título em oito colunas e bloco de orientação/CTA nas quatro restantes. Celular: quatro colunas, margem de 24 px, título seguido do CTA e imagem com recorte vertical. O recorte é CSS da mesma prova, não uma segunda geração; a imagem 4:5 final está reservada para depois da revisão. Não alterar a ordem nem a função das demais seções nesta entrega.

## Tipografia

- Instrument Serif, 400, display: título da abertura, aproximadamente 104 px no desktop e 56 px no celular, entrelinha 0,98 a 1,04 e tracking -0,025em.
- Instrument Sans, variável 400 a 600, corpo e navegação: 16 px, entrelinha 1,5 a 1,6; legendas de 11 a 12 px, números tabulares.
- Dois arquivos WOFF2, subset latino com acentos PT-BR; self-hosted. `font-display: swap`, preload do display; nenhuma requisição ao Google no navegador.
- Licença SIL Open Font License 1.1. Originais e licenças: [Instrument Serif](https://github.com/google/fonts/tree/main/ofl/instrumentserif), [Instrument Sans](https://github.com/google/fonts/tree/main/ofl/instrumentsans). Cópias OFL acompanham os arquivos locais em `public/fonts/`.

## Paleta e contrastes medidos

Razões calculadas pela luminância relativa sRGB WCAG, sem arredondamento antes da divisão. A interface não usa texto diretamente sobre a foto; a legenda tem fundo sólido.

| Token | Cor | Uso | Contraste |
|---|---|---|---|
| Calcário | `#F2EFE8` | Fundo e texto do botão escuro | 13,00:1 contra grafite |
| Grafite | `#262820` | Texto principal, CTA, foco no claro | 13,00:1 contra calcário |
| Musgo cinza | `#66695E` | Texto secundário no claro | 4,88:1 contra calcário |
| Bronze | `#B4A48B` | Detalhe no escuro, nunca texto sobre claro | 6,13:1 contra grafite |
| Linha | `#D6D2C7` | Divisória decorativa | Não usada como limite essencial de controle |

Os marcadores de pendência conservam cores e conteúdo próprios; não são apagados para favorecer a captura. Estados de hover e foco mantêm contraste e alvos de pelo menos 44 px.

## Movimento principal proposto

Revelação curta em corte horizontal, no futuro, restrita à moldura da imagem. Nesta prova a fotografia fica estática: o LCP não espera animação. A proposta é um movimento único de 350 ms por `clip-path`, apenas após a imagem já estar visível, sem esconder título ou CTA; `prefers-reduced-motion` mantém tudo estático. Somente hover/foco de 180 ms nos links é implementado. Sem biblioteca de animação e sem vídeo nesta etapa.

## A1: prompt e orçamento

Modelo da prova e dos finais: `nano_banana_pro`, `resolution: 2k`. Uma prova 21:9, `count: 1`, créditos pagos explicitamente selecionados. Estimativa conferida pelo MCP em 26/09: 2 créditos exatos, tanto em 21:9 quanto em 4:5.

Prompt da prova:

> Architectural material study for a refined natural-stone website. One photorealistic photograph, panoramic 21:9. Extreme attention to physical stone texture and believable fabrication. A pale warm ivory natural stone kitchen island fills the foreground, delicate irregular grey and muted taupe mineral veins, subtle honed sheen, beautifully precise 45-degree mitered apron edge. Camera is very close to the front corner at countertop height, 50mm architectural lens, f/5.6. The long front edge travels horizontally across the frame, with the corner positioned slightly right of center so the center-right area also works as a vertical mobile crop. The top surface and the vertical stone apron are both clearly readable; natural veins continue plausibly across the miter. Low morning sunlight enters from the upper left, warm-neutral 4500K, grazing the stone to reveal fine mineral grain and a crisp narrow edge highlight. Soft realistic contact shadows beneath the slab. In the upper background, a quiet architectural interior in warm limestone plaster and dark walnut, gently out of focus, a single deep shadow opening on the right. Restrained palette of chalk, warm grey, muted bronze and charcoal. Understated tactile architectural photography, accurate rectilinear geometry, no glossy plastic finish, no fantasy oversized veins, no artificial repeating pattern. No people, hands, text, lettering, logos, watermarks, decorative objects, taps, sinks, plants, distorted reflections or impossible geometry. This is an illustrative material study, not a photograph of a real company's completed work.

| Reserva | Quantidade | Créditos |
|---|---:|---:|
| Prova 21:9 agora | 1 | 2 |
| Variações de luz/composição, somente após revisão | até 2 | até 4 |
| Finais desktop 21:9 e celular 4:5, usando a imagem aprovada como referência | 2 | 4 |
| Teto A1 | até 5 imagens | 10 |

Não há autorização de vídeo, textura 3D ou outro asset neste teto. Se a cobrança divergir da estimativa, parar e informar. Não consumir as reservas antes da revisão da primeira abertura.

Fonte em `assets/images/`, AVIF/WebP pelo pipeline existente. Meta mobile: até 180 KB AVIF. Legenda visível: "Imagem ilustrativa" e indicação de geração por IA; nunca incluir em Trabalhos/Galeria como obra. Registro completo e licença em `assets-licencas.md`; aprovação do cliente permanece pendente.

## Limites desta entrega e avaliação

Sem gradientes genéricos, ícones decorativos, formas abstratas, cartões flutuantes, sombras pesadas, números comerciais ou depoimentos inventados. Preservar SEO, noindex, pendências, rotas, orçamento, 3D e deploy.

Avaliar no preview: composição e iluminação; aparência e escala dos materiais; tipografia e hierarquia; espaço para conteúdo e orçamento; adaptação ao celular; proposta do movimento principal. Capturas em 390 x 844 e 1440 x 900, emulação, não aparelhos reais. Medições antes/depois em `docs/auditorias/`, export estático com gzip.
