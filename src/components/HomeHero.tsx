import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { Foto } from './Foto';
import styles from './HomeHero.module.css';

export function HomeHero() {
  return <header className={`home-hero ${styles.hero}`}>
    <figure className={styles.figure}>
      <Foto id="material-detalhe-quente" mobileId="capa-editorial-mobile" alt="Imagem ilustrativa de pedra rosada com veios caramelo sob luz rasante." sizes="100vw" prioridade />
    </figure>
    <div className={styles.light} aria-hidden="true" />
    <div className={`container ${styles.intro}`} data-hero-intro>
      <p className={styles.location}>MÁRMORES E GRANITOS / BARUERI, SP</p>
      <h1>Pedra que dá forma<br />ao seu espaço.</h1>
      <div className={styles.bottom}><p>Seu projeto começa com uma conversa.<br />Conte sua ideia à JK.</p><a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a></div>
    </div>
  </header>;
}
