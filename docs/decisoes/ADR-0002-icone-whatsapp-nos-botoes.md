---
id: ADR-0002
titulo: "Ícone do WhatsApp nos botões que abrem o WhatsApp"
status: aceita
data: 2026-10-22
origem: T-0008
substitui: ""
---

# ADR-0002 · Ícone do WhatsApp nos botões que abrem o WhatsApp

## Contexto

Depois da publicação da HU-0001 (22/10/2026), o Vitor achou os links do site fracos: "Chamar no WhatsApp" e os links de navegação são texto de 14 px sem sublinhado, que não parece clicável. Na correção (T-0008), ele pediu o ícone do WhatsApp no botão de cada cartão de pedra. O princípio 5 proibia "emoji ou ícone decorativo em texto, código, commit ou copy", sem separar ícone decorativo de ícone que identifica o canal.

## Decisão

O ícone do WhatsApp pode aparecer nos botões que abrem o WhatsApp, para o visitante reconhecer o canal num relance. Continua proibido qualquer outro ícone decorativo e qualquer emoji. O ícone é um SVG inline monocromático (`currentColor`), com `aria-hidden="true"`: o nome acessível continua sendo o texto do botão.

## Alternativas consideradas

| Opção | Prós | Contras |
|---|---|---|
| (a) Atualizar o princípio 5 com a exceção (escolhida) | regra clara para as próximas telas | abre uma exceção que precisa ficar restrita ao WhatsApp |
| (b) Exceção só na T-0008 | regra intacta | o próximo botão de WhatsApp volta a discutir o mesmo ponto |
| (c) Sem ícone | regra intacta | o Vitor quer o reconhecimento imediato do canal |

## Consequências

- Mudou: princípio 5 em `metodo/projeto/principios.md`.
- O ícone não entra em texto corrido, commit, copy de cliente nem em outros botões; a revisão de código confere isso.
