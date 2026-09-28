# WIP pausado por Vitor — 28/09/2026

Vitor não aprovou a direção visual de B (Barlow/paleta) e C (capa/imagens). A rodada foi pausada antes de concluir D. Não retomar D ou iniciar E sem a nova direção visual e as referências reais do Planejador. Este WIP não é uma entrega para publicação.

## Estado seguro

- Código ativo preservado exatamente na entrega C, e411a07c9e6c1b35d04413e033c48ce0316d294b, que já estava compilando. Isso não significa aprovação visual de C.
- O início do prólogo já tinha ocorrido antes de chegar o pedido de pausa. A integração incompleta foi retirada da aplicação mediante aplicação inversa do patch aqui preservado, sem reset, descarte ou mudança de branch.
- `prologo-incompleto.zip` guarda os 53 arquivos do trabalho parcial, com caminhos originais: sete arquivos alterados, quatro fontes novas, SVG provisório, imagem derivada e 40 quadros AVIF. `manifesto-sha256.json` registra e verifica cada conteúdo.
- `prologo-incompleto.patch` guarda a diferença dos sete arquivos rastreados em relação a C. Não aplicar automaticamente: a nova direção pode substituir essa solução.
- Cópia de trabalho do material retirado também permanece em `.maestri/wip-pausa-2026-09-28/`, fora do build.
- Capturas `docs/auditorias/revisao-design/d-antes-*` registram C antes do início do prólogo; não representam D pronto.
- Nenhuma implementação da entrega E foi iniciada. Configurador, main, workflow e produção intactos. Preview 3105 preservado.

## Material parcial, sem aprovação

O SVG é uma vetorização manual PROVISÓRIA do JK do JPEG da cliente, ainda sem revisão visual, a substituir pelo vetor oficial (V1 continua parcial). Não é uma marca nova nem um vetor oficial. O recorte WebP da própria marca serve de preenchimento nessa prova.

Os 40 AVIF derivam do vídeo da capa já pago (`public/video/capa-close.mp4`, origem Kling registrada em assets-licencas.md); a imagem da etapa 01 vem do quadro 17 desse recorte. Não houve geração, envio à API ou custo adicional. O pool de quadros e o SVG não chegaram a ser integrados ao controlador de rolagem. Não declarar o prólogo implementado ou aprovado, nem reutilizar o teste da capa como teste desse protótipo.

Próximo passo exclusivo: aguardar as novas referências e a orientação do Planejador. Métricas de C permanecem em C-RELATORIO.md; não repetir auditoria de desempenho para este arquivamento sem mudança no código ativo.

Fechamento seguro: `npm run lint` e `npm run build` passaram, incluindo `check:pendencias` em `SITE_MODE=homolog`. As pendências de cliente continuam abertas. Preview em `http://127.0.0.1:3105/`, processo 69876 preservado. Nenhuma geração paga ou publicação.
