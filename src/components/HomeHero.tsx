import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { institucional } from '@/content/institucional';
import { Foto } from './Foto';
import { HeroScrub } from './HeroScrub';
import styles from './HomeHero.module.css';

export function HomeHero() {
  return <header className={`home-hero ${styles.hero}`}>
    <HeroScrub>
      <figure className={styles.figure}>
        <Foto id="capa-poster" mobileId="capa-poster-mobile" alt="Ambiente ilustrativo com bancada de pedra rosada, veios caramelo e luz de fim de tarde." sizes="100vw" prioridade />
        <figcaption>Imagem ilustrativa, gerada por IA</figcaption>
      </figure>
      <div className={styles.intro} data-hero-intro>
        <p className="eyebrow">{institucional.hero.local}</p>
        <h1>{institucional.hero.titulo}</h1>
        <p className={styles.description}>{institucional.hero.texto}</p>
        <div className="actions"><a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Fale com a JK no WhatsApp</a></div>
      </div>
    </HeroScrub>
  </header>;
}
