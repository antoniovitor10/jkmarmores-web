# Fluidez na entrada — 27/09/2026

Base limpa: a720b3fb11ac9030577df183518dec63960ff6cb. `git fetch origin` e `git merge --ff-only origin/main`: já atualizada. Sem edição do configurador, da sua linha na home, de deploy ou geração paga.

## Método reproduzível

Auditoria Pulso lida em jk-marmores-refs/auditorias-fluidez/2026-09-27-2021. Nesta pasta, audit.cjs.original e conditions.cjs.original preservam as fontes. Cópias executáveis alteram apenas URL/output/seleção de viewport, anotam navigator.connection, bloqueiam navegação externa WhatsApp e fecham Chrome em finally. O runner repete cinco perfis frios sequenciais e Lighthouse 13.5 simulate, mobile393x873/DPR1. CPU4x e rede150ms/200KiB/s/75KiB/s mantidas no CDP. Traces comprimidos com gzip, sem remover eventos.

Comandos PowerShell, a partir da worktree:

```powershell
$env:NODE_PATH='C:/Users/Vitor/Desktop/sites-wordpress/jk-marmores-refs/auditorias-fluidez/2026-09-27-2021/node_modules'
$env:AUDIT_MODULES='C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules'
node docs/auditorias/fluidez-entrada/batch.cjs antes
node docs/auditorias/fluidez-entrada/summarize.cjs
```

Resultados são emulação, não aparelho real. Lighthouse simulate e tarefas do trace CDP são métodos distintos; não converter um TBT no outro. `audit.cjs` tem gesto mobile por mouse que não rolou nesta execução (scrollY0); seu tempo não valida a reprodução. O check-short-motion usa touch CDP separado. `conditions.cjs` envia cabeçalho Save-Data, mas navigator.connection.saveData continua false: teste nativo é separado.

## Etapa layout

content-visibility:auto e reserva intrínseca em jornada, seção externa do configurador, contato e rodapé; contain:layout paint nos dois palcos sticky. A largura externa da seção do configurador foi expandida com padding equivalente para a contenção não cortar o palco que sangra as margens. Exceção quando data-fullscreen=true preserva o fallback fixed. Nenhum arquivo da Orbita ou linha do Configurador mudou.

ResizeObserver conserva dimensões do palco e das imagens da jornada. Eliminadas leituras de cada picture depois de escrever estilos a cada quadro. Máscara, fórmulas de rolagem, tipografia, conteúdo e imagens mantidos. As três view-timelines preexistentes não animam geometria; não há animação de width/height/top/left.

Cinco amostras antes: mediana simulate LCP2418,7ms/TBT19ms/CLS0. A amostra exploratória layout teve LCP2345ms/TBT33ms/CLS0, tarefa máxima279ms: ainda fora da meta100ms. O primeiro Layout caiu de273 objetos/294,8ms para50 objetos/82,7ms; a jornada próxima ao viewport ainda entra no cálculo seguinte. Estes dados exploratórios não substituem a mediana final.

Lint e build homolog (incluindo check:pendencias) executados. Evidências de gestos: ../2026-09-27-fluidez-layout-gestos.json. Capturas antes/layout de390/1440 nesta pasta. Protocolo CSS conferido em [MDN content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility) e [contain-intrinsic-size](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/contain-intrinsic-size).

## Etapa hidratação

Header, rodapé, menu nativo details, contato e textos já eram Server Components. JourneyImage agora também é: removidos quatro useState/useEffect e quatro observadores. Um observador da ilha da jornada ativa os src/srcset, inclusive em reduced-motion/Save-Data; fallback noscript preservado. Suspense nativo delimita capa, jornada e rodapé sem alterar HTML visual nem reescrever saída do Next. Loader do configurador intocado.

Lint/build homolog/check:pendencias e check-short-motion aprovados (390/1440, avanço/reversão, quatro etapas, reduced-motion, Save-Data e sem JS). Amostra intermediária simulate: LCP2346,5ms/TBT35,1ms/CLS0; tarefa máxima275ms. As metas ainda dependem da comparação final; não atribuir uma melhora não observada à hidratação.

## Etapa vídeo e resultado final

Capa pre-carregada com preload=auto apenas depois de load, decode do pôster e duas pinturas; primeiro gesto inicia o clipe já preparado. Poster permanece atrás e também no elemento video, exibido somente com dados decodificados. IntersectionObserver substitui getBoundingClientRect na capa. Nada na hidratação HTML foi adiado artificialmente.

A ausência de vídeo do Pulso não pode ser atribuída somente a 3G: na reprodução local do protocolo, effectiveType=4g/saveData=false e o script audit.cjs não rolou (scrollY0); a implementação anterior criava vídeo apenas depois de scroll. Em teste de toque CDP válido, a versão anterior reproduziu vídeo em4G. A política de3G foi testada separadamente e manteve o pôster, assim como Save-Data nativo simulado e reduced-motion.

| Mediana de cinco, mesma máquina/preview/protocolo | Antes | Depois | Meta |
|---|---:|---:|---:|
| LCP Lighthouse simulate | 2418,7ms | 2339,2ms | até2000ms: não atingida |
| TBT Lighthouse simulate | 19,0ms | 34,1ms | até50ms: atingida, mas aumentou |
| CLS Lighthouse simulate | 0 | 0 | até0,05: atingida |
| Maior tarefa nos primeiros3s, CDP4x | 309ms | 264ms | nenhuma acima100ms: não atingida |
| Soma max(tarefa−50ms,0), primeiros3s/CDP | 399ms | 283ms | diagnóstico, não TBT Lighthouse |

Variações: LCP antes2367,9–2424,4ms/depois2334,6–2354,3ms; TBT antes16–50,0ms/depois27,6–46,7ms. Maior tarefa CDP antes269–377ms/depois225–269ms. Todos os cinco casos finais ainda ultrapassam100ms. Traces-resumo.json separa UpdateLayoutTree/Layout/EvaluateScript; o layout inicial caiu, mas ainda há duas passagens na entrada e ~109–119ms de EvaluateScript. Não há evidência para afirmar que a entrada está completamente livre de travamentos. Reduzir ilhas não eliminou o custo do runtime React.

### Primeiro gesto e vídeo (emulação adicional)

video.cjs usa toque CDP válido, CPU4x, rede4G40ms/1000KiB/s e viewport393x873, mais desktop sem limitação. É uma amostra por modo, não a mediana5 do protocolo acima. Antes/depois:
- 4G: primeiro avanço178,1→112,9ms após scroll; último quadro1615,9→1540,4ms;40 quadros/0 descartados.
- Desktop: primeiro avanço32,7→8,4ms; último quadro1482,6→1466,4ms;40 quadros/0 descartados.
- 3G, Save-Data com navigator.connection.saveData=true e reduced-motion: zero vídeos.
- Depois: vídeo em readyState4 antes do gesto. Pedido4G começou680ms, depois do LCP-pôster412ms e load555,2ms; desktop123,7ms, depois do LCP88ms/load96,4ms. São medidas CDP reais da emulação, distintas do simulate.

Observação de recursos: Resource Timing pode reportar0B para resposta206 de vídeo; não tratar esse número como vídeo gratuito em bytes. Os arquivos são os mesmos, sem geração/conversão. Preload é uma dica; Chrome pode reduzi-lo para metadata sob emulação, mas o primeiro quadro estava pronto nos testes.

### Regressões e escopo

Lint/build homolog/check:pendencias passaram. check-short-motion confirmou avanço/reversão, quatro quadros, modos estáticos e sem JS. check-light-conversion confirmou contraste/teclado/axe e ausência dos controles removidos. regressoes.cjs confirmou skip link e palco da Orbita com largura inteira, além do fallback fullscreen fixed em390/1440; nenhum arquivo do configurador mudou. Capturas antes/depois nesta pasta, geometria de todas as seções com alturas idênticas; exceção intencional é a caixa externa do configurador, agora largura viewport com conteúdo no mesmo alinhamento. JS inicial141293B gzip (138,0KiB), abaixo150KB. Nenhuma mudança de configuração, deploy, conteúdo ou asset pago; experimental.inlineCss preexistente mantido.

Limitação comunicada: as metas LCP2s e tarefas100ms permanecem abertas. O resultado foi entregue com números e traces, sem mascarar métricas ou reintroduzir defer-hydration. Preview3105 mantido para revisão.
