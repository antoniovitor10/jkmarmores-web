# Correção da estimativa de rede móvel

Aplicada a mesma política do commit `095ab26` da versão 1, preservando a proteção adicional de aparelho com até 2 GB da versão 2. Uma transferência crítica já concluída de pelo menos 8 KiB e 150 KB/s prevalece sobre downlink abaixo de 1,6 Mbps. Nenhuma requisição de teste é criada.

Save-Data, 2G/3G, TTFB acima de 600 ms e corpo realmente lento continuam vetando; cache sem transferSize não comprova a conexão atual. Reduced-motion continua estático via matchMedia, fora da política de velocidade. Sem mudanças visuais ou de deploy.

Lint, build com /2/, check:pendencias homolog e varredura de prefixos passam. Os dois avisos antigos de lint em ferramentas Higgsfield permanecem.

`qa-rede.cjs` verifica 14 casos da política real, incluindo o limite de 150 KB/s, poster ou navegação rápidos, cache, resposta lenta, veto de Save-Data/2G/3G e aparelho limitado. Cinco cenários mobile 390×844, sem throttling de rede: API nativa, estimativa 0,3 Mbps, Save-Data, 3G e reduced-motion. Os cenários rápidos verificam também duas etapas da jornada e o corte da segunda imagem, sem depender apenas da presença da classe de movimento. Chrome fechado em finally.

Validação local: os 14 casos e cinco cenários passaram. Movimento ativo na rede nativa e com estimativa baixa; heroLite=false e etapas 0/1 em ambos. Save-Data/3G sem jornada e com entrada estática; reduced-motion sem jornada. Sem erros HTTP/JavaScript ou download de vídeo. Capturas e amostras reais em `local-*.png` e `local.json`.

Reprodução na URL pública após deploy: executar `node docs/auditorias/versao-2/rede-2026-09-30/qa-rede.cjs` (URL pública por padrão). QA_URL, QA_LABEL e QA_OUTPUT_DIR permitem registrar os resultados separadamente; PLAYWRIGHT_MODULE permite outra instalação do Playwright. A confirmação pública final também é registrada na memória compartilhada e comunicada ao Vitor.
