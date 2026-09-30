# Versão 1 — conteúdo real e jornada de luz

30/09/2026. Branch: versao-1. Homologação: https://jkmarmores.com.br/1/.
Código verificado: 095ab26029eac108d918f0283c5c67e3ac3ee345. Conteúdo e movimento entregues em b1f231c; ajuste da seleção de movimento por rede em 095ab26. Base 3f27ffa preservada na ancestralidade; origin/main integrada pelo merge 3bda333.

## Conteúdo e decisões

Fonte exclusiva dos novos fatos: jk-marmores-refs/cliente/textos-cliente-2026-09-28.txt, mensagens da cliente em 28/09. Os textos foram divididos e enxugados sem acrescentar informações.

- Fundação em 2010; projetos residenciais, comerciais e industriais; São Paulo, Grande São Paulo, ABC, interior, litoral norte e Baixada Santista.
- Assinatura institucional como frase de impacto na home e em Sobre Nós.
- Seis categorias na home, na página Materiais e em páginas próprias: mármores nacionais e importados, granitos, mármores dolomíticos, quartzitos naturais, quartzos e lâminas ultracompactas sinterizadas.
- Fonte tipada única em src/content/cliente.ts; foundingDate e areaServed no JSON-LD e dados confirmados no title e nas descrições. Canônicas, links, imagens e fontes preservam /1/.
- Serviços específicos, nomes comerciais de pedras, acabamentos, fotos reais, CEP, visita e horário continuam pendentes. As imagens reaproveitadas são ilustrativas por IA, com aviso global. Sem geração paga.

A direção escura foi mantida: grafite, pedra quente, Bodoni Moda leve e Source Sans 3. Corrigido o contraste do contato e retirada a chamada antiga para maquete 3D das páginas de materiais. O seletor usa imagens e botões simples.

## Movimento

A capa entra com luz rasante, aproximação sutil da imagem e título por linhas. Na rolagem, a mesma imagem se fecha dentro do monograma JK. A assinatura surge ao final do scrub, que responde diretamente ao gesto e mantém a posição quando a rolagem para.

A jornada ganhou cortes laterais nas imagens, parallax de profundidade e entrada sincronizada de título, índice e legenda. Os tempos foram ajustados para a faixa em que o texto está visível, com valores específicos para celular e desktop. A luz atravessa a entrada das seções. Botões e cartões ganham brilho no hover, foco e toque; no toque, a passagem termina depois de soltar o dedo.

GSAP/ScrollTrigger carregam após a imagem e as fontes. matchMedia reverte os efeitos quando reduced-motion é ativado. Save-Data e rede lenta usam a apresentação estática e desativam animações CSS. Não há vídeo ou canvas na versão. O conteúdo e os links continuam úteis sem JavaScript.

Na checagem pública, a estimativa inicial de downlink do Chrome (1,45–1,50 Mbps) desativava os efeitos apesar de transferências rápidas. A decisão passou a considerar a transferência observada: uma amostra rápida prevalece sobre a estimativa, enquanto Save-Data, 2g/3g e respostas efetivamente lentas continuam vetando o movimento. Oito cenários de política de rede foram verificados em rede.mjs/rede.json.

## Medições

Chrome headless 153, Lighthouse 13.5.0, servidor local gzip, cache frio, viewports 390 × 844 e 1440 × 900. Gestos mobile com emulação touch por CDP e CPU 4x. Não foi usado aparelho físico.

| Lighthouse mobile | Simulação Lantern | Limitação real via DevTools |
|---|---:|---:|
| Desempenho | 97 | 100 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| LCP | 2,63 s | 1,11 s |
| TBT | 16,00 ms | 80,38 ms |
| CLS | 0 | 0 |
| SEO | 66 | 66 |

A meta de LCP de 2 s foi atingida na medição direta e segue aberta na simulação Lantern (2,63 s). As metodologias não são equivalentes. SEO 66 decorre do noindex obrigatório da homologação. TBT é uma soma de bloqueios, não a duração de uma tarefa.

| CPU 4x, rolagem | Maior intervalo entre quadros | Maior tarefa | Maior Paint | Intervalos acima de 34 ms |
|---|---:|---:|---:|---:|
| 390 px, capa | 16,80 ms | 11,89 ms | 0,04 ms | 0 |
| 390 px, jornada | 25,20 ms | 9,54 ms | 1,64 ms | 0 |
| 1440 px, capa | 25,50 ms | 20,26 ms | 3,47 ms | 0 |
| 1440 px, jornada | 33,30 ms | 24,22 ms | 4,26 ms | 0 |

Na verificação funcional, a maior tarefa de entrada foi 132 ms; o maior evento observado foi 56 ms. No percurso de 20 páginas/viewports, a maior tarefa de entrada foi 141 ms. Nenhuma dessas tarefas excedeu a meta de 150 ms.

## Verificação

- Lint: zero erros, dois avisos históricos nos scripts configurador-r4-layout.mjs e configurador-r4-swap.mjs.
- Build estático em /1/ e check:pendencias: aprovados em modo homolog. As pendências reais seguem bloqueando o lançamento em produção.
- Axe WCAG 2 A/AA e 2.1 A/AA: zero violações em 20 combinações de página/viewport, incluindo as seis páginas de categoria.
- Menu: abre, prende o foco, fecha com Escape e devolve o foco. Seletor: combinações, carregamento da imagem, legenda e CTA contextual verificados.
- Toque real emulado: brilho ativo depois de soltar o dedo e limpo ao terminar. Formulário: mensagem correta, com abertura do WhatsApp interceptada; nenhuma mensagem enviada.
- Sem overflow, erros de JavaScript, imagens quebradas ou requisições fora de /1/. Um h1 por página e canônicas corretas.
- Sem JavaScript: seis categorias indexáveis e CTA funcional. Reduced-motion, troca de preferência com a página aberta, Save-Data e rede 3g verificados.

## Publicação

Deploy automático do código 095ab26 concluído com sucesso: [GitHub Actions](https://github.com/antoniovitor10/jkmarmores-web/actions/runs/36739959381). Dez navegações públicas sem cache em 390 e 1440 px retornaram HTTP 200, sem erros ou paths fora de /1/. Seis categorias e foundingDate 2010 presentes. O movimento está ativo na home pública nos dois viewports, inclusive com a estimativa inicial de rede de 1,50 Mbps. Evidência em publicado.json e publicado-home-390/1440.png.

## Evidências e reprodução

Capturas neste diretório: home, assinatura, jornada, cortes em 15/38/55%, monograma em 0/20/50/80/100%, seletor, contato e páginas institucionais em 390 e 1440 px. As capturas de páginas completas foram feitas após percorrer o conteúdo e carregar as imagens lazy.

Dados: funcional.json, movimento.json, conteudo-a11y.json e os dois pares Lighthouse/resumo. Scripts: medir.mjs, revisar-movimento.mjs e conteudo-a11y.mjs. Os traces brutos ficam na pasta temporária, fora do Git. O preview usa PREVIEW_BASE_PATH=/1 e PORT=3111. Os scripts usam as dependências de auditoria já existentes no cache npm local.

Próximo passo: revisão visual pelo Vitor e pela cliente, fotos reais e confirmação das pendências comerciais. Para a meta estrita de LCP simulado, continuar o trabalho sobre carregamento inicial e custo do runtime Next, preservando a tipografia e os efeitos já verificados.
