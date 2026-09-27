# Segunda entrega: sequência da pedra

26/09/2026. Branch redesign-astra. Linha de base original: c4edeaf20b285823b4f6fa18197df1fa7d96a9c4, árvore limpa antes de alterar código. Preview restrito a http://127.0.0.1:3105/. Nenhuma publicação ou alteração do deploy.

## Resultado e limite de performance

Máscara PEDRA, quatro imagens Nano Banana Pro, seção sticky com rolagem nativa, legenda HTML e contagem/progresso. Abertura A1 e famílias tipográficas mantidas. Faixa mobile separada das legendas; oculta enquanto o formulário está em foco. Sem JS, reduced-motion ou Save-Data: quatro imagens e legendas em fluxo normal. Vídeo desativado; contrato preparado com limites desktop 8 MB/mobile 3 MB e 720p, carregamento após load/visibilidade, busca por currentTime e fallback em erro.

**As medições abaixo são emulação, nunca aparelhos reais. Há dois métodos, que não devem ser misturados.** O Lighthouse com limitação aplicada pelo Chrome ficou abaixo de 2 s nas três execuções finais. O modelo matemático simulate variou e não confirmou o teto de 2 s de forma consistente. Isso permanece uma limitação explícita; não usamos a melhor execução para declarar a meta garantida.

| Método | Antes | Depois | Faixa das três execuções finais |
|---|---|---|---|
| Lighthouse simulate, LCP | 2,461 s | mediana 2,644 s | 2,497 a 2,650 s |
| Lighthouse devtools, LCP | 1,927 s | mediana 1,204 s | 1,196 a 1,217 s |
| CLS simulate | 0.00022 | 0.00000 | maior valor das três |
| CLS devtools | 0.00022 | 0.00000 | maior valor das três |
| Performance simulate | 97 | 97 | mediana |
| Performance devtools | 94 | 97 | mediana |
| Acessibilidade / boas práticas | 100 / 100 | 100 / 100 | home, três execuções de cada método |
| JS inicial gzip, sem 3D | 138.338 bytes | 140.448 bytes | limite 150.000 bytes |

Detalhes das execuções simulate:

- 1: LCP 2,650 s; FCP 1,154 s; TBT 42.0 ms; CLS 0.00000; notas 96/100/100; 2026-09-26T21:48:30.137Z
- 2: LCP 2,497 s; FCP 1,108 s; TBT 30.0 ms; CLS 0.00000; notas 97/100/100; 2026-09-26T21:48:41.306Z
- 3: LCP 2,644 s; FCP 1,109 s; TBT 27.0 ms; CLS 0.00000; notas 97/100/100; 2026-09-26T21:48:52.462Z

Detalhes das execuções devtools:

- A1 recompilado: LCP 1,927 s; FCP 1,927 s; TBT 228.3 ms; CLS 0.00022; notas 94/100/100.
- 1: LCP 1,217 s; FCP 1,217 s; TBT 159.3 ms; CLS 0.00000; notas 98/100/100; 2026-09-26T21:46:34.310Z
- 2: LCP 1,204 s; FCP 1,204 s; TBT 204.4 ms; CLS 0.00000; notas 97/100/100; 2026-09-26T21:49:03.599Z
- 3: LCP 1,196 s; FCP 1,196 s; TBT 206.7 ms; CLS 0.00000; notas 97/100/100; 2026-09-26T21:49:26.203Z

A linha de base simulate foi capturada antes de qualquer mudança. Para a comparação adicional devtools, o mesmo commit A1 foi extraído dentro de .maestri/a1-baseline e recompilado com as mesmas dependências; apenas turbopack.root foi ajustado para resolver node_modules por junction dentro da worktree. Servidor temporário gzip na porta 3106, encerrado após a comparação. Não foi alterada outra worktree. O modo devtools aplica rede/CPU durante a navegação; simulate modela o resultado a partir de uma captura local. Ambos mantêm mobile 390x844, DPR 2 e os parâmetros completos nos JSON de Lighthouse 13.5.0 / Chrome 153.

INP de campo não foi medido. Event Timing em sessão curta, CPU 4x: maior amostra observada 32 ms; eventos abaixo de 16 ms não entram no observador. Antes: sem amostra equivalente. Não tratar isso como INP real nem como substituto da validação em Android/iPhone.

## Peso inicial e downloads adiados

Transferência observada em Chrome, cache frio, viewport 390x844, DPR 1, navegação local sem throttling para contagem de bytes. Inclui cabeçalhos HTTP. Valores não são tamanhos de arquivos gzip em disco.

| Tipo | A1 até load | Segunda entrega até load | Segunda entrega após idle |
|---|---:|---:|---:|
| HTML | 5834 | 93817 | 93817 |
| JS | 140438 | 142848 | 142848 |
| Fontes externas | 51724 | 7588 | 7588 |
| Imagens externas | 9600 | 0 | 0 |
| CSS externo | 6041 | 0 | 0 |
| 3D | 0 | 0 | 0 |
| Outros | 0 | 0 | 0 |
| Total | 213637 | 244253 | 244253 |

Fonte de corpo (19.664 bytes WOFF2) e A1 (13.121 bytes AVIF) estão incorporados no HTML, inclusive a serialização RSC: seu transporte já está na linha HTML, não somar novamente como downloads externos. Display: 7.288 bytes WOFF2, único preload de fonte. Aumento do HTML é o custo de eliminar duas requisições críticas. O Tailwind só examina src; CSS crítico inline mantém estilo antes da hidratação. Os quatro AVIF de 1600 px somam 70.190 bytes em disco; cada um fica abaixo de 120 KB. Nenhum PNG fonte, vídeo ou motor 3D é necessário no primeiro load.

Na rolagem até etapa 04, recursos acumulados observados (sem somar HTML): {"Fontes externas":7588,"JS":142848,"Imagens externas":59009} bytes. As imagens da sequência e a textura da máscara entram após a abertura; 3D mantém import dinâmico e textura por seleção. Nenhum vídeo foi solicitado. Detalhes por URL nos resumos e no relatório funcional.

## Verificações e evidências

- npm run lint e npm run build passaram; build inclui images:build e check:pendencias em homologação. Logs nesta pasta. SITE_MODE=producao com check-pendencias continua retornando 1; publicação permanece bloqueada.
- Home, material pendente e contato auditados de out/ com gzip. Material: LCP 1,901 s; FCP 0,634 s; TBT 75.0 ms; CLS 0.00000; notas 99/100/100. Contato: LCP 1,907 s; FCP 0,644 s; TBT 58.0 ms; CLS 0.00000; notas 100/100/100. SEO 66/66 nessas rotas e 69 na home: noindex e conteúdo pendente preservados.
- 12 capturas da sequência: máscara, transição e quatro etapas, em 390 e 1440 px; também abertura e três alternativas sem movimento. Sem overflow horizontal, sem vídeo, uma H1, rolagem reversa validada e legendas acima da faixa fixa.
- Teclado: skip link, orçamento da abertura, menu, modo estático e formulário até preparar a mensagem. window.open interceptado no teste: nenhum WhatsApp aberto ou contato enviado.
- Configurador: seleção de ambiente, material de demonstração e acabamento; reduced-motion, CPU 4x e WebGL bloqueado mantêm poster e controles. Explorador preservado no código da rota de material; /materiais/pendente/ continua placeholder e não exercita o explorador por falta de catálogo confirmado.
- Erros encontrados e corrigidos: texto literal de noscript aparecendo em JS; reflow ao trocar a sequência por causa da classificação 3G; faixa fixa sobre campos focados; prefetch RSC com 404 em Windows. Links compartilhados agora fazem navegação nativa. Medições intermediárias de 1,2 s não foram usadas como garantia; resultados finais de ambos os métodos estão preservados.
- Não houve alteração de workflow, SSH, rsync, export, noindex, telefone, endereço, catálogo ou confirmação comercial. Leitura da referência feita por quadros estáticos e transcrição; não alegamos reprodução verificada do vídeo.

## Seis critérios para avaliação do Vitor

| Critério | O que conferir |
|---|---|
| Composição e iluminação | Abertura editorial clara; pausa tipográfica; escala fotográfica na seção escura; luz lateral coerente entre quatro cenas. |
| Aparência e escala dos materiais | Chapa inteira, borda, superfície e peça aplicada; veios e quinas legíveis, sempre ilustração. Aprovação visual e fidelidade técnica continuam humanas. |
| Tipografia e hierarquia | Instrument Serif/Sans; título antes do CTA; PEDRA como palavra neutra; etapa/contador separados da foto. |
| Espaço para conteúdo e orçamento | CTA visível na abertura mobile, faixa opaca com área própria e formulário sem sobreposição durante foco. Pendências comerciais mantidas. |
| Adaptação ao celular | Recorte do A1, quatro enquadramentos centrados, legendas HTML e capturas 390x844. Verificar em aparelho real depois. |
| Movimento principal | Máscara com textura e transição para quatro quadros por rolagem nativa; barra e 01/04; alternativas estáticas e base para vídeo futuro. |

## Créditos e vídeo

8 créditos nesta entrega, 10 acumulados com A1, saldo confirmado 0. Quatro estimativas de 2 e quatro débitos de 2. Modelo efetivo Nano Banana Pro: MCP nano_banana_pro mapeado oficialmente ao backend/CLI nano_banana_2. Fontes, prompts, jobs, arquivos e licença em ../proposta/assets-licencas.md e ../proposta/sequencia-geracao.md; integridade SHA256 em ../proposta/sequencia-integridade.json.

Vídeo ~20 s, somente cotação MCP: Kling 3.0 std sem áudio, 2 chamadas de 10 s, 15 + 15 = 30 créditos; Seedance 1.5 Pro 720p sem áudio, 12 + 8 s, 14,39 + 9,60 = 23,99. count 2 retornou o mesmo preço de count 1 no Kling, por isso o total soma chamadas individuais verificadas. Não houve geração, trial ou recarga. Plano free sem saldo; estimador não comprova permissão de execução. Arquivo real, GOP, compressão e busca do vídeo serão verificados somente depois da autorização.

## Reproduzir e abrir

Na raiz da worktree: npm run build; node scripts/preview-local.mjs. Abrir http://127.0.0.1:3105/. O servidor 3105 foi mantido para revisão. Portais JK A1 desktop/mobile reaproveitados; portal de referência encerrado; Chrome/Lighthouse próprios fechados ao terminar cada teste.

Comandos PowerShell usados (dependências de auditoria fora do bundle do site):

```powershell
$env:AUDIT_MODULES='C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules'
$env:AUDIT_LABEL='sequencia'
node scripts/audit-home.mjs antes # executado originalmente sobre c4edeaf
node scripts/audit-home.mjs depois
# Repeticoes: AUDIT_LABEL=sequencia-confirmacao-1 e sequencia-confirmacao-2
# Auditorias de rotas: AUDIT_ROUTE=/materiais/pendente/ ou /contato/
$env:AUDIT_THROTTLING='devtools'
$env:AUDIT_LABEL='sequencia-devtools'
$env:AUDIT_PORT='3106' # A1 recompilado, servidor temporario
node scripts/audit-home.mjs antes
$env:AUDIT_PORT='3105'
node scripts/audit-home.mjs depois
# Repeticoes: sequencia-devtools-confirmacao-1 e sequencia-devtools-confirmacao-2
Remove-Item Env:AUDIT_THROTTLING
node scripts/audit-journey.mjs
node scripts/check-home.mjs
node scripts/check-quote-scene.mjs
npm run lint
npm run build
npm run measure:bundle
$env:SITE_MODE='producao'
node scripts/check-pendencias.mjs # saida 1 esperada
Remove-Item Env:SITE_MODE
```

Subsets reproduzíveis: instalar FontTools 4.66.0/Brotli 1.2.0 em .maestri/font-tools, definir PYTHONPATH para essa pasta e executar py -3.12 scripts/subset-home-fonts.py. O script usa os originais versionados em c4edeaf; não modifica dependências do site.
