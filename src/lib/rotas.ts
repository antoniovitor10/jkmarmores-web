// T-0013: nome e página de cima de cada rota, para a seta de voltar.
import { materiaisCliente } from '@/content/cliente';

// Nomes curtos dos materiais, usados no menu do celular e na seta de voltar.
export const nomeCurtoMaterial: Record<string, string> = {
  marmore: 'Mármores',
  granito: 'Granitos',
  'marmore-dolomitico': 'Dolomíticos',
  quartzito: 'Quartzitos',
  quartzo: 'Quartzos',
  ultracompacto: 'Lâminas',
};

const fixas: Record<string, string> = {
  '/': 'Início',
  '/materiais/': 'Materiais',
  '/sobre/': 'A empresa',
  '/contato/': 'Contato',
  '/aplicacoes/': 'Aplicações',
  '/galeria/': 'Galeria',
};

const comBarra = (caminho: string) => (caminho.endsWith('/') ? caminho : `${caminho}/`);

/** Nome da página de um caminho do site (sem o prefixo de publicação), ou null se não for conhecida. */
export function nomeRota(caminho: string): string | null {
  const c = comBarra(caminho);
  if (fixas[c]) return fixas[c];
  const material = c.match(/^\/materiais\/([^/]+)\/$/)?.[1];
  if (material && materiaisCliente.some((m) => m.slug === material)) return nomeCurtoMaterial[material] ?? null;
  if (/^\/aplicacoes\/[^/]+\/$/.test(c)) return 'Aplicação';
  return null;
}

/** Página de cima: categoria → Materiais, aplicação → Aplicações, o resto → Início. */
export function paiRota(caminho: string): { href: string; nome: string } {
  const c = comBarra(caminho);
  if (/^\/materiais\/[^/]+\/$/.test(c)) return { href: '/materiais/', nome: 'Materiais' };
  if (/^\/aplicacoes\/[^/]+\/$/.test(c)) return { href: '/aplicacoes/', nome: 'Aplicações' };
  return { href: '/', nome: 'Início' };
}
