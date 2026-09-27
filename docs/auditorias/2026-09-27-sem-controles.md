# Remoção dos controles de movimento — 27/09/2026

Base: 6b17f18abf8459341d84a5798db271b9f3c5ba50, integrada por git fetch origin e git merge --ff-only origin/main na redesign-astra, com worktree inicialmente limpa.

Removidos: barra da capa (Role para descobrir, Pausar movimento, Continuar pela pedra), links Ver imagens sem movimento e Pular para combinações sobre PEDRA, estado de pausa manual, estado staticView, listeners e CSS exclusivos. Pausa automática fora da tela/aba continua. A legenda Imagem ilustrativa, gerada por IA permanece: 9px, menor preenchimento e posição próxima à borda, livre do botão móvel.

Nada alterado na composição, textura, textos ou fórmulas da máscara PEDRA, nos quatro quadros, no tempo de reprodução, no configurador integrado ou no skip link geral. Reduced-motion, Save-Data e fallback sem JavaScript preservados. Nenhuma geração ou mudança de configuração/deploy.

Validação: npm run lint; SITE_MODE=homolog npm run build (inclui check:pendencias); scripts/check-short-motion.mjs (gestos e fallbacks); scripts/check-light-conversion.mjs (ausência dos controles, legenda livre, teclado e axe), com AUDIT_LABEL=sem-controles. Capturas390/1440 e JSON dessa rodada usam prefixo sem-controles. Preview3105 mantido; navegadores de teste encerrados em finally.

A rodada de fluidez baseada na auditoria do Pulso ainda não foi iniciada.
