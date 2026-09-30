import { conteudo } from '@/content';
import { cliente } from '@/content/cliente';
import { ContactPanel, Illustration, PageIntro } from '@/components/Institutional';
import { SiteLink } from '@/components/SiteLink';
import { metadataPagina, texto } from '@/lib/site';
export const metadata = metadataPagina(conteudo.paginas.materiais.seo, '/materiais/');
export default function Materiais() {
  return <main id="conteudo">
    <PageIntro label="MATERIAIS" title={cliente.materiais.titulo} description={cliente.materiais.introducao} />
    <div className="container materials-opening"><Illustration id="sequencia-01-chapa" /></div>
    <section className="container section-space" aria-label="Categorias de materiais">
      <ol className="material-categories">{conteudo.materiais.filter(item => item.confirmado).map((item, i) => <li key={item.slug} id={item.slug}>
        <span className="category-number" aria-hidden="true">0{i + 1}</span>
        <h2><SiteLink href={`/materiais/${item.slug}/`}>{texto(item.nome)}</SiteLink></h2>
        <div><p>{texto(item.resumo)} {texto(item.descricao)}</p><SiteLink className="text-link" href={`/materiais/${item.slug}/`}>Conhecer esta categoria</SiteLink></div>
      </li>)}</ol>
    </section>
    <section className="warm-section section-space"><div className="container about-editorial">
      <div><h2>{cliente.materiais.fechamento}</h2><p>{cliente.materiais.detalhes}</p><p>{cliente.materiais.assinatura}</p><SiteLink className="text-link" href="/#configurador">Veja referências no ambiente</SiteLink></div>
      <Illustration id="sequencia-02-borda" />
    </div></section>
    <ContactPanel />
  </main>;
}
