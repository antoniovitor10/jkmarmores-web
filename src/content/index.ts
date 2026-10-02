import type { ConteudoSite, Material, Aplicacao, PaginaInstitucional } from "@/lib/types";
import { pendente } from "./pendente";
import { cliente, materiaisCliente } from "./cliente";

const ctaOrcamento = (origem: string) => ({
  texto: "Chamar no WhatsApp",
  mensagem: origem === "início" ? "Oi, vi o site da JK e quero conversar sobre um orçamento." : `Oi, vi a página de ${origem} no site da JK e quero conversar sobre um orçamento.`,
});

const paginas: ConteudoSite["paginas"] = {
  inicio: {
    titulo: "Mármores e granitos em Barueri.",
    introducao: "A JK Mármores e Granitos está no Parque Viana, em Barueri/SP. Fale por telefone sobre o seu projeto.",
    seo: {
      titulo: "JK Mármores e Granitos | Barueri e São Paulo, desde 2010",
      descricao: "Desde 2010, projetos residenciais, comerciais e industriais. Barueri, São Paulo, Grande São Paulo, ABC, interior, litoral norte e Baixada Santista. Fale com a JK.",
      canonicalPath: "/",
    },
    secoes: [
      {
        id: "materiais",
        titulo: "Compare materiais antes de decidir",
        texto: "A aparência da amostra é só parte da escolha. Uso, acabamento, manutenção e características da chapa também importam. Veja apenas os materiais confirmados no catálogo.",
      },
      {
        id: "aplicacoes",
        titulo: "Comece pelo uso da peça",
        texto: pendente("confirmar quais aplicações a JK executa antes de apresentar caminhos por ambiente"),
      },
      {
        id: "configurador",
        titulo: "Visualize uma combinação",
        texto: "A visualização é uma referência de composição. Cor, veio e acabamento da peça final devem ser conferidos em uma amostra real antes da decisão.",
      },
      {
        id: "orcamento",
        titulo: "O que informar no primeiro contato",
        texto: "Conte qual peça ou ambiente você precisa, o material que está considerando, as medidas aproximadas e a cidade. Esses dados ajudam a iniciar a conversa; medidas finais e disponibilidade precisam de confirmação.",
        cta: ctaOrcamento("início"),
      },
      {
        id: "trabalhos",
        titulo: "Trabalhos realizados",
        texto: pendente("receber fotos de obras reais com autorização, material e aplicação para mostrar trabalhos"),
      },
      {
        id: "atendimento",
        titulo: "Onde atendemos",
        texto: "Estamos na Estrada dos Pinheiros, 379, Parque Viana, Barueri/SP. Consulte por telefone a disponibilidade de atendimento para sua cidade.",
      },
    ],
    cta: ctaOrcamento("início"),
  },
  sobre: {
    titulo: "Conheça a empresa",
    introducao: "A JK Mármores e Granitos é uma marmoraria localizada no Parque Viana, em Barueri/SP. Conheça os dados da empresa e os canais de contato.",
    seo: {
      titulo: "A empresa | JK Mármores e Granitos em Barueri",
      descricao: "Desde 2010, a JK transforma pedras naturais em expressões de personalidade, sofisticação e design. Conheça nossa história e a região atendida.",
      canonicalPath: "/sobre/",
    },
    secoes: [
      { id: "historia", titulo: "Quem somos", texto: cliente.apresentacao },
      { id: "processo", titulo: "Como funciona o atendimento", texto: pendente("confirmar etapas de orçamento, medição, produção e instalação executadas pela empresa") },
      { id: "equipe", titulo: "Pessoas e oficina", texto: pendente("receber descrição ou fotos autorizadas da equipe, oficina ou fachada") },
      { id: "regiao", titulo: "Área atendida", texto: cliente.regiao },
    ],
    cta: ctaOrcamento("sobre"),
  },
  materiais: {
    titulo: "Materiais para escolher com critério",
    introducao: cliente.materiaisIntro,
    seo: {
      titulo: "Materiais e acabamentos | JK Mármores e Granitos",
      descricao: "Mármores, granitos, mármores dolomíticos, quartzitos naturais, quartzos e lâminas ultracompactas sinterizadas. Conheça os materiais da JK.",
      canonicalPath: "/materiais/",
    },
    secoes: [
      { id: "catalogo", titulo: "Materiais disponíveis", texto: cliente.materiaisIntro },
      { id: "criterios", titulo: "O que observar", texto: "Pergunte sobre uso interno ou externo, incidência de calor, contato com alimentos, agentes de limpeza, variação de cor e veio e manutenção recomendada. A resposta depende da chapa e do fabricante." },
      { id: "acabamentos", titulo: "Acabamento muda a experiência de uso", texto: "Brilho, textura e tratamento de borda alteram aparência, toque e rotina de limpeza. Confirme quais acabamentos podem ser feitos no material escolhido." },
      { id: "amostra", titulo: "Veja a amostra real", texto: "Imagens de tela e composições ilustrativas servem para explorar possibilidades. A cor e o desenho da chapa real devem ser conferidos antes da aprovação." },
    ],
    cta: ctaOrcamento("materiais"),
  },
  aplicacoes: {
    titulo: "Escolha pela aplicação",
    introducao: pendente("confirmar aplicações executadas pela empresa antes de listar ambientes ou peças"),
    seo: {
      titulo: pendente("title de aplicações com serviços confirmados"),
      descricao: pendente("meta description de aplicações com peças realmente executadas"),
      canonicalPath: "/aplicacoes/",
    },
    secoes: [
      { id: "lista", titulo: "Aplicações atendidas", texto: pendente("confirmar quais aplicações terão páginas próprias") },
      { id: "escolha", titulo: "O que muda de uma aplicação para outra", texto: "Dimensões, recortes, apoio, exposição ao calor e à água, acabamento e instalação influenciam a especificação. A solução deve ser definida para a peça concreta." },
      { id: "orcamento", titulo: "Prepare seu pedido", texto: "Informe o ambiente, medidas aproximadas, material desejado e cidade. Se houver desenho técnico, mencione isso na conversa.", cta: ctaOrcamento("aplicações") },
    ],
    cta: ctaOrcamento("aplicações"),
  },
  galeria: {
    titulo: "Trabalhos realizados",
    introducao: pendente("receber obras reais e autorização de uso antes de publicar a galeria"),
    seo: {
      titulo: pendente("title da galeria com trabalhos reais autorizados"),
      descricao: pendente("descrição da galeria baseada no acervo autorizado"),
      canonicalPath: "/galeria/",
    },
    secoes: [
      { id: "obras", titulo: "Veja os projetos", texto: pendente("receber fotos, legendas, materiais e aplicações verificadas das obras") },
      { id: "contexto", titulo: "A escolha por trás da peça", texto: "Ao observar um trabalho, considere o ambiente, a dimensão e o acabamento. Uma foto não substitui a verificação da chapa e das condições do seu projeto." },
    ],
    cta: ctaOrcamento("galeria"),
  },
  contato: {
    titulo: "Converse sobre o seu projeto",
    introducao: "Você pode começar com uma descrição curta. Ambiente, material desejado, medidas aproximadas e cidade ajudam a organizar o pedido.",
    seo: {
      titulo: "Contato e orçamento em Barueri | JK Mármores e Granitos",
      descricao: "Fale com a JK Mármores e Granitos pelo telefone (11) 96797-6902. Endereço: Estrada dos Pinheiros, 379, Parque Viana, Barueri/SP.",
      canonicalPath: "/contato/",
    },
    secoes: [
      { id: "whatsapp", titulo: "Envie as informações pelo WhatsApp", texto: "Conte sua ideia e envie as informações do seu projeto pelo WhatsApp da JK." },
      { id: "formulario", titulo: "Monte sua mensagem", texto: "Informe ambiente ou peça, material que considera, medidas aproximadas e cidade. O formulário abre uma mensagem no WhatsApp; nenhuma informação é enviada ao site." },
      { id: "endereco", titulo: "Endereço e atendimento", texto: "Estrada dos Pinheiros, 379, Parque Viana, Barueri/SP. Ligue antes para confirmar a possibilidade de visita." },
      { id: "horario", titulo: "Horário", texto: pendente("confirmar dias e horários de atendimento") },
    ],
    cta: ctaOrcamento("contato"),
  },
};

export const aberturaHome = {
  sobretitulo: "MATÉRIA, FORMA E TEXTURA",
  orientacao: "Veja a pedra de perto. Compare materiais e acabamentos antes de decidir.",
  ctaSecundario: "Ver materiais",
  legenda: "Estudo de matéria",
  avisoImagem: "Imagem ilustrativa, gerada por IA",
  alt: "Estudo ilustrativo de uma bancada de pedra clara: veios delicados e borda em meia-esquadria sob luz lateral de manhã. Imagem gerada por IA, não representa obra da JK.",
};

const materiais: Material[] = materiaisCliente.map(item => ({
  ...item, confirmado: true, acabamentos: [], aplicacoes: [],
  seo: { titulo: item.nome + " | JK Mármores e Granitos", descricao: item.resumo + " " + item.descricao, canonicalPath: `/materiais/${item.slug}/` },
  cta: ctaOrcamento(item.nome.toLowerCase()),
}));

const aplicacoes: Aplicacao[] = [
  {
    slug: "bancadas", nome: "Bancadas", confirmado: false,
    resumo: pendente("confirmar se a empresa executa bancadas e para quais ambientes"),
    descricao: "Para especificar uma bancada, informe uso, dimensões aproximadas, cuba ou equipamento previsto e pontos de água ou calor. Material, espessura, borda e recortes dependem do projeto.",
    seo: { titulo: "Bancadas: materiais e pontos de escolha", descricao: "Saiba quais informações ajudam a especificar uma bancada e comparar materiais antes do orçamento.", canonicalPath: "/aplicacoes/bancadas/" },
    materiais: [], beneficios: [pendente("confirmar materiais indicados e tipos de bancada executados")],
    cta: ctaOrcamento("aplicação bancada"),
  },
  {
    slug: "lavatorios", nome: "Lavatórios", confirmado: false,
    resumo: pendente("confirmar se a empresa executa lavatórios"),
    descricao: "Um lavatório precisa considerar largura disponível, tipo de cuba, torneira, apoio e contato frequente com água e produtos de higiene. Recortes e acabamento mudam com cada projeto.",
    seo: { titulo: "Lavatórios: materiais e medidas", descricao: "Veja pontos de escolha para um lavatório e prepare as informações iniciais do orçamento.", canonicalPath: "/aplicacoes/lavatorios/" },
    materiais: [], beneficios: [pendente("confirmar materiais e acabamentos usados em lavatórios")],
    cta: ctaOrcamento("aplicação lavatório"),
  },
  {
    slug: "escadas", nome: "Escadas", confirmado: false,
    resumo: pendente("confirmar se a empresa executa revestimento ou peças para escadas"),
    descricao: "Degraus exigem medidas precisas, definição de borda e avaliação de aderência conforme o ambiente. O material e o acabamento precisam ser adequados ao uso previsto.",
    seo: { titulo: "Escadas: material, acabamento e segurança", descricao: "Entenda pontos que influenciam peças para escadas e informe o ambiente ao solicitar orçamento.", canonicalPath: "/aplicacoes/escadas/" },
    materiais: [], beneficios: [pendente("confirmar escopo de execução, materiais e acabamentos de escadas")],
    cta: ctaOrcamento("aplicação escada"),
  },
];

export const conteudo: ConteudoSite = {
  empresa: {
    nome: "JK Mármores e Granitos",
    razaoSocial: pendente("confirmar razão social"),
    cnpj: pendente("confirmar CNPJ"),
    telefone: "(11) 96797-6902",
    whatsapp: "5511967976902",
    email: pendente("confirmar e-mail comercial atual"),
    endereco: "Estrada dos Pinheiros, 379, Parque Viana, Barueri/SP",
    enderecoDetalhado: {
      logradouro: "Estrada dos Pinheiros",
      numero: "379",
      bairro: "Parque Viana",
      cidade: "Barueri",
      uf: "SP",
      cep: pendente("confirmar CEP"),
      atendeNoLocal: pendente("confirmar se recebe visitantes no endereço"),
    },
    cidade: "Barueri",
    regiaoAtendida: cliente.regiao,
    areaAtendida: cliente.areas,
    foundingDate: cliente.fundacao,
    horario: pendente("confirmar dias e horários de atendimento"),
    perfilGoogleUrl: pendente("confirmar posse e URL do Perfil da Empresa no Google"),
  },
  paginas,
  materiais,
  aplicacoes,
  galeria: [],
  projetos: [],
};

export type { PaginaInstitucional };

// Única origem dos links telefônicos; o canal WhatsApp tem confirmação separada.
export const telefoneUrl = typeof conteudo.empresa.telefone === "string" ? `tel:+55${conteudo.empresa.telefone.replace(/\D/g, "")}` : "/contato/";
