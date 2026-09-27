# Sequência da pedra: registro de geração

26/09/2026. Segunda entrega autorizada por Vitor: os 8 créditos remanescentes foram realocados exclusivamente para quatro imagens-chave. A abertura mobile usa recorte do A1, sem nova geração. Nenhum vídeo gerado.

Modelo confirmado antes de gerar: **Nano Banana Pro**, identificador público MCP `nano_banana_pro`, identificador do backend/CLI `nano_banana_2`. O [mapeamento oficial MCP/CLI](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md) e o [catálogo oficial da CLI](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) documentam essa equivalência. O modelo público MCP chamado `nano_banana_2` é outro item do catálogo e não foi usado.

Ferramenta: MCP Higgsfield `generate_image`. Cada envio: resolução 2K, proporção 16:9, count 1, use_unlim false, referência A1 `cf89be34-0303-4814-8f71-566818019006`, role `image` normalizado para `image_references`. Cada estimativa individual retornou 2 créditos exatos antes do respectivo envio. Todas as quatro conclusões retornaram o mesmo backend `nano_banana_2`.

| Arquivo fonte | Job | Estimado | Débito observado | Saldo após envio |
|---|---|---:|---:|---:|
| assets/images/sequencia-01-chapa.png | `fe21bf7f-cc19-4420-9dac-5b3cdd5e0d3a` | 2 | 2 | 6 |
| assets/images/sequencia-02-borda.png | `366f3b9a-3c71-49f2-9e1f-ada3ade32c5c` | 2 | 2 | 4 |
| assets/images/sequencia-03-acabamento.png | `3a3cfae9-bdd8-4103-98f3-a6f59c2d931a` | 2 | 2 | 2 |
| assets/images/sequencia-04-aplicada.png | `3b4a771c-7eb7-44cd-af7a-e82768ef2b47` | 2 | 2 | 0 |

**Total desta entrega: 8 créditos; acumulado com A1: 10; saldo confirmado: 0.** Nenhuma recarga, plano, trial, variação extra ou geração gratuita ativados. As reduções do saldo foram 8 → 6 → 4 → 2 → 0, sem divergência. Fontes PNG preservadas; derivados AVIF/WebP em `public/img/{id}-{390,768,1200,1600}.{avif,webp}` pelo pipeline existente. Nenhum PNG é enviado ao navegador.

Todos: **provisório, gerado por IA, não representa obra ou material da JK**. A etapa mostrada também não comprova processo executado pela JK; O1/O4 continuam abertos. Termos e limites comerciais iguais aos registrados em [assets-licencas.md](assets-licencas.md), seção A1. Aprovação do cliente pendente em V7. Não usar na galeria de trabalhos.

Inspeção dos quatro originais: paleta e direção de luz coerentes com A1; veios irregulares, planos e bordas legíveis, sem pessoas, texto, marca ou reflexos plásticos evidentes. Chapa e recorte são estudos de matéria, não instruções de segurança/fabricação. A imagem aplicada é um ambiente fictício. A inspeção não garante continuidade física entre chapas distintas; eventual vídeo precisará de revisão específica.

## Prompts integrais

### 01 — sequencia-01-chapa

Create a photoreal editorial architectural photograph, first keyframe of a four-part study of stone. Use the reference only for its warm ivory stone, restrained grey veins and grazing morning light from upper left at 4500K. A single immense upright rectangular pale marble slab on a discreet safe steel support in a quiet anonymous stone studio; frontal slightly oblique view, slab centered with generous dark warm charcoal negative space around it. Whole slab visible, strong scale, physically credible edges and natural non-repeating veins. 50mm lens, tactile honed surface, gentle side light, deep but readable shadow, refined architectural photography. The central 40 percent must remain meaningful when cropped to vertical mobile. No people, hands, lettering, logos, watermarks, machinery in motion, distorted reflections, melted edges, impossible geometry or plastic stone. This is an illustrative fictional scene, not a real company's work.

### 02 — sequencia-02-borda

Photoreal architectural editorial close-up, second keyframe of a four-part stone study. Match the reference's warm ivory marble, subtle grey veins and grazing morning light from upper left at 4500K. An exceptionally clear precise stone edge: two real marble pieces forming a crisp 45-degree miter joint, viewed very close at a low angle on an anonymous workbench. A small separate offcut near the edge makes the stone thickness legible. Focus on the central edge and veining continuity, quiet dark warm grey background with generous negative space, no machinery needed. 90mm macro lens, physical grain and subtle saw traces on the exposed offcut, credible planar geometry, elegant measured photographic composition. Center the key detail to allow a vertical crop. No people, hands, text, logos, watermarks, tools in motion, warped reflections, melted edges, impossible joints, plastic material. Fictional illustrative scene, not a company's work.

### 03 — sequencia-03-acabamento

Photoreal editorial macro photograph, third keyframe of a four-part stone study. Use the reference for warm ivory stone, delicate irregular grey mineral veins and grazing morning light from upper left at 4500K. Fill most of the frame with a single broad honed marble surface viewed at a very low oblique angle; the foreground reveals subtle crystalline grain and tactile satin finish in sharp focus. A thin bright line of grazing light crosses the central mineral vein, background falls into warm charcoal shadow. No new objects. 90mm macro architectural lens, refined subdued contrast, extremely believable stone, no glitter or resin look, natural non-repeating veining. Central detail must work in a vertical mobile crop. No people, hands, lettering, logos, watermarks, distorted reflections, impossible geometry, fake pattern repetition. Illustrative fictional material, no real company claim.

### 04 — sequencia-04-aplicada

Photoreal architectural editorial photograph, fourth and final keyframe of a four-part stone study. Match the reference stone palette and morning light: warm ivory marble, restrained irregular grey veins, grazing light from upper left at 4500K. A finished sculptural rectangular kitchen island in a serene anonymous architectural interior, seen from a low three-quarter angle. The island corner and precise mitered edge are centered; show the top and waterfall side in physically credible proportion. Wider spatial view than the reference, limestone plaster walls, a deep shadow recess and dark walnut at the far side, quiet floor. 35mm architectural lens with straight verticals, tactile matte stone and realistic contact shadows. Generous uncluttered dark upper space, centered island remains legible in a vertical crop. No people, hands, text, logos, watermarks, taps, sinks, appliances, ornaments, plants, distorted reflections, impossible geometry or plastic stone. This is a fictional illustrative interior, not a real company's completed work.

## Cotação de vídeo, sem geração

MCP `estimate_video_cost`, 26/09/2026, créditos pagos, 16:9, imagem inicial de referência. Catálogos permitem start_image/end_image. Nenhum dos modelos cotados aceita 20 s em um único clipe nas configurações consultadas.

| Modelo/configuração | Segmentos | Retorno por chamada | Total calculado |
|---|---|---|---:|
| Kling 3.0, `kling3_0`, std, sound off | 10 s + 10 s | 15 + 15 créditos | 30 |
| Seedance 1.5 Pro, `seedance1_5`, 720p, generate_audio false | 12 s + 8 s | 14,39 + 9,60 créditos | 23,99 |

Limitação constatada: Kling retornou 15 tanto com count 1 quanto count 2. O total acima soma chamadas individuais; não trata count 2 como desconto. Kling foi reconferido com as imagens 01 e 02 como start/end. As estimativas não comprovam continuidade visual nem incluem novas tentativas, formatos alternativos ou montagem. O plano reportado é free, sem saldo pago restante e sem unlimited disponível; o estimador não retornou bloqueio específico de plano, mas também não atesta permissão de execução. Nenhuma tentativa de vídeo foi feita para testar acesso. Revalidar preço e acesso quando houver autorização e saldo.

