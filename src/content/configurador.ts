// Referências visuais geradas por IA, independentes do catálogo comercial.
export const ambientesConfigurador = [
  { id: "cozinha", nome: "Cozinha com ilha" },
  { id: "lavatorio", nome: "Lavatório" },
] as const;
export const materiaisConfigurador = [
  { id: "rosado", nome: "Rosado", tom: "#cfa491" },
  { id: "bege", nome: "Bege", tom: "#c5b18d" },
  { id: "escuro", nome: "Escuro", tom: "#37322f" },
] as const;
export const acabamentosConfigurador = [
  {
    id: "polido",
    nome: "Polido",
    descricao: "Reflexo mais definido na referência de superfície.",
  },
  {
    id: "levigado",
    nome: "Levigado",
    descricao: "Superfície fosca, com reflexo mais difuso na referência.",
  },
  {
    id: "escovado",
    nome: "Escovado",
    descricao: "Relevo delicado sob luz rasante na referência.",
  },
] as const;
export type AmbienteConfigurador = (typeof ambientesConfigurador)[number]["id"];
export type MaterialConfigurador = (typeof materiaisConfigurador)[number]["id"];
export type AcabamentoConfigurador =
  (typeof acabamentosConfigurador)[number]["id"];
export const totalQuadros = 24;
export function quantidadeQuadros(combinacao: string) {
  return combinacao === "cozinha-rosado" ? 48 : totalQuadros;
}
export function quadroUrl(
  combinacao: string,
  quadro: number,
  largura: 720 | 1280 | 2048 | 2560 | "retrato",
) {
  return `/configurador/uniforme/${combinacao}/${largura === 2048 ? 2560 : largura}/${String(quadro).padStart(2, "0")}.avif`;
}
export function orcamentoConfigurador(
  ambiente: string,
  material: string,
  acabamento: string,
  contexto?: string,
) {
  const mensagem = `Olá, JK! Gostei desta combinação: ${ambiente}, ${material.toLowerCase()} e acabamento ${acabamento.toLowerCase()}.${contexto ? ` Vi na página ${contexto}.` : ""} Podemos conversar sobre um orçamento? A imagem é ilustrativa; quero confirmar as opções disponíveis.`;
  return `https://wa.me/5511967976902?text=${encodeURIComponent(mensagem)}`;
}
