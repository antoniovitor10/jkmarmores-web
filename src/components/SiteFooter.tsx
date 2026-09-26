import Link from "next/link";
import { conteudo } from "@/content";
import { PendenteTexto } from "@/components/PendenteTexto";
import { linkWhatsApp } from "@/lib/whatsapp";

export function SiteFooter() {
  const cta = conteudo.paginas.contato.cta;
  return <>
    <footer className="site-footer"><div className="container"><p><PendenteTexto valor={conteudo.empresa.nome} /></p><p><PendenteTexto valor={conteudo.empresa.endereco} /></p><p><PendenteTexto valor={conteudo.empresa.cidade} /></p><Link href="/contato/">Contato</Link></div></footer>
    <a className="mobile-whatsapp" href={linkWhatsApp(cta.mensagem, conteudo.empresa.whatsapp)}>{cta.texto}</a>
  </>;
}
