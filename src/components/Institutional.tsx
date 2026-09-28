import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo, telefoneUrl } from '@/content';
import { institucional } from '@/content/institucional';
import { stoneJourney } from '@/content/stone-journey';
import { PendenteTexto } from './PendenteTexto';
import { Foto } from './Foto';

export function Illustration({ id, caption = 'Imagem ilustrativa, gerada por IA. Não representa obra da JK.', priority = false, alt: description }: { id: string; caption?: string; priority?: boolean; alt?: string }) {
  const alt = description ?? stoneJourney.find(image => image.id === id)?.alt ?? caption;
  return <figure className="editorial-image"><Foto id={id} alt={alt} sizes="(max-width: 700px) 100vw, 50vw" prioridade={priority} /></figure>;
}
export function SectionHeading({ title }: { number?: string; label?: string; title: string }) {
  return <div className="section-heading"><h2>{title}</h2></div>;
}
export function RequestSteps() {
  return <ol className="request-steps">{institucional.pedido.map((step, i) => <li key={step.titulo}><span className="step-number">0{i+1}</span><h3>{step.titulo}</h3><p>{step.texto}</p></li>)}</ol>;
}
export function ContactPanel() {
  return <section className="contact-panel"><div className="container contact-grid"><div><p className="eyebrow">JK EM BARUERI</p><h2>Vamos conversar<br />sobre seu projeto?</h2><p>Comece pelo WhatsApp ou telefone. Conte sua ideia e consulte as possibilidades com a JK.</p><a className="contact-phone" href={telefoneUrl}><PendenteTexto valor={conteudo.empresa.telefone} /></a><a className="text-link" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a></div><div className="address-panel"><p className="eyebrow">ONDE ESTAMOS</p><address><PendenteTexto valor={conteudo.empresa.endereco} /></address><p>Para visitar ou consultar atendimento em outra cidade, fale com a JK antes de se deslocar.</p><p className="editorial-note"><PendenteTexto valor={conteudo.empresa.regiaoAtendida} /></p></div></div></section>;
}
export function PageIntro({ label, title, description }: { label: string; title: string; description: string }) {
  return <header className="institutional-intro"><div className="container"><p className="eyebrow">{label}</p><h1>{title}</h1><p className="intro-description">{description}</p></div></header>;
}
