import { conteudo, telefoneUrl } from '@/content';
import { cliente } from '@/content/cliente';
import { ContactPanel, Illustration, PageIntro, SectionHeading } from '@/components/Institutional';
import { SiteLink } from '@/components/SiteLink';
import { metadataPagina } from '@/lib/site';
export const metadata = metadataPagina(conteudo.paginas.sobre.seo, '/sobre/');
export default function Sobre() {
  return <main id="conteudo">
    <PageIntro label="SOBRE NÓS" title="JK Mármores e Granitos" titleClassName="brand-title" description={cliente.sobre.abertura} />
    <section className="container section-space about-editorial">
      <Illustration id="sequencia-04-aplicada" />
      <div><h2>Desde 2010.</h2><p>{cliente.sobre.proposito}</p><p>{cliente.sobre.materia}</p></div>
    </section>
    <section className="section-space warm-section"><div className="container company-introduction">
      <SectionHeading title="A excelência está nos detalhes." />
      <div><p>{cliente.sobre.precisao}</p><p>{cliente.sobre.projeto}</p></div>
    </div></section>
    <section className="container section-space company-introduction">
      <SectionHeading title="Seu projeto, com identidade." />
      <div><p className="lead">{cliente.sobre.atendimento}</p><SiteLink className="text-link" href="/materiais/">Conheça nossos materiais</SiteLink><p className="editorial-note">Estamos na Estrada dos Pinheiros, 379, Parque Viana, Barueri/SP. Antes de visitar, consulte a JK pelo <a href={telefoneUrl}>telefone</a>.</p></div>
    </section>
    <section className="container brand-signature"><p className="brand-name">JK Mármores e Granitos</p><h2>{cliente.sobre.assinatura}</h2></section>
    <ContactPanel />
  </main>;
}
