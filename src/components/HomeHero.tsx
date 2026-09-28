import { Suspense } from "react";
import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { institucional } from '@/content/institucional';
import { Foto } from './Foto';
import { HeroScrub } from './HeroScrub';
import styles from './HomeHero.module.css';
import { illustrationNotice } from '@/content/illustration';

export function HomeHero() {
  return <header className={`home-hero ${styles.hero}`}>
    <Suspense><HeroScrub>
      <figure className={styles.figure}>
        <Foto id="capa-poster" mobileId="capa-poster-mobile" alt="Ambiente ilustrativo com bancada de pedra rosada, veios caramelo e luz de fim de tarde." sizes="100vw" prioridade />
        <figcaption>{illustrationNotice}</figcaption>
      </figure>
      <div className={styles.intro} data-hero-intro>
        <h1>{institucional.hero.titulo}</h1>
        <p className={styles.description}>{institucional.hero.texto}</p>
        <div className="actions"><a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a></div>
      </div>
    </HeroScrub></Suspense>
  </header>;
}
