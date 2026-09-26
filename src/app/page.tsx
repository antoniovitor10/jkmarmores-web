import { conteudo } from "@/content";
import { PageView } from "@/components/PageView";
import { SceneSlot } from "@/components/SceneSlot";
import { HomeHero } from "@/components/HomeHero";
import { StoneJourney } from "@/components/StoneJourney";
import { metadataPagina } from "@/lib/site";

export const metadata = metadataPagina(conteudo.paginas.inicio.seo, "/");

export default function Inicio() {
  return <PageView pagina={conteudo.paginas.inicio} abertura={<><HomeHero /><StoneJourney /></>}><section aria-labelledby="explorar-titulo"><h2 id="explorar-titulo">Explore combinações de materiais</h2><SceneSlot mode="ambiente" materials={conteudo.materiais.filter((item) => item.confirmado)} quoteBase="Olá, gostaria de saber mais sobre uma combinação de material e acabamento." whatsapp={conteudo.empresa.whatsapp} /></section></PageView>;
}
