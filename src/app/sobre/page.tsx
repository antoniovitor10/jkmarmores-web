import { conteudo, telefoneUrl } from '@/content';
import { institucional } from '@/content/institucional';
import { ContactPanel, Illustration, PageIntro, RequestSteps, SectionHeading } from '@/components/Institutional';
import { PendenteTexto } from '@/components/PendenteTexto';
import { metadataPagina, texto } from '@/lib/site';
export const metadata = metadataPagina(conteudo.paginas.sobre.seo, '/sobre/');
export default function Sobre() {
  return <main id="conteudo"><PageIntro label="A EMPRESA / BARUERI, SP" title="JK Marmores e Granitos." description={institucional.apresentacao} />
    <section className="container section-space about-editorial"><Illustration id="sequencia-04-aplicada" /><div><h2>No Parque Viana,<br />em Barueri.</h2><p>Nosso endereço é {texto(conteudo.empresa.endereco)}. Para falar sobre um projeto ou consultar a possibilidade de visita, entre em contato por telefone.</p><a className="text-link" href={telefoneUrl}>{texto(conteudo.empresa.telefone)}</a><p className="editorial-note"><PendenteTexto valor={institucional.historia} /></p></div></section>
    <section className="section-space warm-section"><div className="container"><SectionHeading number="01" label="ATENDIMENTO" title="O primeiro passo é conversar." /><RequestSteps /><p className="editorial-note"><PendenteTexto valor={institucional.processo} /></p></div></section>
    <section className="container section-space company-introduction"><SectionHeading number="02" label="MATERIAIS E SERVIÇOS" title="Seu projeto, em detalhe." /><div><p className="lead">Conte qual peça você precisa, a cidade e as referências que tem em mente. Consulte com a JK os materiais e serviços disponíveis.</p><p className="editorial-note"><PendenteTexto valor={institucional.oferta} /></p><p className="editorial-note"><PendenteTexto valor={institucional.catalogo} /></p></div></section>
    <ContactPanel />
  </main>;
}
