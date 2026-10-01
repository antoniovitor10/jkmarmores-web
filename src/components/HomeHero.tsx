import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { Foto } from './Foto';
import styles from './HomeHero.module.css';

export function HomeHero() {
  return <header className={`home-hero ${styles.hero}`}>
    <figure className={styles.figure} data-gallery-image>
      <Foto id="capa-galeria" mobileId="capa-galeria-mobile" alt="Imagem ilustrativa de uma bancada de pedra clara inteira, com veios naturais e luz lateral em um ambiente arquitetônico." sizes="(max-width: 700px) 100vw, max(100vw, 179svh)" prioridade />
    </figure>
    <div className={styles.intro} data-hero-intro>
      <h1><span className={styles.line}><span>O bruto</span></span><span className={styles.line}><span>vira arte.</span></span></h1>
      <p>Mármores e granitos em Barueri.</p>
      <a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a>
    </div>
  </header>;
}
