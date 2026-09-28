# Entrega 2 — capa e tratamento editorial

Capa estática, ampla, com recorte próprio de 900x1152 para celular, título regular e um CTA. Sem wrapper sticky, script de entrada tipográfica ou download de vídeo da capa. Imagens existentes tratadas em Sharp no build; fontes e parâmetros em assets-licencas.md. Aviso IA único no rodapé. Sem geração paga e sem tocar no configurador ou sua integração.

Correções da revisão: todos os H1/H2 usam homeDisplay (Bodoni Moda), peso 400 e fonte carregada. O teste type-contrast.cjs comprova isso e navegação totalmente acima da foto: fim do menu y54, início da foto y394, contraste 13,09:1. A primeira entrega já continha a correção de herança; suas capturas finais são fontes-*, não etapa1-*.

| Emulação, cinco execuções | Base | Entrega 2 |
|---|---:|---:|
| LCP simulate mediano | 2,408 s | 2,344 s |
| TBT mediano | 22,5 ms | 24 ms |
| CLS | 0 | 0 |
| A11y | 100 | 100 |
| Maior tarefa de entrada | 284 ms | 245 ms |
| JS inicial gzip | 141.606 B | 141.488 B |

Não atende ainda LCP <=2s nem todas as tarefas <=150ms. A capa mais curta trouxe layout da próxima seção para a entrada; contenção da capa e do bloco request-story reduziu o diagnóstico de 283 para245ms, mas não resolveu. O pico de180ms da entrega1 era EvaluateScript do runtime React/Next (174,1ms em 0bma92pht_c97.js), não GSAP. A entrega3 substituirá o controlador React/medições da jornada por inicialização posterior e condicionada à proximidade.

Seção9: scroll nativo, GSAP após LCP, sem alteração de geometria animada. Rolagem CPU4x: P95 script+pintura 5,779ms, máximo41,553ms (limite8ms ainda não atendido no agregado conservador do script). Toque EventTiming máximo32ms. Slow/Save-Data/reduced-motion: zero vídeo solicitado, zero waiting. Sem JS a capa e conteúdo continuam presentes. Interface, lint e build/check:pendencias em homolog passaram; dois warnings preexistentes dos scripts Higgsfield persistem. Nenhuma configuração de deploy alterada.

Capturas válidas: capa-final-{390,1440}-*.png; antes-* para baseline. capa-* sem final é diagnóstico anterior ao recorte móvel e contenção, preservado para rastreabilidade. Preview 3105 preservado. A auditoria é emulação, não teste de aparelho físico.
