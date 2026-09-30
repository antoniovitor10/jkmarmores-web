import { Foto } from './Foto';
import { cliente } from '@/content/cliente';
import { stoneJourney } from '@/content/stone-journey';
import { SiteLink } from './SiteLink';

export function StoneEditorial() {
  return <>
    <section className="stone-signature light-transition" aria-label="JK Mármores e Granitos">
      <span className="section-light" aria-hidden="true" />
      <div className="signature-stage container">
        <h2>Onde a matéria-prima<br />encontra a precisão.<br /><em>E o bruto vira arte.</em></h2>
        <div className="signature-copy"><p className="signature-date">DESDE 2010</p><p>{cliente.apresentacao}</p><p>{cliente.projetos}</p><SiteLink className="text-link" href="/sobre/">Conheça a JK</SiteLink></div>
      </div>
    </section>
    <section className="stone-editorial" aria-labelledby="stone-title">
      <div className="container stone-heading"><h2 id="stone-title">Da matéria ao espaço.</h2><p>Quatro olhares sobre a pedra.</p></div>
      {stoneJourney.map((step, i) => <figure className={`stone-panel stone-panel-${i}`} key={step.id}>
        <div className="stone-panel-cut"><div className="stone-panel-image"><Foto id={step.id} mobileId={i === 1 ? 'sequencia-02-borda-mobile' : undefined} alt={step.alt} sizes="100vw" /></div></div>
        <figcaption className="container"><span className="stone-index">0{i+1} / 04</span><div><h3><span>{step.title}</span></h3><p>{step.detail}</p></div></figcaption>
      </figure>)}
    </section>
  </>;
}
