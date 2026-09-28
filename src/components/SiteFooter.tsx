import { linkWhatsApp } from '@/lib/whatsapp';
import { SiteLink as Link } from './SiteLink';
import { conteudo, telefoneUrl } from '@/content';
import { PendenteTexto } from './PendenteTexto';
import { Brand } from './Brand';
import { institucional } from '@/content/institucional';
import { isPendente } from '@/content/pendente';
import { illustrationNotice } from '@/content/illustration';

function pendingDescriptions(value: unknown): string[] {
  if (isPendente(value)) return [value.descricao];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(pendingDescriptions);
}
const pending = [...new Set(pendingDescriptions([conteudo, institucional]))];

export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-grid">
    <div><Link href="/" className="brand"><Brand footer /></Link><p>JK Marmores e Granitos<br />Barueri, São Paulo</p></div>
    <nav aria-label="Navegação do rodapé"><h2>A empresa</h2><Link href="/sobre/">A empresa</Link><Link href="/materiais/">Materiais</Link><Link href="/aplicacoes/">Aplicações</Link><Link href="/galeria/">Galeria</Link></nav>
    <div><h2>Em Barueri</h2><address><PendenteTexto valor={conteudo.empresa.endereco} /></address><p>Antes de visitar, confirme o atendimento por telefone.</p></div>
    <div><h2>Contato</h2><a className="footer-phone" href={telefoneUrl}><PendenteTexto valor={conteudo.empresa.telefone} /></a><a href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a><Link href="/contato/">Todos os contatos</Link></div>
  </div><div hidden>{pending.map(description => <span key={description} data-pendente={description} />)}</div><div className="container footer-bottom"><span>JK Marmores e Granitos</span><span>{illustrationNotice}</span></div></footer>;
}
export function MobileQuoteDock() {
  return <div className="mobile-quote-dock" data-visible="false" inert><a className="mobile-whatsapp" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a></div>;
}
