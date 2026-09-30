import { notFound } from "next/navigation";
import { conteudo } from "@/content";
import { PageView } from "@/components/PageView";
import { PendenteTexto } from "@/components/PendenteTexto";
import { pendente } from "@/content/pendente";
import { metadataPagina } from "@/lib/site";
import { SiteLink } from "@/components/SiteLink";

export function generateStaticParams() { const publicados = conteudo.materiais.filter((item) => item.confirmado).map((item) => ({ slug: item.slug })); return publicados.length ? publicados : [{ slug: "pendente" }]; }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = conteudo.materiais.find((material) => material.slug === slug && material.confirmado);
  return item ? metadataPagina(item.seo, `/materiais/${slug}/`) : metadataPagina({ titulo: pendente("material confirmado"), descricao: pendente("descrição de material confirmado") }, `/materiais/${slug}/`);
}
export default async function MaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = conteudo.materiais.find((material) => material.slug === slug && material.confirmado);
  if (slug === "pendente" && !item) return <PageView pagina={{ titulo: pendente("material confirmado pela JK"), introducao: "Esta página será preenchida quando houver um material confirmado.", seo: { titulo: pendente("material confirmado"), descricao: pendente("descrição do material") }, secoes: [], cta: conteudo.paginas.materiais.cta }} />;
  if (!item) notFound();
  return <PageView pagina={{ titulo: item.nome, introducao: item.resumo, seo: item.seo, secoes: [{ id: "detalhes", titulo: "Sobre o material", texto: item.descricao }], cta: item.cta }}>
    <section className="category-consultation"><h2>A escolha para seu projeto.</h2><p>Converse com a JK sobre a pedra, o acabamento e a aplicação que você tem em mente. Confira a amostra real e as orientações específicas do material antes de decidir.</p><div hidden>{[...(item.caracteristicas ?? []), ...(item.cuidados ?? [])].map((valor, i) => <PendenteTexto key={i} valor={valor} />)}</div><SiteLink className="text-link" href="/materiais/">Ver todas as categorias</SiteLink></section>
  </PageView>;
}
