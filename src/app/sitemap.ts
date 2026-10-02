import type { MetadataRoute } from "next";
import { conteudo } from "@/content";
import { isHomolog, urlPagina } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Aplicações e galeria só entram quando houver conteúdo confirmado.
  const fixas = isHomolog ? ["/", "/sobre/", "/materiais/", "/aplicacoes/", "/galeria/", "/contato/"] : ["/", "/sobre/", "/materiais/", "/contato/"];
  const materiais = conteudo.materiais.filter((item) => item.confirmado).map((item) => `/materiais/${item.slug}/`);
  const aplicacoes = conteudo.aplicacoes.filter((item) => item.confirmado).map((item) => `/aplicacoes/${item.slug}/`);
  return [...fixas, ...materiais, ...aplicacoes].map((caminho) => ({ url: urlPagina(caminho) }));
}
