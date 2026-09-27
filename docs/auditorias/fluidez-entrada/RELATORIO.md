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
