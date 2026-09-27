import { SiteLink as Link } from "./SiteLink";
import { PendenteTexto } from "@/components/PendenteTexto";
import { conteudo } from "@/content";
import { linkWhatsApp } from "@/lib/whatsapp";
import type { PaginaInstitucional } from "@/lib/types";

export function PageView({ pagina, children, abertura }: { pagina: PaginaInstitucional; children?: React.ReactNode; abertura?: React.ReactNode }) {
  return <main id="conteudo" className={abertura ? "home-page" : undefined}>
    {abertura ?? <header className="institutional-intro"><div className="container"><p className="eyebrow">JK MARMORES E GRANITOS / BARUERI, SP</p><h1><PendenteTexto valor={pagina.titulo} /></h1><p className="intro-description"><PendenteTexto valor={pagina.introducao} /></p></div></header>}
    <div className="container page-content">
    {pagina.secoes.map((secao) => <section key={secao.id} id={secao.id} className="content-section"><h2><PendenteTexto valor={secao.titulo} /></h2><p><PendenteTexto valor={secao.texto} /></p></section>)}
    {children}
    <div className="closing-cta"><p>Conte-nos o que você precisa para receber orientação sobre o próximo passo.</p><a className="button" href={linkWhatsApp(pagina.cta.mensagem, conteudo.empresa.whatsapp)}>{pagina.cta.texto}</a><Link href="/contato/">Ver outras formas de contato</Link></div>
    </div>
  </main>;
}
