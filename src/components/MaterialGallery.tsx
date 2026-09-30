import { categoriasCliente, cliente } from '@/content/cliente';
import { Foto } from './Foto';
import { SiteLink } from './SiteLink';

export function MaterialGallery() {
  return <section id="materiais" className="material-gallery" aria-labelledby="gallery-title">
    <div className="gallery-stage">
      <div className="container gallery-heading"><h2 id="gallery-title">{cliente.tituloMateriais}</h2><p>Pedras naturais e superfícies de alta tecnologia.</p></div>
      <div className="gallery-window"><div className="gallery-rail">
        {categoriasCliente.map(item => <article className={`gallery-material gallery-${item.slug}`} key={item.slug}>
          <figure><Foto id={item.imagem} alt="Estudo visual ilustrativo de pedra, sem correspondência com uma chapa do catálogo comercial." sizes="(max-width: 700px) 90vw, 65vw" /></figure>
          <div className="gallery-description"><h3>{item.curto}</h3><p>{item.descricao}</p><SiteLink href={`/materiais/${item.slug}/`}>Conhecer esta categoria</SiteLink></div>
        </article>)}
      </div></div>
      <p className="container gallery-note">Imagens ilustrativas. Consulte as chapas e acabamentos reais com a JK.</p>
    </div>
  </section>;
}
