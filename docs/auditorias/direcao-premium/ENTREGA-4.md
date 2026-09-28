# Entrega 4 final — limpeza e unidade editorial

Entrega final da direção premium, pronta para integração e revisão do Planejador. Não publicada. A integração do seletor estático pertence à Orbita: nenhum arquivo de src/components/configurador, nem a linha completa do Configurador na home ou nos materiais, foi alterado.

A home passa por capa, JK, jornada, configurador e um contato direto. Saíram a foto repetida e o bloco de atendimento duplicado; os passos continuam em Sobre. A navegação principal fica em A empresa, Materiais e Contato; os demais destinos continuam no rodapé. Intros das páginas internas usam o papel quente e texto escuro, sem etiquetas. Espaçamento usa o token compartilhado, preservando a integração da Orbita.

## Cor e imagens

As quatro etapas e o recorte móvel da etapa 02 receberam balanço quente em Sharp no build: saturação 0,86, ganho RGB 0,94/0,89/0,83 e offsets 11/10/9, com o mesmo grão fino determinista. O branco fica bege suave; não foram alterados veios, geometria ou composição. Os oito vídeos receberam os mesmos ganhos por FFmpeg, para não voltar à cor fria quando o buffer ficar pronto. Desktop somado 1.186.831 B; celular 940.838 B, 720p, GOP 6, sem áudio. Originais preservados. Nenhuma geração ou acesso à API: US$ 0.

Quinze derivados antigos da capa foram retirados da exportação e o build não os recria. O aviso de IA continua único no rodapé. Textos alternativos e data-pendente permanecem. Nenhuma pendência comercial foi tratada como informação confirmada.

## Capa e contraste

A capa é uma imagem estática desde a entrega 2, conforme a nova direção aprovada. Não existe vídeo da capa na página. O poster responsivo tem preload por media query, fetchpriority high e loading eager. O teste confirma zero solicitações de vídeo na entrada; os vídeos da jornada só são preparados após a capa e perto da seção. GSAP permanece fora do JS inicial.

Contato: A11y 96 informado pela Orbita antes desta entrega; 100 nesta auditoria. Intros usam texto #2b2622 e descrição #665e54 sobre #f4efe9; botões seguem tokens globais. Home, Sobre, Materiais, Contato, Aplicações e Galeria: A11y 100. Navegação sobre papel: contraste 13,09:1. H1 e H2 principais confirmados em Bodoni Moda 400 carregada; títulos utilitários do rodapé usam Source Sans 3.

Uma tentativa legítima de incorporar o AVIF móvel no HTML aumentou o documento e piorou o LCP simulate para 2,475 s; foi descartada. Não há reescrita de HTML, atraso de hidratação, remoção de fonte ou alteração da emulação para melhorar o resultado. experimental.inlineCss permanece true, sem mudança de configuração nesta entrega.

## Medições e critérios de aceite

Mesmo protocolo Pulso: 393 × 873, CPU 4x; entrada CDP com 150 ms / 200 KiB/s; Lighthouse simulate, cinco execuções. São emulações locais, não dados de aparelho ou produção.

| Métrica | Entrega 3 | Entrega 4 |
|---|---:|---:|
| LCP simulate mediano | 2,347 s | 2,343 s |
| TBT mediano | 39,27 ms | 40,18 ms |
| CLS | 0 | 0 |
| A11y home | 100 | 100 |
| Maior tarefa nos primeiros 3 s | 153 ms | 151 ms |
| JS inicial gzip | 138.766 B | 138.767 B |

Tarefas máximas por execução: 148 / 132 / 151 / 131 / 134 ms. LCP: 2,344 / 2,340 / 2,343 / 2,345 / 2,334 s. A diferença de um byte no gzip do JS acompanha hashes do build; oito scripts iniciais, sem nova dependência inicial. A base anterior à direção premium tinha 141.606 B.

Critérios da seção 9:

- Tarefa <=150 ms: **não integralmente atendido**, 4 de 5; máximo 151 ms.
- LCP <=2 s em 5 de 5: **não atendido**, 0 de 5. Nenhum vídeo da capa causa esse atraso porque não é carregado.
- Script + pintura <=8 ms em todos os intervalos do pin: **não atendido** pelo teste conservador; P95 5,235 ms, máximo 25,661 ms. O somatório pode incluir eventos aninhados e trabalho da automação; não equivale a FPS de dispositivo real. Desta vez o teste fixa effectiveType 4g para garantir scrub ativo.
- Toque <=200 ms: **atendido**. Event Timing 24 ms; primeira abertura de menu a frio, cinco execuções: máximo 47,8 ms.
- Zero waiting em rede lenta: **atendido**, zero downloads de vídeo e quatro imagens estáticas. Save-Data, reduced-motion e sem JS também verificados.

Teste adicional com entrada nativa via CDP, CPU 4x, três execuções por condição: gesto móvel 4G até 80,3 ms; móvel lento até 37,4 ms; roda no desktop até 41,1 ms. Mede envio da entrada até RAF após o primeiro scroll, incluindo comunicação da automação, não a latência física de uma tela.

Lint sem erros (dois warnings históricos de tools/higgsfield), build e check:pendencias em homolog passaram. Homologação mantém dados pendentes; não equivale a zerar as pendências comerciais para produção. Interface: sem overflow em 390/1440, menu/Escape/inert, número do WhatsApp, dock e progressão/reversão da jornada conferidos. Nenhuma alteração de deploy, main ou workflow.

## Evidências

Antes: arquivos jornada-validada-{390,1440}-{capa,contato,rodape,jornada-0..6}.png, preservados no commit e6afdb6. Depois: entrega-final-* nesta pasta.

| Seção | Antes 390 | Depois 390 | Antes 1440 | Depois 1440 |
|---|---|---|---|---|
| Capa | [antes](jornada-validada-390-capa.png) | [depois](entrega-final-390-capa.png) | [antes](jornada-validada-1440-capa.png) | [depois](entrega-final-1440-capa.png) |
| Jornada, borda | [antes](jornada-validada-390-jornada-2.png) | [depois](entrega-final-390-jornada-2.png) | [antes](jornada-validada-1440-jornada-2.png) | [depois](entrega-final-1440-jornada-2.png) |
| Contato home | [antes](jornada-validada-390-contato.png) | [depois](entrega-final-390-contato.png) | [antes](jornada-validada-1440-contato.png) | [depois](entrega-final-1440-contato.png) |
| Rodapé | [antes](jornada-validada-390-rodape.png) | [depois](entrega-final-390-rodape.png) | [antes](jornada-validada-1440-rodape.png) | [depois](entrega-final-1440-rodape.png) |

[Home inteira 390](entrega-final-390-home-inteira-estatica.png), [home inteira 1440](entrega-final-1440-home-inteira-estatica.png). As capturas integrais são explicitamente reduced-motion, mostrando as quatro etapas empilhadas; as capturas jornada-0..6 documentam o modo animado, inclusive retorno. Páginas internas: entrega-final-{390,1440}-{sobre,materiais,contato,aplicacoes,galeria}-inteira-estatica.png. Não há captura anterior completa dessas páginas nesta rodada; o antes da home está registrado por seção.

Números: entrega-final-resumo.json, entrega-final/1..5, entrega-final-pages.json, entrega-final-gesture.json, primeiro-toque.json, entrega-final-pin.json e entrega-final-motion.json. Scripts versionados nesta pasta. Preview mantido em http://127.0.0.1:3105/. Navegadores de auditoria encerrados; portais existentes preservados.
