---
name: imagens
description: Como entram, são tratadas e publicadas as imagens e vídeos do site da JK Mármores - originais em assets/, derivados AVIF/WebP gerados em public/img pelo build, geração paga no Higgsfield com orçamento aprovado, licenças em assets-licencas.md e a fronteira entre imagem ilustrativa e foto real da JK. Use em qualquer task que troque, acrescente, gere ou trate imagem, vídeo, logo ou textura.
metadata:
  origem: projeto
  versao: "1"
  revisar_em: "2027-01-20"
---

# Imagens e vídeos · JK Mármores

## Regras

- **Original em `assets/images/`, derivado gerado.** `npm run images:build` (`scripts/build-images.mjs`, roda dentro do `npm run build`) lê cada `png/jpg/webp/avif` de `assets/images/`, aplica `scripts/editorial-image.mjs` e grava `public/img/<id>-<largura>.avif|webp` em 390, 768, 1200 e 1600 px (só larguras até a do original), mais o placeholder no manifesto `src/generated/images.json`. Nunca coloque imagem direto em `public/img/` nem edite o manifesto.
- **O id é o nome do arquivo sem extensão** (`assets/images/sequencia-02-borda.png` → `id="sequencia-02-borda"`). Recorte mobile é outro arquivo com sufixo `-mobile` e entra por `mobileId`. Originais históricos sem uso são pulados por uma lista no próprio script: ao aposentar uma imagem, acrescente o id ali em vez de apagar o original.
- **Usar no código** só por `<Foto>` (skill `padroes-codigo`), com `alt` descritivo e honesto. Imagem do LCP com `prioridade`; as outras com `loading="lazy"` (padrão).
- **Ilustrativa x real.** Imagem gerada por IA, de banco ou CC0 é ilustrativa: legenda ou aviso dizendo isso (`illustrationNotice` em `src/content/illustration.ts`, `avisoImagem` em `src/content/index.ts`) e `alt` sem afirmar que é obra, material ou processo da JK (princípio 6). Foto real da JK só com autorização registrada no `docs/insumos/INDICE.md` e, se possível, local, material e aplicação (pendência V3).
- **Licença antes de entrar.** Toda imagem de terceiro ou gerada ganha uma entrada em `docs/proposta/assets-licencas.md`: fonte, modelo, prompt, request ID, custo e arquivo.
- **Geração paga só com orçamento aprovado** (princípio 7). Antes de enviar: estimativa por asset (`POST /estimate/{modelo}` ou o equivalente do MCP), total com reserva de 20 % e o "sim" do Vitor com o teto. Registre o que foi gasto, mesmo quando a API não devolver o custo.
- **Peso.** A página inicial fica abaixo de 1 MB no primeiro carregamento no celular e o LCP abaixo de 2,0 s (princípio 10). Meça antes e depois de trocar a imagem da capa.

## Higgsfield

- Ferramenta local em `tools/higgsfield/` (pacote separado, SDK `@higgsfield/client`), fora do site. Exemplo: `npm run exemplo` dentro da pasta.
- A credencial fica em `tools/higgsfield/.env.local` (variável `HF_CREDENTIALS`), lida só por `node --env-file`. Esse arquivo está em `seguranca.arquivos_proibidos`: nunca abra, imprima ou copie.
- Prompts e parâmetros de cada rodada ficam em JSON em `docs/proposta/` (ex.: `quarta-prova-api.json`, `sequencia-clipes-api.json`). Siga o padrão: prompt completo, modelo, seed, proporção, resultado.
- Nunca envie a logo, fotos da cliente ou dados da empresa para a API sem autorização explícita.

## Vídeos

- Ficam em `public/video/` (originais de prova em `assets/provas/`). `scripts/editorial-videos.mjs` aplica o mesmo tratamento de cor com ffmpeg (variável `FFMPEG`), H.264, `+faststart`, sem áudio, versões desktop e mobile.
- Vídeo nunca é requisito para entender a página: o pôster equivalente vem antes e o vídeo não carrega com Save-Data, rede lenta ou movimento reduzido (`src/lib/motion-network.ts`, `src/lib/after-poster.ts`).

## Logo

- Original da cliente: `assets/brand/logo-jk-cliente-2026-09-26.jpg` (JPEG 1600×1200). Recorte em WebP sem redesenho no cabeçalho e rodapé (`scripts/prepare-brand.mjs`). O monograma SVG (`src/content/monogram.ts`, `scripts/build-monogram.mjs`) foi traçado à mão do JPEG e é provisório até chegar o vetor oficial (pendência V1).

## Armadilhas conhecidas

- O build reescreve `src/generated/images.json`; se a diferença for só fim de linha, desfaça antes do commit.
- Trocar uma imagem com outra proporção muda o `width/height` no manifesto e pode gerar CLS em layout com `aspect-ratio` fixo (`.editorial-image img` usa 4/5 ou 5/4). Confira as capturas nas 5 larguras.
- O saldo de créditos do MCP não é o saldo da API: são contas diferentes.

## Origem das regras

- `scripts/build-images.mjs`, `scripts/editorial-image.mjs`, `scripts/editorial-videos.mjs`, `src/components/Foto.tsx`, `tools/higgsfield/`
- `docs/proposta/assets-licencas.md`, `docs/PENDENCIAS.md` (V1, V3, V4, V6, V7), decisões de 25/09 e 26/09 em `docs/ESCOPO.md`
