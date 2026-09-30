import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { Foto } from './Foto';
import styles from './HomeHero.module.css';
import { jkMonogramPath } from '@/content/monogram';

export function HomeHero() {
  return <section className="prologo" aria-label="Apresentação da JK"><header className={`home-hero ${styles.hero}`}>
    <figure className={styles.figure}>
      <Foto id="material-detalhe-quente" mobileId="capa-editorial-mobile" alt="Imagem ilustrativa de pedra rosada com veios caramelo sob luz rasante." sizes="100vw" prioridade />
    </figure>
    <div className={styles.veil} data-hero-veil aria-hidden="true" />
    <div className={styles.dawn} aria-hidden="true" />
    <div className={styles.light} aria-hidden="true" />
    <svg className={`hero-mask ${styles.mask}`} viewBox="0 0 800 500" aria-hidden="true" focusable="false">
      <defs><mask id="hero-jk-window" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" style={{ maskType:'luminance' }}>
        <rect width="100%" height="100%" fill="white" />
        <g className="hero-monogram-path"><path d={jkMonogramPath} fill="black" /></g>
      </mask></defs>
      <rect width="100%" height="100%" fill="#10100f" mask="url(#hero-jk-window)" />
    </svg>
    <div className={`container ${styles.intro}`} data-hero-intro>
      <p className={styles.location}>MÁRMORES E GRANITOS / BARUERI, SP</p>
      <h1><span className={styles.line}><span>Pedra que dá forma</span></span>{' '}<span className={styles.line}><span>ao seu espaço.</span></span></h1>
      <div className={styles.bottom}><p>Seu projeto começa com uma conversa.<br />Conte sua ideia à JK.</p><a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a></div>
    </div>
    <div className={`hero-signature ${styles.signature}`}><p>JK MÁRMORES E GRANITOS</p><a href="#configurador">Explore as referências</a></div>
  </header></section>;
}
