import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo } from '@/content';
import { illustrationNotice } from '@/content/illustration';
import { Foto } from './Foto';
import { StoneMonogram } from './StoneMonogram';

export function HomeHero() {
  return <header className="home-hero cinema-hero">
    <div className="cinema-stage">
      <div className="cinema-signature"><StoneMonogram /></div>
      <figure className="cinema-cover"><Foto id="sequencia-01-chapa" alt="Chapa clara com veios minerais sob luz lateral. Imagem ilustrativa gerada por IA." sizes="100vw" prioridade /></figure>
      <div className="cinema-intro" data-hero-intro>
        <p className="cinema-location">JK Mármores e Granitos · Barueri</p>
        <h1>O espaço começa<br />na pedra.</h1>
        <p>Uma escolha que muda o seu olhar.<br />Encontre uma referência para o seu projeto.</p>
        <a className="button" href={linkWhatsApp(conteudo.paginas.inicio.cta.mensagem, conteudo.empresa.whatsapp)}>Chamar no WhatsApp</a>
      </div>
      <div className="cinema-foot"><a href="#jornada-pedra">Conheça a matéria</a><p>{illustrationNotice}</p></div>
      <div className="cinema-next" aria-hidden="true"><Foto id="sequencia-01-chapa" alt="" sizes="100vw" /></div>
    </div>
  </header>;
}
