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
        <Foto id="capa-close" alt="Close ilustrativo de pedra rosada com veios caramelo e borda em meia-esquadria." sizes="100vw" prioridade />
        <figcaption>{illustrationNotice}</figcaption>
      </figure>
      <div className={styles.intro} data-hero-intro>
        <h1 aria-label={institucional.hero.titulo}>{["Pedra que dá", "forma ao", "seu espaço."].map(line => <span className={styles.line} key={line}><span>{line}</span></span>)}</h1>
        <p className={styles.description}>{institucional.hero.texto}</p>
        <p className={styles.location}>Barueri, São Paulo</p>
        <div className="actions"><a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a></div>
      </div>
    </HeroScrub></Suspense>
    <script dangerouslySetInnerHTML={{ __html: `Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,300))]).then(()=>document.documentElement.classList.add("type-ready"))` }} />
  </header>;
}
