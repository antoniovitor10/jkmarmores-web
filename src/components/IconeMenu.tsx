// Ícones funcionais do menu do celular (princípio 5, T-0013): três linhas para abrir e × para fechar.
// Sempre ao lado do texto "Menu" ou "Fechar"; monocromáticos (currentColor) e fora do nome acessível.
export function IconeMenu({ aberto = false }: { aberto?: boolean }) {
  return <svg className="icone-menu" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    {aberto
      ? <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none" />
      : <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none" />}
  </svg>;
}
