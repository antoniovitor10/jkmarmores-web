import { SiteLink as Link } from "./SiteLink";
import { conteudo } from "@/content";
import { PendenteTexto } from "@/components/PendenteTexto";
import { linkWhatsApp } from "@/lib/whatsapp";

export function SiteFooter() {
  return <>
    <footer className="site-footer"><div className="container"><p><PendenteTexto valor={conteudo.empresa.nome} /></p><p><PendenteTexto valor={conteudo.empresa.endereco} /></p><p><PendenteTexto valor={conteudo.empresa.cidade} /></p><Link href="/contato/">Contato</Link></div></footer>
  </>;
}

export function MobileQuoteDock() {
  const cta = conteudo.paginas.contato.cta;
  return <div className="mobile-quote-dock"><a className="mobile-whatsapp" href={linkWhatsApp(cta.mensagem, conteudo.empresa.whatsapp)}>{cta.texto}</a></div>;
}
