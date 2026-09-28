# Segundo layout da entrada — investigação e correção

Base: ca123dbcfa84158fcd58c726f12f9979bc24e977. Worktree limpa, git fetch origin e git merge --ff-only origin/main executados. Nenhuma edição no configurador, linha de Configurador, fontes, conteúdo, mídia, configuração ou deploy. Geração paga: US$0.

## Causa demonstrada

O segundo layout vem do desbloqueio de content-visibility:auto na seção inteira #jornada-pedra, que está na margem de proximidade usada pelo Chrome. Não é provocado pela chegada das fontes ou pela hidratação.

No probe baseline (CPU4x/rede150ms/200KiB/s), o primeiro Layout começou400,2ms:99,1ms/50 objetos. Entre ele e o segundo, StyleRecalcInvalidationTracking registra reason=DisplayLock no node48, SECTION id=jornada-pedra; LayoutInvalidationTracking registra sua remoção/reinserção e Added to layout para track/sticky/heading/quatro figures/máscara/CTA. O segundo Layout começou524,1ms:116,3ms/126 objetos sujos,171 totais,partialLayout=false.

Categorias devtools.timeline.invalidationTracking e devtools.timeline.stack habilitadas. Não há stackTrace JavaScript nesses Layouts: a cadeia pai é RunTask → WebFrameWidgetImpl::UpdateLifecycle → LocalFrameView::RunStyleAndLayoutLifecyclePhases → UpdateStyleAndLayout → LocalFrameView::layout, com raiz #document. O initiator verificável é DisplayLock, não uma chamada JS de getBoundingClientRect. Eventos completos em baseline-trace.json.gz; recorte com nós/initiators em causa.json.

Contraprovas independentes, apenas no servidor diagnóstico3106 (já encerrado):

| Hipótese / controle | Evidência |
|---|---|
| Fontes | Segundo Layout começa524ms; Serif termina594ms/Sans1061ms. Preload das duas antecipa as fontes, mas mantém segundo Layout115,8ms. Fallback ajustado já existe via next/font. |
| Font-display optional | Segundo Layout118,4ms antes da hidratação; não elimina causa. Não adotado. Alterar CSS inline no HTML de teste gerou divergência posterior de hidratação: esse caso só serve para o trecho pré-hidratação, não para métricas finais. |
| Hidratação/root/ResizeObserver | Mutações data-motion/data-enhanced aparecem1612ms, depois do segundo Layout. Sem JS o segundo layout também existe; ResizeObserver da aplicação ainda não estava instalado no momento do problema. |
| ScrollTimeline do contato | Também há invalidação ScrollTimeline, mas desligar essas animações mantém segundo Layout107,6ms. Animações aprovadas mantidas. |
| Retirar auto só da seção | Elimina segunda passagem, porém concentra171 objetos/183,8ms no primeiro Layout. Rejeitado. |
| Isolar o track e mover auto para sticky | Primeiro Layout73,7ms/56 objetos, sem segundo layout pesado na entrada. Adotado e medido novamente no build real. |

Fontes não alteradas: manter a aparência aprovada foi possível atacando a causa comprovada. A função de content-visibility/containment foi conferida na [documentação Chrome](https://developer.chrome.com/blog/css-containment) e [guia MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Using).

## Implementação

A jornada deixa de aplicar content-visibility na seção externa. Seu track já tem altura explícita340svh/280svh; contain:strict isola o tamanho, layout, estilo e pintura. content-visibility:auto fica no palco sticky interno. Assim, o navegador não precisa abrir a seção inteira durante a entrada e seu desbloqueio não se propaga pela árvore externa. Não há temporizador, adiamento de hidratação, HTML reescrito ou remoção de conteúdo.

Nos modos sem JS/reduced-motion, contain:none e content-visibility:visible restauram os quatro quadros estáticos. Save-Data usa o mesmo caminho estático existente. As reservas aproximadas121px da seção externa foram removidas porque ela volta a obter a altura real do track+CTA.

## Cinco execuções antes/depois

Mesmos audit.cjs/conditions.cjs derivados do Pulso na rodada anterior. Chrome mobile393×873/DPR1, CPU4x,150ms,200KiB/s down/75KiB/s up; perfis frios sequenciais; preview gzip3105. Lighthouse13.5 simulate separado do trace CDP. É emulação, não aparelho físico. O probe de invalidation/stack tem mais instrumentação e não entra na mediana destas cinco.

| Mediana | Antes ca123db | Depois |
|---|---:|---:|
| Primeiro Layout |77,5ms|80,2ms|
| Segundo Layout completo pesado |109,0ms|ausente nas5 execuções|
| Maior tarefa nos primeiros3s |274ms|137ms|
| Bloqueio derivado das tarefas CDP(max(duração−50,0)) |300ms|157ms|
| LCP simulate |2346,5ms|2349,9ms|
| TBT simulate |36,5ms|34,4ms|
| CLS simulate |0|0|

Máximos de tarefa por execução final:144/134/150/130/137ms. Nenhuma acima150ms no protocolo de cinco;100ms continua ideal não atingido. O probe diagnóstico extra com invalidation/stack mediu151ms: a margem é pequena e não se deve interpretar150ms como garantia de aparelho real. LCP2s permanece pendente e praticamente inalterado; não é alegado como resolvido nesta rodada.

Reprodução (PowerShell na worktree):

```powershell
$env:NODE_PATH='C:/Users/Vitor/Desktop/sites-wordpress/jk-marmores-refs/auditorias-fluidez/2026-09-27-2021/node_modules'
$env:AUDIT_MODULES='C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules'
$env:AUDIT_RUNS='5'
node docs/auditorias/segundo-layout/batch.cjs depois
node docs/auditorias/segundo-layout/summarize.cjs
python docs/auditorias/segundo-layout/analyze.py
# Diagnóstico: usa o build atual, servidor temporário3106, fecha ao terminar.
$env:PROBE_MODES='final'
node docs/auditorias/segundo-layout/probe.cjs
```

## Regressões

Lint e build homolog (com check:pendencias) passaram. JS inicial141509B gzip. Testes de rolagem390/1440, reversão, quatro etapas, reduced-motion, Save-Data e sem JS passaram; testes de teclado/axe/contraste também. Nenhum arquivo do configurador mudou desde ca123db.

Capturas antes/depois390/1440 nesta pasta. Geometria das seções idêntica; PEDRA pixel a pixel idêntica nas duas larguras; capa com diferenças menores que0,003% dos canais. Nenhuma diferença de tipografia ou enquadramento. Preview3105 mantido.

Primeiro toque no menu logo após FCP, ainda antes da hidratação: cinco execuções com a mesma CPU/rede do Pulso; resposta pointerdown→toggle+pintura14,8–29,7ms, mediana21,0ms, todos os primeiros toques aceitos. Evidência primeiro-toque.json. Tempo sintético até próximo RAF, não INP de campo.

Primeiro gesto4G: cinco amostras adicionais em393×873/CPU4x/40ms/1000KiB/s (rede diferente do protocolo Pulso, declarada em video.cjs). Avanço inicial mediano104,0ms (79,1–113,3ms); conclusão1541,1ms;0/40 quadros descartados em cada uma. A verificação funcional anterior de4G registrou1/40 descartado; desktop0/40 e resposta6,5ms. 3G/Save-Data/reduced-motion continuam com zero vídeos. Sem promessa de zero perdas em aparelhos reais. Evidências depois-gestos-5-video.json e depois-video.json.
