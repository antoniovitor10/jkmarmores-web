import { conteudo } from "@/content";
import { PageView } from "@/components/PageView";
import { QuoteForm } from "@/components/QuoteForm";
import { PendenteTexto } from "@/components/PendenteTexto";
import { isPendente } from "@/content/pendente";
import { metadataPagina } from "@/lib/site";

export const metadata = metadataPagina(conteudo.paginas.contato.seo, "/contato/");
export default function Contato() {
  const numero = isPendente(conteudo.empresa.whatsapp) ? null : conteudo.empresa.whatsapp.replace(/\D/g, "");
  return <PageView pagina={conteudo.paginas.contato}><section><h2>Dados de contato</h2><p>WhatsApp: <PendenteTexto valor={conteudo.empresa.whatsapp} /></p><p>Telefone: <PendenteTexto valor={conteudo.empresa.telefone} /></p><p>Endereço: <PendenteTexto valor={conteudo.empresa.endereco} /></p><p>Cidade: <PendenteTexto valor={conteudo.empresa.cidade} /></p></section><section><h2>Prepare seu pedido</h2><p>Informe o que você já sabe. A mensagem será aberta no WhatsApp para você revisar antes de enviar.</p><QuoteForm numero={numero} /></section></PageView>;
}
