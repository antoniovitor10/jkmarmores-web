import { isPendente } from "@/content/pendente";
import type { Texto } from "@/lib/types";
import { isHomolog } from "@/lib/site";

export function PendenteTexto({ valor }: { valor: Texto }) {
  if (!isPendente(valor)) return <>{valor}</>;
  if (!isHomolog) return null; // produção: nada provisório no HTML
  return <span className="pendente" data-pendente={valor.descricao} role="note" aria-label={`Informação a confirmar: ${valor.descricao}`}>A confirmar</span>;
}
