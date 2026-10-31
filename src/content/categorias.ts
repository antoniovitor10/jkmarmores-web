// Imagem de cada categoria de material (HU-0001, T-0004): o mesmo arquivo serve ao cartão de /materiais/ e ao topo da página.
// Imagens geradas pelo Codex; registro em docs/proposta/hu-0001-prompts.json. O alt descreve a cena sem dizer que é obra da JK.
export type ImagemCategoria = { id: string; alt: string };

export const imagensCategorias: Record<string, ImagemCategoria> = {
  marmore: { id: 'categoria-marmore', alt: 'Bancada de banheiro e parede em mármore Carrara, branco com veios cinza, sob luz lateral.' },
  granito: { id: 'categoria-granito', alt: 'Bancada de cozinha em granito Cinza Corumbá, cinza claro com grãos pretos, sob luz lateral.' },
  'marmore-dolomitico': { id: 'categoria-marmore-dolomitico', alt: 'Ilha de cozinha em mármore dolomítico branco com veios cinza suaves, sob luz lateral.' },
  quartzito: { id: 'categoria-quartzito', alt: 'Parede e prateleira em quartzito natural com veios amplos em cinza e mel, sob luz lateral.' },
  quartzo: { id: 'categoria-quartzo', alt: 'Bancada de cozinha em quartzo branco com pequenos grãos translúcidos, sob luz lateral.' },
  ultracompacto: { id: 'categoria-ultracompacto', alt: 'Parede e bancada em lâmina ultracompacta clara com veios suaves cor de mel, sob luz lateral.' },
};
