> **Substituída pela tarefa 05 (`05-astra-redesign.md`) em 26/09/2026.** Mantida só como histórico.

# Tarefa 04 - Astra: experiência 3D (com Higgsfield via MCP)

Decisão do Vitor (26/09/2026): o Astra assume **só a parte 3D**, usando o Higgsfield via MCP para gerar imagens. O Prisma (Codex) sai do 3D.

Leia antes: `AGENTS.md`, `docs/ESCOPO.md` (seções 4 e 5), `docs/proposta/3d.md` (conceito, orçamento e medições atuais) e `docs/proposta/assets-licencas.md`.

## O que já existe e funciona (não quebrar)

- Motor em three.js puro, geometria procedural, carregado só depois do conteúdo por import dinâmico. Hoje: 136 KB gzip de JS da cena e primeiro frame em 1,43 s na emulação.
- `src/components/SceneSlot.tsx` controla quando carregar, o poster, o fallback e o WhatsApp. É do Dev Frontend: **não altere** sem combinar com o Planejador.
- Contrato em `src/lib/stone.ts`. Pode ser **estendido**, não quebrado:

```ts
type StoneSceneProps = {
  mode: "ambiente" | "chapa";
  materialSlug?: string;
  materials: Material[];
  onSelectionChange: (selection: StoneSelection) => void;
  onQuoteRequest: (selection: StoneSelection) => void;
};
type StoneSelection = { materialSlug: string; acabamento: string; ambiente: string };
```

- O componente é o `export default` de `src/components/stone-scene/StoneScene.tsx`.

## Seu território

- Pode editar: `src/components/stone-scene/`, `public/3d/`, a seção de 3D de `docs/proposta/3d.md` e `docs/proposta/assets-licencas.md`.
- Para mudar qualquer outro arquivo, peça antes ao Planejador.

## Objetivo

Deixar as duas experiências visualmente à altura do site e com propósito comercial:

1. **Configurador de ambiente** (home): cozinha ou lavatório, trocando o material da bancada (4 a 6 opções) e o acabamento (2 ou 3), com o botão de orçamento daquela combinação.
2. **Explorador de chapa** (página de material): a amostra em close, com luz rasante, veio, borda e acabamento.

## Uso do Higgsfield

- **Serve para:**
  - texturas de pedra seamless (mármore, granito, quartzito) e mapas de relevo e rugosidade derivados delas;
  - imagens de referência de iluminação e composição;
  - posters estáticos equivalentes à cena.
- **Não serve para:**
  - representar obra, ambiente ou material da JK;
  - dar nome comercial real a uma pedra (ex.: "Preto São Gabriel") sem a confirmação da JK em `docs/PENDENCIAS.md` (O2).
- **Registro obrigatório:** tudo que for gerado entra em `assets-licencas.md` com ferramenta, modelo, prompt, data, arquivo de saída e a nota "provisório, gerado por IA". Confira os termos de uso comercial do plano do Higgsfield e anote no mesmo registro.
- **Troca futura:** quando chegarem as fotos das chapas reais (V4), elas substituem as texturas geradas. Mantenha o pipeline de textura fácil de trocar.

## Limites que continuam valendo

- **Carregamento:** nada de 3D no carregamento inicial. A cena nunca é o LCP, nunca bloqueia rolagem, foco nem navegação.
- **Orçamento de tamanho e tempo:**
  - JS da cena: até 250 KB gzip.
  - Textura inicial: até 300 KB (WebP ou KTX2).
  - Poster: até 80 KB.
  - Primeiro frame: até 2,5 s num celular intermediário em 4G.
- **Fallback:** mantenha o que já existe para WebGL ausente, perda de contexto, FPS baixo, `prefers-reduced-motion`, aparelho fraco e Safari/iOS. O poster tem que continuar equivalente à cena.
- **Acessibilidade:** controles por teclado, com rótulo, e o equivalente em HTML.
- **Sem emojis** em código, texto ou commit.

## Git e deploy (importante)

- O repositório `antoniovitor10/jkmarmores-web` é **público**, e **todo push na `main` publica em https://jkmarmores.com.br**.
- Trabalhe na branch `3d-astra`. Não faça push na `main` nem merge. O Planejador revisa e faz o merge.
- Não versione chaves, tokens ou dados de conta do Higgsfield.

## Antes de entregar

- `npm run lint` e `npm run build` sem erro.
- `npm run measure:bundle`: o JS inicial da home não pode crescer, porque a cena fica em chunk separado.
- Atualize a tabela de medições em `docs/proposta/3d.md`: bytes da cena, textura, poster, primeiro frame com CPU 4x e rede 4G lenta, e o resultado com WebGL desativado.
- Resumo curto: o que mudou, o que foi gerado no Higgsfield, as medições e o que ficou pendente.
