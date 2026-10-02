import Link from "next/link";
import { conteudo } from "@/content";
import { PageView } from "@/components/PageView";
import { PendenteTexto } from "@/components/PendenteTexto";
import { metadataPagina } from "@/lib/site";

export const metadata = metadataPagina(conteudo.paginas.aplicacoes.seo, "/aplicacoes/", false);
export default function Aplicacoes() {
  const aplicacoes = conteudo.aplicacoes.filter((item) => item.confirmado);
  return <PageView pagina={conteudo.paginas.aplicacoes}><section aria-label="Aplicações disponíveis" className="card-grid">{aplicacoes.map((item) => <article className="card" key={item.slug}><h2><PendenteTexto valor={item.nome} /></h2><p><PendenteTexto valor={item.resumo} /></p><Link href={`/aplicacoes/${item.slug}/`}>Conhecer aplicação</Link></article>)}</section>{!aplicacoes.length && <p><PendenteTexto valor={{ __pendente: true, descricao: "aplicações confirmadas pela JK" }} /></p>}</PageView>;
}
