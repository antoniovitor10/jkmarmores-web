# Item 6 — aviso único no configurador

- O palco e o fallback sem JavaScript mostram apenas: "Materiais e acabamentos a confirmar com a JK."
- Removidos o aviso de IA repetido e a ressalva repetida no anúncio de estado; canvas, noscript e detalhe continuam com descrição alternativa ilustrativa.
- Frase de confirmação com 13 px e cores globais; CTA do fallback alinhado ao palco: "Pedir orçamento desta pedra".
- O aviso global de IA e a ocultação do dock são responsabilidade do Astra; nenhum arquivo da home, fonte global ou workflow foi alterado.
- [Antes 390](c-antes-390.png), [depois 390](c-depois-390.png), [antes 1440](c-antes-1440.png), [depois 1440](c-depois-1440.png).
- Lighthouse A11y 100 em 390 recolhido/aberto e 1440; Axe zero violações nas duas larguras. Fallback de tela cheia e Escape revalidados, com retorno do foco e rolagem restaurada.
- Comparação da rodada inteira: cinco perfis novos por versão, Chromium móvel 390 × 844, CPU 4x, latência 150 ms e download 200 KiB/s. LCP mediano 588 → 580 ms; os cinco ensaios finais ficaram entre 568 e 604 ms.
- Zero quadros do configurador solicitados na entrada da home em todos os ensaios. JS inicial 142.298 → 142.297 B gzip (8 arquivos; variação de 1 B sem aumento funcional).
- Limite não atingido: long tasks iniciais da home chegaram a 209 ms (base: 168 ms), acima de 150 ms. Dados brutos em base-perf.json e final-perf.json. Não confundir com os eventos de gesto/toque do item (b), cujo máximo foi 88 ms.
- Lint, build, check:pendencias e git diff --check passaram. O verificador usa a configuração de homologação existente, que ainda registra pendências comerciais do projeto.
- Custo total de API desta rodada: US$ 0,00. Somente recorte/redimensionamento do acervo pago no item (a); fontes 720p continuam limitando detalhe óptico das pedras secundárias.
- Para integração: retirar o dock global desta seção antes da revisão final móvel; nas capturas ele ainda cobre parte da frase. O componente não altera esse elemento global.
