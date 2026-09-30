import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { institucional } from '@/content/institucional';
import { cliente } from '@/content/cliente';
import { MaterialCollection } from '@/components/MaterialCollection';
import { StoneSelector } from '@/components/configurador/StoneSelector';
import { HomeHero } from '@/components/HomeHero';
import { StoneEditorial } from '@/components/StoneEditorial';
import { RequestSteps, ContactPanel } from '@/components/Institutional';
import { SiteLink } from '@/components/SiteLink';
import { metadataPagina } from '@/lib/site';

export const metadata = metadataPagina(conteudo.paginas.inicio.seo, '/');
export default function Inicio() {
  return <main id="conteudo" className="home-page">
    <HomeHero />
    <StoneEditorial />
    <section className="container section-space home-materials light-transition"><span className="section-light" aria-hidden="true" /><div className="split-heading"><h2>{cliente.materiaisTitulo}.</h2><p>{cliente.materiaisIntro}</p></div><MaterialCollection /><SiteLink className="text-link" href="/materiais/">Explorar todos os materiais</SiteLink></section>
    <section id="configurador" className="container section-space"><div className="split-heading"><h2>Uma escolha.<br />Outro ambiente.</h2><p>Compare tons em ambientes ilustrativos. Encontre uma referência e converse com a JK sobre as possibilidades para seu espaço.</p></div><StoneSelector /></section>
    <section className="container section-space request-story"><h2>Conte o que você imagina.</h2><RequestSteps /><div className="actions"><SiteLink href="/materiais/">Conheça os materiais</SiteLink><SiteLink href="/sobre/">Conheça a JK</SiteLink></div></section>
    <section id="orcamento" className="section-space editorial-motion home-contact"><div className="container home-contact-grid">
      <div><h2>{institucional.contatoHome.titulo}</h2><p>{institucional.contatoHome.texto}</p><a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a></div>
    </div></section>
    <ContactPanel />
  </main>;
}
