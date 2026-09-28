import { pendente } from './pendente';

export const institucional = {
  contatoHome: { titulo: 'Sua ideia começa aqui.', texto: 'Mande uma foto ou a medida aproximada e converse com a JK sobre o seu espaço.' },
  apresentacao: 'A JK Marmores e Granitos é uma marmoraria em Barueri, no bairro Parque Viana. Conheça nosso endereço e fale por telefone sobre o seu projeto.',
  hero: { titulo: 'Mármores e granitos em Barueri.', local: 'Barueri, São Paulo', texto: 'Mande uma foto ou a medida do seu espaço e converse com a JK.' },
  jornadaCta: { texto: 'Chamar no WhatsApp', mensagem: 'Oi, vi as referências no site da JK e quero conversar sobre uma pedra para meu espaço.' },
  materiais: [
    { titulo: 'Aparência', texto: 'Cor, desenho dos veios e escala da chapa. Reúna referências do que você gosta e confira a amostra real antes de decidir.' },
    { titulo: 'Uso', texto: 'Conte onde a peça será usada e como faz parte da sua rotina. A indicação precisa considerar o material específico e as orientações do fornecedor.' },
    { titulo: 'Acabamento', texto: 'Superfície, espessura e perfil da borda fazem parte da escolha. Consulte as opções possíveis para o material e a aplicação.' },
  ],
  pedido: [
    { titulo: 'Conte sua ideia', texto: 'Diga qual ambiente ou peça está planejando. Se tiver uma referência ou um desenho, mencione no contato.' },
    { titulo: 'Reúna as informações', texto: 'Material de interesse, medidas aproximadas e cidade ajudam a contextualizar o pedido. Não é preciso ter tudo definido.' },
    { titulo: 'Converse com a JK', texto: 'Ligue para consultar serviços, materiais e próximos passos. Confirme as condições antes de definir o projeto.' },
  ],
  oferta: pendente('confirmar lista de serviços e aplicações executados pela JK'),
  catalogo: pendente('receber lista de materiais, nomes comerciais e acabamentos trabalhados pela JK'),
  historia: pendente('receber história, trajetória e apresentação da equipe da JK'),
  processo: pendente('confirmar etapas de atendimento, medição, produção e instalação da JK'),
  obras: pendente('receber fotos de obras reais e autorização de uso'),
};
