import { conteudo } from '@/content';
import { cliente, categoriasCliente } from '@/content/cliente';
import { institucional } from '@/content/institucional';
import { ContactPanel, PageIntro } from '@/components/Institutional';
import { PendenteTexto } from '@/components/PendenteTexto';
import { SiteLink } from '@/components/SiteLink';
import { Foto } from '@/components/Foto';
import { metadataPagina } from '@/lib/site';
export const metadata = metadataPagina(conteudo.paginas.materiais.seo, '/materiais/');
export default function Materiais() {
  return <main id="conteudo">
    <PageIntro label="Materiais" title={cliente.tituloMateriais} description={cliente.introducaoMateriais} />
    <figure className="materials-panorama"><Foto id="sequencia-01-chapa" alt="Estudo ilustrativo de uma superfície mineral clara; não identifica uma pedra do catálogo comercial." sizes="100vw" prioridade /><figcaption>Estudo visual ilustrativo. As chapas e os acabamentos reais devem ser consultados com a JK.</figcaption></figure>
    <section className="container material-list section-space" aria-label="Categorias de materiais">
      {categoriasCliente.map(item => <article id={item.slug} key={item.slug}><h2>{item.nome}</h2><div><p>{item.descricao}</p><SiteLink className="text-link" href={`/materiais/${item.slug}/`}>Conhecer esta categoria</SiteLink></div></article>)}
    </section>
    <section className="warm-section section-space"><div className="container company-introduction"><h2>{cliente.fechamentoMateriais}</h2><div><p className="lead">{cliente.detalheMateriais}</p><p>Pedras naturais e superfícies de alta tecnologia para projetos que transcendem tendências.</p><p className="editorial-note"><PendenteTexto valor={institucional.catalogo} /></p><SiteLink className="text-link" href="/#configurador">Ver a pedra no ambiente</SiteLink></div></div></section>
    <ContactPanel />
  </main>;
}
