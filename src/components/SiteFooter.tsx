import { linkWhatsApp } from '@/lib/whatsapp';
import { SiteLink as Link } from './SiteLink';
import { conteudo, telefoneUrl } from '@/content';
import { PendenteTexto } from './PendenteTexto';
import { Brand } from './Brand';
import { institucional } from '@/content/institucional';
import { isPendente } from '@/content/pendente';

function pendingDescriptions(value: unknown): string[] {
  if (isPendente(value)) return [value.descricao];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(pendingDescriptions);
}
const pending = [...new Set(pendingDescriptions([conteudo, institucional]))];

export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-grid">
    <div><Link href="/" className="brand"><Brand footer /></Link><p>JK Marmores e Granitos<br />Barueri, São Paulo</p></div>
    <nav aria-label="Navegação do rodapé"><p className="eyebrow">CONHEÇA A JK</p><Link href="/sobre/">A empresa</Link><Link href="/materiais/">Materiais</Link><Link href="/aplicacoes/">Aplicações</Link><Link href="/galeria/">Trabalhos</Link></nav>
    <div><p className="eyebrow">ENDEREÇO</p><address><PendenteTexto valor={conteudo.empresa.endereco} /></address><p>Antes de visitar, confirme o atendimento por telefone.</p></div>
    <div><p className="eyebrow">FALE COM A JK</p><a className="footer-phone" href={telefoneUrl}><PendenteTexto valor={conteudo.empresa.telefone} /></a><a href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>WhatsApp e orçamento</a><Link href="/contato/">Todos os contatos</Link></div>
  </div><details id="informacoes-a-confirmar" className="container pending-summary"><summary>Informações a confirmar</summary><ul>{pending.map(description => <li key={description} data-pendente={description}>{description}</li>)}</ul></details><div className="container footer-bottom"><span>JK Marmores e Granitos</span><span>Imagens ilustrativas identificadas nas legendas.</span></div></footer>;
}
export function MobileQuoteDock() {
  return <div className="mobile-quote-dock"><a className="mobile-whatsapp" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Fale com a JK</a></div>;
}
