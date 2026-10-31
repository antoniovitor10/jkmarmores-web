// Pedras que a JK trabalha (lista enviada pela cliente em 19/10/2026; HU-0001, T-0002).
// Os dados ficam em pedras.json para o scripts/check-pedras.mjs ler sem TypeScript.
import dados from './pedras.json';
import manifesto from '@/generated/images.json';

export type CategoriaPedra = 'granito' | 'marmore' | 'quartzo' | 'ultracompacto';
export type Pedra = {
  slug: string;
  nome: string;
  categoria: CategoriaPedra;
  grupo?: 'Mármores nacionais' | 'Mármores importados';
  oculta?: boolean;
};

export const pedras = dados as Pedra[];
export const gruposMarmore = ['Mármores nacionais', 'Mármores importados'] as const;

// Linha acima dos cartões, quando a cliente informou o acabamento da categoria.
export const acabamentosCategoria: Partial<Record<CategoriaPedra, string>> = {
  ultracompacto: 'Acabamentos polido e acetinado.',
};
export const outrasPedras = 'Trabalhamos com outras pedras; pergunte pelo WhatsApp.';
// Título da lista nas categorias sem grupos (mantém a ordem H1 → H2 → H3 dos cartões).
export const tituloPedras = 'Pedras';

const rotuloCategoria: Record<CategoriaPedra, string> = { granito: 'granito', marmore: 'mármore', quartzo: 'quartzo', ultracompacto: 'lâmina' };

export const imagemPedra = (pedra: Pedra) => `pedra-${pedra.slug}`;

// Uma pedra só aparece se não estiver oculta e já tiver imagem no build (PRD D2).
export function pedrasVisiveis(categoria: string) {
  const imagens = manifesto as Record<string, unknown>;
  return pedras.filter((pedra) => pedra.categoria === categoria && !pedra.oculta && imagens[imagemPedra(pedra)]);
}

// Nome repetido em mais de uma categoria (hoje só Calacatta) leva a categoria na mensagem (PRD, P1).
export function mensagemPedra(pedra: Pedra) {
  const repetido = pedras.filter((outra) => outra.nome === pedra.nome).length > 1;
  const nome = repetido ? `${pedra.nome} (${rotuloCategoria[pedra.categoria]})` : pedra.nome;
  return `Olá, JK! Tenho interesse no(a) ${nome}. Vi no site.`;
}

// O alt descreve a imagem sem dizer que é obra da JK.
export function altPedra(pedra: Pedra) {
  if (pedra.categoria === 'ultracompacto') return `Close da superfície de lâmina ultracompacta ${pedra.nome.replace(/^Lâmina /, '')}.`;
  const tipo = rotuloCategoria[pedra.categoria];
  const nome = pedra.nome.toLowerCase().startsWith(tipo) ? pedra.nome.replace(/^\S+\s/, '') : pedra.nome;
  return `Close da chapa de ${tipo} ${nome}.`;
}
