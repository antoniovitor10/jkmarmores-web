import type { MetadataRoute } from "next";
import { conteudo } from "@/content";
import { urlPagina } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixas = ["/", "/sobre/", "/materiais/", "/aplicacoes/", "/galeria/", "/contato/"];
  const materiais = conteudo.materiais.filter((item) => item.confirmado).map((item) => `/materiais/${item.slug}/`);
  const aplicacoes = conteudo.aplicacoes.filter((item) => item.confirmado).map((item) => `/aplicacoes/${item.slug}/`);
  return [...fixas, ...materiais, ...aplicacoes].map((caminho) => ({ url: urlPagina(caminho) }));
}
