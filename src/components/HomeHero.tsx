import localFont from "next/font/local";
import { aberturaHome, conteudo } from "@/content";
import { Foto } from "@/components/Foto";
import { PendenteTexto } from "@/components/PendenteTexto";
import { linkWhatsApp } from "@/lib/whatsapp";
import styles from "./HomeHero.module.css";

const display = localFont({ src: "../../public/fonts/instrument-serif-latin-400.woff2", weight: "400", display: "swap", variable: "--fonte-display-a1", preload: true });
const body = localFont({ src: "../../public/fonts/instrument-sans-latin-variable.woff2", weight: "400 600", display: "swap", variable: "--fonte-corpo-a1", preload: false });

export function HomeHero() {
  const pagina = conteudo.paginas.inicio;
  return (
    <header className={`home-hero ${styles.hero} ${display.variable} ${body.variable}`}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>{aberturaHome.sobretitulo}</p>
        <h1><PendenteTexto valor={pagina.titulo} /></h1>
        <div className={styles.action}>
          <p>{aberturaHome.orientacao}</p>
          <div className={styles.links}>
            <a className="button" href={linkWhatsApp(pagina.cta.mensagem, conteudo.empresa.whatsapp)}>{pagina.cta.texto}</a>
            {/* Navegacao nativa evita requisicoes RSC de segmentos ausentes no export estatico. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/materiais/">{aberturaHome.ctaSecundario}</a>
          </div>
        </div>
      </div>
      <figure className={styles.figure}>
        <div className={styles.frame}>
          <Foto id="a1-prova-01" alt={aberturaHome.alt} sizes="(max-width: 700px) 1000px, 100vw" prioridade className={styles.picture} />
        </div>
        <figcaption className={styles.caption}>
          <span><span className={styles.number}>01</span>{aberturaHome.legenda}</span>
          <span>{aberturaHome.avisoImagem}</span>
        </figcaption>
      </figure>
      <div className={styles.pending}><PendenteTexto valor={pagina.introducao} /></div>
    </header>
  );
}
