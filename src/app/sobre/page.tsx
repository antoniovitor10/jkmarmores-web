import { conteudo } from "@/content";
import { PageView } from "@/components/PageView";
import { metadataPagina } from "@/lib/site";

export const metadata = metadataPagina(conteudo.paginas.sobre.seo, "/sobre/");
export default function Sobre() { return <PageView pagina={conteudo.paginas.sobre} />; }
