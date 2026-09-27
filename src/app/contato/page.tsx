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
  return <main id="conteudo"><PageIntro label="CONTATO / ORÇAMENTO" title="Vamos falar do seu projeto." description="Conte sua ideia, o ambiente ou a peça que você precisa. O telefone é o canal confirmado para conversar com a JK." />
    <section className="container section-space contact-details"><div><p className="eyebrow">LIGUE PARA A JK</p><a className="contact-phone" href={telefoneUrl}>{texto(empresa.telefone)}</a><p>Consulte serviços, materiais e condições de atendimento.</p><div id="whatsapp" className="channel-status"><h2>WhatsApp</h2><p>Este canal aguarda confirmação. Por enquanto, use o telefone acima.</p><p className="editorial-note"><PendenteTexto valor={empresa.whatsapp} /></p></div></div><div className="address-panel"><p className="eyebrow">ENDEREÇO</p><address>{texto(empresa.endereco)}</address><p>Ligue antes de visitar para confirmar o atendimento no local.</p><dl className="contact-facts"><dt>Horário</dt><dd><PendenteTexto valor={empresa.horario ?? pendente("confirmar horario de atendimento")} /></dd><dt>Outras cidades</dt><dd><PendenteTexto valor={empresa.regiaoAtendida} /></dd><dt>CEP</dt><dd><PendenteTexto valor={empresa.enderecoDetalhado?.cep ?? pendente("confirmar CEP")} /></dd></dl></div></section>
    <section className="warm-section section-space"><div className="container form-layout"><div><p className="eyebrow">ORGANIZE AS INFORMAÇÕES</p><h2>Prepare seu<br />primeiro contato.</h2><p>Ambiente, material, medidas aproximadas e cidade ajudam a organizar a conversa.</p><p>O formulário prepara um rascunho no seu navegador. O envio pelo WhatsApp depende da confirmação do número; nenhum dado é armazenado pelo site.</p></div><div><QuoteForm numero={numero} /><noscript><p>Para montar o rascunho, ative o JavaScript. Você também pode ligar diretamente para (11) 96797-6902.</p></noscript></div></div></section>
  </main>;
}
