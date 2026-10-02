import type { Metadata } from "next";
import { isPendente } from "@/content/pendente";
import type { SeoPagina, Texto } from "@/lib/types";
import { asset } from './base-path';

export const siteUrl = "https://jkmarmores.com.br";
export const siteMode = process.env.SITE_MODE === "producao" ? "producao" : "homolog";
export const isHomolog = siteMode === "homolog";
export const isProducao = siteMode === "producao";

const tituloPadrao = "JK Mármores e Granitos | Mármores e granitos em Barueri/SP";
const descricaoPadrao = "Desde 2010, a JK Mármores e Granitos transforma pedras naturais em projetos residenciais, comerciais e industriais em São Paulo, Grande São Paulo, ABC, interior, litoral norte e Baixada Santista.";

// Em homologação a pendência aparece; em produção some (usa o fallback, vazio por padrão).
export function texto(valor: Texto, fallback = ""): string {
  if (!isPendente(valor)) return valor;
  return isHomolog ? `Pendente: ${valor.descricao}` : fallback;
}

export function urlPagina(caminho: string): string {
  return new URL(asset(caminho.endsWith("/") ? caminho : `${caminho}/`), siteUrl).toString();
}

// indexavel=false: página sem conteúdo confirmado fica fora do Google mesmo em produção.
export function metadataPagina(seo: SeoPagina, caminho: string, indexavel = true): Metadata {
  const title = texto(seo.titulo, tituloPadrao);
  const description = texto(seo.descricao, descricaoPadrao);
  const canonical = urlPagina(caminho);
  return {
    title,
    description,
    alternates: { canonical },
    robots: isHomolog || !indexavel ? { index: false, follow: !isHomolog } : { index: true, follow: true },
    openGraph: { title, description, url: canonical, type: "website", locale: "pt_BR" },
  };
}
