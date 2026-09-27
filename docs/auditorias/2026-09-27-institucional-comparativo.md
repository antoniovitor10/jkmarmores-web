# Terceira entrega: identidade institucional da JK

27/09/2026. Worktree `jk-marmores-redesign`, branch `redesign-astra`. Antes: eef51efcf90184cdedcb3c8646de9d9417b97394, árvore limpa. As duas linhas de base foram medidas antes de alterar código nesta rodada. Preview estático local com gzip em http://127.0.0.1:3105/. Nenhuma publicação.

## Resultado e conteúdo confirmado

Home completa com abertura institucional, logo da cliente, apresentação local, orientação sobre materiais, 3D, preparação de pedido, trabalhos aguardando fotos reais e endereço/telefone. Sobre, Materiais e Contato reconstruídos; demais rotas recebem o sistema visual compartilhado. Máscara PEDRA, transições nativas e quatro quadros escuros mantidos. Recorte móvel do quadro 02 elimina a peça solta e aproxima a borda; fonte/desktop intactos.

Cliente confirmou em 26/09: JK Marmores e Granitos; Estrada dos Pinheiros, 379, Parque Viana, Barueri/SP; telefone (11) 96797-6902. Conteúdo tipado, title/description, H1 local e LocalBusiness com PostalAddress alinhados. Telefone E.164 +5511967976902 nos links/schema; origem dos links centralizada. Nenhum CNPJ publicado, nenhum horário/CEP/estoque/serviço inferido. WhatsApp mantém exatamente a pendência solicitada. Botões levam ao contato enquanto não confirmado; formulário produz rascunho local sem abrir destino externo. Quando houver número confirmado, o contrato de mensagem permanece.

## Desempenho: simulate é a referência

Lighthouse 13.5.0, Chrome 153 headless, viewport 390×844, DPR 2, cache frio, servidor local gzip. Ambos os métodos são emulação; não são aparelhos reais nem resultado da API PageSpeed. simulate usa o modelo do Lighthouse empregado pelo PageSpeed; devtools aplica limitação de rede/CPU no Chrome. Não misturar os resultados. Três execuções finais de simulate na home, mesmo build; demais páginas e devtools com uma execução.

| Métrica | Antes eef51ef | Depois |
|---|---:|---:|
| LCP simulate | 2,272 s | 1,281 s, mediana |
| FCP simulate | 1,376 s | 0,912 s, mediana |
| TBT simulate | 41,5 ms | 181 ms, mediana |
| CLS simulate | 0 | 0 |
| Performance / acessibilidade / boas práticas | 98/100/100 | 97/100/100 |
| LCP com throttling aplicado (devtools) | 1,199 s | 1,368 s |
| CLS devtools | 0 | 0 |

Execuções finais simulate: 1,281 s; 1,283 s; 1,21 s. Todas ficaram até 2,0 s nesta emulação. SEO preserva noindex: não se busca nota 100 removendo a proteção de homologação. INP de campo não medido; Event Timing da sessão sintética está no relatório da jornada e não equivale a INP.

Ressalva: TBT passou de 41,5 ms para 181 ms de mediana (faixa 57–280 ms); desempenho variou 94–100. A hidratação adiada melhora a apresentação inicial, mas não elimina o trabalho de JavaScript. CLS máximo: 0.000608.

| Página | LCP simulate | CLS | Performance / acessibilidade / boas práticas |
|---|---:|---:|---|
| sobre | 1,278 s | 0 | 100/100/100 |
| materiais | 1,355 s | 0 | 99/100/100 |
| contato | 0,981 s | 0 | 100/100/100 |
| materiais-pendente | 1,13 s | 0 | 100/100/100 |

## Peso, carregamento e decisões técnicas

Transferência observada, Chrome sem throttling para inventário de rede, cache frio, 390×844, DPR 1; inclui cabeçalhos HTTP. O novo load ocorre antes da hidratação: a coluna após hidratação/idle inclui o custo completo e é a comparação justa com o estado anterior. Não confundir este inventário com totalBytes do Lighthouse (DPR 2).

| Tipo | Antes, load (bytes) | Depois, load (bytes) | Depois, hidratação/idle (bytes) |
|---|---:|---:|---:|
| HTML | 93.817 | 29.688 | 29.688 |
| JS | 142.848 | 0 | 142.907 |
| Fontes | 7.588 | 22.320 | 22.320 |
| Imagens | 0 | 11.110 | 11.110 |
| CSS | 0 | 0 | 0 |
| Video | 0 | 0 | 0 |
| 3D | 0 | 0 | 0 |
| Outros | 0 | 0 | 0 |
| Total | 244.253 | 63.118 | 206.025 |

JS gzip, incluindo os scripts de hidratação agora adiados: 140.448 → 140.507 bytes em 8 arquivos, mais 594 bytes gzip do inicializador inline (já transportado no HTML). A soma continua abaixo de 150.000 bytes. A página até idle continua abaixo de 1 MB, sem vídeo ou motor 3D. Antes, Sans e A1 eram data URIs no HTML, contabilizados em HTML. Agora são arquivos externos: só o display recebe preload de fonte; imagens com sources/preload responsivos. A1 mobile: AVIF 768 px de 7.569 bytes; logo 288/480 px conserva 2x. Fontes finais: Serif 10.524 bytes e Sans 400 de 11.196 bytes; mesmas famílias, subset português, sem hinting legado, fallback com size-adjust e font-display swap. O Sans variável histórico não é solicitado.

As quatro imagens da jornada e a textura da máscara continuam diferidas até visibilidade; imagens editoriais e poster são lazy. 3D mantém import sob demanda e alternativa estática. O arquivo institucional-jornada.json registra recursos após cada ponto da rolagem; não somar os totais cumulativos como downloads independentes. Vídeo permanece null, com o contrato previamente preparado, sem arquivo novo.

A opção **experimental.inlineCss: true** foi adicionada em eef51ef e está mantida em next.config.ts. Elimina a requisição CSS bloqueante ao enviar estilos no HTML, mas é global, experimental, duplica CSS no payload RSC e perde cache independente entre páginas. Não houve diff de next.config.ts nesta rodada. Guia local consultado: node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/inlineCss.md. O Tailwind continua limitado a src.

**Mudança de build em package.json:** após next build, scripts/defer-hydration.mjs prepara os HTML de out para ativar scripts Next automaticamente depois de load e primeira pintura observada (PerformanceObserver), com duas oportunidades de pintura e timeout de segurança de 1,5 s. Pointerdown/keydown podem antecipar. Não depende de interação nem de identificar Lighthouse/usuário. Os atributos dos scripts são preservados e a fila RSC continua disponível; o build falha se o padrão esperado de scripts não existir. Sem JS, HTML, imagens, fontes e navegação continuam disponíveis. Benefício: interatividade não disputa a primeira apresentação. Custo/risco: início da hidratação adiado e pós-processamento específico do export Next; revalidar em upgrades. Testes verificam ativação automática, sequência, formulário, 3D, navegação e ausência de erros. Output export, trailingSlash, .htaccess e workflow intactos; nenhuma configuração de deploy alterada.

Tentativas descartadas: fonte de corpo variável incorporada deixava HTML perto de 99 KB; versão estática incorporada teve uma execução de 1,61 s e repetiu cerca de 2,48 s. Webpack ficou em cerca de 2,28 s nas três execuções, sem ganho suficiente; o build segue Turbopack. Carregar apenas a fonte de corpo depois não resolveu. Nenhuma dessas tentativas isoladas declara a meta. A versão final serve fontes e imagem externamente, preserva tipografia e espera a pintura observada antes da hidratação. Uma regra de escopo de variável de fonte no body também foi corrigida; verificações conferem as famílias efetivamente aplicadas.

## Validação e limites

Lint, build, check:pendencias em homologação e measure:bundle executados; logs versionados. SITE_MODE=producao continua bloqueado por pendências, saída 1 esperada. Contrastes calculados em institucional-contraste.json: texto secundário mínimo 4,89:1; botão mínimo 5,95:1; foco/borda de campos acima de 3:1.

Testes sem/com JS, H1 único, menu por teclado, skip link, CTA acima da dobra, navegação, noindex, telefone/schema e ausência de URLs WhatsApp não confirmadas. Rascunho preenchido por teclado sem envio; faixa fixa oculta durante foco no formulário. Jornada validada em rolagem direta/reversa, legendas fora da faixa fixa, reduced-motion e Save-Data. Configurador com seleção de ambiente/material/acabamento e alternativa com WebGL bloqueado, CPU 4x e movimento reduzido. Explorador de chapa preservado na rota de material; placeholder não o exercita porque o catálogo continua pendente.

16 capturas integrais: oito rotas em 390/1440; home integral usa modo estático acessível para revelar todos os quadros. Capturas separadas mostram a máscara, transição e etapas 01–04 em rolagem normal. Não se afirma reprodução verificada de vídeo: a referência original foi lida em quadros estáticos. Índice: ../proposta/capturas/institucional.md.

## Seis critérios para avaliação

| Critério | Conferência |
|---|---|
| Composição e iluminação | Abertura grafite/caramelo, fotografia A1 reaproveitada e intervalos quentes; identidade parte da logo recebida. |
| Aparência e escala dos materiais | Imagens ilustrativas identificadas; recorte 02 móvel concentra a quina e exclui peça solta. |
| Tipografia e hierarquia | Instrument Serif/Sans em todas as páginas, nome/local/canal claros. |
| Espaço para conteúdo e orçamento | Conteúdo institucional, telefone confirmado, rascunho sem destino inventado e CTA móvel com área própria. |
| Adaptação ao celular | Capturas 390 px, menu acessível, imagens responsivas e ausência de overflow; aparelho real pendente. |
| Movimento principal | Máscara PEDRA e quatro etapas sticky preservadas, rolagem nativa e alternativas estáticas. |

## Créditos e próximo passo

0 créditos gastos nesta rodada; saldo conhecido 0, acumulado anterior 10. Nenhuma geração, vídeo, recarga ou uso de API. Logo da cliente recortada sem redesenho, A1 e quadro 02 recortados localmente; registro de origem em ../proposta/assets-licencas.md. V1 parcial: falta vetor. Fotos reais, serviços, materiais, horário, CEP, região além de Barueri e CNPJ da JK permanecem pendentes. Vitor/Planejador devem revisar a entrega visual antes de vídeo ou publicação.

## Reproduzir

Na worktree: npm run build; node scripts/preview-local.mjs. Preview 3105 mantido. Portais JK A1 desktop/mobile reaproveitados. Os navegadores headless de auditoria são encerrados em finally; nenhuma nova janela visível necessária.

```powershell
$env:AUDIT_MODULES='C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules'
$env:AUDIT_LABEL='institucional'
node scripts/audit-home.mjs antes # executado antes das alterações, sobre eef51ef
node scripts/audit-home.mjs depois
# Repetições finais: AUDIT_LABEL=institucional-confirmacao-1 / institucional-confirmacao-2
$env:AUDIT_THROTTLING='devtools'
$env:AUDIT_LABEL='institucional-devtools'
node scripts/audit-home.mjs depois # baseline devtools também medida antes de alterar código
Remove-Item Env:AUDIT_THROTTLING
# Rotas: AUDIT_ROUTE=/sobre/, /materiais/, /contato/, /materiais/pendente/
# AUDIT_LABEL=institucional-sobre, institucional-materiais, institucional-contato, institucional-materiais-pendente
node scripts/check-home.mjs
node scripts/check-quote-scene.mjs
node scripts/audit-journey.mjs
node scripts/capture-institutional.mjs
node scripts/check-contrast.mjs
npm run lint
npm run build
npm run check:pendencias
npm run measure:bundle
$env:SITE_MODE='producao'
node scripts/check-pendencias.mjs # saída 1 esperada
Remove-Item Env:SITE_MODE
```
