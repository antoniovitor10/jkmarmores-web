import { SiteLink as Link } from './SiteLink';
import { conteudo, telefoneUrl } from '@/content';
import { PendenteTexto } from './PendenteTexto';
import { Brand } from './Brand';

export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-grid">
    <div><Link href="/" className="brand"><Brand footer /></Link><p>JK Marmores e Granitos<br />Barueri, São Paulo</p></div>
    <nav aria-label="Navegação do rodapé"><p className="eyebrow">CONHEÇA A JK</p><Link href="/sobre/">A empresa</Link><Link href="/materiais/">Materiais</Link><Link href="/aplicacoes/">Aplicações</Link><Link href="/galeria/">Trabalhos</Link></nav>
    <div><p className="eyebrow">ENDEREÇO</p><address><PendenteTexto valor={conteudo.empresa.endereco} /></address><p>Antes de visitar, confirme o atendimento por telefone.</p></div>
    <div><p className="eyebrow">FALE COM A JK</p><a className="footer-phone" href={telefoneUrl}><PendenteTexto valor={conteudo.empresa.telefone} /></a><Link href="/contato/">Contato e orçamento</Link></div>
  </div><div className="container footer-bottom"><span>JK Marmores e Granitos</span><span>Imagens ilustrativas identificadas nas legendas.</span></div></footer>;
}
export function MobileQuoteDock() {
  return <div className="mobile-quote-dock"><a className="mobile-whatsapp" href="/contato/">Conversar sobre meu projeto</a></div>;
}
