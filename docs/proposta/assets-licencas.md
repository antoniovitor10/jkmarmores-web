# Assets e licenças provisórias

## Quarta entrega: prova de capa pela API, 27/09/2026

Teto autorizado por Vitor: US$ 5. A etapa (a) foi entregue em c15c6d9. A prova de capa **não foi aprovada na revisão técnica de movimento** e não entrou na home. Não foram enviados configurador, sequência ou regenerações adicionais.

Estimativas consultadas com autenticação em POST /estimate/{modelo}, antes de cada envio. Plano: capa Standard 6 s US$ 0,278; seis órbitas Pro 8 s (2 ambientes × 3 materiais) US$ 2,958; três transições Standard 3 s US$ 0,417; dez imagens Z-Image 2k US$ 0,150. Total US$ 3,803 + reserva de 20% US$ 0,7606 = US$ 4,5636. Terceiro ambiente excluído: acrescentaria três imagens e três órbitas, US$ 1,524. Quarto material nos dois ambientes excluído: duas imagens e duas órbitas, US$ 1,016. Esses acréscimos usam as mesmas configurações estimadas, não são cotações de envios realizados.

| Asset | Modelo efetivo | Request ID | Estimativa autenticada | Débito efetivo | Arquivo |
|---|---|---|---:|---|---|
| Imagem-chave quente, 2048×1152 | z-image/turbo; 2k; 16:9; prompt_extend false; seed 270926 | 325213ae-35bb-483b-9b76-af009803348e | US$ 0,015 / 0,240 créditos API | Não disponível na resposta | assets/provas/capa-quente-frame.png |
| Primeira e única prova de vídeo | kling-video/v3.0/std/image-to-video; 6 s; sound off; cfg_scale 0,5; multi_shots false; imagem-chave no início e fim | 56942962-4226-423d-a673-0922e4e9ed95 | US$ 0,278 / 4,436 créditos API | Não disponível na resposta | assets/provas/capa-quente-prova.mp4 |

Ambas concluíram com status completed. Vídeo recebido: H.264, 1280×720, 24 fps, duração 6,041667 s, 1.116.164 bytes, sem áudio. Total **estimado dos envios: US$ 0,293**. **Não declarar este total como cobrança confirmada.** Respostas finais e headers inspecionados não trouxeram custo; o portal da API estava sem login. Foi solicitada ao Vitor a cobrança por request para conferir a margem de 20%. Saldo API não consultável pelo SDK usado. Saldo MCP anterior 0 não é saldo API.

Prompts completos e parâmetros: [quarta-prova-api.json](quarta-prova-api.json). A credencial foi carregada somente pelo Node --env-file; nenhum arquivo de credenciais foi lido, impresso, copiado ou versionado. A imagem-chave local foi enviada ao armazenamento Higgsfield como referência do vídeo; nenhuma marca ou foto da cliente enviada.

### Prompt da imagem-chave

Architectural editorial photograph, extreme close view of a precisely mitered thick marble kitchen island edge. Natural WARM blush pink and honey beige stone, subtle caramel and dusty rose mineral veins, absolutely not white or blue-grey marble. Warm walnut architecture and charcoal plaster in softly blurred background. One long grazing beam of 4300K sunlight from the left reveals crystalline depth and fine polished surface. Island edge diagonally crosses lower right foreground, sculptural solid geometry, restrained luxury, tactile natural texture, 50mm tilt-shift lens, believable scale, realistic photography. Quiet dark negative space upper left. No people, hands, writing, logos, watermarks, duplicated patterns, plastic surfaces or impossible edges.

### Prompt do vídeo

A single continuous luxury architectural macro shot of this exact warm rose-beige marble island. Locked camera with an almost imperceptible slow lateral drift returning to the same framing. A soft warm grazing beam of sunlight slowly travels across the stone and settles back, revealing the caramel and blush mineral veins. Preserve every vein in its exact physical position, all stone geometry rigid and unchanged. Gentle natural specular highlights, calm warm walnut background, rich warm neutral color. Seamless loop, matching start and end. No people, hands, text, logos, watermark, cuts, melting, warping, changing veins, cold white marble or blue light.

### Revisão e termos

A imagem-chave tem temperatura bege rosada/caramelo coerente com a logo. Na sequência de quadros amostrados a cada 0,5 s, a geometria e os veios permanecem estáveis, mas deslocamento de câmera e luz são discretos demais para a intenção de capa cinematográfica. A restrição de câmera quase fixa e primeiro/último frame idênticos reduziu a ação. Prova rejeitada por movimento insuficiente, não por moderação. **Parada obrigatória acionada conforme instrução do Vitor; sem nova tentativa paga.** [Quadros da prova](capturas/quarta-prova-capa-quadros.jpg).

Conforme [API Terms of Service, seção 12](https://open.higgsfield.ai/terms-of-service) e [Termos de Uso, seção 4.4](https://higgsfield.ai/terms-of-use-agreement), consultados em 27/09/2026, Higgsfield não reivindica propriedade dos outputs nem restringe uso comercial; não garante exclusividade ou ausência de direitos de terceiros. Preservar atribuições de procedência quando existentes. [Cobrança e retenção](https://docs.higgsfield.ai/docs/concepts/billing-and-retention) documenta estimativa autenticada e cobrança de gerações concluídas, mas não devolve o débito neste resultado. Nada foi apresentado como obra ou material comercial da JK. Todo asset é **provisório, gerado por IA, não representa obra ou material da JK**.


## Terceira entrega institucional, 27/09/2026

Nenhuma geração, chamada paga, recarga ou vídeo nesta rodada. Gasto adicional: **0 créditos**. Último saldo MCP confirmado na entrega anterior: **0**; acumulado de gerações: **10 créditos**. Nenhuma nova consulta de saldo necessária para os recortes locais.

| Asset | Origem e tratamento | Uso / direitos |
|---|---|---|
| `assets/brand/logo-jk-cliente-2026-09-26.jpg` | JPEG 1600×1200 enviado pela cliente em 26/09/2026 e encaminhado pelo Planejador. Sem geração. | Marca fornecida para este site; uso no header/rodapé autorizado na instrução desta rodada. Vetor pendente (V1 parcial). |
| `public/brand/jk-logo-{288,480}.webp` | Recorte x260/y266, 1080×666, redimensionamento proporcional; fundo preto, desenho e assinatura preservados. Sharp; qualidades 88/92. | Derivados da marca da cliente, não redesenhada. Resolução suficiente para exibição em 2x. |
| `assets/images/a1-mobile.png`, `public/img/a1-mobile-*` | Recorte x710/y0, 1748×1344 do A1 existente, reduzido a 780 px; AVIF/WebP responsivos. | Mesma origem, licença e caráter provisório de A1; não é nova geração. |
| `assets/images/sequencia-02-borda-mobile.png`, `public/img/sequencia-02-borda-mobile-*` | Recorte x950/y470, 850×1063 do quadro 02 existente; aproxima quina e exclui peça solta. | Mesma origem e licença do quadro 02. Desktop e fonte original intactos; continua imagem ilustrativa. |
| Instrument Sans 400 estático / Instrument Serif 400 | Subsets locais das mesmas fontes OFL registradas abaixo; FontTools, caracteres portugueses. | Sem nova licença ou serviço; fonte de corpo sem eixos variáveis não usados. |

Tratamentos reproduzíveis: `node scripts/prepare-brand.mjs`, `npm run images:build` e `scripts/subset-home-fonts.py`. Nada da logo foi enviado a serviço de IA. A1 e os quatro quadros continuam claramente ilustrativos; nunca entram na galeria como obras. As seções abaixo preservam o histórico das gerações, licenças e gastos.

## A1: primeira prova da abertura da home

Data: 26/09/2026. **Provisório, gerado por IA, não representa obra ou material da JK.** Uso somente no preview local; aprovação visual do Vitor e do cliente pendente, registrada como V7 em `docs/PENDENCIAS.md`. Não incluir na galeria de trabalhos.

| Campo | Registro |
|---|---|
| Ferramenta | MCP Higgsfield, conector `mcp__codex_apps__higgsfield_generate_image` |
| Modelo solicitado | Nano Banana Pro, `nano_banana_pro` |
| Modelo no inventário do projeto após conclusão | `nano_banana_pro`, confirmado por `list_project_assets` |
| Identificador esclarecido em 26/09/2026 | `jobs_wait` retorna o backend/CLI `nano_banana_2`, nomeado Nano Banana Pro no catálogo oficial. O mapeamento oficial liga MCP `nano_banana_pro` a esse identificador; não houve troca. Fontes e conferência antes da segunda geração em [sequencia-geracao.md](sequencia-geracao.md). |
| Configuração enviada | 2K, 21:9, count 1, use_unlim false, sem imagem de referência |
| Job | `cf89be34-0303-4814-8f71-566818019006` |
| Fonte recebida | `assets/images/a1-prova-01.png`, 3168 x 1344 pixels; proporção efetiva 2,357:1, próxima de 21:9 |
| Integridade da fonte | 6.415.899 bytes; SHA256 `212cd79c3fc1b9656d5b3bdce9a3f3bc33c57b19488f2ce593957abee58777d4` |
| Derivados | `public/img/a1-prova-01-{390,768,1200,1600}.{avif,webp}`, gerados por `npm run images:build` |
| Uso mobile nesta prova | Recorte por CSS do mesmo arquivo; não houve geração 4:5 nem variação paga |
| Custo estimado pela ferramenta | 2 créditos exatos, confirmado imediatamente antes do envio |
| Gasto observado | 2 créditos, diferença de saldo de 10 para 8 após a única geração |
| Reserva ao encerrar A1 | 8 créditos; posteriormente realocados por Vitor para quatro imagens-chave da sequência, conforme registro abaixo |
| Vídeo e outros assets | Nenhum gerado; fora do teto A1 |

| Largura | AVIF em disco | WebP em disco |
|---|---:|---:|
| 390 | 2.508 bytes | 2.580 bytes |
| 768 | 5.385 bytes | 6.446 bytes |
| 1200 | 9.300 bytes | 12.388 bytes |
| 1600 | 13.121 bytes | 19.292 bytes |

O recorte mobile prioriza a quina central. `sizes` considera a largura necessária para preencher a moldura vertical sem ampliar uma miniatura; em DPR 2 pode receber o AVIF de 1600 px, ainda abaixo de 180 KB. Nenhum original PNG é servido pela página. Na segunda entrega, o AVIF A1 de 1600 px foi incorporado ao HTML; WebP responsivo permanece como alternativa.

Prompt integral enviado:

> Architectural material study for a refined natural-stone website. One photorealistic photograph, panoramic 21:9. Extreme attention to physical stone texture and believable fabrication. A pale warm ivory natural stone kitchen island fills the foreground, delicate irregular grey and muted taupe mineral veins, subtle honed sheen, beautifully precise 45-degree mitered apron edge. Camera is very close to the front corner at countertop height, 50mm architectural lens, f/5.6. The long front edge travels horizontally across the frame, with the corner positioned slightly right of center so the center-right area also works as a vertical mobile crop. The top surface and the vertical stone apron are both clearly readable; natural veins continue plausibly across the miter. Low morning sunlight enters from the upper left, warm-neutral 4500K, grazing the stone to reveal fine mineral grain and a crisp narrow edge highlight. Soft realistic contact shadows beneath the slab. In the upper background, a quiet architectural interior in warm limestone plaster and dark walnut, gently out of focus, a single deep shadow opening on the right. Restrained palette of chalk, warm grey, muted bronze and charcoal. Understated tactile architectural photography, accurate rectilinear geometry, no glossy plastic finish, no fantasy oversized veins, no artificial repeating pattern. No people, hands, text, lettering, logos, watermarks, decorative objects, taps, sinks, plants, distorted reflections or impossible geometry. This is an illustrative material study, not a photograph of a real company's completed work.

### Termos disponíveis e limites

Consulta em 26/09/2026 aos [Termos de Uso do Higgsfield](https://higgsfield.ai/terms-of-use-agreement), atualização de 26/07/2026, seção 4.4: Higgsfield não reivindica propriedade dos inputs/outputs nem restringe o uso comercial dos outputs. A [central oficial de ajuda](https://higgsfield.ai/creator-hub/help-center/account/who-owns-my-generations-and-can-i-use-them-commercially) confirma o uso em trabalhos de clientes. Isso não comprova exclusividade, existência de copyright ou ausência de direitos de terceiros. Não foram usados arquivos, marcas ou pessoas de terceiros como referência.

Inspeção visual do original: luz lateral quente, textura mineral fina, veios irregulares sem padrão evidente de repetição, quinas retas e sem reflexos plásticos. Não há pessoas, texto, logos ou marca d'água visível. A imagem representa um estudo arquitetônico genérico; não valida material comercial, técnica executada ou oferta da JK. A borda e a junção devem ser avaliadas como ilustração, não ficha de fabricação.

### Fontes da prova

Instrument Serif 400 e Instrument Sans variável 400–600, dois WOFF2 latinos em `public/fonts/`, total de 51.124 bytes em disco. Licença SIL Open Font License 1.1, com cópias `instrument-serif-OFL.txt` e `instrument-sans-OFL.txt`. Fontes oficiais: [Instrument Serif](https://github.com/google/fonts/tree/main/ofl/instrumentserif) e [Instrument Sans](https://github.com/google/fonts/tree/main/ofl/instrumentsans). Obtidas do CSS oficial Google Fonts em 26/09/2026, hospedadas localmente via `next/font/local`, sem chamadas externas no navegador.

## Segunda entrega: quatro imagens-chave

26/09/2026. A1 aprovado como base visual por Vitor. Os 8 créditos restantes foram autorizados para quatro imagens de 2 créditos, todas no mesmo Nano Banana Pro e com A1 como referência. **Gasto real desta entrega: 8; acumulado: 10; saldo: 0.** Nenhuma divergência, recarga, trial, vídeo ou geração adicional. Abertura mobile derivada do A1 por recorte.

Registro completo de ferramenta, modelo efetivo, quatro jobs, prompts integrais, saldos após cada envio, revisão visual, licença e cotação de vídeo: [sequencia-geracao.md](sequencia-geracao.md). Fontes: `assets/images/sequencia-{01-chapa,02-borda,03-acabamento,04-aplicada}.png`; finais AVIF/WebP em `public/img/`, larguras 390, 768, 1200 e 1600. Todos **provisórios, gerados por IA, não representam obra ou material da JK**, nem comprovam execução de processos pela empresa. V7 e O1/O4 continuam pendentes de confirmação do cliente.

Fontes agora reduzidas com FontTools 4.66.0 e Brotli 1.2.0: Instrument Serif 7.288 bytes (caracteres efetivamente usados no display, incluindo números) e Instrument Sans 19.664 bytes (ASCII, acentos PT-BR e pontuação editorial; eixo 400–600). Total 26.952 bytes, mesmos dois arquivos e licenças OFL. Serif tem preload; Sans é incorporada no CSS do HTML estático, sem requisição ou preload separado, preservando a tipografia em rede lenta. Ao mudar um título display, ampliar o subset a partir do original do commit A1 com `scripts/subset-home-fonts.py`; não adicionar uma terceira família. Sem nova dependência de runtime.

## Capa pela rolagem — API, 27/09/2026

Vitor autorizou a continuação pelas estimativas, com teto revisado de US$ 2,70 para Astra e configurador em outra frente. A capa aprovada na inspeção usa `z-image/turbo` (plano aberto quente) e `kling-video/v3.0/std/image-to-video` (8 s, imagem inicial e final distintas). Pôster é o primeiro quadro; recorte celular e compressão por Sharp/FFmpeg, sem geração adicional. Prompts, parâmetros, datas, request IDs, durações, estimativas e arquivos em [capa-video-api.json](capa-video-api.json); revisão e tratamento em [capa-video.md](capa-video.md). Acumulado estimado: **US$ 0,678**; restante do teto: **US$ 2,022**. Valor efetivo não retornado pela API, a conferir por Vitor. Qwen edit falhou por indisponibilidade, sem resultado: não contabilizado como débito conforme a [política oficial de falhas](https://docs.higgsfield.ai/docs/concepts/billing-and-retention).

Licença: [Termos da API](https://open.higgsfield.ai/terms-of-service), seção 12, e [Termos Higgsfield](https://higgsfield.ai/terms-of-use-agreement), seção 4.4, permitem uso comercial dos resultados nos limites contratuais, sem garantia de exclusividade ou ausência de direitos de terceiros. Referências próprias geradas; nenhuma pessoa, marca ou obra real de terceiros. Asset provisório com legenda **imagem ilustrativa, gerada por IA**; não é portfólio da JK. Nenhuma alteração na máscara PEDRA ou nos quatro quadros nesta etapa.

## Reuso do detalhe quente — etapa (d)

27/09/2026: `material-detalhe-quente.png` reutiliza integralmente `assets/provas/capa-quente-frame.png`, request `325213ae-35bb-483b-9b76-af009803348e`, Z-Image Turbo já registrado na prova API. Cópia e derivados AVIF/WebP locais; **nenhuma geração ou cobrança adicional**. Substitui a repetição do quadro 03 na seção de materiais da home. Mesmos termos da API acima, alt descritivo e legenda de imagem ilustrativa, não obra da JK.

## Prova da sequência rejeitada — etapa (e), 27/09/2026

Kling 3.0 Standard image-to-video, 5 s, dos quadros já aprovados 01 e 02. Request `33f8925b-6d45-4994-b11a-090f5a687a54`, completed, custo estimado prévio **US$ 0,231**. O sucesso técnico pode ser cobrado mesmo com rejeição visual: **incluído integralmente no acumulado estimado US$ 0,909**. Restante do teto Astra: **US$ 1,791**. Débito real não retornado pela API; Vitor confere o portal.

Rejeitado por transformação da geometria da pedra. Original arquivado em `assets/provas/jornada-video-1.mp4`, fora de public; não aplicado ao site. Dois envios seguintes cotados em US$ 0,231 cada não realizados. Registro completo de prompt, duração, parâmetros e estimativa em [sequencia-video-prova-api.json](sequencia-video-prova-api.json), decisão e quadros em [sequencia-video-parada.md](sequencia-video-parada.md). Mesmos termos API/Higgsfield já registrados; material ilustrativo gerado por IA, não obra ou processo da JK.

## Sequência por vídeos independentes — etapa (e) retomada

27/09/2026. Após a prova rejeitada, Planejador/Vitor autorizou um vídeo por quadro, somente com imagem inicial. Quatro envios `kling-video/v3.0/std/image-to-video`, 4 s cada, sem áudio ou imagem final: **US$ 0,185 estimados por envio**, **US$ 0,740 adicionais**. Acumulado de toda esta frente API, incluindo a prova rejeitada: **US$ 1,649**; restante do teto Astra US$ 2,70: **US$ 1,051**. Débito efetivo não retornado, a conferir por Vitor. MCP: zero nesta rodada.

| Quadro | Request ID | Resultado |
|---|---|---|
| 01 Chapa | b2d3902e-f26c-41f5-bd6e-99264d454139 | completed; aprovado antes de enviar 02 |
| 02 Borda | 9e6bff5f-8815-440c-8075-251750d0dace | completed; aprovado antes de enviar 03 |
| 03 Acabamento | 94d86d20-1599-4951-8f7f-f1efbeab1e55 | completed; aprovado antes de enviar 04 |
| 04 Peça aplicada | c6e6b2da-c0fd-4a1b-907f-62802e0c9cd4 | completed; aprovado na inspeção |

Prompts completos, parâmetros e metadados finais em [sequencia-clipes-api.json](sequencia-clipes-api.json). Fontes `assets/provas/jornada-rigida-{1,2,3,4}.mp4`; derivados em `public/video/jornada-*-{desktop,mobile}.mp4`. Revisão, recorte mobile 02 e comportamento em [sequencia-clipes.md](sequencia-clipes.md). Mesmos termos comerciais API/Higgsfield já citados, sem garantia de exclusividade. Apenas referências próprias geradas; imagens/vídeos ilustrativos, não obras, catálogo ou processos da JK. As legendas em HTML continuam explícitas e os quatro quadros estáticos são preservados como fallback.

## Experiência 3D existente

Registro em 25/09/2026. Todos são **amostras de demonstração**, não materiais oferecidos nem trabalhos executados pela JK. Trocar por fotos reais e autorização do cliente antes de apresentar como catálogo. Arquivos fontes ficaram apenas na pasta temporária local; os derivados WebP estão em `public/3d/textures/`.

| Uso provisório | Fonte e arquivo original | Licença verificada | Derivado local | Observação |
|---|---|---|---|---|
| Mármore | [Poly Haven, Marble 01](https://polyhaven.com/a/marble_01), [diffuse 1K JPG](https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/marble_01/marble_01_diff_1k.jpg), autor Rob Tuytel | [CC0 da Poly Haven](https://polyhaven.com/license), página do asset | `amostra-marmore.webp`, 3.162 bytes, SHA256 `AE588A34F951013EF0EBBDA06C381F668CE828A91A1B123B7B212A987AA33419` | Fotografia de piso; recorte 55,235 a 455,440 para excluir rejunte. Não representa chapa comercial inteira. |
| Granito | [Poly Haven, Granite Tile 03](https://polyhaven.com/a/granite_tile_03), [diffuse 1K JPG](https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/granite_tile_03/granite_tile_03_diff_1k.jpg), autora Charlotte Baglioni | [CC0 da Poly Haven](https://polyhaven.com/license), página do asset | `amostra-granito.webp`, 21.576 bytes, SHA256 `C5A9878FC6FB48945BB55441F40B1D185611A3DE40D1230959F4650244F7C17E` | Fotografia de placas; recorte 26,30 a 316,320 para excluir rejunte. Não representa chapa comercial inteira. |
| Quartzito | [OpenGameArt, Asterix Leatherfinish Quartzite diffuse](https://opengameart.org/content/real-marble-textures-collection-set-1-asterix-leatherfinish-quartzite-diffusejpg), [JPG original](https://opengameart.org/sites/default/files/oga-textures/107234/asterix%20-%20leatherfinish%20-%20quartzite-diffuse.jpg), autor indicado ShareTextures | CC0 indicado na [página do arquivo](https://opengameart.org/content/real-marble-textures-collection-set-1-asterix-leatherfinish-quartzite-diffusejpg) | `amostra-quartzito.webp`, 245.400 bytes, SHA256 `6BC592407D6B2D1F0139A0050EA52969D06E6443A95BA2582021A25523B8CCC9` | Fotografia de superfície, reduzida de 4570 × 3075 para 1024 × 689. O nome Asterix pertence à origem da textura, não ao catálogo da JK. |
| Modelo do ambiente | Geometria procedural em `StoneScene.tsx` | Código próprio do projeto | sem arquivo externo | Maquete genérica de cozinha, lavatório e chapa, sem associação a obra da JK. |
| Posters da cena | Captura local do canvas WebGL do protótipo com as três texturas acima | Código próprio e texturas CC0 registradas acima | 27 WebP em `public/3d/` | Três vistas, três amostras e três acabamentos; variantes visuais de uma maquete, não fotografias de obra. |
| Posters neutros | Composição esquemática original do projeto | Produção própria | nove WebP em `public/3d/` | Fallback para tipo sem textura autorizada; não representa uma chapa real. |

Os recortes WebP foram feitos com Pillow 12.3.0, qualidade 78 e método 6. As 27 capturas do canvas também foram exportadas com Pillow para WebP de 900 × 600, qualidade 74. Não foi gerado mapa normal ou rugosidade novo a partir da cor. O protótipo usa rugosidade parametrizada; sua aparência não é medição física dos acabamentos reais. Materiais confirmados no conteúdo recebem superfície e poster neutros enquanto não houver textura autorizada específica.

**Pendência para o cliente:** confirmar materiais, nomes comerciais, acabamentos, aplicações e fornecer fotos de chapas reais com autorização de uso. A Bussola registrou “Assets provisórios” em `docs/PENDENCIAS.md`, vinculada a O2, V3 e V4.


## Configurador

Gerado em 27/09/2026 por Orbita, branch configurador-imersivo. Teto US$ 2,00; total conservador dos 21 envios concluídos: US$ 1,8882. Débito financeiro real não informado pela API. Plano e revisão em [configurador.md](configurador.md); prompts integrais e parâmetros em [configurador-geracoes.json](../auditorias/configurador-geracoes.json).

Todos os assets: provisório, gerado por IA, não representa obra ou material da JK. Confirmação comercial e aprovação do cliente seguem pendentes em O2/V3/V4 e Assets provisórios de docs/PENDENCIAS.md.

Termos consultados: [API Terms, seção 12](https://open.higgsfield.ai/terms-of-service) e [Terms of Use, seção 4.4](https://higgsfield.ai/terms-of-use-agreement). Higgsfield não reivindica propriedade dos outputs nem restringe uso comercial; não garante exclusividade ou ausência de direitos de terceiros. A divulgação de geração por IA é mantida. Nenhuma foto de cliente, logo ou pessoa foi enviada.

| Asset | Modelo | request_id | Estimativa conservadora USD | Derivados |
|---|---|---|---:|---|
| cozinha-rosado / image | z-image/turbo | abcf1de8-6eed-4510-8aca-e6827d7ed421 | 0.0150 | Imagem-chave usada no vídeo de mesmo id, fonte local não versionada |
| cozinha-rosado / video | kling-video/v3.0/std/image-to-video | 82eed1ea-cb61-41b5-a351-43b864d380ec | 0.2772 | public/configurador/cozinha-rosado/{720,1280,2048}/00..23.avif |
| close-rosado-polido / close | z-image/turbo | 11aab6e7-8ea6-462f-9f28-b2b578c0acb3 | 0.0150 | public/configurador/closes/rosado-polido.avif |
| close-rosado-levigado / close | z-image/turbo | 8bd0a318-de14-402d-963f-dd5754a07b76 | 0.0150 | public/configurador/closes/rosado-levigado.avif |
| close-rosado-escovado / close | z-image/turbo | 0c875aa1-b188-4ead-90af-84d44dca2cde | 0.0150 | public/configurador/closes/rosado-escovado.avif |
| cozinha-bege / image | z-image/turbo | a06425d5-9517-47d9-867d-72402e23ad8a | 0.0150 | Imagem-chave usada no vídeo de mesmo id, fonte local não versionada |
| cozinha-bege / video | kling-video/v3.0/std/image-to-video | bd85e37a-fe9b-4460-8af7-e60baa961e0b | 0.2772 | public/configurador/cozinha-bege/{720,1280,2048}/00..23.avif |
| cozinha-escuro / image | z-image/turbo | 69679d06-3c00-472e-b0c3-7d5a264667df | 0.0150 | Imagem-chave usada no vídeo de mesmo id, fonte local não versionada |
| cozinha-escuro / video | kling-video/v3.0/std/image-to-video | 2ccd45c8-d9df-40b7-a89b-c9c822c4ec00 | 0.2772 | public/configurador/cozinha-escuro/{720,1280,2048}/00..23.avif |
| lavatorio-rosado / image | z-image/turbo | f6fcaa1d-fa03-4c44-8211-ca4ddc1c6d60 | 0.0150 | Imagem-chave usada no vídeo de mesmo id, fonte local não versionada |
| lavatorio-rosado / video | kling-video/v3.0/std/image-to-video | 1d66ad18-fc96-46f5-a902-fda2fe810340 | 0.2772 | public/configurador/lavatorio-rosado/{720,1280,2048}/00..23.avif |
| lavatorio-bege / image | z-image/turbo | 5095ac71-5452-45ca-aa7c-a353adbfbe1f | 0.0150 | Imagem-chave usada no vídeo de mesmo id, fonte local não versionada |
| lavatorio-bege / video | kling-video/v3.0/std/image-to-video | 773cf567-a4a2-44b9-a2df-6b7184f609d5 | 0.2772 | public/configurador/lavatorio-bege/{720,1280,2048}/00..23.avif |
| lavatorio-escuro / image | z-image/turbo | 50229011-cdf6-497c-9806-39d9902a43a2 | 0.0150 | Imagem-chave usada no vídeo de mesmo id, fonte local não versionada |
| lavatorio-escuro / video | kling-video/v3.0/std/image-to-video | 1a08f16f-c300-4522-9423-913e983b5d11 | 0.2772 | public/configurador/lavatorio-escuro/{720,1280,2048}/00..23.avif |
| close-bege-polido / close | z-image/turbo | d154de0d-8cdb-4ee9-a4fc-1823f7a0f26b | 0.0150 | public/configurador/closes/bege-polido.avif |
| close-bege-levigado / close | z-image/turbo | 12ee353a-90c8-49e6-afb7-d372514934fb | 0.0150 | public/configurador/closes/bege-levigado.avif |
| close-bege-escovado / close | z-image/turbo | d1162bfb-227a-42eb-aa72-760201c59d8a | 0.0150 | public/configurador/closes/bege-escovado.avif |
| close-escuro-polido / close | z-image/turbo | 9150edee-5ca0-4fd7-aa18-4eb65ab5ebf4 | 0.0150 | public/configurador/closes/escuro-polido.avif |
| close-escuro-levigado / close | z-image/turbo | 4ea409e5-eda6-4d1b-8e87-eb8a4e715063 | 0.0150 | public/configurador/closes/escuro-levigado.avif |
| close-escuro-escovado / close | z-image/turbo | 538946e7-caca-44bc-8347-3adf907cd94a | 0.0150 | public/configurador/closes/escuro-escovado.avif |

2048 px dos quadros são reamostrados de vídeo 1280 px; não são detalhe óptico nativo 2k. Closes derivam de imagens nativas 2048 px. Vídeos e fontes PNG ficam apenas no diretório local tools/higgsfield/configurador-assets. Não foram publicados vídeos nem credenciais.

## Derivados para rolagem curta — 27/09/2026
Sem nova geração, sem novo request_id e sem custo. Os vídeos aprovados da capa e quatro etapas foram retemporizados para1,458333s/24fps, H.264 e AV1 já previstos, sem áudio, faststart, GOP6. Mesma pedra, mesmos enquadramentos/cortes de dispositivo e movimento original completo. Fontes fixadas no commit cc06d32; script scripts/shorten-motion-videos.mjs e bytes/parametrização em docs/auditorias/2026-09-27-videos-curtos.json. Licenças, prompts e IDs de origem nas entradas anteriores continuam válidos. Capa mobile282.544B H.264 /332.556B AV1; desktop427.719B H.264 /391.818B AV1. Quatro etapas somadas:909.685B desktop /562.712B mobile. Fontes históricas mantidas no acervo; derivados públicos sem uso e fonte variável sem uso retirados. Custo desta rodada: US$0; nenhum acesso à API ou ao saldo da Orbita.

## 28/09: Barlow self-hosted
Barlow Regular 400 e Barlow Semi Condensed SemiBold 600: Google Fonts, https://github.com/google/fonts/tree/main/ofl/barlow e https://github.com/google/fonts/tree/main/ofl/barlowsemicondensed. SIL OFL 1.1, licencas em public/fonts/. Subset latino/portugues WOFF2, sem hinting, 13.044 e 13.272 bytes; sem custo ou geracao. Display com preload, fallbacks Arial com metricas ajustadas por next/font/local. GSAP 3.15.0 importado dinamicamente apos poster/fontes; documentacao: https://gsap.com/docs/v3/Installation/.

## 28/09: close e monograma da capa (entrega C)
Derivados locais do video aprovado assets/provas/capa-dolly-01.mp4: recorte 850x400 em x100/y315, H.264 CRF19, GOP6, sem audio, faststart, 1.893.993 bytes. Poster extraido do primeiro quadro (assets/images/capa-close.png), AVIF/WebP responsivos. Nenhuma geracao, request_id ou custo novo. Logo do header: recorte fiel do JPEG da cliente em x380/y276, 790x480, WebP240px; nao e o vetor oficial. Legenda global IA e textos alternativos mantidos. O SVG provisorio pertence a entrega D.


## 28/09: fontes da direcao premium
Bodoni Moda 400 (opsz 48), Owen Earl: https://github.com/google/fonts/tree/main/ofl/bodonimoda. Source Sans 3 400, Paul D. Hunt/Adobe: https://github.com/google/fonts/tree/main/ofl/sourcesans3. SIL OFL 1.1, copias locais OFL-BodoniModa.txt e OFL-SourceSans3.txt. Subsets WOFF2 latinos de 13.020 e 11.836 bytes, sem hinting. Hospedagem local e fallbacks metricos ajustados. Custo US$ 0. Nenhum envio a API.

## 28/09: tratamento editorial e capa
Sem geração ou request_id novo. Fontes pagas e direitos permanecem os registrados acima; originais intactos. scripts/editorial-image.mjs aplica Sharp no build: saturação 0,86; ganho RGB 0,92/0,91/0,90 e offset 10/9/8; grão monocromático determinista de amplitude 2,4/255. Derivados AVIF qualidade 50 e WebP 72. O recorte móvel da capa parte de material-detalhe-quente.png em x160/y0, 900x1152, sem ampliação. Logo e imagens do configurador não recebem esse tratamento. A capa usa uma imagem, conforme a nova direção; fontes dos vídeos pagos ficam preservadas no acervo. Aviso IA único no rodapé e alt ilustrativo nas imagens. Custo desta entrega US$ 0.


## 28/09: monograma provisório e jornada editorial
JK vetorizado manualmente do JPEG fornecido pela cliente, coordenadas relativas x385/y280. Arquivo public/brand/jk-monograma-provisorio.svg, textura do JPEG e traçado src/content/monogram.ts; PROVISÓRIO, substituir pelo vetor oficial (V1 parcial). scripts/build-monogram.mjs remove só o preto do fundo nas bordas, sem redesenhar a marca. Nenhum modelo, request_id ou custo novo.
Vídeos da jornada já pagos, tratados localmente por scripts/editorial-videos.mjs: saturação0,86, contraste0,91, brilho0,035 e leve calor de canais. H.264 CRF20, GOP6, faststart,1,458333s, sem áudio. Desktop somado1.170.426B; mobile928.746B/720p. Fontes originais preservadas. Aviso de IA único e alt ilustrativo; nenhuma afirmação de que a JK executa os processos ilustrados. Custo US$0.


## 28/09: unidade quente da jornada, entrega final
Sem geração, request_id ou custo novo (US$ 0). Os quatro quadros e o recorte móvel 02 recebem Sharp editorial com saturação 0,86, ganho RGB 0,94/0,89/0,83 e offset 11/10/9; grão fino determinista já descrito. Apenas derivados, originais preservados. Os oito vídeos existentes recebem o mesmo balanço em FFmpeg (eq saturation + lutrgb), H.264 CRF20, GOP6, faststart, sem áudio. Desktop total 1.186.831 B; celular 940.838 B/720p. Scripts editorial-image.mjs, build-images.mjs e editorial-videos.mjs. Capa permanece fotografia editorial estática, sem vídeo na entrada. Aviso IA único preservado.

## 30/09: tipografia da versão 2, após feedback do Vitor

Work Sans Light 300, The Work Sans Project Authors (Wei Huang): [fonte no Google Fonts](https://github.com/google/fonts/tree/main/ofl/worksans), [licença SIL OFL 1.1](https://raw.githubusercontent.com/google/fonts/main/ofl/worksans/OFL.txt), cópia integral em `public/fonts/WorkSans-OFL.txt`. Instância estática do eixo wght=300, subset Latin-1 com português e pontuação U+2000–206F, sem hinting, WOFF2 de 16.924 bytes. Reprodução em `scripts/subset-work-sans.py` a partir de `WorkSans[wght].ttf`. Source Sans 3 400 continua como corpo, subset de 11.836 bytes e licença já registrada acima. Total das duas fontes: 28.760 bytes, carregadas localmente por next/font/local, preload e fallback Arial com métricas ajustadas; nenhum pedido a Google Fonts em runtime. Bodoni Moda permanece apenas no acervo histórico, sem ser carregada. Custo US$ 0.

Justificativa em três linhas:
Work Sans Light traz títulos leves e um desenho sóbrio, próximo da clareza das referências de pedra e arquitetura.
Caixa alta com espaçamento amplo marca a assinatura da JK; títulos longos usam leitura natural e menos espaço entre letras.
Source Sans 3 mantém o texto confortável, enquanto os subsets locais preservam a entrega rápida e os acentos portugueses.

## 01/10: capa e logo da versão 2

Sem geração, request_id ou custo novo. A capa reaproveita `assets/images/sequencia-04-aplicada.png`, render ilustrativo já registrado, nativo 2752×1536. `scripts/build-images.mjs` gera `capa-galeria-*` sem o tratamento escuro anterior e com `withoutEnlargement`; recorte móvel x1730/y0, 710×1536. AVIF 68 e WebP 90 na capa, AVIF 58/WebP 84 na jornada; variantes até a largura nativa. O original do close (`a1-prova-01.png`, 3168×1344) foi examinado, mas o quadro de ambiente foi escolhido para preservar as extremidades da bancada. As fontes disponíveis não são 4K: em DPR 2 o navegador usa a maior variante nativa, sem prometer detalhe óptico ausente. As imagens continuam ilustrativas, não obras da JK.

`scripts/build-brand-transparent.mjs` deriva os arquivos `public/brand/jk-*-alfa-*` do JPEG fornecido pela cliente, `assets/brand/logo-jk-cliente-2026-09-26.jpg`. Preto convertido em alfa e bordas desmultiplicadas para não carregar halo preto; textura e desenho originais preservados. Recortes nativos: monograma 780×472, logo completa 1036×637. PNG com alfa e WebP lossless, sem ampliação. Uso da marca fornecida pelo próprio cliente; vetor oficial ainda pendente. Favicon, icon.png e apple-icon.png vieram da main, commit 068146d. Custo desta rodada US$ 0.
