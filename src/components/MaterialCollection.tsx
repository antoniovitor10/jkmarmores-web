import { materiaisCliente } from '@/content/cliente';
import { imagensCategorias } from '@/content/categorias';
import { Foto } from './Foto';
import { SiteLink } from './SiteLink';

// comImagem: só /materiais/ mostra a imagem da categoria; a home mantém os cartões da versão aprovada.
export function MaterialCollection({ complete = false, comImagem = false }: { complete?: boolean; comImagem?: boolean }) {
  return <div className="material-collection">{materiaisCliente.map((material, index) => {
    const imagem = comImagem ? imagensCategorias[material.slug] : undefined;
    return <article className="material-card" key={material.slug} data-categoria={material.slug}>
      {imagem && <Foto id={imagem.id} alt={imagem.alt} className="material-image" sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 400px" />}
      <span className="material-number">0{index + 1}</span>
      <h3>{material.nome}</h3>
      <p>{material.resumo}</p>
      {complete && <p>{material.descricao}</p>}
      <SiteLink className="text-link" href={`/materiais/${material.slug}/`}>Conhecer {material.nome.toLowerCase()}</SiteLink>
    </article>;
  })}</div>;
}
