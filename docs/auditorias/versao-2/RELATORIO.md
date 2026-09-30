# Versão 2: galeria clara

Base conferida: versao-2, 3f27ffae1f1f55c0f8929656179153145a9f8aa6, worktree limpa. Destino autorizado: https://jkmarmores.com.br/2/ (homologação, noindex).

## Direção e decisões

Papel quente #f4efe9, marrom-grafite, Bodoni Moda 400 e Source Sans 3. Referências consultadas: revisão de 28/09, sistema de movimento e prioridades; capturas de Salvatori, Decolores, Antolini e Quarry House; tutorial Aurora e logo recebida. A direção clara e a tipografia do papel atual prevalecem sobre a proposta histórica de Barlow/preto.

Entrada das linhas do título a partir de estado visível, assentamento da imagem e enquadramento pela rolagem. Monograma com textura da logo e corte para a jornada. Quatro imagens editoriais com revelação em clip-path e scrub contínuo; rolagem nativa, sem vídeo, sem espera de seek e sem 3D. Cada etapa tem cerca de 91 svh de percurso. GSAP e ScrollTrigger entram após decode da capa e fontes. matchMedia reverte os movimentos ao mudar a preferência; rede lenta e Save-Data entregam os quatro quadros estáticos.

Seletor simples, escolhas sempre visíveis, decode antes da troca e crossfade de 240 ms; mensagem do WhatsApp acompanha a combinação. Contato contextual também no desktop. Orientações de pedido reaproveitadas de src/content/institucional.ts; não afirmam etapas de execução da JK. Nenhum dado comercial novo, geração paga ou alteração de deploy.

## Verificação da primeira entrega

Lint: passa, com dois avisos preexistentes em tools/higgsfield. Build completo com NEXT_PUBLIC_BASE_PATH=/2 e check:pendencias: passam em homolog. Pendências comerciais continuam registradas e bloqueiam produção. HTML, fontes, imagens, links e chunks prefixados em /2 nos cenários verificados, sem 404 ou erro JS.

Lighthouse 13.5, mobile 390 x 844, simulação de rede e CPU 4x, servidor local gzip, cache frio: Performance 98, Acessibilidade 100, Boas práticas 100; LCP 2409 ms, CLS 0, TBT 61 ms. SEO 66 pelo noindex intencional da homologação. Relatório JSON integral e resumo anexos.

QA Chrome com CPU 4x: 390 e 1440 px, normal/reduced-motion/Save-Data/3G/sem JS, menu e Escape, quatro etapas em ordem, toque no seletor, mensagem de orçamento e prefixos. Todos passaram. Eventos medidos até 64 ms. Entrada registrou uma tarefa de 165 ms no móvel normal e 229 ms em 3G: meta de 150 ms ainda não atingida. LCP observado local não equivale à simulação Lighthouse nem a dados de campo. CLS acumulado do roteiro desktop após saltos programáticos foi 0,498; investigar contenção e rolagem antes de afirmar estabilidade durante toda a visita.

Capturas reais de 390 e 1440 px nesta pasta; qa.cjs reproduz cenários e fecha o Chrome em finally. Portal reaproveitado não capturou por estar minimizado. Imagens ilustrativas globais, logo vetorial provisória, catálogo, fotos reais e teste em telefone físico seguem pendentes. Próximo refinamento: reduzir trabalho inicial e investigar CLS do roteiro desktop.

## Refinamento publicado após a primeira entrega

A preparação da jornada agora começa a até uma tela de distância, sempre após a capa, para que a troca de estrutura aconteça fora do viewport. Confirmada a causa do CLS de 0,498: ativação tardia deslocava a mídia e o monograma enquanto estavam visíveis. O roteiro completo final registrou CLS 0 em 390 e 1440 px, também em reduced-motion, Save-Data e 3G. Quadros estáticos fora da tela usam content-visibility; quadros ativos mantêm dimensões e cálculo normal.

Medições finais: Lighthouse mobile Performance 97, Acessibilidade 100, Boas práticas 100, SEO 66 (noindex); LCP 2408 ms, CLS 0, TBT 69 ms. Duas execuções Lighthouse registradas, sem pretensão de substituir cinco execuções ou teste de campo. Entrada móvel normal com CPU 4x: tarefa máxima 142 ms. Reduced-motion 189 ms, Save-Data 157 ms, 3G 162 ms; meta de 150 ms não atingida em todos os modos. Trace diagnóstico local apontou EvaluateScript do runtime inicial Next como principal tarefa; não foi introduzido atraso de hidratação nem reescrita de HTML para esconder o custo.

Eventos de toque e teclado finais: máximo 72 ms entre todos os cenários. Sem requests de vídeo, sem erros JavaScript/HTTP, quatro etapas em ordem, seletor e mensagem corretos. A varredura de todos os HTML exportados encontrou zero src, href ou srcset absolutos sem /2/. Contraste e foco revisados conforme Web Interface Guidelines (https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). API e limpeza de movimento conferidas com a documentação oficial GSAP (https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/).

O primeiro deploy bf6a752 terminou com sucesso e /2/ respondeu HTTP 200. Capturas e qa.json desta pasta foram atualizados para o refinamento. Próximos passos: comparação visual da cliente, teste em telefone físico, otimização adicional do LCP/runtime e chegada de fotos reais/vetor oficial. Nenhuma alteração de main, workflow, .htaccess, secrets ou servidor.
