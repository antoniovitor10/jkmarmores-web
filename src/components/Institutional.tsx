import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo, telefoneUrl } from '@/content';
import { institucional } from '@/content/institucional';
import { stoneJourney } from '@/content/stone-journey';
import { PendenteTexto } from './PendenteTexto';
import { Foto } from './Foto';
import type { ImagemCategoria } from '@/content/categorias';

// O alt vem da jornada quando o id é um quadro dela; sem aviso de IA (ADR-0001).
export function Illustration({ id, priority = false, alt: description }: { id: string; priority?: boolean; alt?: string }) {
  const alt = description ?? stoneJourney.find(image => image.id === id)?.alt ?? '';
  return <figure className="editorial-image"><Foto id={id} alt={alt} sizes="(max-width: 700px) 100vw, 50vw" prioridade={priority} /></figure>;
}
export function SectionHeading({ title }: { number?: string; label?: string; title: string }) {
  return <div className="section-heading"><h2>{title}</h2></div>;
}
export function RequestSteps() {
  return <ol className="request-steps">{institucional.pedido.map((step, i) => <li key={step.titulo}><span className="step-number">0{i+1}</span><h3>{step.titulo}</h3><p>{step.texto}</p></li>)}</ol>;
}
export function ContactPanel() {
  return <section className="contact-panel"><div className="container contact-grid"><div><h2>Vamos conversar<br />sobre seu projeto?</h2><p>Comece pelo WhatsApp ou telefone. Conte sua ideia e consulte as possibilidades com a JK.</p><a className="contact-phone" href={telefoneUrl}><PendenteTexto valor={conteudo.empresa.telefone} /></a><a className="text-link" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a></div><div className="address-panel"><address><PendenteTexto valor={conteudo.empresa.endereco} /></address><p>Para consultar a possibilidade de visita, fale com a JK antes de se deslocar.</p><p className="editorial-note">Atendemos {typeof conteudo.empresa.regiaoAtendida === "string" ? conteudo.empresa.regiaoAtendida : <PendenteTexto valor={conteudo.empresa.regiaoAtendida} />}.</p></div></div></section>;
}
// Com imagem (páginas de categoria), o topo vira duas colunas no desktop; a imagem é a maior da primeira tela, por isso tem prioridade.
export function PageIntro({ title, description, imagem }: { label: string; title: string; description: string; imagem?: ImagemCategoria }) {
  if (!imagem) return <header className="institutional-intro"><div className="container"><h1>{title}</h1><p className="intro-description">{description}</p></div></header>;
  return <header className="institutional-intro"><div className="container intro-grid"><div><h1>{title}</h1><p className="intro-description">{description}</p></div><Foto id={imagem.id} alt={imagem.alt} className="intro-image" sizes="(max-width: 700px) 100vw, 45vw" prioridade /></div></header>;
}
