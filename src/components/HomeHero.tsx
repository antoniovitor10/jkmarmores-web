import { aberturaHome, conteudo, telefoneUrl } from '@/content';
import { institucional } from '@/content/institucional';
import { Foto } from './Foto';
import { SiteLink } from './SiteLink';
import styles from './HomeHero.module.css';

export function HomeHero() {
  return <header className={`home-hero ${styles.hero}`}>
    <div className={styles.composition}>
      <div className={styles.intro}>
        <p className="eyebrow">{institucional.hero.local}</p>
        <h1>{institucional.hero.titulo}</h1>
        <p className={styles.description}>{institucional.hero.texto}</p>
        <div className="actions"><SiteLink className="button" href="/contato/">Fale sobre seu projeto</SiteLink><SiteLink href="/materiais/">Conheça os materiais</SiteLink></div>
      </div>
      <figure className={styles.figure}>
        <Foto id="a1-prova-01" mobileId="a1-mobile" alt={aberturaHome.alt} sizes="65vw" prioridade />
        <figcaption>Imagem ilustrativa, gerada por IA</figcaption>
      </figure>
    </div>
    <div className={`container ${styles.rail}`}><p><span>JK MARMORES E GRANITOS</span>Pedra, textura e possibilidades.</p><p><span>CONVERSE COM A JK</span><a href={telefoneUrl}>{String(conteudo.empresa.telefone)}</a></p><SiteLink href="/sobre/">Conheça a empresa</SiteLink></div>
  </header>;
}
