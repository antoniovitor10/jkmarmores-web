import { SiteLink as Link } from "./SiteLink";
import { conteudo } from "@/content";
import { Brand } from "./Brand";
import { linkWhatsApp } from "@/lib/whatsapp";

const nav = [
  { href: "/", nome: "Início" }, { href: "/sobre/", nome: "A empresa" },
  { href: "/materiais/", nome: "Materiais" }, { href: "/aplicacoes/", nome: "Aplicações" },
  { href: "/galeria/", nome: "Galeria" }, { href: "/contato/", nome: "Contato" },
];

export function SiteHeader() {
  const cta = conteudo.paginas.inicio.cta;
  return <header className="site-header">
    <div className="container header-inner">
      <Link href="/" className="brand"><Brand /></Link>
      <nav aria-label="Navegação principal" className="desktop-nav">{nav.map((item) => <Link key={item.href} href={item.href}>{item.nome}</Link>)}</nav>
      <details className="mobile-nav"><summary><span className="menu-closed">Menu</span><span className="menu-open">Fechar</span></summary><nav aria-label="Navegação móvel">{nav.map((item) => <Link key={item.href} href={item.href}>{item.nome}</Link>)}<a className="button menu-whatsapp" href={linkWhatsApp(cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a></nav></details>
      <a className="header-cta" href={linkWhatsApp(cta.mensagem, conteudo.empresa.whatsapp)}>{cta.texto}</a>
    </div>
  </header>;
}
