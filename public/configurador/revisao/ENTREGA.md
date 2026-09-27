# Configurador imersivo — segunda rodada

Base: `ee13af96d82cb73eeb4a1e5b8eb43466d63a488c`, recebida com `git fetch` e `git merge --ff-only origin/main`, árvore limpa antes das alterações. Branch de entrega: `configurador-imersivo`. Preview e testes: `http://127.0.0.1:3107/`, build de produção local, em 27/09/2026.

O palco ocupa 100svh e sangra até as bordas. A Fullscreen API tem saída por Esc e botão acionável por toque; o fallback ocupa a viewport, isola o foco e restaura a página ao sair. Os controles sobrepostos somem após 3,5 s de inatividade e voltam com interação; a navegação pelo teclado mantém os controles visíveis. CTA e aviso de IA permanecem discretamente disponíveis.

A câmera combina quadros vizinhos durante o movimento, desacelera após o arraste e repousa num quadro único. Há uma demonstração curta na primeira entrada. Material, ambiente e acabamento preservam posição, zoom e pan. Pinça, duplo toque, duplo clique, teclado e zoom ancorado funcionam; a roda só aproxima com foco no palco ou Ctrl. O CTA “Quero esta combinação” monta a mensagem para `wa.me/5511967976902`.

## Capturas revisadas

| Estado | 390 × 844 | 1440 × 900 |
|---|---|---|
| Imersão, controles recolhidos | [390](390-imersao.png) | [1440](1440-imersao.png) |
| Giro | [390](390-giro.png) | [1440](1440-giro.png) |
| Zoom nativo da cozinha rosada | [390](390-zoom.png) | [1440](1440-zoom.png) |
| Seleção e acabamento | [390](390-selecao.png) | [1440](1440-selecao.png) |
| Fullscreen API ativa | [390](390-tela-cheia.png) | [1440](1440-tela-cheia.png) |

## Configurador — geração, custo e termos

Plano estimado antes da chamada: uma órbita 4K de 4 s × US$ 0,231/s = **US$ 0,924**. Imagem-chave reaproveitada: US$ 0 nesta rodada. Total estimado US$ 0,924, teto US$ 1,20, reserva US$ 0,276. A estimativa autenticada do endpoint `/estimate` confirmou US$ 0,924 / 14,784 créditos. O débito final não foi retornado pela API; o valor registrado é a estimativa, não um comprovante de cobrança.

Modelo: `kling-video/v3.0/4k/image-to-video`, `duration: 4`, `sound: off`, `cfg_scale: 0.8`, `multi_shots: false`. ID e parâmetros conferidos na [referência oficial](https://open.higgsfield.ai/models/kling-video/v3.0/4k/image-to-video/api-reference), preço no [playground oficial](https://open.higgsfield.ai/models/kling-video/v3.0/4k/image-to-video/playground).

Request: `280dd062-8c37-43a2-a272-1bbec70fae44`, concluído. Imagem-chave da primeira rodada: request `abcf1de8-6eed-4510-8aca-e6827d7ed421`. Prompt integral e parâmetros em [geracao.json](geracao.json). Foi gerada somente esta combinação e revisada antes da extração final; não houve segunda chamada paga. A reserva não comporta outra geração 4K na duração mínima desse modelo.

O arquivo retornado tem 3840 × 2160, 24 fps e aproximadamente 4 s. Foram extraídos 48 quadros em 720, 1280 e 2560 px, mais recortes verticais de 720 × 1558 derivados diretamente do original. Não houve ampliação artificial para produzir os quadros de alta. A série nativa de 2560 soma 3,71 MB, cerca de 77 kB por quadro; somente o ângulo necessário é carregado ao aproximar. As quatro séries somam 6,44 MB no repositório, sem download integral automático.

Revisão: [folha de contato](orbita-revisada.jpg). Há deslocamento real da câmera, passagem pela lateral da ilha, mudança de perspectiva e ambiente coerente. Sem pessoas, texto ou logos. O arco é maior que o anterior, mas os graus não são calibrados; a interface usa “Vista / 100” e não anuncia uma volta completa.

Termos do serviço usados para o registro: [Open Higgsfield](https://open.higgsfield.ai/terms-of-service) e [Higgsfield](https://higgsfield.ai/terms-of-use-agreement). Conteúdo gerado por IA, ilustrativo, sujeito à confirmação da JK; não representa obra executada ou catálogo confirmado. Este registro fica dentro de `public/configurador/`, conforme o escopo exclusivo desta rodada; o Planejador pode consolidá-lo no documento geral de licenças.

## Verificação e medições

`npm run lint`, `npm run build` e `npm run check:pendencias`: saída 0. O check roda no modo de homologação existente; as pendências comerciais preexistentes continuam registradas pelo projeto.

| Medida local | Base | Entrega |
|---|---:|---:|
| JS inicial, gzip / oito scripts | 141.219 B | 141.220 B |
| Mídia do configurador na abertura | 0 | 0 |
| Lighthouse Performance | 91 | 99 |
| Lighthouse Accessibility | 100 | 100 |
| Lighthouse Best Practices | 100 | 100 |
| Lighthouse LCP, simulado | 2.450 ms | 1.987 ms |
| Lighthouse CLS | 0,0119 | 0,0119 |
| LCP direto CDP, mediana de três | 836 ms | 1.000 ms |

O total inicial permanece 141,22 kB; a diferença do build é de um byte, sem acrescentar o motor interativo ao carregamento inicial. Lighthouse e CDP usam métodos distintos. As amostras CDP foram 1044/820/836 ms antes e 1012/912/1000 ms depois, com CPU 4×, latência 150 ms, download 200.000 B/s, cache desabilitado, viewport 390 × 844, DPR 2. As faixas se sobrepõem; a série direta oscilou para cima e não deve ser apresentada como melhora. São medições locais, não dados de usuários em produção. SEO permanece 69 pelo noindex de homologação, fora deste escopo.

Relatórios: [antes](antes.json), [depois](depois.json), [Lighthouse antes](antes-lighthouse.json), [Lighthouse depois](depois-lighthouse.json), [interações](interacoes.json), [revisão final](revisao-final.json).

Os testes verificaram viewport e overflow, ocultação e retorno dos controles, setas animadas, inércia após soltar, preservação da câmera nas seleções, WhatsApp, teclado, duplo clique/toque, pinça, roda sem sequestro da rolagem, Fullscreen API, saída por Esc e toque, fallback modal, restauração de foco e demonstração única. Axe: zero violações WCAG A/AA no palco normal e em tela cheia, nas duas larguras. Reduced-motion e Save-Data requisitam só um quadro estático. Sem JS, a imagem e o WhatsApp permanecem disponíveis.

O cache retém no máximo quatro quadros ao carregar alta, para limitar memória decodificada; a revisão final também verificou rotação com zoom, ausência de erros HTTP e ausência de carregamento de ambientes não selecionados. Chrome automatizado fecha ao terminar. O portal usado foi fechado; o servidor de preview é encerrado após a entrega.

## Limites preservados e integração

As demais combinações reutilizam os vídeos anteriores, com arcos menores e resolução inferior. A alta nativa e a órbita ampliada desta rodada foram priorizadas na cozinha rosada. Os acabamentos são apresentados no painel de superfície; o ambiente mantém a vista polida, explicitamente informada no painel.

A integração compacta já existe em `src/app/materiais/[slug]/page.tsx` e foi preservada. Não existe material confirmado no catálogo; `/materiais/pendente/` deliberadamente não monta o componente. Assim, a integração dessa rota foi inspecionada no código, sem afirmar teste interativo de uma página comercial que ainda não existe. Safari/iOS em aparelho físico não foi testado; há fallback para navegador sem Fullscreen API.

Não foram alterados home, textos do Astra, CSS global, header/footer, catálogo comercial, main ou workflow. Entrega para revisão e integração pelo Planejador, sem publicação.
