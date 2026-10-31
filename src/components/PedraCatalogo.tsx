import { conteudo } from '@/content';
import { acabamentosCategoria, altPedra, gruposMarmore, imagemPedra, mensagemPedra, outrasPedras, pedrasVisiveis, tituloPedras, type CategoriaPedra, type Pedra } from '@/content/pedras';
import { linkWhatsApp } from '@/lib/whatsapp';
import { Foto } from './Foto';
import { IconeWhatsApp } from './IconeWhatsApp';

// Cartões das pedras de uma categoria (HU-0001, T-0002): imagem, nome e WhatsApp da pedra, sem página própria.
export function PedraCatalogo({ categoria, mensagemCategoria }: { categoria: string; mensagemCategoria: string }) {
  const visiveis = pedrasVisiveis(categoria);
  const acabamento = acabamentosCategoria[categoria as CategoriaPedra];
  if (!visiveis.length && !acabamento) return null;
  const grupos = categoria === 'marmore'
    ? gruposMarmore.map((grupo) => ({ titulo: grupo as string, itens: visiveis.filter((pedra) => pedra.grupo === grupo) }))
    : [{ titulo: tituloPedras, itens: visiveis }];
  const rotulo = categoria === 'marmore' ? 'pedra-grupo' : 'pedra-rotulo';
  return <section className="container section-space pedra-catalogo" aria-label="Pedras">
    {acabamento && <p className="pedra-nota">{acabamento}</p>}
    {grupos.filter((grupo) => grupo.itens.length > 0).map((grupo) => <div key={grupo.titulo}>
      <h2 className={rotulo}>{grupo.titulo}</h2>
      <ul className="pedra-grade" data-n={grupo.itens.length}>{grupo.itens.map((pedra) => <CartaoPedra key={pedra.slug} pedra={pedra} />)}</ul>
    </div>)}
    <p className="pedra-nota pedra-outras"><a className="text-link" href={linkWhatsApp(mensagemCategoria, conteudo.empresa.whatsapp)}>{outrasPedras}</a></p>
  </section>;
}

function CartaoPedra({ pedra }: { pedra: Pedra }) {
  return <li className="pedra-cartao" data-pedra={pedra.slug}>
    <Foto id={imagemPedra(pedra)} alt={altPedra(pedra)} className="pedra-imagem" sizes="(max-width: 700px) 50vw, (max-width: 1000px) 33vw, 300px" />
    <h3>{pedra.nome}</h3>
    <a className="button button-outline botao-whatsapp" href={linkWhatsApp(mensagemPedra(pedra), conteudo.empresa.whatsapp)} aria-label={`Chamar no WhatsApp sobre ${pedra.nome}`}><IconeWhatsApp />Chamar no WhatsApp</a>
  </li>;
}
