import { asset } from "@/lib/base-path";
﻿// Referências ilustrativas; a JK ainda confirmará seu catálogo comercial.
export const ambientesConfigurador = [
  { id: "cozinha", nome: "Cozinha com ilha" },
  { id: "lavatorio", nome: "Lavatório" },
] as const;
export const materiaisConfigurador = [
  { id: "rosado", nome: "Rosado" },
  { id: "bege", nome: "Bege" },
  { id: "escuro", nome: "Escuro" },
] as const;
export type AmbienteConfigurador = (typeof ambientesConfigurador)[number]["id"];
export type MaterialConfigurador = (typeof materiaisConfigurador)[number]["id"];
export type Escolha = {
  ambiente: AmbienteConfigurador;
  material: MaterialConfigurador;
};
export const escolhaInicial: Escolha = {
  ambiente: "cozinha",
  material: "rosado",
};
export const tamanhosImagem = "(max-width: 1280px) 100vw, 1280px";
export function imagemEscolha(escolha: Escolha, largura: 720 | 1280) {
  return asset(`/configurador/estatico/${escolha.ambiente}-${escolha.material}-${largura}.avif`);
}
export function fontesImagem(escolha: Escolha) {
  return `${imagemEscolha(escolha, 720)} 720w, ${imagemEscolha(escolha, 1280)} 1280w`;
}
export function nomeEscolha(escolha: Escolha) {
  return `${ambientesConfigurador.find((item) => item.id === escolha.ambiente)!.nome} / ${materiaisConfigurador.find((item) => item.id === escolha.material)!.nome}`;
}
export function orcamentoConfigurador(escolha: Escolha, contexto?: string) {
  const mensagem = `Olá, JK! Gostei desta referência: ${nomeEscolha(escolha)}.${contexto ? ` Vi na página ${contexto}.` : ""} Podemos conversar sobre um orçamento?`;
  return `https://wa.me/5511967976902?text=${encodeURIComponent(mensagem)}`;
}
