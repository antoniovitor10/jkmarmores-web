import Link from "next/link";
import { conteudo } from "@/content";
import { PageView } from "@/components/PageView";
import { PendenteTexto } from "@/components/PendenteTexto";
import { metadataPagina } from "@/lib/site";

export const metadata = metadataPagina(conteudo.paginas.materiais.seo, "/materiais/");
export default function Materiais() {
  const materiais = conteudo.materiais.filter((item) => item.confirmado);
  return <PageView pagina={conteudo.paginas.materiais}><section aria-label="Materiais disponíveis" className="card-grid">{materiais.map((item) => <article className="card" key={item.slug}><h2><PendenteTexto valor={item.nome} /></h2><p><PendenteTexto valor={item.resumo} /></p><Link href={`/materiais/${item.slug}/`}>Conhecer material</Link></article>)}</section>{!materiais.length && <p><PendenteTexto valor={{ __pendente: true, descricao: "materiais trabalhados pela JK" }} /></p>}</PageView>;
}
