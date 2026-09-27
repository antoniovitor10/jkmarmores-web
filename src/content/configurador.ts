// Referências visuais geradas por IA, independentes do catálogo comercial.
export const ambientesConfigurador = [
  { id: 'cozinha', nome: 'Cozinha com ilha' },
  { id: 'lavatorio', nome: 'Lavatório' },
] as const;
export const materiaisConfigurador = [
  { id: 'rosado', nome: 'Mármore rosado', tom: '#cfa491' },
  { id: 'bege', nome: 'Pedra bege', tom: '#c5b18d' },
  { id: 'escuro', nome: 'Pedra escura', tom: '#37322f' },
] as const;
export const acabamentosConfigurador = [
  { id: 'polido', nome: 'Polido', descricao: 'Reflexo mais definido na referência de superfície.' },
  { id: 'levigado', nome: 'Levigado', descricao: 'Superfície fosca, com reflexo mais difuso na referência.' },
  { id: 'escovado', nome: 'Escovado', descricao: 'Relevo delicado sob luz rasante na referência.' },
] as const;
export type AmbienteConfigurador = typeof ambientesConfigurador[number]['id'];
export type MaterialConfigurador = typeof materiaisConfigurador[number]['id'];
export type AcabamentoConfigurador = typeof acabamentosConfigurador[number]['id'];
export const totalQuadros = 24;
export function quadroUrl(combinacao: string, quadro: number, largura: 720 | 1280 | 2048) {
  return `/configurador/${combinacao}/${largura}/${String(quadro).padStart(2, '0')}.avif`;
}
export function orcamentoConfigurador(ambiente: string, material: string, acabamento: string, contexto?: string) {
  const mensagem = `Olá, gostaria de pedir um orçamento desta combinação ilustrativa: ambiente ${ambiente}; referência de material ${material}; acabamento ${acabamento}.${contexto ? ` Página consultada: ${contexto}.` : ''} Sei que a visualização é gerada por IA e gostaria de confirmar materiais, acabamentos e disponibilidade com a JK.`;
  return `https://wa.me/5511967976902?text=${encodeURIComponent(mensagem)}`;
}
