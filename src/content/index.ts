import type { ConteudoSite, Material, Aplicacao, PaginaInstitucional } from "@/lib/types";
import { pendente } from "./pendente";

const ctaOrcamento = (origem: string) => ({
  texto: "Pedir orçamento",
  mensagem: `Olá. Vim da página ${origem} e quero conversar sobre um projeto. Posso informar ambiente, material que estou considerando, medidas aproximadas e cidade.`,
});

const paginas: ConteudoSite["paginas"] = {
  inicio: {
    titulo: "Seu projeto começa com uma escolha bem informada",
    introducao: pendente("confirmar serviço principal, cidade e área atendida para a abertura da home"),
    seo: {
      titulo: pendente("title da home com nome comercial, serviço e cidade confirmados"),
      descricao: pendente("meta description da home com oferta, localidade e diferencial verificáveis"),
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
        texto: pendente("confirmar cidade, endereço ou modalidade de atendimento e região atendida"),
      },
    ],
    cta: ctaOrcamento("início"),
  },
  sobre: {
    titulo: "Conheça a empresa",
    introducao: pendente("confirmar história, responsável e trajetória da empresa"),
    seo: {
      titulo: pendente("title da página Sobre com nome comercial confirmado"),
      descricao: pendente("descrição da empresa baseada na história e no processo confirmados"),
      canonicalPath: "/sobre/",
    },
    secoes: [
      { id: "historia", titulo: "Quem somos", texto: pendente("receber história da empresa sem inventar anos de atuação ou equipe") },
      { id: "processo", titulo: "Como funciona o atendimento", texto: pendente("confirmar etapas de orçamento, medição, produção e instalação executadas pela empresa") },
      { id: "equipe", titulo: "Pessoas e oficina", texto: pendente("receber descrição ou fotos autorizadas da equipe, oficina ou fachada") },
      { id: "regiao", titulo: "Área atendida", texto: pendente("confirmar cidades atendidas e se há atendimento presencial no endereço") },
    ],
    cta: ctaOrcamento("sobre"),
  },
  materiais: {
    titulo: "Materiais para escolher com critério",
    introducao: "Cada tipo de superfície pede uma avaliação de uso, acabamento e cuidados. As fichas abaixo só aparecem depois da confirmação de que o material faz parte da oferta.",
    seo: {
      titulo: "Materiais e acabamentos | Guia de escolha",
      descricao: "Entenda diferenças gerais entre materiais, acabamento e cuidados. Consulte as opções confirmadas para o seu projeto.",
      canonicalPath: "/materiais/",
    },
    secoes: [
      { id: "catalogo", titulo: "Materiais disponíveis", texto: pendente("confirmar lista de materiais e nomes comerciais trabalhados pela empresa") },
      { id: "criterios", titulo: "O que observar", texto: "Pergunte sobre uso interno ou externo, incidência de calor, contato com alimentos, agentes de limpeza, variação de cor e veio e manutenção recomendada. A resposta depende da chapa e do fabricante." },
      { id: "acabamentos", titulo: "Acabamento muda a experiência de uso", texto: "Brilho, textura e tratamento de borda alteram aparência, toque e rotina de limpeza. Confirme quais acabamentos podem ser feitos no material escolhido." },
      { id: "amostra", titulo: "Veja a amostra real", texto: "Imagens de tela e visualização 3D servem para explorar possibilidades. A cor e o desenho da chapa real devem ser conferidos antes da aprovação." },
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
      titulo: pendente("title do contato com nome comercial e cidade confirmados"),
      descricao: pendente("meta description do contato com canal e área atendida confirmados"),
      canonicalPath: "/contato/",
    },
    secoes: [
      { id: "whatsapp", titulo: "Envie as informações pelo WhatsApp", texto: pendente("confirmar número de WhatsApp e se a empresa recebe pedidos de orçamento por esse canal") },
      { id: "formulario", titulo: "Monte sua mensagem", texto: "Informe ambiente ou peça, material que considera, medidas aproximadas e cidade. O formulário abre uma mensagem no WhatsApp; nenhuma informação é enviada ao site." },
      { id: "endereco", titulo: "Endereço e atendimento", texto: pendente("confirmar endereço completo e se a empresa recebe visitantes; exibir mapa apenas se aplicável") },
      { id: "horario", titulo: "Horário", texto: pendente("confirmar dias e horários de atendimento") },
    ],
    cta: ctaOrcamento("contato"),
  },
};

const materiais: Material[] = [
  {
    slug: "granito", nome: "Granito", tipo: "granito", confirmado: false,
    resumo: "Rocha natural que pode apresentar variação de cor e desenho entre chapas.",
    descricao: "Granitos são rochas naturais com composições e aparências variadas. A escolha para uma bancada ou revestimento deve considerar a chapa específica, sua porosidade, o acabamento e as orientações de manutenção.",
    seo: { titulo: "Granito: aparência, uso e cuidados", descricao: "Entenda pontos de escolha do granito e confira amostra, acabamento e cuidados da chapa antes do orçamento.", canonicalPath: "/materiais/granito/" },
    acabamentos: [], aplicacoes: [],
    caracteristicas: ["Desenho e tonalidade variam entre chapas.", pendente("confirmar nomes comerciais, chapas e acabamentos de granito oferecidos")],
    cuidados: ["Limpe com produto recomendado para a pedra e evite assumir que todas as chapas têm a mesma absorção."],
    cta: ctaOrcamento("material granito"),
  },
  {
    slug: "marmore", nome: "Mármore", tipo: "marmore", confirmado: false,
    resumo: "Rocha natural com veios e variação própria de cada chapa.",
    descricao: "Mármores costumam conter minerais carbonáticos e podem reagir a ácidos. A indicação de uso depende da peça, do acabamento e da tolerância à manutenção; confirme a ficha da chapa antes de decidir.",
    seo: { titulo: "Mármore: aparência, uso e cuidados", descricao: "Veja o que considerar ao escolher mármore: chapa real, sensibilidade a ácidos, acabamento e manutenção.", canonicalPath: "/materiais/marmore/" },
    acabamentos: [], aplicacoes: [],
    caracteristicas: ["Cada chapa tem veios próprios.", pendente("confirmar nomes comerciais, chapas e acabamentos de mármore oferecidos")],
    cuidados: ["Evite contato prolongado com produtos ácidos e siga as instruções específicas do fornecedor."],
    cta: ctaOrcamento("material mármore"),
  },
  {
    slug: "quartzito", nome: "Quartzito", tipo: "quartzito", confirmado: false,
    resumo: "Rocha natural cuja resistência e absorção devem ser verificadas por variedade e chapa.",
    descricao: "Quartzitos apresentam desenhos naturais diversos. A composição, a absorção e a indicação para calor ou área externa variam; não basta o nome da categoria para escolher a aplicação.",
    seo: { titulo: "Quartzito: aparência, uso e cuidados", descricao: "Conheça critérios para avaliar quartzito, acabamento e aplicação com base na chapa e na ficha técnica.", canonicalPath: "/materiais/quartzito/" },
    acabamentos: [], aplicacoes: [],
    caracteristicas: ["Variação natural de veios e cor.", pendente("confirmar nomes comerciais, chapas e acabamentos de quartzito oferecidos")],
    cuidados: ["Confirme limpeza, impermeabilização e restrições com o fornecedor da chapa escolhida."],
    cta: ctaOrcamento("material quartzito"),
  },
  {
    slug: "quartzo", nome: "Quartzo industrializado", tipo: "quartzo", confirmado: false,
    resumo: "Superfície industrializada com propriedades definidas pelo fabricante.",
    descricao: "Superfícies de quartzo industrializado combinam minerais e ligantes. A tolerância a calor, luz solar e produtos de limpeza depende da marca e da linha; consulte a documentação do fabricante.",
    seo: { titulo: "Quartzo industrializado: uso e cuidados", descricao: "Entenda critérios para escolher uma superfície de quartzo industrializado e confirme a ficha do fabricante.", canonicalPath: "/materiais/quartzo/" },
    acabamentos: [], aplicacoes: [],
    caracteristicas: ["Cores e padrões dependem da linha e do fabricante.", pendente("confirmar marcas, linhas e acabamentos de quartzo oferecidos")],
    cuidados: ["Não apoie recipientes muito quentes sem proteção e siga a orientação da marca sobre exposição externa."],
    cta: ctaOrcamento("material quartzo industrializado"),
  },
  {
    slug: "ultracompacto", nome: "Ultracompacto", tipo: "ultracompacto", confirmado: false,
    resumo: "Categoria de superfícies industrializadas com linhas e especificações distintas.",
    descricao: "Materiais ultracompactos são fabricados por processos industriais e variam por marca, espessura e linha. Resistência, bordas, recortes e indicação de uso devem ser conferidos na ficha técnica do produto exato.",
    seo: { titulo: "Ultracompacto: especificação e cuidados", descricao: "Compare as especificações da linha ultracompacta antes de definir uso, acabamento e manutenção.", canonicalPath: "/materiais/ultracompacto/" },
    acabamentos: [], aplicacoes: [],
    caracteristicas: ["Espessura e padrões variam por fabricante.", pendente("confirmar marcas, linhas e acabamentos de ultracompacto oferecidos")],
    cuidados: ["Siga as recomendações de corte, instalação e limpeza da linha selecionada."],
    cta: ctaOrcamento("material ultracompacto"),
  },
];

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
    nome: pendente("confirmar nome comercial exato e grafia"),
    razaoSocial: pendente("confirmar razão social"),
    cnpj: pendente("confirmar CNPJ"),
    telefone: pendente("confirmar telefone comercial"),
    whatsapp: pendente("confirmar número de WhatsApp e se é o mesmo do telefone"),
    email: pendente("confirmar e-mail comercial atual"),
    endereco: pendente("confirmar endereço completo ou informar que não atende no local"),
    enderecoDetalhado: {
      logradouro: pendente("confirmar logradouro"),
      numero: pendente("confirmar número do endereço"),
      bairro: pendente("confirmar bairro"),
      cidade: pendente("confirmar cidade do endereço"),
      uf: pendente("confirmar UF"),
      cep: pendente("confirmar CEP"),
      atendeNoLocal: pendente("confirmar se recebe visitantes no endereço"),
    },
    cidade: pendente("confirmar cidade sede da empresa"),
    regiaoAtendida: pendente("confirmar região e cidades efetivamente atendidas"),
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
