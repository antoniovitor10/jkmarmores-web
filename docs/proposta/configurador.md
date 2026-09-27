# Configurador imersivo

Trabalho isolado na branch `configurador-imersivo`, base `e215a56b77ff480cc52a0540607d2993231af83e`. Integração restrita à troca de SceneSlot na home e no material. CSS Modules usa cores e fontes existentes, sem alterar globals, hero, jornada, máscara, navegação ou deploy.

## Plano de assets e orçamento anterior aos envios

Teto autorizado: US$ 2,00, separado do Astra. Duas cenas (cozinha e lavatório), três referências (mármore rosado, pedra bege, pedra escura), nove closes (três acabamentos por referência). Terceiro ambiente e quarto material ficam fora para respeitar o teto.

Consulta em 27/09/2026: [Z-Image Turbo](https://open.higgsfield.ai/models/z-image/turbo/api-reference), [preço de imagem](https://open.higgsfield.ai/models/z-image/turbo/playground), [Kling 3.0 Standard](https://open.higgsfield.ai/models/kling-video/v3.0/std/image-to-video/api-reference), [preço de vídeo](https://open.higgsfield.ai/models/kling-video/v3.0/std/image-to-video/playground).

| Item | Conta conservadora |
|---|---:|
| 6 imagens-chave, Z-Image 2k | 6 × US$ 0,015 = US$ 0,09 |
| 6 vídeos, Kling Standard, 4 s, sem som | 24 × US$ 0,0693 = US$ 1,6632 |
| 9 closes, Z-Image 2k | 9 × US$ 0,015 = US$ 0,135 |
| Total previsto | US$ 1,8882 |
| Reserva não utilizada | US$ 0,1118 |

Página de vídeo anuncia a partir de US$ 0,0462/s, mas descreve ambiguamente as faixas; planejamento usa a maior publicada, US$ 0,0693/s. O SDK não retorna débito confirmado nem saldo API. Não confundir esse orçamento conservador com extrato financeiro. Nenhum arquivo de credencial foi lido, impresso, copiado ou versionado; execução `node --env-file=.env.local` no SDK indicado pelo Vitor.

## Prova inicial e revisão

Primeiro foram gerados cozinha rosada, vídeo correspondente e seus três closes. Só depois da inspeção visual foram enviados os demais. A prova preserva geometria e padrões de pedra e tem paralaxe de fundo, sem pessoas, texto ou marca. O arco é menor que os 90 graus solicitados: não é uma volta completa. A interface informa posições de ângulo de 01 a 24, sem inventar graus físicos, e bloqueia as extremidades, sem loop nem salto entre pontas.

Os outros cinco vídeos foram inspecionados em pranchas de oito quadros; os lavatórios mostram arco maior. Como ilustrações independentes, composições e cuba podem variar entre materiais. Não são provas de execução, modelos arquitetônicos dimensionais nem materiais confirmados da JK.

## Experiência e carregamento

- Abas Ambiente, Material e Acabamento acima de palco amplo, com miniaturas; CTA contextual sobre o palco.
- Setas laterais, arrasto horizontal, swipe, teclado Home/End e setas. Sem reprodução automática.
- Quatro níveis de zoom (1, 1,5, 2 e 2,5), botões, duplo clique/toque, pinça; com zoom, arrasto e setas fazem pan. Escape ou Reenquadrar restaura a vista.
- Roda só é capturada quando o próprio palco tem foco, ou com Ctrl; rolagem vertical de toque é preservada no enquadramento inicial.
- Acabamentos são comparados em painel de macrofotografia ilustrativa. O palco mantém a vista polida; isso fica explícito no painel.
- Shell HTML indexável e link WhatsApp sem JS. O motor é importado apenas a 250 px da seção ou por clique. Sem mídia do configurador no primeiro carregamento com JS; fallback noscript tem imagem lazy.
- Só busca o quadro escolhido e os dois ângulos adjacentes da mesma combinação. Miniaturas pequenas são a única exceção de mídia de outras combinações. Nenhuma sequência inteira é pré-carregada.
- AVIF 720 px no celular, 1280 px no desktop; ao aproximar, busca 2048 px do quadro corrente. Estes últimos são reamostrados do vídeo 1280 px, sem detalhe óptico novo. Os closes vêm das imagens 2k.
- Reduced-motion e Save-Data mantêm quadro zero, sem vizinhos e sem giro; ainda permitem selecionar referências e aproximar manualmente.
- Sem WebGL ou dependência nova. Three.js antigo fica no repositório fora do escopo, mas deixa de ser usado nestes pontos.

## Conteúdo e integração

`src/content/configurador.ts` define referências explicitamente ilustrativas. WhatsApp fornecido pelo Vitor: `wa.me/5511967976902`. Mensagem inclui ambiente, referência de material, acabamento e aviso para confirmar disponibilidade. Não altera o catálogo nem remove pendências O2/V3/V4 existentes em `docs/PENDENCIAS.md`.

Componente `Configurador` aceita `compact` e `materialContext`. A rota de material ainda só exporta o placeholder `pendente` porque não há material confirmado; o componente compacto fica integrado no caminho de material confirmado, sem inventar item para ativá-lo.

Registros de licença e todos os request IDs: seção Configurador em `assets-licencas.md`. Capturas e validação: `docs/auditorias/*configurador*`.
