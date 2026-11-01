import { SiteLink as Link } from "./SiteLink";
import { conteudo, telefoneUrl } from "@/content";
import { Brand } from "./Brand";
import { linkWhatsApp } from "@/lib/whatsapp";
import { IconeMenu } from "./IconeMenu";
import { IconeWhatsApp } from "./IconeWhatsApp";
import { PendenteTexto } from "./PendenteTexto";
import { materiaisCliente } from "@/content/cliente";
import { nomeCurtoMaterial } from "@/lib/rotas";

const nav = [
  { href: "/sobre/", nome: "A empresa" },
  { href: "/materiais/", nome: "Materiais" },
  { href: "/contato/", nome: "Contato" },
];

// T-0013: cabeçalho grafite e fixo; no celular, nome da empresa ao lado do monograma e menu grafite
// com links numerados, atalho para os 6 materiais, telefone, endereço e WhatsApp.
export function SiteHeader() {
  const cta = conteudo.paginas.inicio.cta;
  const whatsapp = linkWhatsApp(cta.mensagem, conteudo.empresa.whatsapp);
  return <header className="site-header">
    <div className="container header-inner">
      <Link href="/" className="brand"><Brand /><span className="brand-nome" aria-hidden="true"><span>JK Mármores</span><span>e Granitos</span></span></Link>
      <nav aria-label="Navegação principal" className="desktop-nav">{nav.map((item) => <Link key={item.href} href={item.href}>{item.nome}</Link>)}</nav>
      <details className="mobile-nav">
        <summary><span className="menu-closed"><IconeMenu />Menu</span><span className="menu-open"><IconeMenu aberto />Fechar</span></summary>
        <nav aria-label="Navegação móvel">
          <ol className="menu-lista">
            {nav.map((item, i) => <li key={item.href}>
              <Link href={item.href}><span className="menu-numero" aria-hidden="true">0{i + 1}</span>{item.nome}</Link>
              {item.href === "/materiais/" && <ul className="menu-materiais" aria-label="Tipos de material">
                {materiaisCliente.map((m) => <li key={m.slug}><Link href={`/materiais/${m.slug}/`}>{nomeCurtoMaterial[m.slug] ?? m.nome}</Link></li>)}
              </ul>}
            </li>)}
          </ol>
          <div className="menu-contato">
            <a className="menu-telefone" href={telefoneUrl}><PendenteTexto valor={conteudo.empresa.telefone} /></a>
            <address><PendenteTexto valor={conteudo.empresa.endereco} /></address>
            <a className="button menu-whatsapp botao-whatsapp" href={whatsapp}><IconeWhatsApp />Chamar no WhatsApp</a>
          </div>
        </nav>
      </details>
      <a className="header-cta" href={whatsapp}>{cta.texto}</a>
    </div>
  </header>;
}
