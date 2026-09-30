import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { Foto } from './Foto';
import styles from './HomeHero.module.css';
import { illustrationNotice } from '@/content/illustration';

export function HomeHero() {
  return <header className={`home-hero ${styles.hero}`}>
    <div className={styles.intro} data-hero-intro>
      <div><h1><span className={styles.line}><span>Pedra que dá forma</span></span><span className={styles.line}><span>ao seu espaço.</span></span></h1><p>Mármores e granitos em Barueri.<br />Mande uma foto ou a medida do seu espaço e converse com a JK.</p></div>
      <a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a>
    </div>
    <figure className={styles.figure} data-gallery-image>
      <Foto id="material-detalhe-quente" mobileId="capa-editorial-mobile" alt="Imagem ilustrativa de pedra rosada com veios caramelo e luz suave sobre a borda." sizes="(max-width: 700px) 100vw, calc(100vw - 80px)" prioridade />
    </figure>
    <p className={styles.notice}>{illustrationNotice}</p>
  </header>;
}
