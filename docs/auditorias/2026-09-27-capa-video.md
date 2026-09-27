# Auditoria da capa em vídeo

Emulação Chrome headless, Lighthouse 13.5.0 mobile 390 × 844 DPR 2, cache frio, servidor local gzip. Não são métricas de usuários reais. Simulate é a referência, devtools é medição complementar.

| Método | LCP antes → depois | TBT antes → depois | CLS antes → depois | A11y |
|---|---:|---:|---:|---:|
| simulate | 2.441 → 2.416 s | 22.0 → 16.5 ms | 0.0000 → 0.0048 | 100 → 100 |
| devtools | 1.457 → 1.674 s | 78.5 → 205.7 ms | 0.0000 → 0.0071 | 100 → 100 |

**Conflito explícito:** simulate continua acima de 2,0 s. O pôster tem fetchpriority high, preload responsivo, descoberta no HTML e não usa lazy-load; Lighthouse confirma o IMG da capa como LCP. CSS inline e fontes locais com swap/size-adjust foram mantidos. Não há atraso artificial de scripts, hidratação ou reescrita de HTML. JS inicial medido: 141.494 bytes gzip, abaixo de 150 KB. CLS abaixo de 0,05 e A11y 100. SEO 69 é limitado intencionalmente pelo noindex da homologação.

Contraste conservador sobre fonte branca (mais clara que qualquer quadro), com painel grafite 88% em seu estado legível: display 10.76:1; corpo 9.25:1; eyebrow 7.20:1; CTA 7.93:1. A saída animada reduz progressivamente a opacidade; no fim o grupo fica inert, retirado da navegação por teclado. Não se declara contraste constante durante o desaparecimento. Foco dentro do grupo mantém texto/painel visíveis.

Check-cover e check-home passaram: zero mídia na carga inicial, seek nos dois sentidos, pausa sem bloquear scroll, poster com reduced-motion/Save-Data, menu e links acessíveis sem JS, CTAs para WhatsApp confirmado. Preview validado com ranges inicial/sufixo (206) e inválido (416), MIME video/mp4.

Custo estimado acumulado US$ 0,678; débito real a conferir por Vitor. PEDRA e sequência permanecem sem alterações de código ou imagem. Capturas em docs/proposta/capturas/capa-video-*.png; quadros gerados em capa-dolly-01-quadros.jpg.
