import { pendente, type Pendente } from './pendente';
import { cliente } from './cliente';

export const institucional = {
  contatoHome: { titulo: 'Sua ideia começa aqui.', texto: 'Mande uma foto ou a medida aproximada e converse com a JK sobre o seu espaço.' },
  apresentacao: cliente.apresentacao,
  hero: { titulo: 'Pedra que dá forma ao seu espaço.', local: 'Barueri, São Paulo', texto: 'Mande uma foto ou a medida do seu espaço e converse com a JK.' },
  jornadaCta: { texto: 'Chamar no WhatsApp', mensagem: 'Oi, vi as referências no site da JK e quero conversar sobre uma pedra para meu espaço.' },
  materiais: [
    { titulo: 'Aparência', texto: 'Cor, desenho dos veios e escala da chapa. Reúna referências do que você gosta e confira a amostra real antes de decidir.' },
    { titulo: 'Uso', texto: 'Conte onde a peça será usada e como faz parte da sua rotina. A indicação precisa considerar o material específico e as orientações do fornecedor.' },
    { titulo: 'Acabamento', texto: 'Superfície, espessura e perfil da borda fazem parte da escolha. Consulte as opções possíveis para o material e a aplicação.' },
  ],
  pedido: [
    { titulo: 'Conte sua ideia', texto: 'Diga qual ambiente ou peça está planejando. Se tiver uma referência ou um desenho, mencione no contato.' },
    { titulo: 'Reúna as informações', texto: 'Material de interesse, medidas aproximadas e cidade ajudam a contextualizar o pedido. Não é preciso ter tudo definido.' },
    { titulo: 'Chame a JK', texto: 'Envie sua ideia pelo WhatsApp e consulte materiais, serviços e próximos passos antes de definir o projeto.' },
  ],
  oferta: pendente('confirmar lista de serviços e aplicações executados pela JK'),
  catalogo: pendente('confirmar nomes comerciais de pedras e acabamentos trabalhados pela JK'),
  // Por categoria (T-0002): com a lista de 19/10 falta só o acabamento; lâminas já têm acabamento; dolomíticos e quartzitos ainda não têm nomes (O2).
  catalogoCategoria: <Partial<Record<string, Pendente>>>{
    granito: pendente('confirmar acabamentos trabalhados em granitos'),
    marmore: pendente('confirmar acabamentos trabalhados em mármores'),
    quartzo: pendente('confirmar acabamentos trabalhados em quartzos'),
    'marmore-dolomitico': pendente('confirmar nomes comerciais de pedras e acabamentos de mármores dolomíticos'),
    quartzito: pendente('confirmar nomes comerciais de pedras e acabamentos de quartzitos naturais'),
  },
  historia: cliente.apresentacao,
  processo: pendente('confirmar etapas de atendimento, medição, produção e instalação da JK'),
  obras: pendente('receber fotos de obras reais e autorização de uso'),
};
