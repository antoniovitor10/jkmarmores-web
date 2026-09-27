# Quarta entrega: parada após a primeira prova de vídeo

27/09/2026. Etapa (a) concluída e enviada à branch redesign-astra em **c15c6d901f305ff759e180a093aed16b3a2d39bb**. Hidratação nativa e WhatsApp confirmado; build, lint e check:pendencias passaram em homologação. [Medições e verificações](2026-09-27-quarta-a.md).

## Ponto de parada determinado pelo Vitor

Instrução vigente: fazer uma prova de vídeo e parar se custo divergir, geração falhar, houver moderação ou qualidade não servir. Uma imagem-chave e um vídeo foram gerados. Ambos retornaram completed. A imagem quente serve à direção de cor, mas a prova de vídeo ficou quase estática e não entrega a presença de luz/câmera solicitada. Revisão por amostragem de 12 quadros em intervalos de 0,5 s; sem dissolução visível da pedra ou saltos grandes de veio nesses quadros. A composição se mantém, com deslocamento e luz insuficientes. A similaridade início/meio (SSIM 0,981290) foi registrada como apoio, não como critério isolado de qualidade.

O prompt limitou excessivamente o movimento: câmera quase fixa, deslocamento quase imperceptível e mesmo frame no início/fim. Corrigir isso requer uma nova tentativa, que **não foi enviada**, em respeito à parada explícita. Proposta para a próxima decisão: manter a imagem-chave quente, remover a restrição de retorno idêntico da geração, pedir uma travessia de luz perceptível e câmera lateral curta; montar o loop localmente. Reestimar o envio antes de qualquer tentativa.

Débito real não aparece nas respostas/headers do SDK nem no endpoint de status; o portal da API está sem sessão autenticada. Estimativa autenticada dos dois envios: **US$ 0,293**, ainda sem confirmação da cobrança. Pergunta de conferência enviada ao Vitor com os dois request IDs. Não substituir cobrança efetiva por estimativa, nem declarar saldo API a partir do antigo saldo MCP.

## Entregue e pendente

| Etapa | Estado |
|---|---|
| (a) Hidratação nativa e WhatsApp | Commit c15c6d9, push realizado; evidências versionadas |
| (b) Vídeo de capa | Prova preservada, reprovada por movimento insuficiente; não aplicada à home |
| (c) Configurador imersivo | Não produzido; nenhuma órbita enviada |
| (d) Transições e premium | Não iniciado após a parada |
| (e) Sequência em vídeo | Não produzida; quatro quadros aprovados permanecem |

A repetição do quadro 03 na seção de materiais ainda não foi substituída; seria tratada com o novo acervo do configurador. Nenhum asset rejeitado aparece no site. Este commit de registro só acrescenta evidência e arquivos-fonte em assets/provas; nenhum vídeo é carregado pela home. Não houve publicação, main, workflow ou alteração de deploy.

## Evidências e preview

- Home e páginas, 390/1440: [índice de capturas](../proposta/capturas/quarta.md).
- [Quadros da prova](../proposta/capturas/quarta-prova-capa-quadros.jpg).
- [Arquivo de vídeo](../../assets/provas/capa-quente-prova.mp4) e [imagem-chave](../../assets/provas/capa-quente-frame.png).
- [Custos, termos e prompts](../proposta/assets-licencas.md), [registro estruturado](../proposta/quarta-prova-api.json).
- Home mantida em http://127.0.0.1:3105/.
- Prova temporária isolada: http://127.0.0.1:3105/__prova-capa/. Página de revisão com noindex, controles nativos e legenda de IA. Copiada apenas no out local ignorado pelo Git; não faz parte do build/deploy e desaparece no próximo build. Fontes da prova estão versionadas para reprodução.
- Portais desktop/mobile existentes reaproveitados; nenhum navegador headless de auditoria mantido aberto.

O próximo passo depende da decisão sobre a prova e da conferência de cobrança; não foram consumidos os demais envios do plano.
