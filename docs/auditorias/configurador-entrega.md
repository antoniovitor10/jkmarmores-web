# Entrega do configurador imersivo — 27/09/2026

Base conferida: worktree limpa, branch `configurador-imersivo`, HEAD `e215a56b77ff480cc52a0540607d2993231af83e`. Sem alteração no restante do redesign, infraestrutura ou deploy. A exceção documental `docs/proposta/assets-licencas.md` contém somente a seção Configurador exigida pelo briefing.

## Resultado

Duas cenas completas, três referências de pedra e três acabamentos. Seis sequências de 24 quadros AVIF; nove closes ilustrativos. Seletores com miniaturas acima do palco, setas laterais, teclado, swipe/arrasto, zoom em quatro níveis, pinça e duplo toque/clique. Pan limitado à imagem quando ampliada. Roda livre sem foco, capturada com foco no palco ou Ctrl. CTA monta mensagem para o WhatsApp fornecido, sem enviar mensagem durante os testes.

O componente principal só importa o motor e seu CSS ao aproximar a seção ou clicar. Nenhum asset do configurador foi carregado na abertura. Imagem corrente e vizinhas da mesma combinação; nenhum download integral de sequência. Reduced-motion e Save-Data mantêm vista estática. Sem JS, descrição, prévia lazy e link WhatsApp continuam disponíveis. Falha no import mantém fallback e tentativa manual; falha em quadro informa o problema e preserva os controles.

## Medições

Build estático em `out/`, servidor gzip `scripts/preview-local.mjs`, porta 3107. Chrome 153 headless no Windows; são emulações, não aparelhos reais.

| Métrica | Base | Configurador |
|---|---:|---:|
| JS inicial da home, gzip | 140.507 B | 140.006 B |
| LCP direto, mediana de 3 navegações | 900 ms | 880 ms |
| LCP direto, amostras | 956 / 900 / 840 ms | 940 / 880 / 876 ms |
| CLS Lighthouse | 0 | 0 |
| Acessibilidade Lighthouse | 100 | 100 |
| Boas práticas Lighthouse | 100 | 100 |
| Performance Lighthouse, faixa | 98–100 | 98–100 |
| LCP simulado Lighthouse, faixa | 1.166–2.422 ms | 1.472–2.435 ms |
| LCP simulado, mediana | 1.338 ms | 2.410 ms |
| Recursos do configurador antes de rolar | 0 | 0 |

A simulação Lighthouse oscilou e sua mediana piorou; a meta de 2 s não passou em todas as execuções simuladas, inclusive na base. Não apresentar a melhor amostra isolada como garantia. Para comparar regressão, o benchmark direto manteve CPU 4x, latência 150 ms, download 200.000 B/s, upload 100.000 B/s, cache desabilitado, viewport 390×844 DPR2, sem importar recursos do configurador antes da medição. Nessas condições a mediana não piorou. Os dois conjuntos de resultados foram preservados.

Lighthouse SEO 69 em ambas as versões por homologação/noindex; esse bloqueio não foi alterado. INP de campo e desempenho em Android/iPhone físicos permanecem sem medição.

Primeiro quadro após aproximar a seção: **453 ms**, mesma CPU/rede limitada, uma execução. Downloads concluídos nessa janela: JS adiado 4.369 B transferidos, CSS 2.269 B, duas miniaturas 2.507 B, primeiro quadro mobile 8.368 B (8.068 B em disco). Vizinhas são pedidas depois da decodificação da vista atual. O motor antigo tinha 136.587 B gzip de JS. A nova integração não importa Three.js.

447 AVIF somam 7.756.764 B em disco, incluindo todos os tamanhos e combinações. Sequências mobile completas: 78.885–189.786 B por combinação; desktop: 177.991–434.674 B. O peso total de todas as variantes não é transferido ao visitante. Manifesto: [configurador-assets.json](configurador-assets.json).

## Verificação funcional e capturas

`npm run lint`, `npm run build`, `npm run check:pendencias` em homologação, TypeScript e `git diff --check` passam. O conteúdo pendente existente continua relatado e bloqueia o modo de produção. Não foram inventados itens confirmados nem reduzidos os bloqueios.

- [Relatório funcional](configurador-funcional.json): 390/1440 px sem overflow, sem erro JavaScript, zero violações axe WCAG A/AA no configurador; seleção, mensagem WhatsApp, setas, limites, pan, teclado, reduced-motion, Save-Data e sem JS.
- [Gestos e carregamento](configurador-gestos.json): pinça nativa CDP, duplo toque, swipe, duplo clique, Ctrl+roda e roda focada/livre. Um conflito de duplo clique sintético após toque foi corrigido usando um único reconhecimento por pointerup.
- [Seleção 390](configurador-390-selecao.png), [rotação 390](configurador-390-rotacao.png), [zoom 390](configurador-390-zoom.png), [acabamento 390](configurador-390-acabamento.png).
- [Seleção 1440](configurador-1440-selecao.png), [rotação 1440](configurador-1440-rotacao.png), [zoom 1440](configurador-1440-zoom.png), [acabamento 1440](configurador-1440-acabamento.png).
- [Seis sequências revisadas](configurador-sequencias.jpg), [nove closes revisados](configurador-closes.jpg).

Comandos reproduzíveis: `node docs/auditorias/configurador-check.mjs`, `node docs/auditorias/configurador-gestos.mjs`, `npm run measure:bundle`. Dependências de auditoria já existentes em `C:/Users/Vitor/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules`; nenhuma dependência adicionada ao projeto.

Lighthouse: `AUDIT_MODULES` no caminho acima, `AUDIT_PORT=3107`, `AUDIT_SKIP_CAPTURE=1`, `AUDIT_LABEL=configurador-final`, `node scripts/audit-home.mjs depois`. Comparação direta: `node docs/auditorias/configurador-baseline.mjs --direct`; esse script preserva os dois arquivos de integração em backup temporário, mede a versão base sem trocar branch e restaura os arquivos em `finally`, reconstruindo a versão final.

## Custo e limites para integração

21 pedidos concluídos: 6 imagens-chave, 6 vídeos de 4 s, 9 closes. **US$ 1,8882 estimados conservadoramente**, abaixo de US$ 2,00; reserva US$ 0,1118 sem uso. Não é débito bancário confirmado: a resposta do SDK não informa cobrança nem saldo. IDs, parâmetros, prompts e termos em [registro de gerações](configurador-geracoes.json) e [licenças](../proposta/assets-licencas.md#configurador). Sem retry pago.

- Giro em arco parcial, diferente entre cenas; sem promessa de 360° ou graus calibrados. Setas param nas extremidades.
- Quadros de zoom 2048 px são reamostrados de vídeo 1280 px. Closes derivam de imagem nativa 2k.
- Acabamento muda o painel de close, mantendo a vista polida do ambiente; aviso explícito na interface.
- Referências de material não representam catálogo confirmado. O contexto da página de material entra na mensagem sem associar a ilustração à chapa real.
- Compacto integrado ao caminho de material confirmado; a rota exportada atual é o placeholder sem material. Validação visual em rota comercial aguarda catálogo confirmado. Não foi criado item fictício para testar essa rota.
- O título externo da seção ainda diz “Explore em 3D” e o parágrafo diz “maquete”; ficaram intactos pelo limite de trocar somente o SceneSlot. Planejador/Astra podem ajustar esses textos na integração.
- Próximo passo: Planejador revisar capturas, política do arco parcial e material ilustrativo; validar aparelhos reais e integrar na branch de redesign. Sem merge ou publicação nesta entrega.
