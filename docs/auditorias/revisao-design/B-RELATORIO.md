# Entrega B: Barlow, preto e movimento

Base c243f65. Barlow Semi Condensed 600 e Barlow Regular 400, subset latino WOFF2 self-hosted; licença OFL em public/fonts e registro em assets-licencas.md. Preload apenas do display e fallback Arial com size-adjust/ascent/descent emitidos pelo next/font/local. Preto #0B0A09 nas áreas de marca; creme nas áreas de leitura. Instrument não é mais solicitado.

GSAP 3.15.0 e ScrollTrigger em chunk dinâmico, depois de load, decode do pôster, fonts.ready e duas pinturas. Tokens comuns, matchMedia com reversão, sem smooth global, sem fades de parágrafos. Revelações de imagem e duas passagens de fundo montadas por proximidade, sem medir seções distantes na entrada. A luminância controla a troca entre texto preto e branco no fundo interpolado. Não há normalizeScroll, ScrollSmoother ou dependência de GSAP para ler a página. Configurador e sua linha intactos.

## Aceite da seção 9

Cinco execuções isoladas, Chrome CPU 4x e Lighthouse simulate. Lint, build e check:pendencias em homologação passaram. Capturas b-antes/b-final, interface e trace nesta pasta. b-depois é a tentativa intermediária anterior à montagem por proximidade.

| Medida | A | B final |
|---|---:|---:|
| LCP simulate mediano | 2,408 s | 2,566 s; 0/5 até 2 s |
| TBT mediano | 40 ms | 51 ms |
| CLS | 0 | 0 |
| A11y | 100 | 100, 5/5 |
| Maior tarefa, primeiros 3 s, cada execução | 126/146/169/134/138 ms | 136/198/185/156/152 ms |
| JS inicial gzip | 141.866 | 141.867 bytes; base 142.298 |
| Toque, Event Timing | 32 ms | 32 ms |
| Gesto lento / waiting | 113 ms / zero | 162 ms / zero |
| Script + pintura por quadro, máximo / p95 | 19,59 / 5,27 ms | 26,54 / 6,65 ms |

Os critérios LCP, tarefa máxima e todos os quadros até 8 ms não passaram. O mecanismo antigo de PEDRA e dos vídeos por tempo continua até os commits C/D/E; não se declara aceite integral nem ausência de regressão de performance. Novo lote será necessário depois da substituição desses controladores. O teste de gesto lento foi executado antes do ajuste final de montagem editorial, que não muda a política de vídeo. O conditions.cjs legado não injeta navigator.connection.saveData; ver limitação no relatório A.

Fontes técnicas: https://gsap.com/docs/v3/Installation/ e https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/ . Sem geração paga, publicação, mudança de deploy ou configuração Next.
