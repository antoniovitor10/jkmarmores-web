# Princípios do projeto

<!-- Regras inegociáveis deste projeto. No máximo 15. Cada uma curta e verificável.
     O revisor de código, o revisor de segurança e a skill analisar-consistencia checam contra esta lista.
     Aprovados pelo Vitor no onboarding de 2026-10-20 (todos vieram do AGENTS.md e do docs/ESCOPO.md anteriores).
     Mudam só com decisão explícita do desenvolvedor (registre um ADR). -->

1. Nenhuma informação da empresa é inventada (nome, telefone, endereço, serviços, materiais, obras, fotos, depoimentos, números, anos, prêmios). O que falta usa `pendente("...")` de `src/content/pendente.ts` e entra em `docs/PENDENCIAS.md`.
2. Em produção (`SITE_MODE=producao`), nenhum marcador de pendência chega ao HTML publicado: `npm run check:pendencias` passa.
3. O conteúdo é indexável e útil sem JavaScript. 3D, vídeo e animação são camada extra, nunca dependência.
4. Não copiar texto, layout, fotos nem identidade das referências (attarevestimento.com, vgrmarmoresegranitos.com.br, sites premium em `docs/insumos/brutos/referencias-premium/`).
5. Nenhum emoji ou ícone decorativo em texto, código, commit ou copy. Exceção: o ícone do WhatsApp nos botões que abrem o WhatsApp, para o visitante reconhecer o canal (ADR-0002, Vitor em 22/10/2026).
6. Imagem de banco ou gerada por IA só entra com licença ou origem (modelo, prompt, arquivo) registrada em `docs/proposta/assets-licencas.md`. Imagem gerada pode entrar sem aviso, desde que não mostre logo, nome de cliente nem obra identificada como da JK. Fotos de terceiros achadas na web servem só de referência de cor e veio para a geração: nunca entram no site e a imagem gerada não pode ser cópia próxima delas (ADR-0001).
7. Geração paga (Higgsfield ou outra API) só com orçamento em créditos ou dólares aprovado pelo Vitor antes do envio.
8. Push em `main`, `producao` ou `versao-1/2/3`, rsync e SSH de produção só com aprovação explícita do Vitor: push nessas branches é deploy.
9. Nenhum host, porta, usuário, chave ou caminho do servidor no repositório (que é público). Isso fica só nos GitHub Secrets.
10. Metas no celular: LCP até 2,0 s, CLS até 0,05, INP até 150 ms e JS inicial até 150 KB gzip. Nenhuma task piora uma meta sem registro e aprovação.
11. Acessibilidade WCAG 2.2 AA, com Lighthouse mobile 100 em Acessibilidade e SEO.
