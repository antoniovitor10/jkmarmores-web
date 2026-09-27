# Etapa (e): prova rejeitada e parada de qualidade

Registro histórico da primeira abordagem. Após esta parada, o Planejador autorizou uma nova prova com movimento independente por quadro, somente imagem inicial. A nova produção e o custo atualizado serão registrados separadamente; este documento preserva a falha, não descreve o saldo final da rodada.

27/09/2026. Aplicação preservada no estado af34ba4, com capa em vídeo e refinamentos premium. Nenhum vídeo da sequência foi aplicado. A máscara PEDRA, seus textos, textura e comportamento, e as quatro imagens continuam iguais. Configurador permanece fora desta frente.

Plano cotado: três transições Kling 3.0 Standard de 5 s, 01→02, 02→03 e 03→04; US$ 0,231 cada, US$ 0,693 adicionais, total acumulado previsto US$ 1,371. Só o primeiro envio foi feito. Ele terminou com sucesso técnico, mas **falhou na qualidade**: a chapa se inclina sozinha, muda de forma e vira uma borda. A câmera não conecta duas peças rígidas como pedido. Isso viola o critério de pedra sem deformação e poderia sugerir um processo irreal.

Inspeção: quadros de 0 a 4,5 s a intervalos de 0,5 s em [jornada-video-1-quadros.jpg](capturas/jornada-video-1-quadros.jpg). Original em `assets/provas/jornada-video-1.mp4`, 1284 × 716, H.264, 24 fps, 5,041667 s, 2.604.655 bytes, sem áudio. Não está em `public/` nem é baixado pelo site.

Foi cumprida a regra de parar e avisar quando a qualidade não servir. Os trechos 02→03 e 03→04 **não foram enviados**; não houve tentativa adicional ou troca paga de modelo. As até três tentativas autorizadas especificamente para a capa não foram estendidas à sequência.

Acumulado **estimado** da API: **US$ 0,909**; restante do teto Astra de US$ 2,70: **US$ 1,791**. Saldo efetivo da conta e débito final continuam a conferir por Vitor. Prompts integrais, parâmetros, request_id e estimativa prévia: [sequencia-video-prova-api.json](sequencia-video-prova-api.json). Sem gasto MCP.

Próximo passo sujeito à decisão de Vitor: manter os quatro quadros aprovados ou autorizar uma nova estratégia, por exemplo dois movimentos independentes ligados por um corte editorial, evitando pedir ao modelo que conecte formas incompatíveis num plano contínuo. Nenhuma nova geração fica programada.

Evidências da sequência preservada em 390/1440: `capturas/sequencia-video-antes-*` (máscara, transição e etapas 01–04, rolagem reversa e fallbacks). O script de auditoria foi atualizado apenas para aceitar o WhatsApp confirmado, nomear as saídas e permitir testes de vídeo futuros; isso não altera o produto.
