import { conteudo } from "@/content";
import { PageView } from "@/components/PageView";
import { PendenteTexto } from "@/components/PendenteTexto";
import { metadataPagina } from "@/lib/site";

export const metadata = metadataPagina(conteudo.paginas.galeria.seo, "/galeria/", false);
export default function Galeria() { return <PageView pagina={conteudo.paginas.galeria}><section aria-label="Trabalhos autorizados" className="card-grid">{conteudo.galeria.map((item) => <figure className="card" key={item.id}><figcaption><PendenteTexto valor={item.legenda} /></figcaption></figure>)}</section>{!conteudo.galeria.length && <p><PendenteTexto valor={{ __pendente: true, descricao: "fotos reais autorizadas para a galeria" }} /></p>}</PageView>; }
