# Entrega 3 — JK e jornada contínua

Monograma traçado manualmente do JPEG da cliente, com curvas do J e diagonais do K, textura da própria marca e fundo preto removido nas bordas. PROVISÓRIO: public/brand/jk-monograma-provisorio.svg, fonte geométrica src/content/monogram.ts. V1 permanece parcial. Nada gerado por API.

Jornada HTML no servidor; GSAP/ScrollTrigger por import dinâmico após apresentação da capa e proximidade da seção. Scrub0,6 liga opacidade, leve deslocamento e vídeos ao progresso nativo, em ambos os sentidos. Não há zoom disparado por cronômetro, snap que mova a página ou interceptação de roda/toque. Timeline única, sticky CSS, ignoreMobileResize e gsap.matchMedia. Removidos StoneJourneyMotion React, timed-video e gestureMedia temporizado; buffers completos continuam obrigatórios. Imagem acompanha o scroll quando o vídeo não está pronto; loadeddata não promove mídia durante o gesto.

Rede lenta, Save-Data e reduced-motion: JK estático e quatro imagens empilhadas; zero downloads de vídeo e zero waiting. Sem JS: imagens e SVG autocontido disponíveis. A textura do monograma carrega após o pôster, perto do viewport; não disputa o carregamento crítico. Tratamento de cor dos oito vídeos em FFmpeg, sem geração: desktop total1.170.426B, mobile928.746B, H.264/GOP6/faststart, sem áudio. Fonte preservada, script editorial-videos.mjs.

| Emulação, cinco execuções | Base | Entrega 3 |
|---|---:|---:|
| LCP simulate mediano | 2,408 s | 2,347 s |
| TBT mediano | 22,5 ms | 39,27 ms |
| CLS | 0 | 0 |
| A11y | 100 | 100 |
| Tarefa máxima entrada | 284 ms | 153 ms |
| JS inicial gzip | 141.606 B | 138.766 B |

Tarefas:141/138/153/129/139ms. LCP<=2s não atendido; tarefa<=150ms em4/5. Toque EventTiming32ms. Script+pintura no teste conservador de rolagem: P954,587ms, máximo46,747ms; ainda não cumpre8ms em todos os intervalos. Leituras de layout do controlador saíram dos callbacks de quadro; vídeo usa uma RAF e seek quantizado. will-change só durante o trecho ativo; cleanup em reduced-motion/troca de conexão. Font fallback Arial ajustado às métricas finais reduziu o custo inicial observado frente a Times New Roman.

Lint sem erros, build e check:pendencias homolog passaram; dois warnings históricos de tools/higgsfield. Menu/Escape/inert, WhatsApp, fonte e overflow conferidos. Dock some quando o CTA de contato está visível, independentemente da altura da seção. Configurador e linha de integração intactos.

Capturas finais jornada-validada-{390,1440}-jornada-0..6.png mostram JK, etapas e retorno; demais jornada-validada-* mostram home, contato e rodapé. Resultados jornada-validada/. Diretórios jornada-prova*, jornada-final e fallback-arial são diagnósticos anteriores. O teste motion.cjs foi corrigido para aceitar resposta RAF de0ms (não confundir zero com valor ausente); não mede latência física do dedo. Tudo é emulação.
