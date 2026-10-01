# Versão 3, rodada 2: cinema pela rolagem
Atualização de 01/10/2026: as capturas e `funcional.json` foram refeitos após a correção de rede e da galeria. O texto abaixo registra a implementação de 30/09; as decisões sobre pin e Save-Data foram substituídas pelo [relatório de correção](../2026-10-01-galeria/RELATORIO.md).

30/09/2026. Implementação auditada: `2dca9f8`. Branch `versao-3`, https://jkmarmores.com.br/3/.
A main foi incorporada por merge normal em `7ab31e4`, trazendo os documentos da cliente. Esta rodada substitui a interação anterior.

## O que mudou
- Removidos o visualizador de 24 vistas, o arraste, os botões de giro e o código correspondente.
- Capa com imagem em scrub, aproximação discreta e abertura vertical que revela a máscara JK. Sem vídeo ou espera por buffering.
- Jornada com quatro imagens em scrub e cortes verticais. A última etapa libera a rolagem diretamente para os materiais.
- Galeria horizontal das seis categorias, conduzida pela rolagem com ScrollTrigger. O pin usa transform para evitar o deslocamento de layout observado com position:fixed. Sem setas, snap ou interceptação de roda/toque.
- Seletor simples: dois ambientes, três tons, imagem grande. A troca só acontece depois da decodificação; a imagem anterior permanece durante carregamento ou erro. Fade de 360 ms, desligado com reduced-motion/Save-Data.
- Source Sans 3 regular, papel mineral e grafite quente. Uma linguagem compartilhada pela home, Sobre Nós, Materiais, categorias e Contato.
- Nenhum controle flutuante adicional ao WhatsApp. O aviso de imagens ilustrativas continua legível, inclusive junto ao dock no celular.

## Conteúdo real
Fonte única tipada em `src/content/cliente.ts`, transcrita de `jk-marmores-refs/cliente/textos-cliente-2026-09-28.txt`.
Sobre Nós contém os quatro parágrafos institucionais, atendimento residencial/comercial/industrial, região atendida e assinatura. Desde 2010 aparece também na home.
Materiais apresenta as seis descrições completas da cliente; cada categoria tem URL própria. Os textos substituem somente as pendências correspondentes.
Title, description e JSON-LD incorporam os dados recebidos: `foundingDate:2010` e seis entradas de `areaServed`.
Continuam pendentes serviços específicos, nomes comerciais, acabamentos, fotos reais, CEP, horário e demais dados não confirmados. As imagens ilustrativas não identificam chapas comerciais da JK. Nenhuma geração paga.

## Movimento e adaptação
Em 390 × 844, a capa percorre 60 svh, a jornada 125 svh e a galeria aproximadamente 165 svh (1.393 px) além do viewport fixado. O gesto vertical é nativo.
Se o conteúdo não couber na altura disponível, a galeria mantém leitura vertical completa. Isso foi verificado em 320 × 740 e 1024 × 768; em 390 × 740, 390 × 844, 768 × 1024 e 1440 × 900 o trecho horizontal cabe integralmente.
Teclado percorre todas as categorias e sincroniza a rolagem. `overflow:clip` impede o scroll horizontal implícito do navegador durante o foco.
GSAP é importado depois da apresentação do pôster. A montagem das seções é distribuída entre frames. `gsap.matchMedia` acompanha tamanho e reduced-motion.
Sem JavaScript, reduced-motion, Save-Data e 3g: leitura estática, seis categorias, imagens e WhatsApp. Nenhum vídeo é criado ou solicitado.

## Verificação
Lint e build com `NEXT_PUBLIC_BASE_PATH=/3` passaram, incluindo `check:pendencias` em homologação. Lint: zero erros e três avisos preexistentes. A publicação de produção continua condicionada aos dados pendentes.
Dez páginas passaram no Lighthouse de acessibilidade com 100: home, Sobre Nós, Materiais, Contato e as seis categorias.
Capturas de 390 e 1440 px documentam capa, JK, quatro etapas, galeria, seletor, contato e páginas internas. Sem overflow ou recurso próprio fora de /3/.
As seis combinações do seletor funcionaram em celular e desktop. Também passaram erro de imagem com nova tentativa, escolhas rápidas, foco/fechamento do menu e navegação por teclado na galeria.
Toque vertical sobre o seletor rola normalmente. Um gesto real via CDP ultrapassou o fim do pin da galeria e continuou a página.
Sem erros JS/HTTP. Todos os navegadores iniciados foram encerrados por finally; nenhum portal foi aberto.

## Medições
Chrome headless 153, Lighthouse 13.5, servidor local gzip, cache frio. São medidas de laboratório, sem dados de campo.

| Medição mobile | Throttling DevTools, CPU 4x | Modelo simulate, CPU 4x |
|---|---:|---:|
| Desempenho | 98 | 98 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 69 | 69 |
| LCP | 1,031 s | 2,360 s |
| CLS | 0 | 0 |
| TBT | 175,2 ms | 17 ms |

SEO 69 resulta do noindex intencional da homologação.
A instrumentação funcional com CPU 4x registrou CLS zero durante todo o percurso. Maior evento de interação: 32 ms em celular e desktop. JS inicial: 138.639 bytes gzip, oito arquivos; GSAP permanece em chunk posterior.
No scrub contínuo com CPU 4x, P95 dos intervalos entre frames foi até 13 ms no celular e 13,2 ms no desktop. Nenhuma tarefa acima de 50 ms apareceu nesses trechos. Ver `fluidez.json`; os valores dependem do ambiente headless e não equivalem a medição em aparelho físico.

## Limites registrados
A meta de LCP de 2 s foi atendida no ensaio DevTools, mas o modelo simulate ficou 360 ms acima. A meta de tarefa máxima de 150 ms na entrada não foi inteiramente atendida: a última instrumentação funcional móvel marcou 156 ms; o Lighthouse DevTools identificou tarefas de 236,7 ms e 225,2 ms, incluindo a inicialização do runtime React. Desktop funcional: 176 ms. Os arquivos completos preservam esses resultados.
A entrada continua sendo o ponto a otimizar; os trechos em scrub e as escolhas verificadas permanecem responsivos. A aprovação visual da cliente e as fotos reais continuam sendo o próximo portão comercial.

## Evidências
- `funcional.json`: percurso, categorias, combinações, fallbacks, URLs e dados estruturados.
- `edge.json`: seis tamanhos, teclado, erro/nova tentativa, escolhas rápidas e menu.
- `fluidez.json`: frames sob CPU 4x e saída do pin por toque.
- `acessibilidade-paginas.json`: dez páginas com 100 e conferência desktop.
- `*-final-devtools-depois-*.json` e `*-final-simulate-depois-*.json`: Lighthouse final completo e resumos.
- PNGs de 390 e 1440 px neste diretório.
Deploy do commit de implementação confirmado em [GitHub Actions](https://github.com/antoniovitor10/jkmarmores-web/actions/runs/36737730634); URL publicada respondeu HTTP 200 com conteúdo novo e sem `orbit-view`.
