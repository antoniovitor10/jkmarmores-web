import { conteudo } from '@/content';
import { cliente } from '@/content/cliente';
import { institucional } from '@/content/institucional';
import { ContactPanel, Illustration, PageIntro } from '@/components/Institutional';
import { MaterialCollection } from '@/components/MaterialCollection';
import { PendenteTexto } from '@/components/PendenteTexto';
import { SiteLink } from '@/components/SiteLink';
import { metadataPagina } from '@/lib/site';
export const metadata = metadataPagina(conteudo.paginas.materiais.seo, '/materiais/');
export default function Materiais() {
  return <main id="conteudo"><PageIntro label="MATERIAIS" title={cliente.materiaisTitulo + '.'} description={cliente.materiaisIntro} />
    <section className="container materials-cover"><Illustration id="sequencia-01-chapa" /><p className="editorial-note">Estudo ilustrativo de matéria. Imagem gerada por IA.</p></section>
    <section className="container section-space"><MaterialCollection complete /><p className="editorial-note"><PendenteTexto valor={institucional.catalogo} /></p></section>
    <section className="section-space warm-section light-transition"><span className="section-light" aria-hidden="true" /><div className="container split-heading"><h2>{cliente.fechamentoTitulo}.</h2><div><p>{cliente.fechamento}</p><p>Pedras naturais e superfícies de alta tecnologia para projetos que transcendem tendências.</p><SiteLink className="text-link" href="/#configurador">Explorar combinações ilustrativas</SiteLink></div></div></section>
    <ContactPanel />
  </main>;
}
