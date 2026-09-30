import { Foto } from './Foto';
import { stoneJourney } from '@/content/stone-journey';
import { SiteLink } from './SiteLink';

export function StoneEditorial() {
  return <>
    <section className="stone-signature" aria-label="JK Mármores e Granitos">
      <div className="signature-stage container">
        <h2>Seu espaço,<br />sua escolha.</h2>
        <div className="signature-copy"><p>A JK Marmores e Granitos está no Parque Viana, em Barueri. Conte sua ideia e converse sobre as possibilidades para seu projeto.</p><SiteLink className="text-link" href="/sobre/">Conheça a JK</SiteLink></div>
      </div>
    </section>
    <section className="stone-editorial" aria-labelledby="stone-title">
      <div className="container stone-heading"><h2 id="stone-title">Da matéria ao espaço.</h2><p>Quatro olhares sobre a pedra.</p></div>
      {stoneJourney.map((step, i) => <figure className={`stone-panel stone-panel-${i}`} key={step.id}>
        <div className="stone-panel-image"><Foto id={step.id} mobileId={i === 1 ? 'sequencia-02-borda-mobile' : undefined} alt={step.alt} sizes="100vw" /></div>
        <figcaption className="container"><span className="stone-index">0{i+1} / 04</span><div><h3>{step.title}</h3><p>{step.detail}</p></div></figcaption>
      </figure>)}
    </section>
  </>;
}
