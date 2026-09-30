import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { illustrationNotice } from '@/content/illustration';
import { Foto } from './Foto';
import { StoneMonogram } from './StoneMonogram';

export function HomeHero() {
  return <header className="home-hero cinema-hero">
    <div className="cinema-stage">
      <div className="cinema-signature"><StoneMonogram /></div>
      <figure className="cinema-cover"><Foto id="sequencia-01-chapa" alt="Chapa clara com veios minerais sob luz lateral. Imagem ilustrativa gerada por IA." sizes="(max-width: 700px) 1600px, 100vw" prioridade /></figure>
      <div className="cinema-intro" data-hero-intro>
        <h1>O bruto<br />vira arte.</h1>
        <p>JK Mármores e Granitos.<br />Precisão em cada detalhe, desde 2010.</p>
        <a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a>
      </div>
      <div className="cinema-foot"><p className="cinema-location">Barueri, São Paulo</p><p>{illustrationNotice}</p></div>
    </div>
  </header>;
}
