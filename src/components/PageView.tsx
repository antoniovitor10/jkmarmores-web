import Link from "next/link";
import { PendenteTexto } from "@/components/PendenteTexto";
import { conteudo } from "@/content";
import { linkWhatsApp } from "@/lib/whatsapp";
import type { PaginaInstitucional } from "@/lib/types";

export function PageView({ pagina, children, abertura }: { pagina: PaginaInstitucional; children?: React.ReactNode; abertura?: React.ReactNode }) {
  return <main id="conteudo" className={abertura ? "home-page" : "container page-content"}>
    {abertura ?? <header className="page-intro"><h1><PendenteTexto valor={pagina.titulo} /></h1><p><PendenteTexto valor={pagina.introducao} /></p><a className="button" href={linkWhatsApp(pagina.cta.mensagem, conteudo.empresa.whatsapp)}>{pagina.cta.texto}</a></header>}
    <div className={abertura ? "container page-content" : undefined}>
    {pagina.secoes.map((secao) => { const cta = secao.cta ?? pagina.cta; return <section key={secao.id} id={secao.id} className="content-section"><h2><PendenteTexto valor={secao.titulo} /></h2><p><PendenteTexto valor={secao.texto} /></p><a href={linkWhatsApp(cta.mensagem, conteudo.empresa.whatsapp)}>{cta.texto}</a></section>; })}
    {children}
    <div className="closing-cta"><p>Conte-nos o que você precisa para receber orientação sobre o próximo passo.</p><a className="button" href={linkWhatsApp(pagina.cta.mensagem, conteudo.empresa.whatsapp)}>{pagina.cta.texto}</a><Link href="/contato/">Ver outras formas de contato</Link></div>
    </div>
  </main>;
}
