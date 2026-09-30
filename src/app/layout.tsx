import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter, MobileQuoteDock } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { SiteInteractions } from "@/components/SiteInteractions";
import { conteudo } from "@/content";
import { isPendente } from "@/content/pendente";
import { isHomolog, siteUrl } from "@/lib/site";
import "./globals.css";
import { homeDisplay, homeBody } from "@/components/home-fonts";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: { icon: "data:," },
  robots: isHomolog ? { index: false, follow: false } : { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#10100f' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const empresa = conteudo.empresa;
  const endereco = empresa.enderecoDetalhado;
  const address = endereco && [endereco.logradouro, endereco.numero, endereco.bairro, endereco.cidade, endereco.uf].every(item => typeof item === "string")
    ? { "@type": "PostalAddress", streetAddress: `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}`, addressLocality: endereco.cidade, addressRegion: endereco.uf, addressCountry: "BR" } : undefined;
  const dadosEmpresa = !isPendente(empresa.nome) && !isPendente(empresa.telefone) && !isPendente(empresa.endereco) && !isPendente(empresa.cidade)
    ? { "@context": "https://schema.org", "@type": "LocalBusiness", "@id": `${siteUrl}/#empresa`, name: empresa.nome, url: siteUrl, telephone: `+55${empresa.telefone.replace(/\D/g, "")}`, address }
    : null;
  return <html lang="pt-BR"><body className={`${homeDisplay.variable} ${homeBody.variable}`}>
    <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
    <SiteHeader />
    <MobileQuoteDock />
    <SiteInteractions />
    {children}
    <Suspense><SiteFooter /></Suspense>
    <JsonLd dados={{ "@context": "https://schema.org", "@type": "WebSite", url: siteUrl }} />
    {dadosEmpresa && <JsonLd dados={dadosEmpresa} />}
  </body></html>;
}
