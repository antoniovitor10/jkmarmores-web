import { isPendente } from "@/content/pendente";
import type { Texto } from "@/lib/types";

export function PendenteTexto({ valor }: { valor: Texto }) {
  if (!isPendente(valor)) return <>{valor}</>;
  return <span className="pendente" data-pendente={valor.descricao}>Pendente: {valor.descricao}</span>;
}
