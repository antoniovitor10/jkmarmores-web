import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { institucional } from '@/content/institucional';
import { cliente } from '@/content/cliente';
import { Configurador } from '@/components/configurador/Configurador';
import { HomeHero } from '@/components/HomeHero';
import { StoneJourney } from '@/components/StoneJourney';
import { RequestSteps, SectionHeading } from '@/components/Institutional';
import { SiteLink } from '@/components/SiteLink';
import { metadataPagina } from '@/lib/site';

export const metadata = metadataPagina(conteudo.paginas.inicio.seo, '/');
export default function Inicio() {
  return <main id="conteudo" className="home-page">
    <HomeHero />
    <section className="container section-space company-introduction home-about"><SectionHeading title="Onde a matéria-prima encontra a precisão." /><div><p>{cliente.sobre.abertura}</p><p>{cliente.sobre.atendimento}</p><SiteLink className="text-link" href="/sobre/">Sobre a JK</SiteLink></div></section>
    <StoneJourney />
    <section className="home-materials section-space"><div className="container"><div className="split-heading"><SectionHeading title={cliente.materiais.titulo} /><p>{cliente.materiais.introducao}</p></div><ul className="home-material-list">{cliente.materiais.categorias.map(item => <li key={item.slug}><h3><SiteLink href={`/materiais/${item.slug}/`}>{item.nome}</SiteLink></h3><p>{item.resumo}</p></li>)}</ul><SiteLink className="text-link" href="/materiais/">Conheça todos os materiais</SiteLink></div></section>
    <section id="configurador" className="container section-space"><div className="split-heading"><SectionHeading title="Veja a pedra no ambiente." /><p>Escolha um ambiente e um tom de pedra para encontrar uma referência para o seu espaço.</p></div><Configurador /></section>
    <section className="home-request section-space"><div className="container"><SectionHeading title="Um começo para o seu projeto." /><RequestSteps /><div className="home-paths"><SiteLink href="/materiais/">Sobre a escolha dos materiais</SiteLink><SiteLink href="/contato/">Prepare seu pedido de orçamento</SiteLink></div></div></section>
    <section id="orcamento" className="section-space editorial-motion home-contact"><div className="container home-contact-grid">
      <h2>{institucional.contatoHome.titulo}</h2><div><p>{institucional.contatoHome.texto}</p><a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a></div>
    </div></section>
  </main>;
}
