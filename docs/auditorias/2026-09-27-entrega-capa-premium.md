# Entrega: capa, refinamentos e sequência por quatro vídeos

Branch redesign-astra. Capa 5907180 e refinamentos af34ba4 entregues separadamente; esta etapa acrescenta quatro vídeos independentes. Sem publicação por Astra, alteração de deploy, main ou configurador. SceneSlot, stone-scene e suas linhas de integração não foram alterados.

## Medições

Emulação Chrome headless, Lighthouse 13.5.0 mobile 390×844 DPR2, cache frio, servidor local gzip. Não são dados de campo ou INP real. Colunas: início desta rodada / antes da sequência (af34ba4) / final.

| Método | LCP: inicial / antes (e) / final | TBT: inicial / antes (e) / final | CLS: inicial / antes (e) / final |
|---|---:|---:|---:|
| simulate — referência | 2.441 / 1.947 / 2.414 s | 22.0 / 136.5 / 14.5 ms | 0.0000 / 0.0119 / 0.0048 |
| devtools — complementar | 1.457 / 1.558 / 1.588 s | 78.5 / 76.2 / 75.6 ms | 0.0000 / 0.0071 / 0.0071 |

**Conflito de performance mantido explícito:** LCP simulate final 2.414 s ultrapassa 2,0 s. A amostra anterior foi 1,947 s e houve variação entre execuções. Nenhuma tentativa de selecionar apenas o melhor número: esta é a última medição da implementação final. Sem defer-hydration, reescrita de HTML ou atraso da hidratação. Pôster responsivo com prioridade alta/preload, fontes locais swap/size-adjust, preload só do display e CSS inline mantidos.

Home final: Performance 98, A11y 100, boas práticas 100, CLS 0,0048, JS inicial **141.742 bytes gzip**. SEO 69 reflete noindex de homologação. TBT final 14.5 ms, sem equivalência com INP. Páginas também auditadas: material pendente LCP 2,126 s/TBT 22,5 ms; contato LCP 2,333 s/TBT 26 ms; ambas CLS0/A11y 100 e ainda acima de 2 s.

Peso até load: 205671 → 216618 bytes (headers incluídos). Separação por HTML, JS, fontes, imagens e vídeos adiados em final-peso-contraste.json. **Zero vídeo inicial.** Capa até 1,635 MB desktop / 1,252 MB mobile; quatro vídeos da sequência juntos: **1.875.503 bytes desktop / 1.085.168 bytes mobile**. Todos sem áudio, faststart e GOP 8 (máximo 0,333334 s), dentro dos tetos 6/2,5 MB para capa e 8/3 MB para sequência.

Configuração: experimental.inlineCss já estava habilitado e foi mantido; elimina a requisição bloqueante de CSS, mas duplica estilos no HTML/RSC e reduz cache compartilhado. Nenhuma configuração de deploy mudou. O servidor local implementa MIME e Range para seek. Experimento de pôster incorporado foi rejeitado e documentado; não faz parte do código final.

## Validação e evidências

Lint, build e check:pendencias homolog passaram. Check-home/check-cover: HTML e WhatsApp sem JS, menu/teclado, avanço/retorno/pausa, reduced-motion/Save-Data e nenhum erro. Audit-journey: máscara, transição, quatro etapas, retorno à primeira etapa, legendas fora do vídeo e três fallbacks. As legendas continuam em HTML, com 01/04 e barra de progresso. As imagens estáticas aprovadas não foram substituídas nos fallbacks.

Máscara PEDRA: DOM, CSS, textura, textos e fórmulas de movimento preservados. Comparação antes/depois: mobile idêntico; desktop delta médio 0,000022 por canal, diferença subpixel de renderização. Evidência em mascara-preservada.json. Não há vídeo dentro das letras.

Contraste conservador do painel da capa sobre branco: mínimo 7.20:1; CTA 7.92:1. Saída por corte preserva opacidade. No fundo mais claro da transição de orçamento: mínimo 5.83:1.

Capturas em docs/proposta/capturas/: final-*-{390,1440}-inteira.png (16 rotas/viewports, modo estático acessível); sequencia-final-{390,1440}-{mascara,transicao,01,02,03,04}.png (rolagem); sequencia-final-{390,1440}-{00,1,2,3,4}.png (capa); premium-{antes,depois}-{empresa,materiais,orcamento,trabalhos}-*.png (comparativos por seção). Quadros de cada vídeo em jornada-rigida-{1,2,3,4}-quadros.jpg.

| Critério da tarefa 05 | Evidência |
|---|---|
| Composição e iluminação | Capa ampla com luz quente e aproximação à quina |
| Aparência e escala | Pedra rígida nos quatro trechos; ilustrações identificadas |
| Tipografia e hierarquia | Instrument Serif/Sans, títulos maiores, números tabulares |
| Conteúdo e orçamento | Apresentação, materiais, passos, endereço e WhatsApp preservados |
| Celular | CTA inicial, dock separado, recorte02, capturas 390 px |
| Movimento principal | Capa reversível, PEDRA intacta, vídeo local em cada etapa |

## API

Quatro vídeos independentes de 4 s, somente imagem inicial, Kling 3.0 Standard, US$ 0,185 estimados cada. Primeiro aprovado antes dos demais; todos inspecionados antes de seguir. A tentativa anterior de transformação entre objetos foi rejeitada e arquivada, não aplicada. **Acumulado estimado US$ 1,649; restante do teto Astra US$ 1,051.** Inclui as provas rejeitadas concluídas. Saldo da conta/débito real não retornados pela API, Vitor confere no portal. Zero crédito MCP nesta rodada. Prompts, IDs, termos e custos em docs/proposta/assets-licencas.md e sequencia-clipes-api.json.

Preview mantido em http://127.0.0.1:3105/. Portais existentes reutilizados. Auditorias fecham seus Chrome headless em finally. Nenhuma geração futura agendada.
