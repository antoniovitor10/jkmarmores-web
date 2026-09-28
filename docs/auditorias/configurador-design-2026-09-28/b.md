# Item 4 — gaveta móvel e coluna desktop

- Gaveta única no celular: amostras circulares e CTA "Pedir orçamento desta pedra" sempre visíveis; ambiente, acabamento e detalhe ficam nos ajustes, abertos por toque ou puxada.
- No desktop, controles em coluna de 320 px fora da imagem. HUD mínimo sempre visível; sem temporizador para esconder controles.
- Celular sem setas, botões de zoom, índice da vista ou reenquadramento. Alternativas de teclado mantidas; gaveta fechada usa inert para não receber foco.
- Arrasto com inércia de 220 ms/expo-out termina em quadro inteiro; pinça ancorada, pan e duplo toque 1 ↔ 1,6 em 320 ms. Medidas da imagem ficam fora do callback de cada quadro.
- Dica de gesto de 1,2 s, uma vez por navegador, com proteção contra indisponibilidade de localStorage. Sem giro automático na entrada.
- Fontes e cores vêm das variáveis globais; durações/easings seguem os tokens aprovados com fallback enquanto o Astra os integra.
- [Antes 390](b-antes-390.png), [depois 390](b-depois-390.png), [gaveta](b-gaveta-390.png), [antes 1440](b-antes-1440.png), [depois 1440](b-depois-1440.png). Giro, zoom e tela cheia nas capturas b-giro-*, b-zoom-* e b-tela-cheia-*.
- Gestos nativos em Chromium emulado: giro, pinça, duplo toque e gaveta passaram; troca preservou ângulo e zoom. CPU 4x: maior Event Timing móvel 88 ms; maior long task observada durante as interações 77 ms. Não é validação em aparelho físico.
- Fullscreen API passou em 390/1440; fallback sem API ocupa 844/844 px, Escape sai, devolve foco e restaura rolagem. Nenhum erro JS observado.
- Lighthouse acessibilidade 100 nos três snapshots (390 recolhido/aberto e 1440); Axe sem violações. Reduced-motion e Save-Data baixaram somente o quadro inicial.
- Lint/build/check:pendencias passaram. JS inicial continua 8 arquivos/142.299 B gzip, igual ao item (a); nenhuma biblioteca adicionada. API: US$ 0,00.
- Limites: a rota de material disponível é apenas o placeholder "pendente", sem configurador; a tentativa de testá-la encerrou esse trecho do roteiro por ausência do componente. Não se inventou material para montar a página.
- Integração pendente do Astra: esconder o dock global dentro da seção; nas capturas fora de tela cheia ele ainda sobrepõe o rodapé. A remoção do aviso duplicado vem no item (c).
