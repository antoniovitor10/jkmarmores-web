import type { AnchorHTMLAttributes } from "react";

// Navegacao nativa no export: evita prefetch de segmentos RSC ausentes no Windows.
export function SiteLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} />;
}
