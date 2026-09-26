# Direção visual: o corte

Prova A1, 26/09/2026. Tarefa vigente: `docs/tarefas/05-astra-redesign.md`. Aprovação de orçamento recebida nesta sessão: 10 créditos exclusivamente para A1, Nano Banana Pro. Esta etapa produz uma única imagem e a abertura local; a aprovação visual ainda está pendente.

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
