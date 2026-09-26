# Tarefa 03 - Prisma (Engenheiro 3D): conceito, assets e protótipo

Leia antes: `AGENTS.md`, `docs/ESCOPO.md` (seções 4 e 5), `docs/tarefas/00-regras-da-fase-local.md`.

Decisão do Vitor: são **duas experiências com um motor só**.

- **Configurador de ambiente**, na home: cozinha ou lavatório com bancada onde o visitante troca o material (4 a 6 opções) e o acabamento (2 ou 3), e pede orçamento daquela combinação pelo WhatsApp.
- **Explorador de chapa**, em cada página de material: a amostra em close, com luz rasante, para ver veio, borda e acabamento.

## Entregas

1. **Conceito:** `docs/proposta/3d.md`.
   - Conceito das duas experiências, com o objetivo comercial de cada uma.
   - Stack escolhida com justificativa em bytes (three.js puro ou R3F, e o que entra no bundle).
   - Pipeline de assets: gltf-transform, compressão com Draco ou meshopt, texturas KTX2/Basis com alternativa WebP.
   - Orçamento de performance: meta de até 250 KB gzip de JS da cena e primeiro frame em até 2,5 s num celular intermediário em 4G.
   - Matriz de fallback: sem WebGL, perda de contexto, aparelho fraco (deviceMemory, hardwareConcurrency, teste de FPS), `prefers-reduced-motion`, Safari/iOS.
   - Controles por teclado com rótulos e equivalente em HTML.
   - Como a escolha vira mensagem de WhatsApp.
   - Como o poster estático é gerado e mantido equivalente à cena.
2. **Assets provisórios:** texturas CC0 de mármore, granito e quartzito (ambientCG, Poly Haven ou similar), mais o modelo do ambiente, que pode ser procedural ou CC0.
   - Registre fonte, URL, licença e data em `docs/proposta/assets-licencas.md`.
   - Peça à Bussola a entrada correspondente em `docs/PENDENCIAS.md` ("Assets provisórios").
   - Nada deve parecer trabalho da JK: tudo é provisório até chegarem as chapas reais.
3. **Protótipo** em `src/components/stone-scene/` e `public/3d/`, **depois** que o Cinzel publicar a base e o componente de encaixe.
   - Combine a interface com ele (`maestri ask "Cinzel" ...`): props, eventos, lista de materiais vinda de `src/content`.
   - Até a base ficar pronta, trabalhe no conceito e nos assets.
4. **Medição:** documente em `docs/proposta/3d.md` os bytes transferidos, o tempo até o primeiro frame e o FPS.
   - Medir no Chrome com throttling de CPU 4x e rede 4G lenta.
   - Medir também com WebGL desativado, para confirmar o fallback.

## Regras

- A cena nunca bloqueia rolagem, foco ou navegação e nunca é o LCP.
- Não entra JS de 3D no carregamento inicial de nenhuma página.
- Sem animação automática contínua quando houver `prefers-reduced-motion`.
