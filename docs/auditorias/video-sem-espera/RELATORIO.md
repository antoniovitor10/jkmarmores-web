# Capa e jornada sem espera pelo vídeo

27/09/2026. Worktree `jk-marmores-redesign`, branch `redesign-astra`, base `72e89c342dc21279e96b5ad8f9898b40caf7ffdd`. Árvore limpa na entrada; `git fetch origin` e `git merge --ff-only origin/main` retornaram “Already up to date”. Sem publicação ou geração paga.

## Causa e correção

Antes, `readyState >= 2` liberava a reprodução e `loadeddata` podia iniciar o movimento depois do gesto. Havia dados para um quadro, mas não para terminar o trecho. A reprodução passava a depender da rede durante a transição.

Agora cada mudança de estado escolhe vídeo ou pôster uma única vez. O vídeo precisa de `readyState >= 3`, duração válida e uma faixa contínua de buffer desde o início até o fim utilizado pelo controlador (duração menos 50 ms). Caso contrário, a imagem faz uma aproximação de 8% por `transform`, em 1.450 ms. A chegada posterior dos dados não muda essa escolha; um novo gesto pode usar o vídeo já pronto. O controlador de vídeo não escuta mais `loadeddata` para iniciar reprodução.

A política de rede bloqueia vídeo com Save-Data, effectiveType 2g/3g e downlink inferior a 1,6 Mbps. Também consulta somente timings de requisições críticas já concluídas: primeiros bytes depois de 600 ms, ou corpo com pelo menos 8 KiB que demorou mais de 400 ms e apresentou vazão inferior a 150 KiB/s. Essa segunda via atende navegadores sem `navigator.connection` e classificações “4g” otimistas. Sem API nem amostra de rede não armazenada em cache, conserva o pôster. São heurísticas, não uma medição permanente da conexão; o bloqueio por buffer protege também mudanças de rede após a amostra.

Nenhum download de teste foi acrescentado. O pôster continua prioritário. Somente depois de `load`, decode do pôster na capa e duas pinturas, uma rede elegível permite carregar o clipe inteiro em Blob. Isso evita o comportamento observado no Chrome celular: mesmo com `preload=auto`, ele pode carregar apenas metadata e ficar pausado com cerca de 0,62 s dos 1,46 s disponíveis. Buscas são canceladas e URLs Blob liberadas na desmontagem/troca de fonte. Na jornada aquece a etapa atual e a próxima, só com a seção visível; não baixa os quatro vídeos na entrada.

Reduced-motion e Save-Data continuam estáticos. CSS, HTML editorial, máscara PEDRA, enquadramentos, fontes, configurador e configuração do Next não foram alterados. Não há interceptação da rolagem nem adiamento de hidratação.

## Protocolo e evidências

`pulso-video.cjs` é a cópia do script da auditoria externa `2026-09-27-2137`, mudando apenas URL para o preview local, destinos dos arquivos e cabeçalho de lint. Compara antes/depois com o mesmo gesto e espera: Chromium, 393×873, CPU 4×; perfil lento 150 ms/200 KiB/s/75 KiB/s. O teste normal desse script não limita a rede. Há capturas dos três perfis.

`gestures.cjs` acrescenta os casos 4G de 1.000 KiB/s/40 ms, desktop, rede lenta, navegador sem API, atraso de 850 ms antes da resposta do pôster, 2g, 3g, Save-Data, reduced-motion, mídia retida e buffer parcial. Os dois últimos cenários liberam os dados depois do gesto e verificam que não ocorre troca tardia de modo, depois voltam/avançam e exigem vídeo pronto na capa e nas quatro etapas. O buffer parcial é injetado só no harness, mesmo com `readyState=4`, para testar separadamente a segunda condição. A retenção de mídia mantém `readyState=0`.

`batch.cjs` repete cinco vezes o protocolo de entrada do Pulso e Lighthouse 13.5 simulate, em perfis frios e sequenciais. `summarize.cjs` consolida mediana e valores individuais. Os traces completos estão compactados por execução. Não são medições em telefone físico nem INP de campo. O gesto por mouse do audit.cjs original não rola no perfil mobile; os tempos de gesto válidos vêm do toque CDP em gestures.cjs.

## Resultados

| Caso | Antes | Depois |
|---|---:|---:|
| Espera de buffer no perfil lento, mesmo script local | 3 eventos; 376,2 / 114,1 / 208,5 ms até retomar ou pausar | 0 eventos, 0 ms |
| Requisições de vídeo no gesto lento do Pulso | 2 (capa + etapa 01) | 0 |
| Resposta visual do pôster, toque CDP lento | Sem alternativa animada garantida | 86,7 ms; conclusão em 1.523,8 ms |
| Sem API de rede, mesmo perfil lento | Sem detector por timings | 69,1 ms; conclusão em 1.507,9 ms; 0 vídeos |
| Sem API, primeiros bytes atrasados 850 ms | Sem detector por timings | 86,6 ms; conclusão em 1.524,7 ms; 0 vídeos |
| 4G 1.000 KiB/s / desktop, primeiro avanço | Vídeo | Vídeo; resposta 120 / 8,3 ms, sem waiting |

A espera de 612 ms citada pelo solicitante é a medição independente do Pulso no site publicado. A reprodução local anterior deu máximo de 376,2 ms; não são valores da mesma execução. Em ambos os testes locais posteriores (script original adaptado e matriz adicional), a rede lenta teve zero requisições de vídeo. As quatro etapas também concluíram por pôster em todos os perfis lentos.

Dados retidos e buffer parcial: capa e quatro etapas terminaram em pôster, mesmo quando os vídeos ficaram prontos depois. Ao voltar à máscara/início e avançar novamente, todos usaram vídeo. Em rede normal, o aquecimento da etapa seguinte permitiu que as quatro usassem vídeo já na primeira passagem. Os 12 cenários passaram, sem erros de página. Foram testados explicitamente 2g/3g, Save-Data e reduced-motion, além da remoção da API.

### Entrada: cinco execuções frias antes/depois

| Métrica | Antes | Depois |
|---|---:|---:|
| LCP Lighthouse simulate, mediana | 2.344,6 ms | 2.341,0 ms |
| TBT Lighthouse simulate, mediana | 36,0 ms | 30,2 ms |
| CLS, mediana | 0 | 0 |
| Maior tarefa nos primeiros 3 s, mediana | 149 ms | 144 ms |
| Maior tarefa por execução | 158 / 149 / 144 / 137 / 158 ms | 136 / 152 / 144 / 143 / 145 ms |
| JS inicial gzip | 141.509 B | 142.298 B |

O limite de 150 ms passou em 4/5 execuções posteriores; uma teve 152 ms no PerformanceObserver (153,3 ms no RunTask detalhado). O trace da execução 2 atribui essa tarefa ao primeiro BeginMainFrame: estilo/layout 144,6 ms, Layout 86,45 ms. O desvio acontece antes da liberação de mídia e o baseline local já teve dois valores de 158 ms. Não declaro o teto atendido em todas as execuções.

O LCP local ficou praticamente estável e acima de 2,0 s. Não substitui nem reproduz o LCP de 1,38 s obtido pelo Pulso na hospedagem publicada. Esta rodada não altera configuração de exportação, CSS crítico ou fontes para contornar essa diferença.

## Verificação e entrega

Lint, build em SITE_MODE=homolog e check:pendencias passaram. O check mantém as pendências permitidas da homologação; não significa conteúdo definitivo aprovado para produção. Sem JavaScript, com reduced-motion e Save-Data: zero vídeos, quatro quadros estáticos e skip link geral preservado (static.json).

Capturas antes/depois em 390 e 1440 px nesta pasta. Geometria de todas as seções idêntica. PEDRA, contato e rodapé idênticos ou com um canal de pixel diferente; capa mobile com seis canais diferentes. A capa desktop foi capturada durante a reprodução, em instantes diferentes do mesmo clipe: a diferença de pixels desses dois arquivos não é uma comparação estática válida. Nenhum CSS, texto, imagem ou arquivo de vídeo foi modificado. Detalhes em visual-comparison.json.

Nenhum arquivo do configurador ou sua chamada foi alterado. Preview 3105 mantido, navegadores de auditoria fechados após cada bateria. Sem geração paga, publicação, mudanças na main ou workflow.

Para reproduzir, definir NODE_PATH para node_modules da auditoria Pulso 2026-09-27-2021 e AUDIT_MODULES para o cache Lighthouse/Puppeteer usado nas rodadas anteriores. Executar pulso-video.cjs, gestures.cjs, batch.cjs e visual.cjs desta pasta, passando um rótulo de saída. summarize.cjs consolida os dois lotes. Os scripts de auditoria não fazem parte do build público.
