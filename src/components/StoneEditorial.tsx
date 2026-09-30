import { Foto } from './Foto';
import { asset } from '@/lib/base-path';
import { stoneJourney } from '@/content/stone-journey';

export function StoneEditorial() {
  return <>
    <section className="stone-signature" aria-label="JK Mármores e Granitos">
      <div className="signature-stage container">
        <div className="signature-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/brand/jk-monograma-240.webp')} alt="JK, monograma com textura de pedra da marca" width={240} height={146} loading="lazy" />
          <p>MÁRMORES E GRANITOS</p>
        </div>
        <div className="signature-copy"><h2>O desenho.<br />A luz.<br />A matéria.</h2><p>Um olhar de perto sobre os detalhes que fazem parte da escolha de uma pedra.</p><a className="text-link" href="#configurador">Explore as referências</a></div>
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
