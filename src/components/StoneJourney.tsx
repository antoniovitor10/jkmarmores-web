import { Foto } from "./Foto";
import manifest from "@/generated/images.json";
import { JourneyImage } from "./JourneyImage";
import { homeBody, homeDisplay } from "./home-fonts";
import { stoneJourney, stoneJourneyVideo } from "@/content/stone-journey";
import { StoneJourneyMotion } from "./StoneJourneyMotion";
import "./StoneJourney.css";

export function StoneJourney() {
  return <section id="jornada-pedra" className={`stone-journey ${homeDisplay.variable} ${homeBody.variable}`} aria-labelledby="jornada-titulo">
    <StoneJourneyMotion video={stoneJourneyVideo}>
      <div className="journey-sticky">
        <div className="journey-heading">
          <p>ESTUDO DE MATÉRIA</p>
          <h2 id="jornada-titulo">Da matéria à forma.</h2>
          <p className="journey-disclaimer">Imagens ilustrativas, geradas por IA.<br />Não representam obras, materiais ou processos da JK.</p>
        </div>
        <div className="journey-frames">
          {stoneJourney.map((step, index) => <figure className="journey-frame" key={step.id} data-frame={index}>
            <DeferredImage id={step.id} alt={step.alt} />
            <figcaption>
              <span className="journey-count">0{index + 1}<span> / 04</span></span>
              <div><h3>{step.title}</h3><p>{step.detail}</p></div>
              <span className="journey-image-label">Imagem ilustrativa</span>
            </figcaption>
          </figure>)}
        </div>
        <div className="journey-progress" aria-hidden="true"><span /></div>
        <div className="journey-mask" aria-hidden="true">
          <span className="journey-mask-kicker">UM OUTRO OLHAR SOBRE A</span>
          <span className="journey-word">PEDRA</span>
          <span className="journey-mask-footer">Da escala da chapa ao detalhe da superfície.<br />Continue a rolagem.</span>
        </div>
      </div>
    </StoneJourneyMotion>
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
