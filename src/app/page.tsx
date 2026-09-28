import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { institucional } from '@/content/institucional';
import { Configurador } from '@/components/configurador/Configurador';
import { HomeHero } from '@/components/HomeHero';
import { StoneJourney } from '@/components/StoneJourney';
import { Illustration, SectionHeading, RequestSteps } from '@/components/Institutional';
import { PendenteTexto } from '@/components/PendenteTexto';
import { metadataPagina } from '@/lib/site';
import { SiteLink } from '@/components/SiteLink';

export const metadata = metadataPagina(conteudo.paginas.inicio.seo, '/');
export default function Inicio() {
  return <main id="conteudo" className="home-page">
    <HomeHero />
    <StoneJourney />
    <section id="configurador" className="container section-space"><div className="split-heading"><SectionHeading number="03" label="EXPLORE EM 3D" title="Veja como a escolha muda o ambiente." /><p>Compare composições, materiais e acabamentos em uma maquete ilustrativa. As amostras são de demonstração e não representam o catálogo da JK.</p></div><Configurador /></section>
    <section className="request-story"><div className="container"><h2>Como pedir orçamento</h2><RequestSteps /><div className="actions"><SiteLink href="/materiais/">Materiais</SiteLink><SiteLink href="/aplicacoes/">Aplicações</SiteLink></div></div></section>
    <section id="orcamento" className="section-space editorial-motion home-contact"><div className="container home-contact-grid">
      <Illustration id="material-detalhe-quente" alt="Detalhe ilustrativo de pedra rosada, com veios caramelo e borda em meia-esquadria." />
      <div><h2>{institucional.contatoHome.titulo}</h2><p>{institucional.contatoHome.texto}</p><address><PendenteTexto valor={conteudo.empresa.endereco} /></address><a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a></div>
    </div></section>
  </main>;
}
