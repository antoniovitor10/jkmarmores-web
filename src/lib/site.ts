import type { Metadata } from "next";
import { isPendente } from "@/content/pendente";
import type { SeoPagina, Texto } from "@/lib/types";

export const siteUrl = "https://jkmarmores.com.br";
export const siteMode = process.env.SITE_MODE === "producao" ? "producao" : "homolog";
export const isHomolog = siteMode === "homolog";

export function texto(valor: Texto): string {
  return isPendente(valor) ? `Pendente: ${valor.descricao}` : valor;
}

export function urlPagina(caminho: string): string {
  return new URL(caminho.endsWith("/") ? caminho : `${caminho}/`, siteUrl).toString();
}

export function metadataPagina(seo: SeoPagina, caminho: string): Metadata {
  const title = texto(seo.titulo);
  const description = texto(seo.descricao);
  const canonical = urlPagina(caminho);
  return {
    title,
    description,
    alternates: { canonical },
    robots: isHomolog ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { title, description, url: canonical, type: "website", locale: "pt_BR" },
  };
}
