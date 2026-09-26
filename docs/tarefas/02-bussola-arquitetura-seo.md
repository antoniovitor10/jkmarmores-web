# Tarefa 02 - Bussola (Estrategista de Conteúdo e SEO): arquitetura, SEO local e conteúdo

Leia antes: `AGENTS.md`, `docs/ESCOPO.md`, `docs/PENDENCIAS.md`, `docs/tarefas/00-regras-da-fase-local.md`, `docs/referencias/comparativo.md`, `docs/referencias/dominio-e-presenca-atual.md`.

Contexto: a JK é provavelmente de Barueri/SP. Isso ainda é **pista**, não dado confirmado: pode orientar a pesquisa, mas não entra no texto do site sem `pendente()`. Tom de voz: técnico e acolhedor, trata por você, explica material, acabamento e cuidados em linguagem simples, sem superlativos vazios e sem clichês de marmoraria.

## Entregas

1. **Concorrentes locais:** `docs/referencias/concorrentes-barueri.md`.
   - Pesquise "marmoraria Barueri", "marmoraria Alphaville", "bancada de granito Barueri" e variações.
   - Registre quem aparece no pacote do Maps e nos 5 primeiros orgânicos: domínio, title, H1, páginas por material ou aplicação, uso de cidade, nota e número de avaliações no Maps.
   - Conclua onde há espaço para a JK.
   - Não copie textos.
2. **Arquitetura:** `docs/proposta/arquitetura.md`.
   - Mapa final de páginas e URLs.
   - Seções de cada página, na ordem e com a função de cada uma.
   - Caminho até o orçamento a partir de cada página.
   - Links internos, cruzando material com aplicação.
   - O que cada página precisa, no mínimo, para existir sem ficar rasa.
   - Quais páginas ficam de fora até ter conteúdo real.
3. **SEO local:** `docs/proposta/seo-local.md`.
   - Palavras-chave por página, com intenção de busca.
   - Modelos de title e meta description.
   - Modelo de JSON-LD (LocalBusiness ou HomeAndConstructionBusiness, BreadcrumbList).
   - Estratégia de menção à cidade e à região sem repetição forçada.
   - Checklist do Perfil da Empresa no Google para o lançamento: NAP igual ao do site, categoria, link do site trocando o Facebook por jkmarmores.com.br.
   - Regiões vizinhas só como hipótese a confirmar.
4. **Conteúdo tipado:** `src/content/*.ts`, depois que o Cinzel publicar os tipos (combine com ele via `maestri ask "Cinzel" ...`).
   - Textos de todas as páginas do esqueleto.
   - Todo dado da empresa sai de `pendente()`, inclusive o que é pista.
   - Conteúdo educativo sobre tipos de pedra, acabamentos e cuidados pode ser escrito se for tecnicamente correto e genérico, sem afirmar nada sobre a JK. Cada tipo de material fica marcado como pendente de confirmação, porque só aparece o que a JK confirmar.
5. **`docs/PENDENCIAS.md`:** você é a dona do arquivo. Mantenha organizado e acrescente o que surgir, inclusive o que Cinzel e Prisma pedirem (por exemplo, o registro de licença de imagens e texturas provisórias em uma seção "Assets provisórios").
6. **Mensagem ao cliente:** se a pesquisa gerar uma pergunta nova para o Lucas, proponha no resumo final. Não edite `docs/mensagem-lucas.md`.

## Verificação

- Toda afirmação sobre concorrentes com URL de evidência.
- `grep` no `src/content` para confirmar que nenhum telefone, endereço, cidade ou nome aparece fora de `pendente()`.
- Depois que o Cinzel integrar o conteúdo, confira as páginas no dev server.
