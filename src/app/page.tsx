import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo, telefoneUrl } from '@/content';
import { institucional } from '@/content/institucional';
import { Configurador } from '@/components/configurador/Configurador';
import { HomeHero } from '@/components/HomeHero';
import { StoneJourney } from '@/components/StoneJourney';
import { ContactPanel, Illustration, RequestSteps, SectionHeading } from '@/components/Institutional';
import { PendenteTexto } from '@/components/PendenteTexto';
import { SiteLink } from '@/components/SiteLink';
import { metadataPagina } from '@/lib/site';

export const metadata = metadataPagina(conteudo.paginas.inicio.seo, '/');
export default function Inicio() {
  return <main id="conteudo" className="home-page">
    <HomeHero />
    <section className="container section-space company-introduction">
      <SectionHeading number="01" label="A EMPRESA" title="Uma conversa próxima. Uma escolha bem pensada." />
      <div><p className="lead">{institucional.apresentacao}</p><p>Da primeira referência aos detalhes da peça, entender o que você precisa é o ponto de partida para o contato.</p><SiteLink className="text-link" href="/sobre/">Conheça a JK</SiteLink></div>
    </section>
    <StoneJourney />
    <section id="materiais" className="section-space warm-section"><div className="container">
      <SectionHeading number="02" label="MATERIAIS E APLICAÇÕES" title="Encontre o ponto de partida para a sua escolha." />
      <div className="material-editorial"><Illustration id="sequencia-03-acabamento" /><div className="material-criteria">{institucional.materiais.map((item, i) => <article key={item.titulo}><span>0{i+1}</span><div><h3>{item.titulo}</h3><p>{item.texto}</p></div></article>)}<SiteLink className="text-link" href="/materiais/">O que considerar ao escolher</SiteLink></div></div>
      <div className="availability-note"><p>Materiais e serviços: consulte a JK sobre disponibilidade e possibilidades para sua peça.</p><p><PendenteTexto valor={institucional.catalogo} /></p><p><PendenteTexto valor={institucional.oferta} /></p><SiteLink href="/aplicacoes/">Orientações por aplicação</SiteLink></div>
    </div></section>
    <section id="configurador" className="container section-space"><div className="split-heading"><SectionHeading number="03" label="EXPLORE EM 3D" title="Veja como a escolha muda o ambiente." /><p>Compare composições, materiais e acabamentos em uma maquete ilustrativa. As amostras são de demonstração e não representam o catálogo da JK.</p></div><Configurador /></section>
    <section id="orcamento" className="section-space warm-section"><div className="container"><SectionHeading number="04" label="PRIMEIRO CONTATO" title="Uma ideia já é um começo." /><RequestSteps /><div className="actions"><a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Pedir orçamento pelo WhatsApp</a><a href={telefoneUrl}>Ligar para a JK</a></div></div></section>
    <section id="trabalhos" className="container section-space portfolio-empty"><p className="eyebrow">05 / TRABALHOS DA JK</p><h2>Cada obra tem<br />sua própria história.</h2><div><p>As fotos dos trabalhos da JK estarão aqui em breve, com os detalhes de cada projeto.</p><p className="editorial-note"><PendenteTexto valor={institucional.obras} /></p><SiteLink className="text-link" href="/galeria/">Acompanhe a galeria</SiteLink></div></section>
    <ContactPanel />
  </main>;
}
