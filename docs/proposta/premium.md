# Refinamentos editoriais — etapa (d)

Base 5907180. Apenas home e estilos delimitados por `.editorial-motion`; configurador, SceneSlot, stone-scene, máscara PEDRA e os quatro quadros não foram alterados.

- Empresa: título maior, filete e mais respiro, preservando apresentação institucional.
- Materiais: detalhe rosado/caramelo já gerado substitui a imagem repetida do quadro 03. `assets/images/material-detalhe-quente.png` é cópia da imagem-chave da prova anterior; custo adicional zero. Legenda e alt deixam claro o caráter ilustrativo.
- Orçamento: fundo grafite, passos e acentos caramelo; textos e funções preservados. O contraste acompanha a identidade da logo.
- Trabalhos: escala maior e filete, mantendo o estado honesto sem obras reais.
- Capa: saída do título e CTAs por corte horizontal suave. Texto não fica translúcido durante o desaparecimento, mantendo contraste do painel nos quadros visíveis; foco no grupo mantém o conteúdo legível.

Entradas de títulos, revelação em corte da imagem, filetes e transição de tom usam CSS `view()` com `@supports`, versão estática e `prefers-reduced-motion`. Sem biblioteca ou JS adicional para estes efeitos. Durações declaradas de 400–600 ms; em timelines de rolagem o progresso é determinado pelo trecho de entrada, não por um relógio fixo. Referências técnicas: [animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) e [animation-range](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-range).

Experimento descartado: pôster mobile AVIF incorporado ao HTML aumentou o payload e não trouxe ganho na execução medida (LCP simulate 2,675 s, TBT 400 ms). Preservado em `docs/auditorias/2026-09-27-premium-inline-experimento-*`. A implementação final continua com preload responsivo e fetchpriority high, sem HTML reescrito ou atraso da hidratação. Sem mudança em next.config; `experimental.inlineCss` continua como documentado na capa.

Comparativos em 390/1440: `capturas/premium-{antes,depois}-{empresa,materiais,orcamento,trabalhos}-{390,1440}.png`. Home integral: `premium-home-*-inteira.png`; capa em vários pontos: `premium-{390,1440}-{00,1,2,3,4}.png`. Medições em `docs/auditorias/2026-09-27-premium*.json`; emulação, não dados de campo.

Lint/build/check:pendencias homolog passaram. Check-home e check-cover passaram após a retirada do experimento. JS inicial: 141.516 bytes gzip. Custo API permanece US$ 0,678 estimados, sem gasto nesta etapa.

| Emulação | LCP antes (capa) → depois | TBT antes → depois | CLS antes → depois | A11y |
|---|---:|---:|---:|---:|
| Lighthouse simulate (referência) | 2,416 → 1,947 s | 16,5 → 136,5 ms | 0,0048 → 0,0119 | 100 → 100 |
| Lighthouse devtools | 1,674 → 1,558 s | 205,7 → 76,2 ms | 0,0071 → 0,0071 | 100 → 100 |

A execução final de simulate passa em 2,0 s com pouca margem. As amostras variaram e não demonstram uma melhoria causal garantida pelo refinamento visual. TBT é laboratório, não comprovação de INP. O limite deve ser revisto no ambiente publicado pelo Planejador. Contraste do painel da capa sobre branco continua conforme cálculo conservador de `capa-video-contraste-range.json`, agora sem redução de opacidade durante a saída. O fundo mais claro da transição de orçamento é #3a2e24; textos claros e acento caramelo mantêm AA nesse extremo.
