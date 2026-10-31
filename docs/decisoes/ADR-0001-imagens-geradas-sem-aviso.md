---
id: ADR-0001
titulo: "Imagens geradas sem aviso e referências da web só como entrada"
status: aceita
data: 2026-10-20
origem: HU-0001
substitui: ""
---

# ADR-0001 · Imagens geradas sem aviso e referências da web só como entrada

## Contexto

A cliente aprovou a versão 1 (07/10/2026) e pediu imagens profissionais dos materiais, com uma lista de cerca de 35 pedras (19/10). Ela não tem fotos boas das chapas. O site inteiro vai trocar de imagens: catálogo por pedra, capa, jornada e configurador, todas geradas por IA (Codex, agente Astra).

Até aqui o princípio 6 e a skill `imagens` exigiam aviso de imagem ilustrativa em legenda, rodapé e `alt` ("Imagem gerada por IA, não representa obra da JK"). O Vitor não quer avisos no site. Para a IA acertar o desenho de pedras com nome (Preto São Gabriel, Calacatta), ela precisa de fotos de referência, que só existem em sites de terceiros.

## Decisão

As imagens geradas entram sem nenhum aviso de IA ou de imagem ilustrativa, desde que não mostrem logo, nome de cliente nem obra identificada como da JK. Fotos de terceiros achadas na web servem só de entrada de cor e veio para a geração: não são publicadas e a imagem gerada não pode ser cópia próxima delas.

## Alternativas consideradas

| Opção | Prós | Contras |
|---|---|---|
| (a) Sem aviso (escolhida) | visual limpo, como as marmorarias costumam fazer | visitante pode ler a capa (ambiente aplicado) como obra da JK; risco de reclamação de que a pedra instalada não ficou como a foto |
| (b) Uma linha discreta no rodapé ("Imagens ilustrativas. Cada chapa é única; confira a amostra na JK.") | mantém o princípio 6 original com quase nenhum impacto visual | o Vitor não quer avisos |
| (c) Aviso só nos ambientes (capa, jornada, configurador) | pedras limpas, ambientes honestos | ainda aparece aviso |
| (d) Referências da web com URLs registradas | rastro de cada fonte | mais trabalho por imagem; o Vitor dispensou |

## Consequências

- Fica mais fácil: trocar as imagens sem texto de aviso no layout; gerar pedras parecidas com as reais.
- Fica mais difícil: provar a origem de uma imagem se alguém questionar (as URLs de referência não são guardadas). Continua obrigatório registrar modelo, prompt e arquivo de cada imagem gerada em `docs/proposta/assets-licencas.md`.
- Risco aceito pelo Vitor: imagem gerada sem aviso pode ser lida como foto real. Mitigação: a cliente revê as pedras depois de no ar, e pedra reprovada sai do catálogo até ter imagem nova (HU-0001).
- Mudou: princípio 6 em `metodo/projeto/principios.md`; seção "Ilustrativa x real" da skill `imagens`; seção de imagens da skill `design-system`.
