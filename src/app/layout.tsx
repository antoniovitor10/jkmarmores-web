import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { conteudo } from "@/content";
import { isPendente } from "@/content/pendente";
import { isHomolog, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: { icon: "data:," },
  robots: isHomolog ? { index: false, follow: false } : { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const empresa = conteudo.empresa;
  const dadosEmpresa = !isPendente(empresa.nome) && !isPendente(empresa.telefone) && !isPendente(empresa.endereco) && !isPendente(empresa.cidade)
    ? { "@context": "https://schema.org", "@type": "HomeAndConstructionBusiness", name: empresa.nome, url: siteUrl, telephone: empresa.telefone, address: { "@type": "PostalAddress", streetAddress: empresa.endereco, addressLocality: empresa.cidade } }
    : null;
  return <html lang="pt-BR"><body>
    <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
    <SiteHeader />
    {children}
    <SiteFooter />
    <JsonLd dados={{ "@context": "https://schema.org", "@type": "WebSite", url: siteUrl }} />
    {dadosEmpresa && <JsonLd dados={dadosEmpresa} />}
  </body></html>;
}
