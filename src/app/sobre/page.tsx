import { conteudo } from '@/content';
import { cliente } from '@/content/cliente';
import { institucional } from '@/content/institucional';
import { ContactPanel, Illustration, PageIntro } from '@/components/Institutional';
import { PendenteTexto } from '@/components/PendenteTexto';
import { SiteLink } from '@/components/SiteLink';
import { metadataPagina } from '@/lib/site';
export const metadata = metadataPagina(conteudo.paginas.sobre.seo, '/sobre/');
export default function Sobre() {
  return <main id="conteudo">
    <PageIntro label="Sobre nós" title="O bruto vira arte." description={cliente.sobre[0]} />
    <section className="container section-space about-editorial">
      <Illustration id="sequencia-04-aplicada" />
      <div><h2>Precisão em cada detalhe.</h2><p>{cliente.sobre[1]}</p><p>{cliente.sobre[2]}</p><p>{cliente.sobre[3]}</p></div>
    </section>
    <section className="warm-section section-space"><div className="container company-introduction">
      <h2>Do seu projeto<br />ao seu espaço.</h2><div><p className="lead">{cliente.regiao}</p><SiteLink className="text-link" href="/materiais/">Conheça nossos materiais</SiteLink><p className="editorial-note"><PendenteTexto valor={institucional.oferta} /></p></div>
    </div></section>
    <section className="container section-space signature-section"><p>{cliente.assinatura}</p></section>
    <ContactPanel />
  </main>;
}
