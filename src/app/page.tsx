import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { institucional } from '@/content/institucional';
import { OrbitRoom } from '@/components/configurador/OrbitRoom';
import { PendenteTexto } from '@/components/PendenteTexto';
import { HomeHero } from '@/components/HomeHero';
import { StoneJourney } from '@/components/StoneJourney';
import { SectionHeading } from '@/components/Institutional';
import { metadataPagina } from '@/lib/site';

export const metadata = metadataPagina(conteudo.paginas.inicio.seo, '/');
export default function Inicio() {
  return <main id="conteudo" className="home-page">
    <HomeHero />
    <StoneJourney />
    <section id="configurador" className="container section-space"><div className="split-heading"><SectionHeading title="A pedra, no seu olhar." /><p>Troque o tom. Gire o ambiente. Explore uma referência para o espaço que você imagina.</p></div><OrbitRoom /></section>
    <section id="orcamento" className="section-space editorial-motion home-contact"><div className="container home-contact-grid">
      <div><h2>{institucional.contatoHome.titulo}</h2><p>{institucional.contatoHome.texto}</p><a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a></div>
      <div className="contact-address"><p>JK Mármores e Granitos</p><address><PendenteTexto valor={conteudo.empresa.endereco} /></address><p>Antes de visitar, confirme o atendimento com a JK.</p></div>
    </div></section>
  </main>;
}
