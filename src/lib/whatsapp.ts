import { isPendente } from "@/content/pendente";
import type { Texto } from "@/lib/types";

export function linkWhatsApp(mensagem: string, numero: Texto): string {
  const texto = encodeURIComponent(mensagem);
  if (isPendente(numero)) return `https://api.whatsapp.com/send?text=${texto}`;
  const digitos = numero.replace(/\D/g, "");
  return digitos ? `https://wa.me/${digitos}?text=${texto}` : `https://api.whatsapp.com/send?text=${texto}`;
}
