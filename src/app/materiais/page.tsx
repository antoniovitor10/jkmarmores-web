import { conteudo, telefoneUrl } from '@/content';
import { institucional } from '@/content/institucional';
import { ContactPanel, Illustration, PageIntro } from '@/components/Institutional';
import { PendenteTexto } from '@/components/PendenteTexto';
import { SiteLink } from '@/components/SiteLink';
import { metadataPagina, texto } from '@/lib/site';
export const metadata = metadataPagina(conteudo.paginas.materiais.seo, '/materiais/');
export default function Materiais() {
  const materiais = conteudo.materiais.filter(item => item.confirmado);
  return <main id="conteudo"><PageIntro label="MATERIAIS / CRITÉRIOS DE ESCOLHA" title="A pedra certa começa pelo seu projeto." description={texto(conteudo.paginas.materiais.introducao)} />
    <section className="container section-space material-editorial"><Illustration id="sequencia-01-chapa" /><div className="material-criteria">{institucional.materiais.map((item,i) => <article key={item.titulo}><span>0{i+1}</span><div><h2>{item.titulo}</h2><p>{item.texto}</p></div></article>)}</div></section>
    <section className="warm-section section-space"><div className="container catalog-status"><div><p className="eyebrow">OPÇÕES PARA O SEU PROJETO</p><h2>Consulte os materiais<br />com a JK.</h2></div><div><p>O catálogo está sendo preparado com as informações da empresa. Enquanto isso, fale por telefone sobre o que você procura, sem presumir disponibilidade pelo nome ou pela imagem de uma pedra.</p><p className="editorial-note"><PendenteTexto valor={institucional.catalogo} /></p><a className="button" href={telefoneUrl}>Consultar por telefone</a></div></div>
      {materiais.length > 0 && <div className="container card-grid">{materiais.map(item => <article className="card" key={item.slug}><h3><PendenteTexto valor={item.nome} /></h3><p><PendenteTexto valor={item.resumo} /></p><SiteLink href={`/materiais/${item.slug}/`}>Conhecer material</SiteLink></article>)}</div>}
    </section>
    <section className="container section-space about-editorial"><div><p className="eyebrow">DO DESENHO AO TOQUE</p><h2>Olhe de perto.<br />Confira a amostra.</h2><p>Uma tela ajuda a explorar referências. A escolha final pede a verificação da chapa, da superfície e do acabamento real.</p><p>Consulte as orientações do fornecedor sobre uso e cuidados, além dos acabamentos disponíveis para o material escolhido.</p><SiteLink className="text-link" href="/#configurador">Explorar a maquete em 3D</SiteLink></div><Illustration id="sequencia-02-borda" /></section>
    <ContactPanel />
  </main>;
}
