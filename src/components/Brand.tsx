import { asset, assetSrcSet } from "@/lib/base-path";
import { conteudo } from '@/content';
import { texto } from '@/lib/site';

export function Brand({ footer = false }: { footer?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  if (!footer) return <img src={asset("/brand/jk-monograma-alfa-320.webp")} srcSet={assetSrcSet("/brand/jk-monograma-alfa-160.webp 160w, /brand/jk-monograma-alfa-320.webp 320w, /brand/jk-monograma-alfa-640.webp 640w")} sizes="72px" width={780} height={472} alt={texto(conteudo.empresa.nome)} className="brand-monogram" />;
  // Alfa derivado do JPEG original, preservando textura e contorno.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset("/brand/jk-logo-alfa-640.webp")} srcSet={assetSrcSet("/brand/jk-logo-alfa-320.webp 320w, /brand/jk-logo-alfa-640.webp 640w, /brand/jk-logo-alfa-1036.webp 1036w")} sizes="210px" width={1036} height={637} alt={texto(conteudo.empresa.nome)} className="brand-image" loading="lazy" />;
}
