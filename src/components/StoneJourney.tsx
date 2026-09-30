import { asset, assetSrcSet } from "@/lib/base-path";
import { Foto } from "./Foto";
import manifest from "@/generated/images.json";
import { JourneyImage } from "./JourneyImage";
import { stoneJourney } from "@/content/stone-journey";
import "./StoneJourney.css";
import { conteudo } from "@/content";
import { institucional } from "@/content/institucional";
import { linkWhatsApp } from "@/lib/whatsapp";

export function StoneJourney() {
  return <section id="jornada-pedra" className="stone-journey" aria-labelledby="jornada-titulo">
    <div className="journey-track">
      <noscript><style>{`.journey-media > picture { display:none; } .journey-frame noscript { display:contents; }`}</style></noscript>
      <div className="journey-sticky">
        <div className="journey-heading">
          <h2 id="jornada-titulo">Da matéria ao espaço.</h2>
        </div>
        <div className="journey-frames">
          {stoneJourney.map((step, index) => <figure className="journey-frame" key={step.id} data-frame={index}>
            <div className="journey-media"><DeferredImage id={step.id} alt={step.alt} /></div>
            <figcaption>
              <span className="journey-count">0{index + 1}<span> / 04</span></span>
              <div><h3>{step.title}</h3><p>{step.detail}</p></div>
              {index === 3 && <a className="journey-quote" href={linkWhatsApp(institucional.jornadaCta.mensagem, conteudo.empresa.whatsapp)}>{institucional.jornadaCta.texto}</a>}
            </figcaption>
          </figure>)}
        </div>
        <div className="journey-progress" aria-hidden="true">{stoneJourney.map(step => <span key={step.id}><i /></span>)}</div>
        <div className="journey-exit" aria-hidden="true" />
      </div>
    </div>
  </section>;
}

function DeferredImage({ id, alt }: { id: string; alt: string }) {
  const image = (manifest as Record<string, { width: number; height: number; variantes: { width: number; avif: string; webp: string }[] }>)[id];
  if (!image) return null;
  const sizes = "(max-width: 700px) 960px, 100vw";
  const mobileId = id === "sequencia-02-borda" ? "sequencia-02-borda-mobile" : undefined;
  const mobile = mobileId ? (manifest as typeof manifest & Record<string, typeof image>)[mobileId] : undefined;
  return <JourneyImage alt={alt} width={image.width} height={image.height} sizes={sizes} src={asset(image.variantes.at(-1)!.webp)} avif={assetSrcSet(image.variantes.map(v => `${v.avif} ${v.width}w`).join(", "))} webp={assetSrcSet(image.variantes.map(v => `${v.webp} ${v.width}w`).join(", "))} mobileAvif={mobile ? assetSrcSet(mobile.variantes.map(v => `${v.avif} ${v.width}w`).join(", ")) : undefined} mobileWebp={mobile ? assetSrcSet(mobile.variantes.map(v => `${v.webp} ${v.width}w`).join(", ")) : undefined}>
    <Foto id={id} mobileId={mobileId} alt={alt} sizes={sizes} />
  </JourneyImage>;
}
