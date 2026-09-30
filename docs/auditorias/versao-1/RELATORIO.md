# Versão 1: pedra e luz sobre grafite

Este relatório registra a primeira entrega e seu refinamento. Estado mais recente e pausa: [PAUSA-2026-09-30.md](PAUSA-2026-09-30.md). As medições Lighthouse abaixo antecedem a nova máscara da capa.

Base conferida: worktree jk-v1, branch versao-1, árvore limpa em 3f27ffa. Implementação publicada pelo push 7fe3c64. Nenhuma alteração em main, workflows, .htaccess, secrets ou configuração de produção.

## Direção e implementação

Grafite #10100f, pedra rosada/caramelo e Bodoni Moda 400 com Source Sans 3 400. Capa de imagem grande com passagem curta de luz, títulos sempre visíveis, assinatura JK recortada do arquivo oficial recebido e quatro imagens editoriais com parallax proporcional à rolagem. GSAP/ScrollTrigger importados depois do pôster e das fontes, com matchMedia, cleanup e rolagem nativa. Sem vídeo, canvas, 3D ou geração paga.

Seletor com dois ambientes e três tons, botões sempre visíveis, troca após decode e WhatsApp contextual. São referências ilustrativas; nenhum material, serviço ou obra da JK foi inventado. Aviso global no rodapé e indicação no seletor. Pendências comerciais continuam em src/content e docs/PENDENCIAS.md; homolog permanece noindex.

Páginas internas compartilham os mesmos tokens escuros. Menu móvel com Escape, foco e inert; WhatsApp contextual compacto também no desktop. No seletor, o botão flutuante permanece disponível até o CTA local entrar na tela, evitando um trecho sem acesso ao contato. asset() prefixa imagens e SiteLink prefixa navegação. Canonical corrigido para /1/. Preview local aceita PREVIEW_BASE_PATH.

Referências lidas: revisão, prioridades, sistema de movimento de 28/09, tutorial Astra e imagens, logo da cliente, capturas premium e históricos e411a07, 9cb4e70, d218f7d. Consultados [Antolini](https://www.antolini.com/en/), [Salvatori](https://www.salvatoriofficial.com/en/eu/), [Decolores](https://decolores.com.br/) e [Quarry House](https://mfisher-apollonas.com/); Stone & Style indisponível na consulta, estudado pela captura. Critérios de interface: [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). A referência de movimento foi adaptada para imagens em fluxo contínuo: nenhum pin longo, espera por vídeo ou dupla exposição de camadas.

## Validação

- npm run lint: zero erros; dois warnings preexistentes em tools/higgsfield.
- NEXT_PUBLIC_BASE_PATH=/1 SITE_MODE=homolog npm run build e npm run check:pendencias: exit 0. Pendências seguem registradas, conforme o modo homolog; isso não autoriza lançamento indexável.
- Lighthouse mobile com throttling DevTools, CPU 4x, servidor local gzip e cache frio: Performance 98, A11y 100, boas práticas 100, SEO 66 (noindex obrigatório), LCP 1,61 s, CLS 0, TBT 157 ms, 239.480 bytes. Arquivos 2026-09-30-final-depois-*.
- Teste funcional independente com CPU 4x: maior tarefa longa 69 ms, maior Event Timing 40 ms. Estes dados são de laboratório; não são INP de campo nem validação em telefone físico. Conexão 4g/10 Mbps declarada no teste para verificar as animações de forma determinística.
- Zero erros de JS, imagens quebradas, overflow ou requisições sem /1/. Home em 390 e 1440 px; sobre, materiais, contato, galeria e aplicações em 390 px. Um H1 por página e canonical com prefixo.
- Menu abre/fecha por Escape; seleção testada e mensagem WhatsApp preserva ambiente/tom sem enviar mensagem. Movimento reduzido e Save-Data/3g não montam GSAP; HTML sem JavaScript preserva título, quatro quadros, imagem de referência e CTA.
- Capturas home, jornada e seletor em 390/1440 px nesta pasta. medir.mjs e funcional.json permitem reproduzir a verificação. Porta de preview 3111.

## Limitações e próximo passo

A primeira medição simulada marcou LCP 2,64 s (Performance 97). A animação de escala saiu da imagem crítica; somente a luz de entrada permanece. Medição DevTools acima usa método diferente, portanto não é uma comparação direta de melhoria. Medição simulada final: Performance 96, A11y 100, boas práticas 100, LCP 2,64 s, CLS 0 e TBT 73,5 ms. A meta de LCP até 2,0 s ainda não foi atingida no método simulado, embora tenha passado no throttling DevTools. Ambos os resultados estão preservados; não se declara uma meta universal atingida.

Logo vetorial, fotos reais, catálogo, serviços, história e detalhes de atendimento continuam pendentes. Cliente compara as versões; depois, o Planejador pode ajustar a escolhida. Nenhuma proposta ilustrativa deve virar catálogo comercial sem confirmação. O portal Maestri não conseguiu capturar tela por estar minimizado; as capturas foram feitas em Chrome headless. Portal encerrado e todas as instâncias headless encerradas em finally. Deploy 7fe3c64 confirmado por Actions success e HTTP 200 em https://jkmarmores.com.br/1/, com novo seletor e noindex.
