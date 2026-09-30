import { notFound } from 'next/navigation';
import { conteudo } from '@/content';
import { institucional } from '@/content/institucional';
import { PageIntro, ContactPanel } from '@/components/Institutional';
import { SiteLink } from '@/components/SiteLink';
import { PendenteTexto } from '@/components/PendenteTexto';
import { metadataPagina, texto } from '@/lib/site';
import { linkWhatsApp } from '@/lib/whatsapp';

export function generateStaticParams() { return conteudo.materiais.filter(item => item.confirmado).map(item => ({ slug: item.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = conteudo.materiais.find(material => material.slug === slug && material.confirmado);
  if (!item) notFound();
  return metadataPagina(item.seo, `/materiais/${slug}/`);
}
export default async function MaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = conteudo.materiais.find(material => material.slug === slug && material.confirmado);
  if (!item) notFound();
  return <main id="conteudo"><PageIntro label="MATERIAIS" title={texto(item.nome)} description={texto(item.resumo)} />
    <section className="container section-space material-detail"><p className="lead">{texto(item.descricao)}</p><div><h2>A escolha começa pelo seu projeto.</h2><p>Converse com a JK sobre a pedra específica, a aplicação, a disponibilidade e os acabamentos. Confira a amostra real antes de decidir.</p><p className="editorial-note"><PendenteTexto valor={institucional.catalogo} /></p><a className="button" href={linkWhatsApp(item.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a><SiteLink className="text-link" href="/materiais/">Ver todos os materiais</SiteLink></div></section>
    <ContactPanel />
  </main>;
}
