---
id: ADR-0004
titulo: "Site com fundo branco (design system versão 2)"
status: aceita
data: 2026-10-31
origem: T-0012
substitui: ""
---

# ADR-0004 · Site com fundo branco (design system versão 2)

## Contexto

A versão 1 do site foi aprovada pela cliente em 07/10/2026 com o tema escuro: fundo grafite `#10100f`, texto claro e caramelo `#c9ab91`. Em 28/10/2026 a Juliana pediu para ver o site com fundo branco. A prévia foi feita na T-0009 e publicada em `/1` em 31/10. Ela manteve a composição, a tipografia, o movimento e as imagens, e trocou só as cores, com contraste conferido (acessibilidade 100 no Lighthouse).

No mesmo dia o Vitor pediu: "deixa o site em branco o principal".

## Decisão

O site principal passa a usar o tema branco da T-0009, que vira a versão 2 do design system:
- **Fundo:** branco puro.
- **Texto e links:** texto `#1f1b18`, caramelo escuro `#7a5c42` para links e eyebrow, títulos de destaque em `#6b4f38`.
- **Botão:** grafite com texto branco.
- **Rodapé:** continua grafite, com o logo original.
- **Logo do cabeçalho:** versão transparente.

A versão 1 escura fica registrada como histórico na skill `design-system`. A fonte não muda nesta decisão (a troca da Bodoni é a T-0011).

## Alternativas consideradas

| Opção | Prós | Contras |
|---|---|---|
| (a) Branco no site principal (escolhida) | pedido direto do Vitor depois de ver a prévia; mais leve; a pedra clara ganha contraste com o texto | perde o "pedra iluminada no escuro" da versão 1, que conversava com a logo preta |
| (b) Manter escuro e deixar o branco só em `/1` | mantém a versão que a cliente aprovou | o Vitor decidiu trocar |
| (c) Branco quente (`#f7f4f0`) em vez de puro | mais suave com o caramelo | o Vitor escolheu branco puro na T-0009 |

## Consequências

- Fica mais fácil: ler texto longo e nomes de pedra; as pedras escuras (Preto São Gabriel, Donatello) ganham destaque.
- Fica mais difícil: o caramelo claro da marca não serve mais para texto no branco. Ele fica só no rodapé, no botão flutuante do WhatsApp e em detalhes que não são texto.
- `/1` fica igual à raiz e pode ser reaproveitada para a próxima prévia.
- Mudou: a skill `design-system` (versão 2, tabela de tokens), o comentário do bloco T-0009 em `globals.css` e o teste `e2e/tema-claro.spec.ts`, que agora vale para homologação e produção.
