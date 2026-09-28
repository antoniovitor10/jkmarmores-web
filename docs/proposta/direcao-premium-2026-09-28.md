# Direção premium — 28/09/2026

Base: merge normal de origin/main em redesign-astra, 86e2529. WIP 319feb6 preservado como referência, sem restaurar sua direção visual. Nenhuma geração paga. Configurador e sua integração pertencem à Orbita.

## Referências e linguagem

Consultados [Salvatori](https://www.salvatoriofficial.com), [Antolini](https://www.antolini.com), [Decolores](https://www.decolores.com.br), [The Quarry House](https://mfisher-apollonas.com), [Stone & Style](https://stonestyle.co.th) e [Lithos](https://www.lithosdesign.com), além das capturas fornecidas em referencias-premium. Leitura: materiais em grande escala, tipografia pouco pesada, margens que deixam a fotografia respirar. Capturas com cookies ou tela de carregamento não comprovam o movimento do site. Nenhum texto, composição ou asset foi copiado.

Tom editorial: a matéria e a luz ocupam o espaço que antes pertencia a blocos explicativos. Fundo papel quente, texto marrom profundo e preto restrito aos momentos de marca. Sem cartões decorativos, etiquetas, cores artificiais ou títulos em negrito.

## Tipografia — justificativa em três linhas

Bodoni Moda 400, instanciada em tamanho óptico 48, traz contraste entre hastes e filetes sem o peso compacto da Barlow.
Source Sans 3 400 mantém leitura clara em parágrafos curtos, navegação e controles, sem competir com a pedra.
As duas têm licença OFL e subsets latinos locais de 13.020 e 11.836 bytes; preload e fallbacks com métricas ajustadas pelo next/font/local.

Fontes: https://github.com/google/fonts/tree/main/ofl/bodonimoda e https://github.com/google/fonts/tree/main/ofl/sourcesans3. Licenças em public/fonts/OFL-BodoniModa.txt e OFL-SourceSans3.txt. Subsets U+0020–00FF, U+2000–206F e U+20AC, sem hinting, pesos fixos. Não há requisição a Google Fonts na navegação.

## Tokens compartilhados

Mantidos os nomes existentes --fonte-display-a1, --fonte-corpo-a1, --cor-* e --espaco-4/5. Acrescentados --fonte-titulo, --peso-titulo, --espaco-secao e --botao-fundo/texto/borda para a Orbita. Fundo #f4efe9, texto #2b2622, destaque #544c3f, superfície #e9e2d9, pedra #c9ab91. Títulos regulares, botão em tinta sobre papel, transições suaves sem troca animada de fundo.

## Evidências

Capturas e resultados ficam em docs/auditorias/direcao-premium/. As medições são emulação, não experiência medida em um aparelho físico. Baseline de cinco execuções anterior à mudança; Lighthouse simulate como referência. Preview reutilizado em http://127.0.0.1:3105/.

## Configuracao de build

A main trouxe tools/higgsfield, pacote independente com SDK proprio. O include amplo do tsconfig do site passou a compilar esses scripts e falhou por SDK ausente. Excluida apenas tools/higgsfield do TypeScript do frontend, sem instalar SDK no site e sem executar a ferramenta de geracao. experimental.inlineCss continua habilitado, sem alteracao nesta rodada.
