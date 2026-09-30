import { materiaisCliente } from '@/content/cliente';
import { SiteLink } from './SiteLink';

export function MaterialCollection({ complete = false }: { complete?: boolean }) {
  return <div className="material-collection">{materiaisCliente.map((material, index) => <article className="material-card" key={material.slug}>
    <span className="material-number">0{index + 1}</span>
    <h3>{material.nome}</h3>
    <p>{material.resumo}</p>
    {complete && <p>{material.descricao}</p>}
    <SiteLink className="text-link" href={`/materiais/${material.slug}/`}>Conhecer {material.nome.toLowerCase()}</SiteLink>
  </article>)}</div>;
}
