import { notFound } from 'next/navigation';
import { conteudo } from '@/content';
import { cliente } from '@/content/cliente';
import { institucional } from '@/content/institucional';
import { ContactPanel, PageIntro } from '@/components/Institutional';
import { SiteLink } from '@/components/SiteLink';
import { PendenteTexto } from '@/components/PendenteTexto';
import { metadataPagina, texto } from '@/lib/site';
export function generateStaticParams() { return conteudo.materiais.filter(item => item.confirmado).map(item => ({ slug: item.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = conteudo.materiais.find(item => item.slug === slug && item.confirmado);
  return item ? metadataPagina(item.seo, `/materiais/${slug}/`) : {};
}
export default async function MaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = conteudo.materiais.find(item => item.slug === slug && item.confirmado);
  if (!item) notFound();
  return <main id="conteudo"><PageIntro label="Materiais" title={texto(item.nome)} description={texto(item.descricao)} />
    <section className="container section-space company-introduction"><h2>A escolha começa<br />no seu projeto.</h2><div><p>{cliente.detalheMateriais}</p><p>Consulte com a JK a chapa, o acabamento e as orientações específicas para a sua aplicação.</p><p className="editorial-note"><PendenteTexto valor={institucional.catalogo} /></p><SiteLink className="text-link" href="/materiais/">Ver todas as categorias</SiteLink></div></section><ContactPanel />
  </main>;
}
