import type { ImgHTMLAttributes } from "react";
import { preload } from "react-dom";
import manifest from "@/generated/images.json";
import { asset } from "@/lib/base-path";

type FotoProps = { id: string; mobileId?: string; alt: string; sizes: string; prioridade?: boolean; className?: string };
type Variante = { width: number; avif: string; webp: string };
type ImagemGerada = { width: number; height: number; placeholder: string; variantes: Variante[] };
const imagens = Object.fromEntries(Object.entries(manifest as Record<string, ImagemGerada>).map(([id, img]) => [id, { ...img, placeholder: asset(img.placeholder), variantes: img.variantes.map((v) => ({ ...v, avif: asset(v.avif), webp: asset(v.webp) })) }])) as Record<string, ImagemGerada>;

export function Foto({ id, mobileId, alt, sizes, prioridade = false, className }: FotoProps) {
  const imagem = imagens[id];
  if (!imagem) return null;
  const srcSet = (formato: "avif" | "webp") => imagem.variantes.map((item) => `${item[formato]} ${item.width}w`).join(", ");
  const ultima = imagem.variantes.at(-1);
  if (!ultima) return null;
  const mobile = mobileId ? imagens[mobileId] : undefined;
  if (prioridade) {
    preload(ultima.avif, { as: "image", type: "image/avif", imageSrcSet: srcSet("avif"), imageSizes: sizes, fetchPriority: "high", ...(mobileId ? { media: "(min-width: 701px)" } : {}) });
    if (mobile) preload(mobile.variantes.at(-1)!.avif, { as: "image", type: "image/avif", imageSrcSet: mobile.variantes.map(v => `${v.avif} ${v.width}w`).join(", "), imageSizes: "100vw", fetchPriority: "high", media: "(max-width: 700px)" });
  }
  const prioridadeAtributos: ImgHTMLAttributes<HTMLImageElement> = prioridade ? { fetchPriority: "high", loading: "eager" } : { loading: "lazy" };
  return <picture className={className}>
    {mobileId && imagens[mobileId] && <source media="(max-width: 700px)" type="image/avif" srcSet={imagens[mobileId].variantes.map(v => `${v.avif} ${v.width}w`).join(", ")} sizes="100vw" />}
    {mobileId && imagens[mobileId] && <source media="(max-width: 700px)" type="image/webp" srcSet={imagens[mobileId].variantes.map(v => `${v.webp} ${v.width}w`).join(", ")} sizes="100vw" />}
    <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
    <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
    <img src={ultima.webp} alt={alt} width={imagem.width} height={imagem.height} sizes={sizes} style={{ backgroundImage: `url(${imagem.placeholder})` }} {...prioridadeAtributos} />
  </picture>;
}
