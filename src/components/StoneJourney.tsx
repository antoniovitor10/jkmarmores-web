import { Suspense } from "react";
import { Foto } from "./Foto";
import manifest from "@/generated/images.json";
import { JourneyImage } from "./JourneyImage";
import { homeBody, homeDisplay } from "./home-fonts";
import { stoneJourney, stoneJourneyVideo } from "@/content/stone-journey";
import { StoneJourneyMotion } from "./StoneJourneyMotion";
import "./StoneJourney.css";
import { conteudo } from "@/content";
import { institucional } from "@/content/institucional";
import { linkWhatsApp } from "@/lib/whatsapp";

export function StoneJourney() {
  return <section id="jornada-pedra" className={`stone-journey ${homeDisplay.variable} ${homeBody.variable}`} aria-labelledby="jornada-titulo">
    <Suspense><StoneJourneyMotion video={stoneJourneyVideo}>
      <div className="journey-sticky">
        <div className="journey-heading">
          <h2 id="jornada-titulo">Da chapa à sua bancada.</h2>
        </div>
        <div className="journey-frames">
          {stoneJourney.map((step, index) => <figure className="journey-frame" key={step.id} data-frame={index}>
            <DeferredImage id={step.id} alt={step.alt} />
            <figcaption>
              <span className="journey-count">0{index + 1}<span> / 04</span></span>
              <div><h3>{step.title}</h3><p>{step.detail}</p></div>
              {index === 3 && <a className="journey-quote" href={linkWhatsApp(institucional.jornadaCta.mensagem, conteudo.empresa.whatsapp)}>{institucional.jornadaCta.texto}</a>}
            </figcaption>
          </figure>)}
        </div>
        <div className="journey-progress" aria-hidden="true"><span /></div>
        <div className="journey-mask" aria-hidden="true">
          <span className="journey-word">PEDRA</span>
        </div>
      </div>
    </StoneJourneyMotion></Suspense>
  </section>;
}

function DeferredImage({ id, alt }: { id: string; alt: string }) {
  const image = (manifest as Record<string, { width: number; height: number; variantes: { width: number; avif: string; webp: string }[] }>)[id];
  if (!image) return null;
  const sizes = "(max-width: 700px) 1050px, 100vw";
  const mobileId = id === "sequencia-02-borda" ? "sequencia-02-borda-mobile" : undefined;
  const mobile = mobileId ? (manifest as typeof manifest & Record<string, typeof image>)[mobileId] : undefined;
  return <JourneyImage alt={alt} width={image.width} height={image.height} sizes={sizes} src={image.variantes.at(-1)!.webp} avif={image.variantes.map(v => `${v.avif} ${v.width}w`).join(", ")} webp={image.variantes.map(v => `${v.webp} ${v.width}w`).join(", ")} mobileAvif={mobile?.variantes.map(v => `${v.avif} ${v.width}w`).join(", ")} mobileWebp={mobile?.variantes.map(v => `${v.webp} ${v.width}w`).join(", ")}>
    <Foto id={id} mobileId={mobileId} alt={alt} sizes={sizes} />
  </JourneyImage>;
}
