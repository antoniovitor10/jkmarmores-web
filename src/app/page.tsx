import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { institucional } from '@/content/institucional';
import { Configurador } from '@/components/configurador/Configurador';
import { MaterialGallery } from '@/components/MaterialGallery';
import { SiteLink } from '@/components/SiteLink';
import { cliente } from '@/content/cliente';
import { PendenteTexto } from '@/components/PendenteTexto';
import { HomeHero } from '@/components/HomeHero';
import { StoneJourney } from '@/components/StoneJourney';
import { SectionHeading } from '@/components/Institutional';
import { metadataPagina } from '@/lib/site';

export const metadata = metadataPagina(conteudo.paginas.inicio.seo, '/');
export default function Inicio() {
  return <main id="conteudo" className="home-page">
    <HomeHero />
    <section className="container section-space home-about"><h2>Precisão,<br />desde 2010.</h2><div><p className="lead">{cliente.sobre[0]}</p><p>{cliente.regiao}</p><SiteLink className="text-link" href="/sobre/">Sobre a JK</SiteLink></div></section>
    <StoneJourney />
    <MaterialGallery />
    <section id="configurador" className="container section-space"><div className="split-heading"><SectionHeading title="Veja a pedra no ambiente." /><p>Escolha um ambiente e um tom. Uma referência visual para o espaço que você imagina.</p></div><Configurador /></section>
    <section className="container signature-section section-space"><p>{cliente.assinatura}</p></section>
    <section id="orcamento" className="section-space editorial-motion home-contact"><div className="container home-contact-grid">
      <div><h2>{institucional.contatoHome.titulo}</h2><p>{institucional.contatoHome.texto}</p><a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a></div>
      <div className="contact-address"><p>JK Mármores e Granitos</p><address><PendenteTexto valor={conteudo.empresa.endereco} /></address><p>Antes de visitar, confirme o atendimento com a JK.</p></div>
    </div></section>
  </main>;
}
