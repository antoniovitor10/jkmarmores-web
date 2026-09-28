import { linkWhatsApp } from '@/lib/whatsapp';
import { conteudo, telefoneUrl } from '@/content';
import { PageIntro } from '@/components/Institutional';
import { QuoteForm } from '@/components/QuoteForm';
import { PendenteTexto } from '@/components/PendenteTexto';
import { isPendente, pendente } from '@/content/pendente';
import { metadataPagina, texto } from '@/lib/site';
export const metadata = metadataPagina(conteudo.paginas.contato.seo, '/contato/');
export default function Contato() {
  const empresa = conteudo.empresa;
  const numero = isPendente(empresa.whatsapp) ? null : empresa.whatsapp.replace(/\D/g, '');
  return <main id="conteudo"><PageIntro label="CONTATO / ORÇAMENTO" title="Vamos falar do seu projeto." description="Conte sua ideia, o ambiente ou a peça que você precisa. Converse com a JK pelo WhatsApp ou telefone." />
    <section className="container section-space contact-details"><div><a className="contact-phone" href={telefoneUrl}>{texto(empresa.telefone)}</a><p>Consulte serviços, materiais e condições de atendimento.</p><div id="whatsapp" className="channel-status"><h2>WhatsApp</h2><p>Envie suas referências e as informações do projeto.</p><a className="button" href={linkWhatsApp(conteudo.paginas.contato.cta.mensagem, empresa.whatsapp)}>Chamar no WhatsApp</a></div></div><div className="address-panel"><address>{texto(empresa.endereco)}</address><p>Ligue antes de visitar para confirmar o atendimento no local.</p><dl className="contact-facts"><dt>Horário</dt><dd><PendenteTexto valor={empresa.horario ?? pendente("confirmar horario de atendimento")} /></dd><dt>Outras cidades</dt><dd><PendenteTexto valor={empresa.regiaoAtendida} /></dd><dt>CEP</dt><dd><PendenteTexto valor={empresa.enderecoDetalhado?.cep ?? pendente("confirmar CEP")} /></dd></dl></div></section>
    <section className="warm-section section-space"><div className="container form-layout"><div><h2>Prepare seu<br />primeiro contato.</h2><p>Ambiente, material, medidas aproximadas e cidade ajudam a organizar a conversa.</p><p>O formulário prepara a mensagem no WhatsApp. Você revisa e confirma o envio no aplicativo; nenhum dado é armazenado pelo site.</p></div><div><QuoteForm numero={numero} /><noscript><p>Para montar a mensagem com o formulário, ative o JavaScript ou <a href={linkWhatsApp(conteudo.paginas.contato.cta.mensagem, empresa.whatsapp)}>abra o WhatsApp diretamente</a>.</p></noscript></div></div></section>
  </main>;
}
