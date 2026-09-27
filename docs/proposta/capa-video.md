# Capa em vídeo pela rolagem — entrega (b)

27/09/2026. Base: e215a56. Worktree `jk-marmores-redesign`, branch `redesign-astra`. Sem publicação. Configurador reservado à Orbita; nenhum arquivo ou linha de integração de SceneSlot alterado.

## Resultado e referência

Vídeo Kling 3.0 de 8,04 s, plano aberto até detalhe da mesma bancada rosada e caramelo. H1 e CTAs permanecem no HTML inicial e saem ao começar a aproximação. Rolagem nativa, sticky, avanço e retorno por `currentTime`; pausa acessível e link para continuar. A máscara PEDRA vem imediatamente depois da capa; seus componentes, CSS, textura, textos e comportamento não foram alterados. A apresentação institucional foi deslocada para depois da jornada, preservando seu conteúdo.

Referência: documento, quadros locais e URL https://www.youtube.com/watch?v=mp2oUmMorPY&t=2s fornecidos por Vitor. Leitura de quadros e linguagem de câmera; não se afirma reprodução do vídeo completo nem se reutilizam textos, layout ou identidade Aurora.

Quadros revisados de 0 a 7,5 s a intervalos de 0,5 s: aproximação contínua e claramente distinta entre início, meio e fim; quina e veios coerentes, sem salto ou derretimento perceptível nessa inspeção. Sem pessoas, logos ou texto. O fim é um recorte do próprio plano aberto, garantindo a mesma peça. Não é obra, material comercial ou serviço confirmado da JK.

## Custo e arquivos

Acumulado estimado da API: **US$ 0,678** (US$ 0,293 da prova anterior, US$ 0,015 da nova imagem e US$ 0,370 do vídeo). Teto desta frente: US$ 2,70; restante estimado US$ 2,022. Uma tentativa de edição Qwen falhou por indisponibilidade do modelo, sem arquivo; política oficial de cobrança exclui falhas. A API não retornou débito efetivo; Vitor autorizou continuar por estimativas e verificará a cobrança no portal. Nenhum crédito MCP consumido nesta rodada.

Prompts integrais, parâmetros, request IDs, estimativas e inspeção técnica: [capa-video-api.json](capa-video-api.json). Termos e registro consolidado: [assets-licencas.md](assets-licencas.md).

| Arquivo | Bytes | Codec |
|---|---:|---|
| capa-desktop-av1.mp4 | 1.634.784 | AV1 |
| capa-desktop-h264.mp4 | 1.630.324 | H.264 |
| capa-mobile-av1.mp4 | 1.251.439 | AV1 |
| capa-mobile-h264.mp4 | 1.040.978 | H.264 |

Todos 1280 × 720, 24 fps, sem áudio, faststart e GOP 8 (intervalo máximo medido 0,333334 s). Mobile faz recorte por `object-fit` a 65%, preservando a quina. Pôster extraído do primeiro quadro, AVIF/WebP responsivos; versão vertical derivada sem geração. Vídeo solicitado somente depois de load, decode/pintura do pôster e primeira rolagem. Nenhum bloqueio ou atraso artificial da hidratação. Reduced-motion, Save-Data e conexão 2g/3g mantêm apenas pôster. Falha de mídia mantém pôster e navegação.

## Validação

`lint`, `build` e `check:pendencias` passaram no modo de homologação vigente. Pendências reais e noindex permanecem. `check-cover.mjs`: nenhum vídeo inicial; avanço e retorno em 390/1440, pausa com rolagem livre, reduced-motion/Save-Data sem download. `check-home.mjs`: sem/com JavaScript, menu por teclado, WhatsApp, ordem de foco, imagem prioritária, sem overflow ou erros.

O servidor de preview ganhou MIME e HTTP Range/206/416 para reproduzir corretamente o seek; nenhuma configuração de deploy foi alterada. `experimental.inlineCss: true` **já estava habilitado e foi mantido**: entrega CSS no HTML e elimina a requisição bloqueante, com custo de duplicação no HTML/RSC e menor reaproveitamento entre páginas. Fontes locais com swap e size-adjust; preload apenas Instrument Serif. Não há defer-hydration nem reescrita do HTML.

Contraste: painel grafite com opacidade 88% limita o fundo mesmo sobre um quadro branco; valores e mínimo conservador documentados na auditoria. Botões e legendas usam fundos sólidos. Capturas `capturas/capa-video-{390,1440}-{00,1,2,3,4}.png`; pares antes/depois em `capa-scrub-antes-*` e `capa-video-depois-*`; home integral em `capa-video-home-*-inteira.png` (modo estático acessível para mostrar todas as seções). Preview: http://127.0.0.1:3105/.

Medições de laboratório em emulação, cache frio, servidor local com gzip; não são dados de campo nem INP real. Lighthouse simulate é a referência. Resultados consolidados na auditoria `2026-09-27-capa-video.md`.
