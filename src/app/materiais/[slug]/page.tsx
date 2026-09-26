import { notFound } from "next/navigation";
import { conteudo } from "@/content";
import { PageView } from "@/components/PageView";
import { SceneSlot } from "@/components/SceneSlot";
import { PendenteTexto } from "@/components/PendenteTexto";
import { pendente } from "@/content/pendente";
import { metadataPagina } from "@/lib/site";

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
  return <PageView pagina={{ titulo: item.nome, introducao: item.resumo, seo: item.seo, secoes: [{ id: "detalhes", titulo: "Sobre o material", texto: item.descricao }], cta: item.cta }}><section><h2>Acabamentos</h2>{item.acabamentos.map((acabamento) => <p key={acabamento.slug}><PendenteTexto valor={acabamento.nome} /></p>)}</section><section><h2>Explore a chapa</h2><SceneSlot mode="chapa" materialSlug={item.slug} materials={conteudo.materiais.filter((material) => material.confirmado)} quoteBase={`Olá, gostaria de pedir um orçamento para ${typeof item.nome === "string" ? item.nome : "este material"}.`} whatsapp={conteudo.empresa.whatsapp} /></section></PageView>;
}
