# Assets e licenças provisórias

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
