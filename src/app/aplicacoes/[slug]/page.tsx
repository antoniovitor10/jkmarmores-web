import { notFound } from "next/navigation";
import { conteudo } from "@/content";
import { PageView } from "@/components/PageView";
import { pendente } from "@/content/pendente";
import { metadataPagina } from "@/lib/site";

export function generateStaticParams() { const publicados = conteudo.aplicacoes.filter((item) => item.confirmado).map((item) => ({ slug: item.slug })); return publicados.length ? publicados : [{ slug: "pendente" }]; }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = conteudo.aplicacoes.find((aplicacao) => aplicacao.slug === slug && aplicacao.confirmado);
  return item ? metadataPagina(item.seo, `/aplicacoes/${slug}/`) : metadataPagina({ titulo: pendente("aplicação confirmada"), descricao: pendente("descrição de aplicação confirmada") }, `/aplicacoes/${slug}/`);
}
export default async function AplicacaoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = conteudo.aplicacoes.find((aplicacao) => aplicacao.slug === slug && aplicacao.confirmado);
  if (slug === "pendente" && !item) return <PageView pagina={{ titulo: pendente("aplicação confirmada pela JK"), introducao: "Esta página será preenchida quando houver uma aplicação confirmada.", seo: { titulo: pendente("aplicação confirmada"), descricao: pendente("descrição da aplicação") }, secoes: [], cta: conteudo.paginas.aplicacoes.cta }} />;
  if (!item) notFound();
  return <PageView pagina={{ titulo: item.nome, introducao: item.resumo, seo: item.seo, secoes: [{ id: "detalhes", titulo: "Sobre a aplicação", texto: item.descricao }], cta: item.cta }} />;
}
