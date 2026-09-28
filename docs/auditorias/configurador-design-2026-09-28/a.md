# Item 8 — troca de material

- Base: main 9cb4e709a37595fd7c0369ecd9f005ccc620dce3, incorporada por fast-forward; branch configurador-imersivo.
- 672 arquivos AVIF derivados exclusivamente dos quadros dos vídeos já pagos: qualidade 64, variantes 720, 1280, 2560 e retrato 720 × 1558 iguais para todas as combinações. Custo de API: US$ 0,00.
- Limitação do acervo: só a cozinha rosada tem fonte 4K; as outras cinco têm fonte 1280 × 720. Redimensionamento uniformiza entrega/compressão, mas não recupera detalhe óptico ausente. Não houve geração nova.
- Rosado, Bege e Escuro são nomes ilustrativos padronizados; confirmação comercial permanece pendente com a JK.
- A vista atual de cada pedra é decodificada em baixa prioridade, somente com o palco visível; não há pré-carga das outras combinações na entrada da home. Reduced-motion e Save-Data mantêm imagem estática.
- A troca aguarda img.decode(), preserva o quadro anterior e faz crossfade de 240 ms com os tokens aprovados; anel na amostra após 150 ms de espera.
- Teste com resposta da pedra bege bloqueada: quadro rosado preservado, anel visível; ao liberar, troca concluída e anel removido. Evidências: a-interacoes.json e a-carregando-390.png.
- Capturas: [antes 390](a-antes-390-bege.png), [depois 390](a-depois-390-bege.png), [antes 1440](a-antes-1440-bege.png), [depois 1440](a-depois-1440-bege.png).
- Axe WCAG no componente: zero violações em 390 e 1440 px, antes/depois. Isso não equivale a uma auditoria manual completa.
- Cinco perfis Chromium novos, CPU 4x, latência 150 ms, download 200 KiB/s: LCP mediano 588 → 580 ms; zero recursos do configurador antes da aproximação da seção nos dez ensaios.
- Long tasks da home no início: máximo 168 → 213 ms, com variação entre execuções. Meta de 150 ms não comprovada; sem recursos do configurador nesse trecho. Event Timing da troca não registrou eventos acima do limiar de 16 ms, sem inferir latência zero.
- Lint, build e check:pendencias passaram. Relatórios antigos de fluidez foram movidos de src para docs/auditorias/configurador-fluidez-2026-09-27.
- Próximo: gaveta móvel única e coluna desktop; remoção do aviso de IA duplicado em commit próprio. O CTA global da home ainda sobrepõe o rodapé móvel nesta base e pertence ao Astra.
