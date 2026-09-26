# Linha de base local da home

Medição em 25/09/2026, em `SITE_MODE=homolog`, com Lighthouse 13.5.0 no modo mobile padrão e limitação simulada de rede e CPU. URL: `http://localhost:3002/`, servida de `out/` após `npm run build`. O relatório bruto está em `2026-09-25-lighthouse-home-mobile.json`.

| Medida | Resultado | Meta do escopo |
|---|---:|---:|
| Performance | 100 | 90+ |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 69 | 100 no lançamento |
| LCP | 1,6 s | até 2,0 s |
| FCP | 1,0 s | — |
| TBT | 40 ms | — |
| CLS | 0 | até 0,05 |
| Transferência total | 505 KiB | até 1 MiB sem 3D |
| Scripts iniciais | 138.195 bytes gzip | até 90 KiB gzip |

O único teste de SEO reprovado foi a indexabilidade. Isso é esperado em homologação: todas as páginas levam `noindex, nofollow` e `robots.txt` bloqueia o rastreamento. O teste de Boas Práticas não apontou falhas.

O JavaScript inicial ainda supera a meta. A cifra gzip foi calculada sobre os sete arquivos de script requisitados pelo Lighthouse. Um ensaio com Webpack gerou 176.050 bytes gzip nos scripts iniciais; o build padrão com Turbopack foi mantido. A cena 3D fica em chunk separado e não foi requisitada no carregamento inicial medido.

Esta é uma linha de base técnica com conteúdo e imagens pendentes, em servidor local sem compressão HTTP. Não substitui a medição em Android intermediário e iPhone reais nem fornece INP de campo. O comando Lighthouse escreveu o relatório, mas encerrou com erro `EPERM` ao remover o perfil temporário do Chrome no Windows; os resultados do arquivo foram lidos e validados.
