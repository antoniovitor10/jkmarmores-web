import { homeDisplay, homeBody, homeBodyStyles } from "./home-fonts";
import { aberturaHome, conteudo } from "@/content";
import { Foto } from "@/components/Foto";
import { PendenteTexto } from "@/components/PendenteTexto";
import { linkWhatsApp } from "@/lib/whatsapp";
import styles from "./HomeHero.module.css";

export function HomeHero() {
  const pagina = conteudo.paginas.inicio;
  return (
    <header className={`home-hero ${styles.hero} ${homeDisplay.variable} ${homeBody.variable}`}>
      <style href="home-body-type" precedence="next">{homeBodyStyles}</style>
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
          <Foto id="a1-prova-01" alt={aberturaHome.alt} sizes="(max-width: 700px) 1000px, 100vw" prioridade incorporarAvif className={styles.picture} />
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
