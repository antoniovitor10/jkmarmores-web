import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { Foto } from './Foto';
import styles from './HomeHero.module.css';

export function HomeHero() {
  return <header className={`home-hero ${styles.hero}`}>
    <div className={styles.intro} data-hero-intro>
      <div><h1>Pedra que dá forma<br />ao seu espaço.</h1><p>Mármores e granitos em Barueri.</p></div>
      <a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a>
    </div>
    <figure className={styles.figure}>
      <Foto id="material-detalhe-quente" mobileId="capa-editorial-mobile" alt="Imagem ilustrativa de pedra rosada com veios caramelo e luz suave sobre a borda." sizes="(max-width: 700px) 100vw, calc(100vw - 80px)" prioridade />
    </figure>
  </header>;
}
