import { conteudo, telefoneUrl } from '@/content';
import { cliente } from '@/content/cliente';
import { ContactPanel, Illustration, PageIntro } from '@/components/Institutional';
import { metadataPagina, texto } from '@/lib/site';
export const metadata = metadataPagina(conteudo.paginas.sobre.seo, '/sobre/');
export default function Sobre() {
  return <main id="conteudo"><PageIntro label="SOBRE NÓS" title="O bruto vira arte." description={cliente.apresentacao} />
    <section className="container section-space about-editorial"><Illustration id="sequencia-04-aplicada" /><div><p className="eyebrow">DESDE 2010</p><h2>Precisão em cada detalhe.</h2>{cliente.historia.map(paragrafo => <p key={paragrafo}>{paragrafo}</p>)}</div></section>
    <section className="section-space warm-section light-transition"><span className="section-light" aria-hidden="true" /><div className="container company-introduction"><h2>Projetos com identidade.</h2><div><p className="lead">{cliente.projetos}</p><p>Atendemos {cliente.regiao}.</p><p>Estamos na {texto(conteudo.empresa.endereco)}. Para consultar a possibilidade de visita, entre em contato antes de se deslocar.</p><a className="text-link" href={telefoneUrl}>{texto(conteudo.empresa.telefone)}</a></div></div></section>
    <section className="container section-space brand-statement"><p>{cliente.assinatura}</p></section>
    <ContactPanel />
  </main>;
}
