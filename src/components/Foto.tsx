import type { ImgHTMLAttributes } from "react";
import manifest from "@/generated/images.json";

type FotoProps = { id: string; alt: string; sizes: string; prioridade?: boolean; className?: string };
type Variante = { width: number; avif: string; webp: string };
type ImagemGerada = { width: number; height: number; placeholder: string; variantes: Variante[] };
const imagens = manifest as Record<string, ImagemGerada>;

export function Foto({ id, alt, sizes, prioridade = false, className }: FotoProps) {
  const imagem = imagens[id];
  if (!imagem) return null;
  const srcSet = (formato: "avif" | "webp") => imagem.variantes.map((item) => `${item[formato]} ${item.width}w`).join(", ");
  const ultima = imagem.variantes.at(-1);
  if (!ultima) return null;
  const prioridadeAtributos: ImgHTMLAttributes<HTMLImageElement> = prioridade ? { fetchPriority: "high", loading: "eager" } : { loading: "lazy" };
  return <picture className={className}>
    <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
    <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
    <img src={ultima.webp} alt={alt} width={imagem.width} height={imagem.height} sizes={sizes} style={{ backgroundImage: `url(${imagem.placeholder})` }} {...prioridadeAtributos} />
  </picture>;
}
