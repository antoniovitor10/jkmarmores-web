import { isPendente } from "@/content/pendente";
import type { Texto } from "@/lib/types";

export function PendenteTexto({ valor }: { valor: Texto }) {
  if (!isPendente(valor)) return <>{valor}</>;
  return <span className="pendente" data-pendente={valor.descricao} role="note" aria-label={`Informação a confirmar: ${valor.descricao}`}>A confirmar</span>;
}
